import { prisma } from '../../db/prisma'
import { env } from '../../env'

export class OrdersService {
  async createOrder(userId: string, data: {
    items: { menuItemId: string; quantity: number; observation?: string }[]
    paymentMethod: 'PIX' | 'CARD' | 'CASH'
    address: string
    complement?: string
    observation?: string
  }) {
    const orderItems = await Promise.all(
      data.items.map(async (item) => {
        const menuItem = await prisma.menuItem.findUnique({
          where: { id: item.menuItemId },
        })

        if (!menuItem) {
          throw new Error(`Item não encontrado: ${item.menuItemId}`)
        }

        if (!menuItem.available) {
          throw new Error(`Item indisponível: ${menuItem.name}`)
        }

        return {
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: menuItem.price,
          observation: item.observation,
        }
      })
    )

    const subtotal = orderItems.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    )

    const deliveryFee = env.DELIVERY_FEE
    const total = subtotal + deliveryFee

    const order = await prisma.order.create({
      data: {
        userId,
        paymentMethod: data.paymentMethod,
        subtotal,
        deliveryFee,
        total,
        address: data.address,
        complement: data.complement,
        observation: data.observation,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    })

    return order
  }

  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    })
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    })

    if (!order) {
      throw new Error('Pedido não encontrado')
    }

    return order
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
    })

    if (!order) {
      throw new Error('Pedido não encontrado')
    }

    if (order.status !== 'PENDING') {
      throw new Error('Apenas pedidos pendentes podem ser cancelados')
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    })
  }
}

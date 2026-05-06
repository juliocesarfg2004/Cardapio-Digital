import { prisma } from '../../db/prisma'

export class AdminService {
  async getDashboard() {
    const totalOrders = await prisma.order.count()
    const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } })
    const deliveredOrders = await prisma.order.count({ where: { status: 'DELIVERED' } })
    const cancelledOrders = await prisma.order.count({ where: { status: 'CANCELLED' } })

    const revenue = await prisma.order.aggregate({
      where: { status: { in: ['DELIVERED', 'PREPARING', 'DELIVERING', 'CONFIRMED'] } },
      _sum: { total: true },
    })

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { menuItem: { select: { name: true } } } },
      },
    })

    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      revenue: Number(revenue._sum.total) || 0,
      recentOrders,
    }
  }

  async getAllOrders(status?: string) {
    return prisma.order.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { menuItem: { select: { name: true } } } },
      },
    })
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } })

    if (!order) {
      throw new Error('Pedido não encontrado')
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
    })
  }

  async createCategory(data: { name: string; slug: string; description?: string; order?: number }) {
    return prisma.category.create({ data })
  }

  async updateCategory(categoryId: string, data: { name?: string; slug?: string; description?: string; order?: number }) {
    return prisma.category.update({
      where: { id: categoryId },
      data,
    })
  }

  async deleteCategory(categoryId: string) {
    return prisma.category.delete({
      where: { id: categoryId },
    })
  }

  async createMenuItem(data: { name: string; slug: string; description?: string; price: number; image?: string; categoryId: string }) {
    return prisma.menuItem.create({
      data: { ...data, price: data.price },
    })
  }

  async updateMenuItem(menuItemId: string, data: { name?: string; slug?: string; description?: string; price?: number; image?: string; available?: boolean; categoryId?: string }) {
    const updateData: Record<string, any> = { ...data }
    if (data.price !== undefined) {
      updateData.price = data.price
    }

    return prisma.menuItem.update({
      where: { id: menuItemId },
      data: updateData,
    })
  }

  async deleteMenuItem(menuItemId: string) {
    return prisma.menuItem.delete({
      where: { id: menuItemId },
    })
  }

  async toggleMenuItemAvailability(menuItemId: string) {
    const item = await prisma.menuItem.findUnique({ where: { id: menuItemId } })

    if (!item) {
      throw new Error('Item não encontrado')
    }

    return prisma.menuItem.update({
      where: { id: menuItemId },
      data: { available: !item.available },
    })
  }
}

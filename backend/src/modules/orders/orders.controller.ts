import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { OrdersService } from './orders.service'

export class OrdersController {
  private service: OrdersService

  constructor() {
    this.service = new OrdersService()
  }

  createOrder = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.userId
      const body = request.body as {
        items: { menuItemId: string; quantity: number; observation?: string }[]
        paymentMethod: 'PIX' | 'CARD' | 'CASH'
        address: string
        complement?: string
        observation?: string
      }

      const order = await this.service.createOrder(userId, body)
      return reply.status(201).send(order)
    } catch (error) {
      if (error instanceof Error && (error.message.includes('não encontrado') || error.message.includes('indisponível'))) {
        return reply.status(400).send({ message: error.message })
      }
      throw error
    }
  }

  getUserOrders = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userId
    const orders = await this.service.getUserOrders(userId)
    return reply.send(orders)
  }

  getOrderById = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.userId
      const { id } = request.params as { id: string }
      const order = await this.service.getOrderById(id, userId)
      return reply.send(order)
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        return reply.status(404).send({ message: error.message })
      }
      throw error
    }
  }

  cancelOrder = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.userId
      const { id } = request.params as { id: string }
      const order = await this.service.cancelOrder(id, userId)
      return reply.send(order)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          return reply.status(404).send({ message: error.message })
        }
        if (error.message.includes('pendentes')) {
          return reply.status(400).send({ message: error.message })
        }
      }
      throw error
    }
  }
}

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { AdminService } from './admin.service'

export class AdminController {
  private service: AdminService

  constructor() {
    this.service = new AdminService()
  }

  getDashboard = async (_request: FastifyRequest, reply: FastifyReply) => {
    const dashboard = await this.service.getDashboard()
    return reply.send(dashboard)
  }

  getAllOrders = async (request: FastifyRequest, reply: FastifyReply) => {
    const { status } = request.query as { status?: string }
    const orders = await this.service.getAllOrders(status)
    return reply.send(orders)
  }

  updateOrderStatus = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      const { status } = request.body as { status: string }
      const order = await this.service.updateOrderStatus(id, status)
      return reply.send(order)
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        return reply.status(404).send({ message: error.message })
      }
      throw error
    }
  }

  createCategory = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as { name: string; slug: string; description?: string; order?: number }
    const category = await this.service.createCategory(data)
    return reply.status(201).send(category)
  }

  updateCategory = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const data = request.body as { name?: string; slug?: string; description?: string; order?: number }
    const category = await this.service.updateCategory(id, data)
    return reply.send(category)
  }

  deleteCategory = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    await this.service.deleteCategory(id)
    return reply.send({ message: 'Categoria removida com sucesso' })
  }

  createMenuItem = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = request.body as { name: string; slug: string; description?: string; price: number; image?: string; categoryId: string }
    const item = await this.service.createMenuItem(data)
    return reply.status(201).send(item)
  }

  updateMenuItem = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    const data = request.body as { name?: string; slug?: string; description?: string; price?: number; image?: string; available?: boolean; categoryId?: string }
    const item = await this.service.updateMenuItem(id, data)
    return reply.send(item)
  }

  deleteMenuItem = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string }
    await this.service.deleteMenuItem(id)
    return reply.send({ message: 'Item removido com sucesso' })
  }

  toggleMenuItemAvailability = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string }
      const item = await this.service.toggleMenuItemAvailability(id)
      return reply.send(item)
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        return reply.status(404).send({ message: error.message })
      }
      throw error
    }
  }
}

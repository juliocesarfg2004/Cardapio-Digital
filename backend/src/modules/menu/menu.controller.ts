import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { MenuService } from './menu.service'

export class MenuController {
  private service: MenuService

  constructor() {
    this.service = new MenuService()
  }

  getAllCategories = async (_request: FastifyRequest, reply: FastifyReply) => {
    const categories = await this.service.getAllCategories()
    return reply.send(categories)
  }

  getItemBySlug = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { slug } = request.params as { slug: string }
      const item = await this.service.getItemBySlug(slug)
      return reply.send(item)
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        return reply.status(404).send({ message: error.message })
      }
      throw error
    }
  }

  getItemsByCategory = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { slug } = request.params as { slug: string }
      const category = await this.service.getItemsByCategory(slug)
      return reply.send(category)
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        return reply.status(404).send({ message: error.message })
      }
      throw error
    }
  }
}

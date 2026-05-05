import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { UsersService } from './users.service'

export class UsersController {
  private service: UsersService

  constructor() {
    this.service = new UsersService()
  }

  getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.userId
      const profile = await this.service.getProfile(userId)
      return reply.send(profile)
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        return reply.status(404).send({ message: error.message })
      }
      throw error
    }
  }

  updateProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userId
    const { name, phone } = request.body as { name?: string; phone?: string }

    const updated = await this.service.updateProfile(userId, { name, phone })
    return reply.send(updated)
  }

  getAddresses = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userId
    const addresses = await this.service.getAddresses(userId)
    return reply.send(addresses)
  }

  createAddress = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userId
    const data = request.body as {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city?: string
      state?: string
      zipCode: string
      isDefault?: boolean
    }

    const address = await this.service.createAddress(userId, data)
    return reply.status(201).send(address)
  }

  updateAddress = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userId
    const { id } = request.params as { id: string }
    const data = request.body as {
      street?: string
      number?: string
      complement?: string
      neighborhood?: string
      city?: string
      state?: string
      zipCode?: string
      isDefault?: boolean
    }

    try {
      const address = await this.service.updateAddress(userId, id, data)
      return reply.send(address)
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        return reply.status(404).send({ message: error.message })
      }
      throw error
    }
  }

  deleteAddress = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userId
    const { id } = request.params as { id: string }

    try {
      const result = await this.service.deleteAddress(userId, id)
      return reply.send(result)
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        return reply.status(404).send({ message: error.message })
      }
      throw error
    }
  }
}

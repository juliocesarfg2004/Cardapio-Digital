import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { AuthService } from './auth.service'

export class AuthController {
  private service: AuthService

  constructor() {
    this.service = new AuthService()
  }

  register = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, email, password } = request.body as { name: string; email: string; password: string }

      const result = await this.service.register({ name, email, password })

      return reply.status(201).send(result)
    } catch (error) {
      if (error instanceof Error && error.message.includes('já cadastrado')) {
        return reply.status(409).send({ message: error.message })
      }
      throw error
    }
  }

  login = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = request.body as { email: string; password: string }

      const result = await this.service.login(email, password)

      return reply.send(result)
    } catch (error) {
      if (error instanceof Error && error.message.includes('inválidos')) {
        return reply.status(401).send({ message: error.message })
      }
      throw error
    }
  }

  refresh = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { refreshToken } = request.body as { refreshToken: string }

      const result = await this.service.refresh(refreshToken)

      return reply.send(result)
    } catch (error) {
      if (error instanceof Error && error.message.includes('inválido')) {
        return reply.status(401).send({ message: error.message })
      }
      throw error
    }
  }
}

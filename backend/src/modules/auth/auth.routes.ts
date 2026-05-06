import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AuthController } from './auth.controller'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const refreshSchema = z.object({
  refreshToken: z.string(),
})

export async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController()

  app.post('/register', {
    schema: {
      tags: ['Auth'],
      description: 'Registrar novo usuário',
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        409: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  }, async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body)
    if (!parsed.success) return (reply as any).status(400).send({ message: 'Dados inválidos', errors: parsed.error.errors })
    return controller.register({ ...request, body: parsed.data } as any, reply)
  })

  app.post('/login', {
    schema: {
      tags: ['Auth'],
      description: 'Autenticar usuário',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                email: { type: 'string' },
                role: { type: 'string' },
              },
            },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        401: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  }, async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body)
    if (!parsed.success) return (reply as any).status(400).send({ message: 'Dados inválidos', errors: parsed.error.errors })
    return controller.login({ ...request, body: parsed.data } as any, reply)
  })

  app.post('/refresh', {
    schema: {
      tags: ['Auth'],
      description: 'Renovar tokens JWT',
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        401: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  }, async (request, reply) => {
    const parsed = refreshSchema.safeParse(request.body)
    if (!parsed.success) return (reply as any).status(400).send({ message: 'Dados inválidos', errors: parsed.error.errors })
    return controller.refresh({ ...request, body: parsed.data } as any, reply)
  })
}

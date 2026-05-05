import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { UsersController } from './users.controller'
import { authenticate } from '../../shared/middleware/auth'

const addressSchema = z.object({
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(2),
  city: z.string().default('São Paulo'),
  state: z.string().default('SP'),
  zipCode: z.string().min(8),
  isDefault: z.boolean().default(false),
})

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
})

export async function usersRoutes(app: FastifyInstance) {
  const controller = new UsersController()

  app.get('/me', {
    onRequest: [authenticate],
    schema: {
      tags: ['Users'],
      description: 'Obter perfil do usuário logado',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            addresses: { type: 'array' },
          },
        },
      },
    },
  }, controller.getProfile)

  app.put('/me', {
    onRequest: [authenticate],
    schema: {
      tags: ['Users'],
      description: 'Atualizar perfil do usuário',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 },
          phone: { type: 'string', minLength: 10 },
        },
      },
    },
  }, async (request, reply) => {
    const parsed = updateProfileSchema.safeParse(request.body)
    if (!parsed.success) return (reply as any).status(400).send({ message: 'Dados inválidos', errors: parsed.error.errors })
    return controller.updateProfile({ ...request, body: parsed.data } as any, reply)
  })

  app.get('/me/addresses', {
    onRequest: [authenticate],
    schema: {
      tags: ['Users'],
      description: 'Listar endereços do usuário',
      security: [{ bearerAuth: [] }],
    },
  }, controller.getAddresses)

  app.post('/me/addresses', {
    onRequest: [authenticate],
    schema: {
      tags: ['Users'],
      description: 'Adicionar novo endereço',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['street', 'number', 'neighborhood', 'zipCode'],
        properties: {
          street: { type: 'string', minLength: 2 },
          number: { type: 'string', minLength: 1 },
          complement: { type: 'string' },
          neighborhood: { type: 'string', minLength: 2 },
          city: { type: 'string', default: 'São Paulo' },
          state: { type: 'string', default: 'SP' },
          zipCode: { type: 'string', minLength: 8 },
          isDefault: { type: 'boolean', default: false },
        },
      },
    },
  }, async (request, reply) => {
    const parsed = addressSchema.safeParse(request.body)
    if (!parsed.success) return (reply as any).status(400).send({ message: 'Dados inválidos', errors: parsed.error.errors })
    return controller.createAddress({ ...request, body: parsed.data } as any, reply)
  })

  app.put('/me/addresses/:id', {
    onRequest: [authenticate],
    schema: {
      tags: ['Users'],
      description: 'Atualizar endereço',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          number: { type: 'string' },
          complement: { type: 'string' },
          neighborhood: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          zipCode: { type: 'string' },
          isDefault: { type: 'boolean' },
        },
      },
    },
  }, async (request, reply) => {
    const parsed = addressSchema.partial().safeParse(request.body)
    if (!parsed.success) return (reply as any).status(400).send({ message: 'Dados inválidos', errors: parsed.error.errors })
    return controller.updateAddress({ ...request, body: parsed.data } as any, reply)
  })

  app.delete('/me/addresses/:id', {
    onRequest: [authenticate],
    schema: {
      tags: ['Users'],
      description: 'Remover endereço',
      security: [{ bearerAuth: [] }],
    },
  }, controller.deleteAddress)
}

import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AdminController } from './admin.controller'
import { authenticate, authorize } from '../../shared/middleware/auth'

const adminGuard = [authenticate, authorize('ADMIN')]

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  order: z.number().int().default(0),
})

const menuItemSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  image: z.string().optional(),
  categoryId: z.string().uuid(),
})

const updateMenuItemSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  image: z.string().optional(),
  available: z.boolean().optional(),
  categoryId: z.string().uuid().optional(),
})

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED']),
})

export async function adminRoutes(app: FastifyInstance) {
  const controller = new AdminController()

  app.get('/dashboard', {
    onRequest: adminGuard,
    schema: {
      tags: ['Admin'],
      description: 'Dashboard com métricas e pedidos recentes',
      security: [{ bearerAuth: [] }],
    },
  }, controller.getDashboard)

  app.get('/orders', {
    onRequest: adminGuard,
    schema: {
      tags: ['Admin'],
      description: 'Listar todos os pedidos com filtro por status',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'] },
        },
      },
    },
  }, controller.getAllOrders)

  app.patch('/orders/:id/status', {
    onRequest: adminGuard,
    schema: {
      tags: ['Admin'],
      description: 'Atualizar status de um pedido',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'] },
        },
      },
    },
  }, async (request, reply) => {
    const parsed = updateStatusSchema.safeParse(request.body)
    if (!parsed.success) return (reply as any).status(400).send({ message: 'Dados inválidos', errors: parsed.error.errors })
    return controller.updateOrderStatus({ ...request, body: parsed.data } as any, reply)
  })

  app.post('/categories', {
    onRequest: adminGuard,
    schema: {
      tags: ['Admin'],
      description: 'Criar nova categoria',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name', 'slug'],
        properties: {
          name: { type: 'string', minLength: 2 },
          slug: { type: 'string', minLength: 2 },
          description: { type: 'string' },
          order: { type: 'integer', default: 0 },
        },
      },
    },
  }, async (request, reply) => {
    const parsed = categorySchema.safeParse(request.body)
    if (!parsed.success) return (reply as any).status(400).send({ message: 'Dados inválidos', errors: parsed.error.errors })
    return controller.createCategory({ ...request, body: parsed.data } as any, reply)
  })

  app.put('/categories/:id', {
    onRequest: adminGuard,
    schema: {
      tags: ['Admin'],
      description: 'Editar categoria',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const parsed = categorySchema.partial().safeParse(request.body)
    if (!parsed.success) return (reply as any).status(400).send({ message: 'Dados inválidos', errors: parsed.error.errors })
    return controller.updateCategory({ ...request, body: parsed.data } as any, reply)
  })

  app.delete('/categories/:id', {
    onRequest: adminGuard,
    schema: {
      tags: ['Admin'],
      description: 'Remover categoria',
      security: [{ bearerAuth: [] }],
    },
  }, controller.deleteCategory)

  app.post('/items', {
    onRequest: adminGuard,
    schema: {
      tags: ['Admin'],
      description: 'Criar novo item do cardápio',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name', 'slug', 'price', 'categoryId'],
        properties: {
          name: { type: 'string', minLength: 2 },
          slug: { type: 'string', minLength: 2 },
          description: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          image: { type: 'string' },
          categoryId: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, async (request, reply) => {
    const parsed = menuItemSchema.safeParse(request.body)
    if (!parsed.success) return (reply as any).status(400).send({ message: 'Dados inválidos', errors: parsed.error.errors })
    return controller.createMenuItem({ ...request, body: parsed.data } as any, reply)
  })

  app.put('/items/:id', {
    onRequest: adminGuard,
    schema: {
      tags: ['Admin'],
      description: 'Editar item do cardápio',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const parsed = updateMenuItemSchema.safeParse(request.body)
    if (!parsed.success) return (reply as any).status(400).send({ message: 'Dados inválidos', errors: parsed.error.errors })
    return controller.updateMenuItem({ ...request, body: parsed.data } as any, reply)
  })

  app.delete('/items/:id', {
    onRequest: adminGuard,
    schema: {
      tags: ['Admin'],
      description: 'Remover item do cardápio',
      security: [{ bearerAuth: [] }],
    },
  }, controller.deleteMenuItem)

  app.patch('/items/:id/toggle', {
    onRequest: adminGuard,
    schema: {
      tags: ['Admin'],
      description: 'Alternar disponibilidade de um item',
      security: [{ bearerAuth: [] }],
    },
  }, controller.toggleMenuItemAvailability)
}

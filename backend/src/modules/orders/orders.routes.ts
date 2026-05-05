import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { OrdersController } from './orders.controller'
import { authenticate } from '../../shared/middleware/auth'

const createOrderSchema = z.object({
  items: z.array(z.object({
    menuItemId: z.string().uuid(),
    quantity: z.number().int().min(1),
    observation: z.string().max(100).optional(),
  })).min(1),
  paymentMethod: z.enum(['PIX', 'CARD', 'CASH']),
  address: z.string().min(5),
  complement: z.string().max(50).optional(),
  observation: z.string().max(200).optional(),
})

export async function ordersRoutes(app: FastifyInstance) {
  const controller = new OrdersController()

  app.post('/', {
    onRequest: [authenticate],
    schema: {
      tags: ['Orders'],
      description: 'Criar novo pedido',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['items', 'paymentMethod', 'address'],
        properties: {
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['menuItemId', 'quantity'],
              properties: {
                menuItemId: { type: 'string', format: 'uuid' },
                quantity: { type: 'integer', minimum: 1 },
                observation: { type: 'string', maxLength: 100 },
              },
            },
          },
          paymentMethod: { type: 'string', enum: ['PIX', 'CARD', 'CASH'] },
          address: { type: 'string', minLength: 5 },
          complement: { type: 'string', maxLength: 50 },
          observation: { type: 'string', maxLength: 200 },
        },
      },
    },
  }, async (request, reply) => {
    const parsed = createOrderSchema.safeParse(request.body)
    if (!parsed.success) return (reply as any).status(400).send({ message: 'Dados inválidos', errors: parsed.error.errors })
    return controller.createOrder({ ...request, body: parsed.data } as any, reply)
  })

  app.get('/', {
    onRequest: [authenticate],
    schema: {
      tags: ['Orders'],
      description: 'Listar meus pedidos',
      security: [{ bearerAuth: [] }],
    },
  }, controller.getUserOrders)

  app.get('/:id', {
    onRequest: [authenticate],
    schema: {
      tags: ['Orders'],
      description: 'Detalhes de um pedido',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string', format: 'uuid' } },
      },
    },
  }, controller.getOrderById)

  app.put('/:id/cancel', {
    onRequest: [authenticate],
    schema: {
      tags: ['Orders'],
      description: 'Cancelar pedido (apenas pendentes)',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string', format: 'uuid' } },
      },
    },
  }, controller.cancelOrder)
}

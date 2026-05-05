import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { env } from './env'
import { authRoutes } from './modules/auth/auth.routes'
import { menuRoutes } from './modules/menu/menu.routes'
import { usersRoutes } from './modules/users/users.routes'
import { ordersRoutes } from './modules/orders/orders.routes'
import { adminRoutes } from './modules/admin/admin.routes'

export async function createApp(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Delivery API',
        description: 'API para sistema de delivery com autenticação, cardápio, pedidos e painel admin.',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'Health', description: 'Health check' },
        { name: 'Auth', description: 'Autenticação e registro' },
        { name: 'Menu', description: 'Cardápio público' },
        { name: 'Users', description: 'Perfil e endereços do usuário' },
        { name: 'Orders', description: 'Pedidos do cliente' },
        { name: 'Admin', description: 'Painel administrativo (requer role ADMIN)' },
      ],
    },
  })

  await app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  })

  await app.register(cors, {
    origin: process.env.NODE_ENV === 'production'
      ? ['https://yourdomain.com']
      : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  app.register(authRoutes, { prefix: '/auth' })
  app.register(menuRoutes, { prefix: '/menu' })
  app.register(usersRoutes, { prefix: '/users' })
  app.register(ordersRoutes, { prefix: '/orders' })
  app.register(adminRoutes, { prefix: '/admin' })

  app.get('/health', {
    schema: {
      tags: ['Health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  }, async () => ({ status: 'ok', timestamp: new Date().toISOString() }))
}

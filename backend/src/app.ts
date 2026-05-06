import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { authRoutes } from './modules/auth/auth.routes'
import { menuRoutes } from './modules/menu/menu.routes'
import { usersRoutes } from './modules/users/users.routes'
import { ordersRoutes } from './modules/orders/orders.routes'
import { adminRoutes } from './modules/admin/admin.routes'

export async function createApp(app: FastifyInstance) {
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

  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))
}

import Fastify from 'fastify'
import cors from '@fastify/cors'
import { authRoutes } from '../src/modules/auth/auth.routes'
import { menuRoutes } from '../src/modules/menu/menu.routes'
import { usersRoutes } from '../src/modules/users/users.routes'
import { ordersRoutes } from '../src/modules/orders/orders.routes'
import { adminRoutes } from '../src/modules/admin/admin.routes'

const app = Fastify()

app.register(cors, {
  origin: '*',
  credentials: true,
})

app.register(authRoutes, { prefix: '/auth' })
app.register(menuRoutes, { prefix: '/menu' })
app.register(usersRoutes, { prefix: '/users' })
app.register(ordersRoutes, { prefix: '/orders' })
app.register(adminRoutes, { prefix: '/admin' })

app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

export default async function handler(req: any, res: any) {
  await app.ready()
  app.server?.emit('request', req, res)
}

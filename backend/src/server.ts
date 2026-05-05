import fastify from 'fastify'
import { createApp } from './app'
import { env } from './env'
import { prisma } from './db/prisma'

const app = fastify({ logger: true })

async function bootstrap() {
  await createApp(app)

  app.addHook('onClose', async () => {
    await prisma.$disconnect()
  })

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    console.log(`🚀 Server running on http://localhost:${env.PORT}`)
    console.log(`📊 Environment: ${env.NODE_ENV}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

bootstrap()

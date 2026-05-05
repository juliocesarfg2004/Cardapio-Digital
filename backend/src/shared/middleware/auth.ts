import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../../env'

interface JWTPayload {
  sub: string
  role: string
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return reply.status(401).send({ message: 'Token não fornecido' })
  }

  const [, token] = authHeader.split(' ')

  if (!token) {
    return reply.status(401).send({ message: 'Token inválido' })
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload

    request.userId = decoded.sub
    request.userRole = decoded.role

  } catch {
    return reply.status(401).send({ message: 'Token inválido ou expirado' })
  }
}

export function authorize(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!roles.includes(request.userRole)) {
      return reply.status(403).send({ message: 'Acesso negado' })
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    userId: string
    userRole: string
  }
}

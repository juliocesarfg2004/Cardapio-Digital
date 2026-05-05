import { prisma } from '../../db/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../../env'

export class AuthService {
  async register(data: { name: string; email: string; phone: string; password: string }) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone },
        ],
      },
    })

    if (existingUser) {
      throw new Error('E-mail ou telefone já cadastrado')
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    })

    const accessToken = this.generateAccessToken(user.id, user.role)
    const refreshToken = this.generateRefreshToken(user.id, user.role)

    return { user, accessToken, refreshToken }
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      throw new Error('E-mail ou senha inválidos')
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      throw new Error('E-mail ou senha inválidos')
    }

    const accessToken = this.generateAccessToken(user.id, user.role)
    const refreshToken = this.generateRefreshToken(user.id, user.role)

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string; role: string }

      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
      })

      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      const newAccessToken = this.generateAccessToken(user.id, user.role)
      const newRefreshToken = this.generateRefreshToken(user.id, user.role)

      return { accessToken: newAccessToken, refreshToken: newRefreshToken }
    } catch {
      throw new Error('Refresh token inválido ou expirado')
    }
  }

  private generateAccessToken(userId: string, role: string) {
    return jwt.sign({ sub: userId, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
  }

  private generateRefreshToken(userId: string, role: string) {
    return jwt.sign({ sub: userId, role }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN })
  }
}

import { prisma } from '../../db/prisma'

export class UsersService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        addresses: true,
      },
    })

    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    return user
  }

  async updateProfile(userId: string, data: { name?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    })
  }

  async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    })
  }

  async createAddress(userId: string, data: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city?: string
    state?: string
    zipCode: string
    isDefault?: boolean
  }) {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    return prisma.address.create({
      data: { ...data, userId },
    })
  }

  async updateAddress(userId: string, addressId: string, data: {
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
    isDefault?: boolean
  }) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    })

    if (!address) {
      throw new Error('Endereço não encontrado')
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    return prisma.address.update({
      where: { id: addressId },
      data,
    })
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    })

    if (!address) {
      throw new Error('Endereço não encontrado')
    }

    await prisma.address.delete({
      where: { id: addressId },
    })

    return { message: 'Endereço removido com sucesso' }
  }
}

import { prisma } from '../../db/prisma'

export class MenuService {
  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        items: {
          where: { available: true },
          orderBy: { name: 'asc' },
        },
      },
    })
  }

  async getItemBySlug(slug: string) {
    const item = await prisma.menuItem.findUnique({
      where: { slug },
      include: { category: true },
    })

    if (!item) {
      throw new Error('Item não encontrado')
    }

    return item
  }

  async getItemsByCategory(categorySlug: string) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        items: {
          where: { available: true },
          orderBy: { name: 'asc' },
        },
      },
    })

    if (!category) {
      throw new Error('Categoria não encontrada')
    }

    return category
  }
}

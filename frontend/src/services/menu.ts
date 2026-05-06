import { api } from '../lib/api/client'

export interface MenuItem {
  id: string
  name: string
  slug: string
  description: string | null
  price: string
  image: string | null
  available: boolean
  categoryId: string
}

export interface MenuCategory {
  id: string
  name: string
  slug: string
  description: string | null
  order: number
  items: MenuItem[]
}

export const menuService = {
  async getAllCategories(): Promise<MenuCategory[]> {
    const response = await api.get('/menu')
    return response.data
  },

  async getItemBySlug(slug: string): Promise<MenuItem> {
    const response = await api.get(`/menu/${slug}`)
    return response.data
  },

  async getItemsByCategory(slug: string): Promise<MenuCategory> {
    const response = await api.get(`/menu/category/${slug}`)
    return response.data
  },
}

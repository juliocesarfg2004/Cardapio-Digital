import { useQuery } from '@tanstack/react-query'
import { menuService } from '../services/menu'
import type { MenuCategory, MenuItem } from '../services/menu'

export type { MenuCategory, MenuItem }

export function useMenu() {
  return useQuery({
    queryKey: ['menu'],
    queryFn: () => menuService.getAllCategories(),
  })
}

export function useMenuItem(slug: string) {
  return useQuery({
    queryKey: ['menu-item', slug],
    queryFn: () => menuService.getItemBySlug(slug),
    enabled: !!slug,
  })
}

export function useMenuCategory(slug: string) {
  return useQuery({
    queryKey: ['menu-category', slug],
    queryFn: () => menuService.getItemsByCategory(slug),
    enabled: !!slug,
  })
}

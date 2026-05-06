import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  observation?: string
  pizzaType?: 'whole' | 'half-half'
  halfFlavor?: string
  isDrink?: boolean
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateObservation: (id: string, observation: string) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const baseId = item.pizzaType === 'half-half'
          ? `${item.id}-half-${item.halfFlavor}`
          : item.id

        const itemId = `${baseId}-${item.observation || ''}`

        const existingItem = get().items.find((i) => i.id === itemId)
        if (existingItem) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
            ),
          }))
        } else {
          set((state) => ({
            items: [...state.items, { ...item, id: itemId, quantity: 1 }],
          }))
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }))
      },

      updateObservation: (id, observation) => {
        const item = get().items.find((i) => i.id === id)
        if (!item) return

        const baseId = item.pizzaType === 'half-half'
          ? `${item.id.split('-half-')[0]}-half-${item.halfFlavor}`
          : id.replace(/-\w+$/, '')

        const newId = `${baseId}-${observation || ''}`

        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, observation, id: newId } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      totalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  observation?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    const existingItem = get().items.find((i) => i.id === item.id)
    if (existingItem) {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }))
    } else {
      set((state) => ({
        items: [...state.items, { ...item, quantity: 1 }],
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

  clearCart: () => set({ items: [] }),

  totalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  },

  totalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },
}))

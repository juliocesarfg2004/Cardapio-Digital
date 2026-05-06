import { api } from '../lib/api/client'

export interface OrderItem {
  id: string
  menuItemId: string
  quantity: number
  price: string
  observation?: string
  menuItem: {
    id: string
    name: string
  }
}

export interface Order {
  id: string
  userId: string
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED'
  paymentMethod: 'PIX' | 'CARD' | 'CASH'
  subtotal: string
  deliveryFee: string
  total: string
  address: string
  complement?: string
  observation?: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export interface CreateOrderData {
  items: {
    menuItemId: string
    quantity: number
    observation?: string
  }[]
  paymentMethod: 'PIX' | 'CARD' | 'CASH'
  address: string
  complement?: string
  observation?: string
}

export const orderService = {
  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await api.post('/orders', data)
    return response.data
  },

  async getMyOrders(): Promise<Order[]> {
    const response = await api.get('/orders')
    return response.data
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await api.put(`/orders/${id}/cancel`)
    return response.data
  },
}

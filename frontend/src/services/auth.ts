import { api } from '../lib/api/client'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'ADMIN'
  createdAt: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async logout() {
    localStorage.removeItem('@delivery:accessToken')
    localStorage.removeItem('@delivery:refreshToken')
    localStorage.removeItem('@delivery:user')
  },

  getStoredUser(): User | null {
    const user = localStorage.getItem('@delivery:user')
    return user ? JSON.parse(user) : null
  },

  getStoredToken(): string | null {
    return localStorage.getItem('@delivery:accessToken')
  },
}

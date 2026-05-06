import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { authService, type User } from '../services/auth'

interface AuthContextData {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = authService.getStoredUser()
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    localStorage.setItem('@delivery:accessToken', response.accessToken)
    localStorage.setItem('@delivery:refreshToken', response.refreshToken)
    localStorage.setItem('@delivery:user', JSON.stringify(response.user))
    setUser(response.user)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await authService.register({ name, email, password })
    localStorage.setItem('@delivery:accessToken', response.accessToken)
    localStorage.setItem('@delivery:refreshToken', response.refreshToken)
    localStorage.setItem('@delivery:user', JSON.stringify(response.user))
    setUser(response.user)
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

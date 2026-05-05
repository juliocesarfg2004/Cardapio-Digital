import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@delivery:accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('@delivery:refreshToken')

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })

          localStorage.setItem('@delivery:accessToken', data.accessToken)
          localStorage.setItem('@delivery:refreshToken', data.refreshToken)

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
          return api(originalRequest)
        } catch {
          localStorage.removeItem('@delivery:accessToken')
          localStorage.removeItem('@delivery:refreshToken')
          localStorage.removeItem('@delivery:user')
          window.location.href = '/login'
        }
      } else {
        localStorage.removeItem('@delivery:accessToken')
        localStorage.removeItem('@delivery:refreshToken')
        localStorage.removeItem('@delivery:user')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

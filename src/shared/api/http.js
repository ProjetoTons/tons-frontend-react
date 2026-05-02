import axios from 'axios'
import { env } from '@/shared/config/env'
import { getToken, clearSession } from '@/shared/api/authToken'

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// REQUEST: anexa Bearer quando existir token (e a rota não for pública)
http.interceptors.request.use((config) => {
  if (config.skipAuth) return config
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// RESPONSE: trata 401 globalmente (token expirado/inválido)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession()
      // evita loop se já estiver na tela de login
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

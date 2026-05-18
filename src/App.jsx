import { AppRouter } from './app/router/AppRouter'
import { clearSession } from '@/shared/api/authToken'

// Limpa sessão mock anterior (remover depois)
clearSession()

export default function App() {
  return <AppRouter />
}
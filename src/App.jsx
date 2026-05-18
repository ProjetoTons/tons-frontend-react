import { useEffect } from 'react'
import { AppRouter } from './app/router/AppRouter'
import { initMockUser } from '@/shared/api/authToken'

export default function App() {
  useEffect(() => {
    initMockUser()
  }, [])

  return <AppRouter />
}
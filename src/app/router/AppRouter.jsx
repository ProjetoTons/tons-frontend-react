import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PortfolioPage from '@/pages/portfolio/PortfolioPage'
import PedidosPage from '@/pages/pedidos/PedidosPage'
import LoginPage from '@/pages/login/LoginPage'
import RegisterClientPage from '@/pages/register/RegisterClientPage'
import RegisterEmployeePage from '@/pages/register/RegisterEmployeePage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/portfolio" replace />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/pedidos" element={<PedidosPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro/cliente" element={<RegisterClientPage />} />
        <Route path="/cadastro/funcionario" element={<RegisterEmployeePage />} />
      </Routes>
    </BrowserRouter>
  )
}

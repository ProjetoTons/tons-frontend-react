import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PortfolioPage from '@/pages/portfolio/PortfolioPage'
import PedidosPage from '@/pages/pedidos/PedidosPage'
import LoginPage from '@/pages/login/LoginPage'
import RegisterClientPage from '@/pages/register/RegisterClientPage'
import RegisterEmployeePage from '@/pages/register/RegisterEmployeePage'
import RegisterEnterprisePage from '@/pages/register/RegisterEnterprisePage'
import PageNotFind from '@/pages/Page-Not-Find/PageNotFind'
import RegistrationSuccessPage from '@/pages/register/RegisterSuccessPage'
import EmployeePage from '@/pages/employee/EmployeePage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pagina de erro */}
        <Route path="*" element={<PageNotFind/>} />
        {/* Pagina de portfolio */}
        <Route path="/" element={<Navigate to="/portfolio" replace />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        {/* Logins e cadastros*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro/cliente" element={<RegisterClientPage />} />
        <Route path="/cadastro/empresa" element={<RegisterEnterprisePage />} />
        <Route path="/cadastro/sucesso" element={<RegistrationSuccessPage/>}/>
        <Route path="/funcionario/cadastro" element={<RegisterEmployeePage />} />
        {/* Painel kanban */}
        <Route path="/pedidos" element={<PedidosPage />} />
        <Route path="/funcionario" element={<EmployeePage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

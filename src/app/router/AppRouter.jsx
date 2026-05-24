import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PortfolioPage from '@/pages/portfolio/PortfolioPage'
import PedidosPage from '@/pages/pedidos/PedidosPage'
import LoginPage from '@/pages/login/LoginPage'
import ForgotPasswordPage from '@/pages/login/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/login/ResetPasswordPage'
import RegisterClientPage from '@/pages/register/RegisterClientPage'
import RegisterEmployeePage from '@/pages/register/RegisterEmployeePage'
import RegisterEnterprisePage from '@/pages/register/RegisterEnterprisePage'
import PageNotFind from '@/pages/Page-Not-Find/PageNotFind'
import RegistrationSuccessPage from '@/pages/register/RegisterSuccessPage'
import EmployeePage from '@/pages/employee/EmployeePage'
import EmployeeEditPage from '@/pages/employee/EmployeeEditPage'
import GraficaRoute from '@/app/router/GraficaRoute'
import EmBrevePage from '@/pages/em-breve/EmBrevePage'
import ListaInteressePage from '@/pages/lista-interesse/ListaInteressePage'
import MeusPedidosPage from '@/pages/meus-pedidos/MeusPedidosPage'
import HistoricoPedidosPage from '@/pages/historico-pedidos/HistoricoPedidosPage'
import DashboardPedidosPage from '@/pages/dashboards/DashboardPedidosPage'
import ConfiguracoesPage from '@/pages/configuracoes/ConfiguracoesPage'

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
        <Route path="/login/esqueci-senha" element={<ForgotPasswordPage />} />
        <Route path="/login/reset-senha" element={<ResetPasswordPage />} />
        <Route path="/cadastro/cliente" element={<RegisterClientPage />} />
        <Route path="/cadastro/empresa" element={<RegisterEnterprisePage />} />
        <Route path="/cadastro/sucesso" element={<RegistrationSuccessPage/>}/>
        <Route path="/funcionario/cadastro" element={<RegisterEmployeePage />} />
        {/* Páginas do cliente */}
        <Route path="/lista-interesse" element={<ListaInteressePage />} />
        <Route path="/meus-pedidos" element={<MeusPedidosPage />} />
        <Route path="/historico-pedidos" element={<HistoricoPedidosPage />} />
        <Route path="/configuracoes" element={<ConfiguracoesPage />} />
        {/* Painel kanban — acesso restrito ao CNPJ da gráfica */}
        <Route path="/pedidos" element={<GraficaRoute><PedidosPage /></GraficaRoute>} />
        <Route path='/pedidos/dashboard' element={<GraficaRoute><DashboardPedidosPage/></GraficaRoute>}/>
        <Route path="/funcionario" element={<GraficaRoute><EmployeePage/></GraficaRoute>}/>
        <Route path='/funcionario/editar/:id' element={<GraficaRoute><EmployeeEditPage/></GraficaRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}

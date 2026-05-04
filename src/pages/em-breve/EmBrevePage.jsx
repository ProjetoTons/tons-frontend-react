import { Link, useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/lista-interesse': 'Lista de Interesse',
  '/meus-pedidos': 'Meus Pedidos',
  '/configuracoes': 'Configurações',
  '/login/esqueci-senha': 'Esqueci Minha Senha',
}

export default function EmBrevePage() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'Página'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5] px-6 text-center">
      <h1 className="text-3xl font-black uppercase tracking-wide text-black mb-4">
        {title}
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Esta funcionalidade estará disponível em breve.
      </p>
      <Link
        to="/portfolio"
        className="bg-black text-[#F7D708] font-bold text-sm tracking-[2px] uppercase px-6 py-3 hover:bg-gray-800 transition-colors"
      >
        Voltar para a Home
      </Link>
    </div>
  )
}

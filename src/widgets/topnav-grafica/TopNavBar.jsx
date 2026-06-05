import { useNavigate } from 'react-router-dom';
import { getUsuario } from "@/shared/api/authToken";
import './topnav.css';

const NAV_ROUTES = {
  portfolio: "/portfolio",
  pedidos: "/pedidos",
  funcionarios: "/funcionario",
  dashboard: "/pedidos/dashboard"
};

function TopNavBar({ onNavClick, currentPage = "pedidos" }) {
  const logoUrl = '/logo-tons/tons-logo.png';
  const navigate = useNavigate();

  // Busca as informações do usuário logado na sessão (Inicia com array vazio se nulo)
  const usuarioLogado = getUsuario() || { acessos: [] };
  
  // 👇 NOVA LÓGICA: Mapeia o array buscando se a role 'Adm' existe na lista de acessos 👇
  const isAdm = usuarioLogado.acessos?.some(acesso => acesso.role === 'Adm');

  const handleNav = (key) => {
    if (onNavClick) onNavClick(key);
    const route = NAV_ROUTES[key];
    if (route) navigate(route);
  };

  return (
    <nav className="bg-[#fcfcfc] border-b border-[#e4e2e2] px-4 lg:px-6 py-2 flex items-center justify-between gap-4 sticky top-0 z-50 h-[52px] lg:h-[60px] flex-shrink-0">

      <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 min-w-0">
        <button
          type="button"
          onClick={() => handleNav("portfolio")}
          className="w-[56px] lg:w-[72px] xl:w-[83px] flex-shrink-0 cursor-pointer bg-transparent border-0 p-0"
          aria-label="Ir para portfólio"
        >
          <img src={logoUrl} alt="Tons Logo" className="w-full h-full object-contain" />
        </button>

        <h1 className="hidden md:block font-[family-name:var(--fonte-space)] font-bold text-sm lg:text-base xl:text-[20px] text-[#161616] tracking-[-1px] uppercase truncate">
          Ton's personalizados
        </h1>
      </div>

      <div className="flex items-center gap-3 lg:gap-5 xl:gap-6 flex-wrap justify-end">
        <button
          onClick={() => handleNav("portfolio")}
          className={`font-['Inter:Medium',sans-serif] font-medium text-xs lg:text-sm xl:text-[16px] pb-[6px] transition-colors cursor-pointer ${
            currentPage === "portfolio" ? "text-[#161616] border-b-2 border-[#fdf210]" : "text-[#6b7280] hover:text-[#161616]"
          }`}
        >
          Portifólio
        </button>

        <button
          onClick={() => handleNav("pedidos")}
          className={`font-['Inter:Bold',sans-serif] font-bold text-xs lg:text-sm xl:text-[16px] pb-[6px] transition-colors ${
            currentPage === "pedidos" ? "text-[#161616] border-b-2 border-[#fdf210]" : "text-[#6b7280] hover:text-[#161616]"
          }`}
        >
          Gerenciamento Pedidos
        </button>

        {/* 👇 EXCLUSIVO ADM: Link do Dashboard 👇 */}
        {isAdm && (
          <button
            onClick={() => handleNav("dashboard")}
            className={`font-['Inter:Medium',sans-serif] font-medium text-xs lg:text-sm xl:text-[16px] pb-[6px] transition-colors cursor-pointer ${
              currentPage === "dashboard" ? "text-[#161616] border-b-2 border-[#fdf210]" : "text-[#6b7280] hover:text-[#161616]"
            }`}
          >
            Dashboard
          </button>
        )}

        {/* 👇 EXCLUSIVO ADM: Link de Funcionários 👇 */}
        {isAdm && (
          <button
            onClick={() => handleNav("funcionarios")}
            className={`font-['Inter:Medium',sans-serif] font-medium text-xs lg:text-sm xl:text-[16px] pb-[6px] transition-colors cursor-pointer ${
              currentPage === "funcionarios" ? "text-[#161616] border-b-2 border-[#fdf210]" : "text-[#6b7280] hover:text-[#161616]"
            }`}
          >
            Funcionários
          </button>
        )}
      </div>
    </nav>
  );
}

export default TopNavBar;
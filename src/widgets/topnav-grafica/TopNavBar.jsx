import { useNavigate } from 'react-router-dom'
import './topnav.css'

/**
 * TopNavBar - Barra de navegação superior
 *
 * Props:
 * - onNavClick: function (opcional) - callback adicional ao navegar
 * - currentPage: string - página atual para destacar
 */

const NAV_ROUTES = {
  portfolio: "/portfolio",
  funcionarios: "/funcionario",
};

function TopNavBar({ onNavClick, currentPage = "pedidos" }) {
  const logoUrl = '/logo-tons/tons-logo.png';
  const navigate = useNavigate();

  const handleNav = (key) => {
    if (onNavClick) onNavClick(key);
    const route = NAV_ROUTES[key];
    if (route) navigate(route);
  };

  return (
    <nav className="bg-[#fcfcfc] border-b border-[#e4e2e2] px-[24px] py-[15px] flex items-center justify-between sticky top-0 z-50 h-[64px]">
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-[32px]">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNav("portfolio")}
          className="w-[83px] flex-shrink-0 cursor-pointer bg-transparent border-0 p-0"
          aria-label="Ir para portfólio"
        >
          <img
            src={logoUrl}
            alt="Tons Logo"
            className="w-full h-full object-contain"
          />
        </button>

        {/* Brand Name */}
        <h1 className="font-[family-name:var(--fonte-space)] font-bold text-[20px] text-[#161616] tracking-[-1px] uppercase">
          Ton's personalizados
        </h1>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex items-center gap-[24px] mr-30">
        {/* Portfolio Link */}
        <button
          onClick={() => handleNav("portfolio")}
          className={`font-['Inter:Medium',sans-serif] font-medium text-[16px] pb-[8px] transition-colors cursor-pointer ${currentPage === "portfolio"
              ? "text-[#161616] border-b-2 border-[#fdf210]"
              : "text-[#6b7280] hover:text-[#161616]"
            }`}
        >
          Portifólio
        </button>

        {/* Gerenciamento Pedidos Link - Active */}
        <button
          onClick={() => onNavClick && onNavClick("pedidos")}
          className={`font-['Inter:Bold',sans-serif] font-bold text-[16px] pb-[10px] transition-colors ${currentPage === "pedidos"
              ? "text-[#161616] border-b-2 border-[#fdf210]"
              : "text-[#6b7280] hover:text-[#161616]"
            }`}
        >
          Gerenciamento Pedidos
        </button>

        {/* Funcionários Link */}
        <button
          onClick={() => handleNav("funcionarios")}
          className={`font-['Inter:Medium',sans-serif] font-medium text-[16px] pb-[8px] transition-colors cursor-pointer ${currentPage === "funcionarios"
              ? "text-[#161616] border-b-2 border-[#fdf210]"
              : "text-[#6b7280] hover:text-[#161616]"
            }`}
        >
          Funcionários
        </button>
      </div>
    </nav>
  );
}

export default TopNavBar;

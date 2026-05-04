import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearSession } from '@/shared/api/authToken';

export default function MobileMenu({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    onClose && onClose();
    navigate('/portfolio');
  };

  return (
    <>
      {/* Overlay - Suave */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[10000] transition-opacity duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Menu Lateral - Estilo Industrial Configurações */}
      <aside 
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[350px] bg-[#E0E0E0] z-[10001] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0 shadow-2xl" : "translate-x-full shadow-none"
        } flex flex-col`}
      >
        {/* Header do Menu */}
        <div className="p-8 pb-4">
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-black transition-colors">✕</button>
          <h3 className="mt-6 font-black text-lg tracking-wide text-black uppercase">Painel do Cliente</h3>
        </div>

        {/* Links de Navegação (Recuperados do seu código anterior) */}
        <nav className="flex flex-col px-8 mt-10 gap-8">
          
          {/* Link Lista de Interesse */}
          <div className="flex items-center justify-between group cursor-pointer border-b border-black/5 pb-2">
            <Link to="/lista-interesse" onClick={onClose} className="text-black text-sm font-bold tracking-widest transition-colors group-hover:text-[#F7D708]">
              LISTA DE INTERESSE
            </Link>
            <img className="w-5 h-5 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" src="/icons/clipboard.png" alt="" />
          </div>

          {/* Link Meus Pedidos */}
          <div className="flex items-center justify-between group cursor-pointer border-b border-black/5 pb-2">
            <Link to="/meus-pedidos" onClick={onClose} className="text-black text-sm font-bold tracking-widest transition-colors group-hover:text-[#F7D708]">
              MEUS PEDIDOS
            </Link>
            <img className="w-5 h-5 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" src="/icons/parcel.png" alt="" />
          </div>

           <div className="flex items-center justify-between group cursor-pointer border-b border-black/5 pb-2">
            <Link to="/configuracoes" onClick={onClose} className="text-black text-sm font-bold tracking-widest transition-colors group-hover:text-[#F7D708]">
              CONFIGURAÇÕES
            </Link>
            <img className="w-5 h-5 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" src="/icons/settings.png" alt="" />
          </div>

        </nav>

        {/* Área de Logout - Extrema parte inferior */}
        <div className="mt-auto p-8 bg-black/5">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[3px] mb-4 text-center">Sessão Ativa</p>
          
          {/* Botão de Logout Industrial - Sem arredondamento */}
          <button 
            onClick={handleLogout}
            className="w-full bg-black text-white py-4 font-black text-xs tracking-[4px] uppercase hover:bg-red-600 transition-colors duration-300 flex items-center justify-center gap-3 cursor-pointer"
            style={{ borderRadius: '0px' }} // Garante que não haja arredondamento
          >
            SAIR DA CONTA
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>

          <div className="mt-6 flex justify-center opacity-30">
            <img className="w-20 grayscale" src="/logo-tons/Logo Hefestos Nome.png" alt="" />
          </div>
        </div>
      </aside>
    </>
  );
}
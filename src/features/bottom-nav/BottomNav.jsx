import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUsuario } from '@/shared/api/authToken';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = getUsuario() || { acessos: [] };
  const isAdm = usuario.acessos?.some(a => a.role === 'Adm');

  const items = [
    { path: '/portfolio', label: 'PORTIFÓLIO', key: 'portfolio', icon: 'home' },
    { path: '/lista-interesse', label: 'LISTA DE INTERESSE', key: 'lista-interesse', icon: 'list' },
    { path: '/historico-pedidos', label: 'HISTÓRICO', key: 'historico', icon: 'clock' },
    { path: '/meus-pedidos', label: 'MEUS PEDIDOS', key: 'meus-pedidos', icon: 'bag' },
    { path: '/configuracoes', label: 'CONFIGURAÇÕES', key: 'ajustes', icon: 'settings' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  const Icon = ({ name }) => {
    const common = "w-5 h-5";
    switch (name) {
      case 'home':
        return (
          <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12l9-9 9 9" />
            <path d="M9 21V9h6v12" />
          </svg>
        );
      case 'bag':
        return (
          <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2l1.5 4h9L18 2" />
            <path d="M3 6h18v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        );
      case 'heart':
        return (
          <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.8 4.6c-1.9-1.8-5-1.8-6.9.1l-.9.9-.9-.9C9.9 2.7 6.8 2.7 4.9 4.6c-2.1 2.1-2.1 5.4 0 7.5l8 8 8-8c2.1-2.1 2.1-5.4 0-7.5z" />
          </svg>
        );
      case 'settings':
        return (
          <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.28 16.9l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.66 0 1.24-.4 1.51-1A1.65 1.65 0 0 0 3.6 6.1l-.06-.06A2 2 0 0 1 6.83 2.9l.06.06c.5.5 1.2.7 1.82.33.3-.17.62-.33.9-.33H10a2 2 0 0 1 4 0h.09c.66 0 1.24.4 1.51 1 .18.45.5.83.9 1.01.62.34 1.32.16 1.82-.33l.06-.06A2 2 0 0 1 21.72 7.1l-.06.06c-.5.5-.7 1.2-.33 1.82.17.3.33.62.33.9V10a2 2 0 0 1 0 4h-.09c-.66 0-1.24.4-1.51 1z" />
          </svg>
        );
      case 'list':
        return (
          <svg
            className={common}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 4h2.5A3.5 3.5 0 0 1 12 2.5 3.5 3.5 0 0 1 15.5 4H18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            <path d="M9 4h6v2H9z" />

            <path d="M8 10h.01" />
            <path d="M11 10h5" />

            <path d="M8 14h.01" />
            <path d="M11 14h5" />

            <path d="M8 18h.01" />
            <path d="M11 18h5" />
          </svg>
        );

      default:
        return null;
    }
  };
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-white border-t border-[#EDEDED]">
      <div className="max-w-3xl mx-auto flex">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => handleNavigate(item.path)}
            className={`flex-1 py-3 flex flex-col items-center justify-center text-[8px] ${isActive(item.path) ? 'text-black' : 'text-gray-600'} transition-colors`}
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            <div className={`p-1 rounded-full ${isActive(item.path) ? 'bg-[#F7D708]' : ''}`}>
              <Icon name={item.icon} />
            </div>
            <span className="mt-1 font-bold tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

import React from "react";

export default function LoadingOverlay({ isVisible = false, message = "Processando..." }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-2xl p-8 flex flex-col items-center gap-4">
        {/* Logo */}
        <img
          src="/logo-tons/Logo tons_Sem_Fundo.png"
          alt="Tons Logo"
          className="w-35 h-auto"
        />

        {/* Spinner Animado */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[#FFE300] border-r-[#FFE300] rounded-full animate-spin"></div>
        </div>

        {/* Texto */}
        <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
}

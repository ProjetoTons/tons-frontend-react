import React from "react";

/**
 * Modal de confirmação antes de redirecionar para o WhatsApp.
 * Inspirado no design "QUASE LÁ!" da Ton's Personalizados.
 */
export default function WhatsAppConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  contexto = "LISTA DE INTERESSE",
  totalItens = 0,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-[#FAF8F2] w-full max-w-[460px] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
        {/* Barra amarela no topo */}
        <div className="h-1 bg-[#F7D708]" />

        <div className="px-10 py-8">
          {/* Eyebrow: logo + breadcrumb */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <span className="text-[#F7D708] font-black text-sm leading-none">T</span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-black leading-tight">
              Ton's Personalizados / {contexto}
            </p>
          </div>

          {/* Título */}
          <h2
            className="text-[44px] leading-none font-black uppercase tracking-tight text-black"
            style={{ fontFamily: "var(--fonte-space)" }}
          >
            Quase lá!
          </h2>

          {/* Divisor amarelo curto */}
          <div className="w-14 h-[3px] bg-[#F7D708] mt-4 mb-6" />

          {/* Descrição */}
          <p className="text-[14px] text-gray-700 leading-relaxed mb-8">
            Sua seleção de {totalItens > 0 ? `${totalItens} ${totalItens === 1 ? "item" : "itens"}` : "itens"} será enviada para nossa equipe comercial via WhatsApp para o
            fechamento do orçamento personalizado. Você confirma o envio de todos os itens da lista?
          </p>

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full py-4 px-5 bg-[#F7D708] hover:brightness-95 text-black font-black text-[12px] tracking-[2px] uppercase transition-all flex items-center justify-between"
            >
              <span>Sim, enviar agora</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>

            <button
              onClick={onClose}
              className="w-full py-4 px-5 bg-transparent border border-black text-black font-bold text-[12px] tracking-[2px] uppercase hover:bg-black hover:text-white transition-colors"
            >
              Voltar para a lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

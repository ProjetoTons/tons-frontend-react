import React from "react";
import { formatarDataBR } from "@/shared/lib/dateFormatter";

export default function DetalhesPedidoModal({ isOpen, onClose, pedido }) {
  if (!isOpen || !pedido) return null;

  const isConcluido = pedido.status === "Concluído";

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-[#FAF8F2] w-full max-w-[520px] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Barra amarela no topo */}
        <div className="h-1 bg-[#F7D708]" />

        <div className="px-10 py-8">
          {/* Eyebrow: logo + breadcrumb */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <span className="text-[#F7D708] font-black text-sm leading-none">T</span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-black leading-tight">
              Ton's Personalizados / DETALHES DO PEDIDO
            </p>
          </div>

          {/* Título do pedido */}
          <h2
            className="text-[28px] leading-tight font-black uppercase tracking-tight text-black"
            style={{ fontFamily: "var(--fonte-space)" }}
          >
            {pedido.titulo}
          </h2>

          {/* Número do pedido */}
          <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mt-2">
            Pedido {pedido.id_pedido_display}
          </p>

          {/* Divisor amarelo curto */}
          <div className="w-14 h-[3px] bg-[#F7D708] mt-4 mb-6" />

          {/* Imagem do produto */}
          {pedido.image && (
            <div className="w-full h-[180px] bg-gray-100 mb-6 overflow-hidden">
              <img
                src={pedido.image}
                alt={pedido.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Descrição */}
          <p className="text-[13px] text-gray-700 leading-relaxed mb-6">
            {pedido.descricao}
          </p>

          {/* Informações em grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-200 bg-white p-4">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Status</span>
              <span className={`flex items-center gap-1.5 text-[12px] font-bold uppercase ${isConcluido ? "text-black" : "text-yellow-600"}`}>
                <span className={`w-2 h-2 rounded-full ${isConcluido ? "bg-green-500" : "bg-yellow-500"}`} />
                {pedido.status}
              </span>
            </div>
            <div className="border border-gray-200 bg-white p-4">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Data</span>
              <span className="text-[12px] font-bold text-black">{formatarDataBR(pedido.data)}</span>
            </div>
            <div className="border border-gray-200 bg-white p-4">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Quantidade</span>
              <span className="text-[12px] font-bold text-black">{pedido.quantidade}</span>
            </div>
            <div className="border border-gray-200 bg-white p-4">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Total</span>
              <span className="text-[15px] font-black text-black">{pedido.total}</span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onClose}
              className="w-full py-4 px-5 bg-[#F7D708] hover:brightness-95 text-black font-black text-[12px] tracking-[2px] uppercase transition-all flex items-center justify-center gap-3"
            >
              <span>Pedir Novamente</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </button>

            <button
              onClick={onClose}
              className="w-full py-4 px-5 bg-transparent border border-black text-black font-bold text-[12px] tracking-[2px] uppercase hover:bg-black hover:text-white transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

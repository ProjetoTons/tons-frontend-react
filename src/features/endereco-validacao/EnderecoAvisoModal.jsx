import React from "react";

/**
 * Modal 2 — Aviso de Consequências ao enviar sem endereço.
 * 
 * Exibido quando o usuário escolhe "Continuar sem endereço".
 * Informa que o orçamento será dificultado e dá a opção final
 * de enviar mesmo assim ou ir para configurações.
 */
export default function EnderecoAvisoModal({
  isOpen,
  onClose,
  onEnviarMesmoAssim,
  onIrConfiguracoes,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[20001] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-[#FAF8F2] w-full max-w-[480px] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
        {/* Barra vermelha no topo (aviso) */}
        <div className="h-1 bg-red-500" />

        <div className="px-10 py-8">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <span className="text-red-400 font-black text-sm leading-none">!</span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-black leading-tight">
              Ton's Personalizados / ATENÇÃO
            </p>
          </div>

          {/* Título */}
          <h2
            className="text-[28px] leading-none font-black uppercase tracking-tight text-black"
            style={{ fontFamily: "var(--fonte-space)" }}
          >
            Orçamento sem endereço
          </h2>

          <div className="w-14 h-[3px] bg-red-500 mt-4 mb-6" />

          {/* Explicação */}
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-[13px] text-red-800 leading-relaxed font-medium">
              Sem um endereço cadastrado, <strong>não será possível calcular automaticamente o valor do frete</strong> para sua entrega.
            </p>
            <p className="text-[12px] text-red-700 leading-relaxed mt-2">
              O orçamento será realizado sem estimativa de envio, o que pode atrasar o processo de cotação. Nossos consultores entrarão em contato para definir os custos de entrega manualmente.
            </p>
          </div>

          <p className="text-[12px] text-gray-500 leading-relaxed mb-6">
            Você pode adicionar seu endereço a qualquer momento nas configurações da sua conta.
          </p>

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onIrConfiguracoes}
              className="w-full py-4 px-5 bg-[#F7D708] hover:brightness-95 text-black font-black text-[12px] tracking-[2px] uppercase transition-all flex items-center justify-between"
            >
              <span>Adicionar endereço agora</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={onEnviarMesmoAssim}
              className="w-full py-4 px-5 bg-transparent border border-black text-black font-bold text-[12px] tracking-[2px] uppercase hover:bg-black hover:text-white transition-colors"
            >
              Enviar mesmo assim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

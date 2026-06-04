import React from "react";

/**
 * Modal 1 — Validação de Endereço.
 * 
 * Exibido ANTES do envio ao WhatsApp para verificar se o usuário tem endereço.
 * 
 * Cenários:
 * - TEM endereço: mostra o endereço e permite prosseguir ou ir para configurações alterar
 * - NÃO TEM endereço: explica a necessidade e pergunta se quer ir para configurações
 */
export default function EnderecoValidacaoModal({
  isOpen,
  onClose,
  onConfirm,
  onIrConfiguracoes,
  onEnviarSemEndereco,
  endereco = null,
}) {
  if (!isOpen) return null;

  const temEndereco = endereco && endereco.logradouro;

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-[#FAF8F2] w-full max-w-[500px] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
        {/* Barra amarela no topo */}
        <div className="h-1 bg-[#F7D708]" />

        <div className="px-10 py-8">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <span className="text-[#F7D708] font-black text-sm leading-none">T</span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-black leading-tight">
              Ton's Personalizados / ENDEREÇO DE ENTREGA
            </p>
          </div>

          {temEndereco ? (
            <>
              {/* TEM ENDEREÇO */}
              <h2
                className="text-[32px] leading-none font-black uppercase tracking-tight text-black"
                style={{ fontFamily: "var(--fonte-space)" }}
              >
                Endereço confirmado
              </h2>

              <div className="w-14 h-[3px] bg-[#F7D708] mt-4 mb-6" />

              <p className="text-[13px] text-gray-700 leading-relaxed mb-4">
                O endereço abaixo será usado para calcular o valor de envio da sua cotação.
                Caso prefira <strong>retirar na loja</strong>, não haverá impacto.
              </p>

              {/* Card do endereço */}
              <div className="bg-white border border-gray-200 p-5 mb-6">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                  Endereço cadastrado
                </span>
                <p className="text-[14px] font-bold text-black leading-relaxed">
                  {endereco.logradouro}{endereco.numero ? `, ${endereco.numero}` : ""}
                  {endereco.complemento ? ` — ${endereco.complemento}` : ""}
                </p>
                <p className="text-[13px] text-gray-600">
                  {endereco.bairro}{endereco.cidade ? ` — ${endereco.cidade}` : ""}
                  {endereco.estado ? `/${endereco.estado}` : ""}
                </p>
                {endereco.cep && (
                  <p className="text-[12px] text-gray-400 mt-1">CEP: {endereco.cep}</p>
                )}
              </div>

              {/* Botões */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={onConfirm}
                  className="w-full py-4 px-5 bg-[#F7D708] hover:brightness-95 text-black font-black text-[12px] tracking-[2px] uppercase transition-all flex items-center justify-between"
                >
                  <span>Prosseguir com este endereço</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={onIrConfiguracoes}
                  className="w-full py-4 px-5 bg-transparent border border-black text-black font-bold text-[12px] tracking-[2px] uppercase hover:bg-black hover:text-white transition-colors"
                >
                  Alterar endereço
                </button>
              </div>
            </>
          ) : (
            <>
              {/* NÃO TEM ENDEREÇO */}
              <h2
                className="text-[32px] leading-none font-black uppercase tracking-tight text-black"
                style={{ fontFamily: "var(--fonte-space)" }}
              >
                Endereço necessário
              </h2>

              <div className="w-14 h-[3px] bg-[#F7D708] mt-4 mb-6" />

              <p className="text-[13px] text-gray-700 leading-relaxed mb-2">
                Para que possamos calcular o <strong>valor de entrega</strong> do seu pedido,
                precisamos de um endereço cadastrado.
              </p>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
                Deseja ir até as configurações para adicionar seu endereço?
              </p>

              {/* Botões */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={onIrConfiguracoes}
                  className="w-full py-4 px-5 bg-[#F7D708] hover:brightness-95 text-black font-black text-[12px] tracking-[2px] uppercase transition-all flex items-center justify-between"
                >
                  <span>Ir para configurações</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={onEnviarSemEndereco}
                  className="w-full py-4 px-5 bg-transparent border border-black text-black font-bold text-[12px] tracking-[2px] uppercase hover:bg-black hover:text-white transition-colors"
                >
                  Continuar sem endereço
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

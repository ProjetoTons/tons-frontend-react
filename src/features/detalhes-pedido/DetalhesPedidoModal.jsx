import React from "react";
import { formatarDataBR } from "@/shared/lib/dateFormatter";
import { redirecionarWhatsApp } from "@/shared/lib/whatsapp";

export default function DetalhesPedidoModal({ isOpen, onClose, pedido, showPedirNovamente = true }) {
  if (!isOpen || !pedido) return null;

  const isConcluido = pedido.status === "Concluído";
  const isCancelado = pedido.status === "Cancelado";

  const handlePedirNovamente = () => {
    const itensTexto = (pedido.itens_pedido || []).map((item) => {
      const nome = item.produto?.nome || "Produto";
      const qtd = item.quantidade || 1;
      return `- ${nome} (x${qtd})`;
    }).join("\n");

    const mensagem = `Olá! Gostaria de pedir novamente o pedido ${pedido.id_pedido_display}.\n\nItens:\n${itensTexto}\n\nPodemos prosseguir?`;
    redirecionarWhatsApp(mensagem);
  };

  const totalQuantidade = pedido.itens_pedido?.reduce((acc, item) => acc + (item.quantidade || 0), 0) || pedido.quantidade || 0;

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="detalhes-pedido-title">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative bg-white w-full max-w-[580px] shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto rounded-sm">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between z-10">
          <div>
            <h2
              id="detalhes-pedido-title"
              className="text-[22px] font-black uppercase tracking-tight text-black"
              style={{ fontFamily: "var(--fonte-space)" }}
            >
              Pedido {pedido.id_pedido_display}
            </h2>
            <span className={`inline-flex items-center gap-1.5 mt-1 text-[11px] font-bold uppercase ${isCancelado ? "text-red-600" : isConcluido ? "text-green-700" : "text-yellow-600"}`}>
              <span className={`w-2 h-2 rounded-full ${isCancelado ? "bg-red-500" : isConcluido ? "bg-green-500" : "bg-yellow-500"}`} />
              {pedido.status}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="text-gray-400 hover:text-black transition-colors cursor-pointer bg-transparent border-0 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 py-6">
          {/* Imagem da arte */}
          {pedido.image && (
            <div className="w-full h-[200px] bg-gray-100 mb-6 overflow-hidden rounded-sm">
              <img
                src={pedido.image}
                alt="Arte do pedido"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Resumo do pedido */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#FAFAFA] border border-gray-100 p-4 text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1 font-bold">Data</span>
              <span className="text-[14px] font-bold text-black">{formatarDataBR(pedido.data)}</span>
            </div>
            <div className="bg-[#FAFAFA] border border-gray-100 p-4 text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1 font-bold">Itens</span>
              <span className="text-[14px] font-bold text-black">{totalQuantidade || "—"}</span>
            </div>
            <div className="bg-[#FAFAFA] border border-gray-100 p-4 text-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1 font-bold">Total</span>
              <span className="text-[16px] font-black text-black">{pedido.total}</span>
            </div>
          </div>

          {/* Descrição */}
          {pedido.descricao && (
            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Descrição do Pedido</h3>
              <p className="text-[13px] text-gray-700 leading-relaxed bg-[#FAFAFA] border border-gray-100 p-4">
                {pedido.descricao}
              </p>
            </div>
          )}

          {/* Itens do pedido - detalhado */}
          {pedido.itens_pedido && pedido.itens_pedido.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">Produtos do Pedido</h3>
              <div className="border border-gray-200 rounded-sm overflow-hidden">
                {/* Header da tabela */}
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Produto</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase text-center w-16">QTD</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase text-right w-20">Valor</span>
                </div>
                {/* Linhas */}
                {pedido.itens_pedido.map((item, idx) => {
                  const caract = item.caracteristicas_item_pedido || {};
                  const detalhes = [
                    caract.tamanho && `Tam: ${caract.tamanho}`,
                    caract.cor_estampa && `Cor: ${caract.cor_estampa}`,
                    caract.composicao && caract.composicao,
                  ].filter(Boolean).join(" • ");

                  return (
                    <div key={idx} className={`grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 items-center ${idx < pedido.itens_pedido.length - 1 ? "border-b border-gray-100" : ""}`}>
                      <div>
                        <span className="text-[13px] font-semibold text-black block">{item.produto?.nome || "Produto"}</span>
                        {detalhes && <span className="text-[11px] text-gray-500">{detalhes}</span>}
                      </div>
                      <span className="text-[13px] font-bold text-black text-center w-16">{item.quantidade || 1}</span>
                      <span className="text-[11px] text-gray-500 text-right w-20">
                        {item.valor_unitario ? `R$ ${Number(item.valor_unitario).toFixed(2)}` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Observação */}
          {pedido.observacao && (
            <div className="mb-6">
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Observação</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed bg-yellow-50 border-l-[3px] border-[#F7D708] p-4">
                {pedido.observacao}
              </p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            {showPedirNovamente && (
              <button
                onClick={handlePedirNovamente}
                className="flex-1 py-3.5 px-5 bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-[11px] tracking-[1px] uppercase transition-colors flex items-center justify-center gap-2 rounded-sm"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Pedir Novamente
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-3.5 px-5 bg-[#EFEFEF] text-gray-700 font-bold text-[11px] tracking-[1px] uppercase hover:bg-[#E0E0E0] transition-colors rounded-sm"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

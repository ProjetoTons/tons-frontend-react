import { useState } from "react";
import { mockHistoricoPedidos } from "@/entities/pedido/api/mockHistoricoPedidos";

const FILTROS = ["Todos", "Em Produção", "Finalizados"];

function StatusBadge({ status }) {
  const isProducao = status === "Em Produção";
  return (
    <span className={`flex items-center gap-1.5 text-[11px] font-bold uppercase ${isProducao ? "text-yellow-600" : "text-black"}`}>
      <span className={`w-2 h-2 rounded-full ${isProducao ? "bg-yellow-500" : "bg-black"}`} />
      {status}
    </span>
  );
}

export default function HistoricoPedidosWidget() {
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");

  const pedidosFiltrados = mockHistoricoPedidos.filter((pedido) => {
    if (filtroAtivo === "Todos") return true;
    if (filtroAtivo === "Em Produção") return pedido.status === "Em Produção";
    if (filtroAtivo === "Finalizados") return pedido.status === "Concluído";
    return true;
  });

  return (
    <div className="w-full">
      {/* Título */}
      <h1 className="text-[32px] font-bold uppercase tracking-tight text-black" style={{ fontFamily: "var(--fonte-space)" }}>
        Histórico de Pedidos
      </h1>
      <p className="text-sm text-gray-500 mb-6">Visualize seus pedidos</p>

      {/* Filtros */}
      <div className="flex justify-center gap-0 border-b border-gray-200 mb-8">
        {FILTROS.map((filtro) => (
          <button
            key={filtro}
            onClick={() => setFiltroAtivo(filtro)}
            className={`px-5 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              filtroAtivo === filtro
                ? "border-b-2 border-black text-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            {filtro}
          </button>
        ))}
      </div>

      {/* Lista de Pedidos */}
      <div className="flex flex-col gap-6 max-w-[900px] mx-auto">
        {pedidosFiltrados.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-10">Nenhum pedido encontrado.</p>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <div
              key={pedido.id_pedido}
              className="border border-gray-200 bg-white flex flex-wrap md:flex-nowrap"
            >
              {/* Imagem */}
              <div className="w-[160px] h-[160px] bg-gray-100 flex-shrink-0 overflow-hidden">
                <img
                  src={pedido.image || "/product/placeholder.png"}
                  alt={pedido.titulo}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 p-5 flex flex-col justify-center">
                <div className="flex flex-wrap items-start gap-x-8 gap-y-1 mb-3">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Pedido</span>
                    <span className="text-[12px] font-bold text-black">{pedido.id_pedido_display}</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-black uppercase flex-1 min-w-[150px]">
                    {pedido.titulo}
                  </h3>
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Data</span>
                    <span className="text-[12px] font-bold text-black">{pedido.data}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <StatusBadge status={pedido.status} />
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider">Quantidade</span>
                    <span className="text-[12px] font-bold text-black ml-2">{pedido.quantidade}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider">Total</span>
                    <span className="text-[14px] font-bold text-black ml-2">{pedido.total}</span>
                  </div>
                </div>
              </div>

              {/* Botões - quadrado cinza */}
              <div className="bg-[#F2F2F2] flex flex-col justify-center gap-3 p-6 min-w-[180px]">
                <button className="bg-[#F7D708] text-black text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-yellow-400 transition-colors cursor-pointer">
                  Pedir Novamente
                </button>
                <button className="border border-black bg-white text-black text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-black hover:text-white transition-colors cursor-pointer">
                  Detalhes
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { mockHistoricoPedidos } from "@/entities/pedido/api/mockHistoricoPedidos";
import DetalhesPedidoModal from "@/features/detalhes-pedido/DetalhesPedidoModal";


function StatusBadge({ status }) {
  const isProducao = status === "Em Produção";
  return (
    <span className={`flex items-center gap-1.5 text-[11px] font-bold uppercase ${isProducao ? "text-yellow-600" : "text-black"}`}>
      <span className={`w-2 h-2 rounded-full ${isProducao ? "bg-yellow-500" : "bg-green-500"}`} />
      {status}
    </span>
  );
}

export default function HistoricoPedidosWidget() {
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (pedido) => {
    setSelectedPedido(pedido);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
  };

  const pedidosFiltrados = mockHistoricoPedidos.filter((pedido) => pedido.status === "Concluído");

  return (
    <div className="w-full">
      {/* Título */}
      <h1 className="text-[48px] leading-none font-black uppercase tracking-tight text-black" style={{ fontFamily: "var(--fonte-space)" }}>
        Histórico de Pedidos
      </h1>

      {/* Subtítulo */}
      <div className="mt-3 mb-8">
        <p className="text-sm text-gray-500">Visualize seus pedidos</p>
      </div>

      {/* Lista de Pedidos */}
      <div className="flex flex-col gap-6">
        {pedidosFiltrados.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-10">Nenhum pedido encontrado.</p>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <div
              key={pedido.id_pedido}
              className="bg-white flex flex-wrap md:flex-nowrap"
            >
              {/* Imagem */}
              <div
                className="w-[160px] h-[160px] bg-gray-100 flex-shrink-0 overflow-hidden cursor-pointer group"
                onClick={() => handleOpenModal(pedido)}
              >
                <img
                  src={pedido.image || "/product/placeholder.png"}
                  alt={pedido.titulo}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 p-6 flex flex-col justify-between gap-6">
                {/* Linha superior: Pedido + Título + Data */}
                <div className="flex flex-wrap items-start gap-x-8 gap-y-2">
                  <span className="text-[11px] font-bold text-black uppercase tracking-wider">
                    <span className="text-gray-400 mr-1">Pedido</span>
                    {pedido.id_pedido_display}
                  </span>
                  <h3 className="text-[15px] font-bold text-black uppercase flex-1 min-w-[150px]">
                    {pedido.titulo}
                  </h3>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Data</span>
                    <span className="text-[13px] font-bold text-black">{pedido.data}</span>
                  </div>
                </div>

                {/* Linha inferior: Status, Quantidade, Total (labels acima) */}
                <div className="flex flex-wrap items-end gap-x-12 gap-y-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                    <StatusBadge status={pedido.status} />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Quantidade</span>
                    <span className="text-[13px] font-bold text-black">{pedido.quantidade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Total</span>
                    <span className="text-[15px] font-bold text-black">{pedido.total}</span>
                  </div>
                </div>
              </div>

              {/* Botões - quadrado cinza */}
              <div className="bg-[#E5E5E5] flex flex-col justify-center gap-3 p-6 min-w-[180px]">
                <button className="bg-[#F7D708] text-black text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-yellow-400 transition-colors cursor-pointer">
                  Pedir Novamente
                </button>
                <button
                  onClick={() => handleOpenModal(pedido)}
                  className="border border-black bg-white text-black text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  Detalhes
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <DetalhesPedidoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pedido={selectedPedido}
      />
    </div>
  );
}

import React, { useState } from "react";
import { mockPedidosCliente } from "@/entities/pedido/api/mockPedidosCliente";
import ProductModal from "@/features/modal-produto/modal-produto.jsx";

const ETAPAS = ["Arte", "Produção", "Embalagem", "Logística", "Entrega"];

function getEtapaIndex(etapa) {
  const map = {
    "Design": 0,
    "Arte": 0,
    "Produção": 1,
    "Embalagem": 2,
    "Logística": 3,
    "Entrega": 4,
    "Finalizados": 4,
  };
  return map[etapa] ?? 0;
}

function EtapaBadge({ etapa }) {
  const cores = {
    "Em Produção": "bg-[#F7D708] text-black",
    "Concluído": "bg-green-500 text-white",
    "Em Design": "bg-blue-500 text-white",
    "Em Logística": "bg-cyan-600 text-white",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 ${cores[etapa] || "bg-[#F7D708] text-black"}`}>
      {etapa}
    </span>
  );
}

function TimelineEtapas({ etapaAtual }) {
  const indexAtual = getEtapaIndex(etapaAtual);

  return (
    <div className="flex items-center mt-6">
      {ETAPAS.map((etapa, i) => (
        <React.Fragment key={etapa}>
          <div className="flex flex-col items-center">
            <div className={`rounded-full ${
              i <= indexAtual 
                ? "w-[12px] h-[12px] bg-[#F7D708]" 
                : "w-[10px] h-[10px] border-2 border-gray-300 bg-white"
            }`} />
            <span className={`text-[9px] uppercase tracking-wider mt-2 whitespace-nowrap ${
              i <= indexAtual ? "text-black font-bold" : "text-gray-400"
            }`}>
              {etapa}
            </span>
          </div>
          {i < ETAPAS.length - 1 && (
            <div className={`flex-1 h-[3px] mx-2 ${i < indexAtual ? "bg-[#F7D708]" : "bg-gray-200"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function MeusPedidosWidget() {
  const [busca, setBusca] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pedidos = mockPedidosCliente;

  const handleOpenModal = (pedido) => {
    setSelectedProduct({
      title: pedido.titulo,
      image: pedido.image,
      description: pedido.descricao,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const pedidosFiltrados = busca.trim()
    ? pedidos.filter(p =>
        p.id_pedido_display.toLowerCase().includes(busca.toLowerCase()) ||
        p.titulo.toLowerCase().includes(busca.toLowerCase())
      )
    : pedidos;

  return (
    <div className="w-full flex gap-10 flex-wrap lg:flex-nowrap">
      {/* Coluna Esquerda */}
      <section className="flex-1 min-w-0">
        <h1 className="text-[48px] leading-none font-black uppercase tracking-tight text-black" style={{ fontFamily: "var(--fonte-space)" }}>
          Meus Pedidos
        </h1>
        <p className="text-sm text-gray-600 mt-3 mb-8">
          Gestão centralizada de solicitações e logística industrial.
        </p>

        {pedidosFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {pedidosFiltrados.map((pedido) => (
              <div
                key={pedido.id_pedido}
                className="border border-gray-200 bg-white px-8 py-8 flex gap-8 flex-wrap md:flex-nowrap"
              >
                {/* Esquerda: Imagem + Info + Timeline */}
                <div className="flex-1 min-w-0 flex gap-8">
                  {/* Imagem */}
                  <div
                    className="w-[200px] h-[200px] bg-gray-100 flex-shrink-0 overflow-hidden cursor-pointer group"
                    onClick={() => handleOpenModal(pedido)}
                  >
                    <img
                      src={pedido.image || "/product/placeholder.png"}
                      alt={pedido.titulo}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Info + Timeline + ID */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between">
                      <div>
                        <EtapaBadge etapa={pedido.etapa_label} />
                        <h3 className="text-[18px] font-bold text-black uppercase mt-3 mb-1">
                          {pedido.titulo}
                        </h3>
                        <p className="text-[13px] text-gray-500">
                          {pedido.descricao}
                        </p>
                      </div>

                      {/* ID do Pedido */}
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">ID do Pedido</span>
                        <span className="text-[18px] font-bold text-black">{pedido.id_pedido_display}</span>
                      </div>
                    </div>

                    {/* Timeline - começa após a imagem, vai até antes do quadrado cinza */}
                    <TimelineEtapas etapaAtual={pedido.etapa_pedido} />
                  </div>
                </div>

                {/* Direita: Quadrado cinza */}
                <div className="bg-[#F2F2F2] p-5 flex flex-col gap-4 min-w-[200px]">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Responsável</span>
                    <span className="text-[14px] font-bold text-black uppercase">{pedido.responsavel}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Data de Início</span>
                    <span className="text-[14px] font-bold text-black">{pedido.data_inicio}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                      {pedido.concluido ? "Entregue em" : "Data Fim"}
                    </span>
                    <span className="text-[14px] font-bold text-black">{pedido.data_fim}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Coluna Direita: Busca */}
      <aside className="w-full lg:w-[280px] flex-shrink-0">
        <div className="sticky top-4">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-black mb-2">
            Localizar Pedido
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Insira o ID do Pedido"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-[#E5E5E5] border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--amarelo-base)]"
            />
            <img
              src="/icons/search.png"
              alt="Buscar"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
            />
          </div>

          <div className="mt-6">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-black mb-2">
              
            </h2>
          </div>
        </div>
      </aside>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        produto={selectedProduct}
      />
    </div>
  );
}

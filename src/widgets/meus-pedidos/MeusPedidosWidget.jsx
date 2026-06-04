import React, { useState, useEffect } from "react";
import { fetchMeusPedidos } from "@/entities/pedido/api/pedidosApi";
import DetalhesPedidoModal from "@/features/detalhes-pedido/DetalhesPedidoModal.jsx";

const ETAPAS = ["Arte", "Produção", "Embalagem", "Logística", "Entrega", "Concluído"];

function getEtapaIndex(etapa) {
  const map = {
    "Design": 0,
    "Arte": 0,
    "Produção": 1,
    "Embalagem": 2,
    "Logística": 3,
    "Entrega": 4,
    "Concluído": 5,
    "Finalizados": 5,
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
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;
    setLoading(true);
    fetchMeusPedidos()
      .then((data) => {
        if (ativo) setPedidos(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar meus pedidos:", err);
        if (ativo) setErro("Não foi possível carregar os pedidos.");
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    return () => { ativo = false; };
  }, []);

  const handleOpenModal = (pedido) => {
    setSelectedPedido({
      id_pedido_display: `#${pedido.num_pedido}`,
      titulo: pedido.descricao,
      image: pedido.url_foto_arte,
      descricao: pedido.descricao,
      status: pedido.etapa_pedido === "Concluído" ? "Concluído" : `Em ${pedido.etapa_pedido}`,
      data: pedido.data_pedido || "-",
      quantidade: pedido.quantidade || "-",
      total: pedido.total || "-",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
  };

  const pedidosFiltrados = busca.trim()
    ? pedidos.filter(p =>
        (p.num_pedido || "").toLowerCase().includes(busca.toLowerCase()) ||
        (p.descricao || "").toLowerCase().includes(busca.toLowerCase())
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

        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">Carregando pedidos...</p>
          </div>
        ) : erro ? (
          <div className="text-center py-16">
            <p className="text-red-500 text-sm">{erro}</p>
          </div>
        ) : pedidosFiltrados.length === 0 ? (
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
                      src={pedido.url_foto_arte || "/product/placeholder.png"}
                      alt={pedido.descricao}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Info + Timeline + ID */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between">
                      <div>
                        <EtapaBadge etapa={pedido.status ? `Em ${pedido.etapa_pedido}` : pedido.etapa_pedido} />
                        <h3 className="text-[18px] font-bold text-black uppercase mt-3 mb-1">
                          {pedido.descricao}
                        </h3>
                      </div>

                      {/* ID do Pedido */}
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">ID do Pedido</span>
                        <span className="text-[18px] font-bold text-black">#{pedido.num_pedido}</span>
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
                    <span className="text-[14px] font-bold text-black uppercase">{pedido.responsavel?.nome || "-"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Data de Início</span>
                    <span className="text-[14px] font-bold text-black">{pedido.data_pedido || "-"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Previsão</span>
                    <span className="text-[14px] font-bold text-black">{pedido.data_finalizacao || "-"}</span>
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

      <DetalhesPedidoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pedido={selectedPedido}
      />
    </div>
  );
}

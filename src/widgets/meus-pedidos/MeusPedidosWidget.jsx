import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/shared/api/authToken";
import { fetchMeusPedidos } from "@/entities/pedido/api/pedidosApi";
import DetalhesPedidoModal from "@/features/detalhes-pedido/DetalhesPedidoModal.jsx";
import { formatarDataBR } from "@/shared/lib/dateFormatter";

const ETAPAS = ["Design", "Produção", "Embalagem", "Envio", "Concluído"];

function getEtapaIndex(etapa) {
  const map = {
    "Design": 0,
    "Produção": 1,
    "Embalagem": 2,
    "Logística": 3,
    "Envio": 3,
    "Concluído": 4,
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

function TimelineEtapas({ etapaAtual, tipoEnvio }) {
  const indexAtual = getEtapaIndex(etapaAtual);

  // A penúltima bolinha mostra o tipo de envio real
  const etapasComEnvio = ETAPAS.map((etapa, i) => {
    if (i === 3) {
      // Posição "Envio": mostra tipo real se disponível
      if (tipoEnvio === "Entrega") return "Enviado";
      if (tipoEnvio === "Retirada") return "Retirada";
      return "Envio";
    }
    return etapa;
  });

  return (
    <div className="flex items-center mt-6">
      {etapasComEnvio.map((etapa, i) => (
        <React.Fragment key={i}>
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
          {i < etapasComEnvio.length - 1 && (
            <div className={`flex-1 h-[3px] mx-2 ${i < indexAtual ? "bg-[#F7D708]" : "bg-gray-200"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function MeusPedidosWidget() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Proteção: redirecionar se não estiver autenticado
  useEffect(() => {
    if (!getToken()) {
      navigate("/portfolio", { replace: true });
    }
  }, [navigate]);

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
      observacao: pedido.observacao || null,
      status: `Em ${pedido.etapa_pedido}`,
      data: pedido.data_pedido || "-",
      quantidade: pedido.itens_pedido?.reduce((acc, item) => acc + (item.quantidade || 0), 0) || "-",
      total: pedido.valor_total ? `R$ ${pedido.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "-",
      itens_pedido: pedido.itens_pedido || [],
      num_pedido: pedido.num_pedido,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
  };

  const pedidosFiltrados = (busca.trim()
    ? pedidos.filter(p =>
        (p.num_pedido || "").toLowerCase().includes(busca.toLowerCase()) ||
        (p.descricao || "").toLowerCase().includes(busca.toLowerCase())
      )
    : pedidos
  ).filter(p => p.etapa_pedido !== "Cancelados" && p.etapa_pedido !== "Cancelado" && p.etapa_pedido !== "Finalizados");

  return (
    <div className="w-full">
      {/* Header: Título + Busca na mesma linha */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[48px] leading-none font-black uppercase tracking-tight text-black" style={{ fontFamily: "var(--fonte-space)" }}>
            Meus Pedidos
          </h1>
          <p className="text-sm text-gray-600 mt-3">
            Gestão centralizada de solicitações e logística industrial.
          </p>
        </div>

        {/* Busca */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-black">
              Localizar Pedido
            </h2>
            <div className="group relative">
              <svg className="w-3.5 h-3.5 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute right-0 top-full mt-2 bg-[#161616] text-white text-[11px] rounded-lg px-3 py-2 w-[180px] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <p className="font-semibold mb-1">Busca por:</p>
                <ul className="space-y-0.5 list-disc list-inside">
                  <li>Nº do pedido</li>
                  <li>Descrição</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Insira o ID do Pedido"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-[280px] bg-[#E5E5E5] border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--amarelo-base)]"
            />
            <img
              src="/icons/search.png"
              alt="Buscar"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70"
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      <section>

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
                className="border border-gray-200 bg-white px-6 py-5 flex gap-6 flex-wrap md:flex-nowrap cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleOpenModal(pedido)}
              >
                {/* Esquerda: Imagem + Info + Timeline */}
                <div className="flex-1 min-w-0 flex gap-8">
                  {/* Imagem */}
                  <div className="w-[160px] self-stretch bg-gray-100 flex-shrink-0 overflow-hidden group">
                    {pedido.url_foto_arte ? (
                      <img
                        src={pedido.url_foto_arte}
                        alt={pedido.descricao}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info + Timeline + ID */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between">
                      <div>
                        <EtapaBadge etapa={pedido.status ? `Em ${pedido.etapa_pedido}` : pedido.etapa_pedido} />
                        <h3 className="text-[18px] font-bold text-black uppercase mt-3 mb-1">
                          {pedido.itens_pedido && pedido.itens_pedido.length > 0
                            ? pedido.itens_pedido.map((item) => item.produto?.nome || "Produto").join(", ")
                            : pedido.descricao || "—"}
                        </h3>
                      </div>

                      {/* ID do Pedido */}
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">ID do Pedido</span>
                        <span className="text-[18px] font-bold text-black">#{pedido.num_pedido}</span>
                      </div>
                    </div>

                    {/* Timeline - começa após a imagem, vai até antes do quadrado cinza */}
                    <TimelineEtapas etapaAtual={pedido.etapa_pedido} tipoEnvio={pedido.tipo_envio} />
                  </div>
                </div>

                {/* Direita: Quadrado cinza */}
                <div className="bg-[#F2F2F2] p-5 flex flex-col gap-4 min-w-[200px]" onClick={(e) => e.stopPropagation()}>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Responsável</span>
                    <span className="text-[14px] font-bold text-black uppercase">{pedido.responsavel?.nome || "-"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Data de Início</span>
                    <span className="text-[14px] font-bold text-black">{formatarDataBR(pedido.data_pedido)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Previsão</span>
                    <span className="text-[14px] font-bold text-black">{formatarDataBR(pedido.data_finalizacao)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <DetalhesPedidoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pedido={selectedPedido}
        showPedirNovamente={false}
      />
    </div>
  );
}

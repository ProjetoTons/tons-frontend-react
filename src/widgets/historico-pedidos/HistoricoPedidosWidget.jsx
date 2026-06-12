import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/shared/api/authToken";
import { fetchMeusPedidosHistorico, fetchMeusPedidos } from "@/entities/pedido/api/pedidosApi";
import DetalhesPedidoModal from "@/features/detalhes-pedido/DetalhesPedidoModal";
import { formatarDataBR } from "@/shared/lib/dateFormatter";
import { redirecionarWhatsApp } from "@/shared/lib/whatsapp";


function StatusBadge({ status }) {
  const isCancelado = status === "Cancelado";
  const isConcluido = status === "Concluído" || status === "Finalizados";
  return (
    <span className={`flex items-center gap-1.5 text-[11px] font-bold uppercase ${isCancelado ? "text-red-600" : isConcluido ? "text-black" : "text-yellow-600"}`}>
      <span className={`w-2 h-2 rounded-full ${isCancelado ? "bg-red-500" : isConcluido ? "bg-green-500" : "bg-yellow-500"}`} />
      {status}
    </span>
  );
}

export default function HistoricoPedidosWidget() {
  const navigate = useNavigate();
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState("Todos");

  // Proteção: redirecionar se não estiver autenticado
  useEffect(() => {
    if (!getToken()) {
      navigate("/portfolio", { replace: true });
    }
  }, [navigate]);

  const FILTROS = ["Todos", "Finalizados", "Cancelados"];

  useEffect(() => {
    let ativo = true;
    setLoading(true);
    Promise.all([fetchMeusPedidosHistorico(), fetchMeusPedidos()])
      .then(([historico, emAndamento]) => {
        if (!ativo) return;
        // Cancelados vêm do endpoint "em andamento" (etapa != Finalizado)
        const cancelados = emAndamento.filter(
          (p) => p.etapa_pedido === "Cancelado" || p.status === "cancelado"
        );
        setPedidos([...historico, ...cancelados]);
      })
      .catch((err) => {
        console.error("Erro ao buscar histórico de pedidos:", err);
        if (ativo) setErro("Não foi possível carregar o histórico.");
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
      status: pedido.etapa_pedido === "Cancelado" ? "Cancelado" : "Concluído",
      data: pedido.data_finalizacao || pedido.data_pedido || "-",
      quantidade: pedido.itens_pedido?.reduce((acc, item) => acc + (item.quantidade || 0), 0) || "-",
      total: pedido.valor_total ? `R$ ${pedido.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "-",
      itens_pedido: pedido.itens_pedido || [],
      num_pedido: pedido.num_pedido,
    });
    setIsModalOpen(true);
  };

  const handlePedirNovamente = (pedido) => {
    const itensTexto = (pedido.itens_pedido || []).map((item) => {
      const nome = item.produto?.nome || "Produto";
      const qtd = item.quantidade || 1;
      return `- ${nome} (x${qtd})`;
    }).join("\n");

    const mensagem = `Olá! Gostaria de pedir novamente o pedido #${pedido.num_pedido}.\n\nItens:\n${itensTexto}\n\nPodemos prosseguir?`;
    redirecionarWhatsApp(mensagem);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
  };

  const pedidosFiltrados = filtro === "Todos"
    ? pedidos
    : filtro === "Cancelados"
      ? pedidos.filter((p) => p.status === "cancelado" || p.etapa_pedido === "Cancelado")
      : pedidos.filter((p) => p.status !== "cancelado" && p.etapa_pedido !== "Cancelado");

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

      {/* Filtros */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-5 py-2 text-sm font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
              filtro === f
                ? "bg-[#F7D708] border-[#F7D708] text-black"
                : "bg-[#F2F2F2] border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lista de Pedidos */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <p className="text-gray-500 text-sm text-center py-10">Carregando...</p>
        ) : erro ? (
          <p className="text-red-500 text-sm text-center py-10">{erro}</p>
        ) : pedidosFiltrados.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-10">Nenhum pedido encontrado.</p>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <div
              key={pedido.id_pedido}
              className="bg-white flex flex-wrap md:flex-nowrap cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleOpenModal(pedido)}
            >
              {/* Imagem */}
              <div className="w-[160px] h-[160px] bg-gray-100 flex-shrink-0 overflow-hidden group">
                {pedido.url_foto_arte ? (
                  <img
                    src={pedido.url_foto_arte}
                    alt={pedido.descricao}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 p-6 flex flex-col justify-between gap-6">
                {/* Linha superior: Pedido + Produtos/Título + Data */}
                <div className="flex flex-wrap items-start gap-x-8 gap-y-2">
                  <span className="text-[11px] font-bold text-black uppercase tracking-wider">
                    <span className="text-gray-400 mr-1">Pedido</span>
                    #{pedido.num_pedido}
                  </span>
                  <h3 className="text-[15px] font-bold text-black uppercase flex-1 min-w-[150px]">
                    {pedido.itens_pedido && pedido.itens_pedido.length > 0
                      ? pedido.itens_pedido.map((item) => item.produto?.nome || "Produto").join(", ")
                      : pedido.descricao || "—"}
                  </h3>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Data</span>
                    <span className="text-[13px] font-bold text-black">{formatarDataBR(pedido.data_finalizacao || pedido.data_pedido)}</span>
                  </div>
                </div>

                {/* Linha inferior: Status, Quantidade, Total (labels acima) */}
                <div className="flex flex-wrap items-end gap-x-12 gap-y-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                    <StatusBadge status={pedido.etapa_pedido === "Cancelado" ? "Cancelado" : "Concluído"} />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Quantidade</span>
                    <span className="text-[13px] font-bold text-black">
                      {(() => {
                        const total = pedido.itens_pedido?.reduce((acc, item) => acc + (item.quantidade || 0), 0);
                        return total ? `${total} Unid.` : "—";
                      })()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Total</span>
                    <span className="text-[15px] font-bold text-black">
                      {pedido.valor_total ? `R$ ${pedido.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botões - quadrado cinza */}
              <div className="bg-[#E5E5E5] flex flex-col justify-center gap-3 p-6 min-w-[180px]" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handlePedirNovamente(pedido)}
                  className="bg-[#F7D708] text-black text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-yellow-400 transition-colors cursor-pointer"
                >
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

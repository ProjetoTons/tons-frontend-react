import { useState, useEffect } from "react";
import { fetchMeusPedidosHistorico } from "@/entities/pedido/api/pedidosApi";
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
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState("Todos");

  const FILTROS = ["Todos", "Finalizados", "Cancelados"];

  useEffect(() => {
    let ativo = true;
    setLoading(true);
    fetchMeusPedidosHistorico()
      .then((data) => {
        if (ativo) setPedidos(data);
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
      status: pedido.etapa_pedido === "Cancelado" ? "Cancelado" : "Concluído",
      data: pedido.data_finalizacao || pedido.data_pedido || "-",
      quantidade: pedido.itens_pedido?.reduce((acc, item) => acc + (item.quantidade || 0), 0) || "-",
      total: pedido.valor_total ? `R$ ${pedido.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "-",
    });
    setIsModalOpen(true);
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
              className="bg-white flex flex-wrap md:flex-nowrap"
            >
              {/* Imagem */}
              <div
                className="w-[160px] h-[160px] bg-gray-100 flex-shrink-0 overflow-hidden cursor-pointer group"
                onClick={() => handleOpenModal(pedido)}
              >
                <img
                  src={pedido.url_foto_arte || "/product/placeholder.png"}
                  alt={pedido.descricao}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 p-6 flex flex-col justify-between gap-6">
                {/* Linha superior: Pedido + Título + Data */}
                <div className="flex flex-wrap items-start gap-x-8 gap-y-2">
                  <span className="text-[11px] font-bold text-black uppercase tracking-wider">
                    <span className="text-gray-400 mr-1">Pedido</span>
                    #{pedido.num_pedido}
                  </span>
                  <h3 className="text-[15px] font-bold text-black uppercase flex-1 min-w-[150px]">
                    {pedido.descricao}
                  </h3>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Data</span>
                    <span className="text-[13px] font-bold text-black">{pedido.data_finalizacao || pedido.data_pedido}</span>
                  </div>
                </div>

                {/* Linha inferior: Status, Quantidade, Total (labels acima) */}
                <div className="flex flex-wrap items-end gap-x-12 gap-y-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                    <StatusBadge status="Concluído" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Quantidade</span>
                    <span className="text-[13px] font-bold text-black">
                      {pedido.itens_pedido?.reduce((acc, item) => acc + (item.quantidade || 0), 0) || "-"} Unid.
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

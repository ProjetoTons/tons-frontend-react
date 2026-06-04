import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import TopNavBar from "@/widgets/topnav-grafica/TopNavBar";
import PageHeader from "@/widgets/page-header/PageHeader";
import StatsGrid from "@/widgets/kpi-grid/StatsGrid";
import OrderTable from "@/widgets/order-table/OrderTable";
import CancelarPedidoModal from "@/features/cancelar-pedido/CancelarPedidoModal";
import { calcularEstatisticas } from "@/entities/pedido/api/mockPedidos";
import { fetchPedidos, updatePedido, cancelarPedido } from "@/entities/pedido/api/pedidosApi";
import { getUsuario } from "@/shared/api/authToken";

export default function PedidosPage() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState("pedidos");
  const [searchParams, setSearchParams] = useSearchParams();
  const etapaFilter = searchParams.get("etapa");
  const [filterConfig, setFilterConfig] = useState({ status: "", ordenarPor: "", direcao: "asc" });
  const [responsavelFilter, setResponsavelFilter] = useState("todos");

  // Usuário logado vindo da sessão (fallback para evitar crash em dev sem login)
  const usuarioLogado = getUsuario() || { id: null, nome: "Usuário" };

  // Carrega pedidos do backend no mount
  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro(null);
    fetchPedidos()
      .then((data) => {
        if (ativo) setPedidos(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar pedidos:", err);
        if (ativo) setErro("Não foi possível carregar os pedidos.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const pedidosFiltrados = useMemo(() => {
    let filtered = pedidos;

    // Filtrar por responsável ("meus" mostra apenas pedidos onde o usuário é responsável)
    if (responsavelFilter === "meus" && usuarioLogado.id) {
      filtered = filtered.filter(
        (pedido) => pedido.responsavel?.id === usuarioLogado.id
      );
    }

    // Filtrar por etapa
    if (etapaFilter) {
      filtered = filtered.filter((pedido) => pedido.etapa_pedido === etapaFilter);
    }

    // Filtrar por status (painel de filtro)
    if (filterConfig.status) {
      filtered = filtered.filter((pedido) => pedido.status === filterConfig.status);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((pedido) => {
        const num = pedido.num_pedido?.toLowerCase() || "";
        const cliente = pedido.cliente?.nome?.toLowerCase() || "";
        const vendedor = pedido.vendedor?.nome?.toLowerCase() || "";
        const responsavel = pedido.responsavel?.nome?.toLowerCase() || "";
        return (
          num.includes(term) ||
          cliente.includes(term) ||
          vendedor.includes(term) ||
          responsavel.includes(term)
        );
      });
    }

    // Ordenação
    if (filterConfig.ordenarPor) {
      const dir = filterConfig.direcao === "desc" ? -1 : 1;
      filtered = [...filtered].sort((a, b) => {
        let va = a[filterConfig.ordenarPor];
        let vb = b[filterConfig.ordenarPor];

        // Valores numéricos
        if (filterConfig.ordenarPor === "valor_total") {
          va = Number(va) || 0;
          vb = Number(vb) || 0;
          return (va - vb) * dir;
        }

        // Datas e strings
        va = va || "";
        vb = vb || "";
        return va.localeCompare(vb) * dir;
      });
    }

    return filtered;
  }, [pedidos, searchTerm, etapaFilter, filterConfig, responsavelFilter, usuarioLogado.id]);

  const stats = useMemo(() => calcularEstatisticas(pedidos), [pedidos]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilter = (config) => {
    if (config) setFilterConfig(config);
  };

  const handleEtapaFilter = (etapa) => {
    if (!etapa || etapaFilter === etapa) {
      // "Todos" ou clicar no mesmo botão limpa o filtro
      setSearchParams({});
    } else {
      // Define o novo filtro
      setSearchParams({ etapa });
    }
  };

  const handleNovoPedido = () => {
    navigate("/pedidos/novo");
  };

  const atualizarPedido = async (pedidoId, pedidoAtualizado) => {
    // Atualização otimista — UI reflete imediatamente
    setPedidos((prev) =>
      prev.map((p) => (p.id_pedido === pedidoId ? pedidoAtualizado : p))
    );
    try {
      const persistido = await updatePedido(pedidoId, pedidoAtualizado, usuarioLogado);
      // Sincroniza com a resposta do servidor (datas, IDs etc.)
      if (persistido) {
        setPedidos((prev) =>
          prev.map((p) => (p.id_pedido === pedidoId ? persistido : p))
        );
      }
    } catch (err) {
      console.error("Erro ao atualizar pedido:", err);
      // Reverte recarregando do servidor
      try {
        const dados = await fetchPedidos();
        setPedidos(dados);
      } catch (e) {
        console.error("Erro ao recarregar pedidos:", e);
      }
    }
  };

  const handleAvancar = (pedidoId, pedidoAtualizado) => {
    atualizarPedido(pedidoId, pedidoAtualizado);
  };

  const handleRetornar = (pedidoId, pedidoAtualizado) => {
    atualizarPedido(pedidoId, pedidoAtualizado);
  };

  const handleStatusChange = (pedidoId, pedidoAtualizado) => {
    atualizarPedido(pedidoId, pedidoAtualizado);
  };

  const handleCancelar = (pedidoId) => {
    const pedido = pedidos.find((p) => p.id_pedido === pedidoId);
    setCancelTarget({ id: pedidoId, numPedido: pedido?.num_pedido || "" });
  };

  const handleConfirmCancelar = async (motivo) => {
    if (!cancelTarget) return;
    try {
      await cancelarPedido(cancelTarget.id, motivo);
      // Remove da lista local após sucesso
      setPedidos((prev) => prev.filter((p) => p.id_pedido !== cancelTarget.id));
    } catch (err) {
      console.error("Erro ao cancelar pedido:", err);
    } finally {
      setCancelTarget(null);
    }
  };

  const [cancelTarget, setCancelTarget] = useState(null);

  const handleNavClick = (page) => {
    setCurrentPage(page);
    console.log("Navegando para:", page);
  };

  return (
    <div className="bg-[#f3f3f3] min-h-screen flex flex-col">
      <TopNavBar onNavClick={handleNavClick} currentPage={currentPage} />

      <main className="flex-1 px-[64px] py-[32px] flex flex-col gap-[32px]">
        <PageHeader
          onSearch={handleSearch}
          onFilter={handleFilter}
          onNovoPedido={handleNovoPedido}
          onEtapaFilter={handleEtapaFilter}
          etapaAtiva={etapaFilter}
          responsavelFilter={responsavelFilter}
          onResponsavelFilter={setResponsavelFilter}
        />


        {/* <StatsGrid stats={stats} /> */}


        <div className="bg-white rounded shadow-sm">
          {carregando ? (
            <div className="p-8 text-center text-[#5f5f5f]">
              Carregando pedidos...
            </div>
          ) : erro ? (
            <div className="p-8 text-center text-red-600">{erro}</div>
          ) : (
            <OrderTable
              pedidos={pedidosFiltrados}
              onAvancar={handleAvancar}
              onRetornar={handleRetornar}
              onStatusChange={handleStatusChange}
              onCancelar={handleCancelar}
              usuarioLogado={usuarioLogado}
            />
          )}
        </div>
      </main>

      <CancelarPedidoModal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancelar}
        numPedido={cancelTarget?.numPedido}
      />
    </div>
  );
}

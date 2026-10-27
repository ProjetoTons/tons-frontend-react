import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import TopNavBar from "@/widgets/topnav-grafica/TopNavBar";
import PageHeader from "@/widgets/page-header/PageHeader";
import OrderTable from "@/widgets/order-table/OrderTable";
import CancelarPedidoModal from "@/features/cancelar-pedido/CancelarPedidoModal";
import { fetchPedidos, updatePedido, cancelarPedido } from "@/entities/pedido/api/pedidosApi";
import { getUsuario } from "@/shared/api/authToken";
import { ROLE_TABS_ACCESS } from "@/shared/config/permissions";
import { useSweetAlert } from "@/shared/lib/hooks/sweetAlert";

export default function PedidosPage() {
  const navigate = useNavigate();
  const { warning, error: showError } = useSweetAlert();
  const [pedidos, setPedidos] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });
  const [pageSize, setPageSize] = useState(10);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState("pedidos");
  const [searchParams, setSearchParams] = useSearchParams();
  const etapaFilter = searchParams.get("etapa");
  const [filterConfig, setFilterConfig] = useState({ status: "", ordenarPor: "", direcao: "asc" });
  const [responsavelFilter, setResponsavelFilter] = useState("todos");
  const [cancelTarget, setCancelTarget] = useState(null);

  // 1. Extrai as roles dinamicamente do array de acessos
  const rawUser = getUsuario() || { id: null, nome: "Usuário", acessos: [] };
  const isAdmin = rawUser.acessos?.some(a => a.role === 'Adm');
  const userRoles = rawUser.acessos?.map(a => a.role) || [];
  const userRolesKey = userRoles.join(",");
  
  // Mantemos o "rolePrincipal" simulado para os componentes filhos não quebrarem
  const rolePrincipal = isAdmin ? 'Adm' : (userRoles[0] || "");
  const usuarioLogado = { 
    ...rawUser, 
    role: rolePrincipal,
    isAdmin
  };

  // 2. Agrega TODAS as etapas permitidas varrendo todos os cargos do funcionário
  const etapasPermitidas = useMemo(() => {
    if (isAdmin) return ROLE_TABS_ACCESS['Adm'] || [];
    
    let permissoesConsolidadas = [];
    (userRolesKey ? userRolesKey.split(",") : []).forEach(role => {
      const abasDesteCargo = ROLE_TABS_ACCESS[role] || [];
      // Faz a união dos arrays removendo possíveis duplicatas
      permissoesConsolidadas = [...new Set([...permissoesConsolidadas, ...abasDesteCargo])];
    });
    
    return permissoesConsolidadas;
  }, [isAdmin, userRolesKey]);

  const pageQueryKey = JSON.stringify([
    etapaFilter,
    filterConfig.status,
    filterConfig.ordenarPor,
    filterConfig.direcao,
    debouncedSearchTerm,
    responsavelFilter,
    pageSize,
  ]);
  const [pagination, setPagination] = useState({ queryKey: "", page: 0 });
  const page = pagination.queryKey === pageQueryKey ? pagination.page : 0;
  const setPage = useCallback((value) => {
    setPagination((previous) => ({
      queryKey: pageQueryKey,
      page: typeof value === "function" ? value(previous.queryKey === pageQueryKey ? previous.page : 0) : value,
    }));
  }, [pageQueryKey]);

  const carregarPedidos = useCallback(async (signal) => {
    setCarregando(true);
    setErro(null);
    try {
      const data = await fetchPedidos({
        page,
        size: pageSize,
        etapa: etapaFilter || undefined,
        status: filterConfig.status || undefined,
        busca: debouncedSearchTerm.trim() || undefined,
        responsavelId: responsavelFilter === "meus" ? usuarioLogado.id : undefined,
        somenteAtivos: !etapaFilter,
        sortBy: filterConfig.ordenarPor || undefined,
        sortDirection: filterConfig.direcao,
        signal,
      });
      if (signal?.aborted) return;
      if (data.totalPages > 0 && page >= data.totalPages) {
        setPage(data.totalPages - 1);
        return;
      }
      setPedidos(data.content);
      setPageInfo({
        page: data.number,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
      });
    } catch (err) {
      if (signal?.aborted) return;
      console.error("Erro ao buscar pedidos:", err);
      setErro("Não foi possível carregar os pedidos.");
    } finally {
      if (!signal?.aborted) setCarregando(false);
    }
  }, [
    page,
    pageSize,
    etapaFilter,
    filterConfig,
    debouncedSearchTerm,
    responsavelFilter,
    usuarioLogado.id,
    setPage,
  ]);

  // Busca novamente ao alterar etapa, filtros ou página e cancela chamadas obsoletas.
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => carregarPedidos(controller.signal), 0);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [carregarPedidos]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // 🔒 CONTROLADOR DE ACESSO INICIAL VIA URL (Dinâmico para Múltiplos Cargos)
  useEffect(() => {
    if (!isAdmin) {
      // Se o funcionário tem apenas UM cargo restrito, força ele a ficar sempre nessa aba
      if (etapasPermitidas.length === 1 && !etapaFilter) {
        setSearchParams({ etapa: etapasPermitidas[0] });
      }
      // Se o funcionário tentou forçar na URL uma aba que não está nas permissões consolidadas dele, limpa a busca
      else if (etapaFilter && !etapasPermitidas.includes(etapaFilter)) {
        setSearchParams({});
      }
    }
  }, [etapaFilter, isAdmin, etapasPermitidas, setSearchParams]);

  const pedidosFiltrados = useMemo(() => {
    let filtered = pedidos;

    // 🔒 BARREIRA DE SEGURANÇA VISUAL (FILTRO COMPORTAMENTAL MULTI-CARGO)
    if (!isAdmin) {
      filtered = filtered.filter((pedido) => etapasPermitidas.includes(pedido.etapa_pedido));
    }

    // Mantém a etapa como proteção visual adicional ao filtro do servidor.
    if (etapaFilter) {
      filtered = filtered.filter((pedido) => pedido.etapa_pedido === etapaFilter);
    }

    return filtered;
  }, [pedidos, etapaFilter, isAdmin, etapasPermitidas]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleFilter = (config) => {
    if (config) {
      setFilterConfig(config);
      setPage(0);
    }
  };

  const handleEtapaFilter = (etapa) => {
    // Funcionários com acesso a apenas 1 etapa não podem desmarcá-la
    if (!isAdmin && etapasPermitidas.length <= 1) {
      if (!etapa) return;
    }

    setPage(0);
    if (!etapa || etapaFilter === etapa) {
      // Permite limpar o filtro ("Todos") se for ADM ou tiver Múltiplos Cargos
      if (isAdmin || etapasPermitidas.length > 1) {
        setSearchParams({});
      }
    } else {
      setSearchParams({ etapa });
    }
  };

  const handleResponsavelFilter = (value) => {
    setResponsavelFilter(value);
    setPage(0);
  };

  const handleNovoPedido = () => {
    navigate("/pedidos/novo");
  };

  const atualizarPedido = async (pedidoId, pedidoAtualizado) => {
    try {
      await updatePedido(pedidoId, pedidoAtualizado, usuarioLogado);
      await carregarPedidos();
    } catch (err) {
      console.error("Erro ao atualizar pedido:", err);
      showError("Erro ao atualizar", "Não foi possível atualizar o pedido. Tente novamente.");
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
      await carregarPedidos();
    } catch (err) {
      console.error("Erro ao cancelar pedido:", err);
      const mensagem = err?.response?.data?.message || err?.message || "";
      if (mensagem.includes("já está cancelado")) {
        warning("Pedido já cancelado", "Este pedido já foi cancelado anteriormente.");
        carregarPedidos();
      } else {
        showError("Erro ao cancelar", "Não foi possível cancelar o pedido. Tente novamente.");
      }
    } finally {
      setCancelTarget(null);
    }
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    console.log("Navegando para:", page);
  };

  return (
    <div className="bg-[#f3f3f3] min-h-screen flex flex-col">
      <TopNavBar onNavClick={handleNavClick} currentPage={currentPage} />

      <main className="flex-1 px-4 lg:px-[64px] py-[32px] flex flex-col gap-[32px]">
        {/* Passando isAdmin para simplificar o uso no cabeçalho */}
        <PageHeader
          onSearch={handleSearch}
          onFilter={handleFilter}
          onNovoPedido={handleNovoPedido}
          onEtapaFilter={handleEtapaFilter}
          etapaAtiva={etapaFilter}
          responsavelFilter={responsavelFilter}
          onResponsavelFilter={handleResponsavelFilter}
          etapasPermitidas={etapasPermitidas}
          isAdmin={isAdmin}
        />

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
              onTriangleChange={handleStatusChange}
              onCancelar={isAdmin ? handleCancelar : undefined}
              usuarioLogado={usuarioLogado}
            />
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-[#5f5f5f]">
          <span>
            {pageInfo.totalElements === 0
              ? "Nenhum pedido"
              : `Mostrando ${pageInfo.page * pageInfo.size + 1}–${Math.min(
                  (pageInfo.page + 1) * pageInfo.size,
                  pageInfo.totalElements
                )} de ${pageInfo.totalElements} pedidos`}
          </span>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <label className="flex items-center gap-2">
              Itens por página
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(0);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                disabled={pageInfo.page <= 0 || carregando}
                className="border border-gray-300 rounded px-3 py-1 disabled:opacity-50"
                aria-label="Página anterior"
              >
                Anterior
              </button>
              <span className="whitespace-nowrap">
                Página {pageInfo.totalPages === 0 ? 0 : pageInfo.page + 1} de {pageInfo.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={pageInfo.page + 1 >= pageInfo.totalPages || carregando}
                className="border border-gray-300 rounded px-3 py-1 disabled:opacity-50"
                aria-label="Próxima página"
              >
                Próxima
              </button>
            </div>
          </div>
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
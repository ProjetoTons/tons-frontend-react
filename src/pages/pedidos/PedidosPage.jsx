import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TopNavBar from "@/widgets/topnav-grafica/TopNavBar";
import PageHeader from "@/widgets/page-header/PageHeader";
import StatsGrid from "@/widgets/kpi-grid/StatsGrid";
import OrderTable from "@/widgets/order-table/OrderTable";
import { calcularEstatisticas } from "@/entities/pedido/api/mockPedidos";
import { fetchPedidos, updatePedido } from "@/entities/pedido/api/pedidosApi";
import { getUsuario } from "@/shared/api/authToken";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState("pedidos");
  const [searchParams, setSearchParams] = useSearchParams();
  const etapaFilter = searchParams.get("etapa");

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

    // Filtrar por etapa
    if (etapaFilter) {
      filtered = filtered.filter((pedido) => pedido.etapa_pedido === etapaFilter);
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

    return filtered;
  }, [pedidos, searchTerm, etapaFilter]);

  const stats = useMemo(() => calcularEstatisticas(pedidos), [pedidos]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilter = () => {
    console.log("Filtro clicado");
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
    console.log("Novo pedido clicado");
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
              usuarioLogado={usuarioLogado}
            />
          )}
        </div>
      </main>
    </div>
  );
}

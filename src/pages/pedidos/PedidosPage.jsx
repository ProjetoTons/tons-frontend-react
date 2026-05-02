import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import TopNavBar from "@/widgets/topnav-grafica/TopNavBar";
import PageHeader from "@/widgets/page-header/PageHeader";
import StatsGrid from "@/widgets/kpi-grid/StatsGrid";
import OrderTable from "@/widgets/order-table/OrderTable";
import { mockPedidos, calcularEstatisticas } from "@/entities/pedido/api/mockPedidos";

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState("pedidos");
  const [searchParams, setSearchParams] = useSearchParams();
  const etapaFilter = searchParams.get("etapa");

  // Usuário logado (simulado - em produção viria de um contexto de autenticação)
  const usuarioLogado = {
    id: 1,
    nome: "Gustavo",
  };

  const pedidosFiltrados = useMemo(() => {
    let filtered = mockPedidos;

    // Filtrar por etapa
    if (etapaFilter) {
      filtered = filtered.filter((pedido) => pedido.etapa_pedido === etapaFilter);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (pedido) =>
          pedido.num_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pedido.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pedido.vendedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pedido.responsavel.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, etapaFilter]);

  const stats = useMemo(() => calcularEstatisticas(mockPedidos), []);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilter = () => {
    console.log("Filtro clicado");
  };

  const handleEtapaFilter = (etapa) => {
    if (etapaFilter === etapa) {
      // Remove o filtro se clicar no mesmo botão
      setSearchParams({});
    } else {
      // Define o novo filtro
      setSearchParams({ etapa });
    }
  };

  const handleNovoPedido = () => {
    console.log("Novo pedido clicado");
  };

  const handleAvancar = (pedidoId, pedidoAtualizado) => {
    console.log("Avançar pedido:", pedidoId, pedidoAtualizado);
    // Aqui você atualizaria o estado ou faria uma requisição à API
  };

  const handleRetornar = (pedidoId, pedidoAtualizado) => {
    console.log("Retornar pedido:", pedidoId, pedidoAtualizado);
    // Aqui você atualizaria o estado ou faria uma requisição à API
  };

  const handleStatusChange = (pedidoId, pedidoAtualizado) => {
    console.log("Status alterado:", pedidoId, pedidoAtualizado);
    // Aqui você atualizaria o estado ou faria uma requisição à API
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

        <div>
          <StatsGrid stats={stats} />
        </div>

        <div className="bg-white rounded shadow-sm">
          <OrderTable
            pedidos={pedidosFiltrados}
            onAvancar={handleAvancar}
            onRetornar={handleRetornar}
            onStatusChange={handleStatusChange}
            usuarioLogado={usuarioLogado}
          />
        </div>
      </main>
    </div>
  );
}

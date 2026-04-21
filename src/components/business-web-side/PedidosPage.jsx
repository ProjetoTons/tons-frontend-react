import { useState, useMemo } from "react";
import TopNavBar from "./TopNavBar";
import PageHeader from "./PageHeader";
import StatsGrid from "./StatsGrid";
import OrderTable from "./OrderTable";
import { mockPedidos, calcularEstatisticas } from "./mockData";

/**
 * PedidosPage - Página completa de Gerenciamento de Pedidos
 * Integra todos os componentes
 */

function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState("pedidos");

  // Filtrar pedidos baseado no search
  const pedidosFiltrados = useMemo(() => {
    if (!searchTerm) return mockPedidos;
    return mockPedidos.filter(
      (pedido) =>
        pedido.num_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Calcular estatísticas
  const stats = useMemo(() => calcularEstatisticas(mockPedidos), []);

  // Handlers
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilter = () => {
    console.log("Filtro clicado");
    // TODO: Implementar modal de filtros
  };

  const handleNovoPedido = () => {
    console.log("Novo pedido clicado");
    // TODO: Implementar modal/formulário de novo pedido
  };

  const handleAvancar = (pedidoId) => {
    console.log("Avançar pedido:", pedidoId);
    // TODO: Implementar lógica de avançar etapa
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    console.log("Navegando para:", page);
  };

  return (
    <div className="bg-[#f3f3f3] min-h-screen flex flex-col">
      {/* TopNavBar */}
      <TopNavBar onNavClick={handleNavClick} currentPage={currentPage} />

      {/* Main Content */}
      <main className="flex-1 px-[64px] py-[32px] flex flex-col gap-[32px]">
        {/* Page Header com Título, Busca e Filtros */}
        <PageHeader
          onSearch={handleSearch}
          onFilter={handleFilter}
          onNovoPedido={handleNovoPedido}
        />

        {/* Stats Grid */}
        <div>
          <StatsGrid stats={stats} />
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded shadow-sm">
          <OrderTable
            pedidos={pedidosFiltrados}
            onAvancar={handleAvancar}
          />
        </div>
      </main>
    </div>
  );
}

export default PedidosPage;

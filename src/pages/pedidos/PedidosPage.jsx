import { useState, useMemo } from "react";
import TopNavBar from "@/widgets/topnav-grafica/TopNavBar";
import PageHeader from "@/widgets/page-header/PageHeader";
import StatsGrid from "@/widgets/kpi-grid/StatsGrid";
import OrderTable from "@/widgets/order-table/OrderTable";
import { mockPedidos, calcularEstatisticas } from "@/entities/pedido/api/mockPedidos";

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState("pedidos");

  const pedidosFiltrados = useMemo(() => {
    if (!searchTerm) return mockPedidos;
    return mockPedidos.filter(
      (pedido) =>
        pedido.num_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const stats = useMemo(() => calcularEstatisticas(mockPedidos), []);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilter = () => {
    console.log("Filtro clicado");
  };

  const handleNovoPedido = () => {
    console.log("Novo pedido clicado");
  };

  const handleAvancar = (pedidoId) => {
    console.log("Avançar pedido:", pedidoId);
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
        />

        <div>
          <StatsGrid stats={stats} />
        </div>

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

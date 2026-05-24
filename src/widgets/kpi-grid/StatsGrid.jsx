import { useState, useEffect } from 'react';
import KpiCard from "@/shared/ui/molecules/Kpi/KpiCard";
import { useDashboardFilters } from '@/shared/lib/hooks/useDashboardFilters';
import { fetchKpisDashboard } from "@/entities/pedido/api/mockPedidosEstatisticas";
import { obterDatasDoFiltro } from "@/shared/lib/utils/dateFiltered";

export default function StatsGrid() {
  const { periodo } = useDashboardFilters();
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarKpis = async () => {
      setIsLoading(true);
      try {
        const { startDate, endDate } = obterDatasDoFiltro(periodo);
        const dadosKpi = await fetchKpisDashboard(startDate, endDate);
        setStats(dadosKpi);
      } catch (error) {
        console.error("Erro ao buscar KPIs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarKpis();
  }, [periodo]);

  const total = stats.totalPedidos || 0;

  return (
    <div className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
      <KpiCard
        title="Total (R$) no período"
        value={(stats.totalHoje || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        subtitle={`Em ${total} pedidos`}
        variant="dark"
        isCurrency
      />
      <KpiCard
        title="Aguardando Arte"
        value={stats.aguardandoArte || 0}
        subtitle={`de ${total} pedidos`}
        variant="light"
      />

      <KpiCard
        title="Enviado / Aguardando Retirada"
        value={stats.enviadoAguardandoRetirada || 0}
        subtitle={`de ${total} pedidos`}
        variant="light"
      />

      <KpiCard
        title="Concluído"
        value={stats.concluido || 0}
        subtitle={`de ${total} pedidos`}
        variant="light"
      />
    </div>
  );
}
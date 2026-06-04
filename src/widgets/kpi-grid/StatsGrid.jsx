import { useState, useEffect, useMemo } from 'react';
import KpiCard from "@/shared/ui/molecules/Kpi/KpiCard";
import FinancialKpiCard from "@/shared/ui/molecules/Kpi/FinancialKpiCard";
import { useDashboardFilters } from '@/shared/lib/hooks/useDashboardFilters';
import { fetchKpisDashboard } from "@/entities/pedido/api/dashboardApi";
import { obterDatasDoFiltro } from "@/shared/lib/utils/dateFiltered";

export default function StatsGrid({ onEditGoal }) {
  const { periodo, dataInicio } = useDashboardFilters();
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // 1. Obtém as datas inicial e final com base no seu filtro da URL
  const { startDate, endDate } = useMemo(() => obterDatasDoFiltro(periodo, dataInicio), [periodo, dataInicio]);

  useEffect(() => {
    const carregarKpis = async () => {
      if (!Object.keys(stats).length) setIsLoading(true); 
      
      try {
        const dadosKpi = await fetchKpisDashboard(startDate, endDate);
        setStats(dadosKpi);
      } catch (error) {
        console.error("Erro ao buscar KPIs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarKpis();

    window.addEventListener('metasUpdated', carregarKpis);

    return () => {
      window.removeEventListener('metasUpdated', carregarKpis);
    };
  }, [startDate, endDate]);

  const total = stats.totalPedidos || 0;
  
 // ------------------------------------------------------------------
  // 2. CÁLCULO DINÂMICO ALINHADO COM AS STRINGS DA SUA URL
  // ------------------------------------------------------------------
  const metaBaseSemanal = stats.metaAtual || 0;
  let metaCalculada = metaBaseSemanal;
  let labelMetaDinamica = "META"; // Nossa nova variável para a string

  const periodoCheck = String(periodo).toLowerCase();

  if (periodoCheck === 'mes') {
    metaCalculada = metaBaseSemanal * 4.35;
    labelMetaDinamica = "Meta Mensal";
  } 
  else if (periodoCheck === 'ano') {
    metaCalculada = metaBaseSemanal * 52;
    labelMetaDinamica = "Meta Anual";
  } 
  else {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    const metaDiaria = metaBaseSemanal / 7;
    const diasFinais = diffDays > 0 ? diffDays : 1;
    
    metaCalculada = metaDiaria * diasFinais;
    labelMetaDinamica = `Meta (${diasFinais} dias)`; 
  }

  // E lá no retorno do JSX do StatsGrid, você adiciona a prop:
  return (
    <div className={`w-full grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 xl:gap-5 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
      
      {/* Card Financeiro Especializado */}
      <FinancialKpiCard
        title="Total (R$) no período"
        value={(stats.totalHoje || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        currentValue={stats.totalHoje}
        goalValue={metaCalculada}
        goalLabel={labelMetaDinamica}
        onEditGoal={onEditGoal}
      />      
      <KpiCard
        title="Aguardando Arte"
        value={stats.aguardandoArte || 0}
        subtitle={`de ${total} pedidos`}
      />

      <KpiCard
        title="Aguardando Retirada"
        value={stats.enviado || 0}
        subtitle={`de ${total} pedidos`}
      />

      <KpiCard
        title="Enviada"
        value={stats.aguardandoRetirada || 0}
        subtitle={`de ${total} pedidos`}
      />
    </div>
  );
}
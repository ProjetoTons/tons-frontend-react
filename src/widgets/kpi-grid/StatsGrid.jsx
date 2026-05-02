import KpiCard from "./KpiCard";

/**
 * StatsGrid - Grid de 4 cards com estatísticas
 * 
 * Props:
 * - stats: object com { totalHoje, emAvaliacao, emAndamento, concluido }
 * 
 * Exemplo:
 * <StatsGrid stats={{ totalHoje: 4290, emAvaliacao: 24, emAndamento: 2, concluido: 52 }} />
 */

function StatsGrid({ stats }) {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-4 grid-rows-[160px] w-full">
      {/* Card Total Hoje - Dark Variant */}
      <div>
        <KpiCard
          title="Total Hoje"
          value={stats.totalHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          variant="dark"
          isCurrency
        />
      </div>

      {/* Card Em Avaliação - Light Variant */}
      <div>
        <KpiCard
          title="Aguardando Arte"
          value={stats.aguardandoArte}
          variant="light"
        />
      </div>

      {/* Card Enviado - Light Variant */}
      <div>
        <KpiCard
          title="Enviado / Aguardando Retirada"
          value={stats.enviadoAguardandoRetirada}
          variant="light"
        />
      </div>

      {/* Card Concluído - Light Variant */}
      <div>
        <KpiCard
          title="Concluído"
          value={stats.concluido}
          variant="light"
        />
      </div>
    </div>
  );
}

export default StatsGrid;

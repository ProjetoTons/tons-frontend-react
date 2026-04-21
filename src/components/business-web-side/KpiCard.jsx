/**
 * KpiCard - Componente para exibir KPIs (Key Performance Indicators)
 * 
 * Exibe um box com título e valor grande
 * Pode ter dois variantes: "dark" (preto com texto amarelo) e "light" (branco com borda)
 * 
 * Props:
 * - title: string - Título do KPI (ex: "Total Hoje", "Em Avaliação")
 * - value: string | number - Valor a ser exibido (ex: "4.290,00", "24")
 * - variant: "dark" | "light" - Estilo do card
 * - isCurrency: boolean (opcional) - Se true, renderiza com formatação de moeda
 * 
 * Exemplo de uso:
 * <KpiCard title="Total Hoje" value="4.290,00" variant="dark" isCurrency />
 * <KpiCard title="Em Avaliação" value="24" variant="light" />
 */

function KpiCard({ title, value, variant = "light", isCurrency = false }) {
  const isDark = variant === "dark";

  // Classes base para o container
  const containerClasses = `
    flex flex-col h-[160px] items-start justify-between
    p-[24px] relative shrink-0
    ${isDark 
      ? "bg-[#161616] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" 
      : "bg-[#fcfcfc] border border-[#e4e2e2] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
    }
  `;

  // Classes para o título
  const titleClasses = `
    font-['Inter:Bold',sans-serif] font-bold
    text-[10px] tracking-[1px] uppercase
    leading-[15px]
    ${isDark ? "text-[#9ca3af]" : "text-[#5f5f5f]"}
  `;

  // Classes para o valor
  const valueClasses = `
    font-['Space_Grotesk:Bold',sans-serif] font-bold
    text-[36px] leading-[40px]
    ${isDark ? "text-[#fdf210]" : "text-[#161616]"}
  `;

  return (
    <div className={containerClasses}>
      {/* Seção do Título */}
      <div className="flex flex-col items-start relative shrink-0 w-full">
        <span className={titleClasses}>
          {title}
        </span>
      </div>

      {/* Seção do Valor */}
      <div className="flex flex-col gap-[4px] items-start relative shrink-0 w-full">
        <div className="flex flex-col items-start relative shrink-0 w-full">
          <p className={valueClasses}>
            {isCurrency && "R$ "}
            {value}
          </p>
        </div>
        <div className="h-[16px] shrink-0 w-full" />
      </div>
    </div>
  );
}

export default KpiCard;
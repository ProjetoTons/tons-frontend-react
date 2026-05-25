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

function KpiCard({ title, value, variant = "light", isCurrency = false, subtitle}) {
  const isDark = variant === "dark";

  // Classes base para o container
  const containerClasses = `
    flex flex-col h-[80px] lg:h-[90px] xl:h-[110px] items-start justify-between
    p-2.5 lg:p-3 xl:p-4 relative shrink-0 rounded-xl transition-shadow
    ${isDark 
      ? "bg-[#161616] shadow-md" 
      : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
    }
  `;

  // Classes para o título
  const titleClasses = `
    font-['Inter:Bold',sans-serif] font-bold
    text-[9px] lg:text-[10px] tracking-[1px] uppercase
    leading-tight
    ${isDark ? "text-[#9ca3af]" : "text-[#5f5f5f]"}
  `;

  // Classes para o valor
  const valueClasses = `
    font-['Space_Grotesk',sans-serif] font-bold
    text-[18px] lg:text-[22px] xl:text-[26px] leading-tight
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
      <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
        <div className="flex flex-col items-start relative shrink-0 w-full">
          <p className={valueClasses}>
            {isCurrency && "R$ "}
            {value}
          </p>

          {subtitle && (
            <span className={`text-[10px] lg:text-[11px] font-medium mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default KpiCard;
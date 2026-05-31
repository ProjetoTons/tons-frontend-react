/**
 * KpiCard - Componente base para exibir KPIs operacionais
 */
function KpiCard({ title, value, subtitle }) {
  return (
    <div className="flex flex-col min-h-[80px] lg:min-h-[90px] xl:min-h-[110px] items-start justify-between gap-2 p-2.5 lg:p-3 xl:p-4 relative shrink-0 rounded-xl transition-all duration-300 bg-white border border-gray-200 shadow-sm hover:shadow-md">
      
      {/* Título */}
      <div className="flex flex-col items-start relative shrink-0 w-full">
        <span className="font-['Inter:Bold',sans-serif] font-bold text-[9px] lg:text-[10px] tracking-[1px] uppercase leading-tight w-full truncate text-[#5f5f5f]">
          {title}
        </span>
      </div>

      {/* Valor e Subtítulo */}
      <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full flex-1 justify-end">
        <p className="font-['Space_Grotesk',sans-serif] font-bold text-[18px] lg:text-[22px] xl:text-[26px] leading-tight text-[#161616]">
          {value}
        </p>
        
        {subtitle && (
          <span className="text-[10px] lg:text-[11px] font-medium mt-0.5 text-gray-500">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

export default KpiCard;
/**
 * FinancialKpiCard - Componente especializado para KPIs financeiros com barra de meta
 */
function FinancialKpiCard({ title, value, currentValue, goalValue, onEditGoal }) {
    const safeCurrentValue = Number(currentValue) || 0;
    const safeGoalValue = Number(goalValue) || 0;
    const hasGoal = safeGoalValue > 0;

    const percentage = hasGoal ? Math.min(Math.round((safeCurrentValue / safeGoalValue) * 100), 100) : 0;

    return (
        <div className="flex flex-col min-h-[80px] lg:min-h-[90px] xl:min-h-[110px] items-start justify-between gap-2 p-2.5 lg:p-3 xl:p-4 relative shrink-0 rounded-xl transition-all duration-300 bg-[#161616] shadow-md">

            {/* Título */}
            <div className="flex flex-col items-start relative shrink-0 w-full">
                <span className="font-['Inter:Bold',sans-serif] font-bold text-[9px] lg:text-[10px] tracking-[1px] uppercase leading-tight w-full truncate text-[#9ca3af]">
                    {title}
                </span>
            </div>

            <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full flex-1 justify-end">
                {/* Valor */}
                <p className="font-['Space_Grotesk',sans-serif] font-bold text-[18px] lg:text-[22px] xl:text-[26px] leading-tight text-[#fdf210]">
                    R$ {value}
                </p>

                {/* Bloco da Meta */}
                {hasGoal && (
                    <div className="w-full mt-2 lg:mt-3 flex flex-col gap-1.5 transition-opacity duration-300">
                        <div className="flex justify-between items-center w-full">

                            {/* Texto e Botão */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-[9px] lg:text-[10px] font-medium text-gray-400 tracking-wide pr-2">
                                    META: R$ {safeGoalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>

                                {onEditGoal && (
                                    <button
                                        onClick={onEditGoal}
                                        className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none cursor-pointer"
                                        title="Configurar Metas"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Porcentagem */}
                            <span className="text-[9px] lg:text-[10px] font-bold text-[#fdf210]">
                                {percentage}%
                            </span>
                        </div>

                        {/* Barra de Progresso */}
                        <div className="w-full bg-[#333333] rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-[#fdf210] h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FinancialKpiCard;
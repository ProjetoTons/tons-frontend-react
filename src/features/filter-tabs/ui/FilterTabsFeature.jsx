import { useDashboardFilters } from '@/shared/lib/hooks/useDashboardFilters';

export default function FilterTabsFeature() {
    const { periodo, setPeriodo } = useDashboardFilters();

    const opcoes = [
        { id: 'semana', label: 'ÚLTIMOS 7 DIAS' },
        { id: 'mes', label: 'MÊS ATUAL' },
        { id: 'ano', label: 'ANO ATUAL' },
    ];

    return (
        <div className="flex bg-gray-100 p-0.5 lg:p-1 rounded-lg font-bold text-[9px] lg:text-[10px] text-gray-500 gap-1">
            {opcoes.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setPeriodo(opt.id)}
                    className={`px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-md uppercase transition-all duration-200 whitespace-nowrap ${periodo === opt.id
                            ? 'bg-[#6b7214] text-white shadow-sm'
                            : 'hover:bg-gray-200 hover:text-gray-700'
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
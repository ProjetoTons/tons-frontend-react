import { useDashboardFilters } from '@/shared/lib/hooks/useDashboardFilters';

export default function FilterTabsFeature() {
    const { periodo, setPeriodo } = useDashboardFilters();

    const opcoes = [
        { id: 'semana', label: 'ÚLTIMOS 7 DIAS' },
        { id: 'mes', label: 'MÊS ATUAL' },
        { id: 'ano', label: 'ANO ATUAL' },
    ];

    return (
        <div className="flex bg-[#EEEDE9] p-1 rounded font-bold text-[10px] text-gray-500 gap-1">
            {opcoes.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setPeriodo(opt.id)}
                    className={`px-3 py-1.5 rounded uppercase transition-all ${periodo === opt.id
                            ? 'bg-[#6b7214] text-white shadow-sm'
                            : 'hover:text-gray-800'
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
import { useDashboardFilters } from '@/shared/lib/hooks/useDashboardFilters';
import { InfoTooltip } from '@/shared/ui/atoms/InfoTooltip';

export default function FilterTabsFeature() {
    const { periodo, setPeriodo, dataInicio, setDataInicio } = useDashboardFilters();

    const opcoes = [
        { id: 'mes', label: 'MÊS ATUAL' },
        { id: 'ano', label: 'ANO ATUAL' },
    ];

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    const dataMaxima = `${ano}-${mes}-${dia}`;

    return (
        <div className="flex items-center gap-2">

            {/* Seletor de Data Dinâmico */}
            <div className="flex items-center gap-1.5">
                <InfoTooltip text="Filtra os dados a partir do dia selecionado até a data de hoje." />
                <input
                    type="date"
                    max={dataMaxima}
                    value={periodo === 'custom' && dataInicio ? dataInicio : ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                            setDataInicio(val);
                        } else {
                            setPeriodo('mes');
                        }
                    }}
                    className="text-[10px] p-2 border border-gray-200 rounded-md text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#6b7214] cursor-pointer"
                />

            </div>

            {/* Opções de Filtro Rápido */}
            <div className="flex bg-gray-100 p-0.5 lg:p-1 rounded-lg font-bold text-[9px] lg:text-[10px] text-gray-500 gap-1">
                {opcoes.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => {
                            setPeriodo(opt.id);
                        }}
                        className={`px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-md uppercase transition-all duration-200 ${periodo === opt.id ? 'bg-[#6b7214] text-white shadow-sm' : 'hover:bg-gray-200'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
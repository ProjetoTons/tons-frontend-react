import { useState, useEffect } from 'react';
import { useDashboardFilters } from '@/shared/lib/hooks/useDashboardFilters';
import { fetchGraficoEtapas } from "@/entities/pedido/api/mockPedidosEstatisticas";
import { obterDatasDoFiltro } from "@/shared/lib/utils/dateFiltered";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Paletas
const TONS_QUANTIDADE = ['#4d520e', '#6b7214', '#8a931a', '#a9b420', '#c8d526'];
const TONS_FINANCEIRO = ['#111111', '#222222', '#444444', '#666666', '#888888'];

// 🔥 ORDEM OFICIAL DAS MACRO-ETAPAS
const ORDEM_ETAPAS = ["Design", "Produção", "Embalagem", "Logística", "Finalizados"];

// 🔥 ORDEM OFICIAL DAS SUB-ETAPAS
const ORDEM_SUB_ETAPAS = [
    "aguardando-arte", "criando-mockup", "aguardando-aprovacao", "impressao-fotolito",
    "conferindo", "personalizando",
    "quality-check", "embalagem", "medicao", "emitir-etiqueta",
    "enviado", "aguardando-retirada", "finalizado"
];

export function StageAllocationChart() {
    const { periodo } = useDashboardFilters();
    const [dadosGrafico, setDadosGrafico] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            setIsLoading(true);
            try {
                const { startDate, endDate } = obterDatasDoFiltro(periodo);
                const dados = await fetchGraficoEtapas(startDate, endDate);

                // Ordena as Macro-Etapas (Eixo X)
                const dadosOrdenados = dados.sort((a, b) => {
                    let indexA = ORDEM_ETAPAS.indexOf(a.etapa);
                    let indexB = ORDEM_ETAPAS.indexOf(b.etapa);

                    if (indexA === -1) indexA = 999;
                    if (indexB === -1) indexB = 999;

                    return indexA - indexB;
                });

                setDadosGrafico(dadosOrdenados);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setIsLoading(false);
            }
        };
        carregarDados();
    }, [periodo]);

    const labelsMacro = dadosGrafico.map(d => d.etapa);

    // Extrai as sub-etapas únicas do período
    const subEtapasUnicas = new Set();
    dadosGrafico.forEach(macro => {
        macro.subEtapas.forEach(sub => subEtapasUnicas.add(sub.nome));
    });

    // 🔥 Ordena as sub-etapas e inverte para o Chart.js desenhar a 1ª no topo
    const subEtapasArray = Array.from(subEtapasUnicas)
        .sort((a, b) => {
            let indexA = ORDEM_SUB_ETAPAS.indexOf(a);
            let indexB = ORDEM_SUB_ETAPAS.indexOf(b);
            if (indexA === -1) indexA = 999;
            if (indexB === -1) indexB = 999;
            return indexA - indexB;
        })
        .reverse();

    const datasets = [];

    subEtapasArray.forEach((subNome, index) => {

        // --- DATASET: QUANTIDADE ---
        const dataQuantidade = dadosGrafico.map(macro => {
            const subEncontrada = macro.subEtapas.find(s => s.nome === subNome);
            return subEncontrada ? subEncontrada.quantidadePedidos : 0;
        });

        if (dataQuantidade.some(val => val > 0)) {
            datasets.push({
                label: `Qtd: ${subNome.replace('-', ' ')}`,
                data: dataQuantidade,
                backgroundColor: TONS_QUANTIDADE[index % TONS_QUANTIDADE.length],
                stack: 'StackQuantidade',
                yAxisID: 'y1',
                borderRadius: 2
            });
        }

        // --- DATASET: FINANCEIRO ---
        const dataFinanceiro = dadosGrafico.map(macro => {
            const subEncontrada = macro.subEtapas.find(s => s.nome === subNome);
            return subEncontrada ? subEncontrada.valorTotalArrecadado : 0;
        });

        if (dataFinanceiro.some(val => val > 0)) {
            datasets.push({
                label: `R$: ${subNome.replace('-', ' ')}`,
                data: dataFinanceiro,
                backgroundColor: TONS_FINANCEIRO[index % TONS_FINANCEIRO.length],
                stack: 'StackFinanceiro',
                yAxisID: 'y',
                borderRadius: 2
            });
        }
    });

    const data = {
        labels: labelsMacro,
        datasets: datasets
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'nearest',
            intersect: true,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(22, 22, 22, 0.9)',
                titleFont: { size: 13, family: 'Inter' },
                bodyFont: { size: 12, family: 'Inter' },
                padding: 12,
                cornerRadius: 4,
                displayColors: false,
                callbacks: {
                    title: function (tooltipItems) {
                        const item = tooltipItems[0];
                        const rawLabel = item.dataset.label || '';
                        const subNome = rawLabel.split(': ')[1] || '';
                        const subNomeCapitalizado = subNome.charAt(0).toUpperCase() + subNome.slice(1);

                        return `${subNomeCapitalizado} (${item.label})`;
                    },
                    label: function (context) {
                        const rawLabel = context.dataset.label || '';
                        const subNome = rawLabel.split(': ')[1];
                        const dataIndex = context.dataIndex;
                        const chartDatasets = context.chart.data.datasets;

                        let qtd = 0;
                        let valor = 0;

                        chartDatasets.forEach(ds => {
                            if (ds.label === `Qtd: ${subNome}`) {
                                qtd = ds.data[dataIndex];
                            }
                            if (ds.label === `R$: ${subNome}`) {
                                valor = ds.data[dataIndex];
                            }
                        });

                        const valorFormatado = new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(valor);

                        return [
                            `Quantidade: ${qtd} pedidos`,
                            `Financeiro: ${valorFormatado}`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: { display: false }
            },
            y1: {
                stacked: true,
                type: 'linear',
                display: true,
                position: 'left',
                grid: { drawOnChartArea: false },
                ticks: { stepSize: 1 }
            },
            y: {
                stacked: true,
                type: 'linear',
                display: true,
                position: 'right',
                grid: { color: '#f3f4f6' },
                ticks: {
                    callback: function (value) {
                        if (value >= 1000) return 'R$ ' + (value / 1000).toFixed(1) + 'k';
                        return 'R$ ' + value;
                    }
                }
            }
        },
    };

    if (isLoading) return <div className="h-[400px] w-full bg-gray-50 animate-pulse rounded"></div>;
    if (dadosGrafico.length === 0) return <div className="h-[400px] w-full border border-dashed rounded flex items-center justify-center">Sem dados</div>;

    return (
        <div className="w-full flex flex-col gap-4">
           
            {/* 🔥 TÍTULO DO GRÁFICO */}
            <div className="flex flex-col">
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                    Fluxo de Produção
                </h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                    Distribuição de volume e receita por etapa
                </p>
            </div>
            
            {/* CABEÇALHO DO GRÁFICO: INDICADOR + LEGENDA */}
            <div className="flex justify-between items-end pr-4">

                {/* Indicador de Ordem */}
                <div className="flex items-center gap-2 border-l-2 border-[#e4e2e2] pl-2">
                    <div className="flex flex-col items-center justify-center text-[#9ca3af] text-[8px] leading-[8px]">
                        <span>▲</span>
                        <span>▼</span>
                    </div>
                    <div className="flex flex-col text-[9px] font-bold text-gray-400 tracking-widest uppercase">
                        <span>Topo = Primeira Sub-Etapa da área</span>
                        <span>Base = Última Sub-Etapa da área</span>
                    </div>
                </div>

                {/* Legenda */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-[#c8d526]"></div>
                        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Qtd. Pedidos</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-[#111111]"></div>
                        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Valor (R$)</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-[400px] relative">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
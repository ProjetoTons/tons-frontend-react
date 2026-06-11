import { useState, useEffect, useRef } from 'react';
import { useDashboardFilters } from '@/shared/lib/hooks/useDashboardFilters';
import { fetchGraficoEtapas, fetchSubEtapasPorEtapa } from "@/entities/pedido/api/dashboardApi";
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
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // <-- 1. Importação do Plugin

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels // <-- 2. Registro do Plugin
);

// Cores da marca Ton's
const COR_QUANTIDADE = '#d4c91a';
const COR_FINANCEIRO = '#161616';

const ORDEM_ETAPAS = ["Design", "Produção", "Embalagem", "Logística", "Finalizados"];

export function StageAllocationChart() {
    const { periodo } = useDashboardFilters();
    const [dadosGrafico, setDadosGrafico] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [drillDown, setDrillDown] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const carregarDados = async () => {
            setIsLoading(true);
            try {
                const { startDate, endDate } = obterDatasDoFiltro(periodo);
                const dados = await fetchGraficoEtapas(startDate, endDate);

                const dadosOrdenados = dados.sort((a, b) => {
                    let indexA = ORDEM_ETAPAS.indexOf(a.etapa);
                    let indexB = ORDEM_ETAPAS.indexOf(b.etapa);
                    if (indexA === -1) indexA = 999;
                    if (indexB === -1) indexB = 999;
                    return indexA - indexB;
                });

                setDadosGrafico(dadosOrdenados);
                setDrillDown(null);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setIsLoading(false);
            }
        };
        carregarDados();
    }, [periodo]);

    const handleBarClick = async (event) => {
        if (!chartRef.current) return;
        const elements = getElementAtEvent(chartRef.current, event);
        if (elements.length === 0) return;

        const index = elements[0].index;
        const etapaClicada = dadosGrafico[index]?.etapa;
        if (!etapaClicada) return;

        try {
            const { startDate, endDate } = obterDatasDoFiltro(periodo);
            const subDados = await fetchSubEtapasPorEtapa(etapaClicada, startDate, endDate);
            setDrillDown({ etapa: etapaClicada, dados: subDados });
        } catch (error) {
            console.error("Erro ao buscar sub-etapas:", error);
        }
    };

    const labels = dadosGrafico.map(d => d.etapa);
    const mainData = {
        labels,
        datasets: [
            {
                label: 'Qtd. Pedidos',
                data: dadosGrafico.map(d => d.quantidadePedidos),
                backgroundColor: COR_QUANTIDADE,
                yAxisID: 'y1',
                borderRadius: 4,
            },
            {
                label: 'Valor (R$)',
                data: dadosGrafico.map(d => d.valorTotalArrecadado),
                backgroundColor: COR_FINANCEIRO,
                yAxisID: 'y',
                borderRadius: 4,
            },
        ]
    };

    const drillData = drillDown ? {
        labels: drillDown.dados.map(d => d.subEtapa.replace(/-/g, ' ')),
        datasets: [
            {
                label: 'Qtd. Pedidos',
                data: drillDown.dados.map(d => d.quantidadePedidos),
                backgroundColor: COR_QUANTIDADE,
                yAxisID: 'y1',
                borderRadius: 4,
            },
            {
                label: 'Valor (R$)',
                data: drillDown.dados.map(d => d.valorTotalArrecadado),
                backgroundColor: COR_FINANCEIRO,
                yAxisID: 'y',
                borderRadius: 4,
            },
        ]
    } : null;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            // --- 3. Configuração dos Números nas Colunas ---
            datalabels: {
                anchor: 'end', // Prende no topo da barra
                align: 'start', // Alinha para dentro (abaixo do topo)
                offset: 4, // Espaçamento da borda superior
                color: function(context) {
                    // Se for o dataset de Quantidade (índice 0, barra amarela), texto preto. 
                    // Se for Financeiro (barra preta), texto branco.
                    return context.datasetIndex === 0 ? '#161616' : '#ffffff';
                },
                font: {
                    family: 'Space Grotesk',
                    weight: 'bold',
                    size: 10
                },
                formatter: function(value, context) {
                    if (!value || value === 0) return ''; // Não polui a tela com colunas zeradas
                    
                    if (context.dataset.yAxisID === 'y') {
                        // Formatação enxuta para grana
                        if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
                        return value;
                    }
                    return value; // Retorna a quantidade pura
                }
            },
            tooltip: {
                backgroundColor: 'rgba(22, 22, 22, 0.9)',
                titleFont: { size: 13, family: 'Inter' },
                bodyFont: { size: 12, family: 'Inter' },
                padding: 12,
                cornerRadius: 4,
                displayColors: true,
                callbacks: {
                    title: function (tooltipItems) {
                        return tooltipItems[0]?.label || '';
                    },
                    label: function (context) {
                        if (context.dataset.yAxisID === 'y') {
                            const valor = new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(context.raw);
                            return ` Valor: ${valor}`;
                        }
                        return ` Quantidade: ${context.raw} pedidos`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { drawOnChartArea: false },
                ticks: { stepSize: 1 }
            },
            y: {
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

    if (isLoading) return <div className="flex-1 w-full bg-gray-50 animate-pulse rounded"></div>;
    if (dadosGrafico.length === 0) return <div className="flex-1 w-full border border-dashed rounded flex items-center justify-center">Sem dados</div>;

    return (
        <div className="w-full flex-1 min-h-0 flex flex-col gap-1.5 lg:gap-2">

            {/* CABEÇALHO: TÍTULO + LEGENDA */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 pr-2">

                {/* Título */}
                <div className="flex flex-col">
                    <h2 className="text-sm lg:text-base font-bold text-gray-900 uppercase tracking-tight leading-tight">
                        {drillDown ? `Sub-etapas: ${drillDown.etapa}` : 'Fluxo de Produção'}
                    </h2>
                    <p className="text-[9px] lg:text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                        {drillDown ? 'Clique em "Voltar" para ver todas as etapas' : 'Clique em uma etapa para ver sub-etapas'}
                    </p>
                </div>

                <div className="flex items-center gap-3 lg:gap-4">
                    {/* Botão Voltar */}
                    {drillDown && (
                        <button
                            onClick={() => setDrillDown(null)}
                            className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded transition-colors cursor-pointer"
                        >
                            ← Voltar
                        </button>
                    )}

                    {/* Legenda */}
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-[#d4c91a]"></div>
                        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Qtd. Pedidos</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-[#161616]"></div>
                        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Valor (R$)</span>
                    </div>
                </div>
            </div>

            <div className="w-full flex-1 min-h-0 relative">
                {drillDown ? (
                    <Bar data={drillData} options={options} />
                ) : (
                    <Bar ref={chartRef} data={mainData} options={options} onClick={handleBarClick} />
                )}
            </div>
        </div>
    );
}
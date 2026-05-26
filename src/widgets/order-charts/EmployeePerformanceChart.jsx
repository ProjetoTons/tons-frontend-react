import { useState, useEffect, useMemo } from 'react';
import { useDashboardFilters } from '@/shared/lib/hooks/useDashboardFilters';
import { fetchPerformanceFuncionarios } from "@/entities/pedido/api/mockPedidosEstatisticas";
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

export function EmployeePerformanceChart() {
    const { periodo, dataInicio } = useDashboardFilters();
    const [dadosGrafico, setDadosGrafico] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            console.log("Filtros atuais:", { periodo, dataInicio });
            setIsLoading(true);
            try {
                const { startDate, endDate } = obterDatasDoFiltro(periodo, dataInicio);
                const dados = await fetchPerformanceFuncionarios(startDate, endDate);

                // Ordena pelo somatório total das 4 macro-etapas
                const dadosOrdenados = dados.sort((a, b) => {
                    if (a.nomeFuncionario === "Sem responsável") return -1;
                    if (b.nomeFuncionario === "Sem responsável") return 1;

                    const totalA = a.tarefas.design + a.tarefas.producao + a.tarefas.embalagem + a.tarefas.logistica;
                    const totalB = b.tarefas.design + b.tarefas.producao + b.tarefas.embalagem + b.tarefas.logistica;
                    return totalB - totalA;
                });

                setDadosGrafico(dadosOrdenados);
            } catch (error) {
                console.error("Erro ao buscar dados de performance:", error);
            } finally {
                setIsLoading(false);
            }
        };
        carregarDados();
    }, [periodo, dataInicio]);

    const labels = dadosGrafico.map(d => d.nomeFuncionario);

    const data = useMemo(() => {
        return {
            labels: dadosGrafico.map(d => d.nomeFuncionario),
            datasets: [
                {
                    label: 'Design',
                    data: dadosGrafico.map(d => d.tarefas.design),
                    backgroundColor: '#d4c91a',
                    stack: 'Stack0',
                    borderRadius: 2
                },
                {
                    label: 'Produção',
                    data: dadosGrafico.map(d => d.tarefas.producao),
                    backgroundColor: '#161616',
                    stack: 'Stack0',
                    borderRadius: 2
                },
                {
                    label: 'Embalagem',
                    data: dadosGrafico.map(d => d.tarefas.embalagem),
                    backgroundColor: '#8a8a8a',
                    stack: 'Stack0',
                    borderRadius: 2
                },
                {
                    label: 'Logística',
                    data: dadosGrafico.map(d => d.tarefas.logistica),
                    backgroundColor: '#6b6606',
                    stack: 'Stack0',
                    borderRadius: 2
                }
            ]
        };
    }, [dadosGrafico]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        interaction: {
            mode: 'index',
            axis: 'y',       // '' CORREÇÃO 1: Avisa que a interação segue a linha horizontal
            intersect: true, // '' CORREÇÃO 2: Só ativa se o mouse tocar fisicamente na cor
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
                displayColors: true,
                callbacks: {
                    footer: function (tooltipItems) {
                        let total = 0;
                        tooltipItems.forEach(function (tooltipItem) {
                            total += tooltipItem.parsed.x;
                        });
                        return '\nTotal de Tarefas: ' + total;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                beginAtZero: true,
                grid: { color: '#f3f4f6' },
                ticks: { stepSize: 1 }
            },
            y: {
                stacked: true,
                grid: { display: false }
            }
        }
    };

    if (isLoading) return <div className="flex-1 w-full bg-gray-50 animate-pulse rounded"></div>;
    if (dadosGrafico.length === 0) return <div className="flex-1 w-full border border-dashed rounded flex items-center justify-center">Sem dados</div>;

    return (
        <div className="w-full flex-1 min-h-0 flex flex-col gap-1.5 lg:gap-2">

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-1.5 pr-2">
                <h3 className="text-xs lg:text-sm font-bold uppercase tracking-wide text-gray-800 leading-tight">
                    QUANTIDADE DE TAREFAS POR FUNCIONÁRIO
                </h3>

                {/* Legenda Customizada Expandida para 4 Itens */}
                <div className="flex items-center gap-3 lg:gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-[#d4c91a]"></div>
                        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Design</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-[#161616]"></div>
                        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Produção</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-[#8a8a8a]"></div>
                        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Embalagem</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-[#6b6606]"></div>
                        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">Logística</span>
                    </div>
                </div>
            </div>

            <div className="w-full flex-1 min-h-0 relative">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
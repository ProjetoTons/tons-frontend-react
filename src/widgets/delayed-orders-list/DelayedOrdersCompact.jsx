import { useState, useEffect } from 'react';
import { fetchPedidosAtrasados } from "@/entities/pedido/api/mockPedidosEstatisticas";

export function DelayedOrdersCompact() {
    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            setIsLoading(true);
            try {
                const dados = await fetchPedidosAtrasados();
                setPedidos(dados);
            } catch (error) {
                console.error("Erro ao buscar pedidos atrasados:", error);
            } finally {
                setIsLoading(false);
            }
        };
        carregarDados();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-100 rounded"></div>
                <div className="h-16 bg-gray-100 rounded"></div>
                <div className="h-16 bg-gray-100 rounded"></div>
            </div>
        );
    }

    if (pedidos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <span className="text-sm font-bold text-gray-700">Tudo em dia!</span>
                <span className="text-xs text-gray-500 mt-1">Nenhum pedido atrasado.</span>
            </div>
        );
    }

    const formatarData = (dataString) => {
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Título */}
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800">
                    Entregas ({pedidos.length})
                </h3>
            </div>

            {/* Lista de pedidos */}
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {pedidos.map((pedido) => (
                    <div
                        key={pedido.idPedido}
                        className="flex flex-col gap-2 border border-gray-100 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                        {/* Linha 1: Pedido + Status */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-900">
                                #{pedido.numPedido}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                pedido.statusAtraso === 'VENCE_HOJE'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-50 text-red-600 border border-red-100'
                            }`}>
                                {pedido.statusAtraso === 'VENCE_HOJE'
                                    ? 'Vence Hoje'
                                    : `${pedido.diasAtraso} ${pedido.diasAtraso === 1 ? 'dia' : 'dias'} atrasado`
                                }
                            </span>
                        </div>

                        {/* Linha 2: Etapa + Responsável + Prazo */}
                        <div className="flex items-center justify-between text-[11px] text-gray-500">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-600">{pedido.macroEtapa}</span>
                                <span className="text-gray-300">•</span>
                                <span>{pedido.nomeResponsavel}</span>
                            </div>
                            <span className="font-medium">{formatarData(pedido.prazoFinal)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

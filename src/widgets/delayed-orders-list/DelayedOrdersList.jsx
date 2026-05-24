import { useState, useEffect } from 'react';
import { fetchPedidosAtrasados } from "@/entities/pedido/api/mockPedidosEstatisticas";

export function DelayedOrdersList() {
    const [pedidos, setPedidos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            setIsLoading(true);
            try {
                // Tabela de atrasados geralmente independe do filtro de "Semana/Mês", 
                // pois se está atrasado, precisa ser mostrado independente de quando foi criado.
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

    // Formata a data (Ex: "2026-05-14" vira "14/05/2026")
    const formatarData = (dataString) => {
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    if (isLoading) {
        return (
            <div className="w-full bg-white border border-gray-200 rounded-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                    <div className="h-8 bg-gray-100 rounded w-full"></div>
                    <div className="h-8 bg-gray-100 rounded w-full"></div>
                    <div className="h-8 bg-gray-100 rounded w-full"></div>
                </div>
            </div>
        );
    }

    if (pedidos.length === 0) {
        return (
            <div className="w-full bg-white border border-gray-200 rounded-md p-8 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-[#8a931a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Tudo em dia!</h3>
                <p className="text-xs text-gray-500 mt-1">Nenhum pedido atrasado na operação.</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border border-gray-200 rounded-md overflow-hidden flex flex-col shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-[#fcfcfc]">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-800">
                    Atenção Necessária ({pedidos.length})
                </h3>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-wider text-gray-500">
                            <th className="px-5 py-3 font-bold">Pedido</th>
                            <th className="px-5 py-3 font-bold">Onde está travado?</th>
                            <th className="px-5 py-3 font-bold">Responsável</th>
                            <th className="px-5 py-3 font-bold">Prazo Final</th>
                            <th className="px-5 py-3 font-bold text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {pedidos.map((pedido) => (
                            <tr key={pedido.idPedido} className="hover:bg-gray-50 transition-colors">
                                {/* Número do Pedido */}
                                <td className="px-5 py-4">
                                    <span className="font-bold text-gray-800">{pedido.numPedido}</span>
                                </td>
                                
                                {/* Etapa Exata (Mapeada do seu fluxo) */}
                                <td className="px-5 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-700">{pedido.macroEtapa}</span>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                                            {pedido.subEtapa.replace('-', ' ')}
                                        </span>
                                    </div>
                                </td>

                                {/* Responsável */}
                                <td className="px-5 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-md font-medium ${pedido.nomeResponsavel === 'Sem responsável' ? 'bg-gray-100 text-gray-500' : 'bg-gray-100 text-gray-800'}`}>
                                        {pedido.nomeResponsavel}
                                    </span>
                                </td>

                                {/* Prazo */}
                                <td className="px-5 py-4 text-gray-600 font-medium text-xs">
                                    {formatarData(pedido.prazoFinal)}
                                </td>

                                {/* Badge de Criticidade */}
                                <td className="px-5 py-4 text-right">
                                    {pedido.statusAtraso === 'VENCE_HOJE' ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-[#fdf210] text-[#161616] uppercase tracking-wider">
                                            Vence Hoje
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 uppercase tracking-wider">
                                            {pedido.diasAtraso} {pedido.diasAtraso === 1 ? 'dia atrasado' : 'dias atrasados'}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
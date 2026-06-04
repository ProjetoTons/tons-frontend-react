import { useState, useEffect, useMemo } from 'react';
import { useDashboardFilters } from '@/shared/lib/hooks/useDashboardFilters';
import { obterDatasDoFiltro } from '@/shared/lib/utils/dateFiltered';
import { fetchPedidosLista } from '@/entities/pedido/api/dashboardApi';
import { InfoTooltip } from '@/shared/ui/atoms/InfoTooltip';

/**
 * PedidosListWidget - Estética em Cards (List View)
 * Busca universal, filtros globais, alertas preventivos de prazo curto (48h) e SVGs inline.
 */
export default function PedidosListWidget() {
  const { periodo, dataInicio } = useDashboardFilters();
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const carregarPedidos = async () => {
      setIsLoading(true);
      try {
        const { startDate, endDate } = obterDatasDoFiltro(periodo, dataInicio);
        const dados = await fetchPedidosLista(startDate, endDate);
        setPedidos(dados);
      } catch (error) {
        console.error("Erro ao buscar lista de pedidos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarPedidos();
  }, [periodo, dataInicio]);

  // Motor de Filtragem, Enriquecimento e Ordenação Crítica
  const pedidosFiltrados = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // 1. Filtra os dados (Texto livre + Status de Conclusão)
    const filtrados = pedidos.filter((pedido) => {
      const isConcluido = pedido.status === 'finalizado' || pedido.status === 'enviado';
      
      if (showCompleted && !isConcluido) return false;
      if (!showCompleted && isConcluido) return false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const numMatch = pedido.num_pedido?.toLowerCase().includes(term);
        const clienteMatch = pedido.cliente?.nome?.toLowerCase().includes(term);
        const descMatch = pedido.descricao?.toLowerCase().includes(term);
        return numMatch || clienteMatch || descMatch;
      }
      return true;
    });

    // 2. Calcula alertas preventivos de proximidade de prazo (48h)
    const enriquecidos = filtrados.map((pedido) => {
      const isConcluido = pedido.status === 'finalizado' || pedido.status === 'enviado';
      let diasRestantes = null;

      if (!isConcluido && pedido.data_finalizacao) {
        const prazo = new Date(`${pedido.data_finalizacao}T00:00:00`);
        const diffTime = prazo.getTime() - hoje.getTime();
        diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return {
        ...pedido,
        // Ativa o alerta se faltarem 1 ou 2 dias para o estouro do prazo
        alertaProximidade: diasRestantes > 0 && diasRestantes <= 2 ? diasRestantes : null
      };
    });

    // 3. Ordenação Inteligente de Fila Operacional
    return enriquecidos.sort((a, b) => {
      if (!showCompleted) {
        // Prioridade 1: Pedidos já atrasados (Maior atraso primeiro)
        const atrasoA = a.diasAtraso || 0;
        const atrasoB = b.diasAtraso || 0;
        if (atrasoB !== atrasoA) return atrasoB - atrasoA;

        // Prioridade 2: Pedidos que vencem hoje
        if (a.statusAtraso === 'VENCE_HOJE' && b.statusAtraso !== 'VENCE_HOJE') return -1;
        if (b.statusAtraso === 'VENCE_HOJE' && a.statusAtraso !== 'VENCE_HOJE') return 1;

        // Prioridade 3: Alertas preventivos de 48h (Prazo de 1 dia antes do de 2 dias)
        if (a.alertaProximidade && !b.alertaProximidade) return -1;
        if (b.alertaProximidade && !a.alertaProximidade) return 1;
        if (a.alertaProximidade && b.alertaProximidade) return a.alertaProximidade - b.alertaProximidade;
      }

      // Prioridade 4: Data de entrada do pedido (Mais recentes primeiro)
      const dataA = new Date(a.data_pedido).getTime();
      const dataB = new Date(b.data_pedido).getTime();
      return dataB - dataA;
    });
  }, [pedidos, searchTerm, showCompleted]);

  const renderStatusBadge = (status) => {
    const statusConfig = {
      'finalizado': { label: 'Finalizado', color: 'bg-green-100 text-green-700' },
      'enviado': { label: 'Enviado', color: 'bg-green-100 text-green-700' },
      'aguardando-arte': { label: 'Aguard. Arte', color: 'bg-amber-100 text-amber-700' },
      'criando-mockup': { label: 'Criando Mockup', color: 'bg-blue-100 text-blue-700' },
      'impressao-fotolito': { label: 'Fotolito', color: 'bg-purple-100 text-purple-700' },
      'personalizando': { label: 'Produção', color: 'bg-orange-100 text-orange-700' },
      'conferindo': { label: 'Conferindo', color: 'bg-cyan-100 text-cyan-700' },
      'quality-check': { label: 'Quality Check', color: 'bg-teal-100 text-teal-700' },
      'embalagem': { label: 'Embalagem', color: 'bg-indigo-100 text-indigo-700' },
      'aguardando-retirada': { label: 'Aguard. Retirada', color: 'bg-emerald-100 text-emerald-700' },
    };

    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-600' };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-5">
      
      {/* --- CABEÇALHO DE CONTROLES (Busca e Toggle) --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-5">
        
        <div className="flex items-center gap-2 w-full sm:max-w-md">
          <div className="relative w-full group">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#161616] transition-colors w-4 h-4">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Buscar O.S, cliente ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
              className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fdf210] focus:bg-white transition-all shadow-sm disabled:opacity-50"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          
          <div className="shrink-0">
             <InfoTooltip text="Você pode pesquisar por Ordem de Serviço, nome do cliente ou detalhes da descrição do pedido." />
          </div>
        </div>

        <button
          onClick={() => setShowCompleted(!showCompleted)}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all duration-300 shrink-0 w-full sm:w-auto disabled:opacity-50 ${
            showCompleted
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent shadow-inner"
              : "bg-[#313131] text-[#fdf210] hover:bg-black shadow-sm cursor-pointer"
          }`}
        >
          {showCompleted ? (
             <>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="3" y="5" width="6" height="6" rx="1"></rect><path d="m3 17 2 2 4-4"></path><line x1="13" y1="6" x2="21" y2="6"></line><line x1="13" y1="12" x2="21" y2="12"></line><line x1="13" y1="18" x2="21" y2="18"></line></svg>
               Ver em Andamento
             </>
          ) : (
             <>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
               Ver Concluídos
             </>
          )}
        </button>
      </div>

      {/* --- LISTA DE CARDS --- */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 bg-gray-100 border border-gray-200 rounded-lg w-full"></div>
            ))}
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
            <span className="text-sm font-bold text-gray-500">Nenhum pedido encontrado</span>
            <span className="text-xs text-gray-400 mt-1">
              {searchTerm ? `Sua busca por "${searchTerm}" não retornou resultados.` : 'A lista está vazia para o período selecionado.'}
            </span>
          </div>
        ) : (
          pedidosFiltrados.map((pedido) => (
            <div
              key={pedido.id_pedido}
              className="flex flex-col gap-2.5 border border-gray-100 rounded-lg px-4 py-3 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-default shadow-sm"
            >
              {/* Linha 1: O.S + Badges de Status e Alertas de Tempo */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-gray-900 font-['Space_Grotesk']">
                    #{pedido.num_pedido}
                  </span>
                  
                  {!showCompleted && (
                    <>
                      {/* Crítico: Já estourou o prazo */}
                      {pedido.statusAtraso === 'ATRASADO' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                          {pedido.diasAtraso}d Atrasado
                        </span>
                      )}
                      
                      {/* Crítico: Prazo termina hoje */}
                      {pedido.statusAtraso === 'VENCE_HOJE' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100">
                          Vence Hoje
                        </span>
                      )}

                      {/* Preventivo: Nova regra das 48 horas (Garante o visual "Vence Hoje") */}
                      {pedido.statusAtraso === 'NO_PRAZO' && pedido.alertaProximidade && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100">
                          {pedido.alertaProximidade === 1 ? 'Prazo final amanhã' : 'Prazo final em 2d'}
                        </span>
                      )}
                      
                      {/* Normal: Mais do que 2 dias de prazo restante */}
                      {pedido.statusAtraso === 'NO_PRAZO' && !pedido.alertaProximidade && pedido.data_finalizacao && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Prazo: {new Date(`${pedido.data_finalizacao}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {renderStatusBadge(pedido.status)}
              </div>

              {/* Linha 2: Cliente + Descrição do Produto */}
              <div className="text-[13px] text-gray-600 truncate w-full flex items-center">
                <span className="font-bold text-gray-800">{pedido.cliente?.nome || 'Sem Cliente'}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="truncate" title={pedido.descricao}>{pedido.descricao}</span>
              </div>

              {/* Linha 3: Macro-etapa, Responsável e Valor Financeiro */}
              <div className="flex items-center justify-between mt-0.5 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-600 uppercase tracking-wide">{pedido.etapa_pedido}</span>
                  <span className="text-gray-300">•</span>
                  <span>{pedido.responsavel?.nome || 'Sem responsável'}</span>
                </div>
                <span className="font-['Space_Grotesk'] font-bold text-[#161616] text-sm">
                  R$ {pedido.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Rodapé */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
          Exibindo {pedidosFiltrados.length} pedido(s)
        </span>
      </div>
      
    </div>
  );
}
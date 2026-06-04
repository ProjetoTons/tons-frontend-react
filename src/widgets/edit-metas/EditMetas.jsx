import { useEffect, useState } from 'react';
import { fetchKpisDashboard, updateMetas } from '@/entities/pedido/api/dashboardApi';
import { useDashboardFilters } from '@/shared/lib/hooks/useDashboardFilters';
import { obterDatasDoFiltro } from '@/shared/lib/utils/dateFiltered';
import { InfoTooltip } from '@/shared/ui/atoms/InfoTooltip';

export function EditMetas({ onClose }) {
  const { periodo, dataInicio } = useDashboardFilters();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mantemos APENAS a meta semanal como fonte da verdade
  const [metaAtual, setMetaAtual] = useState(0); 

  useEffect(() => {
    const carregarMetas = async () => {
      setIsLoading(true);
      try {
        const { startDate, endDate } = obterDatasDoFiltro(periodo, dataInicio);
        const dadosKpi = await fetchKpisDashboard(startDate, endDate);
        setMetaAtual(Number(dadosKpi.metaAtual) || 0);
      } catch (error) {
        console.error("Erro ao buscar metas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarMetas();
  }, [periodo, dataInicio]);

  // Gerenciador de mudanças (agora lida apenas com a meta semanal)
  const handleChange = (e) => {
    const { value } = e.target;
    // Remove tudo que não for número e converte para decimal
    const numericValue = Number(value.replace(/\D/g, '')) / 100;
    setMetaAtual(numericValue);
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateMetas(metaAtual);
      window.dispatchEvent(new Event('metasUpdated'));
      onClose(); // Fecha o modal após salvar
    } catch (error) {
      console.error("Erro ao salvar metas", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Função utilitária para exibir o valor formatado no input
  const formatInput = (value) => {
    return (value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    // Overlay com fundo escurecido e desfoque sutil
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] transition-opacity">

      {/* Container do Modal */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col transform transition-all">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-sm uppercase tracking-wide text-gray-800">
              Configurar Metas
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Defina os objetivos financeiros da gráfica.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1"
            title="Fechar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col p-5 gap-4">

          {/* Campo: Meta Semanal (EDITÁVEL) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="semanal" className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
              Meta Semanal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">R$</span>
              <input
                id="semanal"
                name="semanal"
                type="text"
                value={formatInput(metaAtual)}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-['Space_Grotesk'] font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fdf210] focus:border-transparent transition-all shadow-sm"
                placeholder="0,00"
                required
              />
            </div>
          </div>

          {/* Campo: Meta Mensal (READ-ONLY) */}
          <div className="flex flex-col gap-1.5">
            {/* CSS Ajustado: inline-flex, items-center, w-fit e gap-1.5 */}
            <label htmlFor="mensal" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wide w-fit">
              Meta Mensal (Projeção) 
              <InfoTooltip text="Projeção automática baseada na meta semanal (x4,35 - Media de semanas por mês). Para ajustar, edite o campo de Meta Semanal."/>
            </label>
            <div className="relative opacity-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">R$</span>
              <input
                id="mensal"
                name="mensal"
                type="text"
                value={formatInput(metaAtual * 4.35)}
                readOnly
                className="w-full pl-9 pr-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-['Space_Grotesk'] font-bold text-gray-500 cursor-not-allowed select-none transition-all"
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Campo: Meta Anual (READ-ONLY) */}
          <div className="flex flex-col gap-1.5">
            {/* CSS Ajustado: inline-flex, items-center, w-fit e gap-1.5 */}
            <label htmlFor="anual" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wide w-fit">
              Meta Anual (Projeção) 
              <InfoTooltip text="Projeção automática baseada na meta semanal (x52 - Número aproximado de semanas no ano). Para ajustar, edite o campo de Meta Semanal."/>
            </label>
            <div className="relative opacity-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">R$</span>
              <input
                id="anual"
                name="anual"
                type="text"
                value={formatInput(metaAtual * 52)}
                readOnly
                className="w-full pl-9 pr-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-['Space_Grotesk'] font-bold text-gray-500 cursor-not-allowed select-none transition-all"
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Ações (Botões) */}
          <div className="flex items-center justify-end gap-2 mt-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving || isLoading}
              className="px-4 py-2 bg-[#161616] hover:bg-black text-[#fdf210] text-[11px] font-bold uppercase tracking-wide rounded-lg transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-[#fdf210]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                'Salvar Metas'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
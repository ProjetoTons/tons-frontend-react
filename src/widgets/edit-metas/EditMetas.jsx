import { useState } from 'react';

export function EditMetas({ onClose }) {

  const [metas, setMetas] = useState({
    semanal: 15000,
    mensal: 60000,
    anual: 700000,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Gerenciador de mudanças nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, '');
    
    setMetas((prev) => ({
      ...prev,
      [name]: Number(numericValue),
    }));
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Aqui entrará o seu POST/PUT para a API em Spring Boot
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simula o tempo de rede
      console.log("Payload enviado para a API:", metas);
      
      // Fecha o modal após salvar com sucesso
      onClose();
    } catch (error) {
      console.error("Erro ao salvar metas", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Função utilitária para exibir o valor formatado no input
  const formatCurrency = (value) => {
    if (!value) return '';
    return (value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
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
            className="text-gray-400 hover:text-gray-700 transition-colors p-1"
            title="Fechar"
          >
            {/* SVG inline para evitar problemas com bibliotecas de ícones */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col p-5 gap-4">
          
          {/* Campo: Meta Semanal */}
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
                value={formatCurrency(metas.semanal * 100)} // Multiplica por 100 para compensar a divisão na formatação
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-['Space_Grotesk'] font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fdf210] focus:border-transparent transition-all"
                placeholder="0,00"
                required
              />
            </div>
          </div>

          {/* Campo: Meta Mensal */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mensal" className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
              Meta Mensal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">R$</span>
              <input
                id="mensal"
                name="mensal"
                type="text"
                value={formatCurrency(metas.mensal * 100)}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-['Space_Grotesk'] font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fdf210] focus:border-transparent transition-all"
                placeholder="0,00"
                required
              />
            </div>
          </div>

          {/* Campo: Meta Anual */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="anual" className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
              Meta Anual
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">R$</span>
              <input
                id="anual"
                name="anual"
                type="text"
                value={formatCurrency(metas.anual * 100)}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-['Space_Grotesk'] font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#fdf210] focus:border-transparent transition-all"
                placeholder="0,00"
                required
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
              disabled={isSaving}
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
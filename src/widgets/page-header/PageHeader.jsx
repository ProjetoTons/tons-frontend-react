/**
 * PageHeader - Cabeçalho da página com título, busca e filtros
 * 
 * Props:
 * - onSearch: function - callback quando busca
 * - onFilter: function - callback quando clica filtro
 * - onNovoPedido: function - callback quando clica em novo pedido
 * - onEtapaFilter: function - callback para filtrar por etapa
 * - etapaAtiva: string - etapa atualmente selecionada
 */

function PageHeader({ onSearch, onFilter, onNovoPedido, onEtapaFilter, etapaAtiva = null }) {
  const handleSearchChange = (e) => {
    onSearch && onSearch(e.target.value);
  };

  const etapas = ["Design", "Produção", "Embalagem", "Logística", "Finalizados"];

  return (
    <div className="p-24 pt-10 pb-10">
      {/* Título e Descrição */}
      <div className="mb-[24px]">
        <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[36px] text-[#161616] tracking-[-0.9px] uppercase mb-[8px]">
          Gerenciamento de Pedidos
        </h1>
        <p className="font-['Inter:Medium',sans-serif] font-medium text-[16px] text-[#5f5f5f]">
          Gerencie a entrada e triagem de novos projetos.
        </p>
      </div>

      {/* Controls Row - Busca, Filtro e Novo Pedido */}
      <div className="flex items-center gap-[12px] mt-10">

        {/* Filtros por etapa */}
        <div className="flex items-center gap-[12px]">
          {etapas.map((etapa) => (
            <button
              key={etapa}
              onClick={() => onEtapaFilter && onEtapaFilter(etapa)}
              className={`px-[16px] py-[8px] rounded font-['Inter:Medium',sans-serif] font-medium text-[14px] transition-all ${etapaAtiva === etapa
                  ? "bg-[#fdf210] text-[#161616] hover:bg-[#e6d800] shadow-md cursor-pointer"
                  : "bg-[#e4e2e2] text-[#323233] hover:bg-[#d4d2d2] border-2 border-transparent shadow-md cursor-pointer"
                }`}
            >
              {etapa}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-[289px] ml-16">
          <div className="bg-[#e4e2e2] flex items-center px-[40px] py-[11px] rounded relative">
            <input
              type="text"
              placeholder="Buscar pedido"
              onChange={handleSearchChange}
              className="bg-transparent font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#6b7280] placeholder-[#6b7280] outline-none w-full"
            />
          </div>
          {/* Search Icon */}
          <svg
            className="absolute left-[12px] top-1/2 transform -translate-y-1/2 w-[13.5px] h-[13.5px] text-[#6b7280]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filtro Button */}
        <button
          onClick={() => onFilter && onFilter()}
          className="bg-[#e4e2e2] hover:bg-[#d4d2d2] transition-colors flex items-center gap-[8px] px-[16px] py-[10px] rounded"
        >
          <svg className="w-[13.5px] h-[9px] text-[#323233]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[14px] text-[#323233]">
            Filtro
          </span>
        </button>

        {/* Novo Pedido Button */}
        <button
          onClick={() => onNovoPedido && onNovoPedido()}
          className="bg-[#161616] hover:bg-[#0a0a0a] transition-colors text-white px-[32px] py-[9px] rounded flex items-center justify-center gap-[4px]"
        >
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[18px]">+</span>
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[14px]">Novo Pedido</span>
        </button>
      </div>
    </div>
  );
}

export default PageHeader;

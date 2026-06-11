/**
 * PageHeader - Cabeçalho da página com título, busca e filtros
 * * Props:
 * - onSearch: function - callback quando busca
 * - onFilter: function - callback quando aplica filtro { status, ordenarPor, direcao }
 * - onNovoPedido: function - callback quando clica em novo pedido
 * - onEtapaFilter: function - callback para filtrar por etapa
 * - etapaAtiva: string - etapa atualmente selecionada
 * - etapasPermitidas: array - lista de etapas que o usuário atual pode ver (Oculta botões se restrito)
 * - userRole: string - Papel principal do usuário na aplicação
 */
import { getEtapaConfig } from "@/entities/pedido/api/etapaConfig";
import { useState, useRef, useEffect } from "react";

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "nao-iniciado", label: "Não Iniciado" },
  { value: "aguardando-arte", label: "Aguardando arte" },
  { value: "criando-mockup", label: "Criando Mockup" },
  { value: "aguardando-aprovacao", label: "Aguardando aprovação" },
  { value: "impressao-fotolito", label: "Impressão fotolito" },
  { value: "conferindo", label: "Conferindo" },
  { value: "personalizando", label: "Personalizando" },
  { value: "quality-check", label: "Quality check" },
  { value: "embalagem", label: "Embalagem" },
  { value: "medicao", label: "Medição" },
  { value: "emitir-etiqueta", label: "Emitir etiqueta" },
  { value: "enviado", label: "Enviado" },
  { value: "aguardando-retirada", label: "Aguardando retirada" },
];

const ORDENAR_OPTIONS = [
  { value: "", label: "Nenhuma" },
  { value: "data_pedido", label: "Data Início" },
  { value: "data_finalizacao", label: "Data Fim" },
  { value: "valor_total", label: "Preço" },
  { value: "status", label: "Status" },
];

// 👇 1. Adicionamos as props de validação na assinatura da função
function PageHeader({ 
  onSearch, 
  onFilter, 
  onNovoPedido, 
  onEtapaFilter, 
  etapaAtiva = null, 
  responsavelFilter = "todos", 
  onResponsavelFilter,
  etapasPermitidas = [], 
  userRole
}) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showPedidosDropdown, setShowPedidosDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("");
  const [direcao, setDirecao] = useState("asc");
  const panelRef = useRef(null);

  // Fecha painel ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowFilterPanel(false);
      }
    }
    if (showFilterPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilterPanel]);

  // Fecha dropdown de pedidos ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('[data-pedidos-dropdown]')) {
        setShowPedidosDropdown(false);
      }
    }
    if (showPedidosDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPedidosDropdown]);

  const handleApplyFilter = () => {
    onFilter && onFilter({ status: statusFilter, ordenarPor, direcao });
    setShowFilterPanel(false);
  };

  const handleClearFilter = () => {
    setStatusFilter("");
    setOrdenarPor("");
    setDirecao("asc");
    onFilter && onFilter({ status: "", ordenarPor: "", direcao: "asc" });
    setShowFilterPanel(false);
  };
  
  const handleSearchChange = (e) => {
    onSearch && onSearch(e.target.value);
  };

  // 2. Separamos o botão "Todos" da lista base de etapas
  const etapasBase = [
    { value: "Design", label: "Design" },
    { value: "Produção", label: "Produção" },
    { value: "Embalagem", label: "Embalagem" },
    { value: "Logística", label: "Logística" },
    { value: "Finalizados", label: "Finalizados" },
    { value: "Cancelado", label: "Cancelados" },
  ];

  // 3. Filtramos: Adm vê todas, os demais veem apenas o que está no array `etapasPermitidas`
  const etapasVisiveis = userRole === 'Adm' 
    ? etapasBase 
    : etapasBase.filter(etapa => etapasPermitidas.includes(etapa.value));

  return (
    <div>
      {/* Linha 1: Título + Busca na mesma linha */}
      <div className="flex items-end justify-between mt-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {responsavelFilter === "meus" ? "Meus Pedidos" : "Todos os Pedidos"}
          </h1>
          <p className="text-sm text-gray-500 max-w-lg whitespace-nowrap">
            Gerencie a entrada e triagem de novos projetos.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-[289px]">
          <div className="bg-[#e4e2e2] flex items-center px-[40px] py-[11px] rounded relative">
            <input
              type="text"
              placeholder="Buscar pedido"
              onChange={handleSearchChange}
              className="bg-transparent font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#6b7280] placeholder-[#6b7280] outline-none w-full"
            />
          </div>
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
      </div>

      {/* Linha 2: Tabs + Filtro + Novo Pedido */}
      <div className="flex items-center gap-[12px] mt-4">

        {/* Dropdown Pedidos */}
        <div className="relative border-r-2 border-[#e4e2e2] pr-[16px] mr-[4px]" data-pedidos-dropdown>
          <button
            onClick={() => setShowPedidosDropdown((v) => !v)}
            className="whitespace-nowrap min-w-[160px] px-[16px] py-[8px] rounded font-['Inter:Medium',sans-serif] font-medium text-[14px] transition-all cursor-pointer text-center bg-[#161616] text-white shadow-md flex items-center justify-between gap-2"
          >
            {responsavelFilter === "meus" ? "Meus Pedidos" : "Todos os Pedidos"}
            <svg className={`w-4 h-4 transition-transform ${showPedidosDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showPedidosDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px] overflow-hidden">
              <button
                onClick={() => { onResponsavelFilter && onResponsavelFilter("todos"); setShowPedidosDropdown(false); }}
                className={`w-full text-left px-4 py-2 text-[14px] font-medium transition-colors ${
                  responsavelFilter === "todos" ? "bg-[#f5f5f5] font-bold" : "hover:bg-[#f5f5f5]"
                }`}
              >
                Todos os Pedidos
              </button>
              <button
                onClick={() => { onResponsavelFilter && onResponsavelFilter("meus"); setShowPedidosDropdown(false); }}
                className={`w-full text-left px-4 py-2 text-[14px] font-medium transition-colors ${
                  responsavelFilter === "meus" ? "bg-[#fdf210] font-bold" : "hover:bg-[#f5f5f5]"
                }`}
              >
                Meus Pedidos
              </button>
            </div>
          )}
        </div>

        {/* Filtros por etapa */}
        <div className="flex items-center gap-[12px]">
          
          {userRole === 'Adm' && (
            <button
              onClick={() => onEtapaFilter && onEtapaFilter(null)}
              style={!etapaAtiva ? { backgroundColor: '#fdf210', color: '#000000' } : {}}
              className={`px-[16px] py-[8px] rounded font-['Inter:Medium',sans-serif] font-medium text-[14px] transition-all ${!etapaAtiva
                ? 'shadow-md cursor-pointer hover:opacity-90 font-bold'
                : "bg-[#e4e2e2] text-[#323233] hover:bg-[#d4d2d2] border-2 border-transparent shadow-md cursor-pointer"
              }`}
            >
              <div className="flex gap-1 justify-center items-center">
                Todos
              </div>
            </button>
          )}

          {etapasVisiveis.map(({ value, label }) => {
            const isAtiva = etapaAtiva === value;
            const etapaConfig = getEtapaConfig(value || "Tudo");
            return (
              <button
                key={label}
                onClick={() => onEtapaFilter && onEtapaFilter(value)}
                style={isAtiva ? { backgroundColor: etapaConfig.cor, color: etapaConfig.txtColor } : {}}
                className={`px-[16px] py-[8px] rounded font-['Inter:Medium',sans-serif] font-medium text-[14px] transition-all ${isAtiva
                  ? 'shadow-md cursor-pointer hover:opacity-90 font-bold'
                  : "bg-[#e4e2e2] text-[#323233] hover:bg-[#d4d2d2] border-2 border-transparent shadow-md cursor-pointer"
                  }`}
              >
                <div className="flex gap-1 justify-center items-center">
                {label}
                <img src={etapaConfig.icone} alt="" className={isAtiva ? "w-3 h-3 brightness-0 invert" : "w-3 h-3 brightness-35"} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Filtro + Novo Pedido alinhados à direita (mesma largura da busca) */}
        <div className="flex items-center gap-[12px] ml-auto w-[289px]">
          <div className="relative flex-1" ref={panelRef}>
            <button
              onClick={() => setShowFilterPanel((v) => !v)}
              className={`w-full bg-[#e4e2e2] hover:bg-[#d4d2d2] transition-colors flex items-center justify-center gap-[8px] px-[16px] py-[10px] rounded ${
                (statusFilter || ordenarPor) ? "ring-2 ring-[#fdf210]" : ""
              }`}
            >
              <svg className="w-[13.5px] h-[9px] text-[#323233]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[14px] text-[#323233]">Filtro</span>
            </button>

            {showFilterPanel && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-5 w-[300px]">
                <div className="mb-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#fdf210]">
                    {STATUS_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Ordenar por</label>
                  <select value={ordenarPor} onChange={(e) => setOrdenarPor(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#fdf210]">
                    {ORDENAR_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                  </select>
                </div>
                {ordenarPor && (
                  <div className="mb-4">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Direção</label>
                    <div className="flex gap-2">
                      <button onClick={() => setDirecao("asc")} className={`flex-1 px-3 py-2 text-sm font-medium rounded border transition-colors ${direcao === "asc" ? "bg-[#fdf210] border-[#fdf210] text-black" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}>↑ Crescente</button>
                      <button onClick={() => setDirecao("desc")} className={`flex-1 px-3 py-2 text-sm font-medium rounded border transition-colors ${direcao === "desc" ? "bg-[#fdf210] border-[#fdf210] text-black" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}>↓ Decrescente</button>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button onClick={handleClearFilter} className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors">Limpar</button>
                  <button onClick={handleApplyFilter} className="flex-1 px-3 py-2 text-sm font-bold text-black bg-[#fdf210] rounded hover:bg-[#e6d800] transition-colors">Aplicar</button>
                </div>
              </div>
            )}
          </div>

          {userRole === 'Adm' && (
            <button
              onClick={() => onNovoPedido && onNovoPedido()}
              className="bg-[#161616] hover:bg-[#0a0a0a] transition-colors text-white px-[32px] py-[9px] rounded flex items-center justify-center gap-[4px]"
            >
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[18px]">+</span>
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[14px]">Novo Pedido</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
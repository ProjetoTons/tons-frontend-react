/**
 * PageHeader - Cabeçalho da página com título, busca e filtros
 * 
 * Props:
 * - onSearch: function - callback quando busca
 * - onFilter: function - callback quando aplica filtro { status, ordenarPor, direcao }
 * - onNovoPedido: function - callback quando clica em novo pedido
 * - onEtapaFilter: function - callback para filtrar por etapa
 * - etapaAtiva: string - etapa atualmente selecionada
 */

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

function PageHeader({ onSearch, onFilter, onNovoPedido, onEtapaFilter, etapaAtiva = null }) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
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

  const etapas = [
    { value: null, label: "Todos" },
    { value: "Design", label: "Design" },
    { value: "Produção", label: "Produção" },
    { value: "Embalagem", label: "Embalagem" },
    { value: "Logística", label: "Logística" },
    { value: "Finalizados", label: "Finalizados" },
  ];

  return (
    <div>
      {/* Título e Descrição */}
      <div className="mb-[24px]">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Gerenciamento de Pedidos
        </h1>
        <p className="text-sm text-gray-500 max-w-lg whitespace-nowrap">
          Gerencie a entrada e triagem de novos projetos.
        </p>
      </div>

      {/* Controls Row - Busca, Filtro e Novo Pedido */}
      <div className="flex items-center gap-[12px] mt-10">

        {/* Filtros por etapa */}
        <div className="flex items-center gap-[12px]">
          {etapas.map(({ value, label }) => {
            const isAtiva = value === null ? !etapaAtiva : etapaAtiva === value;
            return (
              <button
                key={label}
                onClick={() => onEtapaFilter && onEtapaFilter(value)}
                className={`px-[16px] py-[8px] rounded font-['Inter:Medium',sans-serif] font-medium text-[14px] transition-all ${isAtiva
                  ? "bg-[#fdf210] text-[#161616] hover:bg-[#e6d800] shadow-md cursor-pointer"
                  : "bg-[#e4e2e2] text-[#323233] hover:bg-[#d4d2d2] border-2 border-transparent shadow-md cursor-pointer"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end items-center w-full gap-[12px]">
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

          {/* Filtro Button + Panel */}
          <div className="relative" ref={panelRef}>
            <button
              onClick={() => setShowFilterPanel((v) => !v)}
              className={`bg-[#e4e2e2] hover:bg-[#d4d2d2] transition-colors flex items-center gap-[8px] px-[16px] py-[10px] rounded ${
                (statusFilter || ordenarPor) ? "ring-2 ring-[#fdf210]" : ""
              }`}
            >
              <svg className="w-[13.5px] h-[9px] text-[#323233]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[14px] text-[#323233]">
                Filtro
              </span>
            </button>

            {showFilterPanel && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-5 w-[300px]">
                {/* Status */}
                <div className="mb-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#fdf210]"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Ordenar por */}
                <div className="mb-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Ordenar por
                  </label>
                  <select
                    value={ordenarPor}
                    onChange={(e) => setOrdenarPor(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#fdf210]"
                  >
                    {ORDENAR_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Direção */}
                {ordenarPor && (
                  <div className="mb-4">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Direção
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDirecao("asc")}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded border transition-colors ${
                          direcao === "asc"
                            ? "bg-[#fdf210] border-[#fdf210] text-black"
                            : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        ↑ Crescente
                      </button>
                      <button
                        onClick={() => setDirecao("desc")}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded border transition-colors ${
                          direcao === "desc"
                            ? "bg-[#fdf210] border-[#fdf210] text-black"
                            : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        ↓ Decrescente
                      </button>
                    </div>
                  </div>
                )}

                {/* Botões */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={handleClearFilter}
                    className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    Limpar
                  </button>
                  <button
                    onClick={handleApplyFilter}
                    className="flex-1 px-3 py-2 text-sm font-bold text-black bg-[#fdf210] rounded hover:bg-[#e6d800] transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>

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
    </div>
  );
}

export default PageHeader;

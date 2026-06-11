import React from 'react';
import './filtrosFeatureUi.css';

function Filtros({ categoriaAtiva, aoMudar, busca, aoBuscar, categorias = [] }) {
  const categoriasAgrupadas = categorias.map((cat, index) => ({
    id: cat.slug,
    label: `CAT-${String(index + 1).padStart(2, '0')}`,
    nome: cat.nome,
    itemCount: cat.count || 0,
  }));

  return (
    <section className="w-full bg-white px-10 py-6">
      {/* Header com linha amarela */}
      <div className="mb-6">
        <h2 className="text-2xl font-black uppercase tracking-widest text-black mb-2" style={{ fontFamily: 'var(--fonte-space)' }}>
          Categorias
        </h2>
        <h2 className="text-lg font-black uppercase tracking-widest text-black" style={{ fontFamily: 'var(--fonte-space)' }}>
          Explore nosso portfólio.
        </h2>
      </div>

      {/* Flex com wrap para mostrar todas as categorias */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        {/* Botão TODOS */}
        <button
          onClick={() => aoMudar("todos")} 
          className={`px-4 py-2 font-bold uppercase tracking-wider text-xs transition-all duration-300 border-2 cursor-pointer rounded-full whitespace-nowrap ${categoriaAtiva === "todos"
              ? 'bg-yellow-400 text-black border-yellow-400'
              : 'bg-white text-black border-black hover:bg-yellow-50 hover:border-yellow-400'
            }`}
        >
          TODOS
        </button>

        {/* Botões de Categoria Minimalistas */}
        {categoriasAgrupadas.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => aoMudar(categoria.id)}
            className={`px-3 py-2 font-bold text-xs tracking-wider transition-all duration-300 border-2 cursor-pointer rounded-full flex items-center gap-2 ${categoriaAtiva === categoria.id
                ? 'bg-yellow-400 text-black border-yellow-400'
                : 'bg-white text-black border-gray-300 hover:border-yellow-400 hover:bg-gray-50'
              }`}
          >
            <span>{categoria.nome}</span>
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-black ${categoriaAtiva === categoria.id
                ? 'bg-black text-yellow-400'
                : 'bg-yellow-400 text-black'
              }`}>
              {categoria.itemCount}
            </span>
          </button>
        ))}
      </div>

      {/* Barra de Pesquisa */}
      <div className="flex justify-end">
        <div className="w-full max-w-xs">
          <div className="relative group">
            <input
              type="text"
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => aoBuscar(e.target.value)}
              className="w-full bg-white rounded-full border-2 border-gray-300 px-4 py-2 text-xs font-medium placeholder-gray-500 text-gray-700 focus:outline-none focus:border-yellow-400 transition-all"
            />
            {busca && busca.length > 0 && (
              <button
                onClick={() => aoBuscar('')}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs text-gray-600"
              >
                ✕
              </button>
            )}
            <svg className={`absolute ${busca && busca.length > 0 ? 'right-10' : 'right-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-400 transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Filtros;
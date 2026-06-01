import React, { useState } from 'react';
import './filtrosFeatureUi.css';

function Filtros({ categoriaAtiva, aoMudar, busca, aoBuscar }) {
  const categoriasAgrupadas = [
    {
      id: "acessorios_celular",
      label: "CAT-01",
      nome: "Acessórios p/ Celular",
      itemCount: 8,
    },
    {
      id: "bar_bebidas",
      label: "CAT-02",
      nome: "Bar e Bebidas",
      itemCount: 5,
    },
    {
      id: "blocos_cadernetas",
      label: "CAT-03",
      nome: "Blocos e Cadernetas",
      itemCount: 6,
    },
    {
      id: "bolsas_termicas",
      label: "CAT-04",
      nome: "Bolsas Térmicas",
      itemCount: 5,
    },
    {
      id: "caixa_som",
      label: "CAT-05",
      nome: "Caixa de Som",
      itemCount: 3,
    },
    {
      id: "caneca",
      label: "CAT-06",
      nome: "Caneca",
      itemCount: 6,
    },
    {
      id: "chaveiros",
      label: "CAT-07",
      nome: "Chaveiros",
      itemCount: 5,
    },
    {
      id: "copos_termicos",
      label: "CAT-08",
      nome: "Copos Térmicos",
      itemCount: 6,
    },
    {
      id: "cozinha",
      label: "CAT-09",
      nome: "Cozinha",
      itemCount: 8,
    },
    {
      id: "cuidados_pessoais",
      label: "CAT-10",
      nome: "Cuidados Pessoais",
      itemCount: 6,
    },
    {
      id: "escritorio",
      label: "CAT-11",
      nome: "Escritório",
      itemCount: 3,
    },
    {
      id: "esporte_jogos",
      label: "CAT-12",
      nome: "Esporte e Jogos",
      itemCount: 5,
    },
    {
      id: "caneta",
      label: "CAT-13",
      nome: "Caneta",
      itemCount: 6,
    },
    {
      id: "estojo",
      label: "CAT-14",
      nome: "Estojo",
      itemCount: 4,
    },
    {
      id: "ferramentas",
      label: "CAT-15",
      nome: "Ferramentas",
      itemCount: 4,
    },
    {
      id: "lanternas_luminarias",
      label: "CAT-16",
      nome: "Lanternas e Luminárias",
      itemCount: 3,
    }
  ];

  return (
    <section className="w-full bg-white px-10 py-6">
      {/* Header com linha amarela */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-1 w-8 bg-yellow-400 rounded-full"></div>
        <h2 className="text-sm font-black uppercase tracking-widest text-black" style={{ fontFamily: 'var(--fonte-space)' }}>
          Categorias
        </h2>
      </div>

      {/* Flex horizontal com scroll */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {/* Botão TODOS */}
        <button
          onClick={() => aoMudar("todos")}
          className={`shrink-0 px-4 py-2 font-bold uppercase tracking-wider text-xs transition-all duration-300 border-2 cursor-pointer rounded-full whitespace-nowrap ${
            categoriaAtiva === "todos"
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
            className={`shrink-0 px-3 py-2 font-bold text-xs tracking-wider transition-all duration-300 border-2 cursor-pointer rounded-full whitespace-nowrap flex items-center gap-2 ${
              categoriaAtiva === categoria.id
                ? 'bg-yellow-400 text-black border-yellow-400'
                : 'bg-white text-black border-gray-300 hover:border-yellow-400 hover:bg-gray-50'
            }`}
          >
            <span>{categoria.nome}</span>
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-black ${
              categoriaAtiva === categoria.id
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
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Filtros;
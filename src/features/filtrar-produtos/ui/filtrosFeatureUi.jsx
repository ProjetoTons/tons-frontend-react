  import React from 'react';

  function Filtros({ categoriaAtiva, aoMudar, busca, aoBuscar }) {
    const categorias = [
      { label: "TODOS", valor: "todos" },
      { label: "PAPELARIA", valor: "papelaria" },
      { label: "BANNERS", valor: "banner" },
      { label: "BRINDES", valor: "brinde" },
    ];

    return (
      <section className="w-full bg-[#F2F2F2] px-10 py-10">
        <h2 className="text-[var(--preto-neutro)] text-2xl font-bold uppercase tracking-wide mb-6" style={{ fontFamily: 'var(--fonte-space)' }}>
          Explore nosso portfólio
        </h2>

        <div className="flex items-center justify-between gap-6 flex-wrap">
          {/* Filtros por categoria */}
          <div className="flex gap-3 flex-wrap">
            {categorias.map(cat => (  
              <button 
                key={cat.valor}
                className={`px-6 py-[10px] text-xs font-bold tracking-[1px] uppercase cursor-pointer border-2 transition-all duration-300 outline-none relative overflow-hidden active:scale-95 active:shadow-lg ${
                  categoriaAtiva === cat.valor
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-400 hover:bg-[var(--amarelo-base)] hover:text-black hover:border-black'
                }`}
                onClick={() => aoMudar(cat.valor)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Barra de Busca */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => aoBuscar(e.target.value)}
              className="bg-white border border-black rounded-md px-3 py-2 pr-10 w-[250px] focus:outline-none focus:ring-1 focus:ring-[var(--amarelo-base)] transition-all text-sm"
            />
            <img
              src="/icons/search.png"
              alt="Buscar"
              className="absolute right-3 w-4 h-4 opacity-70"
            />
          </div>
        </div>
      </section>
    );
  }

  export default Filtros;
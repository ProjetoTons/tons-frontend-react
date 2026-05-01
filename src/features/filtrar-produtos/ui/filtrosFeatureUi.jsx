  import React from 'react';

  function Filtros({ categoriaAtiva, aoMudar }) {
    const categorias = ["CORPORATIVO", "COMEMORAÇÕES", "FAMÍLIA"];

    return (
      <div className="flex justify-evenly w-full gap-3 mb-[30px] mt-[30px]">
        {categorias.map(cat => (  
          <button 
            key={cat}
            className={`px-6 py-[10px] text-xs font-bold tracking-[1px] uppercase cursor-pointer border border-[#e0e0e0] bg-white text-[#b0b0b0] transition-all duration-300 outline-none relative overflow-hidden hover:border-[#1a1a1a] hover:text-[#1a1a1a] active:scale-95 ${categoriaAtiva === cat ? '!bg-[#1a1a1a] !text-white !border-[#1a1a1a] scale-105 shadow-[0_4px_10px_rgba(0,0,0,0.2)]' : ''}`}
            onClick={() => aoMudar(cat)} >
            {cat}
          </button>
        ))}
      </div>
    );
  }

  export default Filtros;
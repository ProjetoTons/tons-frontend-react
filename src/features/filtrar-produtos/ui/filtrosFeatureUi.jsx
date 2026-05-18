  import React from 'react';

  function Filtros({ categoriaAtiva, aoMudar }) {
    // Mapear nomes legíveis para tipos de produtos
    const categorias = [
      { label: "TODOS", valor: "todos" },
      { label: "PAPELARIA", valor: "papelaria" },
      { label: "BANNERS", valor: "banner" },
      { label: "BRINDES", valor: "brinde" },
      { label: "BRINDES", valor: "brinde" },
      { label: "BRINDES", valor: "brinde" },
      { label: "BRINDES", valor: "brinde" },{ label: "BRINDES", valor: "brinde" }
    ];

    return (
      <div className="flex justify-evenly w-full gap-3 mb-[30px] mt-[30px]">
        {categorias.map(cat => (  
          <button 
            key={cat.valor}
            className={`px-6 py-[10px] text-xs font-bold tracking-[1px] uppercase cursor-pointer border-2 transition-all duration-300 outline-none relative overflow-hidden active:scale-95 active:shadow-lg ${
              categoriaAtiva === cat.valor
                ? 'bg-black text-white border-black hover:bg-yellow- hover:text-white hover:border-black'
                : 'bg-gray-200 text-gray-700 border-gray-400 hover:bg-yellow-300  hover:text-black hover:border-black'
            }`}
            onClick={() => aoMudar(cat.valor)} >
            {cat.label}
          </button>
        ))}
      </div>
    );
  }

  export default Filtros;
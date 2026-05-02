import React from "react";

export default function Card({
    produto, // Recebemos o objeto completo do produto
    isBookmarked = false,
    onToggleBookmark,
    onImageClick, // Nova prop para abrir o modal
    iconActive,
    iconInactive,
}) {
  // Desestruturamos para facilitar o uso, mas mantemos o objeto 'produto' para o modal
  const { image, category, title } = produto;

  return (
    <div className="w-full bg-[#e9e6e3] overflow-hidden font-sans">
      
      {/* Clique na imagem dispara o Modal */}
      <div 
        className="w-full h-[260px] overflow-hidden cursor-pointer group"
        onClick={() => onImageClick(produto)}
      >
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
      </div>

      <div className="flex justify-between items-center p-[18px]">
        <div>
          <span className="text-[11px] tracking-[1px] text-[#9b9b9b] font-bold uppercase">
            {category}
          </span>
          <h2 className="text-lg mt-[6px] font-extrabold text-[#111] leading-tight whitespace-pre-line uppercase">
            {title}
          </h2>
        </div>

        {/* Clique no botão apenas salva/remove dos favoritos */}
        <button
          className="bg-[#f1efed] border-none w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-90 hover:bg-white shadow-sm"
          onClick={(e) => {
            e.stopPropagation(); // Evita que o clique no botão abra o modal por acidente
            onToggleBookmark();
          }}
        >
          <img
            src={isBookmarked ? iconActive : iconInactive}
            alt="bookmark"
            className="w-[18px] h-[18px] object-contain"
          />
        </button>
      </div>
    </div>
  );
}
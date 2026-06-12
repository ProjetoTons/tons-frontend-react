import React, { useState } from "react";

const PLACEHOLDER_IMG = '/product/placeholder.svg';

export default function Card({
  produto,
  isBookmarked = false,
  onToggleBookmark,
  onImageClick,
  iconActive,
  iconInactive,
}) {
  const [imgError, setImgError] = useState(false);
  const { image, category, title } = produto;

  return (
    <div className="w-full bg-[#e9e6e3] overflow-hidden font-sans relative">
      {/* Clique na imagem dispara o Modal */}
      {/* REDUZIDO: de h-[260px] para h-[220px] para o card ficar mais compacto */}
      <div
        className="w-full h-[220px] overflow-hidden cursor-pointer group relative"
        onClick={() => onImageClick(produto)}
      >
        <img
          src={imgError || !image ? PLACEHOLDER_IMG : image}
          alt={title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Bookmark */}
        <button
          title={isBookmarked ? "Desfavoritar item" : "Favoritar item"}
          className="absolute top-3 right-3 bg-[#f1efed] border-none w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-90 hover:bg-white shadow-sm z-10"
          onClick={(e) => {
            e.stopPropagation();
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

      <div className="p-[18px]">
        <span className="text-[11px] tracking-[1px] text-[#9b9b9b] font-bold uppercase">
          {category}
        </span>
        {/* REDUZIDO: de text-lg para text-[15px] para ficar mais harmônico */}
        <h2 className="text-[15px] mt-[6px] font-extrabold text-[#111] leading-tight whitespace-pre-line uppercase">
          {title}
        </h2>
      </div>
    </div>
  );
}
import React from "react";

export default function Card({
  image,
  category,
  title,
  isBookmarked = false,
  onToggleBookmark,
  iconActive,
  iconInactive,
}) {
  return (
    <div className="w-full bg-[#e9e6e3] overflow-hidden font-sans">

      
      <div className="w-full h-[260px] overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex justify-between items-center p-[18px]">
        <div>
          <span className="text-[11px] tracking-[1px] text-[#9b9b9b] font-bold">{category}</span>
          <h2 className="text-lg mt-[6px] font-extrabold text-[#111] leading-tight whitespace-pre-line">{title}</h2>
        </div>

        <button
          className="bg-[#f1efed] border-none w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-90"
          onClick={onToggleBookmark}
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
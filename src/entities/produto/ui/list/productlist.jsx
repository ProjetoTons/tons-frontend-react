import React from "react";
import Card from "../card/card.jsx";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export default function ProductList({
  produtos,
  onSave,
  savedItems,
  onImageClick,
  isCarousel = false
}) {
  
  if (!isCarousel) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {produtos.map((produto) => (
          <div key={produto.id} className="w-full h-full flex">
            <Card
              produto={produto}
              iconActive="/icons/bookmark.png"
              iconInactive="/icons/empty.png"
              isBookmarked={savedItems?.some(item => item.id === produto.id)}
              onToggleBookmark={() => onSave(produto)}
              onImageClick={onImageClick}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className="w-full relative"
      style={{
        "--swiper-navigation-color": "#1A1A1A",
        "--swiper-navigation-size": "22px",
        "--swiper-navigation-sides-offset": "4px", 
      }}
    >
      <Swiper
        modules={[Navigation]}
        spaceBetween={24} 
        slidesPerView={1} 
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 }, 
        }}
        navigation={true}
        className="pb-16 !px-8 !-mx-8" 
      >
        {produtos.map((produto) => (
          <SwiperSlide key={produto.id} className="!h-auto">
            <div className="w-full h-full pt-1 pb-2 flex">
              <Card
                produto={produto}
                iconActive="/icons/bookmark.png"
                iconInactive="/icons/empty.png"
                isBookmarked={savedItems?.some(item => item.id === produto.id)}
                onToggleBookmark={() => onSave(produto)}
                onImageClick={onImageClick}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
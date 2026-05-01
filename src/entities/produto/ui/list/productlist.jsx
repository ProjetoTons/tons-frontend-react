import React, { useState } from "react";
import Card from "../card/card.jsx";
import SavedDrawer from "@/features/salvar-produto/ui/SaveDrawerFeatureUi.jsx";

export default function ProductList({ produtos }) {
  const [salvos, setSalvos] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const alternarSalvos = (id) => {
    if (salvos.includes(id)) {
      setSalvos(salvos.filter(i => i !== id));
    } else {
      setSalvos([...salvos, id]);
    }
  };

  const savedItems = produtos.filter(p => salvos.includes(p.id));

  return (
    <>
      <img
        className='w-[35px] cursor-pointer'
        onClick={() => setIsDrawerOpen(true)}
      />

      <div className="flex gap-5 p-5">
        {produtos.map((produto) => (
          <Card
            key={produto.id}
            image={produto.image}
            category={produto.category}
            title={produto.title}
            iconActive="/icons/bookmark.png"
            iconInactive="/icons/empty.png"
            isBookmarked={salvos.includes(produto.id)}
            onToggleBookmark={() => alternarSalvos(produto.id)}
          />
        ))}
      </div>

      <SavedDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        savedItems={savedItems}
      />
    </>
  );
}
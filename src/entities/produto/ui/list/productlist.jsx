import React from "react";
import Card from "../card/card.jsx";

// Agora o componente é "burro": ele só recebe props e repassa.
// Toda a lógica de estado (salvos e modal) vem da PortfolioPage.
export default function ProductList({ 
  produtos, 
  onSave, 
  savedItems, 
  onImageClick 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-5">
      {produtos.map((produto) => (
        <Card
          key={produto.id}
          produto={produto} // Passa o objeto inteiro para evitar erro de undefined
          iconActive="/icons/bookmark.png"
          iconInactive="/icons/empty.png"
          // Verifica se o ID do produto está na lista de salvos que vem da página pai
          isBookmarked={savedItems?.some(item => item.id === produto.id)}
          // Repassa a função de salvar
          onToggleBookmark={() => onSave(produto)}
          // Repassa a função que abre o modal ao clicar na imagem
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
}
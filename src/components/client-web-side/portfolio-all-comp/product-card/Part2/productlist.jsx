import React, { useState } from "react";
import Card from "../card/card";
import './list.css';

export default function ProductListPart2() {
    // Criamos o estado chamado 'favoritos' e a função 'setFavoritos' para atualizá-lo
    // Começa como um array vazio []
    const [salvos, setSalvos] = useState([]);


    const produtos = [
        {
            id: 1,
            image: "/product/foto-card.png",
            category: "Papelaria Premium",
            title: "Cartões de Visita"
        },
        {
            id: 2,
            image: "/product/foto-card.png",
            category: "Grandes Formatos",
            title: "Banners & Lonas"
        },
        {
            id: 3,
            image: "/product/foto-card.png",
            category: "Brindes Corporativos",
            title: "Canecas Custom"
        },
        {
            id: 4,
            image: "/product/foto-card.png",
            category: "Embalagens",
            title: "Embalagens"
        },
        

    ];

    // Função para alternar (ligar/desligar) o favorito
    const alternarSalvos = (id) => {
        // Verificamos se o ID do produto já está na nossa lista de favoritos
        const jaEstaSalvo = salvos.includes(id);

        if (jaEstaSalvo) {
            // Se já for favorito, criamos uma nova lista SEM esse ID (remover)
            const novaLista = salvos.filter(idSalvo => idSalvo !== id);
            setSalvos(novaLista);
        } else {
            // Se não for favorito, pegamos a lista atual e adicionamos o novo ID (adicionar)
            const novaLista = [...salvos, id];
            setSalvos(novaLista);
        }
    };

    return (
        <div className="product-list">
            {produtos.map((produto) => (
                <Card
                    key={produto.id}
                    image={produto.image}
                    category={produto.category}
                    title={produto.title}
                    iconActive="/icons/bookmark.png"
                    iconInactive="/icons/empty.png"

                    // Aqui passamos para o Card se ele deve estar "aceso" ou não
                    isBookmarked={salvos.includes(produto.id)}

                    // Quando o botão no Card for clicado, ele chama nossa função de alternar
                    onToggleBookmark={() => alternarSalvos(produto.id)}
                />
            ))}
        </div>
    );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockItensSalvos } from "@/entities/produto/api/mockItensSalvos";
import ProductModal from "@/features/modal-produto/modal-produto.jsx";

export default function ListaInteresseWidget() {
  const navigate = useNavigate();
  const [itemsSalvos, setItemsSalvos] = useState(mockItensSalvos);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoading = false;

  const handleOpenModal = (item) => {
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleRemoveItem = (item) => {
    setItemsSalvos((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleEnviarWhatsApp = () => {
    if (itemsSalvos.length === 0) return;

    const numero = import.meta.env.VITE_WHATSAPP_NUMERO || "5511999999999";
    const mensagem = itemsSalvos
      .map((item, i) => `${i + 1}. ${item.title} - ${item.category || "Produto"}`)
      .join("\n");

    const texto = encodeURIComponent(
      `Olá! Tenho interesse nos seguintes produtos:\n\n${mensagem}\n\nGostaria de solicitar um orçamento.`
    );

    window.open(`https://wa.me/${numero}?text=${texto}`, "_blank");
  };

  return (
    <div className="w-full flex gap-10 flex-wrap lg:flex-nowrap">
      {/* Coluna Esquerda: Lista de Produtos */}
      <section className="flex-1 min-w-0">
        <h1 className="text-[48px] leading-none font-black uppercase tracking-tight text-black" style={{ fontFamily: "var(--fonte-space)" }}>
          Lista de Interesses
        </h1>
        <p className="text-sm text-gray-600 mt-3 mb-8">
          Revise seus produtos selecionados antes de prosseguir com o orçamento.
        </p>

        {isLoading ? (
          <p className="text-gray-500 text-sm">Carregando itens...</p>
        ) : itemsSalvos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm mb-4">
              Nenhum item adicionado à lista de interesses.
            </p>
            <button
              onClick={() => navigate("/portfolio")}
              className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Explorar Portfólio
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {itemsSalvos.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-5 p-5 border border-gray-200 rounded-sm bg-white hover:shadow-sm transition-shadow"
              >
                <div
                  className="w-[80px] h-[80px] bg-gray-100 flex-shrink-0 rounded-sm overflow-hidden cursor-pointer group"
                  onClick={() => handleOpenModal(item)}
                >
                  <img
                    src={item.image || "/product/placeholder.png"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                    {item.category || item.type || "Produto"}
                  </span>
                  <h3 className="text-[14px] font-bold text-black uppercase mt-1">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    {item.description || ""}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveItem(item)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remover item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Coluna Direita: Resumo da Solicitação */}
      <aside className="w-full lg:w-[320px] flex-shrink-0">
        <div className="bg-[#F2F2F2] p-6 sticky top-4">
          <h2 className="text-[14px] font-black uppercase tracking-wide text-black mb-4" style={{ fontFamily: "var(--fonte-space)" }}>
            Resumo da Solicitação
          </h2>

          <div className="flex justify-between items-center py-3 border-b border-gray-300">
            <span className="text-[12px] text-gray-600 uppercase tracking-wider font-medium">
              Itens Selecionados
            </span>
            <span className="text-[14px] font-bold text-black">
              {itemsSalvos.length === 0 ? "Nenhum" : `${String(itemsSalvos.length).padStart(2, "0")} Unidades`}
            </span>
          </div>

          <button
            onClick={handleEnviarWhatsApp}
            disabled={itemsSalvos.length === 0 || isLoading}
            className="w-full mt-6 flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#1da851] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-[12px] tracking-[1px] uppercase transition-colors rounded-sm"
          >
            <img
              src="/icons/whatsapp.png"
              alt=""
              className="w-5 h-5"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            ENVIAR PARA WHATSAPP
          </button>

          <p className="text-[10px] text-gray-500 mt-3 leading-relaxed">
            Ao clicar, você será redirecionado para o WhatsApp para formalizar seu orçamento com nossos consultores técnicos.
          </p>
        </div>
      </aside>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        produto={selectedProduct}
      />
    </div>
  );
}

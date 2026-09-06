import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { adicionarProdutoInteresse } from "@/entities/produto/api/produtoInteresseApi";
import { getToken } from "@/shared/api/authToken";

export default function ProductModal({ isOpen, onClose, produto, onInteresse, hideInteresseButton = false }) {
  const navigate = useNavigate();

  if (!isOpen || !produto) return null;

  const btnListaInteresseHtml = `
    <div class="flex items-center justify-center gap-2 w-full">
      <img src="/icons/clipboard.png" alt="Lista" class="w-4 h-4 object-contain brightness-0 invert group-hover:invert-0 transition-all" />
      <span>Ir para Lista</span>
    </div>
  `;

const customSwalClasses = {
    // O ponto de exclamação (!) força o flex-nowrap a anular o CSS nativo do SweetAlert
    actions: '!flex !flex-row !flex-nowrap justify-center items-stretch gap-3 w-full max-w-[450px] mx-auto mt-4 cursor-pointer',
    
    // !w-1/2 e !m-0 cravam o botão em exatamente 50% do espaço, não importa o que o Swal tente fazer
    confirmButton: 'group !w-1/2 min-h-[44px] !m-0 flex items-center justify-center bg-[#1A1A1A] hover:bg-[#F7D708] text-white hover:text-black font-black uppercase text-[10px] tracking-widest px-2 py-2 transition-all duration-300 shadow-sm text-center leading-tight cursor-pointer',
    
    cancelButton: '!w-1/2 min-h-[44px] !m-0 flex items-center justify-center bg-[#EAEAEA] hover:bg-[#D4D4D4] text-gray-800 font-bold uppercase text-[10px] tracking-widest px-2 py-2 transition-all duration-300 text-center leading-tight cursor-pointer'
  };

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-2 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="modal-produto-title">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Caixa do Modal */}
      <div className="relative bg-white w-full max-w-[800px] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col h-auto max-h-[calc(100vh-1rem)] sm:max-h-[90vh] overflow-hidden sm:overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center gap-3 px-4 py-3 sm:px-10 sm:py-6 shrink-0">
          <h2 id="modal-produto-title" className="text-lg sm:text-2xl font-black uppercase tracking-tighter text-black line-clamp-2">
            {produto.title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="text-2xl sm:text-3xl font-light cursor-pointer hover:text-gray-500 transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3 sm:gap-8 px-4 sm:px-10 pb-4 sm:pb-10 min-h-0 overflow-hidden">

          {/* Lado Esquerdo: Imagem */}
          <div className="w-full md:w-1/2 h-47.5 sm:h-auto shrink-0">
            <img
              src={produto.image}
              alt={produto.title}
              className="w-full h-full sm:h-auto object-contain rounded-sm shadow-sm bg-[#f3f3f3]"
            />
          </div>

          {/* Lado Direito: Informações */}
          <div className="w-full md:w-1/2 flex flex-col justify-between min-h-0 overflow-hidden">
            <div>
              <h3 className="text-[10px] sm:text-[12px] font-black uppercase mb-2 sm:mb-4 tracking-widest text-gray-400">
                Descrição do Item
              </h3>

              {/* Bloco Industrial Cinza */}
              <div className="relative border-l-4 sm:border-l-[6px] border-[#F7D708] bg-[#EAEAEA] p-3 sm:p-6 mb-3 sm:mb-6">
                <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-[2px] block mb-1 sm:mb-2">Sobre</span>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium mb-2 sm:mb-4 line-clamp-4 sm:line-clamp-none">
                  {produto.description || "Especificações técnicas para produção industrial de alta fidelidade e acabamento premium."}
                </p>

                <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-[2px] block mb-1">Modelos Disponíveis</span>
                <p className="text-xs sm:text-sm font-bold text-black uppercase">Fosco / Chape / Cupe</p>
              </div>
            </div>

            {/* Botão de Ação */}
            {!hideInteresseButton && (
            <button
              onClick={async () => {
                if (!getToken()) {
                  onClose();
                  navigate("/login");
                  return;
                }

                try {
                  await adicionarProdutoInteresse(produto.id);
                  onInteresse && onInteresse(produto);
                  onClose();
                  
                  // MODAL DE SUCESSO
                  Swal.fire({
                    title: "Item Salvo!",
                    text: `${produto.title} foi adicionado à sua Lista de Interesse.`,
                    icon: "success",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: btnListaInteresseHtml,
                    // Não precisa de div extra aqui, o texto simples centraliza melhor na quebra de linha
                    cancelButtonText: "Continuar Escolhendo",
                    reverseButtons: true,
                    customClass: customSwalClasses
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate("/lista-interesse");
                    }
                  });

                } catch (err) {
                  onClose();
                  console.error("Erro ao adicionar à lista de interesse:", err);
                  
                  // MODAL DE AVISO - Produto duplicado
                  Swal.fire({
                    title: "Produto já está na lista!",
                    text: `"${produto.title}" já faz parte da sua Lista de Interesse. Você pode conferir seus itens salvos a qualquer momento.`,
                    icon: "info",
                    iconColor: "#F7D708",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: btnListaInteresseHtml,
                    cancelButtonText: "Continuar Escolhendo",
                    reverseButtons: true,
                    customClass: customSwalClasses
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate("/lista-interesse");
                    }
                  });
                }
              }}
              className="w-full bg-[#1A1A1A] text-white py-3 sm:py-5 font-black text-[10px] sm:text-[12px] tracking-[2px] sm:tracking-[3px] uppercase hover:bg-[#F7D708] hover:text-black transition-all duration-300 shadow-lg cursor-pointer shrink-0"
            >
              Enviar para Lista de Interesse
            </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
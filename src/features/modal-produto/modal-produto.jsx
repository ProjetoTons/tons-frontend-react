import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { adicionarProdutoInteresse } from "@/entities/produto/api/produtoInteresseApi";
import { getToken } from "@/shared/api/authToken";

export default function ProductModal({ isOpen, onClose, produto, onInteresse }) {
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
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Caixa do Modal */}
      <div className="relative bg-white w-full max-w-[800px] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col h-auto max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center px-10 py-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black">
            {produto.title}
          </h2>
          <button
            onClick={onClose}
            className="text-3xl font-light cursor-pointer hover:text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 px-10 pb-10">

          {/* Lado Esquerdo: Imagem */}
          <div className="w-full md:w-1/2">
            <img
              src={produto.image}
              alt={produto.title}
              className="w-full h-auto object-cover rounded-sm shadow-sm bg-[#f3f3f3]"
            />
          </div>

          {/* Lado Direito: Informações */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <h3 className="text-[12px] font-black uppercase mb-4 tracking-widest text-gray-400">
                Descrição do Item
              </h3>

              {/* Bloco Industrial Cinza */}
              <div className="relative border-l-[6px] border-[#F7D708] bg-[#EAEAEA] p-6 mb-6">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] block mb-2">Sobre</span>
                <p className="text-sm text-gray-800 leading-relaxed font-medium mb-4">
                  {produto.description || "Especificações técnicas para produção industrial de alta fidelidade e acabamento premium."}
                </p>

                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[2px] block mb-1">Modelos Disponíveis</span>
                <p className="text-sm font-bold text-black uppercase">Fosco / Chape / Cupe</p>
              </div>
            </div>

            {/* Botão de Ação */}
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
                  
                  // MODAL DE AVISO
                  Swal.fire({
                    title: "Item já adicionado!",
                    text: "Este produto já faz parte da sua Lista de Interesse. Deseja ir para a lista agora?",
                    icon: "info",
                    iconColor: "#F7D708", // Amarelo
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
              className="w-full bg-[#1A1A1A] text-white py-5 font-black text-[12px] tracking-[3px] uppercase hover:bg-[#F7D708] hover:text-black transition-all duration-300 shadow-lg cursor-pointer"
            >
              Enviar para Lista de Interesse
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
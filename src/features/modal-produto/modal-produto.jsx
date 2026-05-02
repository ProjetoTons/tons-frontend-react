import React from "react";

export default function ProductModal({ isOpen, onClose, produto }) {
  if (!isOpen || !produto) return null;

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
      {/* Backdrop - Sombreamento do fundo */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Caixa do Modal - AJUSTADA */}
      <div className="relative bg-white w-full max-w-[800px] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col h-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center px-10 py-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black">
            {produto.title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-3xl font-light cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Layout em duas colunas para aproveitar a largura (Opcional, mas recomendado para telas largas) */}
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
            <button className="w-full bg-[#1A1A1A] text-white py-5 font-black text-[12px] tracking-[3px] uppercase hover:bg-[#F7D708] hover:text-black transition-all duration-300 shadow-lg">
              Enviar para Lista de Interesse
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
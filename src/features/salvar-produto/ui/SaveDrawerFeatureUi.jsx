// src/features/salvar-produto/ui/SaveDrawerFeatureUi.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { adicionarProdutoInteresse } from "@/entities/produto/api/produtoInteresseApi";
import { getToken } from "@/shared/api/authToken";

export default function SaveDrawer({ isOpen, onClose, savedItems = [], isLoading = false, error = null, onToggleSave = () => {}, onImageClick = () => {}, onClearItems = () => {} }) {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  const btnListaInteresseHtml = `
    <div class="flex items-center justify-center gap-2 w-full">
      <img src="/icons/clipboard.png" alt="Lista" class="w-4 h-4 object-contain brightness-0 invert group-hover:invert-0 transition-all" />
      <span>Ir para Lista</span>
    </div>
  `;

  const customSwalClasses = {
    actions: '!flex !flex-row !flex-nowrap justify-center items-stretch gap-3 w-full max-w-[450px] mx-auto mt-4 cursor-pointer',
    confirmButton: 'group !w-1/2 min-h-[44px] !m-0 flex items-center justify-center bg-[#1A1A1A] hover:bg-[#F7D708] text-white hover:text-black font-black uppercase text-[10px] tracking-widest px-2 py-2 transition-all duration-300 shadow-sm text-center leading-tight cursor-pointer',
    cancelButton: '!w-1/2 min-h-[44px] !m-0 flex items-center justify-center bg-[#EAEAEA] hover:bg-[#D4D4D4] text-gray-800 font-bold uppercase text-[10px] tracking-widest px-2 py-2 transition-all duration-300 text-center leading-tight cursor-pointer'
  };

  const handleEnviarParaListaInteresse = async () => {
    if (savedItems.length === 0 || isSending) return;

    if (!getToken()) {
      onClose();
      navigate("/login");
      return;
    }

    setIsSending(true);
    setSendError(null);
    try {
      // Envia cada item sequencialmente para evitar race condition no backend
      const duplicatas = [];
      for (const item of savedItems) {
        try {
          await adicionarProdutoInteresse(item.id);
        } catch (err) {
          // Itens rejeitados = duplicatas (já existem na lista de interesse)
          duplicatas.push(item);
        }
      }

      onClearItems();
      onClose();

      // Se todos já estavam na lista
      if (duplicatas.length === savedItems.length) {
        Swal.fire({
          title: "Produto já está na lista!",
          text: savedItems.length === 1
            ? `"${savedItems[0].title}" já faz parte da sua Lista de Interesse. Você pode conferir seus itens salvos a qualquer momento.`
            : `Todos os ${savedItems.length} itens já fazem parte da sua Lista de Interesse.`,
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
      } else if (duplicatas.length > 0) {
        // Alguns novos, alguns duplicados
        const novos = savedItems.length - duplicatas.length;
        Swal.fire({
          title: "Itens Enviados!",
          text: `${novos} ${novos === 1 ? "item adicionado" : "itens adicionados"} à Lista de Interesse. ${duplicatas.length} já ${duplicatas.length === 1 ? "estava" : "estavam"} na lista.`,
          icon: "success",
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
      } else {
        // Todos enviados com sucesso
        Swal.fire({
          title: "Itens Enviados!",
          text: `${savedItems.length} ${savedItems.length === 1 ? "item foi adicionado" : "itens foram adicionados"} à sua Lista de Interesse.`,
          icon: "success",
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
    } catch (err) {
      console.error("Erro ao enviar para lista de interesse:", err);
      setSendError("Erro ao enviar. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[10000] transition-opacity duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-none sm:w-[80%] sm:max-w-[350px] bg-[#E0E0E0] z-[10001] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-8 pb-4">
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black transition-colors"
          >
            ✕
          </button>
          <h3 className="mt-6 font-black text-lg tracking-wide text-black uppercase">
            ITENS SALVOS
          </h3>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest leading-tight">
            {savedItems.length} {savedItems.length === 1 ? "item" : "itens"} selecionados
          </p>
        </div>

        {/* Lista de Itens */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">Carregando itens...</p>
            </div>
          ) : savedItems.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm text-center">
                Nenhum item salvo ainda.
                <br />
                Clique no bookmark nos produtos para adicionar.
              </p>
            </div>
          ) : (
            savedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onImageClick(item);
                  onClose();
                }}
                className="bg-white flex items-center p-4 mb-4 gap-4 rounded-sm shadow-sm relative group cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-[60px] h-[60px] bg-gray-100 flex-shrink-0 rounded-sm overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image || "/product/placeholder.svg"}
                    alt={item.title}
                    onError={(e) => { e.target.src = "/product/placeholder.svg"; }}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="text-[13px] font-bold text-black uppercase leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-gray-500 uppercase tracking-tighter">
                    {item.category || "Produto"}
                  </span>
                </div>
                <div className="ml-auto opacity-100">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleSave(item); }}
                    className="bg-[#f1efed] border-none w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-90 hover:bg-white shadow-sm"
                  >
                    <img
                      src="/icons/bookmark.png"
                      alt="bookmark"
                      className="w-[18px] h-[18px] object-contain"
                    />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-8 pt-4 border-t border-gray-300">
          {sendError && (
            <p className="mb-3 text-[11px] text-red-600 text-center">{sendError}</p>
          )}
          <button
            onClick={handleEnviarParaListaInteresse}
            disabled={savedItems.length === 0 || isLoading || isSending}
            className="w-full py-4 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black text-[12px] tracking-[2px] transition-colors uppercase shadow-md flex items-center justify-center gap-2"
          >
            {isSending
              ? "ENVIANDO..."
              : isLoading
              ? "SINCRONIZANDO..."
              : "ENVIAR PARA LISTA DE INTERESSE"}
          </button>
        </div>
      </aside>
    </>
  );
}
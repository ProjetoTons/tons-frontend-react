// src/features/salvar-produto/ui/SaveDrawerFeatureUi.jsx
import React from "react";

export default function SaveDrawer({ isOpen, onClose, savedItems = [], isLoading = false, error = null, onToggleSave = () => {} }) {
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
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[350px] bg-[#E0E0E0] z-[10001] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                className="bg-white flex items-center p-4 mb-4 gap-4 rounded-sm shadow-sm relative group cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-[60px] h-[60px] bg-gray-100 flex-shrink-0 rounded-sm overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image || "/product/placeholder.png"}
                    alt={item.title}
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
                    onClick={() => onToggleSave(item)}
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
          <button
            disabled={savedItems.length === 0 || isLoading}
            className="w-full py-4 bg-[#F7D708] hover:bg-[#e5c607] disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-black text-[12px] tracking-[2px] transition-colors uppercase shadow-md"
          >
            {isLoading ? "SINCRONIZANDO..." : "ENVIAR PARA LISTA DE INTERESSE"}
          </button>
        </div>
      </aside>
    </>
  );
}
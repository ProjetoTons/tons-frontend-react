import React from "react";

export default function SaveDrawer({ isOpen, onClose, savedItems = [] }) {
  return (
    <>
      {isOpen && <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[9998] cursor-pointer" onClick={onClose}></div>}

      <aside className={`fixed top-0 w-full max-w-[430px] h-screen bg-[#E0E0E0] z-[9999] transition-[right] duration-500 ease-in-out flex flex-col shadow-[-5px_0_15px_rgba(0,0,0,0.2)] p-[1%] ${isOpen ? 'right-0' : '-right-full'}`}>
        <div className="h-[15%] flex flex-col justify-evenly">
          <div>
            <button className="border border-solid border-[#E5E5E5] bg-[#E5E5E5] text-[30px] cursor-pointer" onClick={onClose}>✕</button>
          </div>

          <div className="flex justify-center text-[25px]">
            <h3 className="text-[25px] font-bold">ITENS SALVOS</h3>

          </div>
          <div>
            <p>Salve seus itens favoritos, para ter melhor acesso!</p>

          </div>
        </div>


        <div className="h-[80%] flex items-center">
          {savedItems.length === 0 ? (
            <p>Nenhum item salvo ainda.</p>
          ) : (
            savedItems.map((item) => (
              <div key={item.id} className="bg-white flex items-center p-[15px] mb-[15px] gap-[15px] rounded">
                <div>
                  <img className="w-[60px] h-[60px] object-cover" src={item.image} alt={item.title} />
                </div>
                <div>
                  <h4 className="text-base font-bold">{item.title}</h4>
                  <span>{item.category}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex h-[10%] items-end pb-[10%]">
          <button className="w-full py-[18px] bg-[#F7D708] border-none font-black text-[15px] cursor-pointer">
            ENVIAR PARA LISTA DE INTERESSE
          </button>
        </div>
      </aside>
    </>
  );
}
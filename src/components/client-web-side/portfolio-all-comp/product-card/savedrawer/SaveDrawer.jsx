import React from "react";
import "./savedrawer.css";

export default function SaveDrawer({ isOpen, onClose, savedItems = [] }) {
  return (
    <>
      {/* O Overlay só existe se o drawer estiver aberto */}
      {isOpen && <div className="drawer-overlay" onClick={onClose}></div>}

      <aside className={`drawer-container ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="espec1">
            <button className="drawer-close" onClick={onClose}>✕</button>
          </div>

          <div className="espec2">
            <h3>ITENS SALVOS</h3>

          </div>
          <div className="espec3">
            <p>Salve seus itens favoritos, para ter melhor acesso!</p>

          </div>
        </div>


        <div className="drawer-content">
          {savedItems.length === 0 ? (
            <p className="drawer-empty">Nenhum item salvo ainda.</p>
          ) : (
            savedItems.map((item) => (
              <div key={item.id} className="drawer-card">
                <div className="card-img-box">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="card-info">
                  <h4>{item.title}</h4>
                  <span>{item.category}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="drawer-footer">
          <button className="btn-send-list">
            ENVIAR PARA LISTA DE INTERESSE
          </button>
        </div>
      </aside>
    </>
  );
}
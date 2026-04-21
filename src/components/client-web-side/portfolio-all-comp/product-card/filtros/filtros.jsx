  import React from 'react';
  import './filtros.css'; // Vamos criar este arquivo abaixo

  function Filtros({ categoriaAtiva, aoMudar }) {
    const categorias = ["CORPORATIVO", "COMEMORAÇÕES", "FAMÍLIA"];

    return (
      <div className="filtros-container">
        {categorias.map(cat => (  
          <button 
            key={cat}
            // Se a categoria for a ativa, adiciona a classe 'active'
            className={`botao-filtro ${categoriaAtiva === cat ? 'active' : ''}`}
            onClick={() => aoMudar(cat)} >
            {cat}
          </button>
        ))}
      </div>
    );
  }

  export default Filtros;
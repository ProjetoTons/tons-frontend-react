import React, { useState } from 'react';
import './faq.css';

export default function FAQ() {
  const duvidas = [
    {
      id: 1,
      pergunta: "PORQUE NÃO TEM VALORES NOS PRODUTOS NO SITE ?",
      resposta: "Nossos produtos são personalizados e os valores dependem de variáveis como tiragem, material e acabamento. Cada projeto é único!"
    },
    {
      id: 2,
      pergunta: "VOCÊS POSSUEM LOJA FÍSICA OU O ATENDIMENTO É APENAS ONLINE?",
      resposta: "Nós possuimos Loja Física mas também possuimos, o site da Tons para facilitar a criação de orçamentos e visualização dos clientes."
    },
    {
      id: 3,
      pergunta: "QUAL DIFERENÇA PARA ITENS SALVOS PARA LISTA DE INTERESSES ?",
      resposta: "A lista de interesses facilita o agrupamento de vários produtos para que você solicite um orçamento único de forma rápida. A lista de salvos tem a função de salvar os itens favoritos do usuário."
    }
  ];

  const [abaAberta, setAbaAberta] = useState(null);

  const toggleAba = (id) => {
    setAbaAberta(abaAberta === id ? null : id);
  };

  return (
    <section className="faq-container">
      <h2 className="faq-title">DÚVIDAS FREQUENTES</h2>
      
      <div className="faq-list">
        {duvidas.map((item) => (
          <div key={item.id} className="faq-item">
            <button
              onClick={() => toggleAba(item.id)}
              className="faq-question"
            >
              <span>{item.pergunta}</span>
              <span className={`faq-icon ${abaAberta === item.id ? 'open' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </button>

            <div className={`faq-answer-container ${abaAberta === item.id ? 'show' : ''}`}>
              <div className="faq-answer-content">
                {item.resposta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
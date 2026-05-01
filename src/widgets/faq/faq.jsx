import React, { useState } from 'react';

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
    <section className="max-w-[800px] mx-auto my-10 px-5 font-sans">
      <h2 className="text-[28px] font-black mb-[30px] text-black">DÚVIDAS FREQUENTES</h2>
      
      <div className="border-t border-[#eee]">
        {duvidas.map((item) => (
          <div key={item.id} className="border-b border-[#eee]">
            <button
              onClick={() => toggleAba(item.id)}
              className="w-full flex justify-between items-center py-5 bg-transparent border-none cursor-pointer text-left text-sm font-bold tracking-[1px] text-black uppercase"
            >
              <span>{item.pergunta}</span>
              <span className={`w-5 h-5 text-[#1d1d1d] transition-transform duration-300 ${abaAberta === item.id ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </button>

            <div className={`overflow-hidden transition-all duration-400 ${abaAberta === item.id ? 'max-h-[200px] mt-[10px] mb-5' : 'max-h-0'}`}>
              <div className="text-sm leading-relaxed text-[#666]">
                {item.resposta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
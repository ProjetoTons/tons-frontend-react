import React from 'react';

function Filtros({ categoriaAtiva, aoMudar, busca, aoBuscar }) {
  const categorias = [
    { label: "TODOS", valor: "todos" },
    { label: "COPA DO MUNDO", valor: "copa_do_mundo" },
    { label: "VERÃO", valor: "verao" },
    { label: "ACESSÓRIOS P/ CELULAR", valor: "acessorios_p_celular" },
    { label: "ACESSÓRIOS PARA CARROS", valor: "acessorios_para_carros" },
    { label: "BAR E BEBIDAS", valor: "bar_e_bebidas" },
    { label: "BLOCOS E CADERNETAS", valor: "blocos_e_cadernetas" },
    { label: "BOLSAS TÉRMICAS", valor: "bolsas_termicas" },
    { label: "BRINQUEDOS", valor: "brinquedos" },
    { label: "CAIXAS DE SOM", valor: "caixas_de_som" },
    { label: "CANECAS", valor: "canecas" },
    { label: "CANETAS", valor: "canetas" },
    { label: "CARREGADORES", valor: "carregadores" },
    { label: "CASA", valor: "casa" },
    { label: "CHAVEIROS", valor: "chaveiros" },
    { label: "CONJUNTOS EXECUTIVOS", valor: "conjuntos_executivos" },
    { label: "COPOS", valor: "copos" },
    { label: "COZINHA", valor: "cozinha" },
    { label: "CUIDADOS PESSOAIS", valor: "cuidados_pessoais" },
    { label: "ESCRITÓRIO", valor: "escritorio" },
    { label: "ESPELHOS", valor: "espelhos" },
    { label: "ESPORTE E JOGOS", valor: "esporte_e_jogos" },
    { label: "ESTOJOS", valor: "estojos" },
    { label: "FERRAMENTAS", valor: "ferramentas" },
    { label: "FONES DE OUVIDO", valor: "fones_de_ouvido" },
    { label: "GUARDA-CHUVA", valor: "guarda_chuva" },
    { label: "INFORMÁTICA E TELEFONIA", valor: "informatica_e_telefonia" },
    { label: "KIT CHURRASCO", valor: "kit_churrasco" },
    { label: "KIT QUEIJO", valor: "kit_queijo" },
    { label: "LANTERNAS E LUMINÁRIAS", valor: "lanternas_e_luminarias" },
    { label: "LÁPIS E LAPISEIRAS", valor: "lapis_e_lapiseiras" },
    { label: "LINHA ECOLÓGICA", valor: "linha_ecologica" },
    { label: "LINHA FEMININA", valor: "linha_feminina" },
    { label: "LINHA MASCULINA", valor: "linha_masculina" },
    { label: "LINHA PET", valor: "linha_pet" },
    { label: "MALAS MOCHILAS BOLSAS", valor: "malas_mochilas_bolsas" },
    { label: "MICROFONES", valor: "microfones" },
    { label: "MODA E ESTILO", valor: "moda_e_estilo" },
    { label: "NÉCESSAIRES", valor: "necessaires" },
    { label: "PASTAS", valor: "pastas" },
    { label: "PEN DRIVES", valor: "pen_drives" },
    { label: "PETISQUEIRAS", valor: "petisqueiras" },
    { label: "PLAQUINHAS", valor: "plaquinhas" },
    { label: "PORTA CANETAS", valor: "porta_canetas" },
    { label: "PORTA RETRATOS", valor: "porta_retratos" },
    { label: "PORTA-DOCUMENTOS E ID", valor: "porta_documentos_e_id" },
    { label: "RELÓGIOS", valor: "relogios" },
    { label: "SACOLAS E SACOCHILAS", valor: "sacolas_e_sacochilas" },
    { label: "SQUEEZES E GARRAFAS", valor: "squeezes_e_garrafas" },
    { label: "TÁBUAS", valor: "tabuas" },
    { label: "UMIDIFICADORES", valor: "umidificadores" }

  ];

  return (
    <section className="w-full bg-[#F2F2F2] px-10 py-10">
      <h2 className="text-[var(--preto-neutro)] text-2xl font-bold uppercase tracking-wide mb-6" style={{ fontFamily: 'var(--fonte-space)' }}>
        Explore nosso portfólio
      </h2>

      <div className="flex items-center justify-between gap-6 flex-wrap">
        {/* Filtros por categoria */}
        <div className="flex gap-3 flex-wrap">
          {categorias.map(cat => (
            <button
              key={cat.valor}
              className={`px-6 py-[10px] text-xs font-bold tracking-[1px] uppercase cursor-pointer border-2 transition-all duration-300 outline-none relative overflow-hidden active:scale-95 active:shadow-lg ${categoriaAtiva === cat.valor
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-400 hover:bg-[var(--amarelo-base)] hover:text-black hover:border-black'
                }`}
              onClick={() => aoMudar(cat.valor)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Barra de Busca */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Buscar..."
            value={busca}
            onChange={(e) => aoBuscar(e.target.value)}
            className="bg-white border border-black rounded-md px-3 py-2 pr-10 w-[250px] focus:outline-none focus:ring-1 focus:ring-[var(--amarelo-base)] transition-all text-sm"
          />
          <img
            src="/icons/search.png"
            alt="Buscar"
            className="absolute right-3 w-4 h-4 opacity-70"
          />
        </div>
      </div>
    </section>
  );
}

export default Filtros;
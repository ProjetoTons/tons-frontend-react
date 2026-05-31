import React, { useState } from 'react';

function Filtros({ categoriaAtiva, aoMudar, busca, aoBuscar }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categoriasAgrupadas = [
    {
      id: "papelaria",
      label: "CAT-01",
      nome: "Papelaria Corporativa",
      itemCount: 24,
      subcategorias: [
        { label: "Blocos e Cadernetas", valor: "blocos_e_cadernetas" },
        { label: "Canetas", valor: "canetas" },
        { label: "Lápis e Lapiseiras", valor: "lapis_e_lapiseiras" },
        { label: "Porta Canetas", valor: "porta_canetas" },
        { label: "Pastas", valor: "pastas" },
        { label: "Porta-Documentos e ID", valor: "porta_documentos_e_id" },
        { label: "Plaquinhas", valor: "plaquinhas" },
        { label: "Conjuntos Executivos", valor: "conjuntos_executivos" },
        { label: "Porta Retratos", valor: "porta_retratos" }
      ]
    },
    {
      id: "embalagens",
      label: "CAT-02",
      nome: "Embalagens Premium",
      itemCount: 18,
      subcategorias: [
        { label: "Caixas Personalizadas", valor: "caixas_personalizadas" },
        { label: "Sacos e Envelopes", valor: "sacos_e_envelopes" },
        { label: "Papel de Embrulho", valor: "papel_embrulho" },
        { label: "Fitas e Laços", valor: "fitas_e_lacos" },
        { label: "Adesivos", valor: "adesivos" }
      ]
    },
    {
      id: "impressao",
      label: "CAT-03",
      nome: "Impressão Digital",
      itemCount: 42,
      subcategorias: [
        { label: "Cartões de Visita", valor: "cartoes_visita" },
        { label: "Flyers e Panfletos", valor: "flyers_panfletos" },
        { label: "Banners", valor: "banners" },
        { label: "Adesivos Personalizados", valor: "adesivos_personalizados" },
        { label: "Impressão Offset", valor: "impressao_offset" }
      ]
    },
    {
      id: "editorial",
      label: "CAT-04",
      nome: "Editorial & Books",
      itemCount: 12,
      subcategorias: [
        { label: "Livros Personalizados", valor: "livros_personalizados" },
        { label: "Catálogos", valor: "catalogos" },
        { label: "Revistas", valor: "revistas" },
        { label: "E-books", valor: "ebooks" }
      ]
    },
    {
      id: "branding",
      label: "CAT-05",
      nome: "Branding & Kits",
      itemCount: 31,
      subcategorias: [
        { label: "Identidade Visual", valor: "identidade_visual" },
        { label: "Kits Completos", valor: "kits_completos" },
        { label: "Assinadores", valor: "assinadores" },
        { label: "Selos", valor: "selos" }
      ]
    },
    {
      id: "formatos",
      label: "CAT-06",
      nome: "Grandes Formatos",
      itemCount: 9,
      subcategorias: [
        { label: "Outdoor", valor: "outdoor" },
        { label: "Backlight", valor: "backlight" },
        { label: "Lona Vinílica", valor: "lona_vinil" },
        { label: "Envelopamento", valor: "envelopamento" }
      ]
    },
    {
      id: "adesivos",
      label: "CAT-07",
      nome: "Adesivos & Labels",
      itemCount: 15,
      subcategorias: [
        { label: "Etiquetas Personalizadas", valor: "etiquetas_personalizadas" },
        { label: "Rótulos", valor: "rotulos" },
        { label: "Adesivos de Vinil", valor: "adesivos_vinil" },
        { label: "Labels Holográficas", valor: "labels_hologaficas" }
      ]
    },
    {
      id: "acabamentos",
      label: "CAT-08",
      nome: "Acabamentos Especiais",
      itemCount: 6,
      subcategorias: [
        { label: "Laminação", valor: "laminacao" },
        { label: "Plastificação", valor: "plastificacao" },
        { label: "Verniz", valor: "verniz" },
        { label: "Relevo", valor: "relevo" }
      ]
    },
    {
      id: "tecnologia",
      label: "CAT-09",
      nome: "Tecnologia & Eletrônicos",
      itemCount: 27,
      subcategorias: [
        { label: "Acessórios p/ Celular", valor: "acessorios_p_celular" },
        { label: "Informática e Telefonia", valor: "informatica_e_telefonia" },
        { label: "Carregadores", valor: "carregadores" },
        { label: "Fones de Ouvido", valor: "fones_de_ouvido" },
        { label: "Pen Drives", valor: "pen_drives" }
      ]
    }
  ];

  const handleSubcategoryClick = (valor) => {
    aoMudar(valor);
    setHoveredCategory(null);
  };

  return (
    <section className="w-full bg-white px-8 py-10">
      {/* Header com Título */}
      <div className="mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tight text-black" style={{ fontFamily: 'var(--fonte-space)' }}>
          Explore nosso portfólio!
        </h2>
      </div>

      {/* Grid de Categorias */}
      <div className="mb-6">
        {/* Botão TODOS */}
        <div className="mb-6">
          <button
            onClick={() => aoMudar("todos")}
            className={`px-6 py-2 font-black uppercase tracking-widest text-xs transition-all duration-300 border-2 cursor-pointer ${categoriaAtiva === "todos"
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-black hover:bg-black hover:text-white'
              }`}
          >
            TODOS
          </button>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoriasAgrupadas.map((categoria) => (
            <div
              key={categoria.id}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(categoria.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Card da Categoria Principal */}
              <div className="h-32 g-gradient-to-br from-gray-50 to-white p-5 flex flex-col justify-between text-left cursor-pointer hover:from-gray-100 hover:to-gray-50 transition-all duration-300 group-hover:shadow-md border-2 border-black">
                <div>
                  <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">
                    {categoria.label}
                  </p>
                  <h3 className="text-lg font-black uppercase text-gray-900 leading-tight">
                    {categoria.nome}
                  </h3>
                </div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {categoria.itemCount} itens
                </p>
              </div>

              {/* Dropdown com Subcategorias */}
              {hoveredCategory === categoria.id && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-black shadow-lg z-50 max-h-80 overflow-y-auto animate-in fade-in duration-200">
                  <div className="divide-y divide-gray-100">
                    {categoria.subcategorias.map((subcategoria, index) => (
                      <button
                        key={index}
                        onClick={() => handleSubcategoryClick(subcategoria.valor)}
                        className="w-full cursor-pointer px-5 py-3 text-left text-xs font-medium text-gray-700 hover:bg-black hover:text-white transition-colors uppercase tracking-wide"
                      >
                        {subcategoria.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Barra de Pesquisa Abaixo - Alinhada à Direita */}
      <div className="flex justify-end mt-8">
        <div className="w-full max-w-xs">
          <div className="relative">
            <input
              type="text"
              placeholder="Localizar serviço ou produto..."
              value={busca}
              onChange={(e) => aoBuscar(e.target.value)}
              className="w-full bg-transparent border-b-2 border-gray-300 px-0 py-2 text-xs font-medium placeholder-gray-400 text-gray-700 focus:outline-none focus:border-black transition-colors"
            />
            <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Filtros;
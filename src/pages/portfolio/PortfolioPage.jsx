import React, { useState, useRef, useEffect } from 'react'; 
import TopbarFix from '@/widgets/topbar-cliente/topbar-fix.jsx'
import Navbar from '@/widgets/navbar-cliente/navbar.jsx'
import SectionNomeBanner from '@/widgets/section-nome-banner/section-nome-banner.jsx'
import DestaqueBanner from '@/widgets/destaque-banner/destaque-banner.jsx'
import Filtros from '@/features/filtrar-produtos/ui/filtrosFeatureUi.jsx'
import FAQ from '@/widgets/faq/faq.jsx'
import Footer from '@/widgets/footer/footer.jsx'
import ProductList from '@/entities/produto/ui/list/productlist.jsx'
import SaveDrawer from '@/features/salvar-produto/ui/SaveDrawerFeatureUi.jsx'
import MobileMenu from '@/features/mobile-menu/mobile-menu.jsx' 
import ProductModal from '@/features/modal-produto/modal-produto.jsx';

import { useSaveDrawer } from '@/features/salvar-produto/model/useSaveDrawerFeatureModel'
import { getProdutos } from '@/entities/produto/api/getProdutos'

export default function PortfolioPage() {
  const { isDrawerOpen, itemsSalvos, openDrawer, closeDrawer, toggleSaveProduct, isLoading, error } = useSaveDrawer()
  const produtosRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [mostrarDestaque, setMostrarDestaque] = useState(false);
  const [busca, setBusca] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);

  // NOVO ESTADO: Controla se o usuário clicou para ver TODAS as categorias do site
  const [mostrarTodasCategorias, setMostrarTodasCategorias] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getProdutos()
      .then((data) => setProdutos(data))
      .finally(() => setCarregandoProdutos(false));
  }, []);

  const categorias = React.useMemo(() => {
    const map = new Map();
    produtos.forEach((p) => {
      if (p.type) {
        if (!map.has(p.type)) {
          map.set(p.type, { slug: p.type, nome: p.category, count: 0 });
        }
        map.get(p.type).count++;
      }
    });
    return Array.from(map.values());
  }, [produtos]);

  useEffect(() => {
    if (produtosRef.current && categoriaAtiva !== "todos") {
      setTimeout(() => produtosRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [categoriaAtiva]);

  useEffect(() => {
    if (mostrarDestaque && produtosRef.current) {
      setTimeout(() => produtosRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [mostrarDestaque]);

  const buscaTrim = busca.trim();
  const query = buscaTrim.toLowerCase();
  const matchedProducts = buscaTrim
    ? produtos.filter(p => p.title?.toLowerCase().includes(query))
    : [];

  const handleOpenModal = (produto) => {
    setSelectedProduct(produto);
    setIsModalOpen(true);
  };

  const renderizarCategoria = (titulo, tipo) => {
    if (categoriaAtiva !== "todos" && categoriaAtiva !== tipo) return null;

    let listaFiltrada = produtos.filter(p => p.type === tipo);
    if (busca.trim()) listaFiltrada = listaFiltrada.filter(p => p.title?.toLowerCase().includes(busca.toLowerCase()));
    if (mostrarDestaque) listaFiltrada = listaFiltrada.filter(p => p.destaque === true);

    return (
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-1.5 w-10 bg-yellow-400 rounded-full"></div>
          <h2 className="text-2xl font-black uppercase tracking-wide text-black">{titulo}</h2>
        </div>
        
        {listaFiltrada.length > 0 ? (
          // isCarousel={true} injetado aqui!
          <ProductList 
            produtos={listaFiltrada} 
            onSave={toggleSaveProduct} 
            savedItems={itemsSalvos}
            onImageClick={handleOpenModal}
            isCarousel={true} 
          />
        ) : (
          <div className="bg-[#F9F9F9] border-l-4 border-[#F7D708] p-5">
            <p className="text-gray-500 font-medium text-sm uppercase tracking-widest">
              Ainda não temos produtos cadastrados em {titulo}.
            </p>
          </div>
        )}
      </div>
    );
  };

  const handleMudarFiltro = (filtro) => {
    setBusca("");
    setMostrarDestaque(false);
    if (categoriaAtiva === filtro) setCategoriaAtiva("todos");
    else setCategoriaAtiva(filtro);
  };

  const handleVerColecaoDestaque = () => {
    setBusca("");
    setMostrarDestaque(true);
    setCategoriaAtiva("todos");
  };

  // LÓGICA DO LIMITE DE 3 CATEGORIAS
  const isFiltrando = categoriaAtiva !== "todos" || buscaTrim !== "" || mostrarDestaque;
  // Se estiver filtrando ou já clicou em expandir, mostra tudo. Senão, corta nas 3 primeiras.
  const categoriasExibidas = (isFiltrando || mostrarTodasCategorias) ? categorias : categorias.slice(0, 3);
  const temMaisCategorias = !isFiltrando && !mostrarTodasCategorias && categorias.length > 3;

  return (
    <>
      <Navbar onOpenDrawer={openDrawer} onOpenMenu={() => setIsMenuOpen(true)} />
      <div className="h-[80px]"></div>
      
      <SectionNomeBanner />
      <DestaqueBanner onVerColecao={handleVerColecaoDestaque} />
      <Filtros 
        categoriaAtiva={categoriaAtiva} 
        aoMudar={handleMudarFiltro}
        busca={busca}
        aoBuscar={setBusca}
        categorias={categorias}
      />

      <section className="px-10 py-12 bg-gradient-to-b from-white to-gray-50" ref={produtosRef}>
        {mostrarDestaque && (
          <div className="mb-8 p-4 bg-yellow-400 border-l-4 border-black rounded-lg">
            <p className="text-black font-bold text-sm uppercase tracking-wide">
              Mostrando apenas produtos destaque do mês
              <button onClick={() => { setMostrarDestaque(false); setCategoriaAtiva("todos"); }} className="ml-2 underline hover:no-underline font-black">
                Limpar
              </button>
            </p>
          </div>
        )}
        
        {carregandoProdutos ? (
          <div className="flex justify-center py-16">
            <p className="text-gray-500 font-medium text-sm uppercase tracking-widest">Carregando produtos...</p>
          </div>
        ) : buscaTrim ? (
          matchedProducts.length > 0 ? (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1.5 w-10 bg-yellow-400 rounded-full"></div>
                <h2 className="text-2xl font-black uppercase tracking-wide text-black">Resultados para "{buscaTrim}"</h2>
              </div>
              {/* Resultados da busca ficam em Grid normal (sem carrossel) para melhor visualização */}
              <ProductList
                produtos={matchedProducts}
                onSave={toggleSaveProduct}
                savedItems={itemsSalvos}
                onImageClick={handleOpenModal}
              />
            </div>
          ) : (
            <div className="mb-12 p-6 bg-white border-l-4 border-yellow-400 rounded">
              <h3 className="text-lg font-black uppercase tracking-wide">Nenhum produto encontrado</h3>
              <p className="text-sm text-gray-600 mt-2">
                Não encontramos nenhum produto com o nome "{buscaTrim}". Verifique a grafia ou limpe a busca.
              </p>
            </div>
          )
        ) : (
          <>
            {categoriasExibidas.map(({ nome, slug }) => (
              <React.Fragment key={slug}>
                {renderizarCategoria(nome, slug)}
              </React.Fragment>
            ))}

            {/* Botão de Expandir Categorias no fim da seção */}
            {temMaisCategorias && (
              <div className="flex justify-center mt-4 mb-8">
                <button 
                  onClick={() => setMostrarTodasCategorias(true)}
                  className="px-10 py-4 bg-transparent border-2 border-[#1A1A1A] text-[#1A1A1A] font-black text-[12px] tracking-[3px] uppercase hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
                >
                  Ver todas as Categorias do Catálogo
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <FAQ />
      <Footer />

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} produto={selectedProduct} />

      <SaveDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        savedItems={itemsSalvos}
        isLoading={isLoading}
        error={error}
        onToggleSave={toggleSaveProduct}
        onImageClick={handleOpenModal}
      />

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}
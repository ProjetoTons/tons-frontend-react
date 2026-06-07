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
import { produtos } from '@/entities/produto/api/mockProdutos'

export default function PortfolioPage() {
  const { isDrawerOpen, itemsSalvos, openDrawer, closeDrawer, toggleSaveProduct, isLoading, error } = useSaveDrawer()
  const produtosRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [mostrarDestaque, setMostrarDestaque] = useState(false);
  const [busca, setBusca] = useState("");

  // ESTADO DO MODAL DE PRODUTOS
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Efeito para fazer scroll suave quando a categoria ativa muda
  useEffect(() => {
    if (produtosRef.current && categoriaAtiva !== "todos") {
      setTimeout(() => {
        produtosRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [categoriaAtiva]);

  // Efeito para fazer scroll quando ativa o filtro de destaque
  useEffect(() => {
    if (mostrarDestaque && produtosRef.current) {
      setTimeout(() => {
        produtosRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [mostrarDestaque]);

  // Preparar busca por substring (contém), case-insensitive
  const buscaTrim = busca.trim();
  const query = buscaTrim.toLowerCase();
  const matchedProducts = buscaTrim
    ? produtos.filter(p => p.title?.toLowerCase().includes(query))
    : [];

  // Função para abrir o modal com o produto específico
  const handleOpenModal = (produto) => {
    setSelectedProduct(produto);
    setIsModalOpen(true);
  };

  // LÓGICA DE RENDERIZAÇÃO: Unifica a verificação de itens e a passagem de funções
  const renderizarCategoria = (titulo, tipo) => {
    // Se há um filtro ativo diferente de "todos", mostrar apenas essa categoria
    if (categoriaAtiva !== "todos" && categoriaAtiva !== tipo) {
      return null;
    }

    let listaFiltrada = produtos.filter(p => p.type === tipo);
    
    // Filtrar por busca
    if (busca.trim()) {
      listaFiltrada = listaFiltrada.filter(p => 
        p.title?.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Se destaque está ativo, filtrar apenas produtos destacados
    if (mostrarDestaque) {
      listaFiltrada = listaFiltrada.filter(p => p.destaque === true);
    }

    return (
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-1.5 w-10 bg-yellow-400 rounded-full"></div>
          <h2 className="text-2xl font-black uppercase tracking-wide text-black">{titulo}</h2>
        </div>
        
        {listaFiltrada.length > 0 ? (
          <ProductList 
            produtos={listaFiltrada} 
            onSave={toggleSaveProduct} 
            savedItems={itemsSalvos}
            onImageClick={handleOpenModal}
          />
        ) : (
          /* MENSAGEM PADRÃO CASO NÃO HAJA PRODUTOS NA CATEGORIA */
          <div className="bg-[#F9F9F9] border-l-4 border-[#F7D708] p-5">
            <p className="text-gray-500 font-medium text-sm uppercase tracking-widest">
              Ainda não temos produtos cadastrados em {titulo}.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Função para mudar o filtro ativo
  const handleMudarFiltro = (filtro) => {
    // Limpar busca quando filtro é alterado
    setBusca("");
    
    // Desativar filtro de destaque quando ativar outro filtro
    setMostrarDestaque(false);
    
    // Se clicou no mesmo filtro, volta para "todos"
    if (categoriaAtiva === filtro) {
      setCategoriaAtiva("todos");
    } else {
      // Caso contrário, ativa o novo filtro
      setCategoriaAtiva(filtro);
    }
  };

  // Função para ativar filtro de destaque
  const handleVerColecaoDestaque = () => {
    // Limpar busca quando ativa destaque
    setBusca("");
    
    setMostrarDestaque(true);
    setCategoriaAtiva("todos");
  };

  return (
    <>
      <Navbar 
        onOpenDrawer={openDrawer} 
        onOpenMenu={() => setIsMenuOpen(true)} 
      />
      {/* Espaçador para compensar navbar fixa */}
      <div className="h-[80px]"></div>
      
      <SectionNomeBanner />
      <DestaqueBanner onVerColecao={handleVerColecaoDestaque} />
      <Filtros 
        categoriaAtiva={categoriaAtiva} 
        aoMudar={handleMudarFiltro}
        busca={busca}
        aoBuscar={setBusca}
      />

      {/* SEÇÃO DE PRODUTOS POR CATEGORIA */}
      <section className="px-10 py-12 bg-gradient-to-b from-white to-gray-50" ref={produtosRef}>
        {/* Indicador de Filtro Destaque Ativo */}
        {mostrarDestaque && (
          <div className="mb-8 p-4 bg-yellow-400 border-l-4 border-black rounded-lg">
            <p className="text-black font-bold text-sm uppercase tracking-wide">
              Mostrando apenas produtos destaque do mês
              <button 
                onClick={() => {
                  setMostrarDestaque(false);
                  setCategoriaAtiva("todos");
                }}
                className="ml-2 underline hover:no-underline font-black"
              >              </button>
            </p>
          </div>
        )}
        
        {buscaTrim ? (
          matchedProducts.length > 0 ? (
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1.5 w-10 bg-yellow-400 rounded-full"></div>
                <h2 className="text-2xl font-black uppercase tracking-wide text-black">Resultados para "{buscaTrim}"</h2>
              </div>
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
            {renderizarCategoria("Acessórios p/ Celular", "acessorios_celular")}
            {renderizarCategoria("Bar e Bebidas", "bar_bebidas")}
            {renderizarCategoria("Blocos e Cadernetas", "blocos_cadernetas")}
            {renderizarCategoria("Bolsas Térmicas", "bolsas_termicas")}
            {renderizarCategoria("Caixa de Som", "caixa_som")}
            {renderizarCategoria("Caneca", "caneca")}
            {renderizarCategoria("Chaveiros", "chaveiros")}
            {renderizarCategoria("Copos Térmicos", "copos_termicos")}
            {renderizarCategoria("Cozinha", "cozinha")}
            {renderizarCategoria("Cuidados Pessoais", "cuidados_pessoais")}
            {renderizarCategoria("Escritório", "escritorio")}
            {renderizarCategoria("Esporte e Jogos", "esporte_jogos")}
            {renderizarCategoria("Caneta", "caneta")}
            {renderizarCategoria("Estojo", "estojo")}
            {renderizarCategoria("Ferramentas", "ferramentas")}
            {renderizarCategoria("Lanternas e Luminárias", "lanternas_luminarias")}
          </>
        )}
      </section>

      <FAQ />
      <Footer />

      {/* COMPONENTES DE SOBREPOSIÇÃO (MODALS E DRAWERS) */}
      
      {/* Modal Centralizado de Detalhes do Produto */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        produto={selectedProduct} 
      />

      {/* Drawer Lateral de Itens Salvos */}
      <SaveDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        savedItems={itemsSalvos}
        isLoading={isLoading}
        error={error}
        onToggleSave={toggleSaveProduct}
        onImageClick={handleOpenModal}
      />

      {/* Menu Mobile / Configurações */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  )
}
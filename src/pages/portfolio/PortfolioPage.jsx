import React, { useState } from 'react'; 
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
  const { isDrawerOpen, itemsSalvos, openDrawer, closeDrawer, toggleSaveProduct } = useSaveDrawer()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ESTADO DO MODAL DE PRODUTOS
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para abrir o modal com o produto específico
  const handleOpenModal = (produto) => {
    setSelectedProduct(produto);
    setIsModalOpen(true);
  };

  // LÓGICA DE RENDERIZAÇÃO: Unifica a verificação de itens e a passagem de funções
  const renderizarCategoria = (titulo, tipo) => {
    const listaFiltrada = produtos.filter(p => p.type === tipo);

    return (
      <div className="mb-12">
        <h2 className="text-2xl font-black uppercase tracking-wide mb-6">{titulo}</h2>
        
        {listaFiltrada.length > 0 ? (
          <ProductList 
            produtos={listaFiltrada} 
            onSave={toggleSaveProduct} 
            savedItems={itemsSalvos}
            onImageClick={handleOpenModal} // Passa a função para abrir o modal ao clicar na imagem
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

  return (
    <>
      <TopbarFix />
      <Navbar 
        onOpenDrawer={openDrawer} 
        onOpenMenu={() => setIsMenuOpen(true)} 
      />
      
      <SectionNomeBanner />
      <DestaqueBanner />
      <Filtros />

      {/* SEÇÃO DE PRODUTOS POR CATEGORIA */}
      <section className="px-10 py-10">
        {renderizarCategoria("Papelaria", "papelaria")}
        {renderizarCategoria("Banners", "banner")}
        {renderizarCategoria("Brindes", "brinde")}
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
      />

      {/* Menu Mobile / Configurações */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  )
}
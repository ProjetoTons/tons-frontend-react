import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './app/styles/App.css'
import StatusBadge from './components/business-web-side/StatusBadge'
import PageHeader from './components/business-web-side/PageHeader'
import TopNavBar from './components/business-web-side/TopNavBar'
import PedidosPage from './components/business-web-side/PedidosPage'
import TopbarFix from './components/client-web-side/portfolio-all-comp/topbar-allpage/topbar-fix.jsx'
import Navbar from './components/client-web-side/portfolio-all-comp/navbar/navbar.jsx'
import SectionNomeBanner from './components/client-web-side/portfolio-all-comp/section-nome-banner/section-nome-banner.jsx'
import DestaqueBanner from './components/client-web-side/portfolio-all-comp/destaque-banner/destaque-banner.jsx'
import Filtros from './components/client-web-side/portfolio-all-comp/product-card/filtros/filtros.jsx'
import FAQ from './components/client-web-side/portfolio-all-comp/faq/faq.jsx'
import Footer from './components/client-web-side/portfolio-all-comp/footer/footer.jsx'
import ProductList from "./components/client-web-side/portfolio-all-comp/product-card/Product/productlist.jsx";

// Importe o SaveDrawer
import SaveDrawer from "./components/client-web-side/portfolio-all-comp/product-card/savedrawer/SaveDrawer.jsx";
import { produtos } from "./data-mock/products"

function App() {
  // ESTADO PARA ABRIR/FECHAR O DRAWER
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // ESTADO PARA OS ITENS SALVOS
  const [itemsSalvos, setItemsSalvos] = useState([]);

  return (
    <>
    <PedidosPage />
      <TopbarFix />
      
      {/* CORREÇÃO: Mudado para true para que o botão da Navbar ABRA o drawer */}
      <Navbar onOpenDrawer={() => setIsDrawerOpen(true)} />
      
      <SectionNomeBanner />
      <DestaqueBanner />
      <Filtros />

      <section style={{ padding: '0 40px' }}>
        <h2>Papelaria</h2>
        <ProductList produtos={produtos.filter(p => p.type === "papelaria")} />

        <h2>Banners</h2>
        <ProductList produtos={produtos.filter(p => p.type === "banner")} />

        <h2>Brindes</h2>
        <ProductList produtos={produtos.filter(p => p.type === "brinde")} />
      </section>

      <FAQ />
      <Footer />

      {/* O COMPONENTE DRAWER FICA FORA DO CONTEÚDO PRINCIPAL PARA NÃO BUGAR O LAYOUT */}
      <SaveDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        savedItems={itemsSalvos}
      />
    </>
  )
}

export default App;
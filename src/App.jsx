import TopbarFix from './components/client-web-side/portfolio-all-comp/topbar-allpage/topbar-fix.jsx'
import Navbar from './components/client-web-side/portfolio-all-comp/navbar/navbar.jsx'
import SectionNomeBanner from './components/client-web-side/portfolio-all-comp/section-nome-banner/section-nome-banner.jsx'
import DestaqueBanner from './components/client-web-side/portfolio-all-comp/destaque-banner/destaque-banner.jsx'
import ProductList from './components/client-web-side/portfolio-all-comp/product-card/Part1/productlist.jsx';
import ProductListPart2 from './components/client-web-side/portfolio-all-comp/product-card/Part2/productlist.jsx';
import ProductListPart3 from './components/client-web-side/portfolio-all-comp/product-card/Part3/productlist.jsx';
import Filtros from './components/client-web-side/portfolio-all-comp/product-card/filtros/filtros.jsx';
import FAQ from './components/client-web-side/portfolio-all-comp/faq/faq.jsx';
import Footer from './components/client-web-side/portfolio-all-comp/footer/footer.jsx';


function App() {
  
  return (
    <>
      <TopbarFix />
      <Navbar />
      <SectionNomeBanner />
      <DestaqueBanner />
      <Filtros />
      <ProductList />
      <ProductListPart2/>
      <ProductList />
      <FAQ />
      <Footer/>

    </>
  )
}

export default App
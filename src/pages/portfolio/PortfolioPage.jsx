import TopbarFix from '@/widgets/topbar-cliente/topbar-fix.jsx'
import Navbar from '@/widgets/navbar-cliente/navbar.jsx'
import SectionNomeBanner from '@/widgets/section-nome-banner/section-nome-banner.jsx'
import DestaqueBanner from '@/widgets/destaque-banner/destaque-banner.jsx'
import Filtros from '@/features/filtrar-produtos/ui/filtros.jsx'
import FAQ from '@/widgets/faq/faq.jsx'
import Footer from '@/widgets/footer/footer.jsx'
import ProductList from '@/entities/produto/ui/list/productlist.jsx'
import SaveDrawer from '@/features/salvar-produto/ui/SaveDrawer.jsx'
import { useSaveDrawer } from '@/features/salvar-produto/model/useSaveDrawer'
import { produtos } from '@/entities/produto/api/mockProdutos'

export default function PortfolioPage() {
  const { isDrawerOpen, itemsSalvos, openDrawer, closeDrawer } = useSaveDrawer()

  return (
    <>
      <TopbarFix />
      <Navbar onOpenDrawer={openDrawer} />
      <SectionNomeBanner />
      <DestaqueBanner />
      <Filtros />

      <section style={{ padding: '0 40px' }}>
        <h2>Papelaria</h2>
        <ProductList produtos={produtos.filter(p => p.type === 'papelaria')} />

        <h2>Banners</h2>
        <ProductList produtos={produtos.filter(p => p.type === 'banner')} />

        <h2>Brindes</h2>
        <ProductList produtos={produtos.filter(p => p.type === 'brinde')} />
      </section>

      <FAQ />
      <Footer />

      <SaveDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        savedItems={itemsSalvos}
      />
    </>
  )
}

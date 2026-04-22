import TopbarFix from '@/widgets/topbar-cliente/topbar-fix.jsx'
import Navbar from '@/widgets/navbar-cliente/navbar.jsx'
import SectionNomeBanner from '@/widgets/section-nome-banner/section-nome-banner.jsx'
import DestaqueBanner from '@/widgets/destaque-banner/destaque-banner.jsx'
import Filtros from '@/features/filtrar-produtos/ui/filtrosFeatureUi.jsx'
import FAQ from '@/widgets/faq/faq.jsx'
import Footer from '@/widgets/footer/footer.jsx'
import ProductList from '@/entities/produto/ui/list/productlist.jsx'
import SaveDrawer from '@/features/salvar-produto/ui/SaveDrawerFeatureUi.jsx'
import { useSaveDrawer } from '@/features/salvar-produto/model/useSaveDrawerFeatureModel'
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

      <section className="px-10">
        <h2 className="text-2xl font-bold">Papelaria</h2>
        <ProductList produtos={produtos.filter(p => p.type === 'papelaria')} />

        <h2 className="text-2xl font-bold">Banners</h2>
        <ProductList produtos={produtos.filter(p => p.type === 'banner')} />

        <h2 className="text-2xl font-bold">Brindes</h2>
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

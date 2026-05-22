import { useState } from "react";
import Navbar from "@/widgets/navbar-cliente/navbar.jsx";
import Footer from "@/widgets/footer/footer.jsx";
import HistoricoPedidosWidget from "@/widgets/historico-pedidos/HistoricoPedidosWidget.jsx";
import MobileMenu from "@/features/mobile-menu/mobile-menu.jsx";

export default function HistoricoPedidosPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar compact hideBookmark onOpenMenu={() => setIsMenuOpen(true)} />

      <main className="flex-1 px-10 py-12">
        <HistoricoPedidosWidget />
      </main>

      <Footer />

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
}

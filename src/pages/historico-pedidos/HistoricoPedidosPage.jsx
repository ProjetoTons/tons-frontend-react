import { useState } from "react";
import Navbar from "@/widgets/navbar-cliente/navbar.jsx";
import Footer from "@/widgets/footer/footer.jsx";
import HistoricoPedidosWidget from "@/widgets/historico-pedidos/HistoricoPedidosWidget.jsx";
import MobileMenu from "@/features/mobile-menu/mobile-menu.jsx";
import BottomNav from "@/features/bottom-nav/BottomNav.jsx";

export default function HistoricoPedidosPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar compact hideBookmark onOpenMenu={() => setIsMenuOpen(true)} />
      {/* Espaçador para compensar navbar fixa */}
      <div className="h-[80px]"></div>

      <main className="flex-1 px-4 md:px-10 py-12 pb-24">
        <HistoricoPedidosWidget />
      </main>

      <Footer />

      {/* Bottom navigation for mobile - shows instead of hamburger */}
      <BottomNav />

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
}

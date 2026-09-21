import { useState } from "react";
import Navbar from "@/widgets/navbar-cliente/navbar.jsx";
import Footer from "@/widgets/footer/footer.jsx";
import ConfiguracoesWidget from "@/widgets/configuracoes/ConfiguracoesWidget.jsx";
import MobileMenu from "@/features/mobile-menu/mobile-menu.jsx";
import BottomNav from "@/features/bottom-nav/BottomNav.jsx";

export default function ConfiguracoesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar compact hideBookmark onOpenMenu={() => setIsMenuOpen(true)} />
      {/* Espaçador para compensar navbar fixa */}
      <div className="h-[80px]"></div>

      <main className="flex-1 px-4 py-8 pb-32 md:px-10 md:py-12 md:pb-12">
        <ConfiguracoesWidget />
      </main>

      <Footer />

      <BottomNav />

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
}

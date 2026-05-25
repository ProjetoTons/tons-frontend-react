import { useState } from "react";
import Navbar from "@/widgets/navbar-cliente/navbar.jsx";
import Footer from "@/widgets/footer/footer.jsx";
import ConfiguracoesWidget from "@/widgets/configuracoes/ConfiguracoesWidget.jsx";
import MobileMenu from "@/features/mobile-menu/mobile-menu.jsx";

export default function ConfiguracoesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar compact hideBookmark onOpenMenu={() => setIsMenuOpen(true)} />
      {/* Espaçador para compensar navbar fixa */}
      <div className="h-[80px]"></div>

      <main className="flex-1 px-10 py-12">
        <ConfiguracoesWidget />
      </main>

      <Footer />

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
}

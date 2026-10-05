import { useState } from "react";
import Navbar from "@/widgets/navbar-cliente/navbar.jsx";
import Footer from "@/widgets/footer/footer.jsx";
import ListaInteresseWidget from "@/widgets/lista-interesse/ListaInteresseWidget.jsx";
import MobileMenu from "@/features/mobile-menu/mobile-menu.jsx";
import BottomNav from "@/features/bottom-nav/BottomNav.jsx";

export default function ListaInteressePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar compact hideBookmark onOpenMenu={() => setIsMenuOpen(true)} />
      {/* Espaçador para compensar navbar fixa */}
      <div className="h-[80px]"></div>

      <main className="flex-1 px-4 sm:px-6 md:px-10 py-6 pb-24 sm:py-8 md:py-12 md:pb-12">
        <ListaInteresseWidget />
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

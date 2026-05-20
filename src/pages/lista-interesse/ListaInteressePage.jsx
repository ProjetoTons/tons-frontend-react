import { useState } from "react";
import TopbarFix from "@/widgets/topbar-cliente/topbar-fix.jsx";
import Navbar from "@/widgets/navbar-cliente/navbar.jsx";
import Footer from "@/widgets/footer/footer.jsx";
import ListaInteresseWidget from "@/widgets/lista-interesse/ListaInteresseWidget.jsx";
import MobileMenu from "@/features/mobile-menu/mobile-menu.jsx";

export default function ListaInteressePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <TopbarFix />
      <Navbar compact onOpenMenu={() => setIsMenuOpen(true)} />

      <main className="flex-1 px-10 py-12">
        <ListaInteresseWidget />
      </main>

      <Footer />

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
}

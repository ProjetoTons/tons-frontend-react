import { useState, useEffect, useRef } from 'react';

/**
 * Hook customizado para detectar a direção do scroll
 * Retorna true quando scrollando para cima, false quando para baixo
 */
export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Se scrollou para cima, mostrar navbar
          if (currentScrollY < lastScrollY) {
            setIsVisible(true);
          } 
          // Se scrollou para baixo e passou de 100px, esconder navbar
          else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
          }
          // Se está no topo, mostrar navbar
          else if (currentScrollY < 100) {
            setIsVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return isVisible;
}

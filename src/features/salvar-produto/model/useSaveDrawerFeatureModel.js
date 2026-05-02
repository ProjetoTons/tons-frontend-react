// src/features/salvar-produto/model/useSaveDrawerFeatureModel.js
import { useState } from 'react';

export function useSaveDrawer() {
  const [itemsSalvos, setItemsSalvos] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleSaveProduct = (product) => {
    setItemsSalvos((prev) => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  return {
    itemsSalvos,
    isDrawerOpen,
    openDrawer: () => setIsDrawerOpen(true),
    closeDrawer: () => setIsDrawerOpen(false),
    toggleSaveProduct
  };
}
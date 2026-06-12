// src/features/salvar-produto/model/useSaveDrawerFeatureModel.js
import { useState, useEffect, useRef } from 'react';
import { http } from '@/shared/api/http';
import { getToken } from '@/shared/api/authToken';

export function useSaveDrawer() {
  // 1. ESTADO PRINCIPAL
  const [itemsSalvos, setItemsSalvos] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // 2. CONTROLE DE SINCRONIZAÇÃO
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestQueue = useRef([]);
  const isProcessing = useRef(false);

  // 3. CARREGAR ITENS AO INICIAR (GET) — apenas se logado
  useEffect(() => {
    if (getToken()) {
      loadSavedItems();
    }
  }, []);

  const loadSavedItems = async () => {
    try {
      setIsLoading(true);
      const response = await http.get('/produtos/favoritos');
      // Backend retorna List<Produto> com { id, nome, descricao, tipoMaterial, categoriaProduto }
      const mapped = (response.data || []).map(p => ({
        id: p.id,
        title: p.nome ?? 'Produto',
        category: p.categoriaProduto?.nome ?? p.tipoMaterial ?? 'Produto',
        description: p.descricao ?? '',
        image: p.urlImagem ?? '/product/placeholder.png',
        type: p.tipoMaterial ?? '',
      }));
      setItemsSalvos(mapped);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar itens salvos:', err);
      setError('Falha ao carregar itens salvos');
      setItemsSalvos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. ADICIONAR/REMOVER PRODUTO (POST/DELETE)
  const toggleSaveProduct = async (product) => {
    // Validar produto
    if (!product || !product.id) {
      console.error('Produto inválido:', product);
      return;
    }

    const exists = itemsSalvos.find(item => item.id === product.id);
    
    if (exists) {
      // REMOVER: Atualizar UI imediatamente (Optimistic Update)
      setItemsSalvos(prev => prev.filter(item => item.id !== product.id));
      addToQueue({ method: 'DELETE', productId: product.id, product });
    } else {
      // ADICIONAR: Atualizar UI imediatamente (Optimistic Update)
      setItemsSalvos(prev => [...prev, product]);
      addToQueue({ method: 'POST', product });
    }
  };

  // 5. FILA DE REQUISIÇÕES (evita múltiplas chamadas simultâneas)
  const addToQueue = (request) => {
    requestQueue.current.push(request);
    processQueue();
  };

  const processQueue = async () => {
    if (isProcessing.current || requestQueue.current.length === 0) return;
    
    isProcessing.current = true;
    const request = requestQueue.current.shift();

    try {
      if (request.method === 'POST') {
        await http.post(`/produtos/${request.product.id}/favorito`);
      } else if (request.method === 'DELETE') {
        await http.delete(`/produtos/${request.productId}/favorito`);
      }
      setError(null);
    } catch (err) {
      console.error('Erro ao sincronizar com servidor:', err);
      
      // ROLLBACK: desfazer mudança local em caso de erro
      if (request.method === 'POST') {
        setItemsSalvos(prev => prev.filter(item => item.id !== request.product.id));
      } else if (request.method === 'DELETE') {
        setItemsSalvos(prev => [...prev, request.product]);
      }
      
      setError('Erro ao sincronizar com servidor. Tente novamente.');
    } finally {
      isProcessing.current = false;
      
      // Processar próxima requisição da fila
      if (requestQueue.current.length > 0) {
        // Pequeno delay para evitar sobrecarga
        setTimeout(processQueue, 300);
      }
    }
  };

  return {
    itemsSalvos,
    isDrawerOpen,
    isLoading,
    error,
    openDrawer: () => { setIsDrawerOpen(true); if (getToken()) loadSavedItems(); },
    closeDrawer: () => setIsDrawerOpen(false),
    toggleSaveProduct
  };
}
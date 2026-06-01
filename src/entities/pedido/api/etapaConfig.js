/**
 * Configuração de cores e ícones para as etapas do pedido
 */

export const ETAPA_CONFIG = {
  Design: {
    cor: '#7C3AED', // Roxo
    icone: '/icons/triangle-icon.png',
    displayName: 'Design',
  },
  Produção: {
    cor: '#0EA5E9', // Azul
    icone: '/icons/square-icon.png',
    displayName: 'Produção',
  },
  Embalagem: {
    cor: '#D91EF6', // Verde
    icone: '/icons/shield-icon.png',
    displayName: 'Embalagem',
  },
  Logística: {
    cor: '#F59E0B', // Laranja
    icone: '/icons/circle-icon.png',
    displayName: 'Logística',
  },
  Finalizados: {
    cor: '#10B981', // Ciano
    icone: '/icons/finished-icon.png',
    displayName: 'Finalizados',
  },
};

/**
 * Obtém a configuração de uma etapa
 * @param {string} etapa - Nome da etapa
 * @returns {object} - Configuração com cor e ícone
 */
export function getEtapaConfig(etapa) {
  return ETAPA_CONFIG[etapa] || ETAPA_CONFIG.Design;
}

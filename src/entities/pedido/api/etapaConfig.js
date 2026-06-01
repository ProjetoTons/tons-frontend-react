/**
 * Configuração de cores e ícones para as etapas do pedido
 */

export const ETAPA_CONFIG = {
  Design: {
    cor: '#8444F3', // Roxo
    txtColor: '#f6f6f6',
    icone: '/icons/triangle-icon.png',
    displayName: 'Design',
  },
  Produção: {
    cor: '#0EA5E9', // Azul
    txtColor: '#f6f6f6',
    icone: '/icons/square-icon.png',
    displayName: 'Produção',
  },
  Embalagem: {
    cor: '#BE41AB', // Rosa
    txtColor: '#f6f6f6',
    icone: '/icons/shield-icon.png',
    displayName: 'Embalagem',
  },
  Logística: {
    cor: '#E89402', // Laranja
    txtColor: '#f6f6f6',
    icone: '/icons/circle-icon.png',
    displayName: 'Logística',
  },
  Finalizados: {
    cor: '#0D9B6C', // Verde
    txtColor: '#f6f6f6',
    icone: '/icons/finished-icon.png',
    displayName: 'Finalizados',
  },
  Tudo: {
    cor: '#FFE301', // Amarelo
    txtColor: '#161616',
  },
};

/**
 * Obtém a configuração de uma etapa
 * @param {string} etapa - Nome da etapa
 * @returns {object} - Configuração com cor e ícone
 */
export function getEtapaConfig(etapa) {
  return ETAPA_CONFIG[etapa] || ETAPA_CONFIG.Tudo;
}

/**
 * Configuração de cores e ícones para as etapas do pedido
 */

export const ETAPA_CONFIG = {
  Design: {
    cor: '#8444F3', // Roxo
    txtColor: '#f6f6f6',
    icone: '/pedidos-icons/triangle-icon.png',
    displayName: 'Design',
  },
  Produção: {
    cor: '#0EA5E9', // Azul
    txtColor: '#f6f6f6',
    icone: '/pedidos-icons/square-icon.png',
    displayName: 'Produção',
  },
  Embalagem: {
    cor: '#BE41AB', // Rosa
    txtColor: '#f6f6f6',
    icone: '/pedidos-icons/shield-icon.png',
    displayName: 'Embalagem',
  },
  Logística: {
    cor: '#E89402', // Laranja
    txtColor: '#f6f6f6',
    icone: '/pedidos-icons/circle-icon.png',
    displayName: 'Logística',
  },
  Finalizados: {
    cor: '#0D9B6C', // Verde
    txtColor: '#f6f6f6',
    icone: '/pedidos-icons/finished-icon.png',
    displayName: 'Finalizados',
  },
  Cancelado: {
    cor: '#FA2C37', // Vermelho
    txtColor: '#f2f2f2',
    icone: '/pedidos-icons/canceled-icon.png',
    displayName: 'Cancelado',
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

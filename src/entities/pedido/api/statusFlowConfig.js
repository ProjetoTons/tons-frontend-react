/**
 * Configuração de fluxo de status dos pedidos
 * Define a ordem de status dentro de cada etapa e as regras de transição
 */

export const STATUS_FLOW = {
  // DESIGN - Etapa 1
  Design: {
    order: [
      'nao-iniciado',
      'aguardando-arte',
      'criando-mockup',
      'aguardando-aprovacao',
      'impressao-fotolito'
    ],
    displayName: 'Design',
    nextEtapa: 'Produção',
    canAdvanceFrom: 'impressao-fotolito', // Status necessário para avançar para próxima etapa
  },

  // PRODUÇÃO - Etapa 2
  Produção: {
    order: [
      'nao-iniciado',
      'conferindo',
      'personalizando'
    ],
    displayName: 'Produção',
    previousEtapa: 'Design',
    nextEtapa: 'Embalagem',
    canAdvanceFrom: 'personalizando',
  },

  // EMBALAGEM - Etapa 3
  Embalagem: {
    order: [
      'nao-iniciado',
      'quality-check',
      'embalagem',
      'medicao',
      'emitir-etiqueta'
    ],
    displayName: 'Embalagem',
    previousEtapa: 'Produção',
    nextEtapa: 'Logística',
    canAdvanceFrom: 'emitir-etiqueta',
  },

  // LOGÍSTICA - Etapa 4
  Logística: {
    order: [
      'enviado',
      'aguardando-retirada'
    ],
    displayName: 'Logística',
    previousEtapa: 'Embalagem',
    nextEtapa: 'Finalizados',
  },

  // FINALIZADOS - Etapa 5
  Finalizados: {
    order: [
      'finalizado'
    ],
    displayName: 'Finalizados',
    previousEtapa: 'Logística',
  }
};

/**
 * Obtém o índice do status na ordem da etapa
 * @param {string} etapa - Nome da etapa
 * @param {string} status - Status atual
 * @returns {number} - Índice do status (-1 se não encontrado)
 */
export function getStatusIndex(etapa, status) {
  const flow = STATUS_FLOW[etapa];
  if (!flow) return -1;
  return flow.order.indexOf(status);
}

/**
 * Obtém o próximo status na mesma etapa
 * @param {string} etapa - Nome da etapa
 * @param {string} currentStatus - Status atual
 * @returns {string|null} - Próximo status ou null se for o último
 */
export function getNextStatus(etapa, currentStatus) {
  const flow = STATUS_FLOW[etapa];
  if (!flow) return null;
  
  const currentIndex = flow.order.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === flow.order.length - 1) {
    return null;
  }
  
  return flow.order[currentIndex + 1];
}

/**
 * Obtém o status anterior na mesma etapa
 * @param {string} etapa - Nome da etapa
 * @param {string} currentStatus - Status atual
 * @returns {string|null} - Status anterior ou null se for o primeiro
 */
export function getPreviousStatus(etapa, currentStatus) {
  const flow = STATUS_FLOW[etapa];
  if (!flow) return null;
  
  const currentIndex = flow.order.indexOf(currentStatus);
  if (currentIndex <= 0) {
    return null;
  }
  
  return flow.order[currentIndex - 1];
}

/**
 * Verifica se um pedido pode avançar para a próxima etapa
 * @param {string} etapa - Etapa atual
 * @param {string} status - Status atual
 * @returns {boolean}
 */
export function canAdvanceToNextEtapa(etapa, status) {
  const flow = STATUS_FLOW[etapa];
  if (!flow || !flow.canAdvanceFrom) return false;
  return status === flow.canAdvanceFrom;
}

/**
 * Obtém a próxima etapa
 * @param {string} etapa - Etapa atual
 * @returns {string|null} - Próxima etapa ou null
 */
export function getNextEtapa(etapa) {
  const flow = STATUS_FLOW[etapa];
  return flow ? flow.nextEtapa : null;
}

/**
 * Obtém a etapa anterior
 * @param {string} etapa - Etapa atual
 * @returns {string|null} - Etapa anterior ou null
 */
export function getPreviousEtapa(etapa) {
  const flow = STATUS_FLOW[etapa];
  return flow ? flow.previousEtapa : null;
}

/**
 * Obtém o status inicial de uma etapa
 * @param {string} etapa - Nome da etapa
 * @returns {string} - Status inicial ('nao-iniciado' ou 'enviado' para Logística)
 */
export function getInitialStatus(etapa) {
  const flow = STATUS_FLOW[etapa];
  if (!flow) return 'nao-iniciado';
  return flow.order[0];
}

/**
 * Verifica se um status é válido para uma etapa
 * @param {string} etapa - Nome da etapa
 * @param {string} status - Status a verificar
 * @returns {boolean}
 */
export function isValidStatus(etapa, status) {
  const flow = STATUS_FLOW[etapa];
  if (!flow) return false;
  return flow.order.includes(status);
}

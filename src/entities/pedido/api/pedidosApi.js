/**
 * pedidosApi - Camada de acesso a dados de pedidos
 *
 * Emula chamadas HTTP ao backend Spring MVC com latência simulada.
 * Mantém um "banco" em memória dentro do módulo: as alterações sobrevivem
 * a re-renders e navegação, mas são resetadas ao recarregar a página
 * (igual ao comportamento de uma sessão real contra um backend).
 *
 * Quando o backend real existir, basta substituir o corpo destas funções
 * por chamadas `fetch`/`axios` mantendo a mesma assinatura.
 */

import { mockPedidos } from "./mockPedidos";

// "Banco" em memória — clone profundo do mock inicial
let pedidosDb = JSON.parse(JSON.stringify(mockPedidos));

// Latência simulada (ms) para imitar uma requisição de rede
const LATENCIA_MS = 250;

function delay(ms = LATENCIA_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GET /pedidos — Retorna a lista completa de pedidos
 * @returns {Promise<Array>}
 */
export async function fetchPedidos() {
  await delay();
  // Retorna cópia para evitar mutação externa do "banco"
  return JSON.parse(JSON.stringify(pedidosDb));
}

/**
 * GET /pedidos/:id — Retorna um pedido específico
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
export async function fetchPedidoById(id) {
  await delay();
  const pedido = pedidosDb.find((p) => p.id_pedido === id);
  return pedido ? JSON.parse(JSON.stringify(pedido)) : null;
}

/**
 * PUT /pedidos/:id — Atualiza um pedido existente
 * @param {number} id
 * @param {Object} pedidoAtualizado
 * @returns {Promise<Object>}
 */
export async function updatePedido(id, pedidoAtualizado) {
  await delay();
  const index = pedidosDb.findIndex((p) => p.id_pedido === id);
  if (index === -1) {
    throw new Error(`Pedido ${id} não encontrado`);
  }
  pedidosDb[index] = JSON.parse(JSON.stringify(pedidoAtualizado));
  return JSON.parse(JSON.stringify(pedidosDb[index]));
}

/**
 * Reset do banco em memória (útil para testes)
 */
export function resetPedidosDb() {
  pedidosDb = JSON.parse(JSON.stringify(mockPedidos));
}

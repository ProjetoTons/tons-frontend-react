/**
 * dashboardApi - Integração com endpoints reais do dashboard
 *
 * Endpoints:
 *  - GET /dashboard/kpis?startDate&endDate
 *  - GET /dashboard/grafico-etapas?startDate&endDate
 *  - GET /dashboard/grafico-etapas/{etapa}?startDate&endDate
 *  - GET /dashboard/performance-funcionarios?startDate&endDate
 */

import { http } from "@/shared/api/http";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Formata Date para "yyyy-MM-dd" (formato esperado pelo backend)
 */
function formatDate(date) {
  if (!date) return undefined;
  if (typeof date === "string") return date.substring(0, 10);
  return date.toISOString().substring(0, 10);
}

/**
 * Formatar para Number (formato seguro para falhas de null/undefined)
 */
function formatNumber(number) {
  if (number == null || isNaN(number)) return undefined;
  return Number(number);
}

// ---------------------------------------------------------------------------
// API pública — mesma assinatura dos mocks anteriores
// ---------------------------------------------------------------------------

/**
 * GET /dashboard/kpis
 * Retorna: { totalValor, aguardandoArte, aguardandoRetirada, enviada, metaSemanal, totalPedidos }
 * Adaptado para o formato esperado pelo StatsGrid:
 *   { totalHoje, aguardandoArte, enviado, aguardandoRetirada, totalPedidos, metaAtual }
 */
export const fetchKpisDashboard = async (startDate, endDate) => {
  const { data } = await http.get("/dashboard/kpis", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });

  return {
    totalHoje: data.totalValor ?? 0,
    aguardandoArte: data.aguardandoArte ?? 0,
    enviado: data.enviada ?? 0,
    aguardandoRetirada: data.aguardandoRetirada ?? 0,
    totalPedidos: data.totalPedidos ?? 0,
    metaAtual: data.metaSemanal ?? 0,
  };
};

/**
 * GET /dashboard/grafico-etapas
 * Retorna: [{ etapa, quantidadePedidos, valorTotalArrecadado }]
 */
export const fetchGraficoEtapas = async (startDate, endDate) => {
  const { data } = await http.get("/dashboard/grafico-etapas", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return Array.isArray(data) ? data : [];
};

/**
 * GET /dashboard/grafico-etapas/{etapa}
 * Retorna: [{ subEtapa, quantidadePedidos, valorTotalArrecadado }]
 */
export const fetchSubEtapasPorEtapa = async (etapa, startDate, endDate) => {
  const { data } = await http.get(`/dashboard/grafico-etapas/${encodeURIComponent(etapa)}`, {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return Array.isArray(data) ? data : [];
};

/**
 * GET /dashboard/performance-funcionarios
 * Retorna: [{ idFuncionario, nomeFuncionario, tarefas: { design, producao, embalagem, logistica } }]
 */
export const fetchPerformanceFuncionarios = async (startDate, endDate) => {
  const { data } = await http.get("/dashboard/performance-funcionarios", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });
  return Array.isArray(data) ? data : [];
};

/**
 * Lista de pedidos para o widget lateral do dashboard.
 * Reutiliza GET /pedidos com filtro de datas e enriquece com cálculo de atraso.
 */
export const fetchPedidosLista = async (startDate, endDate) => {
  const { data } = await http.get("/pedidos", {
    params: { startDate: formatDate(startDate), endDate: formatDate(endDate) },
  });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const pedidos = Array.isArray(data) ? data : [];

  return pedidos.map((p) => {
    const dataPedido = p.dataPedido ? String(p.dataPedido).substring(0, 10) : null;
    const dataFinalizacao = p.dataFinalizacao ? String(p.dataFinalizacao).substring(0, 10) : null;

    // Calcula atraso
    let statusAtraso = "NO_PRAZO";
    let diasAtraso = 0;

    if (dataFinalizacao && p.status !== "Finalizado" && p.status !== "Enviado") {
      const prazo = new Date(`${dataFinalizacao}T00:00:00`);
      const diff = Math.ceil((hoje.getTime() - prazo.getTime()) / (1000 * 3600 * 24));
      if (diff > 0) {
        statusAtraso = "ATRASADO";
        diasAtraso = diff;
      } else if (diff === 0) {
        statusAtraso = "VENCE_HOJE";
      }
    }

    return {
      id_pedido: p.idPedido,
      num_pedido: p.numPedido,
      etapa_pedido: p.etapaPedido,
      status: p.status ? p.status.toLowerCase().replace(/ /g, "-") : "",
      valor_total: p.valorTotal != null ? Number(p.valorTotal) : 0,
      descricao: p.descricao,
      data_pedido: dataPedido,
      data_finalizacao: dataFinalizacao,
      cliente: p.cliente
        ? { id: p.cliente.id, nome: p.cliente.nome }
        : { id: null, nome: "-" },
      responsavel: p.responsavel
        ? { id: p.responsavel.id, nome: p.responsavel.nome }
        : null,
      statusAtraso,
      diasAtraso,
    };
  });
};

/**
 * PATCH /empresas/meta-semanal
 * Parametro: { metaSemanal: valor } no corpo da requisição (body)
 * Retorna: { metaAtualizada }
 */
export const updateMetas = async (meta) => {
  const { data } = await http.patch("/empresas/meta-semanal", {
    metaSemanal: meta
  });

  return {
    metaAtual: data.metaSemanal ?? meta,
  };
};

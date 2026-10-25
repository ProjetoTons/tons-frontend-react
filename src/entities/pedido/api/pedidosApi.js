/**
 * pedidosApi - Camada de acesso a dados de pedidos
 *
 * Integra com o backend Spring (PedidoController em /pedidos).
 * Mantém adapters internos para converter a estrutura da API (camelCase)
 * para o formato esperado pela UI (snake_case) e vice-versa.
 *
 * Endpoints utilizados:
 *  - GET    /pedidos?page&size&etapa&status&busca&responsavelId&somenteAtivos&sort
 *  - GET    /pedidos/{id}
 *  - POST   /pedidos/{id}/etapas        (avançar/voltar etapa)
 *  - PATCH  /pedidos/{id}/responsavel?idResponsavel=X
 *  - GET    /pedidos/{id}/etapas        (histórico)
 */

import { http } from "@/shared/api/http";

// ---------------------------------------------------------------------------
// Mapeamento de status: backend usa labels humanos, frontend usa slugs
// ---------------------------------------------------------------------------

// Frontend slug -> Backend label
const STATUS_FRONT_TO_BACK = {
  "nao-iniciado": "Não Iniciado",
  "aguardando-arte": "Aguardando arte",
  "criando-mockup": "Criando Mockup",
  "aguardando-aprovacao": "Aguardando aprovação",
  "impressao-fotolito": "Impressão fotolito",
  "conferindo": "Conferindo",
  "personalizando": "Personalizando",
  "quality-check": "Quality check",
  "embalagem": "Embalagem",
  "medicao": "Medição",
  "emitir-etiqueta": "Emitir etiqueta",
  "enviado": "Enviado",
  "aguardando-retirada": "Aguardando retirada",
  "finalizado": "Concluído",
};

// Backend label -> Frontend slug (gerado invertendo o mapa acima)
const STATUS_BACK_TO_FRONT = Object.fromEntries(
  Object.entries(STATUS_FRONT_TO_BACK).map(([slug, label]) => [
    label.toLowerCase(),
    slug,
  ])
);

function statusToBackend(slug) {
  return STATUS_FRONT_TO_BACK[slug] ?? slug;
}

function statusToFrontend(label) {
  if (!label) return label;
  return STATUS_BACK_TO_FRONT[label.toLowerCase()] ?? label;
}

// ---------------------------------------------------------------------------
// Mapeamento de etapa: backend usa "Finalizado" (singular), frontend usa "Finalizados" (plural)
// ---------------------------------------------------------------------------

const ETAPA_BACK_TO_FRONT = { "Finalizado": "Finalizados" };

function etapaToFrontend(etapa) {
  return ETAPA_BACK_TO_FRONT[etapa] ?? etapa;
}

function etapaToBackend(etapa) {
  return etapa;
}

// ---------------------------------------------------------------------------
// Adapters
// ---------------------------------------------------------------------------

/**
 * Converte PedidoResponseDto (backend) -> objeto consumido pela UI
 */
function toFrontend(dto) {
  if (!dto) return null;

  const dataPedido = dto.dataPedido ? String(dto.dataPedido).substring(0, 10) : null;
  const dataFinalizacao = dto.dataFinalizacao ? String(dto.dataFinalizacao).substring(0, 10) : null;

  return {
    id_pedido: dto.idPedido,
    num_pedido: dto.numPedido,
    url_foto_arte: dto.urlFotoArte,
    etapa_pedido: etapaToFrontend(dto.etapaPedido),
    status: statusToFrontend(dto.status),
    valor_total: dto.valorTotal != null ? Number(dto.valorTotal) : 0,
    descricao: dto.descricao,
    data_pedido: dataPedido,
    data_finalizacao: dataFinalizacao,
    tipo_envio: dto.tipoEnvio,
    num_nota_fiscal: dto.numNotaFiscal,

    cliente: dto.cliente
      ? {
          id_usuario: dto.cliente.id,
          nome: dto.cliente.nome,
          telefone: dto.cliente.telefone,
          nome_empresa: dto.cliente.nomeEmpresa,
        }
      : { id_usuario: null, nome: "-" },

    // Backend chama de "responsavel"; UI usa "responsavel_fase_atual"
    responsavel_fase_atual: dto.responsavel
      ? { id: dto.responsavel.id, nome: dto.responsavel.nome }
      : null,

    // Compatibilidade com componentes que ainda leem "responsavel"
    responsavel: dto.responsavel
      ? { id: dto.responsavel.id, nome: dto.responsavel.nome }
      : { id: null, nome: "-" },

    // Vendedor que registrou o pedido
    vendedor: dto.vendedor
      ? { id_usuario: dto.vendedor.id, nome: dto.vendedor.nome }
      : { id_usuario: null, nome: "-" },

    endereco: dto.endereco || null,

    itens_pedido: Array.isArray(dto.itens)
      ? dto.itens.map((item) => ({
          quantidade: item.quantidade,
          valor_unitario: item.valorUnitario != null ? Number(item.valorUnitario) : 0,
          produto: {
            id_produto: item.idProduto,
            nome: item.nomeProduto,
          },
          caracteristicas_item_pedido: item.caracteristicas
            ? {
                cor_estampa: item.caracteristicas.corEstampa,
                cor_material: item.caracteristicas.corMaterial,
                composicao: item.caracteristicas.composicao,
                descricao_arte: item.caracteristicas.descricaoArte,
                tamanho: item.caracteristicas.tamanho,
              }
            : null,
        }))
      : [],
  };
}

/**
 * Monta o payload do POST /pedidos/{id}/etapas a partir do pedido
 * já atualizado pela UI.
 */
function buildEtapaRequest(pedidoAtualizado, usuarioLogado) {
  // idResponsavelEtapa = quem EXECUTOU a ação (sempre obrigatório no histórico).
  // O backend internamente zera o responsável do pedido se a etapa mudou.
  return {
    idResponsavelEtapa:
      usuarioLogado?.id ??
      pedidoAtualizado.responsavel_fase_atual?.id ??
      null,
    etapa: etapaToBackend(pedidoAtualizado.etapa_pedido),
    status: statusToBackend(pedidoAtualizado.status),
    dataEntrada: new Date().toISOString(),
    dataSaida: null,
    observacoes: "",
  };
}

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

function filtrarPedidosLocalmente(pedidos, options) {
  let filtrados = pedidos;

  if (options.etapa) {
    filtrados = filtrados.filter((pedido) => pedido.etapa_pedido === options.etapa);
  } else if (options.somenteAtivos) {
    filtrados = filtrados.filter(
      (pedido) => pedido.etapa_pedido !== "Finalizados" && pedido.etapa_pedido !== "Cancelado"
    );
  }

  if (options.status) {
    const status = statusToFrontend(options.status).toLowerCase();
    filtrados = filtrados.filter((pedido) => pedido.status?.toLowerCase() === status);
  }

  if (options.busca) {
    const termo = options.busca.toLowerCase();
    filtrados = filtrados.filter((pedido) =>
      [
        pedido.num_pedido,
        pedido.cliente?.nome,
        pedido.vendedor?.nome,
        pedido.responsavel?.nome,
      ].some((valor) => valor?.toLowerCase().includes(termo))
    );
  }

  if (options.responsavelId != null) {
    filtrados = filtrados.filter(
      (pedido) => String(pedido.responsavel?.id) === String(options.responsavelId)
    );
  }

  if (options.sortBy) {
    const direction = options.sortDirection === "desc" ? -1 : 1;
    filtrados = [...filtrados].sort((a, b) => {
      const valueA = a[options.sortBy];
      const valueB = b[options.sortBy];
      if (options.sortBy === "valor_total") {
        return ((Number(valueA) || 0) - (Number(valueB) || 0)) * direction;
      }
      return String(valueA || "").localeCompare(String(valueB || "")) * direction;
    });
  }

  return filtrados;
}

function mapearPaginaPedidos(data, options) {
  if (Array.isArray(data)) {
    const filtrados = filtrarPedidosLocalmente(data.map(toFrontend), options);
    const totalElements = filtrados.length;
    const start = options.page * options.size;
    return {
      content: filtrados.slice(start, start + options.size),
      number: options.page,
      size: options.size,
      totalElements,
      totalPages: Math.ceil(totalElements / options.size),
    };
  }

  if (!Array.isArray(data?.content)) {
    throw new Error("A resposta paginada de pedidos não contém a lista 'content'.");
  }

  return {
    ...data,
    content: data.content.map(toFrontend),
    number: Number.isInteger(data.number) ? data.number : options.page,
    size: Number.isInteger(data.size) ? data.size : options.size,
    totalElements: Number.isFinite(data.totalElements) ? data.totalElements : data.content.length,
    totalPages: Number.isInteger(data.totalPages)
      ? data.totalPages
      : Math.ceil(data.content.length / options.size),
  };
}

/**
 * Sem opções, mantém o contrato de lista completa usado por outras telas.
 * Com opções, espera Spring Page; a lista antiga é paginada localmente para
 * permitir a implantação do contrato no backend sem interromper a tela.
 */
export async function fetchPedidos(options) {
  if (!options) {
    const { data } = await http.get("/pedidos");
    if (!Array.isArray(data)) {
      throw new Error("A resposta de pedidos deve ser uma lista.");
    }
    return data.map(toFrontend);
  }

  const {
    page = 0,
    size = 10,
    etapa,
    status,
    busca,
    responsavelId,
    somenteAtivos = false,
    sortBy,
    sortDirection = "asc",
    signal,
  } = options;
  const sortProperty = {
    data_pedido: "dataPedido",
    data_finalizacao: "dataFinalizacao",
    valor_total: "valorTotal",
  }[sortBy];
  const { data } = await http.get("/pedidos", {
    params: {
      page,
      size,
      etapa: etapa || undefined,
      status: status ? statusToBackend(status) : undefined,
      busca: busca || undefined,
      responsavelId: responsavelId ?? undefined,
      somenteAtivos: somenteAtivos || undefined,
      sort: sortProperty ? `${sortProperty},${sortDirection}` : undefined,
    },
    signal,
  });

  return mapearPaginaPedidos(data, {
    page,
    size,
    etapa,
    status,
    busca,
    responsavelId,
    somenteAtivos,
    sortBy,
    sortDirection,
  });
}

export async function fetchPedidoById(id) {
  const { data } = await http.get(`/pedidos/${id}`);
  return toFrontend(data);
}

/**
 * Atualiza etapa/status/responsavel via POST /pedidos/{id}/etapas.
 * @param {number} id
 * @param {Object} pedidoAtualizado - formato da UI (snake_case)
 * @param {Object} usuarioLogado    - { id, nome }
 */
export async function updatePedido(id, pedidoAtualizado, usuarioLogado) {
  const payload = buildEtapaRequest(pedidoAtualizado, usuarioLogado);
  const { data } = await http.post(`/pedidos/${id}/etapas`, payload);
  return toFrontend(data);
}

export async function atribuirResponsavel(id, idResponsavel) {
  const { data } = await http.patch(`/pedidos/${id}/responsavel`, null, {
    params: { idResponsavel },
  });
  return toFrontend(data);
}

export async function fetchHistoricoEtapas(id) {
  const { data } = await http.get(`/pedidos/${id}/etapas`);
  return data;
}

/**
 * Busca pedidos em andamento do cliente logado.
 * GET /pedidos/meus (filtro por JWT, etapaPedido != Finalizado)
 */
export async function fetchMeusPedidos() {
  const { data } = await http.get("/pedidos/meus");
  return Array.isArray(data) ? data.map(toFrontend) : [];
}

/**
 * Busca pedidos finalizados do cliente logado.
 * GET /pedidos/meus/historico (filtro por JWT, etapaPedido == Finalizado)
 */
export async function fetchMeusPedidosHistorico() {
  const { data } = await http.get("/pedidos/meus/historico");
  return Array.isArray(data) ? data.map(toFrontend) : [];
}

/**
 * Busca uma página do histórico unificado do cliente autenticado.
 * GET /pedidos/meus/historico/paginado?filtro&page&size
 */
export async function fetchHistoricoMeusPedidosPaginado({
  filtro = "TODOS",
  page = 0,
  size = 10,
  signal,
} = {}) {
  const { data } = await http.get("/pedidos/meus/historico/paginado", {
    params: { filtro, page, size },
    signal,
  });

  if (!Array.isArray(data?.content)) {
    throw new Error("A resposta paginada do histórico não contém a lista 'content'.");
  }

  return {
    content: data.content.map(toFrontend),
    number: Number.isInteger(data.number) ? data.number : page,
    size: Number.isInteger(data.size) ? data.size : size,
    totalElements: Number.isFinite(data.totalElements)
      ? data.totalElements
      : data.content.length,
    totalPages: Number.isInteger(data.totalPages)
      ? data.totalPages
      : Math.ceil(data.content.length / size),
  };
}

/**
 * Cancela um pedido (soft delete).
 * PUT /pedidos/{id}/cancelar
 * @param {number} id - ID do pedido
 * @param {string} motivo - Motivo obrigatório do cancelamento
 */
export async function cancelarPedido(id, motivo) {
  const { data } = await http.put(`/pedidos/${id}/cancelar`, { motivo });
  return data;
}

/**
 * Atualiza pedido completo (dados + itens).
 * PUT /pedidos/{id}
 * @param {number} id - ID do pedido
 * @param {Object} payload - PedidoRequestDto
 */
export async function editarPedido(id, payload) {
  const { data } = await http.put(`/pedidos/${id}`, payload);
  return toFrontend(data);
}

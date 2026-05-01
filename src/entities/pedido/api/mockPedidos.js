/**
 * Mock Data para Gerenciamento de Pedidos
 * Simula dados que viriam do backend Spring MVC
 */

export const mockPedidos = [
  {
    id_pedido: 1,
    num_pedido: "GL20DE",
    etapa_pedido: "Design",
    status: "impressao-fotolito",
    status_etapa: "Impressão fotolito",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-02-07",
    data_finalizacao: "2026-02-07",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 1,
      nome: "João Silva",
      iniciais: "J2",
    },
    responsavel: {
      id: 2,
      nome: "João",
    },
  },
  {
    id_pedido: 2,
    num_pedido: "GL20DE",
    etapa_pedido: "Produção",
    status: "nao-iniciado",
    status_etapa: "Não iniciado",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-02-07",
    data_finalizacao: "2026-02-07",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 1,
      nome: "João Silva",
      iniciais: "J2",
    },
    responsavel: {
      id: 2,
      nome: "João",
    },
  },
  {
    id_pedido: 3,
    num_pedido: "GL20DE",
    etapa_pedido: "Embalagem",
    status: "andamento",
    status_etapa: "Andamento",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-02-07",
    data_finalizacao: "2026-02-07",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 1,
      nome: "João Silva",
      iniciais: "J2",
    },
    responsavel: {
      id: 2,
      nome: "João",
    },
  },
  {
    id_pedido: 4,
    num_pedido: "GL20DE",
    etapa_pedido: "Embalagem",
    status: "andamento",
    status_etapa: "Andamento",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-02-07",
    data_finalizacao: "2026-02-07",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 1,
      nome: "João Silva",
      iniciais: "J2",
    },
    responsavel: {
      id: 2,
      nome: "João",
    },
  },
  {
    id_pedido: 5,
    num_pedido: "GL20DE",
    etapa_pedido: "Produção",
    status: "nao-iniciado",
    status_etapa: "Não iniciado",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-02-07",
    data_finalizacao: "2026-02-07",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 1,
      nome: "João Silva",
      iniciais: "J2",
    },
    responsavel: {
      id: 2,
      nome: "João",
    },
  },
];

// Estatísticas calculadas a partir dos pedidos
export const calcularEstatisticas = (pedidos) => {
  return {
    totalHoje: pedidos.reduce((sum, p) => sum + p.valor_total, 0),
    emAvaliacao: pedidos.filter(p => p.etapa_pedido === "Design").length,
    emAndamento: pedidos.filter(p => p.status === "andamento").length,
    concluido: pedidos.filter(p => p.etapa_pedido === "Logística").length,
  };
};

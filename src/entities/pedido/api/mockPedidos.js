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
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-02-07",
    data_finalizacao: "2026-02-07",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 1,
      nome: "João Silva",
    },
    responsavel: {
      id: 2,
      nome: "Gustavo",
    },
    vendedor: {
      id: 2,
      nome: "João",
    }
  },
  {
    id_pedido: 2,
    num_pedido: "AL45DE",
    etapa_pedido: "Design",
    status: "aguardando-arte",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-02-07",
    data_finalizacao: "2026-02-07",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 1,
      nome: "João Silva",
    },
    responsavel: {
      id: 2,
      nome: "Pedro",
    },
    vendedor: {
      id: 2,
      nome: "João",
    }
  },
  {
    id_pedido: 3,
    num_pedido: "FHJ329",
    etapa_pedido: "Design",
    status: "criando-mockup",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-02-07",
    data_finalizacao: "2026-02-07",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 1,
      nome: "João Silva",
    },
    responsavel: {
      id: 2,
      nome: "Thiago",
    },
    vendedor: {
      id: 2,
      nome: "Vitor",
    }
  },
  {
    id_pedido: 4,
    num_pedido: "AB4920",
    etapa_pedido: "Finalizados",
    status: "finalizado",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-02-07",
    data_finalizacao: "2026-02-07",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 1,
      nome: "João Silva",
    },
    responsavel: {
      id: 2,
      nome: "Pedro",
    },
    vendedor: {
      id: 2,
      nome: "João",
    }
  },
  {
    id_pedido: 5,
    num_pedido: "HUIU76",
    etapa_pedido: "Finalizados",
    status: "finalizado",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-02-07",
    data_finalizacao: "2026-02-07",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 1,
      nome: "João Silva",
    },
    responsavel: {
      id: 2,
      nome: "Maria",
    },
    vendedor: {
      id: 2,
      nome: "Vitor",
    }
  },
  {
    id_pedido: 6,
    num_pedido: "CD1001",
    etapa_pedido: "Design",
    status: "aguardando-arte",
    valor_total: 820.50,
    descricao: "Camisetas personalizadas",
    data_pedido: "2026-02-08",
    data_finalizacao: "2026-02-15",
    fk_usuario_cliente: 2,
    fk_usuario_responsavel: 3,
    cliente: {
      id: 2,
      nome: "Maria Santos",
    },
    responsavel: {
      id: 3,
      nome: "Lucas",
    },
    vendedor: {
      id: 1,
      nome: "Carlos",
    }
  },
  {
    id_pedido: 7,
    num_pedido: "EF1002",
    etapa_pedido: "Design",
    status: "criando-mockup",
    valor_total: 1200.00,
    descricao: "Cartazes promocionais",
    data_pedido: "2026-02-09",
    data_finalizacao: "2026-02-20",
    fk_usuario_cliente: 3,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 3,
      nome: "Ana Costa",
    },
    responsavel: {
      id: 2,
      nome: "Pedro",
    },
    vendedor: {
      id: 2,
      nome: "João",
    }
  },
  {
    id_pedido: 8,
    num_pedido: "GH1003",
    etapa_pedido: "Produção",
    status: "personalizando",
    valor_total: 650.75,
    descricao: "Adesivos com logotipo",
    data_pedido: "2026-02-10",
    data_finalizacao: "2026-02-18",
    fk_usuario_cliente: 4,
    fk_usuario_responsavel: 3,
    cliente: {
      id: 4,
      nome: "Roberto Lima",
    },
    responsavel: {
      id: 3,
      nome: "Lucas",
    },
    vendedor: {
      id: 3,
      nome: "Fernanda",
    }
  },
  {
    id_pedido: 9,
    num_pedido: "IJ1004",
    etapa_pedido: "Design",
    status: "impressao-fotolito",
    valor_total: 1450.00,
    descricao: "Banners para evento",
    data_pedido: "2026-02-11",
    data_finalizacao: "2026-02-25",
    fk_usuario_cliente: 5,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 5,
      nome: "Paula Oliveira",
    },
    responsavel: {
      id: 2,
      nome: "Pedro",
    },
    vendedor: {
      id: 1,
      nome: "Carlos",
    }
  },
  {
    id_pedido: 10,
    num_pedido: "KL1005",
    etapa_pedido: "Produção",
    status: "conferindo",
    valor_total: 780.25,
    descricao: "Embalagens personalizadas",
    data_pedido: "2026-02-12",
    data_finalizacao: "2026-02-22",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 3,
    cliente: {
      id: 1,
      nome: "João Silva",
    },
    responsavel: {
      id: 3,
      nome: "Lucas",
    },
    vendedor: {
      id: 2,
      nome: "João",
    }
  },
  {
    id_pedido: 11,
    num_pedido: "MN1006",
    etapa_pedido: "Produção",
    status: "personalizando",
    valor_total: 950.00,
    descricao: "Crachás e identificadores",
    data_pedido: "2026-02-13",
    data_finalizacao: "2026-02-26",
    fk_usuario_cliente: 2,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 2,
      nome: "Maria Santos",
    },
    responsavel: {
      id: 2,
      nome: "Pedro",
    },
    vendedor: {
      id: 3,
      nome: "Fernanda",
    }
  },
  {
    id_pedido: 12,
    num_pedido: "OP1007",
    etapa_pedido: "Embalagem",
    status: "quality-check",
    valor_total: 1100.50,
    descricao: "Cartões de visita personalizados",
    data_pedido: "2026-02-14",
    data_finalizacao: "2026-02-28",
    fk_usuario_cliente: 3,
    fk_usuario_responsavel: 3,
    cliente: {
      id: 3,
      nome: "Ana Costa",
    },
    responsavel: {
      id: 3,
      nome: "Lucas",
    },
    vendedor: {
      id: 1,
      nome: "Carlos",
    }
  },
  {
    id_pedido: 13,
    num_pedido: "QR1008",
    etapa_pedido: "Embalagem",
    status: "embalagem",
    valor_total: 2300.00,
    descricao: "Kit promocional completo",
    data_pedido: "2026-02-15",
    data_finalizacao: "2026-03-05",
    fk_usuario_cliente: 4,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 4,
      nome: "Roberto Lima",
    },
    responsavel: {
      id: 2,
      nome: "Pedro",
    },
    vendedor: {
      id: 2,
      nome: "João",
    }
  },
  {
    id_pedido: 14,
    num_pedido: "ST1009",
    etapa_pedido: "Embalagem",
    status: "medicao",
    valor_total: 580.00,
    descricao: "Etiquetas de preço",
    data_pedido: "2026-02-16",
    data_finalizacao: "2026-02-24",
    fk_usuario_cliente: 5,
    fk_usuario_responsavel: 3,
    cliente: {
      id: 5,
      nome: "Paula Oliveira",
    },
    responsavel: {
      id: 3,
      nome: "Lucas",
    },
    vendedor: {
      id: 3,
      nome: "Fernanda",
    }
  },
  {
    id_pedido: 15,
    num_pedido: "UV1010",
    etapa_pedido: "Embalagem",
    status: "emitir-etiqueta",
    valor_total: 420.75,
    descricao: "Rótulos para embalagem",
    data_pedido: "2026-02-17",
    data_finalizacao: "2026-02-28",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 1,
      nome: "João Silva",
    },
    responsavel: {
      id: 2,
      nome: "Pedro",
    },
    vendedor: {
      id: 1,
      nome: "Carlos",
    }
  },
  {
    id_pedido: 16,
    num_pedido: "WX1011",
    etapa_pedido: "Logística",
    status: "enviado",
    valor_total: 1890.00,
    descricao: "Calendários personalizados",
    data_pedido: "2026-02-18",
    data_finalizacao: "2026-02-28",
    fk_usuario_cliente: 2,
    fk_usuario_responsavel: 3,
    cliente: {
      id: 2,
      nome: "Maria Santos",
    },
    responsavel: {
      id: 3,
      nome: "Lucas",
    },
    vendedor: {
      id: 2,
      nome: "João",
    }
  },
  {
    id_pedido: 17,
    num_pedido: "YZ1012",
    etapa_pedido: "Logística",
    status: "aguardando-retirada",
    valor_total: 755.50,
    descricao: "Sacolas de papel personalizadas",
    data_pedido: "2026-02-19",
    data_finalizacao: "2026-02-28",
    fk_usuario_cliente: 3,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 3,
      nome: "Ana Costa",
    },
    responsavel: {
      id: 2,
      nome: "Pedro",
    },
    vendedor: {
      id: 3,
      nome: "Fernanda",
    }
  },
  {
    id_pedido: 18,
    num_pedido: "AA1013",
    etapa_pedido: "Design",
    status: "aguardando-arte",
    valor_total: 1320.00,
    descricao: "Convites para evento",
    data_pedido: "2026-02-20",
    data_finalizacao: "2026-03-10",
    fk_usuario_cliente: 4,
    fk_usuario_responsavel: 3,
    cliente: {
      id: 4,
      nome: "Roberto Lima",
    },
    responsavel: {
      id: 3,
      nome: "Lucas",
    },
    vendedor: {
      id: 1,
      nome: "Carlos",
    }
  },
  {
    id_pedido: 19,
    num_pedido: "BB1014",
    etapa_pedido: "Design",
    status: "criando-mockup",
    valor_total: 895.25,
    descricao: "Folders promocionais",
    data_pedido: "2026-02-21",
    data_finalizacao: "2026-03-08",
    fk_usuario_cliente: 5,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 5,
      nome: "Paula Oliveira",
    },
    responsavel: {
      id: 2,
      nome: "Pedro",
    },
    vendedor: {
      id: 2,
      nome: "João",
    }
  },
  {
    id_pedido: 20,
    num_pedido: "CC1015",
    etapa_pedido: "Produção",
    status: "conferindo",
    valor_total: 1675.00,
    descricao: "Certificados personalizados",
    data_pedido: "2026-02-22",
    data_finalizacao: "2026-03-15",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 3,
    cliente: {
      id: 1,
      nome: "João Silva",
    },
    responsavel: {
      id: 3,
      nome: "Lucas",
    },
    vendedor: {
      id: 3,
      nome: "Fernanda",
    }
  },
  {
    id_pedido: 21,
    num_pedido: "DD1016",
    etapa_pedido: "Design",
    status: "impressao-fotolito",
    valor_total: 2050.75,
    descricao: "Displays para ponto de venda",
    data_pedido: "2026-02-23",
    data_finalizacao: "2026-03-18",
    fk_usuario_cliente: 2,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 2,
      nome: "Maria Santos",
    },
    responsavel: {
      id: 2,
      nome: "Pedro",
    },
    vendedor: {
      id: 1,
      nome: "Carlos",
    }
  },
  {
    id_pedido: 22,
    num_pedido: "EE1017",
    etapa_pedido: "Produção",
    status: "conferindo",
    valor_total: 1130.50,
    descricao: "Manuais de instrução",
    data_pedido: "2026-02-24",
    data_finalizacao: "2026-03-12",
    fk_usuario_cliente: 3,
    fk_usuario_responsavel: 3,
    cliente: {
      id: 3,
      nome: "Ana Costa",
    },
    responsavel: {
      id: 3,
      nome: "Lucas",
    },
    vendedor: {
      id: 2,
      nome: "João",
    }
  },
  {
    id_pedido: 23,
    num_pedido: "FF1018",
    etapa_pedido: "Produção",
    status: "personalizando",
    valor_total: 740.00,
    descricao: "Marcadores de páginas",
    data_pedido: "2026-02-25",
    data_finalizacao: "2026-03-10",
    fk_usuario_cliente: 4,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 4,
      nome: "Roberto Lima",
    },
    responsavel: {
      id: 2,
      nome: "Pedro",
    },
    vendedor: {
      id: 3,
      nome: "Fernanda",
    }
  },
  {
    id_pedido: 24,
    num_pedido: "GG1019",
    etapa_pedido: "Embalagem",
    status: "quality-check",
    valor_total: 1540.25,
    descricao: "Pôsteres decorativos",
    data_pedido: "2026-02-26",
    data_finalizacao: "2026-03-20",
    fk_usuario_cliente: 5,
    fk_usuario_responsavel: 3,
    cliente: {
      id: 5,
      nome: "Paula Oliveira",
    },
    responsavel: {
      id: 3,
      nome: "Lucas",
    },
    vendedor: {
      id: 1,
      nome: "Carlos",
    }
  },
  {
    id_pedido: 25,
    num_pedido: "HH1020",
    etapa_pedido: "Embalagem",
    status: "embalagem",
    valor_total: 2100.00,
    descricao: "Caixas personalizadas para envio",
    data_pedido: "2026-02-27",
    data_finalizacao: "2026-03-22",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: {
      id: 1,
      nome: "João Silva",
    },
    responsavel: {
      id: 2,
      nome: "Pedro",
    },
    vendedor: {
      id: 2,
      nome: "João",
    }
  },
];

// Estatísticas calculadas a partir dos pedidos
export const calcularEstatisticas = (pedidos) => {
  return {
    totalHoje: pedidos.reduce((sum, p) => sum + p.
    valor_total, 0),
    aguardandoArte: pedidos.filter(p => p.status === "aguardando-arte").length,
    enviadoAguardandoRetirada: pedidos.filter(p => p.status === "enviado" || p.status === "aguardando-retirada").length,
    concluido: pedidos.filter(p => p.status === "finalizado").length,
  };
};

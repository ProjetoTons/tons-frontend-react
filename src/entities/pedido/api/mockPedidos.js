/**
 * Mock Data para Gerenciamento de Pedidos
 * Simula dados que viriam do backend Spring MVC
 * Produtos referenciados do catálogo XBZ Brindes (IDs reais do banco)
 */

export const mockPedidos = [
  {
    id_pedido: 1,
    num_pedido: "PED-001",
    url_foto_arte: "https://picsum.photos/400/300?random=1",
    etapa_pedido: "Design",
    status: "aguardando-arte",
    valor_total: 2800.00,
    descricao: "Canecas térmicas inox para evento corporativo",
    data_pedido: "2026-05-10",
    data_finalizacao: null,
    tipo_envio: "Entrega",

    cliente: {
      id_usuario: 9,
      nome: "Pedro Almeida",
    },

    responsavel_fase: {
      id_usuario: 3,
      nome: "Joao Tons",
    },

    vendedor: {
      id_usuario: 2,
      nome: "Dennis (cnpj)",
    },

    endereco: {
      cep: "01310-100",
      logradouro: "Av. Paulista",
      numero: "1000",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 100,

        produto: {
          id_produto: 28,
          nome: "Caneca Térmica Inox 350ml",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo centralizado em alta resolução",
          cor_estampa: "Azul Marinho",
          cor_material: "Branco",
          composicao: "Cerâmica",
          tamanho: "350ml",
          fornecedor: "XBZ Brindes",
        },
      },
    ],
  },

  {
    id_pedido: 2,
    num_pedido: "PED-002",
    url_foto_arte: "https://picsum.photos/400/300?random=2",
    etapa_pedido: "Produção",
    status: "personalizando",
    valor_total: 5890.00,
    descricao: "Taças térmicas para campanha de vendas",
    data_pedido: "2026-05-12",
    data_finalizacao: null,
    tipo_envio: "Retirada",

    cliente: {
      id_usuario: 10,
      nome: "Fernanda Lima",
    },

    responsavel_fase: {
      id_usuario: 4,
      nome: "Gustavo Pimentel",
    },

    vendedor: {
      id_usuario: 2,
      nome: "Dennis (cnpj)",
    },

    endereco: {
      cep: "01311-200",
      logradouro: "Rua da Consolação",
      numero: "500",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 200,

        produto: {
          id_produto: 39,
          nome: "Taça Térmica 350ml",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo em silk screen lateral",
          cor_estampa: "Preto",
          cor_material: "Prata",
          composicao: "Inox 304",
          tamanho: "350ml",
          fornecedor: "XBZ Brindes",
        },
      },
    ],
  },

  {
    id_pedido: 3,
    num_pedido: "PED-003",
    url_foto_arte: "https://picsum.photos/400/300?random=3",
    etapa_pedido: "Design",
    status: "criando-mockup",
    valor_total: 4820.00,
    descricao: "Kit churrasco para premiação trimestral",
    data_pedido: "2026-05-14",
    data_finalizacao: null,
    tipo_envio: "Transportadora",

    cliente: {
      id_usuario: 11,
      nome: "Roberto Dias",
    },

    responsavel_fase: {
      id_usuario: 3,
      nome: "Joao Tons",
    },

    vendedor: {
      id_usuario: 2,
      nome: "Dennis (cnpj)",
    },

    endereco: {
      cep: "05424-020",
      logradouro: "Rua Pio XI",
      numero: "300",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 40,

        produto: {
          id_produto: 48,
          nome: "Kit Churrasco 5 Peças",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo gravado a laser na tábua de bambu",
          cor_estampa: null,
          cor_material: "Natural",
          composicao: "Inox/Madeira/Bambu",
          tamanho: null,
          fornecedor: "XBZ Brindes",
        },
      },
    ],
  },

  {
    id_pedido: 4,
    num_pedido: "PED-004",
    url_foto_arte: "https://picsum.photos/400/300?random=4",
    etapa_pedido: "Produção",
    status: "conferindo",
    valor_total: 4350.00,
    descricao: "Power banks para brindes de feira",
    data_pedido: "2026-05-15",
    data_finalizacao: null,
    tipo_envio: "Correios",

    cliente: {
      id_usuario: 12,
      nome: "Juliana Mendes",
    },

    responsavel_fase: {
      id_usuario: 4,
      nome: "Gustavo Pimentel",
    },

    vendedor: {
      id_usuario: 2,
      nome: "Dennis (cnpj)",
    },

    endereco: {
      cep: "03104-000",
      logradouro: "Rua do Gasômetro",
      numero: "200",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 50,

        produto: {
          id_produto: 5,
          nome: "Power Bank 5.000mAh",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo gravado a laser na capa frontal",
          cor_estampa: "Prata",
          cor_material: "Branco",
          composicao: "Plástico",
          tamanho: null,
          fornecedor: "XBZ Brindes",
        },
      },

      {
        quantidade: 50,

        produto: {
          id_produto: 1,
          nome: "Power Bank 10.000mAh com Lanterna e Multissaídas",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo gravado a laser na capa frontal",
          cor_estampa: "Prata",
          cor_material: "Branco",
          composicao: "Plástico",
          tamanho: null,
          fornecedor: "XBZ Brindes",
        },
      },
    ],
  },

  {
    id_pedido: 5,
    num_pedido: "PED-005",
    url_foto_arte: "https://picsum.photos/400/300?random=5",
    etapa_pedido: "Embalagem",
    status: "embalando",
    valor_total: 3200.00,
    descricao: "Bolsas térmicas 13L personalizadas",
    data_pedido: "2026-05-17",
    data_finalizacao: null,
    tipo_envio: "Entrega",

    cliente: {
      id_usuario: 13,
      nome: "Lucas Ferreira",
    },

    responsavel_fase: {
      id_usuario: 3,
      nome: "Joao Tons",
    },

    vendedor: {
      id_usuario: 2,
      nome: "Dennis (cnpj)",
    },

    endereco: {
      cep: "02012-010",
      logradouro: "Av. Cruzeiro do Sul",
      numero: "800",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 150,

        produto: {
          id_produto: 21,
          nome: "Bolsa Térmica 13 Litros",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo bordado no bolso frontal",
          cor_estampa: "Branco",
          cor_material: "Azul Royal",
          composicao: "Poliéster/PEVA",
          tamanho: "13 Litros",
          fornecedor: "XBZ Brindes",
        },
      },
    ],
  },

  {
    id_pedido: 6,
    num_pedido: "PED-006",
    url_foto_arte: "https://picsum.photos/400/300?random=6",
    etapa_pedido: "Logística",
    status: "enviado",
    valor_total: 1980.00,
    descricao: "Cadernos ecológicos com canetas para treinamento",
    data_pedido: "2026-05-18",
    data_finalizacao: null,
    tipo_envio: "Motoboy",

    cliente: {
      id_usuario: 14,
      nome: "Camila Rocha",
    },

    responsavel_fase: {
      id_usuario: 4,
      nome: "Gustavo Pimentel",
    },

    vendedor: {
      id_usuario: 2,
      nome: "Dennis (cnpj)",
    },

    endereco: {
      cep: "04101-300",
      logradouro: "Rua Vergueiro",
      numero: "1200",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 200,

        produto: {
          id_produto: 19,
          nome: "Caderno Ecológico",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo em hot stamping na capa",
          cor_estampa: "Dourado",
          cor_material: "Preto",
          composicao: "Couro Sintético/Papel",
          tamanho: null,
          fornecedor: "XBZ Brindes",
        },
      },

      {
        quantidade: 200,

        produto: {
          id_produto: 68,
          nome: "Caneta Plástica",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo em tampografia no corpo",
          cor_estampa: "Branco",
          cor_material: "Azul",
          composicao: "Plástico",
          tamanho: null,
          fornecedor: "XBZ Brindes",
        },
      },
    ],
  },

  {
    id_pedido: 7,
    num_pedido: "PED-007",
    url_foto_arte: "https://picsum.photos/400/300?random=7",
    etapa_pedido: "Logística",
    status: "aguardando-retirada",
    valor_total: 2460.00,
    descricao: "Chaveiros metal para convenção",
    data_pedido: "2026-05-20",
    data_finalizacao: null,
    tipo_envio: "Retirada",

    cliente: {
      id_usuario: 9,
      nome: "Pedro Almeida",
    },

    responsavel_fase: {
      id_usuario: 3,
      nome: "Joao Tons",
    },

    vendedor: {
      id_usuario: 2,
      nome: "Dennis (cnpj)",
    },

    endereco: {
      cep: "01310-100",
      logradouro: "Av. Paulista",
      numero: "1000",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 300,

        produto: {
          id_produto: 34,
          nome: "Chaveiro Metal",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo em relevo na frente",
          cor_estampa: "Prata",
          cor_material: "Prata",
          composicao: "Metal",
          tamanho: null,
          fornecedor: "XBZ Brindes",
        },
      },
    ],
  },

  {
    id_pedido: 8,
    num_pedido: "PED-008",
    url_foto_arte: "https://picsum.photos/400/300?random=8",
    etapa_pedido: "Finalizados",
    status: "finalizado",
    valor_total: 5400.00,
    descricao: "Copos térmicos inox para equipe comercial",
    data_pedido: "2026-05-21",
    data_finalizacao: "2026-05-25",
    tipo_envio: "Transportadora",

    cliente: {
      id_usuario: 10,
      nome: "Fernanda Lima",
    },

    responsavel_fase: {
      id_usuario: 4,
      nome: "Gustavo Pimentel",
    },

    vendedor: {
      id_usuario: 2,
      nome: "Dennis (cnpj)",
    },

    endereco: {
      cep: "01311-200",
      logradouro: "Rua da Consolação",
      numero: "500",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 120,

        produto: {
          id_produto: 44,
          nome: "Copo Térmico Inox 320ml",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo 360° em silk screen",
          cor_estampa: "Branco",
          cor_material: "Preto",
          composicao: "Inox 304",
          tamanho: "320ml",
          fornecedor: "XBZ Brindes",
        },
      },
    ],
  },

  {
    id_pedido: 9,
    num_pedido: "PED-009",
    url_foto_arte: "https://picsum.photos/400/300?random=9",
    etapa_pedido: "Finalizados",
    status: "finalizado",
    valor_total: 3250.00,
    descricao: "Kit ferramentas para clientes VIP",
    data_pedido: "2026-05-22",
    data_finalizacao: "2026-05-26",
    tipo_envio: "Entrega",

    cliente: {
      id_usuario: 11,
      nome: "Roberto Dias",
    },

    responsavel_fase: {
      id_usuario: 3,
      nome: "Joao Tons",
    },

    vendedor: {
      id_usuario: 2,
      nome: "Dennis (cnpj)",
    },

    endereco: {
      cep: "05424-020",
      logradouro: "Rua Pio XI",
      numero: "300",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 80,

        produto: {
          id_produto: 77,
          nome: "Kit Ferramentas 25 Peças",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo na tampa da caixa plástica",
          cor_estampa: "Branco",
          cor_material: "Preto",
          composicao: "Aço Carbono/Plástico",
          tamanho: null,
          fornecedor: "XBZ Brindes",
        },
      },
    ],
  },

  {
    id_pedido: 10,
    num_pedido: "PED-010",
    url_foto_arte: "https://picsum.photos/400/300?random=10",
    etapa_pedido: "Design",
    status: "nao-iniciado",
    valor_total: 7800.00,
    descricao: "Caixas de som à prova d'água para sorteio",
    data_pedido: "2026-05-24",
    data_finalizacao: null,
    tipo_envio: "Correios",

    cliente: {
      id_usuario: 12,
      nome: "Juliana Mendes",
    },

    responsavel_fase: {
      id_usuario: 4,
      nome: "Gustavo Pimentel",
    },

    vendedor: {
      id_usuario: 2,
      nome: "Dennis (cnpj)",
    },

    endereco: {
      cep: "03104-000",
      logradouro: "Rua do Gasômetro",
      numero: "200",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 60,

        produto: {
          id_produto: 25,
          nome: "Caixa de Som Multimídia à prova D'Água",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo tampografia na parte superior",
          cor_estampa: "Branco",
          cor_material: "Preto",
          composicao: "Plástico/Metal",
          tamanho: null,
          fornecedor: "XBZ Brindes",
        },
      },
    ],
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

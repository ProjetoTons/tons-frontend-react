/**
 * Mock Data para Gerenciamento de Pedidos
 * Simula dados que viriam do backend Spring MVC
 */

export const mockPedidos = [
  {
    id_pedido: 1,
    num_pedido: "GL20DE",
    url_foto_arte: "https://picsum.photos/400/300?random=1",
    etapa_pedido: "Design",
    status: "impressao-fotolito",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-02-07",
    data_finalizacao: "2026-02-10",
    tipo_envio: "Entrega",

    cliente: {
      id_usuario: 1,
      nome: "João Silva",
    },

    responsavel_fase: {
      id_usuario: 2,
      nome: "Gustavo",
    },

    vendedor: {
      id_usuario: 3,
      nome: "Carlos",
    },

    endereco: {
      cep: "01234-000",
      logradouro: "Rua das Flores",
      numero: "120",
      complemento: "Apto 12",
    },

    itens_pedido: [
      {
        quantidade: 100,

        produto: {
          id_produto: 1,
          nome: "Caneca Personalizada",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo centralizado em alta resolução",
          cor_estampa: "Preto",
          cor_material: "Branco",
          composicao: "Cerâmica",
          tamanho: "350ml",
          fornecedor: "Fornecedor Alpha",
        },
      },

      {
        quantidade: 50,

        produto: {
          id_produto: 2,
          nome: "Camiseta Dry Fit",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo frontal e costas",
          cor_estampa: "Azul",
          cor_material: "Branco",
          composicao: "Poliéster",
          tamanho: "G",
          fornecedor: "Malharia Brasil",
        },
      },
    ],
  },

  {
    id_pedido: 2,
    num_pedido: "AL45DE",
    url_foto_arte: "https://picsum.photos/400/300?random=2",
    etapa_pedido: "Produção",
    status: "personalizando",
    valor_total: 1280.50,
    descricao: "Camisetas promocionais",
    data_pedido: "2026-02-08",
    data_finalizacao: "2026-02-15",
    tipo_envio: "Retirada",

    cliente: {
      id_usuario: 4,
      nome: "Maria Santos",
    },

    responsavel_fase: {
      id_usuario: 5,
      nome: "Pedro Henrique",
    },

    vendedor: {
      id_usuario: 3,
      nome: "Carlos",
    },

    endereco: {
      cep: "04567-120",
      logradouro: "Av. Paulista",
      numero: "1500",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 200,

        produto: {
          id_produto: 3,
          nome: "Camiseta Algodão",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Frase motivacional nas costas",
          cor_estampa: "Vermelho",
          cor_material: "Preto",
          composicao: "100% Algodão",
          tamanho: "M",
          fornecedor: "Textil Prime",
        },
      },
    ],
  },

  {
    id_pedido: 3,
    num_pedido: "FHJ329",
    url_foto_arte: "https://picsum.photos/400/300?random=3",
    etapa_pedido: "Embalagem",
    status: "quality-check",
    valor_total: 890.90,
    descricao: "Adesivos personalizados",
    data_pedido: "2026-02-10",
    data_finalizacao: "2026-02-18",
    tipo_envio: "Correios",

    cliente: {
      id_usuario: 6,
      nome: "Ana Costa",
    },

    responsavel_fase: {
      id_usuario: 7,
      nome: "Thiago Oliveira",
    },

    vendedor: {
      id_usuario: 8,
      nome: "Fernanda Lima",
    },

    endereco: {
      cep: "11000-450",
      logradouro: "Rua XV de Novembro",
      numero: "87",
      complemento: "Sala 3",
    },

    itens_pedido: [
      {
        quantidade: 500,

        produto: {
          id_produto: 4,
          nome: "Adesivo Vinil",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo transparente",
          cor_estampa: "Colorido",
          cor_material: "Transparente",
          composicao: "Vinil",
          tamanho: "10x10cm",
          fornecedor: "StickerPro",
        },
      },
    ],
  },

  {
    id_pedido: 4,
    num_pedido: "AB4920",
    url_foto_arte: "https://picsum.photos/400/300?random=4",
    etapa_pedido: "Finalizados",
    status: "finalizado",
    valor_total: 2100.00,
    descricao: "Kit corporativo",
    data_pedido: "2026-02-11",
    data_finalizacao: "2026-02-20",
    tipo_envio: "Transportadora",

    cliente: {
      id_usuario: 9,
      nome: "Roberto Lima",
    },

    responsavel_fase: {
      id_usuario: 10,
      nome: "Maria Clara",
    },

    vendedor: {
      id_usuario: 8,
      nome: "Fernanda Lima",
    },

    endereco: {
      cep: "22040-002",
      logradouro: "Rua Atlântica",
      numero: "455",
      complemento: "Cobertura",
    },

    itens_pedido: [
      {
        quantidade: 75,

        produto: {
          id_produto: 5,
          nome: "Agenda Personalizada",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo dourado na capa",
          cor_estampa: "Dourado",
          cor_material: "Preto",
          composicao: "Couro sintético",
          tamanho: "A5",
          fornecedor: "Papelaria Premium",
        },
      },

      {
        quantidade: 75,

        produto: {
          id_produto: 6,
          nome: "Caneta Executiva",
        },

        caracteristicas_item_pedido: {
          descricao_arte: null,
          cor_estampa: "Prata",
          cor_material: "Preto Fosco",
          composicao: "Metal",
          tamanho: null,
          fornecedor: "Executive Pens",
        },
      },
    ],
  },

  {
    id_pedido: 5,
    num_pedido: "HUIU76",
    url_foto_arte: "https://picsum.photos/400/300?random=5",
    etapa_pedido: "Logística",
    status: "enviado",
    valor_total: 760.30,
    descricao: "Rótulos para embalagens",
    data_pedido: "2026-02-15",
    data_finalizacao: "2026-02-21",
    tipo_envio: "Motoboy",

    cliente: {
      id_usuario: 11,
      nome: "Paula Oliveira",
    },

    responsavel_fase: {
      id_usuario: 12,
      nome: "Lucas Martins",
    },

    vendedor: {
      id_usuario: 3,
      nome: "Carlos",
    },

    endereco: {
      cep: "33015-250",
      logradouro: "Rua das Acácias",
      numero: "900",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 1000,

        produto: {
          id_produto: 7,
          nome: "Etiqueta Adesiva",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "QR Code e logo da empresa",
          cor_estampa: "Preto",
          cor_material: "Branco",
          composicao: "Papel Couchê",
          tamanho: "5x5cm",
          fornecedor: null,
        },
      },
    ],
  },

  {
    id_pedido: 6,
    num_pedido: "CD1001",
    url_foto_arte: "https://picsum.photos/400/300?random=6",
    etapa_pedido: "Design",
    status: "aguardando-arte",
    valor_total: 820.50,
    descricao: "Camisetas personalizadas",
    data_pedido: "2026-02-08",
    data_finalizacao: "2026-02-15",
    tipo_envio: "Entrega",

    cliente: {
      id_usuario: 2,
      nome: "Maria Santos",
    },

    responsavel_fase: {
      id_usuario: 3,
      nome: "Lucas",
    },

    vendedor: {
      id_usuario: 1,
      nome: "Carlos",
    },

    endereco: {
      cep: "04512-000",
      logradouro: "Rua Bela Cintra",
      numero: "245",
      complemento: "Casa",
    },

    itens_pedido: [
      {
        quantidade: 120,

        produto: {
          id_produto: 8,
          nome: "Camiseta Sublimada",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Arte frontal em alta definição",
          cor_estampa: "Azul",
          cor_material: "Branco",
          composicao: "Poliéster",
          tamanho: "M",
          fornecedor: "Textil Brasil",
        },
      },
    ],
  },

  {
    id_pedido: 7,
    num_pedido: "EF1002",
    url_foto_arte: "https://picsum.photos/400/300?random=7",
    etapa_pedido: "Design",
    status: "criando-mockup",
    valor_total: 1200.00,
    descricao: "Cartazes promocionais",
    data_pedido: "2026-02-09",
    data_finalizacao: "2026-02-20",
    tipo_envio: "Correios",

    cliente: {
      id_usuario: 3,
      nome: "Ana Costa",
    },

    responsavel_fase: {
      id_usuario: 2,
      nome: "Pedro",
    },

    vendedor: {
      id_usuario: 2,
      nome: "João",
    },

    endereco: {
      cep: "01310-100",
      logradouro: "Av. Brigadeiro Luís Antônio",
      numero: "980",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 60,

        produto: {
          id_produto: 9,
          nome: "Cartaz Couchê",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Promoção de verão",
          cor_estampa: "Colorido",
          cor_material: "Branco",
          composicao: "Papel Couchê 250g",
          tamanho: "A2",
          fornecedor: "Gráfica Master",
        },
      },
    ],
  },

  {
    id_pedido: 8,
    num_pedido: "GH1003",
    url_foto_arte: "https://picsum.photos/400/300?random=8",
    etapa_pedido: "Produção",
    status: "personalizando",
    valor_total: 650.75,
    descricao: "Adesivos com logotipo",
    data_pedido: "2026-02-10",
    data_finalizacao: "2026-02-18",
    tipo_envio: "Retirada",

    cliente: {
      id_usuario: 4,
      nome: "Roberto Lima",
    },

    responsavel_fase: {
      id_usuario: 3,
      nome: "Lucas",
    },

    vendedor: {
      id_usuario: 3,
      nome: "Fernanda",
    },

    endereco: {
      cep: "22040-001",
      logradouro: "Rua Barata Ribeiro",
      numero: "412",
      complemento: "Loja 2",
    },

    itens_pedido: [
      {
        quantidade: 350,

        produto: {
          id_produto: 10,
          nome: "Adesivo Transparente",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo minimalista",
          cor_estampa: "Preto",
          cor_material: "Transparente",
          composicao: "Vinil",
          tamanho: "8x8cm",
          fornecedor: "StickerBR",
        },
      },
    ],
  },

  {
    id_pedido: 9,
    num_pedido: "IJ1004",
    url_foto_arte: "https://picsum.photos/400/300?random=9",
    etapa_pedido: "Design",
    status: "impressao-fotolito",
    valor_total: 1450.00,
    descricao: "Banners para evento",
    data_pedido: "2026-02-11",
    data_finalizacao: "2026-02-25",
    tipo_envio: "Transportadora",

    cliente: {
      id_usuario: 5,
      nome: "Paula Oliveira",
    },

    responsavel_fase: {
      id_usuario: 2,
      nome: "Pedro",
    },

    vendedor: {
      id_usuario: 1,
      nome: "Carlos",
    },

    endereco: {
      cep: "13015-500",
      logradouro: "Rua Conceição",
      numero: "100",
      complemento: null,
    },

    itens_pedido: [
      {
        quantidade: 20,

        produto: {
          id_produto: 11,
          nome: "Banner Lona",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Evento corporativo",
          cor_estampa: "Colorido",
          cor_material: "Branco",
          composicao: "Lona Fosca",
          tamanho: "2x1m",
          fornecedor: "Mega Banner",
        },
      },
    ],
  },

  {
    id_pedido: 10,
    num_pedido: "KL1005",
    url_foto_arte: "https://picsum.photos/400/300?random=10",
    etapa_pedido: "Produção",
    status: "conferindo",
    valor_total: 780.25,
    descricao: "Embalagens personalizadas",
    data_pedido: "2026-02-12",
    data_finalizacao: "2026-02-22",
    tipo_envio: "Entrega",

    cliente: {
      id_usuario: 1,
      nome: "João Silva",
    },

    responsavel_fase: {
      id_usuario: 3,
      nome: "Lucas",
    },

    vendedor: {
      id_usuario: 2,
      nome: "João",
    },

    endereco: {
      cep: "04020-001",
      logradouro: "Rua Domingos de Morais",
      numero: "1520",
      complemento: "Galpão",
    },

    itens_pedido: [
      {
        quantidade: 80,

        produto: {
          id_produto: 12,
          nome: "Caixa Personalizada",
        },

        caracteristicas_item_pedido: {
          descricao_arte: "Logo nas laterais",
          cor_estampa: "Vermelho",
          cor_material: "Kraft",
          composicao: "Papelão reciclado",
          tamanho: "30x20cm",
          fornecedor: "BoxPrint",
        },
      },
    ],
  }
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

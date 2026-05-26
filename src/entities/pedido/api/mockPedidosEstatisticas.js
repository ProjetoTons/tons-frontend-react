/**
 * Mock Data para Gerenciamento de Pedidos
 * Simula dados que viriam do backend Spring MVC
 */

export const mockPedidosEstatisticas = [
  // --- 50% DA SEMANA ATUAL (17/05/2026 até 24/05/2026) - 13 itens ---
  {
    id_pedido: 1,
    num_pedido: "GL20DE",
    etapa_pedido: "Design",
    status: "impressao-fotolito",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-05-17",
    data_finalizacao: "2026-05-19",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: { id: 1, nome: "João Silva" },
    responsavel: { id: 2, nome: "Gustavo" },
    vendedor: { id: 2, nome: "João" }
  },
  {
    id_pedido: 2,
    num_pedido: "AL45DE",
    etapa_pedido: "Design",
    status: "aguardando-arte",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-05-18",
    data_finalizacao: "2026-05-20",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: { id: 1, nome: "João Silva" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 2, nome: "João" }
  },
  {
    id_pedido: 3,
    num_pedido: "FHJ329",
    etapa_pedido: "Design",
    status: "criando-mockup",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-05-18",
    data_finalizacao: "2026-05-21",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: { id: 1, nome: "João Silva" },
    responsavel: { id: 2, nome: "Thiago" },
    vendedor: { id: 2, nome: "Vitor" }
  },
  {
    id_pedido: 4,
    num_pedido: "AB4920",
    etapa_pedido: "Finalizados",
    status: "finalizado",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-05-19",
    data_finalizacao: "2026-05-21",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: { id: 1, nome: "João Silva" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 2, nome: "João" }
  },
  {
    id_pedido: 5,
    num_pedido: "HUIU76",
    etapa_pedido: "Finalizados",
    status: "finalizado",
    valor_total: 543.00,
    descricao: "Personalizados com logo",
    data_pedido: "2026-05-19",
    data_finalizacao: "2026-05-22",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: { id: 1, nome: "João Silva" },
    responsavel: { id: 2, nome: "Maria" },
    vendedor: { id: 2, nome: "Vitor" }
  },
  {
    id_pedido: 6,
    num_pedido: "CD1001",
    etapa_pedido: "Design",
    status: "aguardando-arte",
    valor_total: 820.50,
    descricao: "Camisetas personalizadas",
    data_pedido: "2026-05-20",
    data_finalizacao: "2026-05-24",
    fk_usuario_cliente: 2,
    fk_usuario_responsavel: 3,
    cliente: { id: 2, nome: "Maria Santos" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 1, nome: "Carlos" }
  },
  {
    id_pedido: 7,
    num_pedido: "EF1002",
    etapa_pedido: "Design",
    status: "criando-mockup",
    valor_total: 1200.00,
    descricao: "Cartazes promocionais",
    data_pedido: "2026-05-20",
    data_finalizacao: "2026-05-25",
    fk_usuario_cliente: 3,
    fk_usuario_responsavel: 2,
    cliente: { id: 3, nome: "Ana Costa" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 2, nome: "João" }
  },
  {
    id_pedido: 8,
    num_pedido: "GH1003",
    etapa_pedido: "Produção",
    status: "personalizando",
    valor_total: 650.75,
    descricao: "Adesivos com logotipo",
    data_pedido: "2026-05-21",
    data_finalizacao: "2026-05-26",
    fk_usuario_cliente: 4,
    fk_usuario_responsavel: 3,
    cliente: { id: 4, nome: "Roberto Lima" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 3, nome: "Fernanda" }
  },
  {
    id_pedido: 9,
    num_pedido: "IJ1004",
    etapa_pedido: "Design",
    status: "impressao-fotolito",
    valor_total: 1450.00,
    descricao: "Banners para evento",
    data_pedido: "2026-05-22",
    data_finalizacao: "2026-05-27",
    fk_usuario_cliente: 5,
    fk_usuario_responsavel: 2,
    cliente: { id: 5, nome: "Paula Oliveira" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 1, nome: "Carlos" }
  },
  {
    id_pedido: 10,
    num_pedido: "KL1005",
    etapa_pedido: "Produção",
    status: "conferindo",
    valor_total: 780.25,
    descricao: "Embalagens personalizadas",
    data_pedido: "2026-05-22",
    data_finalizacao: "2026-05-26",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 3,
    cliente: { id: 1, nome: "João Silva" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 2, nome: "João" }
  },
  {
    id_pedido: 11,
    num_pedido: "MN1006",
    etapa_pedido: "Produção",
    status: "personalizando",
    valor_total: 950.00,
    descricao: "Crachás e identificadores",
    data_pedido: "2026-05-23",
    data_finalizacao: "2026-05-28",
    fk_usuario_cliente: 2,
    fk_usuario_responsavel: 2,
    cliente: { id: 2, nome: "Maria Santos" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 3, nome: "Fernanda" }
  },
  {
    id_pedido: 12,
    num_pedido: "OP1007",
    etapa_pedido: "Embalagem",
    status: "quality-check",
    valor_total: 1100.50,
    descricao: "Cartões de visita personalizados",
    data_pedido: "2026-05-24",
    data_finalizacao: "2026-05-30",
    fk_usuario_cliente: 3,
    fk_usuario_responsavel: 3,
    cliente: { id: 3, nome: "Ana Costa" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 1, nome: "Carlos" }
  },
  {
    id_pedido: 13,
    num_pedido: "QR1008",
    etapa_pedido: "Embalagem",
    status: "embalagem",
    valor_total: 2300.00,
    descricao: "Kit promocional completo",
    data_pedido: "2026-05-24",
    data_finalizacao: "2026-06-05",
    fk_usuario_cliente: 4,
    fk_usuario_responsavel: 2,
    cliente: { id: 4, nome: "Roberto Lima" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 2, nome: "João" }
  },

  // --- 25% DA SEMANA PASSADA (10/05/2026 até 16/05/2026) - 6 itens ---
  {
    id_pedido: 14,
    num_pedido: "ST1009",
    etapa_pedido: "Embalagem",
    status: "medicao",
    valor_total: 580.00,
    descricao: "Etiquetas de preço",
    data_pedido: "2026-05-10",
    data_finalizacao: "2026-05-14",
    fk_usuario_cliente: 5,
    fk_usuario_responsavel: 3,
    cliente: { id: 5, nome: "Paula Oliveira" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 3, nome: "Fernanda" }
  },
  {
    id_pedido: 15,
    num_pedido: "UV1010",
    etapa_pedido: "Embalagem",
    status: "emitir-etiqueta",
    valor_total: 420.75,
    descricao: "Rótulos para embalagem",
    data_pedido: "2026-05-11",
    data_finalizacao: "2026-05-15",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: { id: 1, nome: "João Silva" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 1, nome: "Carlos" }
  },
  {
    id_pedido: 16,
    num_pedido: "WX1011",
    etapa_pedido: "Logística",
    status: "enviado",
    valor_total: 1890.00,
    descricao: "Calendários personalizados",
    data_pedido: "2026-05-13",
    data_finalizacao: "2026-05-18",
    fk_usuario_cliente: 2,
    fk_usuario_responsavel: 3,
    cliente: { id: 2, nome: "Maria Santos" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 2, nome: "João" }
  },
  {
    id_pedido: 17,
    num_pedido: "YZ1012",
    etapa_pedido: "Logística",
    status: "aguardando-retirada",
    valor_total: 755.50,
    descricao: "Sacolas de papel personalizadas",
    data_pedido: "2026-05-14",
    data_finalizacao: "2026-05-20",
    fk_usuario_cliente: 3,
    fk_usuario_responsavel: 2,
    cliente: { id: 3, nome: "Ana Costa" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 3, nome: "Fernanda" }
  },
  {
    id_pedido: 18,
    num_pedido: "AA1013",
    etapa_pedido: "Design",
    status: "aguardando-arte",
    valor_total: 1320.00,
    descricao: "Convites para evento",
    data_pedido: "2026-05-15",
    data_finalizacao: "2026-05-22",
    fk_usuario_cliente: 4,
    fk_usuario_responsavel: 3,
    cliente: { id: 4, nome: "Roberto Lima" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 1, nome: "Carlos" }
  },
  {
    id_pedido: 19,
    num_pedido: "BB1014",
    etapa_pedido: "Design",
    status: "criando-mockup",
    valor_total: 895.25,
    descricao: "Folders promocionais",
    data_pedido: "2026-05-16",
    data_finalizacao: "2026-05-24",
    fk_usuario_cliente: 5,
    fk_usuario_responsavel: 2,
    cliente: { id: 5, nome: "Paula Oliveira" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 2, nome: "João" }
  },

  // --- 25% MESES ANTERIORES (Jan, Fev, Mar, Abr) - 6 itens ---
  {
    id_pedido: 20,
    num_pedido: "CC1015",
    etapa_pedido: "Produção",
    status: "conferindo",
    valor_total: 1675.00,
    descricao: "Certificados personalizados",
    data_pedido: "2026-01-15",
    data_finalizacao: "2026-01-25",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 3,
    cliente: { id: 1, nome: "João Silva" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 3, nome: "Fernanda" }
  },
  {
    id_pedido: 21,
    num_pedido: "DD1016",
    etapa_pedido: "Design",
    status: "impressao-fotolito",
    valor_total: 2050.75,
    descricao: "Displays para ponto de venda",
    data_pedido: "2026-02-10",
    data_finalizacao: "2026-02-28",
    fk_usuario_cliente: 2,
    fk_usuario_responsavel: 2,
    cliente: { id: 2, nome: "Maria Santos" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 1, nome: "Carlos" }
  },
  {
    id_pedido: 22,
    num_pedido: "EE1017",
    etapa_pedido: "Produção",
    status: "conferindo",
    valor_total: 1130.50,
    descricao: "Manuais de instrução",
    data_pedido: "2026-03-05",
    data_finalizacao: "2026-03-12",
    fk_usuario_cliente: 3,
    fk_usuario_responsavel: 3,
    cliente: { id: 3, nome: "Ana Costa" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 2, nome: "João" }
  },
  {
    id_pedido: 23,
    num_pedido: "FF1018",
    etapa_pedido: "Produção",
    status: "personalizando",
    valor_total: 740.00,
    descricao: "Marcadores de páginas",
    data_pedido: "2026-03-22",
    data_finalizacao: "2026-04-02",
    fk_usuario_cliente: 4,
    fk_usuario_responsavel: 2,
    cliente: { id: 4, nome: "Roberto Lima" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 3, nome: "Fernanda" }
  },
  {
    id_pedido: 24,
    num_pedido: "GG1019",
    etapa_pedido: "Embalagem",
    status: "quality-check",
    valor_total: 1540.25,
    descricao: "Pôsteres decorativos",
    data_pedido: "2026-04-01",
    data_finalizacao: "2026-04-10",
    fk_usuario_cliente: 5,
    fk_usuario_responsavel: 3,
    cliente: { id: 5, nome: "Paula Oliveira" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 1, nome: "Carlos" }
  },
  {
    id_pedido: 25,
    num_pedido: "HH1020",
    etapa_pedido: "Embalagem",
    status: "embalagem",
    valor_total: 2100.00,
    descricao: "Caixas personalizadas para envio",
    data_pedido: "2026-04-18",
    data_finalizacao: "2026-04-28",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: { id: 1, nome: "João Silva" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 2, nome: "João" }
  },

  // '' --- NOVOS PEDIDOS "SEM RESPONSÁVEL" PARA TESTE --- ''
  {
    id_pedido: 26,
    num_pedido: "ORPH01",
    etapa_pedido: "Design",
    status: "aguardando-arte",
    valor_total: 350.00,
    descricao: "Criação de Logo Nova",
    data_pedido: "2026-05-22",
    data_finalizacao: "2026-05-23", // Data no passado para forçar o atraso na tabela!
    fk_usuario_cliente: 1,
    // fk_usuario_responsavel e responsavel REMOVIDOS PROPOSITALMENTE
    cliente: { id: 1, nome: "João Silva" },
    vendedor: { id: 1, nome: "Carlos" }
  },
  {
    id_pedido: 27,
    num_pedido: "ORPH02",
    etapa_pedido: "Produção",
    status: "conferindo",
    valor_total: 120.50,
    descricao: "Canecas Brancas",
    data_pedido: "2026-05-23",
    data_finalizacao: "2026-05-24", // Vence hoje
    fk_usuario_cliente: 3,
    cliente: { id: 3, nome: "Ana Costa" },
    vendedor: { id: 2, nome: "João" }
  },
  {
    id_pedido: 28,
    num_pedido: "ORPH03",
    etapa_pedido: "Embalagem",
    status: "quality-check",
    valor_total: 890.00,
    descricao: "Lote de agendas",
    data_pedido: "2026-05-18",
    data_finalizacao: "2026-05-25",
    fk_usuario_cliente: 4,
    cliente: { id: 4, nome: "Roberto Lima" },
    vendedor: { id: 3, nome: "Fernanda" }
  },
  {
    id_pedido: 29,
    num_pedido: "ORPH04",
    etapa_pedido: "Logística",
    status: "aguardando-retirada",
    valor_total: 115.00,
    descricao: "Adesivos recorte",
    data_pedido: "2026-05-21",
    data_finalizacao: "2026-05-26",
    fk_usuario_cliente: 5,
    cliente: { id: 5, nome: "Paula Oliveira" },
    vendedor: { id: 1, nome: "Carlos" }
  },
  {
    id_pedido: 30,
    num_pedido: "ORPH05",
    etapa_pedido: "Design",
    status: "criando-mockup",
    valor_total: 620.00,
    descricao: "Identidade Visual Evento",
    data_pedido: "2026-05-24",
    data_finalizacao: "2026-05-29",
    fk_usuario_cliente: 2,
    cliente: { id: 2, nome: "Maria Santos" },
    vendedor: { id: 2, nome: "João" }
  },

  // --- PEDIDOS ADICIONAIS ATRASADOS ---
  {
    id_pedido: 31,
    num_pedido: "TR2001",
    etapa_pedido: "Produção",
    status: "personalizando",
    valor_total: 480.00,
    descricao: "Squeeze personalizado 500ml",
    data_pedido: "2026-05-10",
    data_finalizacao: "2026-05-18",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 2,
    cliente: { id: 1, nome: "João Silva" },
    responsavel: { id: 2, nome: "Gustavo" },
    vendedor: { id: 1, nome: "Carlos" }
  },
  {
    id_pedido: 32,
    num_pedido: "TR2002",
    etapa_pedido: "Design",
    status: "aguardando-aprovacao",
    valor_total: 1320.00,
    descricao: "Uniformes corporativos",
    data_pedido: "2026-05-08",
    data_finalizacao: "2026-05-16",
    fk_usuario_cliente: 3,
    fk_usuario_responsavel: 3,
    cliente: { id: 3, nome: "Ana Costa" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 2, nome: "João" }
  },
  {
    id_pedido: 33,
    num_pedido: "TR2003",
    etapa_pedido: "Produção",
    status: "conferindo",
    valor_total: 790.50,
    descricao: "Ecobags personalizadas",
    data_pedido: "2026-05-12",
    data_finalizacao: "2026-05-19",
    fk_usuario_cliente: 4,
    fk_usuario_responsavel: 2,
    cliente: { id: 4, nome: "Roberto Lima" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 3, nome: "Fernanda" }
  },
  {
    id_pedido: 34,
    num_pedido: "TR2004",
    etapa_pedido: "Design",
    status: "aguardando-arte",
    valor_total: 2150.00,
    descricao: "Painel fotográfico evento",
    data_pedido: "2026-05-05",
    data_finalizacao: "2026-05-13",
    fk_usuario_cliente: 2,
    fk_usuario_responsavel: 3,
    cliente: { id: 2, nome: "Maria Santos" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 1, nome: "Carlos" }
  },
  {
    id_pedido: 35,
    num_pedido: "TR2005",
    etapa_pedido: "Embalagem",
    status: "embalagem",
    valor_total: 560.00,
    descricao: "Brindes corporativos",
    data_pedido: "2026-05-14",
    data_finalizacao: "2026-05-20",
    fk_usuario_cliente: 5,
    fk_usuario_responsavel: 2,
    cliente: { id: 5, nome: "Paula Oliveira" },
    responsavel: { id: 2, nome: "Gustavo" },
    vendedor: { id: 2, nome: "João" }
  },
  {
    id_pedido: 36,
    num_pedido: "TR2006",
    etapa_pedido: "Produção",
    status: "personalizando",
    valor_total: 1870.00,
    descricao: "Catálogo de produtos 2026",
    data_pedido: "2026-05-06",
    data_finalizacao: "2026-05-17",
    fk_usuario_cliente: 1,
    fk_usuario_responsavel: 3,
    cliente: { id: 1, nome: "João Silva" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 3, nome: "Fernanda" }
  },
  {
    id_pedido: 37,
    num_pedido: "TR2007",
    etapa_pedido: "Design",
    status: "criando-mockup",
    valor_total: 430.00,
    descricao: "Tags para roupas",
    data_pedido: "2026-05-15",
    data_finalizacao: "2026-05-21",
    fk_usuario_cliente: 3,
    fk_usuario_responsavel: 2,
    cliente: { id: 3, nome: "Ana Costa" },
    responsavel: { id: 2, nome: "Pedro" },
    vendedor: { id: 1, nome: "Carlos" }
  },
  {
    id_pedido: 38,
    num_pedido: "TR2008",
    etapa_pedido: "Embalagem",
    status: "quality-check",
    valor_total: 980.00,
    descricao: "Capas de caderno personalizadas",
    data_pedido: "2026-05-09",
    data_finalizacao: "2026-05-18",
    fk_usuario_cliente: 4,
    fk_usuario_responsavel: 3,
    cliente: { id: 4, nome: "Roberto Lima" },
    responsavel: { id: 3, nome: "Lucas" },
    vendedor: { id: 2, nome: "João" }
  }
];


/**
 * Endpoint Simulado: GET /api/dashboard/kpis?startDate={}&endDate={}
 * Objetivo: Retornar os 4 blocos de estatísticas globais da tela.
 */
export const fetchKpisDashboard = async (startDate, endDate) => {
  // Simula o tempo de resposta da internet (500ms)
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 1. O Backend filtra as datas no banco de dados (WHERE data >= startDate...)
  const pedidosFiltrados = mockPedidosEstatisticas.filter((p) => {
    const d = new Date(`${p.data_pedido}T00:00:00`);
    return d >= startDate && d <= endDate;
  });

  // 2. O Backend soma os valores e devolve o JSON pronto
  return {
    totalHoje: pedidosFiltrados.reduce((sum, p) => sum + p.valor_total, 0),
    aguardandoArte: pedidosFiltrados.filter(p => p.status === "aguardando-arte").length,
    enviadoAguardandoRetirada: pedidosFiltrados.filter(p => p.status === "enviado" || p.status === "aguardando-retirada").length,
    concluido: pedidosFiltrados.filter(p => p.status === "finalizado").length,
    totalPedidos: pedidosFiltrados.length,
  };
};


/**
 * Endpoint Simulado: GET /api/dashboard/grafico-etapas?startDate={}&endDate={}
 * Objetivo: Retornar agrupamento para o Gráfico 1 (Quantidade e Valor por Sub-etapa)
 */
export const fetchGraficoEtapas = async (startDate, endDate) => {
  // Simula o tempo de resposta da internet (800ms - query um pouco mais pesada)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 1. O Backend filtra as datas
  const pedidosFiltrados = mockPedidosEstatisticas.filter((p) => {
    const d = new Date(`${p.data_pedido}T00:00:00`);
    return d >= startDate && d <= endDate;
  });

  // 2. O Backend agrupa por Etapa e Status (Simulando um GROUP BY do SQL)
  const agrupamento = {};

  pedidosFiltrados.forEach((p) => {
    // Se a etapa ainda não existe no objeto, cria
    if (!agrupamento[p.etapa_pedido]) {
      agrupamento[p.etapa_pedido] = {};
    }
    
    // Se a sub-etapa (status) não existe dentro da etapa, cria
    if (!agrupamento[p.etapa_pedido][p.status]) {
      agrupamento[p.etapa_pedido][p.status] = { quantidadePedidos: 0, valorTotalArrecadado: 0 };
    }

    // Soma as quantidades e valores
    agrupamento[p.etapa_pedido][p.status].quantidadePedidos += 1;
    agrupamento[p.etapa_pedido][p.status].valorTotalArrecadado += p.valor_total;
  });

  // 3. O Backend formata o objeto para o JSON Exato do nosso Contrato de API
  const respostaJson = Object.keys(agrupamento).map((nomeDaEtapa) => {
    return {
      etapa: nomeDaEtapa,
      subEtapas: Object.keys(agrupamento[nomeDaEtapa]).map((nomeDoStatus) => ({
        nome: nomeDoStatus,
        quantidadePedidos: agrupamento[nomeDaEtapa][nomeDoStatus].quantidadePedidos,
        valorTotalArrecadado: agrupamento[nomeDaEtapa][nomeDoStatus].valorTotalArrecadado,
      }))
    };
  });

  return respostaJson;
};

/**
 * Endpoint Simulado: GET /api/dashboard/performance-funcionarios?startDate={}&endDate={}
 * Objetivo: Retornar agrupamento para o Gráfico 2 (Tarefas por macro-etapa por funcionário)
 */
export const fetchPerformanceFuncionarios = async (startDate, endDate) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const pedidosFiltrados = mockPedidosEstatisticas.filter((p) => {
    const d = new Date(`${p.data_pedido}T00:00:00`);
    return d >= startDate && d <= endDate;
  });

  const agrupamento = {};

  pedidosFiltrados.forEach((p) => {
    // Intercepta pedidos sem responsável
    const id = p.fk_usuario_responsavel || 9999; 
    const nome = p.responsavel?.nome || "Sem responsável"; 
    const etapa = p.etapa_pedido;

    // Cria a estrutura com as 4 macro-etapas zeradas
    if (!agrupamento[id]) {
      agrupamento[id] = {
        nomeFuncionario: nome,
        tarefas: { design: 0, producao: 0, embalagem: 0, logistica: 0 }
      };
    }

    // Mapeamento exato (1 para 1)
    if (etapa === "Design") {
      agrupamento[id].tarefas.design += 1;
    } else if (etapa === "Produção") {
      agrupamento[id].tarefas.producao += 1;
    } else if (etapa === "Embalagem") {
      agrupamento[id].tarefas.embalagem += 1; 
    } else if (etapa === "Logística") {
      agrupamento[id].tarefas.logistica += 1; 
    }
  });

  const respostaJson = Object.keys(agrupamento).map((idStr) => {
    return {
      idFuncionario: parseInt(idStr),
      nomeFuncionario: agrupamento[idStr].nomeFuncionario,
      tarefas: agrupamento[idStr].tarefas
    };
  });

  return respostaJson;
};

/**
 * Endpoint Simulado: GET /api/dashboard/pedidos-atrasados
 * Objetivo: Retornar lista de pedidos com prazo estourado ou vencendo hoje.
 */
export const fetchPedidosAtrasados = async () => {
  // Simula o tempo de resposta da internet (400ms)
  await new Promise((resolve) => setTimeout(resolve, 400));

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Pega apenas pedidos que AINDA NÃO foram entregues/finalizados
  const pedidosPendentes = mockPedidosEstatisticas.filter(p => p.status !== "finalizado" && p.status !== "enviado");

  const tabelaAtrasados = pedidosPendentes.map(p => {
    const prazo = new Date(`${p.data_finalizacao}T00:00:00`);
    
    // Calcula a diferença em dias
    const diferencaTempo = hoje.getTime() - prazo.getTime();
    const diasAtraso = Math.ceil(diferencaTempo / (1000 * 3600 * 24));

    let statusAtraso = "NO_PRAZO";
    if (diasAtraso > 0) statusAtraso = "ATRASADO";
    else if (diasAtraso === 0) statusAtraso = "VENCE_HOJE";

    return {
      idPedido: p.id_pedido,
      numPedido: p.num_pedido,
      nomeResponsavel: p.responsavel?.nome || "Sem responsável",
      macroEtapa: p.etapa_pedido, // Ex: "Design"
      subEtapa: p.status,         // Ex: "aguardando-arte"
      prazoFinal: p.data_finalizacao,
      statusAtraso,
      diasAtraso: diasAtraso > 0 ? diasAtraso : 0
    };
  });

  // Filtra apenas os que exigem atenção (vencem hoje ou estão atrasados)
  // E ordena do MAIS ATRASADO para o menos atrasado
  return tabelaAtrasados
    .filter(p => p.statusAtraso !== "NO_PRAZO")
    .sort((a, b) => b.diasAtraso - a.diasAtraso);
};

// Estatísticas calculadas a partir dos pedidos
export const calcularEstatisticas = (pedidos) => {
  return {
    totalHoje: pedidos.reduce((sum, p) => sum + p.
    valor_total, 0),
    aguardandoArte: pedidos.filter(p => p.status === "aguardando-arte").length,
    enviadoAguardandoRetirada: pedidos.filter(p => p.status === "enviado" || p.status === "aguardando-retirada").length,
    concluido: pedidos.filter(p => p.status === "finalizado").length,
    totalPedidos: pedidos.length,
  };
};

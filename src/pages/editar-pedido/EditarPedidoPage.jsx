import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNavBar from "@/widgets/topnav-grafica/TopNavBar";
import InputForm from "@/shared/ui/molecules/FormField/FormField";
import { http } from "@/shared/api/http";
import { getUsuario } from "@/shared/api/authToken";
import { fetchPedidoById, editarPedido } from "@/entities/pedido/api/pedidosApi";
import { employeeApi } from "@/entities/employee/api/employeeApi";
import { uploadImagem } from "@/shared/api/cloudnaryUpload";

export default function EditarPedidoPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const usuarioLogado = getUsuario() || { id: null, nome: "Usuário" };
  const fileInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [loading, setLoading] = useState(true);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nomeCliente: "",
    numPedido: "",
    idCliente: "",
    descricaoProjeto: "",
    status: "",
    etapaPedido: "",
    tipoEnvio: "",
    responsavel: "",
    dataInicio: "",
    dataEntrega: "",
  });

  // Autocomplete de clientes
  const [clienteSugestoes, setClienteSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [clientesCache, setClientesCache] = useState([]);
  const debounceTimer = useRef(null);

  const [itens, setItens] = useState([]);
  const [mockupFile, setMockupFile] = useState(null);
  const [errosValidacao, setErrosValidacao] = useState({});
  const [mockupPreview, setMockupPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [urlFotoArteExistente, setUrlFotoArteExistente] = useState(null);
  const [idEnderecoExistente, setIdEnderecoExistente] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Produtos do banco para autocomplete
  const [produtosCache, setProdutosCache] = useState([]);
  const [produtoSugestoes, setProdutoSugestoes] = useState({ index: null, lista: [] });

  useEffect(() => {
    http.get("/produtos")
      .then(({ data }) => setProdutosCache(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  }, []);

  // Carrega dados do pedido
  useEffect(() => {
    if (!id) return;

    fetchPedidoById(Number(id))
      .then((pedido) => {
        if (!pedido) return;

        setFormData({
          nomeCliente: pedido.cliente?.nome || "",
          numPedido: pedido.num_pedido || "",
          idCliente: pedido.cliente?.id_usuario ? String(pedido.cliente.id_usuario) : "",
          descricaoProjeto: pedido.descricao || "",
          status: pedido.status || "",
          etapaPedido: pedido.etapa_pedido || "",
          tipoEnvio: pedido.tipo_envio || "",
          responsavel: pedido.responsavel?.id ? String(pedido.responsavel.id) : "",
          dataInicio: pedido.data_pedido || "",
          dataEntrega: pedido.data_finalizacao || "",
        });

        setUrlFotoArteExistente(pedido.url_foto_arte || null);
        if (pedido.url_foto_arte) setMockupPreview(pedido.url_foto_arte);
        if (pedido.endereco?.id) setIdEnderecoExistente(pedido.endereco.id);

        // Mapear itens
        const itensMapeados = (pedido.itens_pedido || []).map((item) => ({
          produto: item.produto?.nome || "",
          idProduto: item.produto?.id_produto || null,
          corEstampa: item.caracteristicas_item_pedido?.cor_estampa || "",
          corMaterial: item.caracteristicas_item_pedido?.cor_material || "",
          composicao: item.caracteristicas_item_pedido?.composicao || "",
          tamanho: item.caracteristicas_item_pedido?.tamanho || "",
          quantidade: item.quantidade || "",
          valorUnitario: item.valor_unitario || "",
          descricaoArte: item.caracteristicas_item_pedido?.descricao_arte || "",
        }));

        setItens(itensMapeados.length > 0 ? itensMapeados : [
          { produto: "", idProduto: null, corEstampa: "", corMaterial: "", composicao: "", tamanho: "", quantidade: "", valorUnitario: "", descricaoArte: "" },
        ]);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar pedido:", err);
        showToast("Erro ao carregar pedido.");
        setLoading(false);
      });
  }, [id]);

  // Carrega clientes
  useEffect(() => {
    http.get("/usuarios")
      .then(({ data }) => {
        const clientes = (Array.isArray(data) ? data : [])
          .filter((u) => u.cnpj || u.cpf)
          .map((u) => ({ id: u.id, nome: u.nomeCompleto || u.nome || "", nomeEmpresa: u.nomeEmpresa || "" }));
        setClientesCache(clientes);
      })
      .catch(() => {});
  }, []);

  const handleProdutoInput = (index, value) => {
    handleItemChange(index, "produto", value);
    if (value.length < 2) {
      setProdutoSugestoes({ index: null, lista: [] });
      return;
    }
    const termo = value.toLowerCase();
    const filtrados = produtosCache.filter((p) =>
      (p.nome || p.title || "").toLowerCase().includes(termo)
    );
    setProdutoSugestoes({ index, lista: filtrados.slice(0, 6) });
  };

  const selecionarProduto = (index, produto) => {
    setItens((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], produto: produto.nome || produto.title || "", idProduto: produto.id };
      return updated;
    });
    setProdutoSugestoes({ index: null, lista: [] });
  };

  // Fecha autocomplete ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
        setShowSugestoes(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtra clientes localmente
  const buscarClientes = useCallback((termo) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!termo || termo.length < 2) {
      setClienteSugestoes([]);
      setShowSugestoes(false);
      return;
    }
    debounceTimer.current = setTimeout(() => {
      const termoLower = termo.toLowerCase();
      const resultados = clientesCache.filter(
        (c) =>
          (c.nome || "").toLowerCase().includes(termoLower) ||
          (c.nomeEmpresa || "").toLowerCase().includes(termoLower)
      );
      setClienteSugestoes(resultados);
      setShowSugestoes(true);
    }, 300);
  }, [clientesCache]);

  const handleNomeClienteChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, nomeCliente: value, idCliente: "" }));
    buscarClientes(value);
  };

  const handleSelecionarCliente = (cliente) => {
    setFormData((prev) => ({
      ...prev,
      nomeCliente: cliente.nome || cliente.nomeEmpresa || "",
      idCliente: String(cliente.id || ""),
    }));
    setShowSugestoes(false);
    setClienteSugestoes([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setItens((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addItem = () => {
    setItens((prev) => [
      ...prev,
      { produto: "", idProduto: null, corEstampa: "", corMaterial: "", composicao: "", tamanho: "", quantidade: "", valorUnitario: "", descricaoArte: "" },
    ]);
  };

  const removeItem = (index) => {
    setItens((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMockupChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMockupFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setMockupPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação local
    const erros = {};
    if (!formData.nomeCliente.trim() || !formData.idCliente) erros.nomeCliente = true;
    if (!formData.numPedido) erros.numPedido = true;

    const itensComErro = [];
    itens.forEach((item, i) => {
      const erroItem = {};
      if (!item.idProduto) erroItem.produto = true;
      if (!item.quantidade || Number(item.quantidade) <= 0) erroItem.quantidade = true;
      if (!item.valorUnitario || Number(item.valorUnitario) <= 0) erroItem.valorUnitario = true;
      if (Object.keys(erroItem).length > 0) itensComErro.push({ index: i, ...erroItem });
    });

    if (itensComErro.length > 0) erros.itens = itensComErro;

    if (Object.keys(erros).length > 0) {
      setErrosValidacao(erros);
      showToast("Preencha todos os campos obrigatórios antes de salvar.");
      return;
    }

    setErrosValidacao({});
    setIsSubmitting(true);

    try {
      // Buscar endereço do cliente
      let idEndereco = idEnderecoExistente;
      if (formData.idCliente) {
        try {
          const { data: endereco } = await http.get(`/usuarios/${formData.idCliente}/endereco`);
          if (endereco && endereco.id) idEndereco = endereco.id;
        } catch (e) {
          // mantém endereço existente
        }
      }

      if (!idEndereco) {
        showToast("O cliente selecionado não possui endereço cadastrado.");
        setIsSubmitting(false);
        return;
      }

      const itensValidos = itens.filter((item) => item.idProduto && item.quantidade > 0);

      // Upload da arte/mockup se novo arquivo selecionado
      let urlFotoArte = urlFotoArteExistente;
      if (mockupFile) {
        try {
          const resultado = await uploadImagem(mockupFile, "tons/pedidos");
          urlFotoArte = resultado.url;
        } catch (e) {
          console.error("Erro no upload da arte:", e);
        }
      }

      const payload = {
        numPedido: formData.numPedido,
        descricao: formData.descricaoProjeto || "",
        urlFotoArte,
        status: formData.status || "Não Iniciado",
        etapaPedido: formData.etapaPedido || "Design",
        tipoEnvio: formData.tipoEnvio || null,
        valorTotal: itensValidos.reduce((acc, item) => acc + (Number(item.valorUnitario) || 0) * (Number(item.quantidade) || 0), 0),
        dataPedido: formData.dataInicio ? new Date(formData.dataInicio).toISOString() : new Date().toISOString(),
        idEndereco,
        idUsuarioCliente: Number(formData.idCliente),
        idUsuarioResponsavel: formData.responsavel ? Number(formData.responsavel) : null,
        itens: itensValidos.map((item) => ({
          idProduto: item.idProduto,
          quantidade: Number(item.quantidade),
          valorUnitario: Number(item.valorUnitario) || 0,
          caracteristicas: {
            descricaoArte: item.descricaoArte || null,
            corEstampa: item.corEstampa || null,
            corMaterial: item.corMaterial || null,
            composicao: item.composicao || null,
            tamanho: item.tamanho || null,
          },
        })),
      };

      await http.put(`/pedidos/${id}`, payload);
      showToast("Pedido atualizado com sucesso!", "success");
      setTimeout(() => navigate("/pedidos"), 1500);
    } catch (err) {
      console.error("Erro ao atualizar pedido:", err);
      showToast("Erro ao atualizar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    "Em Avaliação",
    "Não Iniciado",
    "Aguardando arte",
    "Criando Mockup",
    "Em Produção",
  ];

  const etapaOptions = [
    "Design",
    "Impressão fotolito",
    "Conferindo",
    "Personalizando",
    "Quality check",
    "Embalagem",
    "Medição",
    "Emitir etiqueta",
    "Enviado",
    "Aguardando retirada",
    "Concluído",
  ];

  const [responsavelOptions, setResponsavelOptions] = useState([]);

  useEffect(() => {
    employeeApi.listar()
      .then((funcionarios) => {
        const opcoes = funcionarios.map((f) => ({
          id: f.id,
          nome: f.nomeCompleto || f.nome || "Funcionário",
        }));
        setResponsavelOptions(opcoes);
      })
      .catch((err) => console.error("Erro ao carregar funcionários:", err));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <TopNavBar currentPage="pedidos" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-gray-500">Carregando pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <TopNavBar currentPage="pedidos" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => navigate("/pedidos")}
          className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-2 cursor-pointer bg-transparent border-0"
        >
          <span className="text-sm">←</span> Voltar para Gerenciamento de Pedidos
        </button>
        <h1 className="font-[family-name:var(--fonte-space)] font-bold text-2xl md:text-3xl uppercase tracking-tight text-[#161616] mb-1">
          Editar Pedido #{formData.numPedido}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Atualização de ordem de serviço existente.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna Principal (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dados do Cliente */}
              <section className="bg-white border border-gray-200 p-6">
                <h2 className="font-[family-name:var(--fonte-space)] font-bold text-sm uppercase tracking-wide mb-4">
                  Dados do Cliente
                </h2>

                <div className="space-y-4">
                  <div className="relative" ref={autocompleteRef}>
                    <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                      Nome Completo / Razão Social
                    </label>
                    <input
                      type="text"
                      name="nomeCliente"
                      placeholder="Nome do responsável ou empresa"
                      value={formData.nomeCliente}
                      onChange={handleNomeClienteChange}
                      autoComplete="off"
                      className="w-full bg-[#EFEFEF] text-gray-800 text-sm py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#FFE300]"
                    />
                    {showSugestoes && clienteSugestoes.length > 0 && (
                      <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
                        {clienteSugestoes.map((cliente) => (
                          <li
                            key={cliente.id}
                            onClick={() => handleSelecionarCliente(cliente)}
                            className="px-4 py-2 text-sm hover:bg-[#FFF9C4] cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-0"
                          >
                            <span className="font-medium text-gray-800">
                              {cliente.nome || cliente.nomeEmpresa}
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase">
                              ID: {cliente.id}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputForm
                      label="Nº do Pedido"
                      name="numPedido"
                      placeholder="Número do pedido"
                      value={formData.numPedido}
                      readOnly
                    />
                    <InputForm
                      label="ID do Cliente"
                      name="idCliente"
                      placeholder="Preenchido automaticamente"
                      value={formData.idCliente}
                      onChange={handleChange}
                      disabled={!!formData.idCliente}
                    />
                  </div>
                </div>
              </section>

              {/* Detalhes do Projeto */}
              <section className="bg-white border border-gray-200 p-6">
                <h2 className="font-[family-name:var(--fonte-space)] font-bold text-sm uppercase tracking-wide mb-4">
                  Detalhes do Projeto
                </h2>

                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                    Descrição Técnica do Projeto
                  </label>
                  <textarea
                    name="descricaoProjeto"
                    placeholder="Descreva as especificações, acabamento e detalhes especiais..."
                    value={formData.descricaoProjeto}
                    onChange={handleChange}
                    rows={5}
                    className="w-full bg-[#EFEFEF] text-gray-800 text-sm py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#FFE300] resize-none"
                  />
                </div>
              </section>

              {/* Itens e Composição */}
              <section className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-[family-name:var(--fonte-space)] font-bold text-sm uppercase tracking-wide">
                    Itens e Composição
                  </h2>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs font-semibold uppercase tracking-wider bg-transparent border border-gray-300 px-3 py-1.5 hover:bg-gray-100 cursor-pointer flex items-center gap-1"
                  >
                    + Adicionar Item
                  </button>
                </div>

                {/* Cabeçalho da tabela */}
                <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1.5fr_0.8fr_0.6fr_0.8fr_0.4fr] gap-2 text-[10px] text-gray-500 uppercase font-semibold tracking-wider mb-2 px-1">
                  <span>Produto</span>
                  <span>Cor Estampa</span>
                  <span>Cor Material</span>
                  <span>Composição</span>
                  <span>Tamanho</span>
                  <span>QTD</span>
                  <span>Valor Unit.</span>
                  <span>Ações</span>
                </div>

                {/* Linhas de itens */}
                <div className="space-y-2">
                  {itens.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-2">
                      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1.5fr_0.8fr_0.6fr_0.8fr_0.4fr] gap-2 items-center">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Nome do produto"
                            value={item.produto}
                            onChange={(e) => handleProdutoInput(index, e.target.value)}
                            onBlur={() => setTimeout(() => setProdutoSugestoes({ index: null, lista: [] }), 150)}
                            className={`text-sm py-2 px-3 focus:outline-none focus:ring-1 w-full ${errosValidacao.itens?.find(e => e.index === index)?.produto ? 'bg-red-50 border border-red-400 focus:ring-red-400' : 'bg-[#EFEFEF] focus:ring-[#FFE300]'}`}
                          />
                          {produtoSugestoes.index === index && produtoSugestoes.lista.length > 0 && (
                            <ul className="absolute z-50 top-full left-0 right-0 bg-white border border-gray-200 shadow-lg max-h-[180px] overflow-y-auto">
                              {produtoSugestoes.lista.map((p) => (
                                <li
                                  key={p.id}
                                  onMouseDown={() => selecionarProduto(index, p)}
                                  className="px-3 py-2 text-sm text-gray-800 hover:bg-[#FFE300] hover:text-black cursor-pointer"
                                >
                                  {p.nome || p.title}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-black border border-gray-300 inline-block flex-shrink-0"></span>
                          <input
                            type="text"
                            placeholder="Cor"
                            value={item.corEstampa}
                            onChange={(e) => handleItemChange(index, "corEstampa", e.target.value)}
                            className="bg-[#EFEFEF] text-sm py-2 px-2 focus:outline-none focus:ring-1 focus:ring-[#FFE300] w-full"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-white border border-gray-300 inline-block flex-shrink-0"></span>
                          <input
                            type="text"
                            placeholder="Cor"
                            value={item.corMaterial}
                            onChange={(e) => handleItemChange(index, "corMaterial", e.target.value)}
                            className="bg-[#EFEFEF] text-sm py-2 px-2 focus:outline-none focus:ring-1 focus:ring-[#FFE300] w-full"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Ex: 100% Algodão"
                          value={item.composicao}
                          onChange={(e) => handleItemChange(index, "composicao", e.target.value)}
                          className="bg-[#EFEFEF] text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#FFE300] w-full"
                        />
                        <input
                          type="text"
                          placeholder="G"
                          value={item.tamanho}
                          onChange={(e) => handleItemChange(index, "tamanho", e.target.value)}
                          className="bg-[#EFEFEF] text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#FFE300] w-full"
                        />
                        <input
                          type="number"
                          placeholder="0"
                          value={item.quantidade}
                          onChange={(e) => handleItemChange(index, "quantidade", e.target.value)}
                          className={`text-sm py-2 px-3 focus:outline-none focus:ring-1 w-full ${errosValidacao.itens?.find(e => e.index === index)?.quantidade ? 'bg-red-50 border border-red-400 focus:ring-red-400' : 'bg-[#EFEFEF] focus:ring-[#FFE300]'}`}
                        />
                        <input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          value={item.valorUnitario}
                          onChange={(e) => handleItemChange(index, "valorUnitario", e.target.value)}
                          className={`text-sm py-2 px-3 focus:outline-none focus:ring-1 w-full ${errosValidacao.itens?.find(e => e.index === index)?.valorUnitario ? 'bg-red-50 border border-red-400 focus:ring-red-400' : 'bg-[#EFEFEF] focus:ring-[#FFE300]'}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-gray-400 hover:text-red-500 cursor-pointer bg-transparent border-0 flex items-center justify-center"
                          title="Remover item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      {/* Descrição da Arte */}
                      <div className="mt-1">
                        <input
                          type="text"
                          placeholder="Descrição da arte (opcional)"
                          value={item.descricaoArte}
                          onChange={(e) => handleItemChange(index, "descricaoArte", e.target.value)}
                          className="bg-[#EFEFEF] text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#FFE300] w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Coluna Lateral (1/3) */}
            <div className="space-y-6">
              {/* Preview de Produção */}
              <section className="bg-white border border-gray-200 p-6">
                <h2 className="font-[family-name:var(--fonte-space)] font-bold text-sm uppercase tracking-wide mb-4">
                  Preview de Produção
                </h2>

                <div
                  className="border-2 border-dashed border-gray-300 bg-[#FAFAFA] flex flex-col items-center justify-center py-6 px-4 cursor-pointer hover:border-[#FFE300] transition-colors mb-3"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={handleMockupChange}
                    className="hidden"
                  />
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {mockupPreview ? "Alterar Mockup" : "Upload de Mockup"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Arraste arquivos ou clique para selecionar (PNG, JPG, PDF)
                  </p>
                </div>

                <div className="w-full h-[140px] bg-[#1A1A1A] rounded-sm overflow-hidden flex items-center justify-center">
                  {mockupPreview ? (
                    <img
                      src={mockupPreview}
                      alt="Preview do mockup"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-600 text-xs">Sem preview</span>
                  )}
                </div>
              </section>

              {/* Dados Técnicos */}
              <section className="bg-white border border-gray-200 p-6">
                <h2 className="font-[family-name:var(--fonte-space)] font-bold text-sm uppercase tracking-wide mb-4">
                  Dados Técnicos
                </h2>

                <div className="space-y-4">
                  {/* Status */}
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full bg-[#EFEFEF] text-gray-800 text-sm py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#FFE300] appearance-none cursor-pointer"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Etapa */}
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                      Etapa
                    </label>
                    <select
                      name="etapaPedido"
                      value={formData.etapaPedido}
                      onChange={handleChange}
                      className="w-full bg-[#EFEFEF] text-gray-800 text-sm py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#FFE300] appearance-none cursor-pointer"
                    >
                      {etapaOptions.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>

                  {/* Responsável */}
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                      Responsável
                    </label>
                    <select
                      name="responsavel"
                      value={formData.responsavel}
                      onChange={handleChange}
                      className="w-full bg-[#EFEFEF] text-gray-800 text-sm py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#FFE300] appearance-none cursor-pointer"
                    >
                      <option value="">Selecionar responsável</option>
                      {responsavelOptions.map((func) => (
                        <option key={func.id} value={func.id}>
                          {func.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tipo de Envio */}
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                      Tipo de Envio
                    </label>
                    <select
                      name="tipoEnvio"
                      value={formData.tipoEnvio}
                      onChange={handleChange}
                      className="w-full bg-[#EFEFEF] text-gray-800 text-sm py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#FFE300] appearance-none cursor-pointer"
                    >
                      <option value="">Selecionar tipo</option>
                      <option value="Retirada">Retirada</option>
                      <option value="Entrega">Entrega</option>
                    </select>
                  </div>

                  {/* Data de Início */}
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      name="dataInicio"
                      value={formData.dataInicio}
                      onChange={handleChange}
                      className="w-full bg-[#EFEFEF] text-gray-800 text-sm py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#FFE300]"
                    />
                  </div>

                  {/* Data de Entrega */}
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                      Data de Entrega
                    </label>
                    <input
                      type="date"
                      name="dataEntrega"
                      value={formData.dataEntrega}
                      onChange={handleChange}
                      className="w-full bg-[#EFEFEF] text-gray-800 text-sm py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#FFE300]"
                    />
                  </div>
                </div>

                {/* Botão Salvar */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-[#FFE300] hover:bg-[#f5d800] text-[#161616] font-bold text-sm uppercase tracking-wider py-3 px-4 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Salvando..." : "Atualizar Pedido"}
                </button>
              </section>
            </div>
          </div>
        </form>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div
            className={`px-5 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
            {toast.message}
            <button onClick={() => setToast(null)} className="ml-2 text-white/80 hover:text-white cursor-pointer bg-transparent border-0">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

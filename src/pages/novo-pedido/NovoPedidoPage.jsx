import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "@/widgets/topnav-grafica/TopNavBar";
import InputForm from "@/shared/ui/molecules/FormField/FormField";
import { http } from "@/shared/api/http";
import { getUsuario } from "@/shared/api/authToken";
import { fetchPedidos } from "@/entities/pedido/api/pedidosApi";

export default function NovoPedidoPage() {
  const navigate = useNavigate();
  const usuarioLogado = getUsuario() || { id: null, nome: "Usuário" };
  const fileInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nomeCliente: "",
    numPedido: "",
    idCliente: "",
    descricaoProjeto: "",
    status: "Em Avaliação",
    responsavel: "",
    dataInicio: "",
    dataEntrega: "",
  });

  // Autocomplete de clientes
  const [clienteSugestoes, setClienteSugestoes] = useState([]);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [buscandoClientes, setBuscandoClientes] = useState(false);
  const [clientesCache, setClientesCache] = useState([]);
  const debounceTimer = useRef(null);

  const [itens, setItens] = useState([
    { produto: "", corEstampa: "", corMaterial: "", composicao: "", tamanho: "", quantidade: "" },
  ]);

  const [mockupFile, setMockupFile] = useState(null);
  const [mockupPreview, setMockupPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Carrega lista de clientes (extraída dos pedidos) uma vez
  useEffect(() => {
    fetchPedidos()
      .then((pedidos) => {
        const map = new Map();
        pedidos.forEach((p) => {
          if (p.cliente && p.cliente.id_usuario) {
            map.set(p.cliente.id_usuario, {
              id: p.cliente.id_usuario,
              nome: p.cliente.nome,
              nomeEmpresa: p.cliente.nome_empresa || "",
            });
          }
        });
        setClientesCache(Array.from(map.values()));
      })
      .catch((err) => console.error("Erro ao carregar clientes:", err));
  }, []);

  // Filtra clientes localmente pelo termo digitado
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

  // Handlers
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
      { produto: "", corEstampa: "", corMaterial: "", composicao: "", tamanho: "", quantidade: "" },
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
    setIsSubmitting(true);

    try {
      const payload = {
        nomeCliente: formData.nomeCliente,
        numPedido: formData.numPedido,
        idCliente: formData.idCliente,
        descricaoProjeto: formData.descricaoProjeto,
        status: formData.status,
        responsavel: formData.responsavel,
        dataInicio: formData.dataInicio,
        dataEntrega: formData.dataEntrega,
        itens: itens.filter((item) => item.produto),
      };

      await http.post("/pedidos", payload);
      navigate("/pedidos");
    } catch (err) {
      console.error("Erro ao salvar pedido:", err);
      alert("Erro ao salvar pedido. Tente novamente.");
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

  const responsavelOptions = [
    "Ricardo Silveira",
    "Ana Paula",
    "Carlos Eduardo",
    "Mariana Santos",
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <TopNavBar currentPage="pedidos" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => navigate("/pedidos")}
          className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-2 cursor-pointer bg-transparent border-0"
        >
          <span className="text-sm">+</span> Voltar para Gerenciamento de Pedidos
        </button>
        <h1 className="font-[family-name:var(--fonte-space)] font-bold text-2xl md:text-3xl uppercase tracking-tight text-[#161616] mb-1">
          Novo Pedido
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Registro de nova ordem de serviço para oficina digital.
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
                  {/* Campo Nome com Autocomplete */}
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
                    {/* Dropdown de sugestões */}
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
                    {showSugestoes && clienteSugestoes.length === 0 && formData.nomeCliente.length >= 2 && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg px-4 py-3 text-sm text-gray-500">
                        Nenhum cliente encontrado.
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputForm
                      label="Nº do Pedido"
                      name="numPedido"
                      placeholder="Ex: CLI-2024-001"
                      value={formData.numPedido}
                      onChange={handleChange}
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
                <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1.5fr_0.8fr_0.6fr_0.4fr] gap-2 text-[10px] text-gray-500 uppercase font-semibold tracking-wider mb-2 px-1">
                  <span>Produto</span>
                  <span>Cor Estampa</span>
                  <span>Cor Material</span>
                  <span>Composição</span>
                  <span>Tamanho</span>
                  <span>QTD</span>
                  <span>Ações</span>
                </div>

                {/* Linhas de itens */}
                <div className="space-y-2">
                  {itens.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1.5fr_0.8fr_0.6fr_0.4fr] gap-2 items-center border-b border-gray-100 pb-2"
                    >
                      <input
                        type="text"
                        placeholder="Nome do produto"
                        value={item.produto}
                        onChange={(e) => handleItemChange(index, "produto", e.target.value)}
                        className="bg-[#EFEFEF] text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#FFE300] w-full"
                      />
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
                        className="bg-[#EFEFEF] text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#FFE300] w-full"
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

                {/* Upload de Mockup */}
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
                    Upload de Mockup
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Arraste arquivos ou clique para selecionar (PNG, JPG, PDF)
                  </p>
                </div>

                {/* Preview da imagem */}
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
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
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
                      {responsavelOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
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

                  {/* Resumo Financeiro */}
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                      Resumo Financeiro
                    </label>
                    <div className="bg-[#EFEFEF] text-gray-500 text-sm py-2 px-4 italic">
                      Calculado automaticamente
                    </div>
                  </div>
                </div>

                {/* Botão Salvar */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-[#FFE300] hover:bg-[#f5d800] text-[#161616] font-bold text-sm uppercase tracking-wider py-3 px-4 cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Salvando..." : "Salvar Pedido"}
                </button>
              </section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

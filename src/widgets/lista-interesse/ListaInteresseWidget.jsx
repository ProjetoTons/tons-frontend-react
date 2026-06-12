import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductModal from "@/features/modal-produto/modal-produto.jsx";
import WhatsAppConfirmModal from "@/features/whatsapp-confirm/WhatsAppConfirmModal.jsx";
import EnderecoValidacaoModal from "@/features/endereco-validacao/EnderecoValidacaoModal.jsx";
import EnderecoAvisoModal from "@/features/endereco-validacao/EnderecoAvisoModal.jsx";
import { enviarListaWhatsApp } from "@/shared/lib/whatsapp";
import { getToken, getUsuario } from "@/shared/api/authToken";
import { buscarEnderecoUsuario } from "@/entities/usuario/api/usuarioApi";
import {
  listarProdutosInteresse,
  removerProdutoInteresse,
  limparCarrinho
} from "@/entities/produto/api/produtoInteresseApi";

export default function ListaInteresseWidget() {
  const navigate = useNavigate();
  const [itemsSalvos, setItemsSalvos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [isEnderecoModalOpen, setIsEnderecoModalOpen] = useState(false);
  const [isAvisoModalOpen, setIsAvisoModalOpen] = useState(false);
  const [enderecoUsuario, setEnderecoUsuario] = useState(null);
  const isLogado = Boolean(getToken());

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      if (!getToken()) {
        setItemsSalvos([]);
        setIsLoading(false);
        navigate("/portfolio", { replace: true });
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const itens = await listarProdutosInteresse();
        if (!cancelado) setItemsSalvos(itens);
      } catch (err) {
        console.error("Erro ao carregar lista de interesse:", err);
        if (!cancelado) setError("Não foi possível carregar a lista de interesse.");
      } finally {
        if (!cancelado) setIsLoading(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, []);

  const handleOpenModal = (item) => {
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleRemoveItem = async (item) => {
    const anteriores = itemsSalvos;
    setItemsSalvos((prev) => prev.filter((i) => i.id !== item.id));
    setRemovingId(item.id);
    try {
      await removerProdutoInteresse(item.id);
    } catch (err) {
      console.error("Erro ao remover item da lista de interesse:", err);
      setItemsSalvos(anteriores);
      setError("Não foi possível remover o item. Tente novamente.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleEnviarWhatsApp = async () => {
    if (itemsSalvos.length === 0) return;

    // Buscar endereço do usuário antes de prosseguir
    const usuario = getUsuario();
    if (usuario?.id) {
      try {
        const endereco = await buscarEnderecoUsuario(usuario.id);
        setEnderecoUsuario(endereco);
      } catch {
        setEnderecoUsuario(null);
      }
    } else {
      setEnderecoUsuario(null);
    }
    setIsEnderecoModalOpen(true);
  };

  const handleEnderecoConfirmado = () => {
    setIsEnderecoModalOpen(false);
    setIsConfirmOpen(true);
  };

  const handleEnviarSemEndereco = () => {
    setIsEnderecoModalOpen(false);
    setIsAvisoModalOpen(true);
  };

  const handleAvisoEnviarMesmoAssim = () => {
    setIsAvisoModalOpen(false);
    setIsConfirmOpen(true);
  };

  const handleIrConfiguracoes = () => {
    setIsEnderecoModalOpen(false);
    setIsAvisoModalOpen(false);
    navigate("/configuracoes");
  };

  const handleConfirmEnvio = () => {
    enviarListaWhatsApp(itemsSalvos, enderecoUsuario);
    setIsConfirmOpen(false);
  };

  const handleLimparLista = async () => {
    if (!window.confirm("Tem certeza que deseja remover todos os itens do carrinho?")) return;

    const itensBackup = [...itemsSalvos];

    setItemsSalvos([]); // Atualização Otimista
    setError(null);

    try {
      // Usa APENAS o endpoint de limpeza total
      await limparCarrinho();
    } catch (err) {
      console.error("Erro ao limpar a lista de interesse:", err);
      // Reverte a ação se a API falhar
      setItemsSalvos(itensBackup);
      setError("Não foi possível limpar o carrinho. Tente novamente.");
    }
  };

  return (
    <div className="w-full flex gap-10 flex-wrap lg:flex-nowrap">
      {/* Coluna Esquerda: Lista de Produtos */}
      <section className="flex-1 min-w-0">
        <h1 className="text-[48px] leading-none font-black uppercase tracking-tight text-black" style={{ fontFamily: "var(--fonte-space)" }}>
          Lista de Interesses
        </h1>
        <p className="text-sm text-gray-600 mt-3 mb-8">
          Revise seus produtos selecionados antes de prosseguir com o orçamento.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-500 text-sm">Carregando itens...</p>
        ) : !isLogado ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm mb-4">
              Faça login para visualizar sua lista de interesses.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Entrar
            </button>
          </div>
        ) : itemsSalvos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm mb-4">
              Nenhum item adicionado à lista de interesses.
            </p>
            <button
              onClick={() => navigate("/portfolio")}
              className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Explorar Portfólio
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {itemsSalvos.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-5 p-5 border border-gray-200 rounded-sm bg-white hover:shadow-sm transition-shadow"
              >
                <div
                  className="w-[80px] h-[80px] bg-gray-100 flex-shrink-0 rounded-sm overflow-hidden cursor-pointer group"
                  onClick={() => handleOpenModal(item)}
                >
                  <img
                    src={item.image || "/product/placeholder.svg"}
                    alt={item.title}
                    onError={(e) => { e.target.src = "/product/placeholder.svg"; }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                    {item.category || item.type || "Produto"}
                  </span>
                  <h3 className="text-[14px] font-bold text-black uppercase mt-1">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    {item.description || ""}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveItem(item)}
                  disabled={removingId === item.id}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remover item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Coluna Direita: Resumo da Solicitação */}
      <aside className="w-full lg:w-[320px] flex-shrink-0">
        <div className="bg-[#F2F2F2] p-6 sticky top-4">
          <h2 className="text-[14px] font-black uppercase tracking-wide text-black mb-4" style={{ fontFamily: "var(--fonte-space)" }}>
            Resumo da Solicitação
          </h2>

          <div className="flex justify-between items-center py-3 border-b border-gray-300">
            <span className="text-[12px] text-gray-600 uppercase tracking-wider font-medium">
              Itens Selecionados
            </span>
            <span className="text-[14px] font-bold text-black">
              {itemsSalvos.length === 0 ? "Nenhum" : `${String(itemsSalvos.length).padStart(2, "0")} Unidades`}
            </span>
          </div>

          <button
            onClick={handleEnviarWhatsApp}
            disabled={itemsSalvos.length === 0 || isLoading}
            className="w-full mt-6 flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#1da851] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-[12px] tracking-[1px] uppercase transition-colors rounded-sm"
          >
            <img
              src="/icons/whatsapp.png"
              alt=""
              className="w-5 h-5"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            ENVIAR PARA WHATSAPP
          </button>

          <p className="text-[10px] text-gray-500 mt-3 leading-relaxed">
            Ao clicar, você será redirecionado para o WhatsApp para formalizar seu orçamento com nossos consultores técnicos.
          </p>
        </div>

        {/*Limpar Carrinho */}
        {itemsSalvos.length > 0 && (
          <button
            onClick={handleLimparLista}
            className="w-full mt-2 py-3 flex items-center justify-center gap-2 bg-transparent hover:bg-red-50 text-red-500 hover:text-red-600 font-bold text-[11px] tracking-[1px] uppercase transition-colors rounded-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Limpar Carrinho
          </button>
        )}
      </aside>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        produto={selectedProduct}
      />

      <WhatsAppConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmEnvio}
        contexto="LISTA DE INTERESSE"
        totalItens={itemsSalvos.length}
      />

      <EnderecoValidacaoModal
        isOpen={isEnderecoModalOpen}
        onClose={() => setIsEnderecoModalOpen(false)}
        onConfirm={handleEnderecoConfirmado}
        onIrConfiguracoes={handleIrConfiguracoes}
        onEnviarSemEndereco={handleEnviarSemEndereco}
        endereco={enderecoUsuario}
      />

      <EnderecoAvisoModal
        isOpen={isAvisoModalOpen}
        onClose={() => setIsAvisoModalOpen(false)}
        onEnviarMesmoAssim={handleAvisoEnviarMesmoAssim}
        onIrConfiguracoes={handleIrConfiguracoes}
      />
    </div>
  );
}

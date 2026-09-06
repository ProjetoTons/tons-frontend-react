import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ProductModal from "@/features/modal-produto/modal-produto.jsx";
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

    // Buscar endereço do usuário antes de abrir o modal
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
    setIsConfirmOpen(true);
  };

  const handleConfirmEnvio = () => {
    enviarListaWhatsApp(itemsSalvos, enderecoUsuario);
    setIsConfirmOpen(false);
  };

  const handleLimparLista = async () => {
    const result = await Swal.fire({
      title: "Limpar carrinho?",
      text: "Todos os itens serão removidos da sua Lista de Interesses. Essa ação não pode ser desfeita.",
      icon: "warning",
      iconColor: "#F7D708",
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonText: "Sim, limpar tudo",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        actions: '!flex !flex-row !flex-nowrap justify-center items-stretch gap-3 w-full max-w-[400px] mx-auto mt-4',
        confirmButton: '!w-1/2 min-h-[44px] !m-0 flex items-center justify-center bg-[#1A1A1A] hover:bg-red-600 text-white font-bold uppercase text-[10px] tracking-widest px-2 py-2 transition-all duration-300 cursor-pointer',
        cancelButton: '!w-1/2 min-h-[44px] !m-0 flex items-center justify-center bg-[#EAEAEA] hover:bg-[#D4D4D4] text-gray-800 font-bold uppercase text-[10px] tracking-widest px-2 py-2 transition-all duration-300 cursor-pointer'
      }
    });

    if (!result.isConfirmed) return;

    const itensBackup = [...itemsSalvos];

    setItemsSalvos([]); // Atualização Otimista
    setError(null);

    try {
      await limparCarrinho();
    } catch (err) {
      console.error("Erro ao limpar a lista de interesse:", err);
      setItemsSalvos(itensBackup);
      setError("Não foi possível limpar o carrinho. Tente novamente.");
    }
  };

  const handleIrConfiguracoes = () => {
    setIsConfirmOpen(false);
    navigate("/configuracoes");
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10">
      {/* Coluna Esquerda: Lista de Produtos */}
      <section className="flex-1 w-full min-w-0">
        <h1 className="text-[32px] sm:text-[40px] md:text-[48px] leading-none font-black uppercase tracking-tight text-black" style={{ fontFamily: "var(--fonte-space)" }}>
          Lista de Interesses
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 mb-6 sm:mb-8">
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
                className="flex items-center gap-5 p-5 border border-gray-200 rounded-sm bg-white hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => handleOpenModal(item)}
              >
                <div
                  className="w-[80px] h-[80px] bg-gray-100 flex-shrink-0 rounded-sm overflow-hidden group"
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
                  onClick={(e) => { e.stopPropagation(); handleRemoveItem(item); }}
                  disabled={removingId === item.id}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
      <aside className="w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-4">
        <div className="bg-[#F2F2F2] p-4 sm:p-6">
          <h2 className="text-[12px] sm:text-[14px] font-black uppercase tracking-wide text-black mb-4" style={{ fontFamily: "var(--fonte-space)" }}>
            Resumo da Solicitação
          </h2>

          <div className="flex justify-between items-center py-3 border-b border-gray-300">
            <span className="text-[11px] sm:text-[12px] text-gray-600 uppercase tracking-wider font-medium">
              Itens Selecionados
            </span>
            <span className="text-[13px] sm:text-[14px] font-bold text-black">
              {itemsSalvos.length === 0 ? "Nenhum" : `${String(itemsSalvos.length).padStart(2, "0")} Unidades`}
            </span>
          </div>

          <button
            onClick={handleEnviarWhatsApp}
            disabled={itemsSalvos.length === 0 || isLoading}
            className="w-full mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 bg-[#25D366] hover:bg-[#1da851] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-[10px] sm:text-[12px] tracking-[1px] uppercase transition-colors rounded-sm"
          >
            <img
              src="/icons/whatsapp.png"
              alt=""
              className="w-4 sm:w-5 h-4 sm:h-5"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            ENVIAR PARA WHATSAPP
          </button>

          <p className="text-[9px] sm:text-[10px] text-gray-500 mt-2 sm:mt-3 leading-relaxed">
            Ao clicar, você será redirecionado para o WhatsApp para formalizar seu orçamento com nossos consultores técnicos.
          </p>

          {/* Limpar Carrinho */}
          {itemsSalvos.length > 0 && (
            <button
              onClick={handleLimparLista}
              className="w-full mt-4 sm:mt-6 py-2 sm:py-3 flex items-center justify-center gap-2 border-2 border-red-500 bg-transparent hover:bg-red-500 text-red-500 hover:text-white font-black text-[10px] sm:text-[11px] tracking-[1.5px] sm:tracking-[2px] uppercase transition-all duration-300 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Limpar Carrinho
            </button>
          )}
        </div>
      </aside>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        produto={selectedProduct}
        hideInteresseButton={true}
      />

      {/* Modal unificado: Endereço + Confirmação WhatsApp */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsConfirmOpen(false)} />
          <div className="relative bg-[#FAF8F2] w-full max-w-[500px] h-auto max-h-[calc(100vh-1rem)] sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
            <div className="h-1 bg-[#F7D708]" />
            <div className="px-4 py-5 sm:px-10 sm:py-8 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <span className="text-[#F7D708] font-black text-sm leading-none">T</span>
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[2px] text-black leading-tight">
                  Ton's Personalizados / LISTA DE INTERESSE
                </p>
              </div>

              {/* Título */}
              <h2 className="text-[28px] sm:text-[36px] leading-none font-black uppercase tracking-tight text-black" style={{ fontFamily: "var(--fonte-space)" }}>
                Quase lá!
              </h2>
              <div className="w-14 h-[3px] bg-[#F7D708] mt-4 mb-6" />

              {/* Descrição */}
              <p className="text-[13px] text-gray-700 leading-relaxed mb-4">
                Sua seleção de <strong>{itemsSalvos.length} {itemsSalvos.length === 1 ? "item" : "itens"}</strong> será enviada para nossa equipe comercial via WhatsApp para fechamento do orçamento.
              </p>

              {/* Endereço */}
              {enderecoUsuario && enderecoUsuario.logradouro ? (
                <div className="bg-white border border-gray-200 p-4 mb-6">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-2 font-bold">Endereço de entrega</span>
                  <p className="text-[13px] font-bold text-black">
                    {enderecoUsuario.logradouro}{enderecoUsuario.numero ? `, ${enderecoUsuario.numero}` : ""}
                    {enderecoUsuario.complemento ? ` — ${enderecoUsuario.complemento}` : ""}
                  </p>
                  <p className="text-[12px] text-gray-600">
                    {enderecoUsuario.bairro}{enderecoUsuario.cidade ? ` — ${enderecoUsuario.cidade}` : ""}
                    {enderecoUsuario.estado ? `/${enderecoUsuario.estado}` : ""}
                  </p>
                  {enderecoUsuario.cep && <p className="text-[11px] text-gray-400 mt-1">CEP: {enderecoUsuario.cep}</p>}
                  <button onClick={handleIrConfiguracoes} className="text-[10px] text-gray-500 underline mt-2 hover:text-black transition-colors cursor-pointer bg-transparent border-0 p-0">
                    Alterar endereço
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6">
                  <p className="text-[12px] text-yellow-800 font-medium">
                    Nenhum endereço cadastrado. O envio seguirá sem endereço.
                  </p>
                  <button onClick={handleIrConfiguracoes} className="text-[10px] text-yellow-700 underline mt-1 hover:text-black transition-colors cursor-pointer bg-transparent border-0 p-0">
                    Adicionar endereço
                  </button>
                </div>
              )}

              {/* Botões */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirmEnvio}
                  className="w-full py-4 px-5 bg-[#25D366] hover:bg-[#1da851] text-white font-black text-[12px] tracking-[2px] uppercase transition-all flex items-center justify-center gap-3"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  Sim, enviar agora
                </button>
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="w-full py-3 px-5 bg-transparent border border-gray-300 text-gray-600 font-bold text-[11px] tracking-[1px] uppercase hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import StatusBadge from "./StatusBadge";
import OrderDetailModal from "./OrderDetailModal";
import {
  getNextStatus,
  getPreviousStatus,
  getPreviousEtapa,
  getNextEtapa,
  getInitialStatus,
  getLastStatus,
} from "@/entities/pedido/api/statusFlowConfig";
import { getEtapaConfig } from "@/entities/pedido/api/etapaConfig";

/**
 * OrderRow - Uma linha da tabela de pedidos
 * 
 * Props:
 * - pedido: object com dados do pedido
 * - onAvancar: function - callback quando clica no botão Avançar
 * - onRetornar: function - callback quando clica no botão Retornar
 * - onStatusChange: function - callback quando status é alterado
 * - usuarioLogado: object - Dados do usuário logado
 */

function OrderRow({ pedido, onAvancar, onRetornar, onStatusChange, usuarioLogado = { id: 1, nome: "Usuário" } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Usa diretamente os dados do prop (estado controlado pelo pai)
  const pedidoLocal = pedido;

  // Próximo status na mesma etapa (sub-etapa)
  const proximoStatus = getNextStatus(pedidoLocal.etapa_pedido, pedidoLocal.status);
  const proximaEtapa = getNextEtapa(pedidoLocal.etapa_pedido);

  // Status anterior na mesma etapa
  const statusAnterior = getPreviousStatus(pedidoLocal.etapa_pedido, pedidoLocal.status);
  const etapaAnterior = getPreviousEtapa(pedidoLocal.etapa_pedido);

  // Pode avançar se houver próxima sub-etapa OU próxima etapa
  const podeAvancar = proximoStatus !== null || proximaEtapa !== null;

  // Pode retornar se houver status anterior OU etapa anterior
  const podeRetornar = statusAnterior !== null || etapaAnterior !== null;

  const handleAvancar = () => {
    let pedidoAtualizado;

    if (proximoStatus) {
      // Avança sub-etapa dentro da mesma etapa -> usuário logado vira responsável
      pedidoAtualizado = {
        ...pedidoLocal,
        status: proximoStatus,
        responsavel_fase_atual: usuarioLogado,
      };
    } else if (proximaEtapa) {
      // Cruza para nova etapa -> responsável = null, status = inicial da nova etapa
      pedidoAtualizado = {
        ...pedidoLocal,
        etapa_pedido: proximaEtapa,
        status: getInitialStatus(proximaEtapa),
        responsavel_fase_atual: null,
      };
    } else {
      return;
    }

    onAvancar && onAvancar(pedidoLocal.id_pedido, pedidoAtualizado);
  };

  const handleRetornar = () => {
    let pedidoAtualizado;

    if (statusAnterior) {
      // Retorna sub-etapa dentro da mesma etapa -> usuário logado vira responsável
      pedidoAtualizado = {
        ...pedidoLocal,
        status: statusAnterior,
        responsavel_fase_atual: usuarioLogado,
      };
    } else if (etapaAnterior) {
      // Volta para etapa anterior -> responsável = null, status = último da etapa anterior
      pedidoAtualizado = {
        ...pedidoLocal,
        etapa_pedido: etapaAnterior,
        status: getLastStatus(etapaAnterior),
        responsavel_fase_atual: null,
      };
    } else {
      return;
    }

    onRetornar && onRetornar(pedidoLocal.id_pedido, pedidoAtualizado);
  };

  const handleStatusChange = (novoStatus, usuario) => {
    const pedidoAtualizado = {
      ...pedidoLocal,
      status: novoStatus,
      responsavel_fase_atual: usuario,
    };
    onStatusChange && onStatusChange(pedidoLocal.id_pedido, pedidoAtualizado);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditPedido = (pedido) => {
    console.log("Editar pedido:", pedido);
    // TODO: Navegue para página de edição ou abra um modal de edição
  };

  // Determina qual responsável mostrar
  const responsavelExibicao = pedidoLocal.responsavel_fase_atual?.nome || "-";

  return (
    <>
      <tr
        onClick={handleOpenModal}
        className="border-b border-[#e4e2e2] bg-white hover:bg-[#f9f9f9] transition-colors cursor-pointer"
      >
        {/* Indicador de Etapa */}
        <td>
          <div
            style={{ backgroundColor: getEtapaConfig(pedidoLocal.etapa_pedido).cor }}
            className="w-3.5 h-16 p-0.5 flex items-center justify-center relative"
            title={getEtapaConfig(pedidoLocal.etapa_pedido).displayName}
          >
            <img src={getEtapaConfig(pedidoLocal.etapa_pedido).icone} alt="" />
          </div>
        </td>

        {/* Imagem */}
        <td className="py-2 px-2 text-center">
          <img
            src={`https://i.pravatar.cc/150?u=${pedidoLocal.id_pedido}`}
            className="w-12 h-12 object-cover border border-gray-200 shadow-sm rounded mx-auto"
          />
        </td>

        {/* N° Pedido */}
        <td className="py-2 px-2 text-center">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[14px] text-[#161616]">
            {pedidoLocal.num_pedido}
          </span>
        </td>

        {/* Status */}
        <td
          className="py-2 px-2 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <StatusBadge
            status={pedidoLocal.status}
            etapa_pedido={pedidoLocal.etapa_pedido}
            onStatusChange={handleStatusChange}
            usuarioLogado={usuarioLogado}
          />
        </td>

        {/* Vendedor */}
        <td className="py-2 px-2 text-center">
          <span className="font-['Inter:Medium',sans-serif] font-medium text-[13px] text-[#323233]">
            {pedidoLocal.vendedor.nome}
          </span>
        </td>

        {/* Responsável da Fase Atual */}
        <td className="py-2 px-2 text-center">
          <span className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#323233]">
            {responsavelExibicao}
          </span>
        </td>

        {/* Cliente */}
        <td className="py-2 px-2 text-center">
          <span className="font-['Inter:Medium',sans-serif] font-medium text-[13px] text-[#323233]">
            {pedidoLocal.cliente.nome}
          </span>
        </td>

        {/* Data Início */}
        <td className="py-2 px-2 text-center">
          <span className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#5f5f5f]">
            {pedidoLocal.data_pedido}
          </span>
        </td>

        {/* Data Fim */}
        <td className="py-2 px-2 text-center">
          <span className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#5f5f5f]">
            {pedidoLocal.data_finalizacao}
          </span>
        </td>

        {/* Valor */}
        <td className="py-2 px-2 text-center">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[13px] text-[#161616]">
            {pedidoLocal.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </td>

        {/* Ações */}
        <td className="py-2 px-2 text-center">
          <div className="flex flex-col gap-1 items-center">
            {/* Botão Retornar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRetornar();
              }}
              disabled={!podeRetornar}
              className={`flex items-center justify-center px-2 py-1.5 rounded transition-colors ${podeRetornar
                ? 'bg-[#161616] hover:bg-[#474747] text-white cursor-pointer'
                : 'bg-[#e4e3e2] text-[#b0b0b0] cursor-not-allowed opacity-50'
                }`}
              title={podeRetornar ? "Retornar para etapa anterior" : "Não é possível retornar"}
            >
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[9px] tracking-[0.5px] uppercase">
                &lt; Retornar
              </span>
            </button>

            {/* Botão Avançar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAvancar();
              }}
              disabled={!podeAvancar}
              className={`flex items-center justify-center px-2 py-1.5 rounded transition-colors ${podeAvancar
                ? 'bg-[#fdf210] hover:bg-[#e6d800] cursor-pointer'
                : 'bg-[#fdf210] text-[#808080] cursor-not-allowed opacity-50'
                }`}
              title={podeAvancar ? "Avançar para próxima etapa" : "Conclua o status atual para avançar"}
            >
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[9px] text-[#161616] tracking-[0.5px] uppercase">
                Avançar &gt;
              </span>
            </button>
          </div>
        </td>
      </tr>

      {/* Modal de Detalhes */}
      <OrderDetailModal
        isOpen={isModalOpen}
        pedido={pedidoLocal}
        onClose={handleCloseModal}
        onEdit={handleEditPedido}
        onStatusChange={handleStatusChange}
        usuarioLogado={usuarioLogado}
      />
    </>
  );
}

export default OrderRow;

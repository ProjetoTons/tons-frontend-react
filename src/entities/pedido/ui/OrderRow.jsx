import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
import { formatarDataBR } from "@/shared/lib/dateFormatter";

/**
 * OrderRow - Uma linha da tabela de pedidos
 */
function OrderRow({ pedido, onAvancar, onRetornar, onStatusChange, onCancelar, usuarioLogado = { id: null, nome: "Usuário", role: "" } }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pedidoLocal = pedido;

  // --- LÓGICA DE NAVEGAÇÃO DE STATUS ---
  const proximoStatus = getNextStatus(pedidoLocal.etapa_pedido, pedidoLocal.status);
  const proximaEtapa = getNextEtapa(pedidoLocal.etapa_pedido);
  
  const statusAnterior = getPreviousStatus(pedidoLocal.etapa_pedido, pedidoLocal.status);
  const etapaAnterior = getPreviousEtapa(pedidoLocal.etapa_pedido);

  // --- TRAVA DE SEGURANÇA ---
  const isAdmin = usuarioLogado?.role === 'Adm';
  const responsavelAtualId = pedidoLocal.responsavel_fase_atual?.id;
  const hasResponsavel = Boolean(responsavelAtualId);
  const isOutroResponsavel = hasResponsavel && responsavelAtualId !== usuarioLogado.id;
  
  // Bloqueia se NÃO for admin, TIVER um responsável, e NÃO FOR o usuário logado
  const bloqueadoPorOutroResponsavel = !isAdmin && isOutroResponsavel;

  // --- APLICAÇÃO DA TRAVA NAS AÇÕES ---
  const podeAvancar = (proximoStatus !== null || proximaEtapa !== null) && !bloqueadoPorOutroResponsavel;
  const podeRetornar = (statusAnterior !== null || etapaAnterior !== null) && !bloqueadoPorOutroResponsavel;

  const handleAvancar = () => {
    let pedidoAtualizado;

    if (proximoStatus) {
      pedidoAtualizado = {
        ...pedidoLocal,
        status: proximoStatus,
        responsavel_fase_atual: usuarioLogado,
      };
      onAvancar && onAvancar(pedidoLocal.id_pedido, pedidoAtualizado);
    } else if (proximaEtapa) {
      Swal.fire({
        title: "Confirmar mudança de etapa",
        text: `Deseja avançar o pedido para a etapa "${proximaEtapa}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, avançar!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          let statusInicial;
          if (proximaEtapa === "Logística") {
            statusInicial = pedidoLocal.tipo_envio === "Retirada"
              ? "aguardando-retirada"
              : "enviado";
          } else {
            statusInicial = getInitialStatus(proximaEtapa);
          }

          pedidoAtualizado = {
            ...pedidoLocal,
            etapa_pedido: proximaEtapa,
            status: statusInicial,
            responsavel_fase_atual: null,
          };
          onAvancar && onAvancar(pedidoLocal.id_pedido, pedidoAtualizado);
        }
      });
    }
  };

  const handleRetornar = () => {
    let pedidoAtualizado;

    if (statusAnterior) {
      pedidoAtualizado = {
        ...pedidoLocal,
        status: statusAnterior,
        responsavel_fase_atual: usuarioLogado,
      };
      onRetornar && onRetornar(pedidoLocal.id_pedido, pedidoAtualizado);
    } else if (etapaAnterior) {
      Swal.fire({
        title: "Confirmar retorno de etapa",
        text: `Deseja retornar o pedido para a etapa "${etapaAnterior}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, retornar!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          pedidoAtualizado = {
            ...pedidoLocal,
            etapa_pedido: etapaAnterior,
            status: getLastStatus(etapaAnterior),
            responsavel_fase_atual: null, // Ao voltar de etapa grande, solta o responsável
          };
          onRetornar && onRetornar(pedidoLocal.id_pedido, pedidoAtualizado);
        }
      });
    }
  };

  const handleStatusChange = (novoStatus, usuario) => {
    const pedidoAtualizado = {
      ...pedidoLocal,
      status: novoStatus,
      responsavel_fase_atual: usuario,
    };
    onStatusChange && onStatusChange(pedidoLocal.id_pedido, pedidoAtualizado);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleEditPedido = (pedido) => {
    navigate(`/pedidos/${pedido.id_pedido}/editar`);
  };

  const responsavelExibicao = pedidoLocal.responsavel_fase_atual?.nome || "-";

  // Textos explicativos dinâmicos para melhorar a UX caso esteja bloqueado
  const tooltipAvancar = bloqueadoPorOutroResponsavel 
    ? "Tarefa em andamento por outro colaborador" 
    : (podeAvancar ? "Avançar para próxima etapa" : "Conclua o status atual para avançar");

  const tooltipRetornar = bloqueadoPorOutroResponsavel 
    ? "Tarefa em andamento por outro colaborador" 
    : (podeRetornar ? "Retornar para etapa anterior" : "Não é possível retornar");

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

        <td className="py-2 px-2 text-center">
          {pedidoLocal.url_foto_arte ? (
            <img
              src={pedidoLocal.url_foto_arte}
              alt="Arte do pedido"
              className="w-12 h-12 object-cover border border-gray-200 shadow-sm rounded mx-auto"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 border border-gray-200 rounded mx-auto flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </td>

        <td className="py-2 px-2 text-center">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[14px] text-[#161616]">
            {pedidoLocal.num_pedido}
          </span>
        </td>

        <td className="py-2 px-2 text-center" onClick={(e) => e.stopPropagation()}>
          <StatusBadge
            status={pedidoLocal.status}
            etapa_pedido={pedidoLocal.etapa_pedido}
            onStatusChange={handleStatusChange}
            usuarioLogado={usuarioLogado}
          />
        </td>

        <td className="py-2 px-2 text-center">
          <span className="font-['Inter:Medium',sans-serif] font-medium text-[13px] text-[#323233]">
            {pedidoLocal.vendedor.nome}
          </span>
        </td>

        <td className="py-2 px-2 text-center">
          <span className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#323233]">
            {responsavelExibicao}
          </span>
        </td>

        <td className="py-2 px-2 text-center">
          <span className="font-['Inter:Medium',sans-serif] font-medium text-[13px] text-[#323233]">
            {pedidoLocal.cliente.nome}
          </span>
        </td>

        <td className="py-2 px-2 text-center">
          <span className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#5f5f5f]">
            {formatarDataBR(pedidoLocal.data_pedido)}
          </span>
        </td>

        <td className="py-2 px-2 text-center">
          <span className="font-['Inter:Regular',sans-serif] font-normal text-[13px] text-[#5f5f5f]">
            {formatarDataBR(pedidoLocal.data_finalizacao)}
          </span>
        </td>

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
              className={`flex items-center justify-center w-2/3 px-2 py-1.5 rounded transition-colors ${
                podeRetornar
                  ? 'bg-[#161616] hover:bg-[#474747] text-white cursor-pointer'
                  : 'bg-[#e4e3e2] text-[#b0b0b0] cursor-not-allowed opacity-50'
              }`}
              title={tooltipRetornar}
            >
              <div className="flex items-center">
                <img className="w-4 h-4" src="/pedidos-icons/return-icon.svg" alt="Retornar" />
                <span className="font-['Inter:Bold',sans-serif] font-bold text-[9px] tracking-[0.5px] uppercase">
                  Retornar
                </span>
              </div>
            </button>

            {/* Botão Avançar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAvancar();
              }}
              disabled={!podeAvancar}
              className={`flex items-center justify-center w-2/3 px-2 py-1.5 rounded transition-colors ${
                podeAvancar
                  ? 'bg-[#fdf210] hover:bg-[#e6d800] cursor-pointer'
                  : 'bg-[#fdf210] text-[#808080] cursor-not-allowed opacity-50'
              }`}
              title={tooltipAvancar}
            >
              <div className="flex items-center">
                <img className="w-4 h-4 brightness-5" src="/pedidos-icons/advance-icon.svg" alt="Avançar" />
                <span className="font-['Inter:Bold',sans-serif] font-bold text-[9px] text-[#161616] tracking-[0.5px] uppercase">
                  Avançar
                </span>
              </div>
            </button>
          </div>
        </td>
      </tr>

      <OrderDetailModal
        isOpen={isModalOpen}
        pedido={pedidoLocal}
        onClose={handleCloseModal}
        onEdit={handleEditPedido}
        onStatusChange={handleStatusChange}
        onCancelar={onCancelar}
        usuarioLogado={usuarioLogado}
      />
    </>
  );
}

export default OrderRow;
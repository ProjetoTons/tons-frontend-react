import { useState } from "react";
import StatusBadge from "./StatusBadge";
import {
  canAdvanceToNextEtapa,
  getPreviousEtapa,
  getNextEtapa,
  getInitialStatus
} from "@/entities/pedido/api/statusFlowConfig";

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
  const [pedidoLocal, setPedidoLocal] = useState(pedido);

  // Verifica se pode avançar para a próxima etapa
  const podeAvancar = canAdvanceToNextEtapa(pedidoLocal.etapa_pedido, pedidoLocal.status);
  const proximaEtapa = getNextEtapa(pedidoLocal.etapa_pedido);
  
  // Verifica se pode retornar para a etapa anterior
  const podeRetornar = getPreviousEtapa(pedidoLocal.etapa_pedido) !== null;

  const handleAvancar = () => {
    if (podeAvancar && proximaEtapa) {
      const novoStatus = getInitialStatus(proximaEtapa);
      const pedidoAtualizado = {
        ...pedidoLocal,
        etapa_pedido: proximaEtapa,
        status: novoStatus,
        responsavel_fase_atual: null, // Responsável ficará vazio até alguém mudar o status
      };
      setPedidoLocal(pedidoAtualizado);
      onAvancar && onAvancar(pedidoLocal.id_pedido, pedidoAtualizado);
    }
  };

  const handleRetornar = () => {
    if (podeRetornar) {
      const etapaAnterior = getPreviousEtapa(pedidoLocal.etapa_pedido);
      if (etapaAnterior) {
        const pedidoAtualizado = {
          ...pedidoLocal,
          etapa_pedido: etapaAnterior,
          status: 'nao-iniciado',
          responsavel_fase_atual: null,
        };
        setPedidoLocal(pedidoAtualizado);
        onRetornar && onRetornar(pedidoLocal.id_pedido, pedidoAtualizado);
      }
    }
  };

  const handleStatusChange = (novoStatus, usuario) => {
    const pedidoAtualizado = {
      ...pedidoLocal,
      status: novoStatus,
      responsavel_fase_atual: usuario,
    };
    setPedidoLocal(pedidoAtualizado);
    onStatusChange && onStatusChange(pedidoLocal.id_pedido, pedidoAtualizado);
  };

  // Determina qual responsável mostrar
  const responsavelExibicao = pedidoLocal.responsavel_fase_atual?.nome || "-";
  
  return (
    <div className="content-stretch flex items-center justify-between px-[15px] relative w-full border-b border-[#e4e2e2] bg-white hover:bg-[#f9f9f9] transition-colors">
      {/* Botão Retornar */}
      <button
        onClick={handleRetornar}
        disabled={!podeRetornar}
        className={`flex items-center justify-center px-[12px] py-[8px] rounded transition-colors ${
          podeRetornar
            ? 'bg-[#e4e3e2] hover:bg-[#d4d3d2] cursor-pointer'
            : 'bg-[#e4e3e2] text-[#b0b0b0] cursor-not-allowed opacity-50'
        }`}
        title={podeRetornar ? "Retornar para etapa anterior" : "Não é possível retornar"}
      >
        <span className="font-['Inter:Bold',sans-serif] font-bold text-[10px] text-[#5f5f5f] tracking-[1px] uppercase">
          &lt; Retornar
        </span>
      </button>

      {/* N° Pedido */}
      <div className="flex-col items-start px-[14px] py-[25.5px] pb-[26px] text-left min-w-[83px]">
        <span className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-[#161616]">
          {pedidoLocal.num_pedido}
        </span>
      </div>

      {/* Status */}
      <div className="flex-col items-start px-[24px] min-w-[102px]">
        <StatusBadge
          status={pedidoLocal.status}
          etapa_pedido={pedidoLocal.etapa_pedido}
          onStatusChange={handleStatusChange}
          usuarioLogado={usuarioLogado}
        />
      </div>

      {/* Vendedor */}
      <div className="flex items-center gap-[12px] px-[24px] min-w-[172px]">
        <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#323233]">
          {pedidoLocal.vendedor.nome}
        </span>
      </div>

      {/* Cliente */}
      <div className="flex items-center gap-[12px] px-[24px] min-w-[172px]">
        <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#323233]">
          {pedidoLocal.cliente.nome}
        </span>
      </div>

      {/* Responsável da Fase Atual */}
      <div className="flex-col items-start px-[24px] min-w-[149px]">
        <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#323233]">
          {responsavelExibicao}
        </span>
      </div>

      {/* Data Início */}
      <div className="flex-col items-start px-[24px] min-w-[110px]">
        <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#5f5f5f]">
          {pedidoLocal.data_pedido}
        </span>
      </div>

      {/* Data Fim */}
      <div className="flex-col items-start px-[24px] min-w-[110px]">
        <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#5f5f5f]">
          {pedidoLocal.data_finalizacao}
        </span>
      </div>

      {/* Valor */}
      <div className="flex-col items-end px-[24px] min-w-[93px]">
        <span className="font-['Inter:Bold',sans-serif] font-bold text-[14px] text-[#161616]">
          {pedidoLocal.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Botão Avançar */}
      <button
        onClick={handleAvancar}
        disabled={!podeAvancar}
        className={`flex items-center justify-center px-[12px] py-[8px] rounded transition-colors ${
          podeAvancar
            ? 'bg-[#fdf210] hover:bg-[#e6d800] cursor-pointer'
            : 'bg-[#fdf210] text-[#808080] cursor-not-allowed opacity-50'
        }`}
        title={podeAvancar ? "Avançar para próxima etapa" : "Conclua o status atual para avançar"}
      >
        <span className="font-['Inter:Bold',sans-serif] font-bold text-[10px] text-[#161616] tracking-[1px] uppercase">
          Avançar &gt;
        </span>
      </button>
    </div>
  );
}

export default OrderRow;

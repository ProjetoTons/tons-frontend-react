import StatusBadge from "./StatusBadge";

/**
 * OrderRow - Uma linha da tabela de pedidos
 * 
 * Props:
 * - pedido: object com dados do pedido
 * - onAvancar: function - callback quando clica no botão Avançar
 */

function OrderRow({ pedido, onAvancar }) {
  return (
    <div className="content-stretch flex items-center justify-between px-[15px] relative w-full border-b border-[#e4e2e2] bg-white hover:bg-[#f9f9f9] transition-colors">
      {/* Botão Retornar */}
      <div className="flex items-center justify-center px-[12px] py-[8px] bg-[#e4e3e2] rounded hover:bg-[#d4d3d2] transition-colors">
        <span className="font-['Inter:Bold',sans-serif] font-bold text-[10px] text-[#5f5f5f] tracking-[1px] uppercase">
          &lt; Retornar
        </span>
      </div>

      {/* N° Pedido */}
      <div className="flex-col items-start px-[14px] py-[25.5px] pb-[26px] text-left min-w-[83px]">
        <span className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-[#161616]">
          {pedido.num_pedido}
        </span>
      </div>

      {/* Status */}
      <div className="flex-col items-start px-[24px] min-w-[102px]">
        <StatusBadge status={pedido.status} />
      </div>

      {/* Cliente */}
      <div className="flex items-center gap-[12px] px-[24px] min-w-[172px]">
        <div className="flex items-center justify-center bg-[#e4e2e2] rounded w-[32px] h-[32px]">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[12px] text-[#323233] text-center">
            {pedido.cliente.iniciais}
          </span>
        </div>
        <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#323233]">
          {pedido.cliente.nome}
        </span>
      </div>

      {/* Responsável */}
      <div className="flex-col items-start px-[24px] min-w-[149px]">
        <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#323233]">
          {pedido.responsavel.nome}
        </span>
      </div>

      {/* Data Início */}
      <div className="flex-col items-start px-[24px] min-w-[110px]">
        <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#5f5f5f]">
          {pedido.data_pedido}
        </span>
      </div>

      {/* Data Fim */}
      <div className="flex-col items-start px-[24px] min-w-[110px]">
        <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#5f5f5f]">
          {pedido.data_finalizacao}
        </span>
      </div>

      {/* Valor */}
      <div className="flex-col items-end px-[24px] min-w-[93px]">
        <span className="font-['Inter:Bold',sans-serif] font-bold text-[14px] text-[#161616]">
          {pedido.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Botão Avançar */}
      <div
        onClick={() => onAvancar && onAvancar(pedido.id_pedido)}
        className="flex items-center justify-center px-[12px] py-[8px] bg-[#fdf210] rounded hover:bg-[#e6d800] transition-colors cursor-pointer"
      >
        <span className="font-['Inter:Bold',sans-serif] font-bold text-[10px] text-[#161616] tracking-[1px] uppercase">
          Avançar &gt;
        </span>
      </div>
    </div>
  );
}

export default OrderRow;

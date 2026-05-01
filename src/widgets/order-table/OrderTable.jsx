import OrderRow from "@/entities/pedido/ui/OrderRow";

/**
 * OrderTable - Tabela completa de pedidos
 * 
 * Props:
 * - pedidos: array de pedidos
 * - onAvancar: function - callback quando clica no botão Avançar
 * - onRetornar: function - callback quando clica no botão Retornar
 * - onStatusChange: function - callback quando status é alterado
 * - usuarioLogado: object - Dados do usuário logado
 */

function OrderTable({ pedidos, onAvancar, onRetornar, onStatusChange, usuarioLogado }) {
  return (
    <div className="bg-white w-full overflow-hidden rounded">
      {/* Table Header */}
      <div className="flex items-center justify-between bg-[#161616] border-b border-[#e4e2e2] px-[130px]">
        <div className="py-[16px] px-[5px] min-w-[86px]">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
            N° Pedido
          </span>
        </div>
        <div className="py-[16px] px-[24px] min-w-[150px]">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
            Status
          </span>
        </div>
        <div className="py-[16px] px-[24px] min-w-[149px]">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
            Vendedor
          </span>
        </div>
        <div className="py-[16px] px-[24px] min-w-[149px]">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
            Responsável Fase
          </span>
        </div>
        <div className="py-[16px] px-[24px] min-w-[168px]">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
            Cliente
          </span>
        </div>
        <div className="py-[16px] px-[24px] min-w-[134px]">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
            Data Início
          </span>
        </div>
        <div className="py-[16px] px-[24px] min-w-[134px]">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
            Data Fim
          </span>
        </div>
        <div className="py-[16px] px-[24px] min-w-[117px] text-right">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
            Valor R$
          </span>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col">
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <OrderRow
              key={pedido.id_pedido}
              pedido={pedido}
              onAvancar={onAvancar}
              onRetornar={onRetornar}
              onStatusChange={onStatusChange}
              usuarioLogado={usuarioLogado}
            />
          ))
        ) : (
          <div className="py-[40px] text-center text-[#5f5f5f]">
            Nenhum pedido encontrado
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderTable;

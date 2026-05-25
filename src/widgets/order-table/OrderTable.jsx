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
    <div className="bg-white w-full overflow-x-auto rounded">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[70px]" />
          <col className="w-[90px]" />
          <col className="w-[140px]" />
          <col className="w-[110px]" />
          <col className="w-[130px]" />
          <col className="w-[130px]" />
          <col className="w-[100px]" />
          <col className="w-[100px]" />
          <col className="w-[90px]" />
          <col className="w-[110px]" />
        </colgroup>
        {/* Table Header */}
        <thead>
          <tr className="bg-[#161616] border-b border-[#e4e2e2]">
            <th className="py-3 px-2"></th>
            <th className="py-3 px-2 text-center">
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
                N° Pedido
              </span>
            </th>
            <th className="py-3 px-2 text-center">
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
                Status
              </span>
            </th>
            <th className="py-3 px-2 text-center">
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
                Vendedor
              </span>
            </th>
            <th className="py-3 px-2 text-center">
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
                Responsavel Fase
              </span>
            </th>
            <th className="py-3 px-2 text-center">
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
                Cliente
              </span>
            </th>
            <th className="py-3 px-2 text-center">
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
                Data Início
              </span>
            </th>
            <th className="py-3 px-2 text-center">
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
                Data Fim
              </span>
            </th>
            <th className="py-3 px-2 text-center">
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
                Valor R$
              </span>
            </th>
            <th className="py-3 px-2 text-center">
              <span className="font-['Inter:Bold',sans-serif] font-bold text-[11px] text-[#d5d5d5] tracking-[1.1px] uppercase">
                Ações
              </span>
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
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
            <tr>
              <td colSpan="10" className="py-10 text-center text-[#5f5f5f]">
                Nenhum pedido encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;

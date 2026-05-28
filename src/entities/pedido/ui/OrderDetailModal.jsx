import { useState, useEffect } from "react";
import StatusBadge from "./StatusBadge";
import { fetchPedidoById } from "@/entities/pedido/api/pedidosApi";

/**
 * OrderDetailModal - Modal com detalhes completos do pedido
 * 
 * Props:
 * - isOpen: boolean - Se o modal está aberto
 * - pedido: object - Dados do pedido
 * - onClose: function - Callback para fechar o modal
 * - onEdit: function - Callback para editar o pedido
 * - usuarioLogado: object - Dados do usuário logado
 */

function OrderDetailModal({ isOpen, pedido, onClose, onEdit, onStatusChange, usuarioLogado }) {
  const [pedidoCompleto, setPedidoCompleto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && pedido?.id_pedido) {
      setLoading(true);
      fetchPedidoById(pedido.id_pedido)
        .then((data) => setPedidoCompleto(data))
        .catch(() => setPedidoCompleto(pedido))
        .finally(() => setLoading(false));
    } else {
      setPedidoCompleto(null);
    }
  }, [isOpen, pedido?.id_pedido]);

  if (!isOpen || !pedido) return null;

  const dadosPedido = pedidoCompleto || pedido;

  // Mapeia status para label mais legível
  const statusMap = {
    'nao-iniciado': 'Não iniciado',
    'aguardando-arte': 'Aguardando arte',
    'criando-mockup': 'Criando Mockup',
    'aguardando-aprovacao': 'Aguardando aprovação',
    'impressao-fotolito': 'Impressão fotolito',
    'conferindo': 'Conferindo',
    'personalizando': 'Personalizando',
    'quality-check': 'Quality check',
    'embalagem': 'Embalagem',
    'medicao': 'Medição',
    'emitir-etiqueta': 'Emitir etiqueta',
    'enviado': 'Enviado',
    'aguardando-retirada': 'Aguardando retirada',
    'finalizado': 'Finalizado',
  };

  const handleStatusChange = (novoStatus, usuario) => {
    onStatusChange && onStatusChange(dadosPedido.id_pedido, {
      ...dadosPedido,
      status: novoStatus,
      responsavel_fase_atual: usuario,
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-[#5f5f5f]">Carregando detalhes do pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-800/50 bg-opacity-0 flex items-center justify-center z-50 p-4">
      {/* Container do Modal */}
      <div className="bg-white rounded-lg shadow-lg max-w-[70vw] w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e4e2e2] sticky top-0 bg-white">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#161616]">
              Pedido {dadosPedido.num_pedido}
            </h2>
            <StatusBadge 
              status={dadosPedido.status}
              etapa_pedido={dadosPedido.etapa_pedido}
              onStatusChange={handleStatusChange}
              usuarioLogado={usuarioLogado}
            />
          </div>
          <button
            onClick={onClose}
            className="text-[#6b7280] hover:text-[#161616] text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-8">
          
          {/* Seção 1: Preview e Informações Principais */}
          <div className="grid grid-cols-3 gap-6">
            {/* Preview da Produção */}
            <div className="col-span-1">
              <div className="bg-[#f3f3f3] rounded p-4 flex items-center justify-center min-h-[280px]">
                {dadosPedido.url_foto_arte ? (
                  <img
                    src={dadosPedido.url_foto_arte}
                    alt="Preview do pedido"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-[#9ca3af] text-center">
                    <p className="font-bold">PREVIEW DE PRODUÇÃO</p>
                  </div>
                )}
              </div>
            </div>

            {/* Informações Principais */}
            <div className="col-span-2 space-y-6">
              {/* Row 1: Status e Etapa */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[1px] mb-2">
                    Status
                  </p>
                  <p className="text-[14px] font-medium text-[#161616]">
                    {statusMap[dadosPedido.status] || dadosPedido.status}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[1px] mb-2">
                    Etapa Atual
                  </p>
                  <p className="text-[14px] font-medium text-[#161616]">
                    {dadosPedido.etapa_pedido}
                  </p>
                </div>
              </div>

              {/* Row 2: Número Pedido e Nome Cliente */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[1px] mb-2">
                    Número do Pedido
                  </p>
                  <p className="text-[14px] font-medium text-[#161616]">
                    #{dadosPedido.num_pedido}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[1px] mb-2">
                    Nome Cliente
                  </p>
                  <p className="text-[14px] font-medium text-[#161616]">
                    {dadosPedido.cliente?.nome || "-"}
                  </p>
                </div>
              </div>

              {/* Row 3: Responsável e Data Início */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[1px] mb-2">
                    Responsável
                  </p>
                  <p className="text-[14px] font-medium text-[#161616]">
                    {dadosPedido.responsavel_fase_atual?.nome || dadosPedido.responsavel?.nome || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[1px] mb-2">
                    Data Início
                  </p>
                  <p className="text-[14px] font-medium text-[#161616]">
                    {dadosPedido.data_pedido}
                  </p>
                </div>
              </div>

              {/* Row 4: Tipo Envio e Data Fim */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[1px] mb-2">
                    Tipo de Envio
                  </p>
                  <p className="text-[14px] font-medium text-[#161616]">
                    {dadosPedido.tipo_envio || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[1px] mb-2">
                    Data Fim
                  </p>
                  <p className="text-[14px] font-medium text-[#161616]">
                    {dadosPedido.data_finalizacao || "-"}
                  </p>
                </div>
              </div>

              {/* Valor Total */}
              <div className="bg-[#f9f9f9] p-4 rounded border border-[#e4e2e2]">
                <p className="text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[1px] mb-2">
                  Valor Total do Pedido
                </p>
                <p className="text-[24px] font-bold text-[#161616]">
                  R$ {(dadosPedido.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Seção 2: Descrição do Pedido */}
          {dadosPedido.descricao && (
            <div>
              <h3 className="text-[14px] font-bold text-[#161616] uppercase tracking-[1px] mb-3">
                Descrição do Pedido
              </h3>
              <div className="bg-yellow-50 border-l-4 border-[#fdf210] p-4 rounded">
                <p className="text-[14px] text-[#323233] leading-relaxed">
                  {dadosPedido.descricao}
                </p>
              </div>
            </div>
          )}

          {/* Seção 3: Itens e Composição */}
          {dadosPedido.itens_pedido && dadosPedido.itens_pedido.length > 0 && (
            <div>
              <h3 className="text-[14px] font-bold text-[#161616] uppercase tracking-[1px] mb-3">
                Itens e Composição
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f3f3f3] border-b border-[#e4e2e2]">
                      <th className="px-4 py-3 text-left text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[0.5px]">
                        Produto
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[0.5px]">
                        Qtd
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[0.5px]">
                        Cor Estampa
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[0.5px]">
                        Composição
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold text-[#5f5f5f] uppercase tracking-[0.5px]">
                        Tamanho
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosPedido.itens_pedido.map((item, index) => (
                      <tr key={index} className="border-b border-[#e4e2e2] hover:bg-[#f9f9f9]">
                        <td className="px-4 py-3 text-[14px] text-[#323233]">
                          {item.produto.nome}
                        </td>
                        <td className="px-4 py-3 text-[14px] text-[#323233]">
                          {item.quantidade}
                        </td>
                        <td className="px-4 py-3 text-[14px] text-[#323233]">
                          {item.caracteristicas_item_pedido?.cor_estampa || "-"}
                        </td>
                        <td className="px-4 py-3 text-[14px] text-[#323233]">
                          {item.caracteristicas_item_pedido?.composicao || "-"}
                        </td>
                        <td className="px-4 py-3 text-[14px] text-[#323233]">
                          {item.caracteristicas_item_pedido?.tamanho || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Seção 4: Endereço de Entrega */}
          {dadosPedido.endereco && (
            <div>
              <h3 className="text-[14px] font-bold text-[#161616] uppercase tracking-[1px] mb-3">
                Endereço de Entrega
              </h3>
              <div className="bg-[#f9f9f9] p-4 rounded border border-[#e4e2e2]">
                <p className="text-[14px] text-[#323233]">
                  {dadosPedido.endereco.logradouro}, {dadosPedido.endereco.numero}
                  {dadosPedido.endereco.complemento && ` - ${dadosPedido.endereco.complemento}`}
                </p>
                <p className="text-[14px] text-[#323233]">
                  {dadosPedido.endereco.cep}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer com Botões */}
        <div className="flex gap-3 justify-end p-6 border-t border-[#e4e2e2] sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded font-bold text-[14px] bg-[#f3f3f3] text-[#323233] hover:bg-[#e4e2e2] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onEdit && onEdit(dadosPedido);
              onClose();
            }}
            className="px-6 py-2 rounded font-bold text-[14px] bg-[#161616] text-white hover:bg-[#0a0a0a] transition-colors"
          >
            Editar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal;

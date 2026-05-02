/**
 * StatusBadge - Componente para exibir status de pedidos por etapa de produção
 * 
 * Exibe um badge clicável com status do pedido
 * Organizado por etapas: Design → Produção → Embalagem → Logística
 * 
 * Props:
 * - status: string (deve ser uma das chaves do objeto statusConfig)
 * - etapa_pedido: string - Etapa atual do pedido
 * - onStatusChange: function - Callback quando status é alterado
 * - usuarioLogado: object - Dados do usuário logado (para atualizar responsável)
 * 
 * Exemplo de uso:
 * <StatusBadge status="aguardando-arte" etapa_pedido="Design" onStatusChange={handleStatusChange} />
 */

import { getNextStatus, getPreviousStatus } from '@/entities/pedido/api/statusFlowConfig';

function StatusBadge({ status, etapa_pedido, onStatusChange, usuarioLogado }) {
  // Configuração de status com cores, rótulos e etapas
  const statusConfig = {
    'nao-iniciado': {
      label: 'Não iniciado',
      dotColor: 'bg-[#a855f7]', // Roxo
      bgColor: 'bg-[#F3F3F3]', // Cinza claro/pastel
      textColor: 'text-[#808080]', // Cinza escuro
      stage: '',
    },
    // ===== DESIGN (Roxo/Azul) =====
    'aguardando-arte': {
      label: 'Aguardando arte',
      dotColor: 'bg-[#a855f7]', // Roxo
      bgColor: 'bg-[#e9d5ff]', // Roxo claro/pastel
      textColor: 'text-[#6b21a8]', // Roxo escuro
      stage: 'design',
    },
    'criando-mockup': {
      label: 'Criando Mockup',
      dotColor: 'bg-[#7c3aed]', // Roxo mais escuro
      bgColor: 'bg-[#ddd6fe]', // Roxo claro/pastel
      textColor: 'text-[#5b21b6]', // Roxo escuro
      stage: 'design',
    },
    'aguardando-aprovacao': {
      label: 'Aguardando aprovação',
      dotColor: 'bg-[#6d28d9]', // Roxo escuro
      bgColor: 'bg-[#ddd6fe]', // Roxo claro/pastel
      textColor: 'text-[#5b21b6]', // Roxo escuro
      stage: 'design',
    },
    'impressao-fotolito': {
      label: 'Impressão fotolito',
      dotColor: 'bg-[#5b21b6]', // Roxo muito escuro
      bgColor: 'bg-[#ddd6fe]', // Roxo claro/pastel
      textColor: 'text-[#5b21b6]', // Roxo escuro
      stage: 'design',
    },

    // ===== PRODUÇÃO (Laranja/Vermelho) =====
    conferindo: {
      label: 'Conferindo',
      dotColor: 'bg-[#f97316]', // Laranja
      bgColor: 'bg-[#fed7aa]', // Laranja claro/pastel
      textColor: 'text-[#b45309]', // Laranja escuro
      stage: 'producao',
    },
    personalizando: {
      label: 'Personalizando',
      dotColor: 'bg-[#dc2626]', // Vermelho
      bgColor: 'bg-[#fecaca]', // Vermelho claro/pastel
      textColor: 'text-[#991b1b]', // Vermelho escuro
      stage: 'producao',
    },

    // ===== EMBALAGEM (Amarelo/Verde) =====
    'quality-check': {
      label: 'Quality check',
      dotColor: 'bg-[#f2e700]', // Amarelo
      bgColor: 'bg-[#fef08a]', // Amarelo claro/pastel
      textColor: 'text-[#ca8a04]', // Amarelo escuro
      stage: 'embalagem',
    },
    embalagem: {
      label: 'Embalagem',
      dotColor: 'bg-[#eab308]', // Amarelo mais escuro
      bgColor: 'bg-[#e9d5ff]', // Roxo claro/pastel
      textColor: 'text-[#6b21a8]', // Roxo escuro
      stage: 'embalagem',
    },
    medicao: {
      label: 'Medição',
      dotColor: 'bg-[#84cc16]', // Verde-amarelo
      bgColor: 'bg-[#dcfce7]', // Verde claro/pastel
      textColor: 'text-[#166534]', // Verde escuro
      stage: 'embalagem',
    },
    'emitir-etiqueta': {
      label: 'Emitir etiqueta',
      dotColor: 'bg-[#65a30d]', // Verde
      bgColor: 'bg-[#dcfce7]', // Verde claro/pastel
      textColor: 'text-[#166534]', // Verde escuro
      stage: 'embalagem',
    },

    // ===== LOGÍSTICA (Azul/Índigo) =====
    enviado: {
      label: 'Enviado',
      dotColor: 'bg-[#3b82f6]', // Azul
      bgColor: 'bg-[#dbeafe]', // Azul claro/pastel
      textColor: 'text-[#1e40af]', // Azul escuro
      stage: 'logistica',
    },

    'aguardando-retirada': {
      label: 'Aguardando retirada',
      dotColor: 'bg-[#3BF5F2]', // Ciano
      bgColor: 'bg-[#cffafe]', // Ciano claro/pastel
      textColor: 'text-[#0e7490]', // Ciano escuro
      stage: 'logistica',
    },

    // ===== FINALIZADOS =====
    finalizado: {
      label: 'Finalizado',
      dotColor: 'bg-[#10b981]', // Verde
      bgColor: 'bg-[#d1fae5]', // Verde claro/pastel
      textColor: 'text-[#065f46]', // Verde escuro
      stage: 'finalizados',
    }

  };

  // Pega a configuração do status, ou usa um padrão se não existir
  const config = statusConfig[status] || statusConfig['aguardando-arte'];

  // Verifica se pode avançar ou retroceder o status
  const proximoStatus = getNextStatus(etapa_pedido, status);
  const statusAnterior = getPreviousStatus(etapa_pedido, status);

  const handleClick = (novoStatus) => {
    if (onStatusChange) {
      onStatusChange(novoStatus, usuarioLogado);
    }
  };

  return (
    <div
      className="flex items-center justify-center gap-[8px]"
      data-test-id="status-badge"
      data-stage={config.stage}
    >
      {/* Botão retroceder status */}
      {statusAnterior && (
        <button
          onClick={() => handleClick(statusAnterior)}
          className="text-[#9ca3af] hover:text-[#6b7280] transition-colors text-xs"
          title="Status anterior"
        >
          ◀
        </button>
      )}

      {/* Card de status - Formato badge/chip clicável */}
      <div 
        onClick={() => proximoStatus && handleClick(proximoStatus)}
        className={`${config.bgColor} px-[12px] py-[6px] rounded-[20px] flex items-center justify-center ${proximoStatus ? 'cursor-pointer hover:opacity-80' : ''} transition-opacity`}
      >
        <span
          className={`font-['Inter:Bold',sans-serif] font-bold text-[11px] tracking-[-0.6px] uppercase ${config.textColor}`}
          data-test-id={`status-text-${status}`}
        >
          {config.label}
        </span>
      </div>

      {/* Botão avançar status */}
      {proximoStatus && (
        <button
          onClick={() => handleClick(proximoStatus)}
          className="text-[#9ca3af] hover:text-[#6b7280] transition-colors text-xs"
          title="Próximo status"
        >
          ▶
        </button>
      )}
    </div>
  );
}

export default StatusBadge;
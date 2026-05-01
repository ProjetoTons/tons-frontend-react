/**
 * StatusBadge - Componente para exibir status de pedidos por etapa de produção
 * 
 * Exibe um indicador visual (ponto colorido) + texto de status
 * Organizado por etapas: Design → Produção → Embalagem → Logística
 * 
 * Props:
 * - status: string (deve ser uma das chaves do objeto statusConfig)
 * 
 * Exemplo de uso:
 * <StatusBadge status="aguardando-arte" />
 * <StatusBadge status="conferindo" />
 * <StatusBadge status="quality-check" />
 * <StatusBadge status="enviado" />
 */

function StatusBadge({ status }) {
  // Configuração de status com cores, rótulos e etapas
  const statusConfig = {
    // ===== DESIGN (Roxo/Azul) =====
    'aguardando-arte': {
      label: 'Aguardando arte',
      dotColor: 'bg-[#a855f7]', // Roxo
      textColor: 'text-[#161616]',
      stage: 'design',
    },
    'criando-mockup': {
      label: 'Criando Mockup',
      dotColor: 'bg-[#7c3aed]', // Roxo mais escuro
      textColor: 'text-[#161616]',
      stage: 'design',
    },
    'aguardando-aprovacao': {
      label: 'Aguardando aprovação',
      dotColor: 'bg-[#6d28d9]', // Roxo escuro
      textColor: 'text-[#161616]',
      stage: 'design',
    },
    'impressao-fotolito': {
      label: 'Impressão fotolito',
      dotColor: 'bg-[#5b21b6]', // Roxo muito escuro
      textColor: 'text-[#161616]',
      stage: 'design',
    },

    // ===== PRODUÇÃO (Laranja/Vermelho) =====
    conferindo: {
      label: 'Conferindo',
      dotColor: 'bg-[#f97316]', // Laranja
      textColor: 'text-[#161616]',
      stage: 'producao',
    },
    personalizando: {
      label: 'Personalizando',
      dotColor: 'bg-[#dc2626]', // Vermelho
      textColor: 'text-[#161616]',
      stage: 'producao',
    },

    // ===== EMBALAGEM (Amarelo/Verde) =====
    'quality-check': {
      label: 'Quality check/Conferência',
      dotColor: 'bg-[#f2e700]', // Amarelo
      textColor: 'text-[#161616]',
      stage: 'embalagem',
    },
    embalagem: {
      label: 'Embalagem',
      dotColor: 'bg-[#eab308]', // Amarelo mais escuro
      textColor: 'text-[#161616]',
      stage: 'embalagem',
    },
    medicao: {
      label: 'Medição',
      dotColor: 'bg-[#84cc16]', // Verde-amarelo
      textColor: 'text-[#161616]',
      stage: 'embalagem',
    },
    'emitir-etiqueta': {
      label: 'Emitir etiqueta',
      dotColor: 'bg-[#65a30d]', // Verde
      textColor: 'text-[#161616]',
      stage: 'embalagem',
    },

    // ===== LOGÍSTICA (Azul/Índigo) =====
    enviado: {
      label: 'Enviado',
      dotColor: 'bg-[#3b82f6]', // Azul
      textColor: 'text-[#161616]',
      stage: 'logistica',
    },

    'aguardando-retirada': {
      label: 'Aguardando retirada',
      dotColor: 'bg-[#3BF5F2]', // Ciano
      textColor: 'text-[#161616]',
      stage: 'logistica',
    },
  };

  // Pega a configuração do status, ou usa um padrão se não existir
  const config = statusConfig[status] || statusConfig['aguardando-arte'];

  return (
    <div
      className="flex items-center gap-[8px]"
      data-test-id="status-badge"
      data-stage={config.stage}
    >
      {/* Ponto colorido */}
      <div
        className={`shrink-0 size-[8px] rounded-full ${config.dotColor}`}
        data-test-id={`status-dot-${status}`}
      />

      {/* Texto do status */}
      <span
        className={`font-['Inter:Bold',sans-serif] font-bold text-[12px] tracking-[-0.6px] uppercase ${config.textColor}`}
        data-test-id={`status-text-${status}`}
      >
        {config.label}
      </span>
    </div>
  );
}

export default StatusBadge;
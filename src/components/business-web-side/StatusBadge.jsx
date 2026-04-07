/**
 * StatusBadge - Componente para exibir status de pedidos
 * 
 * Exibe um indicador visual (ponto colorido) + texto de status
 * 
 * Props:
 * - status: string (deve ser uma das chaves do objeto statusConfig)
 * 
 * Exemplo de uso:
 * <StatusBadge status="andamento" />
 * <StatusBadge status="avaliacao" />
 * <StatusBadge status="nao-iniciado" />
 * <StatusBadge status="concluido" />
 */

function StatusBadge({ status }) {
  // Configuração de status com cores e rótulos
  const statusConfig = {
    andamento: {
      label: 'Andamento',
      dotColor: 'bg-[#f2e700]', // Amarelo
      textColor: 'text-[#161616]', // Preto
    },
    avaliacao: {
      label: 'Em Avaliação',
      dotColor: 'bg-[#3b82f6]', // Azul (inferido)
      textColor: 'text-[#161616]',
    },
    'nao-iniciado': {
      label: 'Não iniciado',
      dotColor: 'bg-[#e4e2e2]', // Cinza
      textColor: 'text-[#5f5f5f]', // Cinza escuro
    },
    concluido: {
      label: 'Concluído',
      dotColor: 'bg-[#10b981]', // Verde (inferido)
      textColor: 'text-[#161616]',
    },
  };

  // Pega a configuração do status, ou usa um padrão se não existir
  const config = statusConfig[status] || statusConfig['nao-iniciado'];

  return (
    <div className="flex items-center gap-[8px]" data-test-id="status-badge">
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
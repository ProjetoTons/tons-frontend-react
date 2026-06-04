import { useState } from "react";

export default function CancelarPedidoModal({ isOpen, onClose, onConfirm, numPedido }) {
  const [motivo, setMotivo] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!motivo.trim()) {
      setErro("O motivo do cancelamento é obrigatório.");
      return;
    }
    setErro("");
    setEnviando(true);
    try {
      await onConfirm(motivo.trim());
      setMotivo("");
    } finally {
      setEnviando(false);
    }
  };

  const handleClose = () => {
    setMotivo("");
    setErro("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Card */}
      <div className="relative bg-white w-full max-w-[480px] shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Barra vermelha no topo */}
        <div className="h-1 bg-red-500" />

        <div className="px-8 py-7">
          {/* Ícone + Título */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Cancelar Pedido</h2>
              {numPedido && (
                <p className="text-xs text-gray-500 font-medium">Pedido #{numPedido}</p>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4 mb-4">
            Esta ação não pode ser desfeita. Informe o motivo do cancelamento:
          </p>

          {/* Textarea */}
          <textarea
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
              if (erro) setErro("");
            }}
            placeholder="Descreva o motivo do cancelamento..."
            rows={4}
            className={`w-full border px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 ${
              erro ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-red-300"
            }`}
          />
          {erro && <p className="text-xs text-red-500 mt-1">{erro}</p>}

          {/* Botões */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={enviando}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={enviando}
              className="flex-1 py-3 px-4 bg-red-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              {enviando ? "Cancelando..." : "Confirmar Cancelamento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

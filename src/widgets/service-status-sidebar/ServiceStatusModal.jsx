const SERVICES = [
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', status: 'online' },
  { id: 'olist', name: 'Olist API', icon: '🛒', status: 'online' },
  { id: 'database', name: 'Data Base', icon: '🗄️', status: 'online' },
];

export function ServiceStatusModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay escuro sólido */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal - mantém identidade clara do site */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">
            Status dos Serviços
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Services list */}
        <div className="flex flex-col gap-3">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between border border-gray-200 rounded-xl px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{service.icon}</span>
                <span className="text-sm font-bold uppercase tracking-wide text-gray-700">
                  {service.name}
                </span>
              </div>
              <span
                className={`w-3.5 h-3.5 rounded-full ${
                  service.status === 'online'
                    ? 'bg-green-500'
                    : service.status === 'warning'
                    ? 'bg-yellow-400'
                    : 'bg-red-500'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

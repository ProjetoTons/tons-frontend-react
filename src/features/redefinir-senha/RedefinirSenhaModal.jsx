import React, { useState } from "react";

export default function RedefinirSenhaModal({ isOpen, onClose, onConfirm }) {
  const [form, setForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  const [errors, setErrors] = useState({});
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validar = () => {
    const novosErros = {};

    if (!form.senhaAtual.trim()) {
      novosErros.senhaAtual = "Informe a senha atual.";
    }

    if (!form.novaSenha.trim()) {
      novosErros.novaSenha = "Informe a nova senha.";
    } else if (form.novaSenha.length < 6) {
      novosErros.novaSenha = "A senha deve ter no mínimo 6 caracteres.";
    }

    if (!form.confirmarSenha.trim()) {
      novosErros.confirmarSenha = "Confirme a nova senha.";
    } else if (form.novaSenha !== form.confirmarSenha) {
      novosErros.confirmarSenha = "As senhas não coincidem.";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    onConfirm({
      senhaAtual: form.senhaAtual,
      novaSenha: form.novaSenha,
    });
    setForm({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
    setErrors({});
  };

  const handleClose = () => {
    setForm({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
    setErrors({});
    onClose();
  };

  const inputClass =
    "w-full bg-white border border-gray-300 px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--amarelo-base)] pr-12";

  const inputErrorClass =
    "w-full bg-white border border-red-400 px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-red-400 pr-12";

  const labelClass =
    "text-[10px] uppercase tracking-[1.5px] text-gray-500 font-medium mb-1 block";

  const EyeIcon = ({ show, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
    >
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Card */}
      <div className="relative bg-[#FAF8F2] w-full max-w-[460px] shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
        {/* Barra amarela no topo */}
        <div className="h-1 bg-[#F7D708]" />

        <div className="px-10 py-8">
          {/* Eyebrow: logo + breadcrumb */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <span className="text-[#F7D708] font-black text-sm leading-none">T</span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-black leading-tight">
              Ton's Personalizados / CONFIGURAÇÕES
            </p>
          </div>

          {/* Título */}
          <h2
            className="text-[36px] leading-none font-black uppercase tracking-tight text-black"
            style={{ fontFamily: "var(--fonte-space)" }}
          >
            Redefinir Senha
          </h2>

          {/* Divisor amarelo curto */}
          <div className="w-14 h-[3px] bg-[#F7D708] mt-4 mb-6" />

          {/* Descrição */}
          <p className="text-[13px] text-gray-700 leading-relaxed mb-6">
            Para sua segurança, informe a senha atual e defina uma nova senha de acesso.
          </p>

          {/* Form fields */}
          <div className="space-y-4 mb-8">
            {/* Senha Atual */}
            <div>
              <label className={labelClass}>Senha Atual</label>
              <div className="relative">
                <input
                  type={showSenhaAtual ? "text" : "password"}
                  value={form.senhaAtual}
                  onChange={handleChange("senhaAtual")}
                  placeholder="Digite sua senha atual"
                  className={errors.senhaAtual ? inputErrorClass : inputClass}
                />
                <EyeIcon show={showSenhaAtual} onClick={() => setShowSenhaAtual(!showSenhaAtual)} />
              </div>
              {errors.senhaAtual && <p className="text-[11px] text-red-500 mt-1">{errors.senhaAtual}</p>}
            </div>

            {/* Nova Senha */}
            <div>
              <label className={labelClass}>Nova Senha</label>
              <div className="relative">
                <input
                  type={showNovaSenha ? "text" : "password"}
                  value={form.novaSenha}
                  onChange={handleChange("novaSenha")}
                  placeholder="Mínimo 6 caracteres"
                  className={errors.novaSenha ? inputErrorClass : inputClass}
                />
                <EyeIcon show={showNovaSenha} onClick={() => setShowNovaSenha(!showNovaSenha)} />
              </div>
              {errors.novaSenha && <p className="text-[11px] text-red-500 mt-1">{errors.novaSenha}</p>}
            </div>

            {/* Confirmar Nova Senha */}
            <div>
              <label className={labelClass}>Confirmar Nova Senha</label>
              <div className="relative">
                <input
                  type={showConfirmar ? "text" : "password"}
                  value={form.confirmarSenha}
                  onChange={handleChange("confirmarSenha")}
                  placeholder="Repita a nova senha"
                  className={errors.confirmarSenha ? inputErrorClass : inputClass}
                />
                <EyeIcon show={showConfirmar} onClick={() => setShowConfirmar(!showConfirmar)} />
              </div>
              {errors.confirmarSenha && <p className="text-[11px] text-red-500 mt-1">{errors.confirmarSenha}</p>}
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSubmit}
              className="w-full py-4 px-5 bg-[#F7D708] hover:brightness-95 text-black font-black text-[12px] tracking-[2px] uppercase transition-all flex items-center justify-center gap-3"
            >
              <span>Atualizar Senha</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </button>

            <button
              onClick={handleClose}
              className="w-full py-4 px-5 bg-transparent border border-black text-black font-bold text-[12px] tracking-[2px] uppercase hover:bg-black hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

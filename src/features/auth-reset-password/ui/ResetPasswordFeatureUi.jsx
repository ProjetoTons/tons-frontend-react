import React from "react";
import { Link } from "react-router-dom";
import { useResetPassword } from "@/features/auth-reset-password/model/ResetPasswordFeatureModel";
import LoadingOverlay from "@/shared/ui/molecules/LoadingOverlay/LoadingOverlay";

export default function ResetPasswordFeatureUi() {
  const {
    novaSenha,
    confirmarSenha,
    isLoading,
    errorMessage,
    successMessage,
    handleNovaSenha,
    handleConfirmarSenha,
    handleSubmit,
  } = useResetPassword();

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FA] flex flex-col items-center justify-center px-4 font-sans">
      <LoadingOverlay isVisible={isLoading} message="Salvando..." />

      {/* Logo */}
      <div className="w-full max-w-md mb-8">
        <Link to="/portfolio">
          <img
            src="/logo-tons/Logo tons_Sem_Fundo.png"
            alt="Logo"
            className="w-28 sm:w-32 mx-auto cursor-pointer"
          />
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white p-8 sm:p-10 shadow-sm border border-gray-100 max-w-md w-full relative">

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 uppercase tracking-tight">
            Redefinir senha
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Crie uma nova senha para sua conta.
          </p>
        </div>

        {/* Erro */}
        {errorMessage && (
          <div className="w-full mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-semibold uppercase tracking-wider text-center">
            {errorMessage}
          </div>
        )}

        {/* Sucesso */}
        {successMessage && (
          <div className="w-full mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-[11px] font-semibold uppercase tracking-wider text-center">
            {successMessage}
          </div>
        )}

        {!successMessage ? (
          <form className="space-y-4" onSubmit={handleSubmit}>

            <div>
              <label htmlFor="novaSenha" className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                Nova senha
              </label>
              <input
                id="novaSenha"
                name="novaSenha"
                type="password"
                value={novaSenha}
                onChange={handleNovaSenha}
                placeholder="••••••••"
                className="w-full py-2 px-4 text-sm bg-[#EFEFEF] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FFE300] transition-all"
              />
            </div>

            <div>
              <label htmlFor="confirmarSenha" className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                Confirmar nova senha
              </label>
              <input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={handleConfirmarSenha}
                placeholder="••••••••"
                className="w-full py-2 px-4 text-sm bg-[#EFEFEF] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FFE300] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FFE300] text-black font-bold py-3 px-8 text-[11px] uppercase tracking-wider hover:bg-[#EED100] disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              {isLoading ? "Salvando..." : "Redefinir senha"}
            </button>
          </form>
        ) : (
          <div className="mt-4">
            <Link
              to="/login"
              className="w-full block text-center bg-[#FFE300] text-black font-bold py-3 px-8 text-[11px] uppercase tracking-wider hover:bg-[#EED100] transition-colors"
            >
              Ir para o login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

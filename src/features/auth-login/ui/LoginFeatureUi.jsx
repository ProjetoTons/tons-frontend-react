import React from "react";
import { Link } from "react-router-dom";
import { useLogin } from "@/features/auth-login/model/LoginFeatureModel";

export default function LoginFeatureUi() {
  const { formData, isLoading, errorMessage, handleChange, handleSubmit } = useLogin();

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FA] flex flex-col items-center justify-center px-4 font-sans">

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
            Login
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Acesse sua conta na Ton's Personalizados.
          </p>
        </div>

        {/* Erro */}
        {errorMessage && (
          <div className="w-full mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-semibold uppercase tracking-wider text-center">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label htmlFor="email" className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seuemail@exemplo.com"
              className="w-full py-2 px-4 text-sm bg-[#EFEFEF] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FFE300] transition-all"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full py-2 px-4 text-sm bg-[#EFEFEF] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FFE300] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FFE300] text-black font-bold py-3 px-8 text-[11px] uppercase tracking-wider hover:bg-[#EED100] disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Link
            to="/login/esqueci-senha"
            className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-black transition-colors"
          >
            Esqueci minha senha
          </Link>
          <Link
            to="/cadastro/cliente"
            className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-black transition-colors"
          >
            Criar uma conta
          </Link>
        </div>

      </div>
    </div>
  );
}

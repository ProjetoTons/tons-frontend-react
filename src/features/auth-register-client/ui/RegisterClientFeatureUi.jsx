import React, { useState } from "react";
import InputForm from "@/shared/ui/molecules/FormField/FormField";
import { useRegisterClient } from "@/features/auth-register-client/model/RegisterClientFeatureModel";
import { Link } from "react-router-dom";
import EtapaVisual from "@/shared/ui/molecules/Etapas/EtapaVisual";

export default function RegisterClient() {

  const { cpf, cpfValido, formData, isLoading, errorMessage, handleCpf, handleFullName, handleEmail, handlePhone, handlePassword, handleSubmit } = useRegisterClient();

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans">

      {/* SEÇÃO ESQUERDA */}
      <div className="w-1/2 relative flex flex-col items-center justify-start pt-4 pb-0 px-8 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo */}
          <img
            src="/logo-tons/Logo tons_Sem_Fundo.png"
            alt="Logo"
            className="w-32 mb-10 mx-auto" />

          <EtapaVisual
            NomeEstapa={"Dados Pessoais"}
            faseInicial={1}
            faseFinal={2}
          />


          {/* Titulo */}
          <h1 className="text-2xl font-bold text-gray-900 mb-0.5 uppercase tracking-wide">
            Criar Conta
          </h1>
          <p className="text-gray-500 mb-4 text-xs">
            {!cpfValido ? "Insira o CPF para começar." : "Insira seus dados para criar um conta."}
          </p>

          {/* EXIBIÇÃO DE ERRO VISUAL */}
          {errorMessage && (
            <div className="absolute top-15 left-1/2 transform -translate-x-1/2 w-[65%] z-50 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-semibold uppercase tracking-wider text-center shadow-lg animate-pulse">
              {errorMessage}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-2">

            {/* Campo CPF */}
            <div className="w-full">
              <label htmlFor='cpfId' className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                CPF
              </label>
              <input
                id='cpfId'
                name='cpf'
                type='text'
                value={cpf}
                onChange={handleCpf}
                placeholder='000.000.000-00'
                className={`w-full py-2 px-4 text-sm focus:outline-none focus:ring-1 transition-all ${cpf.length === 14 && !cpfValido
                  ? 'bg-red-50 ring-red-500 text-red-900'
                  : 'bg-[#EFEFEF] text-gray-800 focus:ring-[#FFE300]'
                  }`}
              />
            </div>

            {/* Nome Completo */}
            <InputForm
              label="Nome Completo"
              name="fullName"
              value={formData.fullName}
              onChange={handleFullName}
              placeholder="Nome completo"
              disabled={!cpfValido}
            />

            {/* Linha Email e Telefone */}
            <div className="grid grid-cols-2 gap-2">
              <InputForm
                label="E-mail"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleEmail}
                placeholder="seu@email.com"
                disabled={!cpfValido}
              />

              <InputForm
                label="Telefone"
                name="cellphone"
                type="tel"
                value={formData.phone}
                onChange={handlePhone}
                placeholder="(00) 00000-0000"
                disabled={!cpfValido}
              />
            </div>

            {/* Senha */}
            <InputForm
              label="Senha"
              name="password"
              type="password"
              value={formData.password}
              onChange={handlePassword}
              placeholder="********"
              disabled={!cpfValido}
            />

            {/* Confirmar Senha */}
            <InputForm
              label="Confirmar Senha"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handlePassword}
              placeholder="********"
              disabled={!cpfValido}
            />


            {/* Botão de confirmação */}
            <button
              type="submit"
              disabled={!cpfValido || isLoading}
              className="w-full bg-[#FFE300] text-black font-semibold py-2.5 mt-2 px-6 text-sm uppercase flex items-center justify-center gap-2 hover:bg-[#EED100] disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              {isLoading ? (
                "Processando..."
              ) : (
                <>
                  Cadastrar Usuário
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Já tem conta */}
          <p className="mt-4 text-center text-gray-700 text-[11px]">
            Já tem uma conta?
            <Link to="/login" className="font-semibold text-black hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* SEÇÃO DIREITA */}
      <div
        className="w-1/2 bg-cover bg-center flex flex-col justify-end p-12"
        style={{ backgroundImage: "url('/cadastro-imgIndustrial.png')" }}
      >
        <div className="text-5xl font-extrabold text-white uppercase tracking-tighter leading-none max-w-lg mb-16 text-center" >
          ideias que ganham
          <span className="block text-[#FFE300]">forma.</span>
        </div>
        <div className="text-gray-300 text-[10px]">
          <p className="uppercase text-gray-500 font-semibold mb-1">Localização</p>
          <p>Rua Adolfo Appia, 177 - Jardim Cibele, São Paulo - SP, 08260-210</p>
        </div>
      </div>
    </div>
  );
}
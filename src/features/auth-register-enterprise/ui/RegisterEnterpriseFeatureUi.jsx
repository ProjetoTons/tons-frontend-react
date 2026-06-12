import React from "react";
import InputForm from "@/shared/ui/molecules/FormField/FormField";
import { useRegisterEnterprise } from '@/features/auth-register-enterprise/model/RegisterEnterpriseFeatureModel.js'
import { Link, useLocation } from "react-router-dom";
import EtapaVisual from "@/shared/ui/molecules/Etapas/EtapaVisual";
import LoadingOverlay from "@/shared/ui/molecules/LoadingOverlay/LoadingOverlay";

export default function RegisterEnterpriseFeature() {

  const location = useLocation();

  const {
    cnpj,
    formData,
    cnpjValido,
    isLoading,
    errorMessage,
    handleCnpj,
    handleRazaoSocial,
    handleEmail,
    handlePhone,
    handleSubmit,
    handleVoltar
  } = useRegisterEnterprise();


  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans">
      <LoadingOverlay isVisible={isLoading} message="Processando Cadastro..." />

      {/* SEÇÃO ESQUERDA */}
      <div className="w-1/2 relative flex flex-col items-center justify-center px-8 lg:px-16 overflow-y-auto bg-[#F8F9FA] animate-slide-in-right">
        <div className="w-full max-w-lg">

        {/* HEADER: Logo da Empresa */}
        <div className="w-full max-w-2xl mb-0">
          <Link to="/portfolio">
            <img
              src="/logo-tons/Logo tons_Sem_Fundo.png"
              alt="Logo"
              className="w-24 sm:w-32 mb-0 mx-auto cursor-pointer" />
          </Link>
        </div>

        {/* PROGRESSO: Configuração da Empresa */}
        <EtapaVisual
          NomeEstapa={"VÍNCULO CORPORATIVO"}
          faseInicial={3}
          faseFinal={4}
        />

        {/* CARTÃO PRINCIPAL BRANCO */}
        <div className="bg-white p-6 sm:p-8 shadow-sm border border-gray-100 relative">

          {/* Títulos */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 uppercase tracking-tight">
              Qual é a sua empresa?
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 ">
              Informe o CNPJ para localizarmos o seu local de trabalho ou realizarmos um novo cadastro.
            </p>
          </div>

          {/* EXIBIÇÃO DE ERRO VISUAL */}
          {errorMessage && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%] z-50 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-semibold uppercase tracking-wider text-center shadow-lg animate-pulse">
              {errorMessage}
            </div>
          )}

          {/* FORMULÁRIO */}
          <form className="space-y-3" onSubmit={handleSubmit}>

            <div className="w-full">
              <label htmlFor='cnpjId' className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                CNPJ
              </label>

              <input
                id='cnpjId'
                name='cnpj'
                type='text'
                value={cnpj}
                onChange={handleCnpj}
                placeholder='00.000.000/0000-00'
                className={`w-full py-2 px-4 text-sm focus:outline-none focus:ring-1 transition-all ${cnpj.length === 18 && !cnpjValido
                  ? 'bg-red-50 ring-red-500 text-red-900'
                  : 'bg-[#EFEFEF] text-gray-800 focus:ring-[#FFE300]'
                  }`}
              />
            </div>

            {/* Linha 1: Razão Social */}
            <InputForm
              label="Razão Social"
              name="razaoSocial"
              placeholder="Ex: Gráfica Precision Ltda"
              disabled={!cnpjValido}
              value={formData.razaoSocial}
              onChange={handleRazaoSocial}
            />

            {/* Linha 2: Telefone e email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputForm
                label="Telefone Comercial"
                name="telefone"
                placeholder="(00) 00000-0000"
                disabled={!cnpjValido}
                type="tel"
                value={formData.phone}
                onChange={handlePhone}
              />

              <InputForm
                label="Email Corporativo"
                name="email"
                placeholder="contato@empresa.com.br"
                disabled={!cnpjValido}
                type="email"
                value={formData.email}
                onChange={handleEmail}
              />
            </div>

            {/* Ações do Formulário (Rodapé do Cartão) */}
            <div className="flex items-center gap-3 pt-4 mt-2">

              <button
                type="button"
                onClick={handleVoltar}
                className="flex-1 flex items-center justify-center gap-1 py-3 px-4 bg-[#EFEFEF] text-[11px] font-bold text-gray-600 uppercase tracking-wider hover:bg-[#E0E0E0] hover:text-black transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Voltar
              </button>

              <button
                type="submit"
                disabled={!cnpjValido || isLoading}
                className="flex-1 bg-[#FFE300] text-black font-bold py-3 px-6 text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#EED100] disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
              >
                {isLoading ? (
                  "Processando..."
                ) : (
                  <>
                    Próximo Passo
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

        {/* FORA DO CARTÃO: Ações secundárias */}
        <div className="mt-8 mb-8 flex flex-col items-center gap-8 text-center">

          <Link
            state={{
              dadosPessoais: location.state?.dadosPessoais,
              cpfSalvo: location.state?.cpfSalvo,
              dadosEndereco: location.state?.dadosEndereco
            }}
            to="/cadastro/sucesso"
            className="text-[12px] font-bold text-gray-700 uppercase tracking-widest underline decoration-gray-300 underline-offset-[8px] hover:text-black hover:decoration-black transition-all"
          >
            Não represento uma empresa. Continuar.
          </Link>

        </div>

        </div>
      </div>

      {/* SEÇÃO DIREITA - IMAGEM */}
      <div
        className="w-1/2 bg-cover bg-center flex flex-col justify-between p-12 animate-fade-in relative"
        style={{ backgroundImage: "url('/product/step2.png')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div></div>
        <div className="text-5xl font-extrabold text-white uppercase tracking-tighter leading-none max-w-lg text-center self-center relative z-10">
          Personalize,
          <br />
          impacte,
          <span className="block text-[#FFE300]">marque.</span>
        </div>
        <div className="text-gray-300 text-[10px] relative z-10">
          <p className="uppercase text-gray-500 font-semibold mb-1">Localização</p>
          <p>Rua Adolfo Appia, 177 - Jardim Cibele, São Paulo - SP, 08260-210</p>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import InputForm from "@/shared/ui/molecules/FormField/FormField";
import { useRegisterEnterprise } from '@/features/auth-register-enterprise/model/RegisterEnterpriseFeatureModel.js'
import { Link, useLocation } from "react-router-dom";
import EtapaVisual from "@/shared/ui/molecules/Etapas/EtapaVisual";

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
    <div className="h-screen overflow-hidden bg-[#F8F9FA] flex flex-col items-center justify-evenly px-4 font-sans">

      {/* HEADER: Logo da Empresa */}
      <div className="w-full max-w-2xl mb-0">
        <img
          src="/logo-tons/Logo tons_Sem_Fundo.png"
          alt="Logo"
          className="w-24 sm:w-32 mb-0 mx-auto" />
      </div>

      {/* WRAPPER CENTRAL */}
      <div className="w-full max-w-2xl ">

        {/* PROGRESSO: Configuração da Empresa */}
        <EtapaVisual
          NomeEstapa={"VÍNCULO CORPORATIVO"}
          faseInicial={2}
          faseFinal={2}
        />

        {/* CARTÃO PRINCIPAL BRANCO */}
        <div className="bg-white p-6 sm:p-8 shadow-sm border border-gray-100 relative">

          {/* Títulos */}
          {/* Margem reduzida de mb-10 para mb-6 */}
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
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-6 mt-2 gap-4">

              <button
                type="button"
                onClick={handleVoltar}
                className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-black transition-colors"
              >
                Voltar para o passo 1
              </button>

              <button
                type="submit"
                disabled={!cnpjValido || isLoading}
                className="w-full sm:w-auto bg-[#FFE300] text-black font-bold py-2.5 px-8 text-[11px] uppercase tracking-wider hover:bg-[#EED100] disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
              >
                {isLoading ? (
                  "Processando..."
                ) : (
                  <>Cadastrar Empresa</>
                )}
              </button>
            </div>
          </form>

        </div>

        {/* FORA DO CARTÃO: Ações secundárias e badgets */}
        <div className="mt-8 mb-8 flex flex-col items-center gap-8 text-center">

          <Link
            state={{
              dadosPessoais: location.state?.dadosPessoais,
              cpfSalvo: location.state?.cpfSalvo
            }}
            to="/cadastro/sucesso"
            className="text-[12px] font-bold text-gray-700 uppercase tracking-widest underline decoration-gray-300 underline-offset-[8px] hover:text-black hover:decoration-black transition-all"
          >
            Não represento uma empresa. Continuar.
          </Link>

        </div>

      </div >
    </div >
  );
}
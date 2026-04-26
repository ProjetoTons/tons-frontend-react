import React from "react";
import InputForm from "@/shared/ui/molecules/FormField/FormField";

export default function RegisterEnterpriseFeature() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center py-12 px-4 font-sans">

      {/* HEADER: Logo da Empresa */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-xl font-extrabold tracking-tighter text-gray-900">
          Ton's Personalizados
        </h2>
      </div>

      {/* WRAPPER CENTRAL */}
      <div className="w-full max-w-2xl">

        {/* PROGRESSO: Configuração da Empresa */}
        <div className="flex justify-between items-end mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <span>Configuração da Empresa</span>
          <span className="text-black">Step 2 of 2</span>
        </div>
        {/* Barra amarela indicando 100% de progresso */}
        <div className="w-full h-1 bg-gray-200 mb-8 flex">
          <div className="w-full h-full bg-[#FFE300]"></div>
        </div>

        {/* CARTÃO PRINCIPAL BRANCO */}
        <div className="bg-white p-10 sm:p-12 shadow-sm border border-gray-100">

          {/* Títulos */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 uppercase tracking-tight">
              Perfil do Negócio
            </h1>
            <p className="text-sm text-gray-500 max-w-md">
              Complete as informações técnicas da sua oficina de impressão para ativar o sistema de gestão.
            </p>
          </div>

          {/* ÁREA DE UPLOAD DE LOGO */}
          <div className="flex items-center gap-6 mb-10">
            {/* Box Cinza de Upload */}
            <div className="w-24 h-24 bg-[#EFEFEF] flex flex-col items-center justify-center relative cursor-pointer hover:bg-gray-200 transition-colors">
              <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Logo</span>
              {/* Botão flutuante amarelo (+) */}
              <div className="absolute -bottom-2 -right-2 bg-[#FFE300] w-6 h-6 flex items-center justify-center text-black font-bold text-lg shadow-sm">
                +
              </div>
            </div>

            {/* Textos explicativos do Upload */}
            <div>
              <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1">
                Upload Company Logo
              </h3>
              <p className="text-[10px] text-gray-500 max-w-[220px] leading-relaxed">
                Formatos suportados: PNG, SVG ou JPG. Recomendado: 400x400px com fundo transparente.
              </p>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <form className="space-y-4">
            
            {/* Adaptei o seu <input> solto para usar o InputForm e manter o visual idêntico */}
            <div className="w-full">
              <label htmlFor='cnpjId' className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                CNPJ
              </label>

              <input
                id='cnpjId'
                name='cnpj'
                type='text'
                value={cnpj} //fazer state
                onChange={handleCnpj} //criar handle
                placeholder='00.000.000/0000-00'
                className={`w-full py-2 px-4 text-sm focus:outline-none focus:ring-1 transition-all ${cnpj.length === 18 && !cnpjValido //criar state
                  ? 'bg-red-50 ring-red-500 text-red-900'
                  : 'bg-[#EFEFEF] text-gray-800 focus:ring-[#FFE300]'
                  }`}
              />
            </div>

            {/* Linha 1: Razão Social ocupa a largura toda */}
            <InputForm
              label="Razão Social"
              name="razaoSocial"
              placeholder="Ex: Gráfica Precision Ltda"
            />

            {/* Linha 2: CNPJ e Telefone lado a lado (Grid de 2 colunas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">



              <InputForm
                label="Telefone Comercial"
                name="telefone"
                type="tel"
                placeholder="+55 (11) 0000-0000"
              />
            </div>

            {/* Linha 3: Email ocupa a largura toda */}
            <InputForm
              label="Email Corporativo"
              name="email"
              type="email"
              placeholder="contato@empresa.com.br"
            />

            {/* Ações do Formulário (Rodapé do Cartão) */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-8 mt-4 gap-4">
              <button
                type="button"
                className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-black transition-colors"
              >
                Voltar para o passo 1
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#FFE300] text-black font-bold py-3 px-8 text-[11px] uppercase tracking-wider hover:bg-[#EED100] transition-colors"
              >
                Finalizar Cadastro
              </button>
            </div>
          </form>

        </div>

        {/* FORA DO CARTÃO: Ações secundárias e badgets */}
        <div className="mt-8 flex flex-col items-center gap-8">

          {/* O seu CSS diferente para Pular para o Login (Visual Ghost/Link minimalista) */}
          <button
            type="button"
            className="text-[11px] font-bold text-gray-500 uppercase tracking-widest underline decoration-gray-300 underline-offset-[6px] hover:text-black hover:decoration-black transition-all"
          >
            Pular para o Login
          </button>

        </div>

      </div>
    </div>
  );
}
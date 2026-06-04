import React from "react";
import { Link } from "react-router-dom";
import InputForm from "@/shared/ui/molecules/FormField/FormField";
import EtapaVisual from "@/shared/ui/molecules/Etapas/EtapaVisual";
import LoadingOverlay from "@/shared/ui/molecules/LoadingOverlay/LoadingOverlay";
import { useRegisterAddress } from "@/features/auth-register-address/model/RegisterAddressFeatureModel";

export default function RegisterAddressFeature() {
  const {
    formData,
    isLoading,
    errorMessage,
    handleChange,
    handleCepBlur,
    handleSubmit,
    handlePular,
    handleVoltar,
  } = useRegisterAddress();

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans">
      <LoadingOverlay isVisible={isLoading} message="Buscando endereço..." />

      {/* SEÇÃO ESQUERDA */}
      <div className="w-1/2 relative flex flex-col items-center justify-center px-8 lg:px-16 overflow-y-auto animate-slide-in-left">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <Link to="/portfolio">
            <img
              src="/logo-tons/Logo tons_Sem_Fundo.png"
              alt="Logo"
              className="w-32 mb-10 mx-auto cursor-pointer"
            />
          </Link>

          <EtapaVisual
            NomeEstapa={"Endereço de Entrega"}
            faseInicial={3}
            faseFinal={4}
          />

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 mb-0.5 uppercase tracking-wide">
            Endereço
          </h1>
          <p className="text-gray-500 mb-4 text-xs">
            Opcional — facilita o processo de entrega dos seus pedidos.
          </p>

          {/* Erro */}
          {errorMessage && (
            <div className="absolute top-15 left-1/2 transform -translate-x-1/2 w-[65%] z-50 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-semibold uppercase tracking-wider text-center shadow-lg animate-pulse">
              {errorMessage}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* CEP */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
                  CEP
                </label>
                <input
                  name="cep"
                  type="text"
                  value={formData.cep}
                  onChange={handleChange}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                  className="w-full py-2 px-4 text-sm bg-[#EFEFEF] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FFE300] transition-all"
                />
              </div>
              <div className="col-span-2">
                <InputForm
                  label="Logradouro"
                  name="logradouro"
                  value={formData.logradouro}
                  readOnly
                  placeholder="Rua, Avenida..."
                />
              </div>
            </div>

            {/* Número e Complemento */}
            <div className="grid grid-cols-3 gap-2">
              <InputForm
                label="Número"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="123"
              />
              <div className="col-span-2">
                <InputForm
                  label="Complemento"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  placeholder="Apto, Bloco (opcional)"
                />
              </div>
            </div>

            {/* Bairro */}
            <InputForm
              label="Bairro"
              name="bairro"
              value={formData.bairro}
              readOnly
              placeholder="Bairro"
            />

            {/* Cidade e Estado */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <InputForm
                  label="Cidade"
                  name="cidade"
                  value={formData.cidade}
                  readOnly
                  placeholder="Cidade"
                />
              </div>
              <InputForm
                label="Estado"
                name="estado"
                value={formData.estado}
                readOnly
                placeholder="UF"
              />
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                className="w-full bg-[#FFE300] text-black font-bold py-3 px-6 text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#EED100] transition-colors"
              >
                Salvar Endereço
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleVoltar}
                className="w-full text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-black transition-colors cursor-pointer"
              >
                Voltar para o passo 2
              </button>
            </div>

            {/* Pular */}
            <button
              type="button"
              onClick={handlePular}
              className="w-full mt-3 text-center text-[12px] font-bold text-gray-700 uppercase tracking-widest underline decoration-gray-300 underline-offset-[8px] hover:text-black hover:decoration-black transition-all cursor-pointer"
            >
              Pular esta etapa →
            </button>
          </form>
        </div>
      </div>

      {/* SEÇÃO DIREITA */}
      <div
        className="w-1/2 bg-cover bg-center flex flex-col justify-between p-12 animate-fade-in relative"
        style={{ backgroundImage: "url('/cadastro-imgIndustrial.png')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div></div>
        <div className="text-5xl font-extrabold text-white uppercase tracking-tighter leading-none max-w-lg text-center self-center relative z-10">
          entregas com
          <span className="block text-[#FFE300]">precisão.</span>
        </div>
        <div className="text-gray-300 text-[10px] relative z-10">
          <p className="uppercase text-gray-500 font-semibold mb-1">Localização</p>
          <p>Rua Adolfo Appia, 177 - Jardim Cibele, São Paulo - SP, 08260-210</p>
        </div>
      </div>
    </div>
  );
}

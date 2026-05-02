import React from "react";
import InputForm from "@/shared/ui/molecules/FormField/FormField";
import useRegisterEmployeFeature from "@/features/auth-register-employee/model/RegisterEmployeFeatureModel";
import FileInputForm from "@/shared/ui/molecules/FormField/fileInputform";
import SelectForm from "@/shared/ui/molecules/FormField/SelectForm";
import { Link } from "react-router-dom";

export default function RegisterEmployeeFeature() {

    const {
        formData,
        isLoading,
        errorMessage,
        opcoesCargo,
        carregandoAcessos,
        handleFullName,
        handleEmail,
        handlePhone,
        handlePassword,
        handleChange,
        handleFileChange,
        handleClear,
        handleSubmit
    } = useRegisterEmployeFeature();

    return (
        <div className="h-screen overflow-hidden bg-[#F8F9FA] flex flex-col items-center justify-center px-8 py-0 font-sans">

            {/* HEADER: Logo da Empresa */}
            <div className="w-full max-w-2xl mb-0">
                <img
                    src="/logo-tons/Logo tons_Sem_Fundo.png"
                    alt="Logo"
                    className="w-24 sm:w-32 mx-auto"
                />
            </div>

            {/* WRAPPER CENTRAL */}
            <div className="w-full max-w-2xl">

                {/* CARTÃO PRINCIPAL BRANCO */}
                <div className="bg-white p-6 sm:p-8 shadow-sm border border-gray-100 relative">
                
                    {/* BOTÃO DE VOLTAR COM LINK (A melhor prática!) */}
                    <Link
                        to="/funcionario"
                        className="flex items-center gap-1.5 text-[10px] font-bold text-gray-800 uppercase tracking-widest hover:text-black underline decoration-gray-300 hover:decoration-[#FFE300] underline-offset-4 transition-all mb-2 w-fit cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5 mb-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Voltar
                    </Link>

                    {/* EXIBIÇÃO DE ERRO VISUAL*/}
                    {errorMessage && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[90%] z-50 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-semibold uppercase tracking-wider text-center shadow-lg animate-pulse">
                            {errorMessage}
                        </div>
                    )}

                    {/* Títulos */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 uppercase tracking-tight">
                            Novo Funcionário
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            Cadastre um novo funcionário na esteira de produção.
                        </p>
                    </div>

                    {/* FORMULÁRIO */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* GRID 2 COLUNAS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <InputForm
                                label="Nome Completo"
                                name="nome"
                                value={formData.nome}
                                onChange={handleFullName}
                                placeholder="Ex: Roberto Almeida"
                                type="text"
                                disabled={isLoading}
                            />

                            {/* Select de Cargo (Agora Modularizado e Multi-seleção) */}
                            <SelectForm
                                label="Cargo / Função"
                                name="cargo"
                                value={formData.cargo}
                                onChange={handleChange}
                                options={opcoesCargo}
                                placeholder={carregandoAcessos ? "Carregando cargos..." : "Selecione as funções"}
                                disabled={isLoading || carregandoAcessos}
                                required={true}
                            />

                            <InputForm
                                label="E-mail Corporativo"
                                name="email"
                                value={formData.email}
                                onChange={handleEmail}
                                placeholder="roberto@inkiron.com"
                                type="email"
                                disabled={isLoading}
                            />

                            <InputForm
                                label="Senha Temporária"
                                name="senha"
                                value={formData.senha}
                                onChange={handlePassword}
                                placeholder="••••••••"
                                type="password"
                                disabled={isLoading}
                            />

                            <InputForm
                                label="Telefone / WhatsApp"
                                name="telefone"
                                value={formData.telefone}
                                onChange={handlePhone}
                                placeholder="(11) 99999-9999"
                                type="tel"
                                disabled={isLoading}
                            />

                            <InputForm
                                label="Data de Nascimento"
                                name="dataNascimento"
                                value={formData.dataNascimento}
                                onChange={handleChange}
                                type="date"
                                disabled={isLoading}
                            />

                            {/* Upload de Foto (Agora Modularizado) */}
                            <FileInputForm
                                label="Foto do Perfil"
                                name="foto"
                                onChange={handleFileChange}
                                fileName={formData.foto?.name}
                                accept="image/*"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Ações do Formulário */}
                        <div className="flex flex-col-reverse sm:flex-row items-center justify-evenly pt-6 mt-2 gap-4">

                            <button
                                type="button"
                                onClick={handleClear}
                                disabled={isLoading}
                                className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider hover:text-black cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-3.5 h-3.5 mb-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Limpar Campos
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto bg-[#FFE300] text-black font-bold py-2.5 px-8 text-[11px] uppercase tracking-wider hover:bg-[#EED100] cursor-pointer transition-colors disabled:bg-gray-200 disabled:text-gray-400"
                            >
                                {isLoading ? "Salvando..." : "Salvar Funcionário"}
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}
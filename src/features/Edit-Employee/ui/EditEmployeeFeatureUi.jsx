import React from "react";
import { Link } from "react-router-dom";
import InputForm from "@/shared/ui/molecules/FormField/FormField";
import SelectForm from "@/shared/ui/molecules/FormField/SelectForm";
import useEditEmployeeFeature from "@/features/Edit-Employee/model/EditEmployeeFeatureModel";
import { aplicarMascaraTelefone } from "@/shared/lib/masked";

export default function EditEmployeeFeature() {
    const {
        id,
        formData,
        isLoading,
        errorMessage,
        opcoesCargo,
        carregandoAcessos,
        handleFullName,
        handleEmail,
        handleChange,
        handlePhone,
        handleDeactivate,
        handleSubmit
    } = useEditEmployeeFeature();

    // Função auxiliar para traduzir os IDs do array para o nome do cargo no cartão de perfil
    const exibirCargosDoPerfil = () => {
        if (!formData.cargo || formData.cargo.length === 0) return "Nenhum cargo";
        return formData.cargo
            .map(idCargo => opcoesCargo.find(opt => opt.value === idCargo)?.label)
            .filter(Boolean) // Remove undefined caso o ID não seja encontrado
            .join(" / ");
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center py-10 px-4 font-sans">
            <div className="w-full max-w-5xl">


                {/* ERRO VISUAL */}
                {errorMessage && (
                    <div className="absolute w-9/12 mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-bold uppercase tracking-wider text-center shadow-sm animate-pulse">
                        {errorMessage}
                    </div>
                )}

                {/* HEADER DA PÁGINA */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
                            Editar Funcionário
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                Editar Funcionário: {formData.nome.split(" ")[0]} (ID: {id})
                            </span>
                        </div>
                    </div>

                    <Link
                        to="/funcionario"
                        className="flex items-center gap-1.5 text-[10px] font-bold text-gray-800 uppercase tracking-widest hover:text-black underline decoration-gray-300 hover:decoration-[#FFE300] underline-offset-4 transition-all mb-2 w-fit cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5 mb-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Voltar para Lista
                    </Link>
                </div>

                {/* LAYOUT EM GRID */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                    {/* COLUNA ESQUERDA: Apenas Perfil */}
                    <div className="md:col-span-4 h-full">

                        <div className="bg-white p-8 shadow-sm border border-gray-100 flex flex-col justify-around items-center text-center h-full">

                            {/* Avatar e Textos (Ficam ancorados no topo) */}
                            <div className="flex flex-col items-center w-full">
                                <div className="w-28 h-28 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 border border-gray-200">
                                    {/* Se o mock tiver avatar, pode colocar a tag <img src={formData.avatar} ... /> aqui depois */}
                                    <svg className="w-16 h-16 text-black" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 truncate w-full">
                                    {formData.nome.split(" ")[0]}
                                </h2>

                                <p className="text-[10px] font-bold text-[#EED100] uppercase tracking-widest mt-1">
                                    {exibirCargosDoPerfil()}
                                </p>
                            </div>

                            {/* Status e Linha (Empurrados para o fundo pelo mt-auto) */}
                            <div className="w-full">
                                <div className="w-full h-px bg-gray-100 mb-6"></div>

                                <div className="w-full flex justify-between items-center mb-3 text-[10px] uppercase font-bold tracking-wider">
                                    <span className="text-gray-400">Status</span>
                                    <span className="text-gray-900">{formData.status || "Não contém"}</span>
                                </div>
                                <div className="w-full flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                                    <span className="text-gray-400">Desde</span>
                                    <span className="text-gray-900">{formData.desde || "Não contém"}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* COLUNA DIREITA: Formulário Completo */}
                    <div className="md:col-span-8 bg-[#F9F9F9] p-6 sm:p-8 shadow-sm border border-gray-100 relative">
                        <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between gap-8">

                            <div>
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-6">
                                    Dados Cadastrais e Acessos
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                                    <InputForm
                                        label="Nome Completo"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleFullName}
                                        type="text"
                                        disabled={isLoading}
                                    />

                                    {/* AQUI TROCAMOS PARA O SELECT MULTIPLO DE CARGOS */}
                                    <SelectForm
                                        label="Cargo / Função"
                                        name="cargo"
                                        value={formData.cargo}
                                        onChange={handleChange}
                                        options={opcoesCargo}
                                        multiple={true}
                                        disabled={isLoading || carregandoAcessos}
                                        placeholder={carregandoAcessos ? "Carregando cargos..." : "Selecione as funções"}
                                    />

                                    <InputForm
                                        label="Telefone"
                                        name="telefone"
                                        value={aplicarMascaraTelefone(formData.telefone)}
                                        onChange={handlePhone}
                                        type="tel"
                                        disabled={isLoading}
                                    />

                                    {/* Aqui você usava Data de Admissão, mas no mock está dataNascimento. Atualizei para bater com o Mock! */}
                                    <InputForm
                                        label="Data de Nascimento"
                                        name="dataNascimento"
                                        value={formData.dataNascimento}
                                        onChange={handleChange}
                                        type="date"
                                        disabled={isLoading}
                                    />
                                    <div className="sm:col-span-2">
                                        <InputForm
                                            label="Email Corporativo"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleEmail}
                                            type="email"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputForm
                                            label="Nova Senha (obrigatória para salvar)"
                                            name="senha"
                                            value={formData.senha}
                                            onChange={handleChange}
                                            type="password"
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* Rodapé do Formulário (Botões) */}
                            <div className="flex flex-col sm:flex-row items-center justify-evenly pt-6 border-t border-gray-200 gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={handleDeactivate}
                                    disabled={isLoading}
                                    className="text-[10px] font-bold text-red-600 uppercase tracking-widest hover:text-red-800 transition-colors"
                                >
                                    Excluir Conta
                                </button>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full sm:w-auto bg-[#FFE300] text-black font-bold py-3 px-8 text-[11px] uppercase tracking-wider hover:bg-[#EED100] transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? "Salvando..." : "Atualizar Dados"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
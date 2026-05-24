import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  aplicarMascaraCpf,
  aplicarMascaraTelefone,
  aplicarMascaraNomeCompleto,
  aplicarMascaraEmail,
  aplicarMascaraCnpj,
  aplicarMascaraRazaoSocial,
} from "@/shared/lib/utils/masked";
import {
  validarCPF,
  validarCNPJ,
  obterErroNomeCompleto,
  obterErroEmail,
  obterErroTelefone,
  obterErroRazaoSocial,
} from "@/shared/lib/utils/dataValidation";
import axios from "axios";
import { consultarCnpj } from "@/entities/empresa/api/empresaApi";
import RedefinirSenhaModal from "@/features/redefinir-senha/RedefinirSenhaModal";

export default function ConfiguracoesWidget() {
  const navigate = useNavigate();

  // Collapsible sections
  const [openSections, setOpenSections] = useState({
    dados: true,
    endereco: false,
    empresa: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Form state
  const [form, setForm] = useState({
    nomeCompleto: "",
    email: "",
    dataNascimento: "",
    cpf: "",
    telefone: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    razaoSocial: "",
    cnpj: "",
    telefoneComercial: "",
    emailCorporativo: "",
  });

  const handleChange = (field) => (e) => {
    let value = e.target.value;

    switch (field) {
      case "nomeCompleto":
        value = aplicarMascaraNomeCompleto(value);
        break;
      case "email":
      case "emailCorporativo":
        value = aplicarMascaraEmail(value);
        break;
      case "cpf":
        value = aplicarMascaraCpf(value);
        break;
      case "telefone":
      case "telefoneComercial":
        value = aplicarMascaraTelefone(value);
        break;
      case "cnpj":
        value = aplicarMascaraCnpj(value);
        break;
      case "razaoSocial":
        value = aplicarMascaraRazaoSocial(value);
        break;
      case "cep":
        value = value.replace(/\D/g, "");
        if (value.length > 5) value = `${value.slice(0, 5)}-${value.slice(5, 8)}`;
        break;
      default:
        break;
    }

    setForm((prev) => ({ ...prev, [field]: value }));
    // Limpa erro do campo ao digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }

    // Busca automática pelo CEP quando completo (8 dígitos)
    if (field === "cep") {
      const cepLimpo = value.replace(/\D/g, "");
      if (cepLimpo.length === 8) {
        buscarCep(cepLimpo);
      }
    }

    // Busca automática pelo CNPJ quando completo (14 dígitos)
    if (field === "cnpj") {
      const cnpjLimpo = value.replace(/\D/g, "");
      if (cnpjLimpo.length === 14 && validarCNPJ(value)) {
        buscarCnpj(cnpjLimpo);
      }
    }
  };

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [buscandoCnpj, setBuscandoCnpj] = useState(false);

  const buscarCep = async (cep) => {
    setBuscandoCep(true);
    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (data.erro) {
        setErrors((prev) => ({ ...prev, cep: "CEP n\u00e3o encontrado." }));
      } else {
        setForm((prev) => ({
          ...prev,
          logradouro: data.logradouro || prev.logradouro,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado,
          complemento: data.complemento || prev.complemento,
        }));
        setErrors((prev) => ({ ...prev, cep: null }));
      }
    } catch {
      setErrors((prev) => ({ ...prev, cep: "Erro ao buscar CEP. Tente novamente." }));
    } finally {
      setBuscandoCep(false);
    }
  };

  const buscarCnpj = async (cnpj) => {
    setBuscandoCnpj(true);
    try {
      const dados = await consultarCnpj(cnpj);
      if (dados) {
        setForm((prev) => ({
          ...prev,
          razaoSocial: dados.razaoSocial ? aplicarMascaraRazaoSocial(dados.razaoSocial) : prev.razaoSocial,
          emailCorporativo: dados.email ? aplicarMascaraEmail(dados.email) : prev.emailCorporativo,
          telefoneComercial: dados.telefone ? aplicarMascaraTelefone(dados.telefone) : prev.telefoneComercial,
        }));
        setErrors((prev) => ({ ...prev, cnpj: null }));
      } else {
        setErrors((prev) => ({ ...prev, cnpj: "CNPJ não encontrado na Receita." }));
      }
    } catch {
      setErrors((prev) => ({ ...prev, cnpj: "Não foi possível consultar o CNPJ no momento." }));
    } finally {
      setBuscandoCnpj(false);
    }
  };

  // Errors state
  const [errors, setErrors] = useState({});

  // Modal redefinir senha
  const [isRedefinirSenhaOpen, setIsRedefinirSenhaOpen] = useState(false);

  const handleRedefinirSenha = (dados) => {
    // TODO: integrar com API de redefinição de senha
    console.log("Redefinir senha:", dados);
    setIsRedefinirSenhaOpen(false);
  };

  const validarFormulario = () => {
    const novosErros = {};

    // Dados Pessoais
    if (form.nomeCompleto) {
      const erroNome = obterErroNomeCompleto(form.nomeCompleto);
      if (erroNome) novosErros.nomeCompleto = erroNome;
    }

    if (form.email) {
      const erroEmail = obterErroEmail(form.email);
      if (erroEmail) novosErros.email = erroEmail;
    }

    if (form.cpf) {
      if (!validarCPF(form.cpf)) novosErros.cpf = "CPF inválido.";
    }

    if (form.telefone) {
      const erroTel = obterErroTelefone(form.telefone);
      if (erroTel) novosErros.telefone = erroTel;
    }

    // Empresa
    if (form.razaoSocial) {
      const erroRazao = obterErroRazaoSocial(form.razaoSocial);
      if (erroRazao) novosErros.razaoSocial = erroRazao;
    }

    if (form.cnpj) {
      if (!validarCNPJ(form.cnpj)) novosErros.cnpj = "CNPJ inválido.";
    }

    if (form.telefoneComercial) {
      const erroTelCom = obterErroTelefone(form.telefoneComercial);
      if (erroTelCom) novosErros.telefoneComercial = erroTelCom;
    }

    if (form.emailCorporativo) {
      const erroEmailCorp = obterErroEmail(form.emailCorporativo);
      if (erroEmailCorp) novosErros.emailCorporativo = erroEmailCorp;
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = () => {
    if (!validarFormulario()) return;
    // TODO: integrar com API de atualização do perfil
    console.log("Salvando configurações:", form);
  };

  const inputClass =
    "w-full bg-white border border-gray-300 px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--amarelo-base)]";

  const inputErrorClass =
    "w-full bg-white border border-red-400 px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-red-400";

  const labelClass =
    "text-[10px] uppercase tracking-[1.5px] text-gray-500 font-medium mb-1 block";

  const getInputClass = (field) => errors[field] ? inputErrorClass : inputClass;

  return (
    <div className="w-full max-w-[860px] mx-auto">
      {/* Back + breadcrumb */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
        >
          ← Voltar
        </button>
        <span className="text-sm text-gray-800 font-medium">Configurações</span>
      </div>

      {/* Title */}
      <h1
        className="text-[42px] leading-none font-black uppercase tracking-tight text-black"
        style={{ fontFamily: "var(--fonte-space)" }}
      >
        Configurações
      </h1>
      <p className="text-sm text-gray-500 mt-2 mb-2">
        Gerencie suas informações e preferências.
      </p>

      {/* Yellow divider */}
      <div className="w-14 h-[3px] bg-[#F7D708] mb-10" />

      {/* ===== DADOS PESSOAIS ===== */}
      <Section
        title="Dados Pessoais"
        subtitle="Informações de identificação básica para acesso ao site."
        isOpen={openSections.dados}
        onToggle={() => toggleSection("dados")}
      >
        <div className="border border-gray-200 bg-[#E5E5E5] p-6 space-y-5">
          {/* Nome Completo */}
          <div>
            <label className={labelClass}>Nome Completo</label>
            <input
              type="text"
              value={form.nomeCompleto}
              onChange={handleChange("nomeCompleto")}
              placeholder="Ricardo Iconomidis"
              className={getInputClass("nomeCompleto")}
            />
            {errors.nomeCompleto && <p className="text-[11px] text-red-500 mt-1">{errors.nomeCompleto}</p>}
          </div>

          {/* Email + Data Nascimento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="ricardo@inkandiros.com.br"
                className={getInputClass("email")}
              />
              {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className={labelClass}>Data de Nascimento</label>
              <input
                type="text"
                value={form.dataNascimento}
                onChange={handleChange("dataNascimento")}
                placeholder="09/15/1985"
                className={inputClass}
              />
            </div>
          </div>

          {/* CPF + Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>CPF</label>
              <input
                type="text"
                value={form.cpf}
                onChange={handleChange("cpf")}
                placeholder="000.000.000-00"
                className={getInputClass("cpf")}
              />
              {errors.cpf && <p className="text-[11px] text-red-500 mt-1">{errors.cpf}</p>}
            </div>
            <div>
              <label className={labelClass}>Telefone</label>
              <input
                type="text"
                value={form.telefone}
                onChange={handleChange("telefone")}
                placeholder="(11) 98780-4321"
                className={getInputClass("telefone")}
              />
              {errors.telefone && <p className="text-[11px] text-red-500 mt-1">{errors.telefone}</p>}
            </div>
          </div>

          {/* Redefinir senha */}
          <div>
            <button
              onClick={() => setIsRedefinirSenhaOpen(true)}
              className="text-[12px] font-bold text-black underline underline-offset-2 hover:text-gray-600 transition-colors"
            >
              Redefinir Senha de Acesso
            </button>
          </div>
        </div>
      </Section>

      {/* ===== ENDEREÇO ===== */}
      <Section
        title="Endereço"
        subtitle="Local padrão onde gostaria de receber seus pedidos."
        isOpen={openSections.endereco}
        onToggle={() => toggleSection("endereco")}
      >
        <div className="border border-gray-200 bg-[#E5E5E5] p-6 space-y-5">
          {/* CEP + Logradouro */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5">
            <div>
              <label className={labelClass}>CEP</label>
              <input
                type="text"
                value={form.cep}
                onChange={handleChange("cep")}
                maxLength={9}
                placeholder="01310-200"
                className={getInputClass("cep")}
              />
              {buscandoCep && <p className="text-[11px] text-gray-500 mt-1">Buscando endereço...</p>}
              {errors.cep && <p className="text-[11px] text-red-500 mt-1">{errors.cep}</p>}
            </div>
            <div>
              <label className={labelClass}>Logradouro</label>
              <input
                type="text"
                value={form.logradouro}
                onChange={handleChange("logradouro")}
                placeholder="Avenida Paulista"
                className={inputClass}
              />
            </div>
          </div>

          {/* Número + Complemento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Número</label>
              <input
                type="text"
                value={form.numero}
                onChange={handleChange("numero")}
                placeholder="1578"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Complemento</label>
              <input
                type="text"
                value={form.complemento}
                onChange={handleChange("complemento")}
                placeholder="Andar 12, Sala 124"
                className={inputClass}
              />
            </div>
          </div>

          {/* Bairro + Cidade + Estado */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr] gap-5">
            <div>
              <label className={labelClass}>Bairro</label>
              <input
                type="text"
                value={form.bairro}
                onChange={handleChange("bairro")}
                placeholder="Bela Vista"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Cidade</label>
              <input
                type="text"
                value={form.cidade}
                onChange={handleChange("cidade")}
                placeholder="São Paulo"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <input
                type="text"
                value={form.estado}
                onChange={handleChange("estado")}
                placeholder="SP"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ===== EMPRESA ===== */}
      <Section
        title="Empresa"
        subtitle="Vincule sua empresa ao nosso site."
        isOpen={openSections.empresa}
        onToggle={() => toggleSection("empresa")}
      >
        <div className="border border-gray-200 bg-[#E5E5E5] p-6 space-y-5">
          {/* Razão Social */}
          <div>
            <label className={labelClass}>Razão Social</label>
            <input
              type="text"
              value={form.razaoSocial}
              onChange={handleChange("razaoSocial")}
              placeholder="EX: INK & IRON PRINT SHOP LTDA."
              className={getInputClass("razaoSocial")}
            />
            {errors.razaoSocial && <p className="text-[11px] text-red-500 mt-1">{errors.razaoSocial}</p>}
          </div>

          {/* CNPJ + Telefone Comercial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>CNPJ</label>
              <input
                type="text"
                value={form.cnpj}
                onChange={handleChange("cnpj")}
                placeholder="00.000.000/0001-00"
                className={getInputClass("cnpj")}
              />
              {buscandoCnpj && <p className="text-[11px] text-gray-500 mt-1">Buscando empresa...</p>}
              {errors.cnpj && <p className="text-[11px] text-red-500 mt-1">{errors.cnpj}</p>}
            </div>
            <div>
              <label className={labelClass}>Telefone Comercial</label>
              <input
                type="text"
                value={form.telefoneComercial}
                onChange={handleChange("telefoneComercial")}
                placeholder="(11) 4004-0000"
                className={getInputClass("telefoneComercial")}
              />
              {errors.telefoneComercial && <p className="text-[11px] text-red-500 mt-1">{errors.telefoneComercial}</p>}
            </div>
          </div>

          {/* E-mail Corporativo */}
          <div>
            <label className={labelClass}>E-mail Corporativo</label>
            <input
              type="email"
              value={form.emailCorporativo}
              onChange={handleChange("emailCorporativo")}
              placeholder="financeiro@empresa.com.br"
              className={getInputClass("emailCorporativo")}
            />
            {errors.emailCorporativo && <p className="text-[11px] text-red-500 mt-1">{errors.emailCorporativo}</p>}
          </div>
        </div>
      </Section>

      {/* ===== FOOTER BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-10 py-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          As alterações serão aplicadas instantaneamente em todos os terminais.
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-[12px] font-bold uppercase tracking-[1px] text-black hover:text-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="px-6 py-3 bg-[#F7D708] hover:brightness-95 text-black font-bold text-[12px] uppercase tracking-[1px] transition-all"
          >
            Salvar Alterações
          </button>
        </div>
      </div>

      {/* Spacer for fixed footer */}
      <div className="h-20" />

      {/* Modal Redefinir Senha */}
      <RedefinirSenhaModal
        isOpen={isRedefinirSenhaOpen}
        onClose={() => setIsRedefinirSenhaOpen(false)}
        onConfirm={handleRedefinirSenha}
      />
    </div>
  );
}

/** Collapsible section component */
function Section({ title, subtitle, isOpen, onToggle, children }) {
  return (
    <div className="mb-10">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between group"
      >
        <h2 className="text-[14px] font-black uppercase tracking-[2px] text-black">
          {title}
        </h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-gray-400 group-hover:text-black transition-transform duration-200 ${
            isOpen ? "" : "-rotate-90"
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Divider */}
      <div className="h-px bg-gray-200 mt-2 mb-3" />

      {/* Subtitle */}
      <p className="text-[12px] text-gray-500 mb-5">{subtitle}</p>

      {/* Content */}
      {isOpen && children}
    </div>
  );
}

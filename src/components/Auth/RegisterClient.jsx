import React, { useState } from "react";
import InputForm from "@/components/Auth/atom/InputForm"; 

export default function RegisterClient() {

  const [cpfValido, setCpfValido] = useState(false);
  
  const [cpf, setCpf] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleCpf = (e) => {

    const cleanCpf = e.target.value.replace(/\D/g, "");

    const aplicarMascaraCpf = (cleanCpf) => {
      if (cleanCpf.length <= 3) return cleanCpf;
      if (cleanCpf.length <= 6) return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3)}`;
      if (cleanCpf.length <= 9) return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6)}`;
      return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9, 11)}`;
    }

    const validarCPF = (cpf) => {
      const numeros = cpf.replace(/\D/g, '');
      if (numeros.length !== 11 || /^(\d)\1+$/.test(numeros)) return false;
      let soma = 0, resto;
      for (let i = 1; i <= 9; i++) soma += parseInt(numeros.substring(i - 1, i)) * (11 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(numeros.substring(9, 10))) return false;
      soma = 0;
      for (let i = 1; i <= 10; i++) soma += parseInt(numeros.substring(i - 1, i)) * (12 - i);
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(numeros.substring(10, 11))) return false;
      return true;
    };

    if (cleanCpf.length > 11) return;
    setCpf(aplicarMascaraCpf(cleanCpf));

    if (cleanCpf.length === 11) {
      if (validarCPF(cleanCpf)) setCpfValido(true);
      else {
        alert("CPF Inválido")
        setCpfValido(false);
      }
    } else {
      setCpfValido(false);
    }
  };

  const handleFullName = (e) => {
    let nomeCompletoAtual = e.target.value;
    const nomeCompletoFormatado = nomeCompletoAtual.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());

    setFormData({ ...formData, fullName: nomeCompletoFormatado });
  };

  const handleEmail = (e) => {
    let emailAtual = e.target.value.toLowerCase().trim();
    setFormData({ ...formData, email: emailAtual });
  };

  const handlePhone = (e) => {
    let telefoneAtual = e.target.value.replace(/\D/g, "");
    if (telefoneAtual.length > 11) return;

    let telefoneFormatado = telefoneAtual;
    if (telefoneAtual.length > 2) telefoneFormatado = `(${telefoneAtual.slice(0, 2)}) ${telefoneAtual.slice(2)}`;
    if (telefoneAtual.length > 7) telefoneFormatado = `(${telefoneAtual.slice(0, 2)}) ${telefoneAtual.slice(2, 7)}-${telefoneAtual.slice(7)}`;

    setFormData({ ...formData, phone: telefoneFormatado });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans">

      {/* SEÇÃO ESQUERDA */}
      <div className="w-1/2 flex flex-col items-center justify-start pt-0 pb-0 px-8 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo */}
          <img
            src="/logo-tons/Logo tons_pages-to-jpg-0002.jpg"
            alt="Logo"
            className="w-22 mb-0 mx-auto" />

          {/* Titulo */}
          <h1 className="text-2xl font-bold text-gray-900 mb-0.5 uppercase tracking-wide">
            Criar Conta
          </h1>
          <p className="text-gray-500 mb-4 text-xs">
            {!cpfValido ? "Insira o CPF para começar." : "Insira seus dados para criar um conta."}
          </p>

          {/* Formulário */}
          <form className="space-y-2">

            {/* Campo CPF */}
            <div className="w-full">
              <label htmlFor='cpfId' className="block text-[9px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
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
                name="phone"
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
              placeholder="********"
              disabled={!cpfValido}
            />

            {/* Confirmar Senha */}
            <InputForm
              label="Confirmar Senha"
              name="confirmPassword"
              type="password"
              placeholder="********"
              disabled={!cpfValido}
            />


            {/* Botão de confirmação */}
            <button
              type="submit"
              disabled={!cpfValido}
              className="w-full bg-[#FFE300] text-black font-semibold py-2.5 mt-2 px-6 text-sm uppercase flex items-center justify-center gap-2 hover:bg-[#EED100] disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              Cadastrar Usuário
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>
          
          {/* Já tem conta */}
          <p className="mt-4 text-center text-gray-700 text-[10px]">
            Já tem uma conta? <a href="#" className="font-semibold text-black hover:underline">Login</a>
          </p>
        </div>
      </div>

      {/* SEÇÃO DIREITA */}
      <div
        className="w-1/2 bg-cover bg-center flex flex-col justify-end p-12"
        style={{ backgroundImage: "url('/cadastro-imgIndustrial.png')" }}
      >
        <div className="text-5xl font-extrabold text-white uppercase tracking-tighter leading-none max-w-lg mb-16">
          ideias que ganham <span className="block text-[#FFE300]">forma.</span>
        </div>
        <div className="text-gray-300 text-[10px]">
          <p className="uppercase text-gray-500 font-semibold mb-1">Localização</p>
          <p>Rua Adolfo Appia, 177 - Jardim Cibele, São Paulo - SP, 08260-210</p>
        </div>
      </div>
    </div>
  );
}
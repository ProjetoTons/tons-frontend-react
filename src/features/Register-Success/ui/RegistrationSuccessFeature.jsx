import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cadastrarUsuario } from "@/entities/usuario/api/usuarioApi";
import { cadastrarEmpresa } from "@/entities/empresa/api/empresaApi";
import { apenasDigitos } from "@/shared/lib/masked";
import { http } from "@/shared/api/http";

export default function RegistrationSuccessFeature() {
  const location = useLocation();
  const navigate = useNavigate();

  // Dados acumulados pelos steps anteriores (Step 1 e Step 2).
  const { dadosPessoais, cpfSalvo, dadosEmpresa } = location.state || {};

  // Estados para controlar a transição da tela
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Guard: se cair direto em /cadastro/sucesso sem ter passado pelos steps,
  // volta para o início do fluxo.
  useEffect(() => {
    if (!dadosPessoais || !cpfSalvo) {
      navigate("/cadastro/cliente", { replace: true });
    }
  }, [dadosPessoais, cpfSalvo, navigate]);

  // Auto-clear da mensagem de erro após 8s
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 8000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleConfirmarCadastro = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1) Se houver CNPJ, garante que a empresa existe no banco antes de
      //    cadastrar o usuário (cadastrarEmpresa ignora 409 silenciosamente).
      if (dadosEmpresa?.cnpj) {
        const razaoSocial = dadosEmpresa.formData?.razaoSocial ?? "";
        await cadastrarEmpresa({
          cnpj: apenasDigitos(dadosEmpresa.cnpj),
          razaoSocial,
          nomeFantasia: razaoSocial, // backend exige @NotNull; usa razaoSocial como fallback
          email: dadosEmpresa.formData?.email,
          telefone: apenasDigitos(dadosEmpresa.formData?.phone ?? ""),
        });
      }

      // 2) Cadastra o usuário, já com o CNPJ vinculado se aplicável.
      await cadastrarUsuario({
        nome: dadosPessoais.fullName,
        cpf: apenasDigitos(cpfSalvo),
        email: dadosPessoais.email,
        telefone: apenasDigitos(dadosPessoais.phone),
        senha: dadosPessoais.password,
        // CNPJ é opcional — só envia se o Step 2 foi preenchido
        ...(dadosEmpresa?.cnpj && { cnpj: apenasDigitos(dadosEmpresa.cnpj) }),
      });

      // Notificações de boas-vindas (não bloqueia a tela de sucesso)
      const primeiroNome = dadosPessoais.fullName.trim().split(" ")[0];
      const telefoneComDDI = "55" + apenasDigitos(dadosPessoais.phone);

      Promise.allSettled([
        http.post("/notificacao/enviar-email", {
          destinatario: dadosPessoais.email.trim(),
          assunto: "Cadastro confirmado - Tons Personalizados",
          corpo: `Olá ${primeiroNome}!\n\nSeu cadastro na Tons foi confirmado.`,
        }, { skipAuth: true }),
        http.post(`/whatsapp/confirmar-cadastro/${telefoneComDDI}?nome=${encodeURIComponent(primeiroNome)}`, null, { skipAuth: true }),
      ]).then((results) => {
        results.forEach((r, i) => {
          if (r.status === "rejected") {
            console.error(`[Notificação ${i === 0 ? "Email" : "WhatsApp"}] falhou:`, r.reason?.response?.data ?? r.reason?.message);
          }
        });
      });

      setIsConfirmed(true);
    } catch (error) {
      // Backend retorna JSON padrão do Spring: { timestamp, status, error, message, path }
      const status = error.response?.status;
      const apiMsg = error.response?.data?.message;

      if (!error.response) {
        setErrorMessage("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else if (status === 409) {
        setErrorMessage("Este e-mail já está cadastrado.");
      } else if (status === 400) {
        setErrorMessage(apiMsg || "Dados inválidos. Verifique os campos do cadastro.");
      } else {
        // 500 e outros — mostra mensagem do backend se houver, ajuda a diagnosticar
        console.error("Erro do backend:", error.response?.data);
        setErrorMessage(apiMsg ? `Erro: ${apiMsg}` : "Erro ao finalizar cadastro. Tente novamente em instantes.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-[#F8F9FA] flex flex-col items-center justify-center px-4 py-4 font-sans text-center overflow-hidden">
      
      {/* HEADER: Logo */}
      <div className="w-full max-w-2xl mb-4">
        <Link to="/portfolio">
          <img
            src="/logo-tons/Logo tons_Sem_Fundo.png"
            alt="Logo"
            className="w-20 sm:w-28 mx-auto cursor-pointer"
          />
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-10 shadow-sm border border-gray-100 max-w-lg w-full rounded-sm flex flex-col items-center justify-center transition-all duration-500">
        
        {/* ==========================================
            FASE 1: TELA DE CONFIRMAÇÃO
            ========================================== */}
        {!isConfirmed ? (
          <>
            {/* ÍCONE DE REVISÃO (Prancheta/Documento Amarelo) */}
            <div className="w-14 h-14 bg-[#FFE300] bg-opacity-20 rounded-full flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1 uppercase tracking-tight">
              Quase lá!
            </h1>
            <p className="text-xs text-gray-500 mb-4 max-w-sm">
              Confira seus dados antes de finalizar a criação da sua conta na Ton's Personalizados.
            </p>

            {/* RESUMO DOS DADOS */}
            {dadosPessoais && (
              <div className="w-full text-left mb-4 space-y-2">
                {/* Dados Pessoais */}
                <div className="border border-gray-100 p-3 rounded-sm">
                  <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Dados Pessoais
                  </h2>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nome</span>
                      <span className="text-gray-900 font-medium">{dadosPessoais.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">CPF</span>
                      <span className="text-gray-900 font-medium">{cpfSalvo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">E-mail</span>
                      <span className="text-gray-900 font-medium">{dadosPessoais.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Telefone</span>
                      <span className="text-gray-900 font-medium">{dadosPessoais.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Dados Empresa (condicional) */}
                {dadosEmpresa?.cnpj && (
                  <div className="border border-gray-100 p-3 rounded-sm">
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Dados da Empresa
                    </h2>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">CNPJ</span>
                        <span className="text-gray-900 font-medium">{dadosEmpresa.cnpj}</span>
                      </div>
                      {dadosEmpresa.formData?.razaoSocial && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Razão Social</span>
                          <span className="text-gray-900 font-medium">{dadosEmpresa.formData.razaoSocial}</span>
                        </div>
                      )}
                      {dadosEmpresa.formData?.email && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">E-mail</span>
                          <span className="text-gray-900 font-medium">{dadosEmpresa.formData.email}</span>
                        </div>
                      )}
                      {dadosEmpresa.formData?.phone && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Telefone</span>
                          <span className="text-gray-900 font-medium">{dadosEmpresa.formData.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mensagem de erro */}
            {errorMessage && (
              <div className="w-full mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-semibold uppercase tracking-wider text-center">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleConfirmarCadastro}
              disabled={isSubmitting}
              className="w-full bg-[#FFE300] text-black font-bold py-3 px-8 text-[11px] uppercase tracking-wider hover:bg-[#EED100] disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              {isSubmitting ? "Salvando dados..." : "Confirmar Cadastro"}
            </button>

            {!isSubmitting && (
              <button onClick={() => navigate(-1)} className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-black transition-colors">
                Voltar e editar dados
              </button>
            )}
          </>
        ) : (
        /* ==========================================
           FASE 2: TELA DE SUCESSO (O SVG VERDE!)
           ========================================== */
          <div className="animate-fade-in flex flex-col items-center">
            {/* ÍCONE DE SUCESSO (Checkmark Verde) */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg 
                className="w-10 h-10 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 uppercase tracking-tight">
              Tudo Certo!
            </h1>
            <p className="text-sm text-gray-500 mb-8 max-w-sm">
              Seu cadastro foi concluído com sucesso. Agora você já pode acessar a plataforma e explorar nossos serviços.
            </p>

            <Link
              to="/login"
              className="w-full bg-[#FFE300] text-black font-bold py-3.5 px-8 text-[11px] uppercase tracking-wider hover:bg-[#EED100] transition-colors block text-center"
            >
              Fazer Login e Começar
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
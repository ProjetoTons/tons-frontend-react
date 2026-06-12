import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cadastrarUsuario, salvarEnderecoUsuario } from "@/entities/usuario/api/usuarioApi";
import { cadastrarEmpresa } from "@/entities/empresa/api/empresaApi";
import { apenasDigitos } from "@/shared/lib/utils/masked";
import { http } from "@/shared/api/http";
import { setSession } from "@/shared/api/authToken";

export default function RegistrationSuccessFeature() {
  const location = useLocation();
  const navigate = useNavigate();

  // Dados acumulados pelos steps anteriores (Step 1, Step 2 e Step 3).
  const { dadosPessoais, cpfSalvo, dadosEmpresa, dadosEndereco } = location.state || {};

  // Estados para controlar a transição da tela
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Guard: se cair direto em /cadastro/sucesso sem ter passado pelos steps,
  // volta para o início do fluxo.
  useEffect(() => {
    if (!location.state) {
      navigate("/cadastro/cliente", { replace: true });
    }
  }, [location.state, navigate]);

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
      // 1) Cadastra o usuário primeiro (sem empresa ainda)
      //    Se falhar aqui, nada mais é cadastrado — evita dados órfãos.
      await cadastrarUsuario({
        nome: dadosPessoais.fullName,
        cpf: apenasDigitos(cpfSalvo),
        email: dadosPessoais.email,
        telefone: apenasDigitos(dadosPessoais.phone),
        senha: dadosPessoais.password,
      });

      // 2) Login silencioso para obter token e ID do usuário recém-criado
      let usuarioId = null;
      try {
        const loginRes = await http.post("/login", {
          email: dadosPessoais.email,
          senha: dadosPessoais.password,
        });
        const { token, ...usuario } = loginRes.data;
        setSession({ token, usuario });
        usuarioId = usuario.id;
      } catch (loginErr) {
        console.error("Login silencioso falhou:", loginErr);
      }

      // 3) Se houver CNPJ, cadastra a empresa e vincula ao usuário
      if (dadosEmpresa?.cnpj && usuarioId) {
        try {
          const razaoSocial = dadosEmpresa.formData?.razaoSocial ?? "";
          const resultado = await cadastrarEmpresa({
            cnpj: apenasDigitos(dadosEmpresa.cnpj),
            razaoSocial,
            nomeFantasia: razaoSocial,
            email: dadosEmpresa.formData?.email,
            telefone: apenasDigitos(dadosEmpresa.formData?.phone ?? ""),
          });
          // Vincula empresa ao usuário
          if (resultado.id) {
            await http.put(`/usuarios/${usuarioId}`, {
              nome: dadosPessoais.fullName,
              email: dadosPessoais.email,
              telefone: apenasDigitos(dadosPessoais.phone),
              empresaId: resultado.id,
            });
          }
        } catch (empErr) {
          console.error("Erro ao cadastrar/vincular empresa:", empErr);
        }
      }

      // 4) Se houver endereço preenchido, salva no backend
      if (dadosEndereco && usuarioId) {
        try {
          await salvarEnderecoUsuario(usuarioId, {
            cep: apenasDigitos(dadosEndereco.cep),
            logradouro: dadosEndereco.logradouro,
            numero: dadosEndereco.numero,
            complemento: dadosEndereco.complemento || "",
            bairro: dadosEndereco.bairro,
            cidade: dadosEndereco.cidade,
            estado: dadosEndereco.estado,
          });
        } catch (endErr) {
          console.error("Erro ao salvar endereço:", endErr);
        }
      }

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
      const apiErrors = error.response?.data?.errors; // Array de erros de validação do Spring

      if (!error.response) {
        setErrorMessage("Não foi possível conectar ao servidor. Verifique sua conexão.");
      } else if (status === 422) {
        setErrorMessage("CNPJ inválido. Verifique o CNPJ informado e tente novamente.");
      } else if (status === 409) {
        setErrorMessage(apiMsg || "Dado já cadastrado no sistema.");
      } else if (status === 400) {
        // Se o backend retornou lista de erros de validação, mostra detalhado
        if (Array.isArray(apiErrors) && apiErrors.length > 0) {
          const detalhes = apiErrors.map(e => e.defaultMessage || e.message || `${e.field}: inválido`).join(" | ");
          setErrorMessage(detalhes);
        } else {
          setErrorMessage(apiMsg || "Dados inválidos. Verifique os campos do cadastro.");
        }
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

                {/* Dados Endereço (condicional) */}
                {dadosEndereco && (
                  <div className="border border-gray-100 p-3 rounded-sm">
                    <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Endereço
                    </h2>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">CEP</span>
                        <span className="text-gray-900 font-medium">{dadosEndereco.cep}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Logradouro</span>
                        <span className="text-gray-900 font-medium">{dadosEndereco.logradouro}, {dadosEndereco.numero}</span>
                      </div>
                      {dadosEndereco.complemento && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Complemento</span>
                          <span className="text-gray-900 font-medium">{dadosEndereco.complemento}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bairro</span>
                        <span className="text-gray-900 font-medium">{dadosEndereco.bairro}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cidade/UF</span>
                        <span className="text-gray-900 font-medium">{dadosEndereco.cidade} - {dadosEndereco.estado}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mensagem de erro */}
            {errorMessage && (
              <div className="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-sm">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Erro no cadastro</span>
                </div>
                <ul className="space-y-1">
                  {errorMessage.split(" | ").map((msg, i) => (
                    <li key={i} className="text-[11px] text-red-600 font-medium flex items-start gap-1.5">
                      <span className="text-red-400 mt-0.5">•</span>
                      {msg}
                    </li>
                  ))}
                </ul>
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
              <button onClick={() => navigate("/cadastro/empresa", { state: { dadosPessoais, cpfSalvo, dadosEmpresa, dadosEndereco } })} className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-black transition-colors">
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
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function RegistrationSuccessFeature() {
  const location = useLocation();
  
  // Aqui você tem acesso a tudo que veio das telas anteriores!
  const { dadosPessoais, cpfSalvo, dadosEmpresa } = location.state || {};

  // Estados para controlar a transição da tela
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Função que simula o envio final para o banco de dados
  const handleConfirmarCadastro = async () => {
    setIsSubmitting(true);

    try {
      // Aqui entrará a sua chamada real para a API Java (Spring Boot)
      // Exemplo: await api.post('/usuarios/cadastrar', { dadosPessoais, dadosEmpresa });
      
      // Simulando o tempo de rede (1.5 segundos)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Deu certo! Muda a tela para a fase 2 (Sucesso Verde)
      setIsConfirmed(true);
    } catch (error) {
      console.error("Erro ao salvar dados", error);
      // Aqui você poderia colocar um alerta de erro
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F8F9FA] flex flex-col items-center justify-center px-4 font-sans text-center">
      
      {/* HEADER: Logo */}
      <div className="w-full max-w-2xl mb-8">
        <img
          src="/logo-tons/Logo tons_Sem_Fundo.png"
          alt="Logo"
          className="w-28 sm:w-32 mx-auto"
        />
      </div>

      <div className="bg-white p-10 sm:p-14 shadow-sm border border-gray-100 max-w-lg w-full rounded-sm flex flex-col items-center min-h-[360px] justify-center transition-all duration-500">
        
        {/* ==========================================
            FASE 1: TELA DE CONFIRMAÇÃO
            ========================================== */}
        {!isConfirmed ? (
          <>
            {/* ÍCONE DE REVISÃO (Prancheta/Documento Amarelo) */}
            <div className="w-24 h-24 bg-[#FFE300] bg-opacity-20 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 uppercase tracking-tight">
              Quase lá!
            </h1>
            <p className="text-sm text-gray-500 mb-8 max-w-sm">
              Tudo certo com seus dados? Confirme abaixo para finalizar a criação da sua conta na Ton's Personalizados.
            </p>

            <button
              onClick={handleConfirmarCadastro}
              disabled={isSubmitting}
              className="w-full bg-[#FFE300] text-black font-bold py-3.5 px-8 text-[11px] uppercase tracking-wider hover:bg-[#EED100] disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              {isSubmitting ? "Salvando dados..." : "Confirmar Cadastro"}
            </button>

            {/* Mudar aqui para o navigate */}
            {!isSubmitting && (
              <button onClick={() => window.history.back()} className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-black transition-colors">
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
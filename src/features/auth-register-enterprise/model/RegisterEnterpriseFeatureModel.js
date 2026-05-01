import { useState, useEffect } from "react";
import { obterErroEmail, obterErroTelefone, validarCNPJ, obterErroRazaoSocial } from "@/shared/lib/dataValidation";
import { aplicarMascaraEmail, aplicarMascaraTelefone, aplicarMascaraCnpj, aplicarMascaraRazaoSocial } from "@/shared/lib/masked";
import { useNavigate, useLocation } from "react-router-dom";

export const useRegisterEnterprise = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const cnpjRecuperado = location.state?.dadosEmpresa?.cnpj || "";
    const formDataRecuperada = location.state?.dadosEmpresa?.formData || {
        razaoSocial: "",
        email: "",
        phone: "",
    };

    const [cnpjValido, setCnpjValido] = useState(cnpjRecuperado != "" ? true : false);
    const [cnpj, setCnpj] = useState(cnpjRecuperado);

    const [formData, setFormData] = useState(formDataRecuperada);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage("");
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleCnpj = (e) => {
        const cleanCnpj = e.target.value.replace(/\D/g, "");

        if (cleanCnpj.length > 14) return;

        setCnpj(aplicarMascaraCnpj(cleanCnpj));

        if (cleanCnpj.length === 14) {
            if (validarCNPJ(cleanCnpj)) {
                setCnpjValido(true);
            } else {
                setErrorMessage('CNPJ Inválido');
                setCnpjValido(false);
            }
        } else {
            setCnpjValido(false);
        }
    }

    const handleRazaoSocial = (e) => {
        let razaoSocial = e.target.value;

        let razaoSocialFormatado = aplicarMascaraRazaoSocial(razaoSocial);

        setFormData({ ...formData, razaoSocial: razaoSocialFormatado });
    };

    const handleEmail = (e) => {
        let emailAtual = e.target.value;

        let emailAjustado = aplicarMascaraEmail(emailAtual);

        setFormData({ ...formData, email: emailAjustado });
    };

    const handlePhone = (e) => {
        let cleanTelefone = e.target.value.replace(/\D/g, "");

        if (cleanTelefone.length > 11) return;

        let telefoneFormatado = aplicarMascaraTelefone(cleanTelefone);

        setFormData({ ...formData, phone: telefoneFormatado });
    };

    const handleVoltar = (e) => {
        e.preventDefault();

        navigate("/cadastro/cliente", {
            state: {
                dadosPessoais: location.state?.dadosPessoais,
                cpfSalvo: location.state?.cpfSalvo,
                ...(cnpjValido && {
                    dadosEmpresa: {
                        cnpj: cnpj,
                        formData: formData
                    }
                })
            }
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrorMessage("");

        const erroRazaoSocial = obterErroRazaoSocial(formData.razaoSocial);
        if (erroRazaoSocial) {
            setErrorMessage(erroRazaoSocial);
            return;
        }

        const erroTelefone = obterErroTelefone(formData.phone);
        if (erroTelefone) {
            setErrorMessage(erroTelefone);
            return;
        }

        const erroEmail = obterErroEmail(formData.email);
        if (erroEmail) {
            setErrorMessage(erroEmail);
            return;
        }

        setIsLoading(true);

        try {
            // 4. Simulação de Chamada à API para verificar CPF existente
            // Quando sua API Java/Spring Boot estiver pronta, você substituirá este bloco
            // por algo como: await http.get(`/api/usuarios/verificar-cpf/${cpfCru}`)

            const cnpjJaExiste = await simularVerificacaoBancoDeDados(cnpj);

            if (cnpjJaExiste) {
                setErrorMessage("Este CNPJ já está cadastrado em nosso sistema.");
                setIsLoading(false);
                return;
            }

            // Aqui você chamaria o endpoint de POST para criar o usuário.

            navigate("/cadastro/sucesso", {
                state: {
                    dadosPessoais: location.state?.dadosPessoais,
                    cpfSalvo: location.state?.cpfSalvo,
                    dadosEmpresa: {
                        cnpj: cnpj,
                        formData: formData
                    }
                }
            });

        } catch (error) {
            setErrorMessage("Erro ao conectar com o servidor. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    // Função auxiliar apenas para simular o tempo de resposta de um backend real
    const simularVerificacaoBancoDeDados = (cnpjAtual) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simula que o CPF com final '00' já existe no banco
                const existe = cnpjAtual.endsWith("00");
                resolve(existe);
            }, 1000);
        });
    };

    return {
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
    }
}
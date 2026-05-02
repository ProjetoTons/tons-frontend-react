import { useState, useEffect } from "react";
import { obterErroEmail, obterErroTelefone, validarCNPJ, obterErroRazaoSocial } from "@/shared/lib/dataValidation";
import { aplicarMascaraEmail, aplicarMascaraTelefone, aplicarMascaraCnpj, aplicarMascaraRazaoSocial } from "@/shared/lib/masked";
import { useNavigate, useLocation } from "react-router-dom";
import { consultarCnpj } from "@/entities/empresa/api/empresaApi";

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

    const handleCnpj = async (e) => {
        const cleanCnpj = e.target.value.replace(/\D/g, "");

        if (cleanCnpj.length > 14) return;

        setCnpj(aplicarMascaraCnpj(cleanCnpj));

        if (cleanCnpj.length !== 14) {
            setCnpjValido(false);
            return;
        }

        if (!validarCNPJ(cleanCnpj)) {
            setErrorMessage('CNPJ Inválido');
            setCnpjValido(false);
            return;
        }

        setCnpjValido(true);

        // Autopreenche via BrasilAPI
        setIsLoading(true);
        try {
            const dados = await consultarCnpj(cleanCnpj);
            if (dados) {
                setFormData((prev) => ({
                    razaoSocial: aplicarMascaraRazaoSocial(dados.razaoSocial || prev.razaoSocial),
                    email: dados.email ? aplicarMascaraEmail(dados.email) : prev.email,
                    phone: dados.telefone ? aplicarMascaraTelefone(dados.telefone) : prev.phone,
                }));
            } else {
                setErrorMessage('CNPJ não encontrado na Receita.');
            }
        } catch (err) {
            setErrorMessage('Não foi possível consultar o CNPJ no momento.');
        } finally {
            setIsLoading(false);
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

        // Sem chamada à API neste step. CNPJ + dados da empresa são apenas validados
        // e propagados via router state. O cadastro real (POST /usuarios com cnpj)
        // acontece no último step (RegistrationSuccessFeature).
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
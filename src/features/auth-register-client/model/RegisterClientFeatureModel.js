import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { validarCPF, obterErroComplexidadeSenha, obterErroSenhaIgualConfirmarSenha, obterErroNomeCompleto, obterErroEmail, obterErroTelefone } from "@/shared/lib/dataValidation";
import { aplicarMascaraCpf, aplicarMascaraNomeCompleto, aplicarMascaraEmail, aplicarMascaraTelefone } from "@/shared/lib/masked";

export const useRegisterClient = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const dadosRecuperados = location.state?.dadosPessoais;
    const cpfRecuperado = location.state?.cpfSalvo;
    const dadosEmpresaRecuperados = location.state?.dadosEmpresa;

    const [cpfValido, setCpfValido] = useState(cpfRecuperado ? true : false);
    const [cpf, setCpf] = useState(cpfRecuperado || "");

    const [formData, setFormData] = useState(dadosRecuperados || {
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

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

    const handleCpf = (e) => {

        const cleanCpf = e.target.value.replace(/\D/g, "");

        if (cleanCpf.length > 11) return;

        setCpf(aplicarMascaraCpf(cleanCpf));

        if (cleanCpf.length === 11) {
            if (validarCPF(cleanCpf)) {
                setCpfValido(true);
            } else {
                setErrorMessage('CPF Inválido');
                setCpfValido(false);
            }
        } else {
            setCpfValido(false);
        }
    };

    const handleFullName = (e) => {
        let nomeCompletoAtual = e.target.value;

        let nomeCompletoFormatado = aplicarMascaraNomeCompleto(nomeCompletoAtual);

        setFormData({ ...formData, fullName: nomeCompletoFormatado });
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

    const handlePassword = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrorMessage("");

        const erroFullname = obterErroNomeCompleto(formData.fullName);
        if (erroFullname) {
            setErrorMessage(erroFullname);
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

        const erroSenha = obterErroComplexidadeSenha(formData.password);
        if (erroSenha) {
            setErrorMessage(erroSenha);
            return;
        }

        const erroSenhaConfirmarSenha = obterErroSenhaIgualConfirmarSenha(formData.password, formData.confirmPassword)
        if (erroSenhaConfirmarSenha) {
            setErrorMessage(erroSenhaConfirmarSenha);
            return;
        }

        setIsLoading(true);

        try {
            // 4. Simulação de Chamada à API para verificar CPF existente
            // Quando sua API Java/Spring Boot estiver pronta, você substituirá este bloco
            // por algo como: await http.get(`/api/usuarios/verificar-cpf/${cpfCru}`)

            const cpfJaExiste = await simularVerificacaoBancoDeDados(cpf);

            if (cpfJaExiste) {
                setErrorMessage("Este CPF já está cadastrado em nosso sistema.");
                setIsLoading(false);
                return;
            }

            // Aqui você chamaria o endpoint de POST para criar o usuário.

            navigate("/cadastro/empresa", {
                state: {
                    dadosPessoais: formData,
                    cpfSalvo: cpf,
                    dadosEmpresa: dadosEmpresaRecuperados
                }
            });

        } catch (error) {
            setErrorMessage("Erro ao conectar com o servidor. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    // Função auxiliar apenas para simular o tempo de resposta de um backend real
    const simularVerificacaoBancoDeDados = (cpfAtual) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simula que o CPF com final '00' já existe no banco
                const existe = cpfAtual.endsWith("00");
                resolve(existe);
            }, 1000);
        });
    };

    return {
        cpf,
        cpfValido,
        formData,
        isLoading,
        errorMessage,
        handleCpf,
        handleFullName,
        handleEmail,
        handlePhone,
        handlePassword,
        handleSubmit
    };
};
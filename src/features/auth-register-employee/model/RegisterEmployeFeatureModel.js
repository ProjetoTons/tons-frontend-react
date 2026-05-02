import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obterErroComplexidadeSenha, obterErroNomeCompleto, obterErroEmail, obterErroTelefone } from "@/shared/lib/dataValidation";
import { aplicarMascaraNomeCompleto, aplicarMascaraEmail, aplicarMascaraTelefone } from "@/shared/lib/masked";

export default function useRegisterEmployeFeature() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        telefone: "",
        cargo: [],
        foto: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const opcoesCargo = [
        { value: "ceo", label: "CEO" },
        { value: "design", label: "Design" },
        { value: "logistica", label: "Logística" },
        { value: "operador", label: "Operador de Máquina" }
    ];

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage("");
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleFullName = (e) => {
        let nomeCompletoAtual = e.target.value;
        let nomeCompletoFormatado = aplicarMascaraNomeCompleto(nomeCompletoAtual);
        setFormData((prev) => ({ ...prev, nome: nomeCompletoFormatado }));
    };

    const handleEmail = (e) => {
        let emailAtual = e.target.value;
        let emailAjustado = aplicarMascaraEmail(emailAtual);
        setFormData((prev) => ({ ...prev, email: emailAjustado }));
    };

    const handlePhone = (e) => {
        let cleanTelefone = e.target.value.replace(/\D/g, "");
        if (cleanTelefone.length > 11) return;
        let telefoneFormatado = aplicarMascaraTelefone(cleanTelefone);
        setFormData((prev) => ({ ...prev, telefone: telefoneFormatado }));
    };

    const handlePassword = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
 
    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, foto: e.target.files[0] }));
           console.log(e.target.files[0])
    };

    const handleClear = () => {
        setFormData({
            nome: "",
            email: "",
            senha: "",
            telefone: "",
            cargo: [],
            foto: null,
        });
        setErrorMessage("");
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const erroNome = obterErroNomeCompleto(formData.nome);
        if (erroNome) return setErrorMessage(erroNome);

        const erroEmail = obterErroEmail(formData.email);
        if (erroEmail) return setErrorMessage(erroEmail);

        const erroTelefone = obterErroTelefone(formData.telefone);
        if (erroTelefone) return setErrorMessage(erroTelefone);

        const erroSenha = obterErroComplexidadeSenha(formData.senha);
        if (erroSenha) return setErrorMessage(erroSenha);

        if (!formData.cargo || formData.cargo.length === 0) return setErrorMessage("Por favor, selecione ao menos um cargo para o funcionário.");

        setIsLoading(true);
        
        try {
            console.log("Dados do novo funcionário processados com sucesso:", formData);

            // Aqui futuramente você colocará sua requisição:
            // await api.post('/funcionarios', formData);

            navigate("/funcionario");

        } catch (error) {
            setErrorMessage("Ocorreu um erro ao tentar salvar o funcionário.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        isLoading,
        errorMessage,
        opcoesCargo,
        handleFullName,
        handleEmail,
        handlePhone,
        handlePassword,
        handleChange,
        handleFileChange,
        handleClear,
        handleSubmit
    };
}
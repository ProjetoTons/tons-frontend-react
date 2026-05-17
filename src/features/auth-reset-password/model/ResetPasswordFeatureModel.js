import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { http } from "@/shared/api/http";
import { obterErroComplexidadeSenha, obterErroSenhaIgualConfirmarSenha } from "@/shared/lib/dataValidation";

export const useResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token") || "";

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [token, navigate]);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(""), 8000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleNovaSenha = (e) => setNovaSenha(e.target.value);
    const handleConfirmarSenha = (e) => setConfirmarSenha(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        const erroSenha = obterErroComplexidadeSenha(novaSenha);
        if (erroSenha) {
            setErrorMessage(erroSenha);
            return;
        }

        const erroConfirmar = obterErroSenhaIgualConfirmarSenha(novaSenha, confirmarSenha);
        if (erroConfirmar) {
            setErrorMessage(erroConfirmar);
            return;
        }

        setIsLoading(true);

        try {
            await http.post("/login/reset-senha", { token, novaSenha }, { skipAuth: true });
            setSuccessMessage("Senha redefinida com sucesso!");
        } catch (error) {
            const status = error.response?.status;

            if (!error.response) {
                setErrorMessage("Não foi possível conectar ao servidor.");
            } else if (status === 422) {
                setErrorMessage("Token inválido ou expirado. Solicite um novo link.");
            } else if (status === 404) {
                setErrorMessage("Usuário não encontrado.");
            } else {
                setErrorMessage("Erro ao redefinir senha. Tente novamente.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        novaSenha,
        confirmarSenha,
        isLoading,
        errorMessage,
        successMessage,
        handleNovaSenha,
        handleConfirmarSenha,
        handleSubmit,
    };
};

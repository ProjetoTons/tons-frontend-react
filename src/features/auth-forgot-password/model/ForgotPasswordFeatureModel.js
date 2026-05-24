import { useState, useEffect } from "react";
import { http } from "@/shared/api/http";
import { obterErroEmail } from "@/shared/lib/utils/dataValidation";

export const useForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(""), 8000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        const erroEmail = obterErroEmail(email);
        if (erroEmail) {
            setErrorMessage(erroEmail);
            return;
        }

        setIsLoading(true);

        try {
            await http.post(`/login/esqueci-senha?email=${encodeURIComponent(email)}`, null, { skipAuth: true });
            setSuccessMessage("Se este e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.");
        } catch (error) {
            const status = error.response?.status;

            if (!error.response) {
                setErrorMessage("Não foi possível conectar ao servidor.");
            } else if (status === 404) {
                setSuccessMessage("Se este e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.");
            } else {
                setErrorMessage("Erro ao processar solicitação. Tente novamente.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        isLoading,
        errorMessage,
        successMessage,
        handleEmail,
        handleSubmit,
    };
};

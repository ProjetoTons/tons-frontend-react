import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "@/shared/api/http";
import { setSession } from "@/shared/api/authToken";

export const useLogin = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        senha: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(""), 8000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!formData.email || !formData.senha) {
            setErrorMessage("Preencha e-mail e senha.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await http.post("/login", {
                email: formData.email,
                senha: formData.senha,
            });

            const { token, ...usuario } = response.data;

            setSession({ token, usuario });

            navigate("/portfolio");
        } catch (error) {
            const status = error.response?.status;

            if (!error.response) {
                setErrorMessage("Não foi possível conectar ao servidor.");
            } else if (status === 401 || status === 403) {
                setErrorMessage("E-mail ou senha incorretos.");
            } else {
                setErrorMessage("Erro ao fazer login. Tente novamente.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        isLoading,
        errorMessage,
        handleChange,
        handleSubmit,
    };
};

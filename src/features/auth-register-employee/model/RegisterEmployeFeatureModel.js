import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obterErroComplexidadeSenha, obterErroNomeCompleto, obterErroEmail, obterErroTelefone } from "@/shared/lib/dataValidation";
import { aplicarMascaraNomeCompleto, aplicarMascaraEmail, aplicarMascaraTelefone } from "@/shared/lib/masked";
import { acessoApi, acessoToOption } from "@/entities/employee/api/acessoApi";
import { employeeApi, toFuncionarioRequest } from "@/entities/employee/api/employeeApi";
import { http } from "@/shared/api/http";

export default function useRegisterEmployeFeature() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        telefone: "",
        dataNascimento: "",
        cargo: [],
        foto: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Lista de cargos/acessos vinda do backend (GET /acessos)
    const [opcoesCargo, setOpcoesCargo] = useState([]);
    const [carregandoAcessos, setCarregandoAcessos] = useState(true);

    useEffect(() => {
        let ativo = true;
        setCarregandoAcessos(true);
        acessoApi
            .listar()
            .then((lista) => {
                if (!ativo) return;
                setOpcoesCargo(lista.map(acessoToOption));
            })
            .catch(() => {
                if (!ativo) return;
                setErrorMessage("Não foi possível carregar a lista de cargos.");
            })
            .finally(() => {
                if (ativo) setCarregandoAcessos(false);
            });
        return () => {
            ativo = false;
        };
    }, []);

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
            dataNascimento: "",
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

        if (!formData.dataNascimento) return setErrorMessage("Por favor, informe a data de nascimento.");

        if (!formData.cargo || formData.cargo.length === 0) return setErrorMessage("Por favor, selecione ao menos um cargo para o funcionário.");

        setIsLoading(true);
        console.log("[DEBUG] handleSubmit disparado, payload:", formData);

        try {
            const payload = toFuncionarioRequest(formData);
            await employeeApi.criar(payload);

            // Dispara notificações e aguarda antes de navegar
            const primeiroNome = formData.nome.trim().split(" ")[0];
            const telefoneComDDI = "55" + String(formData.telefone).replace(/\D/g, "");

            console.log("[DEBUG] Enviando notificações para:", formData.email.trim(), telefoneComDDI);

            const results = await Promise.allSettled([
                // E-mail de boas-vindas (rota pública — skipAuth para evitar issue com token)
                http.post("/notificacao/enviar-email", {
                    destinatario: formData.email.trim(),
                    assunto: "Cadastro confirmado - Tons Personalizados",
                    corpo: `Olá ${primeiroNome}!\n\nSeu cadastro na Tons foi confirmado.`,
                }, { skipAuth: true }),
                // WhatsApp de boas-vindas (template confirmar-cadastro)
                http.post(`/whatsapp/confirmar-cadastro/${telefoneComDDI}?nome=${encodeURIComponent(primeiroNome)}`, null, { skipAuth: true }),
            ]);

            results.forEach((r, i) => {
                const canal = i === 0 ? "Email" : "WhatsApp";
                if (r.status === "fulfilled") {
                    console.log(`[DEBUG] ${canal} enviado com sucesso:`, r.value?.data);
                } else {
                    console.error(`[DEBUG] ${canal} FALHOU:`, r.reason?.response?.status, r.reason?.response?.data ?? r.reason?.message);
                }
            });

            navigate("/funcionario");
        } catch (error) {
            const msg = error?.response?.data;
            setErrorMessage(
                typeof msg === "string" && msg.length
                    ? msg
                    : "Ocorreu um erro ao tentar salvar o funcionário."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        isLoading,
        errorMessage,
        opcoesCargo,
        carregandoAcessos,
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
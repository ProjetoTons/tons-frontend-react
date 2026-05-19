import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obterErroComplexidadeSenha, obterErroNomeCompleto, obterErroEmail, obterErroTelefone } from "@/shared/lib/dataValidation";
import { aplicarMascaraNomeCompleto, aplicarMascaraEmail, aplicarMascaraTelefone } from "@/shared/lib/masked";
import { acessoApi, acessoToOption } from "@/entities/employee/api/acessoApi";
import { employeeApi, toFuncionarioRequest } from "@/entities/employee/api/employeeApi";
import { http } from "@/shared/api/http";
import { uploadImagem } from "@/shared/api/cloudnaryUpload";

export default function useRegisterEmployeFeature() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        telefone: "",
        dataNascimento: "",
        cargo: [],
        fotoUrl: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
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

    const handleFileChange = (file) => {
        setFormData((prev) => ({
            ...prev,
            foto: file,
            nomeFotoVisivel: file.name
        }));
        console.log("[DEBUG] Foto guardada no estado:", file.name);
    };

    const handleClear = () => {
        setFormData({
            nome: "",
            email: "",
            senha: "",
            telefone: "",
            dataNascimento: "",
            cargo: [],
            foto: null, // Guardará o objeto File para enviar no final
            nomeFotoVisivel: "", // Guardará o nome para mostrar no ecrã
        });
        setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ==========================================
        // 1. VALIDAÇÕES LOCAIS
        // ==========================================
        const erroNome = obterErroNomeCompleto(formData.nome);
        if (erroNome) return setErrorMessage(erroNome);

        const erroEmail = obterErroEmail(formData.email);
        if (erroEmail) return setErrorMessage(erroEmail);

        const erroTelefone = obterErroTelefone(formData.telefone);
        if (erroTelefone) return setErrorMessage(erroTelefone);

        if (!formData.dataNascimento) return setErrorMessage("Por favor, informe a data de nascimento.");
        if (!formData.cargo || formData.cargo.length === 0) return setErrorMessage("Por favor, selecione ao menos um cargo para o funcionário.");

        // Ativa o estado de carregamento (mostra o spinner no botão, por exemplo)
        setIsLoading(true);
        console.log("[DEBUG] handleSubmit disparado, payload inicial:", formData);

        try {
            let linkDaFotoNaNuvem = null;

            if (formData.foto) {
                // Ativa a animação de spinner APENAS no input da foto
                setIsUploadingPhoto(true); 
                try {
                    console.log("[DEBUG] Iniciando upload da foto para o Cloudinary...");
                    linkDaFotoNaNuvem = await uploadImagem(formData.foto);
                    console.log("[DEBUG] Upload concluído! URL gerada:", linkDaFotoNaNuvem);
                } finally {
                    // Desliga o spinner da foto mal termine (com sucesso ou erro)
                    setIsUploadingPhoto(false); 
                }
            }

            const dadosParaEnviar = {
                ...formData,
                fotoUrl: linkDaFotoNaNuvem // Aqui colocamos o link gerado (ou null se não houver foto)
            };

            // Converte para o formato que o Spring Boot exige
            const payload = toFuncionarioRequest(dadosParaEnviar);

            // Envia para a base de dados
            await employeeApi.criar(payload);

            // ==========================================
            // 4. NOTIFICAÇÕES E REDIRECIONAMENTO (Mantidos)
            // ==========================================
            const primeiroNome = formData.nome.trim().split(" ")[0];
            const telefoneComDDI = "55" + String(formData.telefone).replace(/\D/g, "");

            console.log("[DEBUG] Enviando notificações para:", formData.email.trim(), telefoneComDDI);

            const results = await Promise.allSettled([
                http.post("/notificacao/enviar-email", {
                    destinatario: formData.email.trim(),
                    assunto: "Cadastro confirmado - Tons Personalizados",
                    corpo: `Olá ${primeiroNome}!\n\nSeu cadastro na Tons foi confirmado.`,
                }, { skipAuth: true }),

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

            // Vai para a tela de lista de funcionários
            navigate("/funcionario");

        } catch (error) {
            console.error("[DEBUG] Erro no processo de cadastro:", error);
            const msg = error?.response?.data;
            setErrorMessage(
                typeof msg === "string" && msg.length
                    ? msg
                    : "Ocorreu um erro ao tentar salvar o funcionário."
            );
        } finally {
            // Desativa o carregamento, independentemente de dar erro ou sucesso
            setIsLoading(false);
        }
    };

    return {
        formData,
        isLoading,
        isUploadingPhoto,
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
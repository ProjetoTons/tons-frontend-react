import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { aplicarMascaraEmail, aplicarMascaraTelefone, aplicarMascaraNomeCompleto } from "@/shared/lib/masked";
import { obterErroEmail, obterErroNomeCompleto, obterErroTelefone } from "@/shared/lib/dataValidation";
import { acessoApi, acessoToOption } from "@/entities/employee/api/acessoApi";
import { employeeApi, toFuncionarioRequest } from "@/entities/employee/api/employeeApi";

export default function useEditEmployeeFeature() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [opcoesCargo, setOpcoesCargo] = useState([]);
    const [carregandoAcessos, setCarregandoAcessos] = useState(true);

    // cargo é number[] para casar com SelectForm + acessoToOption (value: id numérico)
    const [formData, setFormData] = useState({
        nome: "",
        cargo: [],
        email: "",
        telefone: "",
        senha: "",
        dataNascimento: "",
        status: "",
        desde: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Carrega acessos + dados do funcionário em paralelo
    useEffect(() => {
        let ativo = true;

        Promise.all([acessoApi.listar(), employeeApi.buscarPorId(id)])
            .then(([acessos, func]) => {
                if (!ativo) return;
                setOpcoesCargo(acessos.map(acessoToOption));

                if (!func) {
                    setErrorMessage("Funcionário não encontrado.");
                    return;
                }

                setFormData((prev) => ({
                    ...prev,
                    nome: func.nome ?? "",
                    email: func.email ?? "", // backend ainda não devolve email (gap conhecido)
                    telefone: func.telefone ?? "",
                    cargo: (func.acessos ?? []).map((a) => a.id),
                    dataNascimento: func.dataNascimento ?? "",
                }));
            })
            .catch(() => {
                if (ativo) setErrorMessage("Falha ao carregar dados do funcionário.");
            })
            .finally(() => {
                if (ativo) setCarregandoAcessos(false);
            });

        return () => {
            ativo = false;
        };
    }, [id]);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(""), 8000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFullName = (e) => {
        const nomeFormatado = aplicarMascaraNomeCompleto(e.target.value);
        setFormData((prev) => ({ ...prev, nome: nomeFormatado }));
    };

    const handleEmail = (e) => {
        const emailAjustado = aplicarMascaraEmail(e.target.value);
        setFormData((prev) => ({ ...prev, email: emailAjustado }));
    };

    const handlePhone = (e) => {
        const cleanTelefone = e.target.value.replace(/\D/g, "");
        if (cleanTelefone.length > 11) return;
        setFormData((prev) => ({ ...prev, telefone: aplicarMascaraTelefone(cleanTelefone) }));
    };

    const handleDeactivate = async () => {
        if (!window.confirm("Tem certeza que deseja excluir este funcionário?")) return;
        setIsLoading(true);
        try {
            await employeeApi.remover(id);
            navigate("/funcionario");
        } catch {
            setErrorMessage("Não foi possível excluir o funcionário.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const erroFullname = obterErroNomeCompleto(formData.nome);
        if (erroFullname) return setErrorMessage(erroFullname);

        const erroTelefone = obterErroTelefone(aplicarMascaraTelefone(formData.telefone));
        if (erroTelefone) return setErrorMessage(erroTelefone);

        const erroEmail = obterErroEmail(formData.email);
        if (erroEmail) return setErrorMessage(erroEmail);

        if (!formData.cargo || formData.cargo.length === 0) {
            return setErrorMessage("Selecione ao menos um cargo.");
        }

        // Limitação do backend: FuncionarioRequestDto exige `senha` no PUT.
        if (!formData.senha) {
            return setErrorMessage(
                "Informe uma nova senha para confirmar a edição (limitação temporária do backend)."
            );
        }

        setIsLoading(true);
        try {
            const payload = toFuncionarioRequest(formData);
            await employeeApi.atualizar(id, payload);
            navigate("/funcionario");
        } catch (error) {
            const msg = error?.response?.data;
            setErrorMessage(
                typeof msg === "string" && msg.length ? msg : "Erro ao atualizar os dados."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return {
        id,
        formData,
        isLoading,
        errorMessage,
        opcoesCargo,
        carregandoAcessos,
        handleFullName,
        handleEmail,
        handleChange,
        handlePhone,
        handleDeactivate,
        handleSubmit
    };
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { aplicarMascaraEmail, aplicarMascaraTelefone } from "@/shared/lib/masked";
import { mockEmployee } from "@/entities/employee/api/mockEmployee.js"
import { obterErroEmail, obterErroNomeCompleto, obterErroTelefone } from "@/shared/lib/dataValidation";

export default function useEditEmployeeFeature() {
    const navigate = useNavigate();
    const { id } = useParams();

    const opcoesCargo = [
        { value: "1", label: "Design" },
        { value: "2", label: "CEO" },
        { value: "3", label: "Logística" },
        { value: "4", label: "Operador" }
    ];

    // Estado inicial
    const [formData, setFormData] = useState({
        nome: "",
        cargo: "",
        email: "",
        telefone: "",
        dataAdmissao: "",
        nivelPermissao: [],
        status: "",
        desde: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Simula a busca no banco pelo ID da URL
        const funcionarioEncontrado = mockEmployee.find(emp => emp.id === id);
        if (funcionarioEncontrado) {
            const cargosParaOFormulario = funcionarioEncontrado.cargo.map(c => String(c.Id));

            setFormData({
                nome: funcionarioEncontrado.nome,
                email: funcionarioEncontrado.email,
                telefone: funcionarioEncontrado.telefone,
                cargo: cargosParaOFormulario,
                dataNascimento: funcionarioEncontrado.dataNascimento,
                avatar: funcionarioEncontrado.avatar
            });
        }
    }, [id]);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage("");
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFullName = (e) => {
        let nomeCompletoAtual = e.target.value;

        let nomeCompletoFormatado = aplicarMascaraNomeCompleto(nomeCompletoAtual);

        setFormData({ ...formData, nome: nomeCompletoFormatado });
    };

    const handleEmail = (e) => {
        let emailAtual = e.target.value;

        let emailAjustado = aplicarMascaraEmail(emailAtual);

        setFormData({ ...formData, email: emailAjustado });
    };

    const handlePhone = (e) => {
        let cleanTelefone = e.target.value.replace(/\D/g, "");
        if (cleanTelefone.length > 11) return;
        setFormData((prev) => ({ ...prev, telefone: aplicarMascaraTelefone(cleanTelefone) }));
    };

    const handleDeactivate = () => {
        console.log("Desativar conta do ID:", id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const erroFullname = obterErroNomeCompleto(formData.nome);
        if (erroFullname) {
            setErrorMessage(erroFullname);
            return;
        }

        const erroTelefone = obterErroTelefone(aplicarMascaraTelefone(formData.telefone));
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


            const cargosParaOBanco = formData.cargo.map(cargoIdString => {
                const cargoInfo = opcoesCargo.find(opt => opt.value === cargoIdString);

                return {
                    Id: cargoIdString,
                    Cargo: cargoInfo ? cargoInfo.label.toUpperCase() : ""
                };
            });

            // Payload final montado perfeitamente!
            const payload = {
                id: id,
                nome: formData.nome,
                email: formData.email,
                telefone: formData.telefone.replace(/\D/g, ""),
                dataNascimento: formData.dataNascimento,
                cargo: cargosParaOBanco
            };

            console.log("JSON pronto para enviar na requisição PUT:", payload);

            navigate("/funcionario");
        } catch (error) {
            setErrorMessage("Erro ao atualizar os dados.");
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
        handleFullName,
        handleEmail,
        handleChange,
        handlePhone,
        handleDeactivate,
        handleSubmit
    };
}
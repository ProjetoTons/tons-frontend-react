import { useState } from "react";

export const useRegisterClient = () => {
    const [cpfValido, setCpfValido] = useState(false);
    const [cpf, setCpf] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const aplicarMascaraCpf = (cleanCpf) => {
        if (cleanCpf.length <= 3) return cleanCpf;
        if (cleanCpf.length <= 6) return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3)}`;
        if (cleanCpf.length <= 9) return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6)}`;
        return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9, 11)}`;
    }

    const validarCPF = (cpfParaValidar) => {
        const numeros = cpfParaValidar.replace(/\D/g, '');
        if (numeros.length !== 11 || /^(\d)\1+$/.test(numeros)) return false;
        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(numeros.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(numeros.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(numeros.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(numeros.substring(10, 11))) return false;
        return true;
    };

    const handleCpf = (e) => {
        const cleanCpf = e.target.value.replace(/\D/g, "");
        if (cleanCpf.length > 11) return;
        setCpf(aplicarMascaraCpf(cleanCpf));

        if (cleanCpf.length === 11) {
            if (validarCPF(cleanCpf)) {
                setCpfValido(true);
            } else {
                alert("CPF Inválido");
                setCpfValido(false);
            }
        } else {
            setCpfValido(false);
        }
    };

    const handleFullName = (e) => {
        let nomeCompletoAtual = e.target.value;
        const nomeCompletoFormatado = nomeCompletoAtual.toLowerCase().replace(/(?:^|\s)\S/g, m => m.toUpperCase());
        setFormData({ ...formData, fullName: nomeCompletoFormatado });
    };

    const handleEmail = (e) => {
        let emailAtual = e.target.value.toLowerCase().trim();
        setFormData({ ...formData, email: emailAtual });
    };

    const handlePhone = (e) => {
        let telefoneAtual = e.target.value.replace(/\D/g, "");
        if (telefoneAtual.length > 11) return;

        let telefoneFormatado = telefoneAtual;
        if (telefoneAtual.length > 2) telefoneFormatado = `(${telefoneAtual.slice(0, 2)}) ${telefoneAtual.slice(2)}`;
        if (telefoneAtual.length > 7) telefoneFormatado = `(${telefoneAtual.slice(0, 2)}) ${telefoneAtual.slice(2, 7)}-${telefoneAtual.slice(7)}`;

        setFormData({ ...formData, phone: telefoneFormatado });
    };

    return {
        cpf,
        cpfValido,
        formData,
        handleCpf,
        handleFullName,
        handleEmail,
        handlePhone
    };
};
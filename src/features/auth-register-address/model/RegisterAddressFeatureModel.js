import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { aplicarMascaraCep } from "@/shared/lib/utils/masked";

export const useRegisterAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const enderecoRecuperado = location.state?.dadosEndereco || {
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  };

  const [formData, setFormData] = useState(enderecoRecuperado);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 8000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Guard: se cair direto nesta rota sem state, volta ao início
  useEffect(() => {
    if (!location.state) {
      navigate("/cadastro/cliente", { replace: true });
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cep") {
      const cleanCep = value.replace(/\D/g, "");
      if (cleanCep.length > 8) return;
      setFormData({ ...formData, cep: aplicarMascaraCep(cleanCep) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const buscarCep = async (cepValue) => {
    const cleanCep = cepValue.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (data.erro) {
        setErrorMessage("CEP não encontrado.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        logradouro: data.logradouro || prev.logradouro,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        estado: data.uf || prev.estado,
      }));
    } catch {
      setErrorMessage("Erro ao consultar CEP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCepBlur = () => {
    buscarCep(formData.cep);
  };

  const buildState = (endereco = null) => ({
    dadosPessoais: location.state?.dadosPessoais,
    cpfSalvo: location.state?.cpfSalvo,
    dadosEmpresa: location.state?.dadosEmpresa,
    dadosEndereco: endereco,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.cep || formData.cep.replace(/\D/g, "").length < 8) {
      setErrorMessage("Informe um CEP válido.");
      return;
    }
    if (!formData.logradouro.trim()) {
      setErrorMessage("Informe o logradouro.");
      return;
    }
    if (!formData.numero.trim()) {
      setErrorMessage("Informe o número.");
      return;
    }
    if (!formData.bairro.trim()) {
      setErrorMessage("Informe o bairro.");
      return;
    }
    if (!formData.cidade.trim()) {
      setErrorMessage("Informe a cidade.");
      return;
    }
    if (!formData.estado.trim()) {
      setErrorMessage("Informe o estado.");
      return;
    }

    navigate("/cadastro/sucesso", { state: buildState(formData) });
  };

  const handlePular = () => {
    navigate("/cadastro/sucesso", { state: buildState(null) });
  };

  const handleVoltar = () => {
    navigate("/cadastro/empresa", {
      state: {
        dadosPessoais: location.state?.dadosPessoais,
        cpfSalvo: location.state?.cpfSalvo,
        dadosEmpresa: location.state?.dadosEmpresa,
      },
    });
  };

  return {
    formData,
    isLoading,
    errorMessage,
    handleChange,
    handleCepBlur,
    handleSubmit,
    handlePular,
    handleVoltar,
  };
};

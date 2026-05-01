
export const validarCPF = (cpfParaValidar) => {

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

export const validarCNPJ = (cnpjParaValidar) => {
    // 1. Prevenção de nulos/vazios
    if (!cnpjParaValidar) return false;

    const numeros = cnpjParaValidar.replace(/\D/g, '');

    // 3. Verifica o tamanho exato de 14 números
    if (numeros.length !== 14) return false;

    // 4. Bloqueia sequências repetidas que passariam na conta (ex: 00000000000000)
    if (/^(\d)\1+$/.test(numeros)) return false;

    // 5. Arrays de "pesos" matemáticos do Módulo 11
    const pesosPrimeiroDigito = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const pesosSegundoDigito = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    // 6. Função interna para não repetir código na hora de multiplicar e somar
    const calcularDigito = (fatiaCnpj, pesos) => {
        let soma = 0;
        for (let i = 0; i < fatiaCnpj.length; i++) {
            soma += parseInt(fatiaCnpj[i], 10) * pesos[i];
        }
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    // 7. Separação das bases numéricas
    const primeiros12Digitos = numeros.substring(0, 12);
    const primeiros13Digitos = numeros.substring(0, 13);

    // Extraímos os dois últimos dígitos originais que o usuário digitou
    const digito1Informado = parseInt(numeros.charAt(12), 10);
    const digito2Informado = parseInt(numeros.charAt(13), 10);

    // 8. O Motor Matemático (Executa as multiplicações)
    const digito1Calculado = calcularDigito(primeiros12Digitos, pesosPrimeiroDigito);
    const digito2Calculado = calcularDigito(primeiros13Digitos, pesosSegundoDigito);

    // 9. A Prova Real: O que calculamos é igual ao que o usuário digitou?
    return digito1Calculado === digito1Informado && digito2Calculado === digito2Informado;
};

export const obterErroComplexidadeSenha = (senhaParaValidar) => {

    if (senhaParaValidar.length < 12) {
        return "A senha deve ter no mínimo 12 caracteres.";
    }

    // 2. Verifica se tem pelo menos uma letra maiúscula (A-Z)
    const temMaiuscula = /[A-Z]/.test(senhaParaValidar);
    if (!temMaiuscula) {
        return "A senha deve conter pelo menos uma letra maiúscula.";
    }

    // 3. Verifica se tem pelo menos um caractere especial
    const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senhaParaValidar);

    if (!temEspecial) {
        return "A senha deve conter pelo menos um caractere especial (ex: @, #, !, $).";
    }

    return null;
};

export const obterErroSenhaIgualConfirmarSenha = (senha, ConfirmarSenha) => {

    if (senha !== ConfirmarSenha) {
        return "As senhas não coincidem.";
    }

    if (!senha || !ConfirmarSenha) {
        return "As senhas não podem ficar em branco.";
    }

    return null;

};

export const obterErroNomeCompleto = (nomeParaValidar) => {

    if (!nomeParaValidar.trim().includes(" ")) {
        return "Por favor, insira seu nome completo (nome e sobrenome).";
    }

    return null;

};

export const obterErroRazaoSocial = (razaoSocial) => {
    // 1. Verifica se está vazio ou só tem espaços
    if (!razaoSocial || razaoSocial.trim().length === 0) {
        return "A Razão Social é obrigatória.";
    }

    const textoLimpo = razaoSocial.trim();

    // 2. Tamanho mínimo coerente (ex: "J&J" tem 3, mas a maioria tem mais de 4)
    if (textoLimpo.length < 4) {
        return "A Razão Social informada é muito curta.";
    }

    // 3. Verifica se tem pelo menos uma letra (impede coisas como "123456" ou "!!!")
    // O trecho [a-zA-ZÀ-ÿ] garante que aceitamos letras com acentos e cedilha
    const temLetras = /[a-zA-ZÀ-ÿ]/.test(textoLimpo);
    if (!temLetras) {
        return "A Razão Social deve conter palavras válidas.";
    }

    // 4. (Opcional, mas recomendado) Força ter pelo menos duas palavras separadas por espaço
    if (!textoLimpo.includes(" ")) {
        return "Informe a Razão Social completa (inclua a natureza jurídica, ex: LTDA, S.A.).";
    }

    // Se passou em todos os testes, retorna null (sem erros)
    return null;
};

export const obterErroEmail = (emailParaValidar) => {

    if (!emailParaValidar.includes("@") || !emailParaValidar.includes(".")) {
        return "Por favor, insira um e-mail válido.";
    }

    return null;
};

export const obterErroTelefone = (telphoneParaValidar) => {

    if (!telphoneParaValidar || telphoneParaValidar.length < 14) {
        return "Por favor, preencha o telefone corretamente.";
    }

    const dddsValidosBrasil = [
        11, 12, 13, 14, 15, 16, 17, 18, 19, // SP
        21, 22, 24, 27, 28,                 // RJ, ES
        31, 32, 33, 34, 35, 37, 38,         // MG
        41, 42, 43, 44, 45, 46,             // PR
        47, 48, 49,                         // SC
        51, 53, 54, 55,                     // RS
        61, 62, 63, 64, 65, 66, 67, 68, 69, // CO e Norte
        71, 73, 74, 75, 77, 79,             // BA, SE
        81, 82, 83, 84, 85, 86, 87, 88, 89, // NE
        91, 92, 93, 94, 95, 96, 97, 98, 99  // Norte
    ];

    const numeroSemMascara = telphoneParaValidar.replace(/\D/g, "");

    const ddd = parseInt(numeroSemMascara.substring(0, 2), 10);
    if (!dddsValidosBrasil.includes(ddd)) {
        return "O DDD informado não existe no Brasil.";
    }

    if (numeroSemMascara.charAt(2) !== "9") {
        return "O número de celular deve começar com o dígito 9.";
    }

    return null;
};

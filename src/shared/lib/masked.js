
export const aplicarMascaraCpf = (cleanCpf) => {

    cleanCpf = cleanCpf.replace(/\D/g, "");

    if (cleanCpf.length <= 3) return cleanCpf;

    if (cleanCpf.length <= 6) return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3)}`;

    if (cleanCpf.length <= 9) return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6)}`;

    return `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9, 11)}`;
}

export const aplicarMascaraNomeCompleto = (cleanNomeCompleto) => {

    return cleanNomeCompleto.toLowerCase().replace(/(?:^|\s)\S/g, m => m.toUpperCase());
}

export const aplicarMascaraEmail = (cleanEmail) => {

    return cleanEmail.toLowerCase().trim();
}

export const aplicarMascaraRazaoSocial = (cleanRazaoSocial) => {
    if (!cleanRazaoSocial) return "";
    
    // Converte tudo para maiúsculo e remove espaços duplos
    return cleanRazaoSocial.toUpperCase().replace(/\s{2,}/g, ' ');
};

export const aplicarMascaraTelefone = (cleanTelefone) => {

    cleanTelefone = cleanTelefone.replace(/\D/g, "");

    if (cleanTelefone.length > 7) return `(${cleanTelefone.slice(0, 2)}) ${cleanTelefone.slice(2, 7)}-${cleanTelefone.slice(7)}`;
    if (cleanTelefone.length > 2) return `(${cleanTelefone.slice(0, 2)}) ${cleanTelefone.slice(2)}`;

    return cleanTelefone;
}

export const aplicarMascaraCnpj = (cleanCnpj) => {

    cleanCnpj = cleanCnpj.replace(/\D/g, "");

    if (cleanCnpj.length <= 2) return cleanCnpj;

    if (cleanCnpj.length <= 5) return `${cleanCnpj.slice(0,2)}.${cleanCnpj.slice(2)}`;

    if (cleanCnpj.length <= 8) return `${cleanCnpj.slice(0, 2)}.${cleanCnpj.slice(2, 5)}.${cleanCnpj.slice(5,8)}`;

    if (cleanCnpj.length <= 12) return `${cleanCnpj.slice(0, 2)}.${cleanCnpj.slice(2, 5)}.${cleanCnpj.slice(5,8)}/${cleanCnpj.slice(8,12)}`;

    return `${cleanCnpj.slice(0, 2)}.${cleanCnpj.slice(2, 5)}.${cleanCnpj.slice(5,8)}/${cleanCnpj.slice(8,12)}-${cleanCnpj.slice(12,14)}`;
}

export const aplicarMascaraData = (dataIso) => {
    if (!dataIso) return "";
    const partes = dataIso.split("-");
    if (partes.length !== 3) return dataIso;
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`; 
}

/**
 * Remove qualquer caractere não-numérico de uma string.
 * Inverso das funções `aplicarMascara*` — usado antes de enviar dados ao backend,
 * que espera CPF, CNPJ e telefone como dígitos puros.
 *
 * @param {string | null | undefined} valor
 * @returns {string} string contendo apenas dígitos (vazia se entrada for falsy)
 *
 * @example
 * apenasDigitos("(11) 99999-8888")   // "11999998888"
 * apenasDigitos("123.456.789-01")    // "12345678901"
 * apenasDigitos(null)                // ""
 */
export const apenasDigitos = (valor) => (valor ?? "").replace(/\D/g, "");

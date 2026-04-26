
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

export const aplicarMascaraTelefone = (cleanTelefone) => {
    
    cleanTelefone = cleanTelefone.replace(/\D/g, "");

    if (cleanTelefone.length > 7) return `(${cleanTelefone.slice(0, 2)}) ${cleanTelefone.slice(2, 7)}-${cleanTelefone.slice(7)}`;
    if (cleanTelefone.length > 2) return `(${cleanTelefone.slice(0, 2)}) ${cleanTelefone.slice(2)}`;

    return cleanTelefone;
}


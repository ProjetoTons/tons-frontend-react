/**
 * Funções para formatação de datas
 */

/**
 * Formata data ISO (2026-05-26T14:00:00) para formato brasileiro (DD/MM/YYYY)
 * @param {string} dataISO - Data em formato ISO
 * @returns {string} - Data formatada em DD/MM/YYYY
 */
export function formatarDataBR(dataISO) {
  if (!dataISO) return "-";

  try {
    // Extrai apenas a data (2026-05-26 de 2026-05-26T14:00:00)
    // Isso evita problemas com fuso horário
    const dataParte = dataISO.split('T')[0];
    const [ano, mes, dia] = dataParte.split('-');
    
    return `${dia}/${mes}/${ano}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return dataISO;
  }
}

/**
 * Formata data ISO com hora (2026-05-26T14:00:00) para formato brasileiro (DD/MM/YYYY HH:mm)
 * @param {string} dataISO - Data em formato ISO
 * @returns {string} - Data e hora formatadas em DD/MM/YYYY HH:mm
 */
export function formatarDataHoraBR(dataISO) {
  if (!dataISO) return "-";

  try {
    // Separa data e hora
    const [dataParte, horaParte] = dataISO.split('T');
    const [ano, mes, dia] = dataParte.split('-');
    const [hora, minuto] = horaParte.split(':');

    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  } catch (error) {
    console.error("Erro ao formatar data com hora:", error);
    return dataISO;
  }
}

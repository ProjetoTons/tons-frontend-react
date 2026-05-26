export const obterDatasDoFiltro = (filtro, dataInicioCustom) => {
    const hoje = new Date();
    let startDate = new Date();
    let endDate = new Date(hoje);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (filtro === 'ano') {
        startDate = new Date(hoje.getFullYear(), 0, 1);
    } else if (filtro === 'mes') {
        startDate = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    } else if (filtro === 'custom' && dataInicioCustom) {
        startDate = new Date(`${dataInicioCustom}T00:00:00`);
    }

    return { startDate, endDate };
};
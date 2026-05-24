export const obterDatasDoFiltro = (filtro) => {
    const hoje = new Date();
    let startDate = new Date();
    let endDate = new Date(hoje);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (filtro === 'ano') {
        startDate = new Date(hoje.getFullYear(), 0, 1);
    } else if (filtro === 'mes') {
        startDate = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    } else if (filtro === 'semana') {
        startDate.setDate(hoje.getDate() - 7);
    }

    return { startDate, endDate };
};
import { useSearchParams } from 'react-router-dom';

export function useDashboardFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const periodo = searchParams.get('periodo') || 'mes';
  const dataInicio = searchParams.get('dataInicio') || null;

  const setPeriodo = (novoPeriodo) => {
    const params = new URLSearchParams(searchParams);
    params.set('periodo', novoPeriodo);
    if (novoPeriodo !== 'custom') {
      params.delete('dataInicio');
    }
    setSearchParams(params, { replace: true });
  };

  const setDataInicio = (novaData) => {
    const params = new URLSearchParams(searchParams);
    if (novaData) {
      params.set('dataInicio', novaData);
      params.set('periodo', 'custom');
    } else {
      params.delete('dataInicio');
      params.set('periodo', 'mes'); // Volta para o padrão ao limpar
    }
    setSearchParams(params, { replace: true });
  };

  return { periodo, setPeriodo, dataInicio, setDataInicio };
}
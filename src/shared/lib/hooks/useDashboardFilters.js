import { useSearchParams } from 'react-router-dom';

export function useDashboardFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const periodo = searchParams.get('periodo') || 'mes';

  const setPeriodo = (novoPeriodo) => {
    setSearchParams(
      (parametrosAtuais) => {
        parametrosAtuais.set('periodo', novoPeriodo);
        return parametrosAtuais;
      },
      { replace: true } 
    );
  };

  return { periodo, setPeriodo };
}
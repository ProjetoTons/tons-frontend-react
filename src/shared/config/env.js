const configuredApiUrl = import.meta.env.VITE_API_URL;
const apiBaseUrl = configuredApiUrl.replace(/\/+$/, '');

export const env = {
  apiUrl: apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`,
  cnpjGrafica: (import.meta.env.VITE_CNPJ_GRAFICA ?? '').replace(/\D/g, ''),
}

export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  cnpjGrafica: (import.meta.env.VITE_CNPJ_GRAFICA ?? '').replace(/\D/g, ''),
}

import axios from 'axios'
import { http } from '@/shared/api/http'

/**
 * Consulta dados públicos de um CNPJ na BrasilAPI.
 * Endpoint público, sem autenticação. Não usa o axios `http` interno
 * para não passar pelo interceptor (baseURL/Bearer).
 *
 * @param {string} cnpj  Apenas dígitos (14)
 * @returns {Promise<{
 *   razaoSocial: string,
 *   nomeFantasia: string,
 *   email: string,
 *   telefone: string,  // apenas dígitos (DDD + número)
 * } | null>} `null` se 404 (CNPJ não encontrado).
 */
export async function consultarCnpj(cnpj) {
  try {
    const { data } = await axios.get(
      `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
      { timeout: 10000 },
    )

    const ddd = data.ddd_telefone_1?.replace(/\D/g, '') ?? ''

    return {
      razaoSocial: data.razao_social ?? '',
      nomeFantasia: data.nome_fantasia ?? '',
      email: data.email ?? '',
      telefone: ddd,
    }
  } catch (error) {
    if (error.response?.status === 404) return null
    throw error
  }
}

/**
 * Cadastra uma empresa no backend (POST /empresas — rota pública).
 * Idempotente do lado do front: ignora 409 (já existe).
 *
 * @param {Object} payload
 * @param {string} payload.cnpj         Apenas dígitos (14)
 * @param {string} payload.razaoSocial
 * @param {string} [payload.nomeFantasia]
 * @param {string} [payload.email]
 * @param {string} [payload.telefone]   Apenas dígitos
 * @returns {Promise<{ created: boolean, id: number|null }>}
 */
export async function cadastrarEmpresa(payload) {
  try {
    const response = await http.post('/empresas', payload, { skipAuth: true })
    return { created: true, id: response.data.id }
  } catch (error) {
    // Empresa já existe — tenta extrair o id do response de conflito
    if (error.response?.status === 409) {
      const id = error.response.data?.id ?? null
      return { created: false, id }
    }
    throw error
  }
}


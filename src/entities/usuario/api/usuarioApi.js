import { http } from '@/shared/api/http'

/**
 * Cadastra um usuário cliente (pessoa física).
 * Endpoint público — não exige token.
 *
 * @param {Object} payload
 * @param {string} payload.nome       Nome completo
 * @param {string} payload.cpf        Apenas dígitos (11)
 * @param {string} payload.email
 * @param {string} payload.telefone   Apenas dígitos (11) — DDD + número
 * @param {string} payload.senha
 * @param {string} [payload.cnpj]     Opcional — vincula a uma Empresa existente
 * @returns {Promise<{ status: number, message: string }>}
 */
export async function cadastrarUsuario(payload) {
  // Cadastro é rota pública. skipAuth evita que um token velho/inválido em
  // sessionStorage faça o filtro JWT do backend tentar carregar um usuário
  // inexistente (resultando em 500).
  const response = await http.post('/usuarios', payload, { skipAuth: true })
  return { status: response.status, message: response.data }
}


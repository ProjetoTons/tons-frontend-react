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
 * @param {number} [payload.empresaId] Opcional — ID da empresa para vincular o usuário
 * @returns {Promise<{ status: number, message: string }>}
 */
export async function cadastrarUsuario(payload) {
  // Cadastro é rota pública. skipAuth evita que um token velho/inválido em
  // sessionStorage faça o filtro JWT do backend tentar carregar um usuário
  // inexistente (resultando em 500).
  const response = await http.post('/usuarios', payload, { skipAuth: true })
  return { status: response.status, message: response.data }
}

/**
 * Busca dados completos do usuário pelo CPF.
 * Retorna: { nome, email, cpf, telefone, dataNascimento, empresa, endereco }
 */
export async function buscarUsuarioPorCpf(cpf) {
  const { data } = await http.get(`/usuarios/cpf/${cpf}`)
  return data
}

/**
 * Busca dados completos do usuário pelo ID.
 * GET /usuarios/{id}
 * Retorna: { nome, email, cpf, telefone, dataNascimento, empresa, endereco }
 */
export async function buscarUsuarioPorId(id) {
  const { data } = await http.get(`/usuarios/${id}`)
  return data
}

/**
 * Atualiza dados do usuário (nome, email, telefone, endereco, idEmpresa).
 * PUT /usuarios/{id}
 */
export async function atualizarUsuario(id, payload) {
  const { data } = await http.put(`/usuarios/${id}`, payload)
  return data
}

/**
 * Busca o endereço do usuário pelo ID.
 * GET /usuarios/{id}/endereco
 */
export async function buscarEnderecoUsuario(id) {
  const { data } = await http.get(`/usuarios/${id}/endereco`)
  return data
}

/**
 * Cadastra ou atualiza endereço do usuário.
 * POST /usuarios/{id}/endereco  (cria)
 * PUT  /usuarios/{id}/endereco  (atualiza)
 */
export async function salvarEnderecoUsuario(id, enderecoDto, existeEndereco = false) {
  const method = existeEndereco ? 'put' : 'post'
  const { data } = await http[method](`/usuarios/${id}/endereco`, enderecoDto)
  return data
}

/**
 * Altera a senha do usuário informando a senha atual.
 * PATCH /usuarios/{id}/senha
 */
export async function alterarSenhaUsuario(id, senhaAtual, novaSenha) {
  await http.patch(`/usuarios/${id}/senha`, { senhaAtual, novaSenha })
}


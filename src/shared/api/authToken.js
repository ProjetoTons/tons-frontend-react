const TOKEN_KEY = 'tons:authToken'
const USER_KEY = 'tons:usuario'

// MOCK DATA PARA DESENVOLVIMENTO - Descomente a linha abaixo para simular um usuário cadastrado
const MOCK_MODE = import.meta.env.DEV // Ativa apenas em desenvolvimento

// Função para inicializar mock de usuário
export function initMockUser() {
  if (MOCK_MODE && !sessionStorage.getItem(USER_KEY)) {
    setSession({
      token: 'mock-token-para-desenvolvimento',
      usuario: {
        id: 1,
        nome: 'João Silva Santos',
        email: 'joao@example.com',
        cpf: '123.456.789-10',
        telefone: '(11) 98765-4321',
        cnpj: '12.345.678/0001-90'
      }
    })
  }
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setSession({ token, usuario }) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token)
  if (usuario) sessionStorage.setItem(USER_KEY, JSON.stringify(usuario))
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

export function getUsuario() {
  const raw = sessionStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

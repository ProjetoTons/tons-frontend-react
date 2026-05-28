const TOKEN_KEY = 'tons:authToken'
const USER_KEY = 'tons:usuario'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setSession({ token, usuario }) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  if (usuario) localStorage.setItem(USER_KEY, JSON.stringify(usuario))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getUsuario() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

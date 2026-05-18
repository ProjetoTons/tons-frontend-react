const TOKEN_KEY = 'tons:authToken'
const USER_KEY = 'tons:usuario'

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

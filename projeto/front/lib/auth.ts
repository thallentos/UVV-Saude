export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("usuario")
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "tipo_usuario=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  window.location.href = "/login"
}

export function getToken(): string {
  return localStorage.getItem("token") ?? ""
}

export function getUsuario() {
  const raw = localStorage.getItem("usuario")
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
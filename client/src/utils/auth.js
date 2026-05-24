const TOKEN_KEY = "isaii_token"
const USER_KEY = "isaii_user"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  const rawUser = localStorage.getItem(USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch (error) {
    clearAuth()
    return null
  }
}

export function setAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isAuthenticated() {
  return Boolean(getToken() && getUser())
}

export function hasRole(allowedRoles) {
  const user = getUser()
  return Boolean(user && allowedRoles.includes(user.role))
}

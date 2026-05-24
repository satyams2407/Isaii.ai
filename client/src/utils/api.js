import { clearAuth, getToken } from "./auth"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

export async function apiRequest(path, options = {}) {
  const token = getToken()
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : {}

  if (response.status === 401) {
    clearAuth()
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed")
  }

  return data
}

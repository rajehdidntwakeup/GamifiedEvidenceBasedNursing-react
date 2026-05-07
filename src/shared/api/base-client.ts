/**
 * API configuration and utility functions for backend integration.
 * Base URL: http://localhost:8080
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

/**
 * Get the auth token from localStorage
 */
function getToken(): string | null {
  return window.sessionStorage.getItem('token')
}

/**
 * Clear auth token from localStorage
 */
function clearToken(): void {
  window.sessionStorage.removeItem('token')
}

/**
 * Generic fetch wrapper with error handling.
 * All paths should be absolute (starting with /) as they will be prepended with API_BASE_URL.
 */
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  // Remove leading slash from endpoint if present to avoid double slashes
  const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${API_BASE_URL}${cleanPath}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `HTTP ${response.status}`)
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>
  }

  return response.text() as Promise<T>
}

/**
 * Clear all stored auth data (for logout)
 */
export function clearAuth(): void {
  clearToken()
}

/**
 * Store auth token in localStorage
 */
export function setToken(token: string): void {
  window.sessionStorage.setItem('token', token)
}

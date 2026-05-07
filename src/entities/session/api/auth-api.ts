import { fetchApi } from '@/shared/api/base-client.ts'

export interface AuthResponse {
  token: string
  isAdmin: boolean
}

export interface Credentials {
  username: string
  password: string
}

function normalizeAuth(raw: unknown): AuthResponse {
  const r = raw as Record<string, unknown>
  return {
    token: String(r.token ?? ''),
    isAdmin: Boolean(r.isAdmin ?? r.admin ?? false),
  }
}

// Public endpoints (no JWT required) - /auth/* paths
export const authApi = {
  /**
   * Register a new user
   * Path: /auth/register
   */
  register: async (credentials: Credentials) => {
    const raw = await fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return normalizeAuth(raw)
  },

  /**
   * Login as a user
   * Path: /auth/login
   */
  login: async (credentials: Credentials) => {
    const raw = await fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return normalizeAuth(raw)
  },

  /**
   * Authenticate an existing user (alias for login)
   * Path: /auth/authenticate
   */
  authenticate: async (credentials: Credentials) => {
    const raw = await fetchApi<AuthResponse>('/auth/authenticate', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return normalizeAuth(raw)
  },
}

// Admin-only endpoints - /api/auth/* paths
export const apiAuthApi = {
  /**
   * Register a new user (API prefix)
   * Path: /api/auth/register
   */
  register: async (credentials: Credentials) => {
    const raw = await fetchApi<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return normalizeAuth(raw)
  },

  /**
   * Login as a user (API prefix)
   * Path: /api/auth/login
   */
  login: async (credentials: Credentials) => {
    const raw = await fetchApi<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return normalizeAuth(raw)
  },

  /**
   * Authenticate a user (API prefix)
   * Path: /api/auth/authenticate
   */
  authenticate: async (credentials: Credentials) => {
    const raw = await fetchApi<AuthResponse>('/api/auth/authenticate', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return normalizeAuth(raw)
  },
}

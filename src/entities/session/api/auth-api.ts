import { fetchApi } from '@/shared/api/base-client.ts'

export interface AuthResponse {
  token: string
  admin: boolean
}

export interface Credentials {
  username: string
  password: string
}

// Public endpoints (no JWT required) - /auth/* paths
export const authApi = {
  /**
   * Register a new user
   * Path: /auth/register
   */
  register: (credentials: Credentials) =>
    fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  /**
   * Login as a user
   * Path: /auth/login
   */
  login: (credentials: Credentials) =>
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  /**
   * Authenticate an existing user (alias for login)
   * Path: /auth/authenticate
   */
  authenticate: (credentials: Credentials) =>
    fetchApi<AuthResponse>('/auth/authenticate', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
}

// Admin-only endpoints - /api/auth/* paths
export const apiAuthApi = {
  /**
   * Register a new user (API prefix)
   * Path: /api/auth/register
   */
  register: (credentials: Credentials) =>
    fetchApi<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  /**
   * Login as a user (API prefix)
   * Path: /api/auth/login
   */
  login: (credentials: Credentials) =>
    fetchApi<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  /**
   * Authenticate a user (API prefix)
   * Path: /api/auth/authenticate
   */
  authenticate: (credentials: Credentials) =>
    fetchApi<AuthResponse>('/api/auth/authenticate', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
}

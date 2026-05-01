/**
 * Session Context for managing auth state across the app.
 * Provides login, register, logout functionality with JWT token management.
 */

import React, { createContext, useContext, useState, useCallback } from 'react'

import { authApi, type AuthResponse } from '../api/auth-api'

interface SessionContextType {
  user: AuthResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const stored = sessionStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.login({ username, password })
      setUser(response)
      sessionStorage.setItem('token', response.token)
      sessionStorage.setItem('user', JSON.stringify(response))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.register({ username, password })
      setUser(response)
      sessionStorage.setItem('token', response.token)
      sessionStorage.setItem('user', JSON.stringify(response))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <SessionContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

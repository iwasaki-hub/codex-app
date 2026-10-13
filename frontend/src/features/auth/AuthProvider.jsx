import { useCallback, useMemo, useState } from 'react'
import { authApi } from './authApi.js'
import { AuthContext } from './AuthContext.js'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)

  const login = useCallback(async (credentials) => {
    const nextSession = await authApi.login(credentials)
    setSession(nextSession)
  }, [])

  const register = useCallback(async (details) => {
    const nextSession = await authApi.register(details)
    setSession(nextSession)
  }, [])

  const logout = useCallback(() => {
    setSession(null)
  }, [])

  const value = useMemo(() => ({
    user: session?.user ?? null,
    token: session?.token ?? null,
    login,
    register,
    logout,
  }), [session, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

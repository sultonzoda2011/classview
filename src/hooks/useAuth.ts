import { jwtDecode } from 'jwt-decode'
import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { authStorage } from '../lib/authStorage'
import type { CustomJwtPayload } from '../types/jwt'

const TOKEN_KEY = 'token'
const TOKEN_EVENT = 'app:token-changed'
const listeners = new Set<() => void>()

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  window.addEventListener(TOKEN_EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener(TOKEN_EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}
const getSnapshot = () => authStorage.get(TOKEN_KEY) ?? ''
const notifyChanged = () => window.dispatchEvent(new Event(TOKEN_EVENT))

/** Сохраняет токен и уведомляет все useAuth() в приложении (без перезагрузки страницы). */
export const setAuthToken = (token: string) => {
  authStorage.set(TOKEN_KEY, token)
  notifyChanged()
}

export const clearAuthToken = () => {
  authStorage.remove(TOKEN_KEY)
  notifyChanged()
}

/**
 * При старте приложения (особенно в Capacitor) подтягивает токен из нативного
 * хранилища поверх localStorage — на случай, если localStorage был очищен,
 * а нативное хранилище пережило перезапуск/убийство процесса.
 */
export const hydrateAuthToken = () => authStorage.hydrate(TOKEN_KEY, notifyChanged)

/** Декодирует JWT один раз на изменение токена; просроченный или битый токен = разлогин. */
export const useAuth = () => {
  const rawToken = useSyncExternalStore(subscribe, getSnapshot)

  const info = useMemo<CustomJwtPayload | null>(() => {
    if (!rawToken) return null
    try {
      const decoded = jwtDecode<CustomJwtPayload>(rawToken)
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        clearAuthToken()
        return null
      }
      return decoded
    } catch {
      clearAuthToken()
      return null
    }
  }, [rawToken])

  const logout = useCallback(() => clearAuthToken(), [])

  return {
    token: info ? rawToken : null,
    info,
    isAuthenticated: !!info,
    mustChangePassword: !!info?.mustChangePw,
    logout,
  }
}

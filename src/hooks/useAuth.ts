import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { CustomJwtPayload } from '../types/jwt'

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
const getSnapshot = () => Cookies.get('token') ?? ''

/** Сохраняет токен и уведомляет все useAuth() в приложении (без перезагрузки страницы). */
export const setAuthToken = (token: string) => {
  Cookies.set('token', token, { sameSite: 'strict', secure: window.location.protocol === 'https:' })
  window.dispatchEvent(new Event(TOKEN_EVENT))
}

export const clearAuthToken = () => {
  Cookies.remove('token')
  window.dispatchEvent(new Event(TOKEN_EVENT))
}

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

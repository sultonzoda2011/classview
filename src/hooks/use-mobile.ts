import { useSyncExternalStore } from 'react'

const MOBILE_QUERY = '(max-width: 767px)'

const subscribe = (callback: () => void) => {
  if (typeof window.matchMedia !== 'function') return () => {}
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

const getSnapshot = () => (typeof window.matchMedia === 'function' ? window.matchMedia(MOBILE_QUERY).matches : false)

/** true на экранах уже `md` (768px) — совпадает с брейкпоинтом Tailwind. */
export const useIsMobile = () => useSyncExternalStore(subscribe, getSnapshot, () => false)

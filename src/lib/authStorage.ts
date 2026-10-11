import { Preferences } from '@capacitor/preferences'

/**
 * Хранилище токена для web и Capacitor.
 *
 * Раньше токен хранился в cookie (js-cookie). В нативном Android-WebView
 * Capacitor это ненадёжно: cookie-файл может быть очищен системой при нехватке
 * памяти/при убийстве процесса приложения, из-за чего пользователь вылетал
 * из аккаунта без видимой причины.
 *
 * Теперь: localStorage — быстрый синхронный кэш для рендера,
 * Preferences (нативное хранилище — SharedPreferences на Android) — источник
 * истины на устройстве, переживающий убийство процесса. На вебе Preferences
 * сам падает обратно на localStorage, так что дублирование безопасно.
 */
const isNative = () => typeof window !== 'undefined' && !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.()

export const authStorage = {
  get(key: string): string | null {
    return localStorage.getItem(key)
  },

  set(key: string, value: string) {
    localStorage.setItem(key, value)
    if (isNative()) void Preferences.set({ key, value })
  },

  remove(key: string) {
    localStorage.removeItem(key)
    if (isNative()) void Preferences.remove({ key })
  },

  /**
   * Подтягивает значение из нативного хранилища поверх localStorage при старте
   * приложения — на случай, если localStorage уже потерял токен, а Preferences — нет.
   * Вызывать один раз при старте (main.tsx), до или сразу после первого рендера.
   */
  async hydrate(key: string, onChanged: () => void) {
    if (!isNative()) return
    try {
      const { value } = await Preferences.get({ key })
      if (value && value !== localStorage.getItem(key)) {
        localStorage.setItem(key, value)
        onChanged()
      }
    } catch {
      // нативное хранилище недоступно — остаёмся на localStorage
    }
  },
}

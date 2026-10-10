import { toast } from 'sonner'

/** Единая точка показа уведомлений (поверх sonner), чтобы не звать toast напрямую по всему приложению. */
export const notify = {
  success: (message?: string) => message && toast.success(message),
  error: (message?: string) => toast.error(message || 'Произошла ошибка'),
}

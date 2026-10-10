/** "HH:mm" или "HH:mm:ss" -> минуты от полуночи; null, если формат неверный */
export const toMinutes = (value?: string | null): number | null => {
  const m = value ? /^(\d{2}):(\d{2})/.exec(value) : null
  return m ? Number(m[1]) * 60 + Number(m[2]) : null
}

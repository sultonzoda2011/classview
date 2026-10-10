import { useEffect, useState } from 'react'

const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches

const getInitial = () => {
  const stored = localStorage.getItem('theme')
  return stored === 'dark' || (!stored && prefersDark())
}

const apply = (dark: boolean) => {
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

/** Общий dark-mode переключатель: состояние и применение к <html> в одном месте. */
export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(getInitial)

  useEffect(() => {
    apply(isDark)
  }, [isDark])

  return { isDark, toggle: () => setIsDark((v) => !v) }
}

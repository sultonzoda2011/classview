import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDarkMode } from '../hooks/useDarkMode'
import { Button } from './ui/button'

/** Единая кнопка переключения темы — используется в логине и хедере. */
const ThemeToggle = () => {
  const { t } = useTranslation()
  const { isDark, toggle } = useDarkMode()
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? t('header.themes.dark') : t('header.themes.light')}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}

export default ThemeToggle

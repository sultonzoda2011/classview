import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import LanguageSelect from './language-select'
import ThemeToggle from './theme-toggle'
import UserMenu from './user-menu'

const Header = () => {
  const { t } = useTranslation()
  const location = useLocation()

  const formatPathname = (pathname: string) => {
    if (!pathname || pathname === '/') return t('overview.title')
    return pathname
      .slice(1)
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }

  return (
    <header className="w-full backdrop-blur-md bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between shadow-md border-b border-white/20 dark:border-gray-700 sticky top-0 z-30">
      <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight truncate">
        {t('navigation.welcome')} {formatPathname(location.pathname)}
      </h1>
      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSelect />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}

export default Header

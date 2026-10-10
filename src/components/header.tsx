import { useTranslation } from 'react-i18next'
import Breadcrumbs from './breadcrumbs'
import LanguageSelect from './language-select'
import ThemeToggle from './theme-toggle'
import UserMenu from './user-menu'

const Header = () => {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between gap-4 border-b bg-background/95 px-4 py-3 backdrop-blur sm:px-6 md:px-8">
      <div className="min-w-0 space-y-1">
        <p className="hidden text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground sm:block">{t('navigation.welcome')}</p>
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSelect />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}

export default Header

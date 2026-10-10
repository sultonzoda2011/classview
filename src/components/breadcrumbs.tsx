import { ChevronRight, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../lib/utils'

const Breadcrumbs = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const titleByPath: Record<string, string> = {
    '/': t('overview.title'),
    '/centers': t('centers.title'),
    '/classrooms': t('classrooms.title'),
    '/users': t('users.title'),
    '/streams': t('navigation.streams'),
    '/profile': t('common.profile'),
  }
  const currentTitle = titleByPath[pathname] ?? pathname.split('/').filter(Boolean).pop()?.replaceAll('-', ' ') ?? t('overview.title')

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link to="/" className="rounded-md p-1 transition-colors hover:bg-muted hover:text-foreground" aria-label={t('overview.title')}>
        <Home data-icon="inline-start" />
      </Link>
      <ChevronRight aria-hidden="true" className="size-4" />
      <span className={cn('font-medium text-foreground', pathname === '/' && 'sr-only')}>{currentTitle}</span>
    </nav>
  )
}

export default Breadcrumbs

/* eslint-disable react-refresh/only-export-components */
export { Breadcrumbs }
/* eslint-enable react-refresh/only-export-components */

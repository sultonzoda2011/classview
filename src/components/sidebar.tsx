import { Building, GraduationCap, Grid, Users, Video } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../lib/utils'

const Sidebar = () => {
  const location = useLocation()
  const { info } = useAuth()
  const { t } = useTranslation()

  const isUser = info?.role === 'User'
  const isAdmin = info?.role === 'Admin'

  if (isUser) return null

  const links = [
    { to: '/', label: t('overview.title'), icon: Grid, show: !isAdmin },
    { to: '/centers', label: t('centers.title'), icon: Building, show: !isAdmin },
    { to: '/users', label: t('users.title'), icon: Users, show: true },
    { to: '/classrooms', label: t('classrooms.title'), icon: GraduationCap, show: true },
    { to: '/streams', label: t('navigation.streams'), icon: Video, show: true },
  ].filter((l) => l.show)

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex items-center gap-3 border-b px-6 py-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">C</div>
          <div>
            <h1 className="font-bold tracking-tight text-foreground">ClassView</h1>
            <p className="text-xs text-muted-foreground">{t('navigation.streams')}</p>
          </div>
        </div>

        <nav aria-label="Main navigation" className="flex grow flex-col gap-1 overflow-y-auto px-3 py-5">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t px-6 py-4 text-center">
          <p className="text-xs text-muted-foreground">{t('login.copyright')}</p>
        </div>
      </aside>

      <aside className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white dark:bg-gray-900 flex justify-around items-center shadow-md z-40 transition-colors duration-300">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className={cn(
                'flex flex-col items-center justify-center transition-all',
                active ? 'text-gray-900 dark:text-white scale-110' : 'text-gray-500 dark:text-gray-400',
              )}
            >
              <Icon size={22} strokeWidth={1.5} />
            </Link>
          )
        })}
      </aside>
    </>
  )
}

export default Sidebar

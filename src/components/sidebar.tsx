import { Building, GraduationCap, Grid, Users, Video } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../lib/utils'

type SidebarProps = {
  open?: boolean
  onClose?: () => void
}

const Sidebar = ({ open = false, onClose }: SidebarProps) => {
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
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-background shadow-sm md:flex">
        <div className="flex items-center gap-3 border-b px-6 py-6">
          <img src="/src/images/logo.png" alt="ClassView" className="size-10 rounded-xl object-cover" />
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

      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        aria-label="Main navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-card shadow-xl transition-transform md:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center gap-3 border-b px-5 py-5">
          <img src="/src/images/logo.png" alt="ClassView" className="size-10 rounded-xl object-cover" />
          <div>
            <p className="font-bold tracking-tight text-foreground">ClassView</p>
            <p className="text-xs text-muted-foreground">{t('navigation.streams')}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {links.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                  active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

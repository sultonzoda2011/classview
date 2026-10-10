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
      <aside className="hidden md:flex bg-white dark:bg-gray-900 fixed top-0 left-0 w-64 h-screen flex-col justify-between shadow-md z-40 transition-colors duration-300">
        <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700 flex flex-col items-center">
          <img src="/src/images/logo.png" className="w-14 h-14 mb-2" alt="" />
          <h1 className="text-gray-900 dark:text-gray-100 font-bold text-2xl tracking-tight text-center">ClassView</h1>
        </div>

        <nav className="flex flex-col mt-6 grow px-2 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-all',
                  active
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                    : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white',
                )}
              >
                <Icon size={20} strokeWidth={1.5} className="mr-3" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-xs">{t('login.copyright')}</p>
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

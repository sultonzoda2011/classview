import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Button } from '../components/ui/button'
import Header from '../components/header'
import Sidebar from '../components/sidebar'
import { useAuth } from '../hooks/useAuth'

const Layout = () => {
  const { info, mustChangePassword } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const showSidebar = info?.role !== 'User'

  const menuButton = showSidebar ? (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 md:hidden"
      aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
      onClick={() => setSidebarOpen((open) => !open)}
    >
      {sidebarOpen ? <X data-icon="inline-start" /> : <Menu data-icon="inline-start" />}
      <span>{sidebarOpen ? 'Close' : 'Menu'}</span>
    </Button>
  ) : null

  // временный пароль нужно сменить до начала работы с системой
  if (mustChangePassword && location.pathname !== '/profile') return <Navigate to="/profile" replace />

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      {showSidebar && <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
      <div className={`flex flex-1 flex-col ${showSidebar ? 'md:ml-64' : ''} pb-16 md:pb-0`}>
        <Header menuButton={menuButton} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

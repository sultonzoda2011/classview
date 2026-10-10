import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Header from '../components/header'
import Sidebar from '../components/sidebar'
import { useAuth } from '../hooks/useAuth'

const Layout = () => {
  const { info, mustChangePassword } = useAuth()
  const location = useLocation()
  const showSidebar = info?.role !== 'User'

  // временный пароль нужно сменить до начала работы с системой
  if (mustChangePassword && location.pathname !== '/profile') return <Navigate to="/profile" replace />

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 flex flex-col ${showSidebar ? 'md:ml-64' : ''} pb-16 md:pb-0`}>
        <Header />
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

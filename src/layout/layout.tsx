import { Navigate, Outlet, useLocation } from 'react-router-dom'
import AppSidebar from '../components/app-sidebar'
import Header from '../components/header'
import { SidebarProvider } from '../components/ui/sidebar'
import { useAuth } from '../hooks/useAuth'

const Layout = () => {
  const { info, mustChangePassword } = useAuth()
  const location = useLocation()
  const showSidebar = info?.role !== 'User'

  // временный пароль нужно сменить до начала работы с системой
  if (mustChangePassword && location.pathname !== '/profile') return <Navigate to="/profile" replace />

  return (
    <SidebarProvider>
      {showSidebar && <AppSidebar />}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header withSidebar={showSidebar} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Layout

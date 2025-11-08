import { Outlet } from 'react-router-dom'
import Header from '../components/header'
import Sidebar from '../components/sidebar'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import type { CustomJwtPayload } from '../types/jwt'

const Layout: React.FC = () => {
  const token = Cookies.get('token')
  let info: CustomJwtPayload | null = null
  try {
    info = token ? jwtDecode<CustomJwtPayload>(token) : null
  } catch (error) {
    console.error('Invalid token', error)
  }

  const showSidebar = info?.role !== 'User'

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      {showSidebar && <Sidebar info={info} />}

      <div className={`flex-1 flex flex-col ${showSidebar ? 'md:ml-64' : ''}`}>
        <Header />
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Layout from './layout/layout'
import Login from './pages/login'
import Centers from './pages/centers'
import ClassRooms from './pages/classRooms'
import Streams from './pages/streams'
import Users from './pages/users'
import UserDetails from './pages/userDetails'
import UpdateUser from './pages/updateUser'
import Overview from './pages/overview'
import CreateUser from './pages/createUser'
import CreateEmployee from './pages/createEmployee'
import Profile from './pages/profile'
import Forbidden from './pages/forbidden'
import NotFound from './pages/notFound'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  role?: 'User' | 'Admin' | 'SuperAdmin'
  nameid?: string
  exp?: number
  iat?: number
}

interface ProtectedRouteProps {
  children: JSX.Element
}

interface RoleProtectedRouteProps {
  children: JSX.Element
  allowedRoles: DecodedToken['role'][]
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = Cookies.get('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  const token = Cookies.get('token')
  if (!token) return <Navigate to="/login" replace />

  try {
    const info = jwtDecode<DecodedToken>(token)
    if (!info?.role || !allowedRoles.includes(info.role)) {
      return <Navigate to="/403" replace />
    }
    return children
  } catch {
    return <Navigate to="/login" replace />
  }
}

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/profile',
          element: (
            <RoleProtectedRoute allowedRoles={['User', 'Admin', 'SuperAdmin']}>
              <Profile />
            </RoleProtectedRoute>
          ),
        },

        {
          path: '/streams',
          element: (
            <RoleProtectedRoute allowedRoles={['User', 'Admin', 'SuperAdmin']}>
              <Streams />
            </RoleProtectedRoute>
          ),
        },

        {
          path: '/',
          element: (
            <RoleProtectedRoute allowedRoles={['SuperAdmin']}>
              <Overview />
            </RoleProtectedRoute>
          ),
        },
        {
          path: '/users',
          element: (
            <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
              <Users />
            </RoleProtectedRoute>
          ),
        },

        {
          path: '/centers',
          element: (
            <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
              <Centers />
            </RoleProtectedRoute>
          ),
        },
        {
          path: '/classrooms',
          element: (
            <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
              <ClassRooms />
            </RoleProtectedRoute>
          ),
        },
      ],
    },

    { path: '/login', element: <Login /> },
    { path: '/403', element: <Forbidden /> },
    {
      path: '/update-user/:id',
      element: (
        <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
          <UpdateUser />
        </RoleProtectedRoute>
      ),
    },
    {
      path: '/users/create',
      element: (
        <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
          <CreateUser />
        </RoleProtectedRoute>
      ),
    },
    {
      path: '/users/create-employee',
      element: (
        <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
          <CreateEmployee />
        </RoleProtectedRoute>
      ),
    },
    {
      path: '/users/:id',
      element: (
        <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
          <UserDetails />
        </RoleProtectedRoute>
      ),
    },
    { path: '*', element: <NotFound /> },
  ])

  return <RouterProvider router={router} />
}

export default App

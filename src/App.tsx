import { Suspense, lazy } from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import { Spinner } from './components/ui/spinner'
import { useAuth } from './hooks/useAuth'
import Layout from './layout/layout'
import type { Role } from './types/users'

const Login = lazy(() => import('./pages/login'))
const Overview = lazy(() => import('./pages/overview'))
const Centers = lazy(() => import('./pages/centers'))
const ClassRooms = lazy(() => import('./pages/classRooms'))
const Users = lazy(() => import('./pages/users'))
const UserDetails = lazy(() => import('./pages/userDetails'))
const CreateUser = lazy(() => import('./pages/createUser'))
const UpdateUser = lazy(() => import('./pages/updateUser'))
const CreateEmployee = lazy(() => import('./pages/createEmployee'))
const Streams = lazy(() => import('./pages/streams'))
const Profile = lazy(() => import('./pages/profile'))
const NotFound = lazy(() => import('./pages/notFound'))
const Forbidden = lazy(() => import('./pages/forbidden'))

const Lazy = ({ children }: { children: JSX.Element }) => <Suspense fallback={<Spinner className="min-h-[50vh]" />}>{children}</Suspense>

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

const RoleProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles: Role[] }) => {
  const { info } = useAuth()
  if (!info) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(info.role)) return <Navigate to="/403" replace />
  return children
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/profile', element: <Lazy><Profile /></Lazy> },
      { path: '/streams', element: <Lazy><Streams /></Lazy> },
      {
        path: '/',
        element: (
          <RoleProtectedRoute allowedRoles={['SuperAdmin']}>
            <Lazy><Overview /></Lazy>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/users',
        element: (
          <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <Lazy><Users /></Lazy>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/centers',
        element: (
          <RoleProtectedRoute allowedRoles={['SuperAdmin']}>
            <Lazy><Centers /></Lazy>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/classrooms',
        element: (
          <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <Lazy><ClassRooms /></Lazy>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/update-user/:id',
        element: (
          <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <Lazy><UpdateUser /></Lazy>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/users/create',
        element: (
          <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <Lazy><CreateUser /></Lazy>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/users/create-employee',
        element: (
          <RoleProtectedRoute allowedRoles={['SuperAdmin']}>
            <Lazy><CreateEmployee /></Lazy>
          </RoleProtectedRoute>
        ),
      },
      {
        path: '/users/:id',
        element: (
          <RoleProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <Lazy><UserDetails /></Lazy>
          </RoleProtectedRoute>
        ),
      },
    ],
  },
  { path: '/login', element: <Lazy><Login /></Lazy> },
  { path: '/403', element: <Lazy><Forbidden /></Lazy> },
  { path: '*', element: <Lazy><NotFound /></Lazy> },
])

const App = () => (
  <>
    <RouterProvider router={router} />
    <Toaster />
  </>
)

export default App

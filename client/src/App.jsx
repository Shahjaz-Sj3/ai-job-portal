import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './layouts/AppLayout'
import AdminDashboard from './pages/AdminDashboard'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import JobDetailsPage from './pages/JobDetailsPage'
import JobsPage from './pages/JobsPage'
import RecruiterDashboard from './pages/RecruiterDashboard'
import UserDashboard from './pages/UserDashboard'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/jobs', element: <JobsPage /> },
      { path: '/jobs/:id', element: <JobDetailsPage /> },
      { path: '/login', element: <AuthPage mode="login" /> },
      { path: '/register', element: <AuthPage mode="register" /> },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute roles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/recruiter',
        element: (
          <ProtectedRoute roles={['recruiter']}>
            <RecruiterDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)

export default App

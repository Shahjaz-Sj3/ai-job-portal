import { BrainCircuit, LogOut } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const dashboardPath = {
  admin: '/admin',
  recruiter: '/recruiter',
  user: '/dashboard',
}

const AppLayout = () => {
  const { logout, user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <BrainCircuit className="text-indigo-600" />
            HireMind AI
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <NavLink to="/jobs" className="hover:text-indigo-600">Jobs</NavLink>
            {user ? (
              <>
                <NavLink to={dashboardPath[user.role]} className="hover:text-indigo-600">Dashboard</NavLink>
                <span className="hidden text-slate-500 sm:inline">{user.name}</span>
                <button type="button" onClick={logout} className="flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-white">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="hover:text-indigo-600">Login</NavLink>
                <NavLink to="/register" className="rounded-full bg-indigo-600 px-4 py-2 text-white">Register</NavLink>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout

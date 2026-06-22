import { useCallback, useEffect, useState } from 'react'
import api from '../api/client'
import StatCard from '../components/StatCard'

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [role, setRole] = useState('')
  const [users, setUsers] = useState([])

  const loadData = useCallback(async (selectedRole = role) => {
    const [analyticsResult, usersResult] = await Promise.all([
      api.get('/admin/analytics'),
      api.get('/admin/users', { params: selectedRole ? { role: selectedRole } : {} }),
    ])
    setAnalytics(analyticsResult.data.data)
    setUsers(usersResult.data.data)
  }, [role])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData()
  }, [loadData])

  const toggleUser = async (user) => {
    await api.patch(`/admin/users/${user._id}/status`, { isActive: !user.isActive })
    loadData()
  }

  const handleRoleChange = (event) => {
    setRole(event.target.value)
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-500">Manage users, recruiters, and hiring analytics.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard label="Users" value={analytics?.totals.users} />
        <StatCard label="Recruiters" value={analytics?.totals.recruiters} />
        <StatCard label="Jobs" value={analytics?.totals.jobs} />
        <StatCard label="Applications" value={analytics?.totals.applications} />
        <StatCard label="Shortlisted" value={analytics?.totals.shortlisted} />
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-bold">Manage Users</h2>
          <select value={role} onChange={handleRoleChange} className="input sm:w-52">
            <option value="">All roles</option>
            <option value="user">Users</option>
            <option value="recruiter">Recruiters</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          {users.map((user) => (
            <div key={user._id} className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 last:border-b-0 sm:flex-row sm:items-center">
              <div>
                <p className="font-bold">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email} · {user.role} · {user.isActive ? 'Active' : 'Disabled'}</p>
              </div>
              <button onClick={() => toggleUser(user)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">
                {user.isActive ? 'Disable' : 'Enable'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AuthPage = ({ mode }) => {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    adminInviteCode: '',
    company: '',
    email: '',
    name: '',
    password: '',
    role: 'user',
  })

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const user = isRegister ? await register(form) : await login({ email: form.email, password: form.password })
      navigate(user.role === 'admin' ? '/admin' : user.role === 'recruiter' ? '/recruiter' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed')
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold">{isRegister ? 'Create account' : 'Welcome back'}</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {isRegister && (
          <>
            <input name="name" placeholder="Full name" value={form.name} onChange={updateField} className="input" required />
            <select name="role" value={form.role} onChange={updateField} className="input">
              <option value="user">Candidate</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
            {form.role === 'recruiter' && (
              <input name="company" placeholder="Company" value={form.company} onChange={updateField} className="input" />
            )}
            {form.role === 'admin' && (
              <input name="adminInviteCode" placeholder="Admin invite code" value={form.adminInviteCode} onChange={updateField} className="input" />
            )}
          </>
        )}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={updateField} className="input" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={updateField} className="input" required />
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500">
        {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
        <Link to={isRegister ? '/login' : '/register'} className="font-semibold text-indigo-600">
          {isRegister ? 'Login' : 'Register'}
        </Link>
      </p>
    </div>
  )
}

export default AuthPage

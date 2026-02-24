import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowRight } from 'react-icons/fi'
import { loginUser } from '../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await loginUser({ email, password })
      localStorage.setItem('user', JSON.stringify(response.data))
      toast.success('Login successful')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen px-4 flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.35),_transparent_40%)]" />

      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        <p className="text-xs tracking-[0.2em] uppercase text-emerald-200">Welcome Back</p>
        <h1 className="text-3xl font-bold text-white mt-2">Money Manager</h1>
        <p className="text-sm text-slate-200 mt-1">Sign in to continue tracking income and expenses.</p>

        <form onSubmit={handleLogin} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm text-slate-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl bg-white/15 border border-white/20 text-white placeholder:text-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-xl bg-white/15 border border-white/20 text-white placeholder:text-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 text-white py-2.5 font-semibold hover:bg-emerald-600 transition flex items-center justify-center gap-2"
          >
            Login <FiArrowRight size={16} />
          </button>
        </form>

        <p className="text-sm text-slate-200 mt-6 text-center">
          New user?{' '}
          <Link to="/register" className="text-emerald-300 hover:text-emerald-200 font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

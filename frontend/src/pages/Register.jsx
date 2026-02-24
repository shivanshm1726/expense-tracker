import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowRight } from 'react-icons/fi'
import { registerUser } from '../services/api'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleRegister = async (event) => {
    event.preventDefault()
    try {
      const response = await registerUser({ name, email, password })
      toast.success(response.data.message || 'Registration successful')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen px-4 flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.35),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.35),_transparent_35%)]" />

      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        <p className="text-xs tracking-[0.2em] uppercase text-violet-200">Get Started</p>
        <h1 className="text-3xl font-bold text-white mt-2">Create Account</h1>
        <p className="text-sm text-slate-200 mt-1">Build your personal money dashboard in minutes.</p>

        <form onSubmit={handleRegister} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm text-slate-200 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="Alex Smith"
              className="w-full rounded-xl bg-white/15 border border-white/20 text-white placeholder:text-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl bg-white/15 border border-white/20 text-white placeholder:text-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
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
              className="w-full rounded-xl bg-white/15 border border-white/20 text-white placeholder:text-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-violet-500 text-white py-2.5 font-semibold hover:bg-violet-600 transition flex items-center justify-center gap-2"
          >
            Register <FiArrowRight size={16} />
          </button>
        </form>

        <p className="text-sm text-slate-200 mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-300 hover:text-violet-200 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register

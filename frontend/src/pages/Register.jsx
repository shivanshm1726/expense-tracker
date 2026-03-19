import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowRight, FiDollarSign, FiLock, FiMail, FiShield, FiUser } from 'react-icons/fi'
import { registerUser } from '../services/api'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('user')) navigate('/dashboard')
  }, [navigate])

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await registerUser({ name, email, password })
      toast.success(response.data.message || 'Account created!')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] px-6 py-12 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

      {/* Green glow */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-green-500/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
            <FiDollarSign size={18} className="text-black" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Money Manager</span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-gray-500 text-sm">Start tracking your finances in minutes.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="group">
            <label className="block text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wider">Name</label>
            <div className="relative">
              <FiUser size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-400 transition-colors" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Alex Smith"
                className="w-full bg-[#111] border border-[#1e1e1e] focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 text-white placeholder:text-gray-700 pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wider">Email</label>
            <div className="relative">
              <FiMail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-400 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-[#111] border border-[#1e1e1e] focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 text-white placeholder:text-gray-700 pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <FiLock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-400 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min 8 characters"
                className="w-full bg-[#111] border border-[#1e1e1e] focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 text-white placeholder:text-gray-700 pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/30"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>Create Account <FiArrowRight size={14} /></>
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#1e1e1e]" />
          <span className="text-xs text-gray-700">or</span>
          <div className="flex-1 h-px bg-[#1e1e1e]" />
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
            Sign in →
          </Link>
        </p>

        <div className="mt-8 flex items-center gap-2 justify-center">
          <FiShield size={12} className="text-gray-700" />
          <p className="text-xs text-gray-700">256-bit encrypted · Your data is private</p>
        </div>
      </div>
    </div>
  )
}

export default Register

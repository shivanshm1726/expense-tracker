import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FiArrowRight,
  FiDollarSign,
  FiLock,
  FiMail,
  FiShield,
  FiTrendingUp,
  FiPieChart,
  FiActivity,
} from 'react-icons/fi'
import { loginUser } from '../services/api'

/* ── Decorative left-panel stat ── */
function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3">
      <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-green-400" />
      </div>
      <div>
        <p className="text-xs text-gray-500 leading-none mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('user')) navigate('/dashboard')
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await loginUser({ email, password })
      localStorage.setItem('user', JSON.stringify(response.data))
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#080808] overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 grid-bg overflow-hidden">
        {/* Scan line */}
        <div className="scan-line" />

        {/* Green glow */}
        <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-40px] right-[-60px] w-[280px] h-[280px] bg-green-500/6 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <FiDollarSign size={18} className="text-black font-bold" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Money Manager</span>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-green-400 text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Personal Finance OS
            </p>
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Your money,<br />
              <span className="gradient-text">visualised.</span>
            </h2>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed max-w-sm">
              Track every rupee, set intelligent budgets, and gain full visibility
              into your financial health — all from one dashboard.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <Stat icon={FiTrendingUp} label="Income tracked" value="Real-time" />
            <Stat icon={FiPieChart}    label="Charts"         value="Beautiful" />
            <Stat icon={FiActivity}    label="Budget alerts"  value="Smart"     />
            <Stat icon={FiShield}      label="Security"       value="Encrypted" />
          </div>
        </div>

        {/* Bottom tag */}
        <div className="relative z-10">
          <p className="text-xs text-gray-700">© 2026 Money Manager. Built for clarity.</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Subtle glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,197,94,0.06)_0%,_transparent_60%)] pointer-events-none" />

        <div className="relative w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center">
              <FiDollarSign size={16} className="text-black" />
            </div>
            <span className="text-white font-bold">Money Manager</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Sign in</h1>
            <p className="text-gray-500 text-sm">Enter your credentials to access your dashboard.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="group">
              <label className="block text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wider">
                Email
              </label>
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

            {/* Password */}
            <div className="group">
              <label className="block text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <FiLock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-400 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#111] border border-[#1e1e1e] focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 text-white placeholder:text-gray-700 pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/30"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>Sign In <FiArrowRight size={14} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#1e1e1e]" />
            <span className="text-xs text-gray-700">or</span>
            <div className="flex-1 h-px bg-[#1e1e1e]" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-600">
            New here?{' '}
            <Link to="/register" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
              Create an account →
            </Link>
          </p>

          {/* Security note */}
          <div className="mt-8 flex items-center gap-2 justify-center">
            <FiShield size={12} className="text-gray-700" />
            <p className="text-xs text-gray-700">256-bit encrypted · Secure session</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

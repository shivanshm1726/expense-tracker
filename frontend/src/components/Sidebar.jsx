import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FiBarChart2,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiHome,
  FiMoon,
  FiRepeat,
  FiSun,
  FiX,
} from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: FiHome },
  { label: 'Income', path: '/income', icon: FiDollarSign },
  { label: 'Expense', path: '/expense', icon: FiCreditCard },
  { label: 'Budget', path: '/budget', icon: FiBarChart2 },
  { label: 'Recurring', path: '/recurring', icon: FiRepeat },
  { label: 'Reports', path: '/reports', icon: FiFileText },
]

function Sidebar({ user, isOpen, setIsOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/60 z-30 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-72 bg-[var(--card-bg)] border-r border-[var(--border-color)] shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-text)]">Money Manager</p>
              <h1 className="text-xl font-bold text-[var(--text-color)]">ExpenseTracker Pro</h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-[var(--muted-text)] hover:text-[var(--text-color)]"
              type="button"
            >
              <FiX size={20} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-violet-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'text-[var(--muted-text)] hover:text-[var(--text-color)] hover:bg-[var(--surface-bg)]'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between rounded-xl px-3 py-2 bg-[var(--surface-bg)]">
              <span className="text-sm text-[var(--muted-text)]">Dark mode</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="h-8 w-8 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)] flex items-center justify-center"
              >
                {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
              </button>
            </div>

            <div className="rounded-xl px-3 py-3 bg-[var(--surface-bg)]">
              <p className="text-sm font-semibold text-[var(--text-color)]">{user?.name || 'User'}</p>
              <p className="text-xs text-[var(--muted-text)] break-all">{user?.email || '-'}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 w-full rounded-lg bg-rose-500 text-white py-2 text-sm font-semibold hover:bg-rose-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

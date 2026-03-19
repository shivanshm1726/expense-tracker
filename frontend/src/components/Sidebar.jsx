import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FiBarChart2,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiHome,
  FiRepeat,
  FiLogOut,
  FiX,
} from 'react-icons/fi'

const navItems = [
  { label: 'Dashboard',  path: '/dashboard', icon: FiHome      },
  { label: 'Income',     path: '/income',    icon: FiDollarSign },
  { label: 'Expense',    path: '/expense',   icon: FiCreditCard },
  { label: 'Budget',     path: '/budget',    icon: FiBarChart2  },
  { label: 'Recurring',  path: '/recurring', icon: FiRepeat     },
  { label: 'Reports',    path: '/reports',   icon: FiFileText   },
]

function Sidebar({ user, isOpen, setIsOpen }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/70 z-30 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center shadow shadow-green-500/30">
              <FiDollarSign size={14} className="text-black font-bold" />
            </div>
            <span className="text-white font-bold text-sm tracking-tight">Money Manager</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-600 hover:text-white transition-colors"
            type="button"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'nav-active pl-[10px]'
                    : 'text-gray-600 hover:text-gray-300 hover:bg-white/4'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-[#1a1a1a] space-y-2">
          {/* User info */}
          <div className="px-3 py-3 rounded-lg bg-[#111] border border-[#1a1a1a]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 text-xs font-bold">
                  {(user?.name || 'U')[0].toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-600 truncate">{user?.email || ''}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-red-400 border border-[#1e1e1e] hover:border-red-500/30 rounded-lg py-2 transition-all"
            >
              <FiLogOut size={12} />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

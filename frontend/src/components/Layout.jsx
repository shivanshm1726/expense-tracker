import { useMemo, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'
import Sidebar from './Sidebar'

const routeTitles = {
  '/dashboard': 'Financial Dashboard',
  '/income': 'Income Management',
  '/expense': 'Expense Management',
  '/budget': 'Budget Planner',
  '/recurring': 'Recurring Expenses',
  '/reports': 'Reports & Export',
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user'))
    } catch (error) {
      return null
    }
  }, [location.pathname])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const pageTitle = routeTitles[location.pathname] || 'Money Manager'

  return (
    <div className="min-h-screen bg-[#080808] text-[#f0f0f0]">
      <Sidebar user={user} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 h-14 bg-[#080808]/90 backdrop-blur-xl border-b border-[#1a1a1a] flex items-center px-4 md:px-8 gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden h-8 w-8 rounded-lg border border-[#1e1e1e] bg-[#111] flex items-center justify-center text-gray-500 hover:text-white transition-colors"
          >
            <FiMenu size={16} />
          </button>
          <div>
            <p className="text-xs text-gray-700 uppercase tracking-widest">Overview</p>
            <h2 className="text-sm font-semibold text-white">{pageTitle}</h2>
          </div>
        </header>

        <main className="px-4 md:px-8 py-6 md:py-8">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  )
}

export default Layout

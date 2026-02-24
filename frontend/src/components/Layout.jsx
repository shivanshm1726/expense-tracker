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
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
      <Sidebar user={user} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-[var(--bg-color)]/80 border-b border-[var(--border-color)]">
          <div className="px-4 md:px-8 py-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden h-10 w-10 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] flex items-center justify-center"
            >
              <FiMenu size={18} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-text)]">Overview</p>
              <h2 className="text-xl font-semibold">{pageTitle}</h2>
            </div>
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

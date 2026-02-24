import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import IncomePage from './pages/IncomePage'
import ExpensePage from './pages/ExpensePage'
import BudgetPage from './pages/BudgetPage'
import RecurringPage from './pages/RecurringPage'
import ReportsPage from './pages/ReportsPage'

const getDefaultRoute = () => (localStorage.getItem('user') ? '/dashboard' : '/login')

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#f8fafc',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/expense" element={<ExpensePage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/recurring" element={<RecurringPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>

          <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

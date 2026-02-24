import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
  getCategorySummary,
} from '../services/api'
import ExpenseModal from '../components/ExpenseModal'
import StatsCards from '../components/StatsCards'
import MonthlyChart from '../components/MonthlyChart'
import CategoryChart from '../components/CategoryChart'
import ExpenseTable from '../components/ExpenseTable'

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) navigate('/login')
  }, [])

  const [expenses, setExpenses] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  // Filters
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')

  const userId = user?.id

  // Fetch all data
  const fetchData = async () => {
    try {
      const [expRes, monthRes, catRes] = await Promise.all([
        getExpenses(userId, filterCategory, filterStartDate, filterEndDate),
        getMonthlySummary(userId),
        getCategorySummary(userId),
      ])
      setExpenses(expRes.data)
      setMonthlyData(monthRes.data)
      setCategoryData(catRes.data)
    } catch (err) {
      toast.error('Failed to load data')
    }
  }

  useEffect(() => {
    if (userId) fetchData()
  }, [userId, filterCategory, filterStartDate, filterEndDate])

  // Add or Update expense
  const handleSaveExpense = async (data) => {
    try {
      if (editingExpense) {
        await updateExpense(userId, editingExpense.id, data)
        toast.success('Expense updated!')
      } else {
        await addExpense(userId, data)
        toast.success('Expense added!')
      }
      setShowModal(false)
      setEditingExpense(null)
      fetchData()
    } catch (err) {
      toast.error('Failed to save expense')
    }
  }

  // Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return
    try {
      await deleteExpense(userId, id)
      toast.success('Expense deleted!')
      fetchData()
    } catch (err) {
      toast.error('Failed to delete expense')
    }
  }

  // Edit expense
  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setShowModal(true)
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Clear filters
  const clearFilters = () => {
    setFilterCategory('')
    setFilterStartDate('')
    setFilterEndDate('')
  }

  // Calculate total
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other']

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">💰 Expense Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">Hi, {user.name}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <StatsCards total={totalExpenses} count={expenses.length} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <MonthlyChart data={monthlyData} />
          <CategoryChart data={categoryData} />
        </div>

        {/* Filters & Add Button */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={clearFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>

            <div className="ml-auto">
              <button
                onClick={() => {
                  setEditingExpense(null)
                  setShowModal(true)
                }}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 transition font-semibold"
              >
                + Add Expense
              </button>
            </div>
          </div>

          {/* Expenses Table */}
          <ExpenseTable
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Add/Edit Expense Modal */}
      {showModal && (
        <ExpenseModal
          onClose={() => {
            setShowModal(false)
            setEditingExpense(null)
          }}
          onSave={handleSaveExpense}
          expense={editingExpense}
          categories={categories}
        />
      )}
    </div>
  )
}

export default Dashboard

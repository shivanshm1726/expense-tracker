import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  addExpense,
  deleteExpense,
  getCategorySummary,
  getExpenseMonthlySummary,
  getExpenses,
  updateExpense,
} from '../services/api'
import ExpenseModal from '../components/ExpenseModal'
import ExpenseTable from '../components/ExpenseTable'
import MonthlyChart from '../components/MonthlyChart'
import CategoryChart from '../components/CategoryChart'
import StatsCards from '../components/StatsCards'

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other']

function ExpensePage() {
  const { user } = useOutletContext()

  const [expenses, setExpenses] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  const [filterCategory, setFilterCategory] = useState('')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')

  const fetchData = async () => {
    try {
      const [expRes, monthRes, catRes] = await Promise.all([
        getExpenses(user.id, filterCategory, filterStartDate, filterEndDate),
        getExpenseMonthlySummary(user.id),
        getCategorySummary(user.id),
      ])
      setExpenses(expRes.data)
      setMonthlyData(monthRes.data)
      setCategoryData(catRes.data)
    } catch (error) {
      toast.error('Failed to load expense data')
    }
  }

  useEffect(() => {
    fetchData()
  }, [user.id, filterCategory, filterStartDate, filterEndDate])

  const handleSaveExpense = async (data) => {
    try {
      if (editingExpense) {
        await updateExpense(user.id, editingExpense.id, data)
        toast.success('Expense updated')
      } else {
        await addExpense(user.id, data)
        toast.success('Expense added')
      }

      setShowModal(false)
      setEditingExpense(null)
      fetchData()
    } catch (error) {
      toast.error('Failed to save expense')
    }
  }

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Delete this expense entry?')) return
    try {
      await deleteExpense(user.id, expenseId)
      toast.success('Expense deleted')
      fetchData()
    } catch (error) {
      toast.error('Failed to delete expense')
    }
  }

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-6">
      <StatsCards total={totalExpenses} count={expenses.length} />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlyChart data={monthlyData} />
        <CategoryChart data={categoryData} />
      </section>

      <section className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5">
        <div className="flex flex-wrap items-end gap-4 mb-5">
          <div>
            <label className="block text-xs text-[var(--muted-text)] mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(event) => setFilterCategory(event.target.value)}
              className="rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[var(--muted-text)] mb-1">From</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(event) => setFilterStartDate(event.target.value)}
              className="rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--muted-text)] mb-1">To</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(event) => setFilterEndDate(event.target.value)}
              className="rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setFilterCategory('')
              setFilterStartDate('')
              setFilterEndDate('')
            }}
            className="rounded-xl border border-[var(--border-color)] px-3 py-2"
          >
            Clear
          </button>

          <div className="ml-auto">
            <button
              type="button"
              onClick={() => {
                setEditingExpense(null)
                setShowModal(true)
              }}
              className="rounded-xl bg-violet-500 text-white font-semibold px-4 py-2.5 hover:bg-violet-600 transition"
            >
              + Add Expense
            </button>
          </div>
        </div>

        <ExpenseTable expenses={expenses} onEdit={(item) => {
          setEditingExpense(item)
          setShowModal(true)
        }} onDelete={handleDelete} />
      </section>

      {showModal && (
        <ExpenseModal
          expense={editingExpense}
          categories={categories}
          onSave={handleSaveExpense}
          onClose={() => {
            setShowModal(false)
            setEditingExpense(null)
          }}
        />
      )}
    </div>
  )
}

export default ExpensePage

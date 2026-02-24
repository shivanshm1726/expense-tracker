import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import toast from 'react-hot-toast'
import { deleteBudget, getBudgets, getCurrentBudget, setBudget } from '../services/api'

const now = new Date()
const currentMonth = now.getMonth() + 1
const currentYear = now.getFullYear()

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0)

function BudgetPage() {
  const { user } = useOutletContext()
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(currentYear)
  const [currentBudget, setCurrentBudgetState] = useState(null)
  const [budgetHistory, setBudgetHistory] = useState([])

  const fetchData = async () => {
    try {
      const [currentRes, historyRes] = await Promise.all([
        getCurrentBudget(user.id, month, year),
        getBudgets(user.id),
      ])

      const budgetData = currentRes.data
      setCurrentBudgetState(budgetData)
      setBudgetHistory(historyRes.data)
      setMonthlyLimit(budgetData?.monthlyLimit || '')
    } catch (error) {
      toast.error('Failed to load budget data')
    }
  }

  useEffect(() => {
    fetchData()
  }, [user.id, month, year])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await setBudget(user.id, {
        monthlyLimit: parseFloat(monthlyLimit),
        month: parseInt(month, 10),
        year: parseInt(year, 10),
      })
      toast.success('Budget saved')
      fetchData()
    } catch (error) {
      toast.error('Failed to save budget')
    }
  }

  const handleDelete = async (budgetId) => {
    if (!window.confirm('Delete this budget?')) return
    try {
      await deleteBudget(user.id, budgetId)
      toast.success('Budget deleted')
      fetchData()
    } catch (error) {
      toast.error('Failed to delete budget')
    }
  }

  const percentUsed = currentBudget?.percentUsed || 0

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs text-[var(--muted-text)] mb-1">Monthly Limit</label>
            <input
              type="number"
              step="0.01"
              value={monthlyLimit}
              onChange={(event) => setMonthlyLimit(event.target.value)}
              required
              className="w-full rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--muted-text)] mb-1">Month</label>
            <input
              type="number"
              min="1"
              max="12"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              required
              className="w-full rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--muted-text)] mb-1">Year</label>
            <input
              type="number"
              min="2020"
              max="2100"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              required
              className="w-full rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-emerald-500 text-white py-2.5 font-semibold hover:bg-emerald-600 transition"
          >
            Save Budget
          </button>
        </form>
      </section>

      <section className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5">
        <h3 className="text-lg font-semibold">Current Progress</h3>

        {!currentBudget ? (
          <p className="text-sm text-[var(--muted-text)] mt-3">No budget exists for selected month/year.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] p-4">
                <p className="text-xs text-[var(--muted-text)]">Spent</p>
                <p className="text-lg font-semibold text-rose-500">{formatCurrency(currentBudget.spent)}</p>
              </div>
              <div className="rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] p-4">
                <p className="text-xs text-[var(--muted-text)]">Remaining</p>
                <p className={`text-lg font-semibold ${currentBudget.remaining < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {formatCurrency(currentBudget.remaining)}
                </p>
              </div>
              <div className="rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] p-4">
                <p className="text-xs text-[var(--muted-text)]">Limit</p>
                <p className="text-lg font-semibold">{formatCurrency(currentBudget.monthlyLimit)}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-3 rounded-full bg-[var(--surface-bg)] overflow-hidden">
                <div
                  className={`h-full ${
                    percentUsed >= 100 ? 'bg-rose-500' : percentUsed >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                />
              </div>
              <p className="text-sm mt-2 text-[var(--muted-text)]">{percentUsed.toFixed(1)}% used</p>
            </div>

            {currentBudget.alertMessage && (
              <div
                className={`mt-4 rounded-xl px-3 py-2 text-sm border ${
                  percentUsed >= 100
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-300'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-300'
                }`}
              >
                {currentBudget.alertMessage}
              </div>
            )}
          </>
        )}
      </section>

      <section className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Budget History</h3>
        {budgetHistory.length === 0 ? (
          <p className="text-sm text-[var(--muted-text)]">No budget history yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted-text)] border-b border-[var(--border-color)]">
                <th className="pb-2">Month</th>
                <th className="pb-2">Limit</th>
                <th className="pb-2">Spent</th>
                <th className="pb-2">Remaining</th>
                <th className="pb-2">Usage</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgetHistory.map((budget) => (
                <tr key={budget.id} className="border-b border-[var(--border-color)]/70">
                  <td className="py-3 text-[var(--muted-text)]">
                    {String(budget.month).padStart(2, '0')}/{budget.year}
                  </td>
                  <td className="py-3">{formatCurrency(budget.monthlyLimit)}</td>
                  <td className="py-3 text-rose-500">{formatCurrency(budget.spent)}</td>
                  <td className={`py-3 ${budget.remaining < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {formatCurrency(budget.remaining)}
                  </td>
                  <td className="py-3">{budget.percentUsed.toFixed(1)}%</td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(budget.id)}
                      className="text-rose-500 hover:text-rose-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export default BudgetPage

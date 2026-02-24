import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  addIncome,
  deleteIncome,
  getIncomeMonthlySummary,
  getIncomes,
  getSourceSummary,
  updateIncome,
} from '../services/api'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'

const SOURCE_OPTIONS = ['Salary', 'Bonus', 'Freelance', 'Cashback', 'Investment', 'Other']
const PIE_COLORS = ['#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#f43f5e', '#6366f1']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const initialForm = {
  title: '',
  amount: '',
  source: 'Salary',
  date: new Date().toISOString().slice(0, 10),
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0)

function IncomePage() {
  const { user } = useOutletContext()
  const [form, setForm] = useState(initialForm)
  const [editingIncomeId, setEditingIncomeId] = useState(null)
  const [incomes, setIncomes] = useState([])
  const [sourceSummary, setSourceSummary] = useState([])
  const [monthlySummary, setMonthlySummary] = useState([])
  const [filterSource, setFilterSource] = useState('')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')

  const fetchData = async () => {
    try {
      const [incomeRes, sourceRes, monthRes] = await Promise.all([
        getIncomes(user.id, filterSource, filterStartDate, filterEndDate),
        getSourceSummary(user.id),
        getIncomeMonthlySummary(user.id),
      ])
      setIncomes(incomeRes.data)
      setSourceSummary(sourceRes.data)
      setMonthlySummary(monthRes.data)
    } catch (error) {
      toast.error('Failed to load income data')
    }
  }

  useEffect(() => {
    fetchData()
  }, [user.id, filterSource, filterStartDate, filterEndDate])

  const pieData = useMemo(
    () => sourceSummary.map((item) => ({ name: item.source, value: item.total })),
    [sourceSummary],
  )

  const barData = useMemo(() => {
    const map = monthlySummary.reduce((acc, item) => {
      acc[item.month] = item.total
      return acc
    }, {})

    return MONTHS.map((month, index) => ({ month, total: map[index + 1] || 0 }))
  }, [monthlySummary])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const payload = {
      ...form,
      amount: parseFloat(form.amount),
    }

    try {
      if (editingIncomeId) {
        await updateIncome(user.id, editingIncomeId, payload)
        toast.success('Income updated')
      } else {
        await addIncome(user.id, payload)
        toast.success('Income added')
      }
      setForm(initialForm)
      setEditingIncomeId(null)
      fetchData()
    } catch (error) {
      toast.error('Failed to save income')
    }
  }

  const handleEdit = (income) => {
    setEditingIncomeId(income.id)
    setForm({
      title: income.title,
      amount: income.amount,
      source: income.source,
      date: income.date,
    })
  }

  const handleDelete = async (incomeId) => {
    if (!window.confirm('Delete this income entry?')) return
    try {
      await deleteIncome(user.id, incomeId)
      toast.success('Income deleted')
      fetchData()
    } catch (error) {
      toast.error('Failed to delete income')
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs text-[var(--muted-text)] mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
              className="w-full rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--muted-text)] mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
              required
              className="w-full rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--muted-text)] mb-1">Source</label>
            <select
              value={form.source}
              onChange={(event) => setForm((prev) => ({ ...prev, source: event.target.value }))}
              className="w-full rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            >
              {SOURCE_OPTIONS.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[var(--muted-text)] mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              required
              className="w-full rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-500 text-white py-2.5 font-semibold hover:bg-emerald-600 transition"
            >
              {editingIncomeId ? 'Update' : 'Add Income'}
            </button>
            {editingIncomeId && (
              <button
                type="button"
                onClick={() => {
                  setEditingIncomeId(null)
                  setForm(initialForm)
                }}
                className="rounded-xl bg-[var(--surface-bg)] px-4 py-2.5 border border-[var(--border-color)]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-[var(--muted-text)] mb-1">Source Filter</label>
            <select
              value={filterSource}
              onChange={(event) => setFilterSource(event.target.value)}
              className="rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            >
              <option value="">All sources</option>
              {SOURCE_OPTIONS.map((source) => (
                <option key={source} value={source}>
                  {source}
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
              setFilterSource('')
              setFilterStartDate('')
              setFilterEndDate('')
            }}
            className="rounded-xl border border-[var(--border-color)] px-3 py-2"
          >
            Clear
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5">
          <h3 className="text-lg font-semibold mb-4">Income by Source</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="xl:col-span-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5">
          <h3 className="text-lg font-semibold mb-4">Monthly Income</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--muted-text)" />
              <YAxis stroke="var(--muted-text)" />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="total" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Income Entries</h3>
        {incomes.length === 0 ? (
          <p className="text-sm text-[var(--muted-text)]">No income entries found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted-text)] border-b border-[var(--border-color)]">
                <th className="pb-2">Date</th>
                <th className="pb-2">Title</th>
                <th className="pb-2">Source</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income.id} className="border-b border-[var(--border-color)]/70">
                  <td className="py-3 text-[var(--muted-text)]">{income.date}</td>
                  <td className="py-3 font-medium">{income.title}</td>
                  <td className="py-3">{income.source}</td>
                  <td className="py-3 text-emerald-500 font-semibold">{formatCurrency(income.amount)}</td>
                  <td className="py-3 text-right space-x-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(income)}
                      className="text-violet-500 hover:text-violet-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(income.id)}
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

export default IncomePage

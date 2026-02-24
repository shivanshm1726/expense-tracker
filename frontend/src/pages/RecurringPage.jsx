import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  addRecurringExpense,
  deleteRecurringExpense,
  getRecurringExpenses,
  processDueRecurringExpenses,
  toggleRecurringExpense,
  updateRecurringExpense,
} from '../services/api'

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other']
const frequencies = ['MONTHLY', 'WEEKLY']

const createInitialForm = () => ({
  title: '',
  amount: '',
  category: 'Bills',
  frequency: 'MONTHLY',
  nextDueDate: new Date().toISOString().slice(0, 10),
})

function RecurringPage() {
  const { user } = useOutletContext()
  const [recurringList, setRecurringList] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(createInitialForm())
  const [processing, setProcessing] = useState(false)

  const fetchRecurring = async () => {
    try {
      const response = await getRecurringExpenses(user.id)
      setRecurringList(response.data)
    } catch (error) {
      toast.error('Failed to load recurring expenses')
    }
  }

  useEffect(() => {
    fetchRecurring()
  }, [user.id])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      ...form,
      amount: parseFloat(form.amount),
    }

    try {
      if (editingId) {
        await updateRecurringExpense(user.id, editingId, payload)
        toast.success('Recurring expense updated')
      } else {
        await addRecurringExpense(user.id, payload)
        toast.success('Recurring expense added')
      }
      setEditingId(null)
      setForm(createInitialForm())
      fetchRecurring()
    } catch (error) {
      toast.error('Failed to save recurring expense')
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      amount: item.amount,
      category: item.category,
      frequency: item.frequency,
      nextDueDate: item.nextDueDate,
    })
  }

  const handleToggle = async (item) => {
    try {
      await toggleRecurringExpense(user.id, item.id, !item.active)
      toast.success(item.active ? 'Recurring expense paused' : 'Recurring expense activated')
      fetchRecurring()
    } catch (error) {
      toast.error('Failed to update recurring status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recurring expense?')) return
    try {
      await deleteRecurringExpense(user.id, id)
      toast.success('Recurring expense deleted')
      fetchRecurring()
    } catch (error) {
      toast.error('Failed to delete recurring expense')
    }
  }

  const handleProcessDue = async () => {
    try {
      setProcessing(true)
      const response = await processDueRecurringExpenses()
      toast.success(`Created ${response.data.createdExpenses} due expense(s)`)
      fetchRecurring()
    } catch (error) {
      toast.error('Failed to process due recurring expenses')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Recurring Expense</h3>
          <button
            type="button"
            onClick={handleProcessDue}
            disabled={processing}
            className="rounded-xl bg-violet-500 text-white px-4 py-2 font-semibold disabled:opacity-60"
          >
            {processing ? 'Processing...' : 'Process Due Entries'}
          </button>
        </div>

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
            <label className="block text-xs text-[var(--muted-text)] mb-1">Category</label>
            <select
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="w-full rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[var(--muted-text)] mb-1">Frequency</label>
            <select
              value={form.frequency}
              onChange={(event) => setForm((prev) => ({ ...prev, frequency: event.target.value }))}
              className="w-full rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            >
              {frequencies.map((frequency) => (
                <option key={frequency} value={frequency}>
                  {frequency}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[var(--muted-text)] mb-1">Next Due Date</label>
            <input
              type="date"
              value={form.nextDueDate}
              onChange={(event) => setForm((prev) => ({ ...prev, nextDueDate: event.target.value }))}
              required
              className="w-full rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] px-3 py-2"
            />
          </div>

          <div className="md:col-span-5 flex gap-2">
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 text-white px-4 py-2 font-semibold hover:bg-emerald-600 transition"
            >
              {editingId ? 'Update Recurring' : 'Add Recurring'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setForm(createInitialForm())
                }}
                className="rounded-xl border border-[var(--border-color)] px-4 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Recurring Expense List</h3>
        {recurringList.length === 0 ? (
          <p className="text-sm text-[var(--muted-text)]">No recurring expenses configured yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted-text)] border-b border-[var(--border-color)]">
                <th className="pb-2">Title</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Frequency</th>
                <th className="pb-2">Next Due Date</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recurringList.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border-color)]/70">
                  <td className="py-3 font-medium">{item.title}</td>
                  <td className="py-3">₹{item.amount.toFixed(2)}</td>
                  <td className="py-3">{item.category}</td>
                  <td className="py-3">{item.frequency}</td>
                  <td className="py-3 text-[var(--muted-text)]">{item.nextDueDate}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        item.active
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300'
                          : 'bg-slate-500/20 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.active ? 'Active' : 'Paused'}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-3">
                    <button type="button" onClick={() => handleEdit(item)} className="text-violet-500 hover:text-violet-600">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleToggle(item)} className="text-amber-500 hover:text-amber-600">
                      {item.active ? 'Pause' : 'Activate'}
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id)} className="text-rose-500 hover:text-rose-600">
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

export default RecurringPage

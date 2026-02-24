import { useEffect, useState } from 'react'

function ExpenseModal({ onClose, onSave, expense, categories }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0] || 'Other')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => {
    if (expense) {
      setTitle(expense.title)
      setAmount(expense.amount)
      setCategory(expense.category)
      setDate(expense.date)
      return
    }

    setTitle('')
    setAmount('')
    setCategory(categories[0] || 'Other')
    setDate(new Date().toISOString().slice(0, 10))
  }, [expense, categories])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave({
      title,
      amount: parseFloat(amount),
      category,
      date,
    })
  }

  return (
    <div className="fixed inset-0 bg-slate-900/65 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-2xl">
        <h3 className="text-xl font-semibold mb-4">{expense ? 'Edit Expense' : 'Add Expense'}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--muted-text)] mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--muted-text)] mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--muted-text)] mb-1">Category</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-4 py-2"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-[var(--muted-text)] mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-4 py-2"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 rounded-xl bg-violet-500 text-white py-2.5 font-semibold hover:bg-violet-600">
              {expense ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] py-2.5 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExpenseModal

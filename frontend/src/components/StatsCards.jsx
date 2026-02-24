const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0)

function StatsCards({ total, count }) {
  const avg = count > 0 ? total / count : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
        <p className="text-sm text-[var(--muted-text)]">Total Expenses</p>
        <p className="text-2xl font-bold text-rose-500 mt-2">{formatCurrency(total)}</p>
      </div>

      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
        <p className="text-sm text-[var(--muted-text)]">Total Entries</p>
        <p className="text-2xl font-bold mt-2">{count}</p>
      </div>

      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
        <p className="text-sm text-[var(--muted-text)]">Average Expense</p>
        <p className="text-2xl font-bold text-violet-500 mt-2">{formatCurrency(avg)}</p>
      </div>
    </div>
  )
}

export default StatsCards

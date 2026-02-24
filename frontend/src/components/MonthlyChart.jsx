import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0)

function MonthlyChart({ data }) {
  const chartData = data.map((item) => ({
    month: MONTH_NAMES[item.month - 1],
    total: item.total,
  }))

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
      <h3 className="text-lg font-semibold mb-4">Monthly Expenses</h3>
      {chartData.length === 0 ? (
        <p className="text-sm text-[var(--muted-text)] py-10 text-center">No data to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" />
            <XAxis dataKey="month" stroke="var(--muted-text)" />
            <YAxis stroke="var(--muted-text)" />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="total" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default MonthlyChart

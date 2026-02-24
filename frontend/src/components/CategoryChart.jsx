import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#8b5cf6', '#ef4444', '#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6']

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0)

function CategoryChart({ data }) {
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.total,
  }))

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5">
      <h3 className="text-lg font-semibold mb-4">Category-wise Spend</h3>
      {chartData.length === 0 ? (
        <p className="text-sm text-[var(--muted-text)] py-10 text-center">No data to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={95} label>
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default CategoryChart

import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  getCurrentBudget,
  getExpenseMonthlySummary,
  getExpenses,
  getIncomeMonthlySummary,
  getIncomes,
} from '../services/api'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DONUT_COLORS = ['#10b981', '#ef4444', '#8b5cf6']

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0)

function Dashboard() {
  const { user } = useOutletContext()
  const [expenses, setExpenses] = useState([])
  const [incomes, setIncomes] = useState([])
  const [expenseMonthly, setExpenseMonthly] = useState([])
  const [incomeMonthly, setIncomeMonthly] = useState([])
  const [currentBudget, setCurrentBudget] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const now = new Date()
      const [expenseRes, incomeRes, expenseMonthRes, incomeMonthRes, budgetRes] = await Promise.all([
        getExpenses(user.id),
        getIncomes(user.id),
        getExpenseMonthlySummary(user.id),
        getIncomeMonthlySummary(user.id),
        getCurrentBudget(user.id, now.getMonth() + 1, now.getFullYear()),
      ])

      setExpenses(expenseRes.data)
      setIncomes(incomeRes.data)
      setExpenseMonthly(expenseMonthRes.data)
      setIncomeMonthly(incomeMonthRes.data)
      setCurrentBudget(budgetRes.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [user.id])

  const totals = useMemo(() => {
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0)
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0)
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    }
  }, [incomes, expenses])

  const recentTransactions = useMemo(() => {
    return [...incomes.map((item) => ({ ...item, type: 'Income' })), ...expenses.map((item) => ({ ...item, type: 'Expense' }))]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8)
  }, [incomes, expenses])

  const financialDonutData = useMemo(() => {
    const safeBalance = Math.max(totals.balance, 0)
    return [
      { name: 'Income', value: totals.totalIncome },
      { name: 'Expense', value: totals.totalExpense },
      { name: 'Remaining', value: safeBalance },
    ].filter((item) => item.value > 0)
  }, [totals])

  const monthlyComparisonData = useMemo(() => {
    const incomeMap = incomeMonthly.reduce((acc, item) => {
      acc[item.month] = item.total
      return acc
    }, {})

    const expenseMap = expenseMonthly.reduce((acc, item) => {
      acc[item.month] = item.total
      return acc
    }, {})

    return MONTHS.map((month, index) => ({
      month,
      income: incomeMap[index + 1] || 0,
      expense: expenseMap[index + 1] || 0,
    }))
  }, [incomeMonthly, expenseMonthly])

  const budgetPercent = currentBudget?.percentUsed || 0

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5 shadow-sm">
          <p className="text-sm text-[var(--muted-text)]">Total Balance</p>
          <p className={`text-2xl font-bold mt-2 ${totals.balance < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {formatCurrency(totals.balance)}
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5 shadow-sm">
          <p className="text-sm text-[var(--muted-text)]">Total Income</p>
          <p className="text-2xl font-bold mt-2 text-emerald-500">{formatCurrency(totals.totalIncome)}</p>
        </div>
        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5 shadow-sm">
          <p className="text-sm text-[var(--muted-text)]">Total Expense</p>
          <p className="text-2xl font-bold mt-2 text-rose-500">{formatCurrency(totals.totalExpense)}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5">
          <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
          {financialDonutData.length === 0 ? (
            <p className="text-[var(--muted-text)]">No transactions yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={financialDonutData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100}>
                  {financialDonutData.map((entry, index) => (
                    <Cell key={entry.name} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="xl:col-span-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5">
          <h3 className="text-lg font-semibold mb-4">Monthly Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyComparisonData}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--muted-text)" />
              <YAxis stroke="var(--muted-text)" />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5">
          <h3 className="text-lg font-semibold">Monthly Budget</h3>
          {!currentBudget ? (
            <p className="text-sm text-[var(--muted-text)] mt-4">No budget set for this month.</p>
          ) : (
            <>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-[var(--muted-text)] mb-2">
                  <span>{formatCurrency(currentBudget.spent)} spent</span>
                  <span>{formatCurrency(currentBudget.monthlyLimit)} limit</span>
                </div>
                <div className="h-3 rounded-full bg-[var(--surface-bg)] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      budgetPercent >= 100 ? 'bg-rose-500' : budgetPercent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                  />
                </div>
                <p className="text-sm mt-2 text-[var(--muted-text)]">{budgetPercent.toFixed(1)}% used</p>
              </div>

              {currentBudget.alertMessage && (
                <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/15 px-3 py-2 text-sm text-amber-600 dark:text-amber-300">
                  {currentBudget.alertMessage}
                </div>
              )}
            </>
          )}
        </div>

        <div className="xl:col-span-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          {loading ? (
            <p className="text-sm text-[var(--muted-text)]">Loading...</p>
          ) : recentTransactions.length === 0 ? (
            <p className="text-sm text-[var(--muted-text)]">No recent transactions.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--muted-text)] border-b border-[var(--border-color)]">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Title</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((item) => (
                    <tr key={`${item.type}-${item.id}`} className="border-b border-[var(--border-color)]/70">
                      <td className="py-3 text-[var(--muted-text)]">{item.date}</td>
                      <td className="py-3 font-medium">{item.title}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                            item.type === 'Income'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                              : 'bg-rose-500/15 text-rose-600 dark:text-rose-300'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td
                        className={`py-3 text-right font-semibold ${
                          item.type === 'Income' ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {item.type === 'Income' ? '+' : '-'} {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Dashboard

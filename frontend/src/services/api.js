import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
})

// Auth
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)

// Expense
export const getExpenses = (userId, category, startDate, endDate) => {
  const params = { userId }
  if (category) params.category = category
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate
  return API.get('/expenses', { params })
}

export const addExpense = (userId, data) => API.post('/expenses', data, { params: { userId } })
export const updateExpense = (userId, id, data) => API.put(`/expenses/${id}`, data, { params: { userId } })
export const deleteExpense = (userId, id) => API.delete(`/expenses/${id}`, { params: { userId } })
export const getExpenseMonthlySummary = (userId) => API.get('/expenses/monthly-summary', { params: { userId } })
export const getCategorySummary = (userId) => API.get('/expenses/category-summary', { params: { userId } })

// Income
export const getIncomes = (userId, source, startDate, endDate) => {
  const params = { userId }
  if (source) params.source = source
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate
  return API.get('/incomes', { params })
}

export const addIncome = (userId, data) => API.post('/incomes', data, { params: { userId } })
export const updateIncome = (userId, id, data) => API.put(`/incomes/${id}`, data, { params: { userId } })
export const deleteIncome = (userId, id) => API.delete(`/incomes/${id}`, { params: { userId } })
export const getIncomeMonthlySummary = (userId) => API.get('/incomes/monthly-summary', { params: { userId } })
export const getSourceSummary = (userId) => API.get('/incomes/source-summary', { params: { userId } })

// Budget
export const getBudgets = (userId) => API.get('/budgets', { params: { userId } })

export const getCurrentBudget = (userId, month, year) => {
  const params = { userId }
  if (month) params.month = month
  if (year) params.year = year
  return API.get('/budgets/current', { params })
}

export const setBudget = (userId, data) => API.post('/budgets', data, { params: { userId } })
export const deleteBudget = (userId, id) => API.delete(`/budgets/${id}`, { params: { userId } })

// Recurring
export const getRecurringExpenses = (userId) => API.get('/recurring', { params: { userId } })
export const addRecurringExpense = (userId, data) => API.post('/recurring', data, { params: { userId } })
export const updateRecurringExpense = (userId, id, data) =>
  API.put(`/recurring/${id}`, data, { params: { userId } })

export const toggleRecurringExpense = (userId, id, active) =>
  API.patch(`/recurring/${id}/active`, null, { params: { userId, active } })

export const deleteRecurringExpense = (userId, id) =>
  API.delete(`/recurring/${id}`, { params: { userId } })

export const processDueRecurringExpenses = () => API.post('/recurring/process-due')

// Reports
export const exportExcelReport = (userId) =>
  API.get('/reports/export', {
    params: { userId },
    responseType: 'blob',
  })

export default API

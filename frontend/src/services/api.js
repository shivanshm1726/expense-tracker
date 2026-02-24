import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
})

// ========== AUTH APIs ==========

export const registerUser = (data) => API.post('/auth/register', data)

export const loginUser = (data) => API.post('/auth/login', data)

// ========== EXPENSE APIs ==========

export const getExpenses = (userId, category, startDate, endDate) => {
  let params = { userId }
  if (category) params.category = category
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate
  return API.get('/expenses', { params })
}

export const addExpense = (userId, data) =>
  API.post('/expenses', data, { params: { userId } })

export const updateExpense = (userId, id, data) =>
  API.put(`/expenses/${id}`, data, { params: { userId } })

export const deleteExpense = (userId, id) =>
  API.delete(`/expenses/${id}`, { params: { userId } })

// ========== SUMMARY APIs ==========

export const getMonthlySummary = (userId) =>
  API.get('/expenses/monthly-summary', { params: { userId } })

export const getCategorySummary = (userId) =>
  API.get('/expenses/category-summary', { params: { userId } })

export default API

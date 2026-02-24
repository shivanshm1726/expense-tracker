function StatsCards({ total, count }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Expenses */}
      <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-indigo-500">
        <p className="text-sm text-gray-500">Total Expenses</p>
        <p className="text-2xl font-bold text-gray-800">₹{total.toFixed(2)}</p>
      </div>

      {/* Number of Expenses */}
      <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
        <p className="text-sm text-gray-500">Total Entries</p>
        <p className="text-2xl font-bold text-gray-800">{count}</p>
      </div>

      {/* Average */}
      <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-500">
        <p className="text-sm text-gray-500">Average Expense</p>
        <p className="text-2xl font-bold text-gray-800">
          ₹{count > 0 ? (total / count).toFixed(2) : '0.00'}
        </p>
      </div>
    </div>
  )
}

export default StatsCards

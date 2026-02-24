function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No expenses found. Click "+ Add Expense" to get started!
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2 font-medium">Title</th>
            <th className="pb-2 font-medium">Category</th>
            <th className="pb-2 font-medium">Amount</th>
            <th className="pb-2 font-medium">Date</th>
            <th className="pb-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id} className="border-b hover:bg-gray-50 transition">
              <td className="py-3 font-medium text-gray-800">{exp.title}</td>
              <td className="py-3">
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                  {exp.category}
                </span>
              </td>
              <td className="py-3 text-gray-800 font-semibold">₹{exp.amount.toFixed(2)}</td>
              <td className="py-3 text-gray-500">{exp.date}</td>
              <td className="py-3 text-right space-x-2">
                <button
                  onClick={() => onEdit(exp)}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(exp.id)}
                  className="text-red-600 hover:text-red-800 text-xs font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExpenseTable

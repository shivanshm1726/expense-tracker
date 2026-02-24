function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return <div className="text-center py-8 text-[var(--muted-text)]">No expenses found. Add one to get started.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[var(--muted-text)] border-b border-[var(--border-color)]">
            <th className="pb-2 font-medium">Title</th>
            <th className="pb-2 font-medium">Category</th>
            <th className="pb-2 font-medium">Amount</th>
            <th className="pb-2 font-medium">Date</th>
            <th className="pb-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b border-[var(--border-color)]/70">
              <td className="py-3 font-medium">{expense.title}</td>
              <td className="py-3">
                <span className="bg-violet-500/15 text-violet-600 dark:text-violet-300 text-xs px-2 py-1 rounded-full">
                  {expense.category}
                </span>
              </td>
              <td className="py-3 font-semibold text-rose-500">₹{expense.amount.toFixed(2)}</td>
              <td className="py-3 text-[var(--muted-text)]">{expense.date}</td>
              <td className="py-3 text-right space-x-3">
                <button type="button" onClick={() => onEdit(expense)} className="text-violet-500 hover:text-violet-600">
                  Edit
                </button>
                <button type="button" onClick={() => onDelete(expense.id)} className="text-rose-500 hover:text-rose-600">
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

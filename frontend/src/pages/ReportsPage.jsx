import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import toast from 'react-hot-toast'
import { exportExcelReport } from '../services/api'

function ReportsPage() {
  const { user } = useOutletContext()
  const [downloading, setDownloading] = useState(false)

  const handleExport = async () => {
    try {
      setDownloading(true)
      const response = await exportExcelReport(user.id)

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `money-manager-report-${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Excel report downloaded')
    } catch (error) {
      toast.error('Failed to export report')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-6">
        <h3 className="text-xl font-semibold">Excel Report Export</h3>
        <p className="text-sm text-[var(--muted-text)] mt-2">
          Download a multi-sheet workbook with Income, Expense, and Summary tabs for your account.
        </p>

        <ul className="mt-4 text-sm text-[var(--muted-text)] list-disc list-inside space-y-1">
          <li>Income Sheet: all recorded incomes</li>
          <li>Expense Sheet: all recorded expenses</li>
          <li>Summary Sheet: totals, balance, and monthly budget snapshot</li>
        </ul>

        <button
          type="button"
          onClick={handleExport}
          disabled={downloading}
          className="mt-6 rounded-xl bg-emerald-500 text-white px-5 py-2.5 font-semibold hover:bg-emerald-600 disabled:opacity-70 transition"
        >
          {downloading ? 'Preparing export...' : 'Download .xlsx Report'}
        </button>
      </section>

      <section className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-6">
        <h3 className="text-lg font-semibold">Report Scope</h3>
        <div className="mt-3 text-sm text-[var(--muted-text)] space-y-2">
          <p>User: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Generated on demand using current database data.</p>
        </div>
      </section>
    </div>
  )
}

export default ReportsPage

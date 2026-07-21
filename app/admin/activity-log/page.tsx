'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { formatDateTime } from '@/lib/utils'

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/api/admin/activity-log?page=${page}&limit=30`)
      setLogs(res.data.items || [])
      setTotal(res.data.total || 0)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page])

  const getActionIcon = (action: string) => {
    if (action.includes('user')) return '👤'
    if (action.includes('service')) return '🛠️'
    if (action.includes('setting')) return '⚙️'
    if (action.includes('balance') || action.includes('payment')) return '💰'
    if (action.includes('suspend') || action.includes('ban')) return '🚫'
    return '📋'
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Activity Log</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Immutable log of all admin actions</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2D2D50]">
                {['Timestamp', 'Admin', 'Action', 'Target', 'Details'].map(h => (
                  <th key={h} className="text-left text-[#6B7280] font-semibold px-4 py-3 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center text-[#6B7280] py-12">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16">
                  <div className="text-4xl mb-3">📋</div>
                  <div className="text-[#9CA3AF]">No activity logged yet</div>
                </td></tr>
              ) : logs.map(log => (
                <tr key={log.id} className="table-row">
                  <td className="px-4 py-3 text-[#6B7280] text-xs whitespace-nowrap">{formatDateTime(log.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="text-white text-sm font-medium">{log.admin_name}</div>
                    <div className="text-[#6B7280] text-xs">{log.admin_email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{getActionIcon(log.action)}</span>
                      <span className="text-white text-xs font-mono">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {log.target_type && (
                      <div>
                        <span className="badge bg-purple-500/20 text-purple-400 text-xs">{log.target_type}</span>
                        {log.target_id && <div className="text-[#6B7280] text-xs mt-1 font-mono">{String(log.target_id).slice(0, 8)}...</div>}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#9CA3AF] text-xs max-w-[200px]">
                    {log.details && Object.keys(log.details).length > 0 ? (
                      <details className="cursor-pointer">
                        <summary className="text-[#3B82F6] hover:underline">View details</summary>
                        <pre className="mt-2 text-[10px] text-[#9CA3AF] overflow-x-auto">{JSON.stringify(log.details, null, 2)}</pre>
                      </details>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {total > 30 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 text-sm">← Prev</button>
          <span className="px-4 py-2 text-[#9CA3AF] text-sm">Page {page}</span>
          <button disabled={page >= Math.ceil(total / 30)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 text-sm">Next →</button>
        </div>
      )}
    </div>
  )
}

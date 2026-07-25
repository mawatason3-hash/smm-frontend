'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'
import { PLATFORMS } from '@/types'
import PlatformIcon from '@/lib/platformIcons'

export default function AdminServicesPage() {
  const { showToast } = useToast()
  const [services, setServices] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editService, setEditService] = useState<any | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showProviderTools, setShowProviderTools] = useState(false)
  const [providerTool, setProviderTool] = useState('jap')
  const [providerToolAction, setProviderToolAction] = useState<'activate' | 'deactivate' | 'delete'>('deactivate')
  const [form, setForm] = useState({
    platform: '', name: '', rate_per_1k: '', cost_per_1k: '',
    min_qty: '100', max_qty: '100000', provider: '', provider_service_id: '',
    avg_speed: '1-2 hours', is_instant: false, refill_enabled: false,
    cancel_enabled: false, is_active: true, description: '', quality_badge: ''
  })

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '30' })
      if (search) params.set('search', search)
      if (platformFilter) params.set('platform', platformFilter)
      if (statusFilter) params.set('status', statusFilter)
      const res = await api.get(`/api/services/admin/all?${params}`)
      setServices(res.data.items)
      setTotal(res.data.total)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, platformFilter, statusFilter])
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t) }, [search])

  const openCreate = () => { setEditService(null); setForm({ platform: '', name: '', rate_per_1k: '', cost_per_1k: '', min_qty: '100', max_qty: '100000', provider: '', provider_service_id: '', avg_speed: '1-2 hours', is_instant: false, refill_enabled: false, cancel_enabled: false, is_active: true, description: '', quality_badge: '' }); setShowModal(true) }

  const openEdit = (svc: any) => {
    setEditService(svc)
    setForm({ platform: svc.platform, name: svc.name, rate_per_1k: String(svc.rate_per_1k), cost_per_1k: String(svc.cost_per_1k || ''), min_qty: String(svc.min_qty), max_qty: String(svc.max_qty), provider: svc.provider || '', provider_service_id: svc.provider_service_id || '', avg_speed: svc.avg_speed || '', is_instant: svc.is_instant, refill_enabled: svc.refill_enabled, cancel_enabled: svc.cancel_enabled, is_active: svc.is_active, description: svc.description || '', quality_badge: svc.quality_badge || '' })
    setShowModal(true)
  }

  const saveService = async () => {
    try {
      const payload = { ...form, rate_per_1k: parseFloat(form.rate_per_1k), cost_per_1k: form.cost_per_1k ? parseFloat(form.cost_per_1k) : undefined, min_qty: parseInt(form.min_qty), max_qty: parseInt(form.max_qty) }
      if (editService) { await api.put(`/api/services/admin/${editService.id}`, payload) } else { await api.post('/api/services/admin', payload) }
      showToast(editService ? 'Service updated' : 'Service created', 'success')
      setShowModal(false)
      load()
    } catch (err: any) { showToast(err?.response?.data?.detail || 'Failed', 'error') }
  }

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return
    try { await api.delete(`/api/services/admin/${id}`); showToast('Service deleted', 'success'); load() } catch { showToast('Delete failed', 'error') }
  }

  const syncProvider = async (provider: string) => {
    setSyncing(true)
    try {
      const res = await api.post(`/api/services/admin/sync/${provider}`)
      showToast(res.data.message, 'success')
      load()
    } catch (err: any) { showToast('Sync failed', 'error') }
    finally { setSyncing(false) }
  }

  const toggleSelected = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === services.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(services.map(svc => svc.id))
    }
  }

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (action === 'delete' && !confirm(`Delete ${selectedIds.length} services? This cannot be undone.`)) return

    try {
      const res = await api.post('/api/admin/services/bulk-action', {
        action,
        service_ids: selectedIds,
      })
      showToast(res.data.message, 'success')
      setSelectedIds([])
      load()
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Bulk action failed', 'error')
    }
  }

  const handleProviderToolAction = async () => {
    const confirmMessage = `This will ${providerToolAction} ALL services from ${providerTool === 'all' ? 'all providers' : providerTool}. Are you sure?`
    if (!confirm(confirmMessage)) return

    try {
      const res = await api.post('/api/admin/services/bulk-action', {
        action: providerToolAction,
        provider: providerTool,
      })
      showToast(res.data.message, 'success')
      setShowProviderTools(false)
      load()
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Provider action failed', 'error')
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Services</h1>
          <p className="text-[#9CA3AF] text-sm">{total} services</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => syncProvider('jap')} disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#3B82F6]/50 text-[#3B82F6] hover:bg-blue-500/10 text-sm transition-colors disabled:opacity-50">
            🔄 {syncing ? 'Syncing...' : 'Sync from JAP'}
          </button>
          <button onClick={() => setShowProviderTools(true)} className="px-4 py-2 rounded-xl border border-[#2D2D50] bg-[#1F1F3A] text-[#9CA3AF] hover:text-white text-sm">🔧 Provider Tools</button>
          <button onClick={openCreate} className="btn-primary text-sm px-5 py-2.5">+ Add Service</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input max-w-xs" placeholder="Search services..." />
        <div className="flex gap-1 bg-[#1F1F3A] rounded-xl p-1">
          {['active', 'inactive', ''].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? 'bg-[#3B82F6] text-white' : 'text-[#9CA3AF] hover:text-white'}`}>
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
          <div className="flex gap-1 flex-wrap">
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => setPlatformFilter(platformFilter === p.id ? '' : p.id)}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center text-base transition-all
                ${platformFilter === p.id ? 'border-[#3B82F6] bg-blue-500/10' : 'border-[#2D2D50] bg-[#1F1F3A]'}`}
              title={p.name}><PlatformIcon platform={p.id} size={18} /></button>
          ))}
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl mb-4" style={{ background: '#16162D', border: '1px solid #3B82F6' }}>
          <span className="text-white text-sm font-medium">
            {selectedIds.length} service{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <button onClick={() => handleBulkAction('activate')} className="btn-primary text-xs px-4 py-2">✅ Activate</button>
            <button onClick={() => handleBulkAction('deactivate')} className="text-xs px-4 py-2 rounded-lg bg-[#1F1F3A] text-white border border-[#2D2D50]">⏸️ Deactivate</button>
            <button onClick={() => handleBulkAction('delete')} className="text-xs px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40">🗑️ Delete</button>
            <button onClick={() => setSelectedIds([])} className="text-xs px-4 py-2 text-[#6B7280]">Clear</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2D2D50]">
                <th className="px-3 py-3 text-left">
                  <input type="checkbox" checked={services.length > 0 && selectedIds.length === services.length} onChange={toggleSelectAll} className="h-4 w-4 rounded border-[#2D2D50] bg-[#1F1F3A]" />
                </th>
                {['Platform', 'Service Name', 'Rate/1K', 'Cost/1K', 'Min', 'Max', 'Provider', 'Speed', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[#6B7280] font-semibold px-3 py-3 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="text-center text-[#6B7280] py-12">Loading...</td></tr>
              ) : services.map(svc => (
                <tr key={svc.id} className="table-row">
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selectedIds.includes(svc.id)} onChange={() => toggleSelected(svc.id)} className="h-4 w-4 rounded border-[#2D2D50] bg-[#1F1F3A]" />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{PLATFORMS.find(p => p.id === svc.platform)?.icon || '🌐'}</span>
                      <span className="text-[#9CA3AF] text-xs capitalize">{svc.platform}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-white max-w-[180px]"><div className="truncate">{svc.name}</div></td>
                  <td className="px-3 py-3 text-green-400 font-bold">${svc.rate_per_1k}</td>
                  <td className="px-3 py-3 text-[#9CA3AF]">{svc.cost_per_1k ? `$${svc.cost_per_1k}` : '—'}</td>
                  <td className="px-3 py-3 text-[#9CA3AF]">{svc.min_qty}</td>
                  <td className="px-3 py-3 text-[#9CA3AF]">{svc.max_qty?.toLocaleString()}</td>
                  <td className="px-3 py-3">
                    {svc.provider && <span className="badge bg-purple-500/20 text-purple-400 text-xs uppercase">{svc.provider}</span>}
                  </td>
                  <td className="px-3 py-3 text-[#9CA3AF] text-xs">{svc.avg_speed || '—'}</td>
                  <td className="px-3 py-3">
                    <span className={`badge ${svc.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {svc.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(svc)} className="px-2.5 py-1.5 rounded-lg bg-[#1F1F3A] hover:bg-[#2D2D50] text-[#9CA3AF] hover:text-white text-xs">Edit</button>
                      <button onClick={() => deleteService(svc.id)} className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {total > 30 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 text-sm">← Prev</button>
          <span className="px-4 py-2 text-[#9CA3AF] text-sm">Page {page}</span>
          <button disabled={page >= Math.ceil(total / 30)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-white disabled:opacity-40 text-sm">Next →</button>
        </div>
      )}

      {showProviderTools && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#2D2D50] p-6" style={{ background: '#16162D' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">Provider Tools</h2>
              <button onClick={() => setShowProviderTools(false)} className="text-[#6B7280] hover:text-white text-xl">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Provider</label>
                <select value={providerTool} onChange={e => setProviderTool(e.target.value)} className="input" style={{ appearance: 'none' }}>
                  <option value="jap">JAP</option>
                  <option value="smmwiz">SMMWiz</option>
                  <option value="all">All</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Action</label>
                <select value={providerToolAction} onChange={e => setProviderToolAction(e.target.value as any)} className="input" style={{ appearance: 'none' }}>
                  <option value="activate">Activate All</option>
                  <option value="deactivate">Deactivate All</option>
                  <option value="delete">Delete All</option>
                </select>
              </div>
              <button onClick={handleProviderToolAction} className={`w-full py-3 rounded-xl text-sm font-medium ${providerToolAction === 'delete' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'btn-primary'}`}>
                {providerToolAction === 'activate' ? '✅ Activate All' : providerToolAction === 'deactivate' ? '⏸️ Deactivate All' : '🗑️ Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-[#2D2D50] p-6 max-h-[90vh] overflow-y-auto" style={{ background: '#16162D' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">{editService ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#6B7280] hover:text-white text-xl">×</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Platform</label>
                <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))} className="input" style={{ appearance: 'none' }}>
                  <option value="">Select platform</option>
                  {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Service Name</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input" placeholder="e.g. Instagram Followers" />
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Rate per 1K (your price)</label>
                <input type="number" step="0.01" value={form.rate_per_1k} onChange={e => setForm(p => ({ ...p, rate_per_1k: e.target.value }))} className="input" placeholder="1.20" />
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Cost per 1K (provider price)</label>
                <input type="number" step="0.01" value={form.cost_per_1k} onChange={e => setForm(p => ({ ...p, cost_per_1k: e.target.value }))} className="input" placeholder="0.80" />
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Min Qty</label>
                <input type="number" value={form.min_qty} onChange={e => setForm(p => ({ ...p, min_qty: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Max Qty</label>
                <input type="number" value={form.max_qty} onChange={e => setForm(p => ({ ...p, max_qty: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Provider</label>
                <select value={form.provider} onChange={e => setForm(p => ({ ...p, provider: e.target.value }))} className="input" style={{ appearance: 'none' }}>
                  <option value="">None</option>
                  <option value="jap">JustAnotherPanel</option>
                  <option value="peakerr">Peakerr</option>
                  <option value="smmwiz">SMMWiz</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Provider Service ID</label>
                <input value={form.provider_service_id} onChange={e => setForm(p => ({ ...p, provider_service_id: e.target.value }))} className="input" placeholder="e.g. 123" />
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Avg Speed</label>
                <input value={form.avg_speed} onChange={e => setForm(p => ({ ...p, avg_speed: e.target.value }))} className="input" placeholder="Instant / 1-2 hours" />
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1">Quality Badge</label>
                <input value={form.quality_badge} onChange={e => setForm(p => ({ ...p, quality_badge: e.target.value }))} className="input" placeholder="High Quality / Best Seller" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-[#9CA3AF] mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input h-16 resize-none" />
              </div>
              <div className="sm:col-span-2 flex flex-wrap gap-4">
                {[
                  { key: 'is_instant', label: '⚡ Instant delivery' },
                  { key: 'refill_enabled', label: '🔄 Refill enabled' },
                  { key: 'cancel_enabled', label: '✕ Cancel enabled' },
                  { key: 'is_active', label: '✅ Active' },
                ].map(toggle => (
                  <label key={toggle.key} className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${(form as any)[toggle.key] ? 'bg-[#3B82F6] border-[#3B82F6]' : 'border-[#2D2D50]'}`}
                      onClick={() => setForm(p => ({ ...p, [toggle.key]: !(p as any)[toggle.key] }))}>
                      {(form as any)[toggle.key] && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-[#9CA3AF] text-sm">{toggle.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveService} className="btn-primary flex-1 py-3">
                {editService ? 'Save Changes' : 'Create Service'}
              </button>
              <button onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl border border-[#2D2D50] text-[#9CA3AF] hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import api from '@/lib/api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.boastlib.com'

const CODE_EXAMPLES: Record<string, string> = {
  cURL: `curl -X POST "${API_BASE}/api/v2" \\
  -d "key=YOUR_API_KEY&action=services"`,
  PHP: `<?php
$ch = curl_init('${API_BASE}/api/v2');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
  'key' => 'YOUR_API_KEY',
  'action' => 'services'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = json_decode(curl_exec($ch));`,
  Python: `import requests

response = requests.post('${API_BASE}/api/v2', data={
  'key': 'YOUR_API_KEY',
  'action': 'services'
})
data = response.json()
print(data)`,
  'Node.js': `const axios = require('axios')

const res = await axios.post('${API_BASE}/api/v2', 
  new URLSearchParams({
    key: 'YOUR_API_KEY',
    action: 'services'
  })
)
console.log(res.data)`,
}

const ENDPOINTS = [
  {
    method: 'GET', action: 'services', desc: 'Get all available services',
    params: 'key (required)',
    example: `[{"service":"1","name":"Instagram Followers","type":"instagram","rate":"1.20","min":"100","max":"100000"}]`
  },
  {
    method: 'POST', action: 'add', desc: 'Place a new order',
    params: 'key, service, link, quantity (all required)',
    example: `{"order": 10001}`
  },
  {
    method: 'GET', action: 'status', desc: 'Check order status',
    params: 'key, order (required)',
    example: `{"charge":"1.20","start_count":"500","status":"In progress","remains":"800","currency":"USD"}`
  },
  {
    method: 'GET', action: 'balance', desc: 'Check your balance',
    params: 'key (required)',
    example: `{"balance":"24.50","currency":"USD"}`
  },
]

export default function DeveloperPage() {
  const { user, refreshUser } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('cURL')
  const [enablingDev, setEnablingDev] = useState(false)
  const [devInfo, setDevInfo] = useState('')

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    showToast('Copied to clipboard!', 'success')
  }

  const enableDeveloper = async () => {
    setEnablingDev(true)
    try {
      await api.put('/api/admin/users/' + user?.id, { is_developer: true, developer_info: devInfo })
      await refreshUser()
      showToast('Developer access enabled!', 'success')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to enable developer access', 'error')
    } finally { setEnablingDev(false) }
  }

  const regenerateKey = async () => {
    showToast('API key regeneration coming soon', 'info')
  }

  if (!user?.is_developer) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-black text-white">Developer API</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Integrate BOASTLIB into your own panel</p>
        </div>
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">🔑</div>
          <h2 className="text-white font-bold text-xl mb-2">Enable Developer Access</h2>
          <p className="text-[#9CA3AF] text-sm mb-6 max-w-md mx-auto">
            Get API access to integrate BOASTLIB services into your own panel or application. 
            Standard SMM API v2 format — compatible with all major panels.
          </p>
          <div className="max-w-sm mx-auto mb-4">
            <textarea value={devInfo} onChange={e => setDevInfo(e.target.value)}
              className="input text-sm h-24 resize-none" placeholder="Tell us about your project (optional)..." />
          </div>
          <button onClick={enableDeveloper} disabled={enablingDev} className="btn-primary px-8 py-3">
            {enablingDev ? 'Enabling...' : 'Enable Developer Access'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Developer API</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Integrate BOASTLIB into your own panel or application</p>
      </div>

      {/* API Key */}
      <div className="card">
        <h2 className="text-white font-bold mb-4">Your API Key</h2>
        <div className="flex gap-2 mb-3">
          <input readOnly value={user?.api_key || ''} type="password"
            className="input font-mono text-sm" id="api-key-input" />
          <button onClick={() => {
            const inp = document.getElementById('api-key-input') as HTMLInputElement
            inp.type = inp.type === 'password' ? 'text' : 'password'
          }} className="px-3 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-[#9CA3AF] hover:text-white text-sm">Show</button>
          <button onClick={() => copy(user?.api_key || '')} className="btn-primary px-4 text-sm">Copy</button>
          <button onClick={regenerateKey} className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-sm">⚠️ Regen</button>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
          <span>Keep your API key secret — never share it publicly</span>
        </div>
      </div>

      {/* Base URL */}
      <div className="card">
        <h2 className="text-white font-bold mb-3">Base URL</h2>
        <div className="flex gap-2">
          <div className="flex-1 p-3 rounded-xl font-mono text-sm text-green-400" style={{ background: '#0D1117', border: '1px solid #2D2D50' }}>
            POST {API_BASE}/api/v2
          </div>
          <button onClick={() => copy(`${API_BASE}/api/v2`)} className="px-4 py-2 rounded-xl bg-[#1F1F3A] border border-[#2D2D50] text-[#9CA3AF] hover:text-white text-sm">Copy</button>
        </div>
      </div>

      {/* Endpoints */}
      <div className="grid sm:grid-cols-2 gap-4">
        {ENDPOINTS.map(ep => (
          <div key={ep.action} className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-blue-500/20 text-blue-400 text-xs">{ep.method}</span>
              <span className="text-white font-mono font-bold">action={ep.action}</span>
            </div>
            <p className="text-[#9CA3AF] text-xs mb-3">{ep.desc}</p>
            <div className="text-xs text-[#6B7280] mb-2">Params: {ep.params}</div>
            <div className="p-3 rounded-lg text-xs font-mono text-green-400 overflow-x-auto" style={{ background: '#0D1117', border: '1px solid #2D2D50' }}>
              {ep.example}
            </div>
          </div>
        ))}
      </div>

      {/* Code examples */}
      <div className="card">
        <h2 className="text-white font-bold mb-4">Code Examples</h2>
        <div className="flex gap-1 mb-4 bg-[#1F1F3A] rounded-xl p-1 w-fit">
          {Object.keys(CODE_EXAMPLES).map(lang => (
            <button key={lang} onClick={() => setActiveTab(lang)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === lang ? 'bg-[#3B82F6] text-white' : 'text-[#9CA3AF] hover:text-white'}`}>
              {lang}
            </button>
          ))}
        </div>
        <div className="relative">
          <pre className="p-4 rounded-xl text-xs font-mono text-green-400 overflow-x-auto leading-relaxed" style={{ background: '#0D1117', border: '1px solid #2D2D50' }}>
            {CODE_EXAMPLES[activeTab]?.replace('YOUR_API_KEY', user?.api_key || 'YOUR_API_KEY')}
          </pre>
          <button onClick={() => copy(CODE_EXAMPLES[activeTab]?.replace('YOUR_API_KEY', user?.api_key || '') || '')}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-[#2D2D50] text-[#9CA3AF] hover:text-white text-xs">
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

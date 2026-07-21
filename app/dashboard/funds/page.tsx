'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { formatCurrency } from '@/lib/utils'

const QUICK_AMOUNTS = [5, 10, 25, 50, 100]

export default function AddFundsPage() {
  const { user, refreshUser } = useAuth()
  const { showToast } = useToast()
  const [methods, setMethods] = useState<any[]>([])
  const [selectedMethod, setSelectedMethod] = useState('')
  const [amount, setAmount] = useState(10)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    api.get('/api/payments/methods').then(res => {
      setMethods(res.data.methods)
      if (res.data.methods.length > 0) setSelectedMethod(res.data.methods[0].id)
    }).catch(() => {
      setMethods([
        { id: 'paystack', name: 'Credit/Debit Card', description: 'Visa, Mastercard via Paystack', icon: '💳', instant: true },
        { id: 'crypto', name: 'Cryptocurrency', description: 'Bitcoin, USDT TRC20', icon: '₿', instant: false },
      ])
      setSelectedMethod('paystack')
    })
    api.get('/api/transactions?limit=5').then(res => setTransactions(res.data.items || [])).catch(() => {})
  }, [])

  const handlePay = async () => {
    if (amount < 1) { showToast('Minimum deposit is $1', 'error'); return }
    setLoading(true)
    try {
      if (selectedMethod === 'paystack') {
        const res = await api.post('/api/payments/paystack/initialize', { amount, payment_method: 'paystack' })
        window.location.href = res.data.authorization_url
      } else if (selectedMethod === 'dodopayments') {
        const res = await api.post('/api/payments/dodopayments/initialize', { amount, payment_method: 'dodopayments' })
        window.location.href = res.data.checkout_url
      } else if (selectedMethod.startsWith('pawapay_')) {
        if (!phone) { showToast('Phone number required for mobile money', 'error'); setLoading(false); return }
        const res = await api.post('/api/payments/pawapay/initiate', {
          amount, payment_method: selectedMethod, phone, country: user?.country
        })
        showToast(`📱 Payment prompt sent to ${phone}. Check your phone!`, 'info')
      } else {
        showToast('Payment method coming soon', 'info')
      }
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Payment failed to initialize', 'error')
    } finally { setLoading(false) }
  }

  const isMobileMoney = selectedMethod.startsWith('pawapay_')

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Add Funds</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Top up your BOASTLIB wallet</p>
      </div>

      {/* Current balance */}
      <div className="card bg-gradient-to-r from-[#16162D] to-[#1E1E3A]">
        <div className="text-[#9CA3AF] text-sm mb-1">Current Balance</div>
        <div className="text-4xl font-black text-white">{formatCurrency(user?.balance || 0)}</div>
        <div className="text-[#6B7280] text-xs mt-1">Available for orders</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Payment method */}
          <div className="card">
            <h2 className="text-white font-bold mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {methods.map(method => (
                <button key={method.id} onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-xl border text-left transition-all relative
                    ${selectedMethod === method.id
                      ? 'border-[#3B82F6] bg-blue-500/10'
                      : 'border-[#2D2D50] bg-[#1F1F3A] hover:border-[#3B82F6]/50'}`}>
                  {selectedMethod === method.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-xs">✓</div>
                  )}
                  <div className="text-2xl mb-2">{method.icon}</div>
                  <div className="text-white text-sm font-semibold leading-tight">{method.name}</div>
                  <div className="text-[#6B7280] text-xs mt-0.5">{method.description}</div>
                  {method.instant && <div className="mt-2 text-[10px] text-green-400 font-semibold">⚡ Instant</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile money phone */}
          {isMobileMoney && (
            <div className="card">
              <h2 className="text-white font-bold mb-3">Mobile Money Number</h2>
              <p className="text-[#9CA3AF] text-sm mb-3">Enter the phone number to receive the payment prompt</p>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="input" placeholder="+250 7XX XXX XXX" />
            </div>
          )}

          {/* Amount */}
          <div className="card">
            <h2 className="text-white font-bold mb-4">Amount (USD)</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_AMOUNTS.map(a => (
                <button key={a} onClick={() => setAmount(a)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all
                    ${amount === a ? 'border-[#3B82F6] bg-blue-500/10 text-white' : 'border-[#2D2D50] bg-[#1F1F3A] text-[#9CA3AF] hover:border-[#3B82F6]/50'}`}>
                  ${a}
                </button>
              ))}
            </div>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
              min={1} className="input" placeholder="Custom amount" />
            {amount >= 50 && (
              <div className="mt-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                🎉 Add $50+ and enjoy priority order processing!
              </div>
            )}
          </div>
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="card sticky top-4">
            <h2 className="text-white font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#9CA3AF]">Amount</span><span className="text-white">{formatCurrency(amount)}</span></div>
              <div className="flex justify-between"><span className="text-[#9CA3AF]">Processing fee</span><span className="text-green-400">$0.00</span></div>
              <div className="border-t border-[#2D2D50] pt-3 flex justify-between">
                <span className="text-white font-bold">Total Credited</span>
                <span className="text-white font-black text-lg">{formatCurrency(amount)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
              <div className="text-green-400 font-bold text-sm">You Save $0!</div>
              <div className="text-[#9CA3AF] text-xs">No hidden fees ever</div>
            </div>

            <button onClick={handlePay} disabled={loading || amount < 1}
              className="btn-primary w-full py-3.5 mt-4">
              {loading ? 'Processing...' : `Proceed to Payment — ${formatCurrency(amount)}`}
            </button>

            <div className="flex items-center justify-center gap-4 mt-4 text-[#6B7280] text-xs">
              <span>🔒 SSL Secured</span>
              <span>⚡ Instant Credit</span>
              <span>✅ Safe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      {transactions.length > 0 && (
        <div className="card">
          <h2 className="text-white font-bold mb-4">Recent Deposits</h2>
          <div className="space-y-2">
            {transactions.filter(tx => tx.type === 'deposit').map(tx => (
              <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#1F1F3A]">
                <span className="text-green-400 text-lg">💰</span>
                <div className="flex-1">
                  <div className="text-white text-sm">{tx.description || 'Wallet deposit'}</div>
                  <div className="text-[#6B7280] text-xs">{tx.payment_method} · {new Date(tx.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">+{formatCurrency(tx.amount)}</div>
                  <span className={`badge text-xs ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

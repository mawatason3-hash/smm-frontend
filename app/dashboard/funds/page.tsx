'use client'
import { useCallback, useEffect, useState } from 'react'
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
  const [manualSettings, setManualSettings] = useState<any>(null)
  const [myManualPayments, setMyManualPayments] = useState<any[]>([])
  const [manualPaymentStatusMap, setManualPaymentStatusMap] = useState<Record<string, string>>({})
  const [paystackPreview, setPaystackPreview] = useState<any>(null)
  const [pawapayPreview, setPawapayPreview] = useState<any>(null)
  const isLiberia = user?.country === 'Liberia'
  
  // Manual payment form state
  const [manualAmount, setManualAmount] = useState(10)
  const [manualNetwork, setManualNetwork] = useState('MTN_LIBERIA')
  const [manualPhone, setManualPhone] = useState('')
  const [manualTransactionId, setManualTransactionId] = useState('')
  const [manualNote, setManualNote] = useState('')
  const [manualLoading, setManualLoading] = useState(false)

  const loadPaymentMethods = useCallback(async () => {
    try {
      const res = await api.get('/api/payments/methods')
      const paymentMethods = res.data.methods
      
      const hasPawaPayMethod = paymentMethods.some((method: any) => method.id.startsWith('pawapay_'))
      if (user?.country === 'Liberia' || !hasPawaPayMethod) {
        paymentMethods.push({
          id: 'manual_transfer',
          name: 'Manual Transfer',
          description: user?.country === 'Liberia'
            ? 'MTN Lonestar or Orange Money'
            : 'Request country-specific payment instructions',
          icon: user?.country === 'Liberia' ? '🇱🇷' : '📲',
          instant: false,
          badge: user?.country === 'Liberia' ? 'Manual — 4-10 min' : 'Manual request'
        })
      }

      setMethods(paymentMethods)
      setSelectedMethod(prevSelected => {
        if (prevSelected && paymentMethods.some((m: any) => m.id === prevSelected)) {
          return prevSelected
        }
        return paymentMethods.length > 0 ? paymentMethods[0].id : ''
      })
    } catch (err) {
      setMethods([
        { id: 'paystack', name: 'Credit/Debit Card', description: 'Visa, Mastercard via Paystack', icon: '💳', instant: true },
        { id: 'manual_transfer', name: 'Manual Transfer', description: 'Bank transfer or mobile money', icon: '📲', instant: false },
      ])
      setSelectedMethod(prevSelected => prevSelected || 'paystack')
    }
  }, [user?.country])

  const loadTransactionHistory = useCallback(async () => {
    try {
      const res = await api.get('/api/transactions?limit=5')
      setTransactions(res.data.items || [])
    } catch (err) {}
  }, [])

  const loadManualSettings = useCallback(async () => {
    try {
      const res = await api.get('/api/payments/manual/settings', {
        params: { country: user?.country }
      })
      setManualSettings(res.data)
    } catch (err) {}
  }, [user?.country])

  const loadMyManualPayments = useCallback(async (showApprovalNotifications = true) => {
    try {
      const res = await api.get('/api/payments/manual/my-requests')
      const items = res.data.items || []

      if (showApprovalNotifications) {
        const newlyApproved = items.filter((item: any) =>
          manualPaymentStatusMap[item.id] === 'pending' && item.status === 'approved'
        )

        if (newlyApproved.length > 0) {
          newlyApproved.forEach((item: any) => {
            showToast(
              `✅ Your manual payment of $${item.amount} was approved and credited.`,
              'success'
            )
          })
          await refreshUser()
          loadTransactionHistory()
        }
      }

      setMyManualPayments(items)
      setManualPaymentStatusMap(
        items.reduce((acc: Record<string, string>, item: any) => ({
          ...acc,
          [item.id]: item.status
        }), {})
      )
    } catch (err) {}
  }, [manualPaymentStatusMap, refreshUser, showToast, loadTransactionHistory])

  useEffect(() => {
    loadPaymentMethods()
    loadTransactionHistory()
    loadManualSettings()
    loadMyManualPayments(false)
  }, [loadPaymentMethods, loadTransactionHistory, loadManualSettings, loadMyManualPayments])

  useEffect(() => {
    const handleFocus = () => loadMyManualPayments()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [loadMyManualPayments])

  useEffect(() => {
    if (!myManualPayments.some(payment => payment.status === 'pending')) {
      return
    }

    const interval = window.setInterval(() => {
      loadMyManualPayments()
    }, 15000)

    return () => window.clearInterval(interval)
  }, [myManualPayments, loadMyManualPayments])

  const handlePay = async () => {
    if (amount < 1) { showToast('Minimum deposit is $1', 'error'); return }
    setLoading(true)
    try {
      if (selectedMethod === 'paystack') {
        const res = await api.post('/api/payments/paystack/initialize', { amount, payment_method: 'paystack' })
        window.location.href = res.data.authorization_url
      } else if (selectedMethod.startsWith('pawapay_')) {
        if (!phone) { showToast('Phone number required for mobile money', 'error'); setLoading(false); return }
        const res = await api.post('/api/payments/pawapay/initiate', {
          amount, payment_method: selectedMethod, phone, country: user?.country
        })

        if (res.data?.status === 'ACCEPTED') {
          showToast(
            `✅ Deposit request accepted. Your pending deposit is now recorded and balance will refresh when the webhook confirms payment.`,
            'success'
          )
        } else {
          showToast(`📱 Payment prompt sent to ${phone}. Check your phone!`, 'info')
        }

        await refreshUser()
        loadTransactionHistory()
      } else if (selectedMethod === 'manual_transfer' || selectedMethod === 'manual_liberia') {
        showToast(
          isLiberia
            ? 'Fill in the form below to submit your manual payment.'
            : 'Submit your manual request and admin will send payment instructions for your country.',
          'info'
        )
      } else {
        showToast('Payment method coming soon', 'info')
      }
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Payment failed to initialize', 'error')
    } finally { setLoading(false) }
  }

  const handleManualSubmit = async () => {
    if (manualAmount < 1) { showToast('Minimum amount is $1', 'error'); return }
    if (!manualPhone) { showToast('Phone number required', 'error'); return }
    if (isLiberia && !manualNetwork) { showToast('Network is required for Liberia manual payments', 'error'); return }
    
    setManualLoading(true)
    try {
      const res = await api.post('/api/payments/manual/submit', {
        amount: manualAmount,
        network: isLiberia ? manualNetwork : undefined,
        phone_used: manualPhone,
        transaction_id: isLiberia ? manualTransactionId : manualTransactionId || undefined,
        proof_note: manualNote
      })
      showToast(
        res.data.message ||
        (isLiberia
          ? '✅ Payment submitted! Admin will review within 4-10 minutes'
          : '✅ Your request has been submitted. Admin will send payment instructions for your country.'),
        'success'
      )
      setManualAmount(10)
      setManualPhone('')
      setManualTransactionId('')
      setManualNote('')
      loadMyManualPayments()
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Failed to submit payment', 'error')
    } finally { setManualLoading(false) }
  }

  const isMobileMoney = selectedMethod.startsWith('pawapay_')
  const isManualTransfer = selectedMethod === 'manual_transfer' || selectedMethod === 'manual_liberia'

  useEffect(() => {
    const loadPaymentPreview = async () => {
      setPaystackPreview(null)
      setPawapayPreview(null)

      if (amount < 1) {
        return
      }

      try {
        if (selectedMethod === 'paystack') {
          const res = await api.post('/api/payments/paystack/preview', { amount, payment_method: 'paystack' })
          setPaystackPreview({
            ...res.data,
            display_text: res.data.currency_local && res.data.currency_local !== 'USD'
              ? `You are paying $${amount} USD. Paystack will charge ${res.data.amount_local} ${res.data.currency_local} during checkout.`
              : res.data.display_text
          })
          return
        }

        if (selectedMethod.startsWith('pawapay_')) {
          const res = await api.post('/api/payments/pawapay/preview', {
            amount,
            payment_method: selectedMethod,
            country: user?.country
          })
          setPawapayPreview(res.data)
        }
      } catch (err) {
        setPaystackPreview(null)
        setPawapayPreview(null)
      }
    }

    loadPaymentPreview()
  }, [selectedMethod, amount, user?.country])

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {process.env.NODE_ENV !== 'production' && (
        <div className="rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-yellow-100 text-sm">
          🧪 TEST MODE — Payments are simulated. Use test credentials only.
        </div>
      )}
      <div>
        <h1 className="text-2xl font-black text-white">Add Funds</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Top up your BOASTLIB wallet</p>
      </div>

      <div className="card bg-gradient-to-r from-[#16162D] to-[#1E1E3A]">
        <div className="text-[#9CA3AF] text-sm mb-1">Current Balance</div>
        <div className="text-4xl font-black text-white">{formatCurrency(user?.balance || 0)}</div>
        <div className="text-[#6B7280] text-xs mt-1">Available for orders</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
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
                  <div className={`text-2xl mb-2 ${method.id === 'manual_liberia' && selectedMethod === method.id ? 'text-green-400' : ''}`}>{method.icon}</div>
                  <div className="text-white text-sm font-semibold leading-tight">{method.name}</div>
                  <div className="text-[#6B7280] text-xs mt-0.5">{method.description}</div>
                  {method.instant && <div className="mt-2 text-[10px] text-green-400 font-semibold">⚡ Instant</div>}
                  {method.badge && <div className="mt-2 text-[10px] text-yellow-400 font-semibold">{method.badge}</div>}
                </button>
              ))}
            </div>
          </div>

          {isMobileMoney && (
            <div className="card">
              <h2 className="text-white font-bold mb-3">Mobile Money Number</h2>
              <p className="text-[#9CA3AF] text-sm mb-3">Enter the phone number to receive the payment prompt</p>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="input" placeholder="+250 7XX XXX XXX" />
            </div>
          )}

          {isManualTransfer && manualSettings && (
            <div className="card space-y-4">
              <div>
                <h3 className="text-white font-bold mb-3">📱 Send Mobile Money to BOASTLIB</h3>
                
                <div className="mb-4 p-3 rounded-xl bg-[#1F1F3A] border border-[#2D2D50]">
                  {isLiberia ? (
                    <>
                      <div className="text-[#9CA3AF] text-xs font-semibold mb-2">Step 1: Send money to our number</div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-[#6B7280] text-xs mb-1">MTN Lonestar</div>
                          <div className="flex items-center gap-2">
                            <div className="text-white font-mono font-bold text-sm">{manualSettings.mtn_number || '0555166954'}</div>
                            <button onClick={() => {
                              navigator.clipboard.writeText(manualSettings.mtn_number || '0555166954')
                              showToast('Copied to clipboard!', 'success')
                            }} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold hover:bg-blue-500/30">Copy</button>
                          </div>
                        </div>
                        {manualSettings.orange_number && (
                          <div>
                            <div className="text-[#6B7280] text-xs mb-1">Orange Money</div>
                            <div className="flex items-center gap-2">
                              <div className="text-white font-mono font-bold text-sm">{manualSettings.orange_number}</div>
                              <button onClick={() => {
                                navigator.clipboard.writeText(manualSettings.orange_number)
                                showToast('Copied to clipboard!', 'success')
                              }} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold hover:bg-blue-500/30">Copy</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[#9CA3AF] text-xs font-semibold mb-2">Request payment instructions for your country</div>
                      <div className="text-[#9CA3AF] text-sm mb-3">{manualSettings.instructions || 'Submit your request and our admin will send the right payment method or number for your country.'}</div>
                    </>
                  )}
                </div>

                <div className="text-[#9CA3AF] text-xs font-semibold mb-3">Step 2: Submit your proof below</div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-white text-xs font-semibold">Amount you sent (USD)</label>
                    <input type="number" value={manualAmount} onChange={e => setManualAmount(Number(e.target.value))}
                      min={1} className="input mt-1" placeholder="10" />
                  </div>

                  <div>
                    <label className="text-white text-xs font-semibold">Your phone number</label>
                    <input type="tel" value={manualPhone} onChange={e => setManualPhone(e.target.value)}
                      className="input mt-1" placeholder="+231 88X XXX XXX" />
                  </div>

                  {isLiberia ? (
                    <>
                      <div>
                        <label className="text-white text-xs font-semibold">Network</label>
                        <select value={manualNetwork} onChange={e => setManualNetwork(e.target.value)}
                          className="input mt-1">
                          <option value="MTN_LIBERIA">MTN Lonestar</option>
                          <option value="ORANGE_LIBERIA">Orange Money</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-white text-xs font-semibold">
                          Transaction ID (optional)
                        </label>
                        <input type="text" value={manualTransactionId} onChange={e => setManualTransactionId(e.target.value)}
                          className="input mt-1" placeholder="Optional transaction ID from SMS receipt" />
                      </div>

                      <div>
                        <label className="text-white text-xs font-semibold">Note (optional)</label>
                        <textarea value={manualNote} onChange={e => setManualNote(e.target.value)}
                          className="input mt-1 resize-none" placeholder="Any additional details..." rows={2} />
                      </div>
                    </>
                  ) : null}

                  <button onClick={handleManualSubmit} disabled={manualLoading}
                    className="btn-primary w-full py-3">
                    {manualLoading ? 'Submitting...' : isLiberia ? '✓ Submit for Review' : '✓ Request Instructions'}
                  </button>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <div className="text-[#9CA3AF] text-xs font-semibold mb-2">Step 3: Contact us with screenshot</div>
                  <div className="flex gap-2">
                    <a href={`https://wa.me/${manualSettings.whatsapp?.replace(/[^\d+]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 rounded text-xs font-semibold text-center hover:bg-green-500/30">
                      💬 WhatsApp
                    </a>
                    <a href={manualSettings.telegram} target="_blank" rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold text-center hover:bg-blue-500/30">
                      📱 Telegram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isManualTransfer && (
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
          )}
        </div>

        {!isManualTransfer && (
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

              {(paystackPreview?.display_text || pawapayPreview?.display_text) && (
                <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center text-sm text-blue-100">
                  {paystackPreview?.display_text || pawapayPreview?.display_text}
                </div>
              )}

              <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                <div className="text-green-400 font-bold text-sm">You Save $0!</div>
                <div className="text-[#9CA3AF] text-xs">No hidden fees ever</div>
              </div>

              <button onClick={handlePay} disabled={loading || amount < 1 || !selectedMethod}
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
        )}
      </div>

      {myManualPayments.length > 0 && (
        <div className="card">
          <h2 className="text-white font-bold mb-4">📋 Your Manual Payment Submissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D2D50] text-[#9CA3AF]">
                  <th className="text-left py-2 px-3 font-semibold">Date</th>
                  <th className="text-left py-2 px-3 font-semibold">Network</th>
                  <th className="text-right py-2 px-3 font-semibold">Amount</th>
                  <th className="text-left py-2 px-3 font-semibold">Tx ID</th>
                  <th className="text-left py-2 px-3 font-semibold">Status</th>
                  <th className="text-left py-2 px-3 font-semibold">Admin Note</th>
                </tr>
              </thead>
              <tbody>
                {myManualPayments.map(payment => (
                  <tr key={payment.id} className="border-b border-[#2D2D50] hover:bg-[#1F1F3A]">
                    <td className="py-3 px-3 text-white">{new Date(payment.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-3 text-white">{payment.network === 'MTN_LIBERIA' ? 'MTN Lonestar' : 'Orange Money'}</td>
                    <td className="py-3 px-3 text-right text-green-400 font-bold">${payment.amount}</td>
                    <td className="py-3 px-3 text-[#9CA3AF] font-mono text-xs">{payment.transaction_id}</td>
                    <td className="py-3 px-3">
                      {payment.status === 'pending' && <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-semibold">⏳ Pending</span>}
                      {payment.status === 'approved' && <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">✅ Credited</span>}
                      {payment.status === 'rejected' && <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold">❌ Rejected</span>}
                    </td>
                    <td className="py-3 px-3 text-[#9CA3AF] text-xs">{payment.admin_note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

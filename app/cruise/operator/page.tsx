'use client'

import { useEffect, useState } from 'react'

export default function OperatorDashboard() {
  const [apiKey, setApiKey] = useState('')
  const [authed, setAuthed] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [redeemRef, setRedeemRef] = useState('')
  const [redeemResult, setRedeemResult] = useState<{ ok: boolean; message: string } | null>(null)
  const [tab, setTab] = useState<'products' | 'bookings' | 'redeem'>('bookings')

  useEffect(() => {
    const saved = localStorage.getItem('hc_operator_key')
    if (saved) { setApiKey(saved); setAuthed(true) }
  }, [])

  useEffect(() => {
    if (!authed || !apiKey) return
    localStorage.setItem('hc_operator_key', apiKey)

    fetch(`/api/cruise/products?api_key=${apiKey}`).then(r => r.json()).then(d => Array.isArray(d) && setProducts(d))
    fetch(`/api/cruise/bookings`).then(r => r.json()).then(d => Array.isArray(d) && setBookings(d))
  }, [authed, apiKey])

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-sm">
          <h1 className="text-xl font-bold mb-4">Operator Login</h1>
          <input type="text" placeholder="API Key" value={apiKey} onChange={e => setApiKey(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-3" />
          <button onClick={() => apiKey && setAuthed(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium">Sign In</button>
        </div>
      </div>
    )
  }

  const todayBookings = bookings.filter(b => b.booked_at?.startsWith(new Date().toISOString().split('T')[0]))
  const monthRevenue = bookings
    .filter(b => b.status !== 'cancelled' && b.booked_at?.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((s, b) => s + Number(b.total_price_eur), 0)

  async function handleRedeem() {
    setRedeemResult(null)
    try {
      const res = await fetch('/api/cruise/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
        body: JSON.stringify({ booking_ref: redeemRef }),
      })
      const data = await res.json()
      setRedeemResult({ ok: res.ok, message: res.ok ? `✅ Redeemed: ${redeemRef}` : `❌ ${data.error}` })
      if (res.ok) setRedeemRef('')
    } catch {
      setRedeemResult({ ok: false, message: '❌ Network error' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">Operator Dashboard</h1>
        <div className="flex gap-4 mt-2 text-sm">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Today: {todayBookings.length} bookings</span>
          <span className="bg-green-50 text-green-700 px-2 py-1 rounded">This month: €{monthRevenue.toFixed(2)}</span>
        </div>
      </header>

      <nav className="flex border-b bg-white">
        {(['bookings', 'products', 'redeem'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium capitalize ${tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            {t}
          </button>
        ))}
      </nav>

      <main className="p-4">
        {tab === 'products' && (
          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-lg border p-3">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-600">€{p.price_adult_eur} · {p.duration_minutes}min · {p.product_type}</p>
              </div>
            ))}
            {products.length === 0 && <p className="text-gray-500 text-center py-8">No products yet.</p>}
          </div>
        )}

        {tab === 'bookings' && (
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-lg border p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{b.guest_name}</p>
                    <p className="text-sm text-gray-600">{b.cruise_products?.name}</p>
                    <p className="text-xs text-gray-400">Ref: {b.booking_ref}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">€{Number(b.total_price_eur).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      b.status === 'redeemed' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>{b.status}</span>
                  </div>
                </div>
              </div>
            ))}
            {bookings.length === 0 && <p className="text-gray-500 text-center py-8">No bookings yet.</p>}
          </div>
        )}

        {tab === 'redeem' && (
          <div className="max-w-sm mx-auto mt-8">
            <h2 className="text-lg font-bold mb-4 text-center">Redeem Booking</h2>
            <input type="text" placeholder="Enter booking ref (e.g. HC-ABCD1234)" value={redeemRef}
              onChange={e => setRedeemRef(e.target.value.toUpperCase())}
              className="w-full border rounded-lg px-3 py-3 text-center text-lg font-mono mb-3" />
            <button onClick={handleRedeem} disabled={!redeemRef}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">
              Redeem
            </button>
            {redeemResult && (
              <p className={`mt-4 text-center font-medium ${redeemResult.ok ? 'text-green-600' : 'text-red-600'}`}>
                {redeemResult.message}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

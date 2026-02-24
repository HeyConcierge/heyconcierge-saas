'use client'

import { useEffect, useState } from 'react'

export default function CruiseLineDashboard() {
  const [apiKey, setApiKey] = useState('')
  const [authed, setAuthed] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])
  const [portCalls, setPortCalls] = useState<any[]>([])
  const [commission, setCommission] = useState<any>(null)
  const [tab, setTab] = useState<'overview' | 'bookings' | 'port-calls'>('overview')

  useEffect(() => {
    const saved = localStorage.getItem('hc_cruiseline_key')
    if (saved) { setApiKey(saved); setAuthed(true) }
  }, [])

  useEffect(() => {
    if (!authed || !apiKey) return
    localStorage.setItem('hc_cruiseline_key', apiKey)

    fetch(`/api/cruise/bookings`).then(r => r.json()).then(d => Array.isArray(d) && setBookings(d))
    fetch(`/api/cruise/port-calls`).then(r => r.json()).then(d => Array.isArray(d) && setPortCalls(d))
    fetch(`/api/cruise/commission?api_key=${apiKey}`).then(r => r.json()).then(d => setCommission(d))
  }, [authed, apiKey])

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-sm">
          <h1 className="text-xl font-bold mb-4">Cruise Line Login</h1>
          <input type="text" placeholder="API Key" value={apiKey} onChange={e => setApiKey(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-3" />
          <button onClick={() => apiKey && setAuthed(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium">Sign In</button>
        </div>
      </div>
    )
  }

  const summary = commission?.live_summary || { total_bookings: 0, total_revenue_eur: 0, total_commission_eur: 0 }

  // Group bookings by port
  const byPort: Record<string, { count: number; revenue: number; commission: number }> = {}
  bookings.filter(b => b.status !== 'cancelled').forEach(b => {
    const port = b.cruise_products?.location_port || 'Unknown'
    if (!byPort[port]) byPort[port] = { count: 0, revenue: 0, commission: 0 }
    byPort[port].count++
    byPort[port].revenue += Number(b.total_price_eur)
    byPort[port].commission += Number(b.commission_eur)
  })

  function downloadCSV() {
    const rows = [['Ref', 'Product', 'Port', 'Guest', 'Adults', 'Children', 'Total EUR', 'Commission EUR', 'Status', 'Booked At']]
    bookings.forEach(b => rows.push([
      b.booking_ref, b.cruise_products?.name, b.cruise_products?.location_port,
      b.guest_name, b.quantity_adult, b.quantity_child,
      b.total_price_eur, b.commission_eur, b.status, b.booked_at
    ]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'commission-report.csv'; a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">Cruise Line Dashboard</h1>
      </header>

      <nav className="flex border-b bg-white">
        {(['overview', 'bookings', 'port-calls'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium capitalize ${tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
            {t.replace('-', ' ')}
          </button>
        ))}
      </nav>

      <main className="p-4">
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{summary.total_bookings}</p>
                <p className="text-xs text-gray-500">Bookings</p>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-green-600">€{Number(summary.total_revenue_eur).toFixed(0)}</p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">€{Number(summary.total_commission_eur).toFixed(0)}</p>
                <p className="text-xs text-gray-500">Commission</p>
              </div>
            </div>

            <h3 className="font-semibold mt-4">By Port</h3>
            {Object.entries(byPort).map(([port, data]) => (
              <div key={port} className="bg-white rounded-lg border p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{port}</p>
                  <p className="text-sm text-gray-500">{data.count} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">€{data.revenue.toFixed(2)}</p>
                  <p className="text-sm text-purple-600">€{data.commission.toFixed(2)} commission</p>
                </div>
              </div>
            ))}

            <button onClick={downloadCSV} className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium mt-4">
              📥 Download Commission Report (CSV)
            </button>
          </div>
        )}

        {tab === 'bookings' && (
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-lg border p-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{b.guest_name}</p>
                    <p className="text-sm text-gray-600">{b.cruise_products?.name}</p>
                    <p className="text-xs text-gray-400">{b.booking_ref} · {new Date(b.booked_at).toLocaleDateString()}</p>
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
          </div>
        )}

        {tab === 'port-calls' && (
          <div className="space-y-3">
            {portCalls.map(pc => (
              <div key={pc.id} className="bg-white rounded-lg border p-3">
                <p className="font-semibold">{pc.port_name}</p>
                <p className="text-sm text-gray-600">
                  {pc.cruise_ships?.name} · {new Date(pc.arrival_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {pc.arrival_time?.slice(0,5)} — {pc.departure_time?.slice(0,5)} · ~{pc.estimated_pax} pax
                </p>
              </div>
            ))}
            {portCalls.length === 0 && <p className="text-gray-500 text-center py-8">No upcoming port calls.</p>}
          </div>
        )}
      </main>
    </div>
  )
}

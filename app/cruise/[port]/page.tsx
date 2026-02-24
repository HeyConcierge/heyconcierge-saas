'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Product = {
  id: string
  name: string
  description: string
  product_type: string
  price_adult_eur: number
  price_child_eur: number | null
  duration_minutes: number | null
  highlights: string[]
  images: string[]
  meeting_point: string | null
  cruise_operators: { name: string } | null
}

type BookingResult = {
  booking_ref: string
  guest_name: string
  total_price_eur: number
  qr_code_data: string
  quantity_adult: number
  quantity_child: number
}

function ProductCard({ product, onBook }: { product: Product; onBook: (p: Product) => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      {product.images?.[0] && (
        <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover rounded mb-3" loading="lazy" />
      )}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <span className="text-lg font-bold text-blue-600 whitespace-nowrap ml-2">€{product.price_adult_eur}</span>
      </div>
      {product.cruise_operators && (
        <p className="text-xs text-gray-500 mb-1">by {product.cruise_operators.name}</p>
      )}
      {product.duration_minutes && (
        <p className="text-sm text-gray-600 mb-2">⏱ {product.duration_minutes} min</p>
      )}
      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{product.description}</p>
      {product.highlights?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {product.highlights.slice(0, 3).map((h, i) => (
            <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{h}</span>
          ))}
        </div>
      )}
      <button onClick={() => onBook(product)} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Book Now
      </button>
    </div>
  )
}

function BookingForm({ product, onClose, onSuccess }: { product: Product; onClose: () => void; onSuccess: (b: BookingResult) => void }) {
  const [name, setName] = useState('')
  const [cabin, setCabin] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = (product.price_adult_eur * adults) + ((product.price_child_eur || 0) * children)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/cruise/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          guest_name: name,
          guest_cabin: cabin || undefined,
          quantity_adult: adults,
          quantity_child: children,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Booking failed')
      onSuccess(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Book {product.name}</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="John Smith" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cabin Number</label>
            <input type="text" value={cabin} onChange={e => setCabin(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="Optional" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
              <select value={adults} onChange={e => setAdults(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-gray-900">
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
              <select value={children} onChange={e => setChildren(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-gray-900">
                {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span>{adults} adult{adults > 1 ? 's' : ''} × €{product.price_adult_eur}</span>
              <span>€{(product.price_adult_eur * adults).toFixed(2)}</span>
            </div>
            {children > 0 && product.price_child_eur && (
              <div className="flex justify-between text-sm">
                <span>{children} child{children > 1 ? 'ren' : ''} × €{product.price_child_eur}</span>
                <span>€{(product.price_child_eur * children).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? 'Booking...' : `Confirm — €${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  )
}

function Confirmation({ booking, product }: { booking: BookingResult; product: Product }) {
  // Store in localStorage for offline access
  useEffect(() => {
    try {
      const tickets = JSON.parse(localStorage.getItem('hc_tickets') || '[]')
      tickets.push({ ...booking, product_name: product.name, saved_at: new Date().toISOString() })
      localStorage.setItem('hc_tickets', JSON.stringify(tickets))
    } catch {}
  }, [booking, product])

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-4">{product.name}</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left space-y-1">
          <p className="text-sm"><span className="font-medium">Ref:</span> {booking.booking_ref}</p>
          <p className="text-sm"><span className="font-medium">Guest:</span> {booking.guest_name}</p>
          <p className="text-sm"><span className="font-medium">Guests:</span> {booking.quantity_adult} adult{booking.quantity_adult > 1 ? 's' : ''}{booking.quantity_child > 0 ? `, ${booking.quantity_child} child${booking.quantity_child > 1 ? 'ren' : ''}` : ''}</p>
          <p className="text-sm font-bold"><span className="font-medium">Total:</span> €{Number(booking.total_price_eur).toFixed(2)}</p>
        </div>

        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
          <p className="text-xs text-gray-500 mb-2">Show this code at the attraction</p>
          <p className="text-2xl font-mono font-bold tracking-wider text-blue-600">{booking.booking_ref}</p>
          <p className="text-xs text-gray-400 mt-2">QR code coming soon</p>
        </div>

        <p className="text-xs text-gray-500">This ticket is saved on your device for offline access.</p>
      </div>
    </div>
  )
}

const TYPE_LABELS: Record<string, string> = {
  all: 'All',
  attraction: '🎢 Attractions',
  tour: '🗺 Tours',
  transport: '🚂 Transport',
  experience: '✨ Experiences',
}

export default function CruisePortPage() {
  const params = useParams()
  const port = decodeURIComponent(params.port as string)

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null)
  const [confirmation, setConfirmation] = useState<{ booking: BookingResult; product: Product } | null>(null)

  useEffect(() => {
    fetch(`/api/cruise/products?port=${encodeURIComponent(port)}`)
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [port])

  if (confirmation) {
    return <Confirmation booking={confirmation.booking} product={confirmation.product} />
  }

  const filtered = filter === 'all' ? products : products.filter(p => p.product_type === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">Shore Experiences</h1>
        <p className="text-sm text-gray-500">{port}</p>
      </header>

      <div className="px-4 py-3 overflow-x-auto flex gap-2">
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === key ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <main className="px-4 pb-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading experiences...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No experiences found for this port.</div>
        ) : (
          filtered.map(p => (
            <ProductCard key={p.id} product={p} onBook={setBookingProduct} />
          ))
        )}
      </main>

      {bookingProduct && (
        <BookingForm
          product={bookingProduct}
          onClose={() => setBookingProduct(null)}
          onSuccess={(booking) => {
            setConfirmation({ booking, product: bookingProduct })
            setBookingProduct(null)
          }}
        />
      )}
    </div>
  )
}

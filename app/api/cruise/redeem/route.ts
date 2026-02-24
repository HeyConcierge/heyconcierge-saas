import { createAdminClient } from '@/lib/supabase/admin'
import { requireOperatorAuth } from '@/lib/cruise-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const operator = await requireOperatorAuth(req)
  if (!operator) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { booking_ref } = await req.json()
  if (!booking_ref) return NextResponse.json({ error: 'booking_ref required' }, { status: 400 })

  const supabase = createAdminClient()

  // Find booking and verify it belongs to this operator's product
  const { data: booking } = await supabase
    .from('cruise_bookings')
    .select('*, cruise_products(operator_id, name)')
    .eq('booking_ref', booking_ref.toUpperCase().trim())
    .single()

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  if (booking.cruise_products?.operator_id !== operator.id) {
    return NextResponse.json({ error: 'Not your booking' }, { status: 403 })
  }
  if (booking.status === 'redeemed') {
    return NextResponse.json({ error: 'Already redeemed', redeemed_at: booking.redeemed_at }, { status: 409 })
  }
  if (booking.status === 'cancelled') {
    return NextResponse.json({ error: 'Booking is cancelled' }, { status: 410 })
  }

  const { data, error } = await supabase
    .from('cruise_bookings')
    .update({ status: 'redeemed', redeemed_at: new Date().toISOString() })
    .eq('id', booking.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'Booking redeemed', booking: data })
}

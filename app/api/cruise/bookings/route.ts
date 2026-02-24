import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

function generateBookingRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let ref = 'HC-'
  for (let i = 0; i < 8; i++) ref += chars[Math.floor(Math.random() * chars.length)]
  return ref
}

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = req.nextUrl

  let query = supabase
    .from('cruise_bookings')
    .select('*, cruise_products(name, location_port, operator_id), cruise_port_calls(port_name, arrival_date, ship_id)')

  const cruiseLineId = searchParams.get('cruise_line_id')
  if (cruiseLineId) query = query.eq('cruise_line_id', cruiseLineId)

  const portCallId = searchParams.get('port_call_id')
  if (portCallId) query = query.eq('port_call_id', portCallId)

  const productId = searchParams.get('product_id')
  if (productId) query = query.eq('product_id', productId)

  const status = searchParams.get('status')
  if (status) query = query.eq('status', status)

  const { data, error } = await query.order('booked_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createAdminClient()

  // Get product for pricing
  const { data: product } = await supabase
    .from('cruise_products')
    .select('*, cruise_operators(name)')
    .eq('id', body.product_id)
    .single()

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  const qtyAdult = body.quantity_adult || 1
  const qtyChild = body.quantity_child || 0
  const totalPrice = (product.price_adult_eur * qtyAdult) + ((product.price_child_eur || 0) * qtyChild)

  // Get commission rate from cruise line if provided
  let commissionRate = 0
  if (body.cruise_line_id) {
    const { data: cruiseLine } = await supabase
      .from('cruise_lines')
      .select('commission_rate')
      .eq('id', body.cruise_line_id)
      .single()
    commissionRate = cruiseLine?.commission_rate || 0
  }

  const commissionEur = Number((totalPrice * commissionRate / 100).toFixed(2))
  const bookingRef = generateBookingRef()

  const qrCodeData = JSON.stringify({
    ref: bookingRef,
    product: product.name,
    qty: qtyAdult + qtyChild,
    port: product.location_port,
  })

  const { data, error } = await supabase
    .from('cruise_bookings')
    .insert({
      product_id: body.product_id,
      port_call_id: body.port_call_id || null,
      cruise_line_id: body.cruise_line_id || null,
      guest_name: body.guest_name,
      guest_cabin: body.guest_cabin || null,
      quantity_adult: qtyAdult,
      quantity_child: qtyChild,
      total_price_eur: totalPrice,
      commission_eur: commissionEur,
      commission_rate: commissionRate,
      booking_ref: bookingRef,
      qr_code_data: qrCodeData,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

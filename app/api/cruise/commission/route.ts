import { createAdminClient } from '@/lib/supabase/admin'
import { requireCruiseLineAuth } from '@/lib/cruise-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const cruiseLine = await requireCruiseLineAuth(req)
  if (!cruiseLine) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { searchParams } = req.nextUrl

  const periodStart = searchParams.get('period_start')
  const periodEnd = searchParams.get('period_end')

  // Get existing report if any
  let reportQuery = supabase
    .from('cruise_commission_reports')
    .select('*')
    .eq('cruise_line_id', cruiseLine.id)

  if (periodStart) reportQuery = reportQuery.gte('period_start', periodStart)
  if (periodEnd) reportQuery = reportQuery.lte('period_end', periodEnd)

  const { data: reports } = await reportQuery.order('period_start', { ascending: false })

  // Also compute live stats from bookings
  let bookingsQuery = supabase
    .from('cruise_bookings')
    .select('total_price_eur, commission_eur, status, booked_at')
    .eq('cruise_line_id', cruiseLine.id)
    .neq('status', 'cancelled')

  if (periodStart) bookingsQuery = bookingsQuery.gte('booked_at', periodStart)
  if (periodEnd) bookingsQuery = bookingsQuery.lte('booked_at', periodEnd)

  const { data: bookings } = await bookingsQuery

  const summary = {
    total_bookings: bookings?.length || 0,
    total_revenue_eur: bookings?.reduce((sum, b) => sum + Number(b.total_price_eur), 0) || 0,
    total_commission_eur: bookings?.reduce((sum, b) => sum + Number(b.commission_eur), 0) || 0,
  }

  return NextResponse.json({ reports, live_summary: summary })
}

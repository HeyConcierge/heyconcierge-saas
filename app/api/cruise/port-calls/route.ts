import { createAdminClient } from '@/lib/supabase/admin'
import { requireCruiseLineAuth } from '@/lib/cruise-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = req.nextUrl

  let query = supabase
    .from('cruise_port_calls')
    .select('*, cruise_ships(name, cruise_line_id, cruise_lines(name))')
    .gte('arrival_date', new Date().toISOString().split('T')[0])

  const port = searchParams.get('port')
  if (port) query = query.ilike('port_name', `%${port}%`)

  const shipId = searchParams.get('ship_id')
  if (shipId) query = query.eq('ship_id', shipId)

  const { data, error } = await query.order('arrival_date')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const cruiseLine = await requireCruiseLineAuth(req)
  if (!cruiseLine) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = createAdminClient()

  // Verify ship belongs to this cruise line
  const { data: ship } = await supabase
    .from('cruise_ships')
    .select('id')
    .eq('id', body.ship_id)
    .eq('cruise_line_id', cruiseLine.id)
    .single()

  if (!ship) return NextResponse.json({ error: 'Ship not found or not yours' }, { status: 403 })

  const { data, error } = await supabase
    .from('cruise_port_calls')
    .insert(body)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

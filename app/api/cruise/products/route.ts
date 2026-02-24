import { createAdminClient } from '@/lib/supabase/admin'
import { requireOperatorAuth } from '@/lib/cruise-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = req.nextUrl

  let query = supabase.from('cruise_products').select('*, cruise_operators(name, slug)')

  const port = searchParams.get('port')
  if (port) query = query.ilike('location_port', `%${port}%`)

  const operatorId = searchParams.get('operator_id')
  if (operatorId) query = query.eq('operator_id', operatorId)

  const type = searchParams.get('type')
  if (type) query = query.eq('product_type', type)

  const { data, error } = await query.order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const operator = await requireOperatorAuth(req)
  if (!operator) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('cruise_products')
    .insert({ ...body, operator_id: operator.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'

export async function requireOperatorAuth(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('api_key')
  if (!apiKey) return null

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('cruise_operators')
    .select('*')
    .eq('api_key', apiKey)
    .single()

  return data
}

export async function requireCruiseLineAuth(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key') || req.nextUrl.searchParams.get('api_key')
  if (!apiKey) return null

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('cruise_lines')
    .select('*')
    .eq('api_key', apiKey)
    .single()

  return data
}

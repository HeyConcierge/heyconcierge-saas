import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// GDPR Article 15 & 20 — Right of Access + Data Portability
// Returns all personal data held for a guest as JSON.
// Used to fulfill Subject Access Requests (SARs).

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const phone = searchParams.get('phone')
    const telegram_chat_id = searchParams.get('telegram_chat_id')
    const property_id = searchParams.get('property_id')

    if (!phone && !telegram_chat_id) {
      return NextResponse.json(
        { error: 'Must provide phone or telegram_chat_id' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const data: Record<string, unknown> = {
      exported_at: new Date().toISOString(),
      subject: { phone, telegram_chat_id },
    }

    if (phone) {
      const query = supabase
        .from('goconcierge_messages')
        .select('role, content, channel, created_at')
        .eq('guest_phone', phone)
        .order('created_at', { ascending: true })

      if (property_id) query.eq('property_id', property_id)

      const { data: messages } = await query
      data.messages = messages || []

      const { data: sessions } = await supabase
        .from('guest_sessions')
        .select('property_id, created_at, last_message_at')
        .eq('phone', phone)
      data.sessions = sessions || []

      const { data: escalations } = await supabase
        .from('escalations')
        .select('message, ai_response, reason, status, created_at')
        .eq('guest_phone', phone)
      data.escalations = escalations || []
    }

    if (telegram_chat_id) {
      const tgPhone = `tg:${telegram_chat_id}`
      const { data: messages } = await supabase
        .from('goconcierge_messages')
        .select('role, content, channel, created_at')
        .eq('guest_phone', tgPhone)
        .order('created_at', { ascending: true })
      data.telegram_messages = messages || []
    }

    return NextResponse.json(data, {
      headers: {
        'Content-Disposition': `attachment; filename="heyconcierge-data-export-${Date.now()}.json"`,
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('GDPR export error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Export failed' },
      { status: 500 }
    )
  }
}

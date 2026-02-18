import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GDPR Article 17 — Right to Erasure
// Deletes all personal data for a guest identified by phone or Telegram chat ID.
// Must be called by the host (property owner) or admin — verify ownership.

export async function POST(request: NextRequest) {
  try {
    const { phone, telegram_chat_id, property_id } = await request.json()

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

    const deleted: Record<string, number> = {}

    if (phone) {
      // Delete messages
      const { count: msgCount } = await supabase
        .from('goconcierge_messages')
        .delete({ count: 'exact' })
        .eq('guest_phone', phone)
        .eq('property_id', property_id)
      deleted.messages = msgCount || 0

      // Delete guest session
      const { count: sessionCount } = await supabase
        .from('guest_sessions')
        .delete({ count: 'exact' })
        .eq('phone', phone)
        .eq('property_id', property_id)
      deleted.sessions = sessionCount || 0

      // Delete escalations
      const { count: escCount } = await supabase
        .from('escalations')
        .delete({ count: 'exact' })
        .eq('guest_phone', phone)
        .eq('property_id', property_id)
      deleted.escalations = escCount || 0
    }

    if (telegram_chat_id) {
      const tgPhone = `tg:${telegram_chat_id}`

      const { count: msgCount } = await supabase
        .from('goconcierge_messages')
        .delete({ count: 'exact' })
        .eq('guest_phone', tgPhone)
      deleted.telegram_messages = msgCount || 0

      const { count: sessionCount } = await supabase
        .from('guest_sessions')
        .delete({ count: 'exact' })
        .eq('telegram_chat_id', telegram_chat_id)
      deleted.telegram_sessions = sessionCount || 0
    }

    return NextResponse.json({
      ok: true,
      deleted,
      message: 'All personal data for this guest has been erased.',
    })
  } catch (error) {
    console.error('GDPR delete error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Deletion failed' },
      { status: 500 }
    )
  }
}

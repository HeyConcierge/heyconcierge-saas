import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName } = await request.json()

    const supabase = await createClient()

    // Create new chat
    const { data: chat, error } = await supabase
      .from('chats')
      .insert({
        user_email: userEmail || null,
        user_name: userName || null,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ chatId: chat.id })
  } catch (error) {
    console.error('Create chat error:', error)
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    )
  }
}

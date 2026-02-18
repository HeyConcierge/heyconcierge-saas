import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession, getAdminSupabase } from '@/lib/admin-auth'
import { verifyTOTP } from '@/lib/totp'

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const adminUser = session.admin_users as { mfa_secret: string | null }

    if (!adminUser.mfa_secret) {
      return NextResponse.json({ error: 'MFA not configured' }, { status: 400 })
    }

    if (!verifyTOTP(String(code), adminUser.mfa_secret)) {
      return NextResponse.json({ error: 'Invalid code. Please try again.' }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    const { error: updateError } = await supabase
      .from('admin_sessions')
      .update({ mfa_verified: true })
      .eq('id', session.id)

    if (updateError) {
      console.error('MFA verify update error:', updateError)
      return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('MFA verify POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

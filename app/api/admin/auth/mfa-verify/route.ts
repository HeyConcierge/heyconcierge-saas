import { NextRequest, NextResponse } from 'next/server'
import { verifySync } from 'otplib'
import { getAdminSession, getAdminSupabase } from '@/lib/admin-auth'

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

    // verifySync returns { valid: boolean } — wrap in try/catch for safety
    let isValid = false
    try {
      const result = verifySync({ token: String(code), secret: adminUser.mfa_secret })
      isValid = result.valid
    } catch (verifyErr) {
      console.error('TOTP verify error:', verifyErr)
      return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
    }

    if (!isValid) {
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

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not configured' }, { status: 500 })
    }

    const { action } = await request.json()
    const apiBase = `https://api.telegram.org/bot${token}`

    if (action === 'set') {
      // Determine webhook URL from request origin or env
      const host = request.headers.get('host') || 'heyconcierge.io'
      const protocol = host.includes('localhost') ? 'http' : 'https'
      const webhookUrl = `${protocol}://${host}/api/telegram-webhook`

      const body: any = {
        url: webhookUrl,
        allowed_updates: ['message'],
        drop_pending_updates: true,
      }

      // Include secret token if configured
      if (process.env.TELEGRAM_WEBHOOK_SECRET) {
        body.secret_token = process.env.TELEGRAM_WEBHOOK_SECRET
      }

      const res = await fetch(`${apiBase}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      return NextResponse.json({ webhookUrl, ...data })
    }

    if (action === 'info') {
      const res = await fetch(`${apiBase}/getWebhookInfo`)
      const data = await res.json()
      return NextResponse.json(data)
    }

    if (action === 'delete') {
      const res = await fetch(`${apiBase}/deleteWebhook`)
      const data = await res.json()
      return NextResponse.json(data)
    }

    if (action === 'me') {
      const res = await fetch(`${apiBase}/getMe`)
      const data = await res.json()
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Invalid action. Use: set, info, delete, me' }, { status: 400 })
  } catch (error) {
    console.error('Telegram setup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Setup failed' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

type ExtractField = 'wifi_password' | 'checkin_instructions' | 'local_tips' | 'house_rules'

const FIELD_PROMPTS: Record<ExtractField, string> = {
  wifi_password: `Extract ONLY the WiFi password from this document. Return just the password string, nothing else. If no WiFi password is found, return the word null.`,
  checkin_instructions: `Extract ONLY check-in instructions from this document (key location, door codes, arrival steps, parking info). Return the instructions as plain text. If none found, return the word null.`,
  local_tips: `Extract ONLY local tips and recommendations from this document (restaurants, attractions, transport, shops, things to do). Return as plain text. If none found, return the word null.`,
  house_rules: `Extract ONLY house rules from this document (quiet hours, smoking policy, pet policy, trash, checkout procedures, dos and don'ts). Return as plain text. If none found, return the word null.`,
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const field = formData.get('field') as string

    if (!field || !FIELD_PROMPTS[field as ExtractField]) {
      return NextResponse.json(
        { error: `Invalid field: ${field}. Must be one of: ${Object.keys(FIELD_PROMPTS).join(', ')}` },
        { status: 400 }
      )
    }

    const files = formData.getAll('pdfs') as File[]
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No PDF files uploaded' }, { status: 400 })
    }

    // pdf-parse v1 uses require-style import
    const pdfParse = (await import('pdf-parse')).default

    const allTexts: string[] = []
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const pdfData = await pdfParse(buffer)
      allTexts.push(pdfData.text)
    }

    const combinedText = allTexts.join('\n\n--- NEXT DOCUMENT ---\n\n')

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: FIELD_PROMPTS[field as ExtractField],
      messages: [
        { role: 'user', content: `Extract from this PDF text:\n\n${combinedText}` }
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const value = responseText.trim() === 'null' ? null : responseText.trim()

    return NextResponse.json({ [field]: value })
  } catch (error) {
    console.error('PDF extraction error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'PDF extraction failed' },
      { status: 500 }
    )
  }
}

/**
 * Image auto-attach module for HeyConcierge
 * Sends property images when guests ask about check-in, the property, etc.
 * Ported from Jacob's original kora-ai-server
 */

// Keywords that trigger image attachments
const IMAGE_TRIGGER_KEYWORDS = [
  'check in', 'checkin', 'check-in',
  'what does', 'how does', 'look like', 'looks like',
  'apartment', 'place', 'room', 'property',
  'where is', 'how to find', 'location',
  'photo', 'picture', 'image', 'show me',
  'arrive', 'arriving', 'arrival',
]

interface PropertyImage {
  url: string
  caption?: string
  category?: 'exterior' | 'interior' | 'amenity' | 'area' | 'other'
}

/**
 * Check if a guest message should trigger image attachments
 */
export function shouldAttachImages(message: string): boolean {
  const lower = message.toLowerCase()
  return IMAGE_TRIGGER_KEYWORDS.some(keyword => lower.includes(keyword))
}

/**
 * Get relevant images for a property based on the guest message
 * @param images All property images
 * @param message Guest message (used for future smart filtering)
 * @param maxImages Maximum images to return
 */
export function getRelevantImages(
  images: PropertyImage[],
  message: string,
  maxImages: number = 4
): PropertyImage[] {
  if (!images || images.length === 0) return []

  // For now, return up to maxImages. 
  // Future: smart filtering based on message content + image categories
  return images.slice(0, maxImages)
}

/**
 * Send images via Telegram
 */
export async function sendTelegramImages(
  chatId: number,
  images: PropertyImage[],
  botToken: string
): Promise<void> {
  const TELEGRAM_API = `https://api.telegram.org/bot${botToken}`

  for (const img of images) {
    try {
      await fetch(`${TELEGRAM_API}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: img.url,
          caption: img.caption || undefined,
        }),
      })
    } catch (err) {
      console.error('Failed to send image:', err)
    }
  }
}

/**
 * Send images via WhatsApp (Twilio)
 * Ready for when WhatsApp Business API is set up
 */
export async function sendWhatsAppImages(
  to: string,
  images: PropertyImage[],
  accountSid: string,
  authToken: string,
  fromNumber: string
): Promise<void> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

  for (const img of images) {
    try {
      const body = new URLSearchParams({
        To: `whatsapp:${to}`,
        From: `whatsapp:${fromNumber}`,
        MediaUrl: img.url,
        ...(img.caption ? { Body: img.caption } : {}),
      })

      await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      })
    } catch (err) {
      console.error('Failed to send WhatsApp image:', err)
    }
  }
}

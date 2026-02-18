/**
 * TOTP (RFC 6238) implementation using Node.js built-in crypto only.
 * No external dependencies — works reliably in any serverless environment.
 */
import { createHmac, randomBytes } from 'crypto'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const DIGITS = 6
const PERIOD = 30
const WINDOW = 1 // accept 1 step before/after for clock drift

export function generateSecret(): string {
  const bytes = randomBytes(20)
  let secret = ''
  let buffer = 0
  let bitsLeft = 0
  for (let b = 0; b < bytes.length; b++) {
    const byte = bytes[b]
    buffer = (buffer << 8) | byte
    bitsLeft += 8
    while (bitsLeft >= 5) {
      secret += ALPHABET[(buffer >> (bitsLeft - 5)) & 31]
      bitsLeft -= 5
    }
  }
  if (bitsLeft > 0) {
    secret += ALPHABET[(buffer << (5 - bitsLeft)) & 31]
  }
  return secret
}

function base32Decode(str: string): Buffer {
  const s = str.toUpperCase().replace(/=+$/, '')
  let bits = 0
  let value = 0
  let index = 0
  const output = new Uint8Array(Math.floor((s.length * 5) / 8))
  for (let i = 0; i < s.length; i++) {
    const charIdx = ALPHABET.indexOf(s[i])
    if (charIdx === -1) continue
    value = (value << 5) | charIdx
    bits += 5
    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255
      bits -= 8
    }
  }
  return Buffer.from(output)
}

function hotp(key: Buffer, counter: number): string {
  const counterBuf = Buffer.alloc(8)
  counterBuf.writeBigInt64BE(BigInt(counter))
  const hmac = createHmac('sha1', key).update(counterBuf).digest()
  const offset = hmac[hmac.length - 1] & 0x0f
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  return String(code % Math.pow(10, DIGITS)).padStart(DIGITS, '0')
}

export function verifyTOTP(token: string, secret: string): boolean {
  if (!token || !secret || token.length !== DIGITS || !/^\d+$/.test(token)) {
    return false
  }
  const key = base32Decode(secret)
  const step = Math.floor(Date.now() / 1000 / PERIOD)
  for (let i = -WINDOW; i <= WINDOW; i++) {
    if (hotp(key, step + i) === token) return true
  }
  return false
}

export function generateURI(issuer: string, label: string, secret: string): string {
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: 'SHA1',
    digits: String(DIGITS),
    period: String(PERIOD),
  })
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(label)}?${params}`
}

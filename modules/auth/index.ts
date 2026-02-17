// modules/auth — Auth helpers
// Owner: Lars
// Extract cookie parsing, session validation, etc. here as needed.

export function getCookieValue(cookieHeader: string, name: string): string | null {
  const value = `; ${cookieHeader}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

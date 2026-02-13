# Features to Integrate from wa-concierge

These features from our production backend (wa-concierge) should be merged into the SaaS codebase.

---

## 1. 📸 Image Auto-Attach for WhatsApp

**What:** Automatically attach property images (key box, entrance, map) when guests ask about check-in/entry.

**Why:** Guests asking "how do I get in?" need photos, not just text. This was the #1 most asked question on Nyholmen.

**Code to add in `whatsapp_server.js`:**

```javascript
// Add after generating the AI reply, before sending response

// Image auto-attach based on message content
const BASE_URL = process.env.APP_URL || 'https://your-domain.com';

// Fetch property images from Supabase
const { data: images } = await supabase
  .from('property_images')
  .select('url, tags')
  .eq('property_id', propertyId);

if (images && images.length > 0) {
  const combinedText = (messageBody + ' ' + aiReply).toLowerCase();
  
  // Check-in / entry questions → attach entry-related images
  if (/key\s*box|nøkkel|inngang|entry|check.?in|how to (get|enter)|hvordan komme|schlüssel|eingang|llave|entrada/i.test(combinedText)) {
    const entryImages = images.filter(img => 
      img.tags && (img.tags.includes('entry') || img.tags.includes('keybox') || img.tags.includes('checkin'))
    );
    for (const img of entryImages.slice(0, 4)) { // Max 4 images per WhatsApp message
      // Attach via Twilio media
      twilioClient.messages.create({
        from: twilioWhatsappNumber,
        to: guestPhone,
        mediaUrl: [img.url]
      });
    }
  }
  
  // Parking questions → attach parking images
  if (/parking|parkering|parken|aparcamiento|where (do i|can i) park/i.test(combinedText)) {
    const parkingImages = images.filter(img => img.tags && img.tags.includes('parking'));
    for (const img of parkingImages.slice(0, 2)) {
      twilioClient.messages.create({
        from: twilioWhatsappNumber,
        to: guestPhone,
        mediaUrl: [img.url]
      });
    }
  }
}
```

**Database:** Add `tags` column to property images table:
```sql
ALTER TABLE property_images ADD COLUMN tags TEXT[] DEFAULT '{}';
-- Tags: 'entry', 'keybox', 'checkin', 'parking', 'exterior', 'interior', 'view', 'amenity'
```

**Onboarding UX:** Let property owners tag images during upload (checkbox: "Entry/Key", "Parking", "Interior", etc.)

---

## 2. 🌤️ Live Weather in AI Context

**What:** Fetches current weather and injects it into the AI system prompt. Guests get weather-aware responses.

**Why:** "What should I wear today?" and "Can we see northern lights tonight?" are super common questions.

```javascript
// Weather service with caching
const WEATHER_CACHE_TTL = 30 * 60 * 1000; // 30 min
let weatherCache = { data: null, fetchedAt: 0 };

async function getWeather(lat, lon) {
  if (weatherCache.data && Date.now() - weatherCache.fetchedAt < WEATHER_CACHE_TTL) {
    return weatherCache.data;
  }
  
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const json = await res.json();
    const cw = json.current_weather;
    
    const WMO_CODES = {
      0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
      45: "Fog", 51: "Light drizzle", 61: "Slight rain", 63: "Moderate rain",
      71: "Slight snowfall", 73: "Moderate snowfall", 75: "Heavy snowfall",
      80: "Rain showers", 95: "Thunderstorm"
    };
    
    const data = {
      temperature: cw.temperature,
      windspeed: cw.windspeed,
      description: WMO_CODES[cw.weathercode] || "Unknown",
      is_day: cw.is_day,
      time: cw.time
    };
    weatherCache = { data, fetchedAt: Date.now() };
    return data;
  } catch (err) {
    console.error("Weather fetch failed:", err.message);
    return weatherCache.data || null;
  }
}

// Add to system prompt:
function addWeatherContext(prompt, weather) {
  if (!weather) return prompt;
  return prompt + `\n\nCURRENT WEATHER (as of ${weather.time}):
- Temperature: ${weather.temperature}°C
- Conditions: ${weather.description}
- Wind: ${weather.windspeed} km/h
- ${weather.is_day ? "Daytime" : "Nighttime"}

Use this when guests ask about weather, clothing, or outdoor activities.`;
}
```

**Database:** Add `latitude` and `longitude` to properties table:
```sql
ALTER TABLE properties ADD COLUMN latitude DECIMAL(9,6);
ALTER TABLE properties ADD COLUMN longitude DECIMAL(9,6);
```

**Note:** Use Open-Meteo API — free, no API key needed, global coverage.

---

## 3. 🚦 Rate Limiting per Phone Number

**What:** Prevents abuse by limiting messages per sender.

**Why:** Without this, one guest (or bot) could burn through your API budget.

```javascript
function createRateLimiter(maxRequests, windowMs) {
  const store = new Map();
  return {
    check(key) {
      const now = Date.now();
      const entry = store.get(key);
      if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      entry.count++;
      return entry.count <= maxRequests;
    },
    cleanup() {
      const now = Date.now();
      for (const [key, entry] of store) {
        if (now > entry.resetAt) store.delete(key);
      }
    }
  };
}

// 30 messages per minute per phone number
const whatsappLimiter = createRateLimiter(30, 60 * 1000);

// In webhook handler:
if (!whatsappLimiter.check(guestPhone)) {
  return sendReply("You're sending messages too quickly. Please wait a moment.");
}

// Cleanup every hour
setInterval(() => whatsappLimiter.cleanup(), 60 * 60 * 1000);
```

**For SaaS:** Also add per-property monthly message counter (for billing tiers).

---

## 4. 🌍 Multi-Language System Prompt

**What:** AI auto-detects guest language and responds in same language.

**Why:** Tromsø gets guests from 50+ countries. This was critical for us.

```javascript
// Add to system prompt for every property:
const LANGUAGE_PROMPT = `
LANGUAGE BEHAVIOR:
- Detect the language of each guest message.
- ALWAYS respond in the same language the guest used.
- If the language is ambiguous, default to English.
- You are fluent in all major languages including Norwegian, English, German, 
  French, Spanish, Swedish, Dutch, Italian, Japanese, Chinese, and Korean.
- Do NOT mention that you are detecting their language. Just respond naturally.
`;

// Also add to system prompt:
const RESPONSE_GUIDELINES = `
RESPONSE GUIDELINES:
- Keep responses concise and WhatsApp-friendly (under 1000 characters when possible).
- Use line breaks for readability, but avoid excessive formatting.
- Be warm and helpful.
- Include Google Maps links when recommending places:
  https://www.google.com/maps/search/?api=1&query=<place+city>
- If you do not know an answer, say so honestly and suggest contacting the host.
- Never invent information about the property that is not in the profile data.
`;
```

---

## 5. 🔔 Escalation Detection + Host Notification

**What:** Detects when the AI can't answer and notifies the property owner.

```javascript
function detectEscalation(aiReply) {
  return /contact the host|kontakt vert|I don't know|I'm not sure|jeg vet ikke|nicht sicher/i.test(aiReply);
}

// After generating reply:
if (detectEscalation(reply)) {
  // Notify property owner via email/SMS/push
  await supabase.from('escalations').insert({
    property_id: propertyId,
    guest_phone: guestPhone,
    guest_message: messageBody,
    ai_reply: reply,
    status: 'pending'
  });
  
  // Could also send push notification to owner
}
```

---

## 6. 📋 Booking URL Integration

**What:** When guests ask about availability/pricing, AI includes booking link.

```javascript
// Add to property config in Supabase:
// booking_url TEXT (e.g., Airbnb listing URL)

// In system prompt:
if (property.booking_url) {
  prompt += `\n\nBOOKING: Guests can book at: ${property.booking_url}
When guests ask about availability or pricing, include this link naturally.`;
}
```

---

## Summary: What Erik Should Implement

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| 🔴 P1 | Image auto-attach | 2h | Huge — visual check-in instructions |
| 🔴 P1 | Multi-language prompt | 30min | Huge — international guests |
| 🟡 P2 | Weather context | 1h | Medium — weather-aware responses |
| 🟡 P2 | Rate limiting | 1h | Medium — prevents abuse |
| 🟡 P2 | Escalation detection | 1h | Medium — owner peace of mind |
| 🟢 P3 | Booking URL | 30min | Nice to have |

**Total integration effort: ~6 hours**

---

## Files Reference

- Our full backend: `../kora-ai-server/index.js` (629 lines)
- Erik's backend: `backend/whatsapp_server.js` (528 lines)
- This guide extracts only the production-tested features worth merging

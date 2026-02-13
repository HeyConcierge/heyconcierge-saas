# HeyConcierge — Merge Plan

## Mål
Kombiner Eriks SaaS-arkitektur med vår operasjonelle backend til én produksjonsklar plattform.

## Fundament: Eriks kodebase (heyconcierge-saas)
Eriks versjon har riktig arkitektur for et SaaS-produkt. Vår kode har features som mangler hos Erik.

---

## Fase 1: Merge (Uke 1-2)

### Fra vår backend → inn i Eriks:

**1. Bildestøtte i chat**
- Vår: Auto-attach bilder for nøkkelboks, inngang etc. basert på regex
- Eriks: Mangler bildestøtte i WhatsApp-chat
- **Handling:** Port bildelogikken fra `wa-concierge/index.js` inn i `whatsapp_server.js`
- Legg bilder i Supabase Storage (ikke lokal `/static/`)

**2. Lokalisering / språkdeteksjon**
- Vår: Norsk lokalisering, locale-aware prompts
- Eriks: Multi-language nevnt men ikke implementert
- **Handling:** Merge våre locale-prompts inn i Eriks Claude-kall

**3. Rate limiting**
- Vår: Har rate limiting per telefonnummer
- Eriks: Mangler
- **Handling:** Port rate limiter

**4. Auto-seed profil**
- Vår: Profil bakt inn i kode (overlever restart)
- Eriks: Supabase-basert (bedre)
- **Handling:** Eriks tilnærming er riktig. Migrer Nyholmen-data til Supabase.

### Eriks features som beholdes som-er:
- ✅ Next.js frontend (landing + signup + dashboard)
- ✅ Supabase multi-tenant database
- ✅ iCal sync service
- ✅ Guest session management
- ✅ Conversation logging
- ✅ QR-kode generering
- ✅ PDF upload for property docs

---

## Fase 2: Produksjonsklargjøring (Uke 3-4)

### 2.1 WhatsApp Business API
- **Nå:** Twilio sandbox (begge)
- **Mål:** WhatsApp Business API via Twilio eller Meta direkte
- **Krav:** Godkjent business-konto, verifisert telefonnummer
- **Kostnad:** ~$0.05/samtale (first 1000/mnd gratis med Meta)

### 2.2 Autentisering
- Eriks: Google OAuth (delvis)
- **Mål:** Supabase Auth med email + Google + Magic Link
- Passordbeskyttet dashboard per kunde

### 2.3 Onboarding-flow forbedring
- Drag & drop dokument-upload (PDF husregler, guide etc.)
- AI parser dokumentet automatisk → fyller property config
- Forhåndsvisning av chatbot-svar før go-live

### 2.4 Bytt AI til Claude
- Vår bruker OpenAI, Eriks bruker Claude
- **Beslutning:** Claude (bedre for norsk, billigere med caching)
- Prompt-engineering for konsistent gjeste-opplevelse

---

## Fase 3: Betalingsintegrasjon (Uke 5-6)

### Stripe
- Signup → gratis prøveperiode (14 dager)
- Planer:
  - **Starter:** kr 299/mnd — 1 eiendom, 500 meldinger
  - **Pro:** kr 799/mnd — 5 eiendommer, 2000 meldinger
  - **Business:** kr 1999/mnd — Unlimited eiendommer, 10K meldinger
- Stripe Checkout → Webhook → aktivér konto i Supabase
- Meldingsteller per property per måned

### Revenue tracking
- Dashboard: MRR, churn, usage per kunde
- Alerts når kunder nærmer seg meldingsgrense

---

## Fase 4: Go-Live Features (Uke 7-8)

### 4.1 Analytics Dashboard (for property owners)
- Antall gjestesamtaler per uke/måned
- Vanligste spørsmål (auto-kategorisert)
- Responstid
- Gjeste-tilfredshet (thumbs up/down etter svar)

### 4.2 Automatiske meldinger
- Check-in dag: "Velkommen! Her er alt du trenger..."
- Dag 2: "Hvordan går oppholdet? Tips for i dag..."
- Check-out: "Takk for besøket! Vi setter pris på en review ⭐"
- Trigger: iCal sync → booking matcher dato → send melding

### 4.3 Eier-notifikasjoner
- Alert til eier når gjest spør noe boten ikke kan svare på
- Ukentlig rapport: "Dine gjester spurte mest om X denne uken"

### 4.4 Multi-kanal
- WhatsApp (primær)
- SMS (via Telnyx — fallback)
- Voice (ClawdTalk/Telnyx — premium feature)

---

## Fase 5: Cruise-vertikal (Fase 4 i HC roadmap)

Egen plan — men arkitekturen må støtte:
- Pre-boarding aktivering (fra bookingbekreftelse)
- Shore excursion booking
- Multi-language (30+ språk for cruisegjester)
- Bulk-onboarding (1000+ gjester per skip)

---

## Tech Stack (Endelig)

| Komponent | Teknologi |
|-----------|-----------|
| Frontend | Next.js + Tailwind (Vercel) |
| Backend | Node.js Express (Railway/Render) |
| Database | Supabase (Postgres + Auth + Storage) |
| AI | Claude (Anthropic) |
| WhatsApp | Twilio → WhatsApp Business API |
| Kalender | Python iCal sync (cron) |
| Betaling | Stripe |
| Voice | Telnyx/ClawdTalk (Fase 4) |
| SMS | Telnyx |
| Domene | heyconcierge.com / .no |

---

## Arbeidsfordeling

| Oppgave | Hvem |
|---------|------|
| Frontend/UX | Erik |
| Backend/API | Erik + Mildrid |
| AI/Prompts | Mildrid |
| Database/Supabase | Erik |
| Stripe-integrasjon | Erik + Mildrid |
| iCal sync | Erik (eksisterer) |
| WhatsApp Business API | Alle (krever godkjenning) |
| Markedsføring/salg | Jacob + Lars |
| Cruise-vertikal | Jacob (domeneekspert) |

---

## Milepæler

| Dato | Milepæl |
|------|---------|
| 1. mars | Merge komplett, en kodebase |
| 15. mars | WhatsApp Business API søkt |
| 1. april | Beta med 3-5 eiendommer (inkl. Nyholmen) |
| 15. april | Stripe integrert, betalende kunde #1 |
| 1. mai | Soft launch — 10 kunder |
| 1. juni | Offisiell launch 🚀 |

---

## Neste steg (nå)

1. ✅ Analyser begge kodebaser (gjort)
2. 🔲 Presenter merge-plan for Erik og Lars (16. feb møtet)
3. 🔲 Sett opp felles dev-miljø (Supabase project, env vars)
4. 🔲 Start Fase 1 merge
5. 🔲 Registrer HeyConcierge AS (stiftelsesdokument i kveld)

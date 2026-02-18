# HeyConcierge SaaS — Launch Readiness Report

**Dato:** 18. februar 2026  
**Launch-dato:** 1. april 2026 (6 uker)  
**Analysert av:** AI-analyse av full kodebase  
**Branch:** main

---

## Sammendrag

HeyConcierge har et **fungerende MVP-fundament** med reell Telegram-concierge, iCal-synk, Google OAuth, og admin-panel. Men koden er **ikke production-ready for betalende kunder**. Kritiske mangler inkluderer: ingen Stripe-integrasjon (betaling), ingen WhatsApp Cloud API-migrering, ingen rate limiting, manglende RLS policies, og flere sikkerhetshull. Estimert: **~60% ferdig** for en betalbar MVP.

---

## 1. Feature Completeness

### ✅ Fungerer (reell logikk)
| Feature | Status | Fil(er) |
|---------|--------|---------|
| Telegram webhook/concierge | **Fungerer** — Full Claude AI-flow, session mgmt, bildeauto-attach, samtalehistorikk | `app/api/telegram-webhook/route.ts` (314 linjer) |
| iCal kalender-synk | **Fungerer** — Custom iCal-parser, Airbnb/Booking.com-deteksjon, bulk sync | `app/api/sync-calendar/route.ts` (198 linjer) |
| Google OAuth login | **Fungerer** — Full OAuth2-flow, CSRF state, brukeropprettelse | `app/api/auth/google/route.ts` + `callback/` |
| Admin login + MFA | **Fungerer** — bcrypt auth, TOTP MFA, QR-kode setup, session tokens | `app/api/admin/auth/*` |
| Admin dashboard (metrics) | **Fungerer** — Server-side med reelle Supabase-queries | `app/admin/(protected)/page.tsx` |
| Admin customers/users | **Fungerer** — Lister orgs og admin-brukere fra DB | `app/admin/(protected)/customers/`, `users/` |
| Property settings | **Fungerer** — Full CRUD, PDF-ekstraksjon via Claude, bildeopplasting, test-concierge | `app/(dashboard)/property/[id]/settings/` (887 linjer) |
| Dashboard property-liste | **Fungerer** — Henter properties med config, org-lookup, slett property | `app/(dashboard)/dashboard/page.tsx` |
| Kalender-visning | **Fungerer** — Viser bookinger med måneds-grid, filter per property | `app/(dashboard)/calendar/page.tsx` |
| Signup wizard | **Fungerer** — 3-stegs flow: plan → property → config, QR-generering | `app/(auth)/signup/page.tsx` (415 linjer) |
| PDF-ekstraksjon | **Fungerer** — Claude-basert, trekker ut WiFi/checkin/tips/rules | `app/api/extract-pdf/route.ts` |
| Image upload/delete | **Fungerer** — Supabase storage, tags | `app/api/upload-image/`, `delete-image/` |
| GDPR-endepunkter | **Fungerer** — Delete guest, export data, retention cleanup | `app/api/gdpr/*` |
| Test concierge (preview) | **Fungerer** — Lar host teste AI-svar i settings | `components/features/TestConcierge.tsx` |
| Telegram bot setup | **Fungerer** — Set/get/delete webhook | `app/api/telegram-setup/route.ts` |
| Landing page | **Fungerer** — Full marketing page med animasjoner, CTA | `app/(marketing)/page.tsx` |
| FAQ-side | **Fungerer** | `app/(marketing)/faq/page.tsx` |

### 🟡 Placeholder / Stub
| Feature | Status | Detaljer |
|---------|--------|----------|
| `modules/bookings/` | **Stub** — Kun TODO-kommentarer, `export {}` | Planlagt refactoring, ikke startet |
| `modules/messaging/` | **Stub** — Kun TODO-kommentarer | Ditto |
| `modules/ai/concierge.ts` | **Stub** — Kun TODO-kommentarer | AI-logikk lever i route-filer |
| `modules/payments/` | **Stub** — Tom fil | Stripe ikke implementert |
| `modules/properties/` | **Stub** — Tom fil | Property-logikk lever i pages |
| Admin support-side | **Stub** — "Coming soon"-tekst | `app/admin/(protected)/support/page.tsx` |
| Upgrade/cancel plan | **Stub** — `alert('coming soon!')` | Dashboard dropdown |

### 🔴 Mangler helt
| Feature | Impact |
|---------|--------|
| **Stripe betaling** | Ingen betalingsflow. Ingen checkout, webhook, invoice, plan enforcement |
| **WhatsApp Cloud API** | Backend bruker Twilio (legacy). Ikke migrert til Meta Cloud API |
| **Airbnb API** | Kun iCal. Airbnb Connected API krever partnerprogram-søknad |
| **Booking.com API** | Kun iCal. Connectivity API krever godkjenning |
| **Usage metering** | Ingen telling av meldinger per org for plan-håndhevelse |
| **Email-notifikasjoner** | Escalation har logikk men sender ikke (bare `console.log`) |
| **Onboarding email** | Ingen velkommen/setup-emailer |
| **Password reset** | Google OAuth only — OK, men ingen fallback |
| **Multi-property QR** | QR-kode genereres i signup, men ikke per Telegram-link |
| **Billing portal** | Ingen fakturahistorikk eller betalingsoversikt for hosts |

---

## 2. Backend Readiness

### Supabase Migrations
- **5 migrasjoner** (`002`–`005`) — Dekker properties, WiFi, Telegram, admin, billing-kolonner
- **Mangler migration `001`**: Base-tabeller (`properties`, `organizations`, `users`, `property_config_sheets`, `goconcierge_messages`, `guest_sessions`, `property_images`) finnes ikke i migrasjoner — trolig opprettet manuelt
- **RLS**: Kun definert for `bookings`-tabellen. **Alle andre tabeller mangler RLS** — kritisk sikkerhetsproblem
- ⚠️ `bookings` RLS bruker `auth.uid()` som krever Supabase Auth — men appen bruker **cookie-basert auth**, ikke Supabase Auth. **RLS-policyen fungerer trolig ikke**

### API Routes (Next.js)
- **Solid**: Telegram webhook, calendar sync, GDPR, admin auth — alle har reell logikk med feilhåndtering
- **Svakhet**: Bruker `SUPABASE_SERVICE_KEY || ANON_KEY` overalt — betyr at i utvikling uten service key, bruker appen anon key med full tilgang
- **Mangler**: Ingen rate limiting på noen endepunkter

### WhatsApp Server (Express backend)
- **834 linjer**, fullt funksjonell WhatsApp-concierge via Twilio
- Inkluderer: PDF-parsing, iCal sync, reminder-service, escalation-deteksjon, QR-generering
- **Problem**: Bruker Twilio (foreldet for WhatsApp Business). Meta Cloud API er standarden
- **Duplikatkode**: Mange funksjoner (buildPropertyContext, PDF-parsing, iCal sync) finnes i BÅDE backend og Next.js API routes

### AI Concierge Logic
- **Fungerer godt**: Claude Haiku, multilingual, property context, samtalehistorikk (siste 5 par), auto-bilde
- **Modell**: `claude-haiku-4-5-20251001` — bra valg for hastighet/pris
- **Mangler**: Ingen fallback ved API-feil (bare feilmelding til gjest), ingen token-counting/budsjett

---

## 3. Frontend Readiness

| Side | Vurdering |
|------|-----------|
| Landing page | ✅ Produksjonsklar. Full marketing med animasjoner |
| Login | ✅ Google OAuth + dev-login |
| Signup | ✅ 3-stegs wizard, plan-valg, property-setup |
| Dashboard | ✅ Property-liste med CRUD |
| Property view | ✅ Meldingslogg, booking-oversikt |
| Property settings | ✅ Omfattende: WiFi, checkin, tips, rules, PDF-ekstraksjon, bilder, tags, test-chat |
| Calendar | ✅ Måneds-kalender med booking-grid |
| Admin login | ✅ Med MFA |
| Admin dashboard | ✅ Real metrics |
| Admin customers | ✅ Org-tabell |
| Admin users | ✅ Admin-bruker-tabell |
| Admin support | ⛔ Placeholder |
| FAQ | ✅ Fungerer |
| Access gate | ✅ Pre-launch passord-gate |

**Frontend er generelt solid, men:**
- All auth er cookie-basert (ikke Supabase Auth) — fungerer, men er svakere
- Ingen loading states for flere operasjoner
- Responsivt design er implementert

---

## 4. Auth & Security

### 🔴 Kritiske problemer

1. **Dev-login route** (`/api/auth/dev-login`) — Sjekker `NODE_ENV === 'production'`, men Vercel setter ikke alltid dette korrekt. **MÅ fjernes eller flyttes bak feature flag med env var**

2. **Cookie-basert auth uten signering** — `user_id` og `user_email` settes som vanlige cookies (httpOnly: false, secure: false). **Enhver bruker kan forfalske identitet** ved å endre cookies i DevTools

3. **Ingen RLS på hoveedtabeller** — `properties`, `organizations`, `users`, `property_config_sheets`, `goconcierge_messages` har ingen RLS. Med anon key kan hvem som helst lese alle data

4. **Hardkodet access-code** — `NEXT_PUBLIC_ACCESS_CODE || 'heyc2026'` — default passord i kode

5. **Middleware-config mismatch** — Matcher ekskluderer `/api/*` men matcher sier `/((?!api|...)`. API routes er tilgjengelig uten auth

6. **Google OAuth callback** bruker anon key (ikke service key) — Fungerer bare hvis Supabase RLS tillater insert

### 🟡 Bør fikses

- Admin auth er **solid** (bcrypt + TOTP + session tokens) — godt implementert
- Mangler CSRF-beskyttelse på form-submits
- Ingen session-expiry for host-brukere (cookies har 7d maxAge)
- Webhook secret for Telegram er valgfritt (`if (process.env.TELEGRAM_WEBHOOK_SECRET)`)

### Env Vars (required)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
ANTHROPIC_API_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXTAUTH_URL
TELEGRAM_BOT_TOKEN
TELEGRAM_WEBHOOK_SECRET
NEXT_PUBLIC_ACCESS_CODE
CRON_SECRET
```
**Mangler `.env.example` for Next.js-appen** — kun backend har en

---

## 5. Integrasjoner

| Integrasjon | Status | Detaljer |
|-------------|--------|----------|
| **Telegram Bot** | ✅ **Fungerer** | Full concierge via webhook. QR-kode → /start → AI chat |
| **WhatsApp (Twilio)** | 🟡 **Legacy** | Fungerer via Twilio, men WhatsApp krever nå Cloud API. Twilio-priser er høyere |
| **WhatsApp (Cloud API)** | 🔴 **Ikke startet** | Må implementere Meta webhook, template messages, BSP-registrering |
| **Airbnb API** | 🔴 **Kun iCal** | Connected API krever partnerprogram. `analysis/airbnb-partner-application.md` finnes — søknad forberedt men trolig ikke sendt |
| **Booking.com API** | 🔴 **Kun iCal** | Connectivity API krever godkjenning |
| **iCal sync** | ✅ **Fungerer** | Custom parser, Airbnb/Booking-deteksjon, cron-kompatibel |
| **Stripe** | 🔴 **Ikke implementert** | Kun `stripe_customer_id`-kolonne i DB. Ingen kode |
| **Claude AI** | ✅ **Fungerer** | Haiku 4.5, property context, multilingual, historikk |
| **Open-Meteo (vær)** | ✅ **Fungerer** | I WhatsApp-backend, med caching |
| **Supabase Storage** | ✅ **Fungerer** | Bildeopplasting med tags |

---

## 6. Legal & Compliance

### Legal-mappe — **Imponerende komplett**
| Dokument | Status |
|----------|--------|
| Terms of Service | ✅ Detaljert, SaaS-spesifikk |
| Privacy Policy | ✅ GDPR-kompatibel |
| Cookie Policy | ✅ |
| DPA (Data Processing Agreement) | ✅ |
| DPIA (Data Protection Impact Assessment) | ✅ |
| AI Act Compliance | ✅ Dokumentert som lavrisiko |
| Guest Privacy Notice | ✅ |
| WhatsApp Compliance | ✅ |
| AI Disclosure Templates | ✅ |
| Aksjonæravtale (utkast) | ✅ |
| Stiftelsesdokument (utkast) | ✅ |
| Vesting-forklaring | ✅ |

### Mangler
- **Cookie consent banner** — Ikke implementert i frontend. Cookie Policy finnes men ingen mekanisme
- **Legal-sider i appen** — T&C og Privacy linkes fra login ("By signing in, you agree to our Terms of Service and Privacy Policy") men **ingen faktisk link-href**
- **AI-disclosure til gjester** — Templates finnes, men Telegram/WhatsApp-botten informerer ikke gjester om at de snakker med AI

---

## 7. DevOps

| Area | Status |
|------|--------|
| **Deployment** | Vercel (Next.js) + separat backend (Railway?) |
| **CI/CD** | 🔴 **Ingen** — Ingen GitHub Actions, ingen tester |
| **`.env.example`** | 🟡 Kun for backend. Mangler for Next.js |
| **Error handling** | 🟡 Try/catch finnes, men ingen Sentry/logging-tjeneste |
| **Logging** | 🔴 Kun `console.log/error`. Ingen strukturert logging |
| **Monitoring** | 🔴 Ingen helse-sjekk, ingen uptime-monitoring |
| **Database backups** | 🟡 Supabase håndterer dette, men bør verifiseres |
| **Staging environment** | 🔴 Ikke definert |

---

## 8. Kodekvalitet

### Duplikatkode
- **`buildPropertyContext()`** — Definert i BÅDE `telegram-webhook/route.ts` OG `whatsapp_server.js`
- **`getCookie()`** — Kopiert i 5+ page-filer
- **iCal-parsing** — I BÅDE `app/api/sync-calendar/` OG `backend/whatsapp_server.js`
- **PDF-parsing** — I BÅDE `app/api/extract-pdf/` OG `backend/whatsapp_server.js`
- **Modules-mappen** er forberedt for refactoring men alle filer er tomme stubs

### TODO-kommentarer
- 9 TODOs funnet — alle i modules/ (planlagt refactoring) og 1 i whatsapp_server.js (escalation)

### Hardkodede verdier
- `'heyc2026'` — Default access code i middleware
- CORS origins i whatsapp_server.js — Hardkodet liste med URLs
- `RETENTION_DAYS = 90` — OK som default, men bør være konfigurerbar
- Backend URL: `process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3004'`

### TypeScript
- Mye bruk av `any` types (property, config, etc.)
- Ingen strikt TypeScript-konfig
- Ingen shared types/interfaces

### Error Handling
- API routes har try/catch — bra
- Men feilmeldinger sendes rått til klienten (potensielt info-lekkasje)
- Telegram webhook returnerer alltid 200 (korrekt for Telegram)

---

## 9. Gap-analyse — Hva mangler for launch 1. april

### P0 — Blockers (MÅ fikses)

| # | Gap | Beskrivelse | Estimat |
|---|-----|-------------|---------|
| P0-1 | **Stripe betaling** | Ingen checkout, webhook, plan enforcement. Kan ikke ta imot penger | 2-3 uker |
| P0-2 | **Auth-sikkerhet** | Cookie-forfalskning mulig. Trenger signerte/JWT tokens | 3-5 dager |
| P0-3 | **Fjern dev-login** | Deaktiver eller slett `/api/auth/dev-login` for prod | 1 time |
| P0-4 | **RLS policies** | Alle hoveedtabeller mangler RLS. Data-lekkasje mulig | 2-3 dager |
| P0-5 | **Cookie consent** | GDPR krever det. Ingen banner/mekanisme | 2 dager |
| P0-6 | **Legal-sider i app** | T&C og Privacy Policy må linkes/vises i appen | 1 dag |
| P0-7 | **AI-disclosure** | Bot må informere gjester at de snakker med AI (EU AI Act) | 1 dag |
| P0-8 | **Env-sikring** | Fjern hardkodet access code, legg til `.env.example` for Next.js | 2 timer |
| P0-9 | **Usage metering** | Må telle meldinger per org for plan-håndhevelse | 3 dager |

### P1 — Bør ha for launch

| # | Gap | Beskrivelse | Estimat |
|---|-----|-------------|---------|
| P1-1 | **WhatsApp Cloud API** | Migrere fra Twilio til Meta Cloud API | 1-2 uker |
| P1-2 | **Email-notifikasjoner** | Velkommen-email, escalation-email til host | 3-4 dager |
| P1-3 | **Rate limiting** | API routes har ingen beskyttelse mot misbruk | 2 dager |
| P1-4 | **Error monitoring** | Sentry eller lignende for prod | 1 dag |
| P1-5 | **Staging environment** | Separat miljø for testing | 1 dag |
| P1-6 | **Refaktorering** | Flytt delt logikk til modules/, fjern duplikater | 3 dager |
| P1-7 | **Testing** | Minimum: API route-tester for kritiske flows | 3-4 dager |
| P1-8 | **Admin: Support-queue** | Placeholder nå, trenger reell escalation-visning | 3 dager |
| P1-9 | **Billing portal** | Hosts trenger fakturahistorikk | 2 dager |
| P1-10 | **Onboarding flow** | Forbedre first-time experience etter signup | 2 dager |

### P2 — Nice to have

| # | Gap | Beskrivelse | Estimat |
|---|-----|-------------|---------|
| P2-1 | **Airbnb Connected API** | Partner-søknad sendt? Ikke realistisk til 1. april uansett | N/A |
| P2-2 | **Booking.com API** | Samme som Airbnb | N/A |
| P2-3 | **Multi-language admin** | Admin er kun engelsk | 3 dager |
| P2-4 | **TypeScript strict mode** | Fjern `any`, legg til shared types | 3-4 dager |
| P2-5 | **CI/CD pipeline** | GitHub Actions for build/test/deploy | 1 dag |
| P2-6 | **Analytics dashboard** | Bedre metrics for hosts (responstid, populære spørsmål) | 1 uke |
| P2-7 | **Custom branding** | Per-property branding for premium-plan | 1 uke |

---

## 10. Sprint-plan (Uke 9–13)

### Uke 9 (24. feb – 28. feb) — "Sikkerhet & Fundament"

| Person | Oppgaver |
|--------|----------|
| **Lars** (backend) | P0-2: Implementer JWT/signert session auth. P0-4: RLS policies for alle tabeller. P0-3: Slett dev-login route. P0-8: .env.example |
| **Erik** (frontend) | P0-5: Cookie consent banner. P0-6: Legal-sider (/terms, /privacy) med innhold fra legal/. P0-7: AI-disclosure i bot-velkomstmeldinger |
| **Jacob** (business) | Stripe-konto setup. Velg Stripe-plan-struktur. Sjekk status på Airbnb partner-søknad. Forbered beta-kunder |

### Uke 10 (3. mars – 7. mars) — "Stripe MVP"

| Person | Oppgaver |
|--------|----------|
| **Lars** | P0-1: Stripe Checkout integration (checkout session, webhook for payment_intent.succeeded, customer.subscription.*). Plan enforcement middleware |
| **Erik** | P0-1: Stripe pricing page / checkout-knapp i signup. Billing portal frontend. P1-10: Forbedre onboarding-flow |
| **Jacob** | Beta-testing med 2-3 ekte properties. Dokumenter onboarding-prosess. Start WhatsApp Business-verifisering hos Meta |

### Uke 11 (10. mars – 14. mars) — "Betaling ferdig + WhatsApp"

| Person | Oppgaver |
|--------|----------|
| **Lars** | P0-1: Ferdigstill Stripe (webhooks, cancel, upgrade/downgrade). P0-9: Usage metering (meldinger per org). P1-1: Start WhatsApp Cloud API migration |
| **Erik** | P1-9: Billing portal (fakturaer). P1-8: Admin support-queue (vis escalations fra DB). P1-6: Refaktorer getCookie() og delt kode |
| **Jacob** | Beta-feedback-innsamling. Juster priser om nødvendig. Forbered launch-marketing |

### Uke 12 (17. mars – 21. mars) — "Polish & Testing"

| Person | Oppgaver |
|--------|----------|
| **Lars** | P1-1: Ferdigstill WhatsApp Cloud API. P1-3: Rate limiting (middleware). P1-4: Sentry-integrasjon. P1-5: Staging env |
| **Erik** | P1-7: Skriv API-tester for kritiske flows. P1-2: Email-templates (SendGrid/Resend). Bug fixes fra beta |
| **Jacob** | Komplett beta-runde med betalende kunder. Forbered support-docs. Sjekk legal-docs med jurist |

### Uke 13 (24. mars – 28. mars) — "Launch Prep"

| Person | Oppgaver |
|--------|----------|
| **Lars** | Bug fixes. Performance-testing. Database-indekser. Prod-deploy sjekkliste |
| **Erik** | Bug fixes. Final UI-polish. Responsiv-testing. Lighthouse-score |
| **Jacob** | Soft launch til utvalgte kunder. Monitor. Support. Forbered hard launch 1. april |

### Buffer: 31. mars – 1. april
- Siste bug fixes
- DNS/domene-sjekk
- Monitoring-alerts satt opp
- **Go live** 🚀

---

## Risiko-vurdering

| Risiko | Sannsynlighet | Impact | Mitigering |
|--------|---------------|--------|------------|
| Stripe ikke ferdig til 1. april | Medium | **Kritisk** | Prioriter P0-1 uke 10-11. Bruk Stripe Checkout (enklest) |
| WhatsApp Cloud API forsinkelse | Høy | Medium | Kan launche med kun Telegram. WhatsApp kan komme i v1.1 |
| Sikkerhetshull oppdages i prod | Medium | Høy | Fiks auth og RLS i uke 9. Pen-test i uke 12 |
| For få beta-kunder | Medium | Medium | Jacob starter rekruttering i uke 9 |
| Airbnb API-tilgang | Høy | Lav | iCal fungerer. API er nice-to-have |

---

## Konklusjon

HeyConcierge har en **sterk teknisk base** med fungerende AI-concierge, kalender-synk, og admin-panel. Men for å ta imot **betalende kunder 1. april** trengs:

1. **Stripe betaling** — Absolutt #1 prioritet
2. **Sikkerhetsfiks** — Auth, RLS, dev-login
3. **Compliance** — Cookie consent, AI-disclosure, legal-sider
4. **WhatsApp Cloud API** — Viktig men kan utsettes til v1.1

Med fokusert arbeid i 6 uker er launch 1. april **realistisk men stramt**. Anbefaling: Launch med Telegram-only som MVP, legg til WhatsApp i april.

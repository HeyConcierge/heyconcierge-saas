# 🗓️ HC Produktmøte — Mandag 16. feb 13:00-16:00

## Deltakere: Jacob, Erik, Lars

---

## 1. Aksjonæravtale (30 min)
- Gjennomgå aksjonæravtale punkt for punkt
- Endring: Drag-along erstattet med enstemmighet for salg ✅
- Vesting: 4 år / 1 år cliff — alle enige?
- Good/bad leaver, aktivitetskrav, IP
- Signering (digitalt eller fysisk?)

## 2. Onboarding & Kundereise (45 min)
- **Hele flyten fra A-Z**: Ny kunde registrerer seg → lager profil → kobler WhatsApp → gjesten får melding
- Test live: Opprett en profil og verifiser at alt funker mot WhatsApp
- Sjekk at velkomstmelding, FAQ, eskalering fungerer
- PDF-upload (Erik: NEXT_PUBLIC_BACKEND_URL env var i Vercel)
- Identifiser hull i kundereisen

## 3. Sikkerhet (20 min)
- **Prompt injection**: Sikre at gjester ikke kan lure AI-en til å lekke API-nøkler, systemprompts, eller intern data
- Input sanitering / guardrails
- Rate limiting (allerede bygd ✅)
- Data-isolasjon mellom properties

## 4. GDPR & Personvern (15 min)
- Personvernerklæring (Mildrid kan drafte)
- Databehandleravtale (DPA)
- Hva lagres? Hvor lenge? Hvem har tilgang?
- Sletting av gjestedata etter checkout
- Cookie/samtykke på landing page

## 5. Betalingsløsning (15 min)
- Stripe integrasjon — hvem setter opp?
- Trial-periode? (14 dager gratis?)
- Fakturering: månedlig eller årlig?
- Koble til Folio bedriftskonto

## 6. Prismodell (20 min)
- **Small (1-10 enheter)**: Airbnb-verter, enkeltpersoner
- **Medium (10-30 enheter)**: Profesjonelle forvaltere
- **Enterprise (30+)**: Hoteller, kjeder
- Pris per enhet/mnd? Flat fee + per enhet?
- Forslag å diskutere:

| Plan | Enheter | Pris/mnd | Inkludert |
|------|---------|----------|-----------|
| Starter | 1-10 | kr 299-499/enhet | AI concierge, WhatsApp, 1 språk |
| Professional | 10-30 | kr 199-349/enhet | Alt i Starter + multi-lang, analytics, priority support |
| Enterprise | 30+ | Tilbud | Alt + custom integrasjoner, dedicated support, SLA |

- Sammenlign med konkurrenter
- Freemium / free tier for 1 enhet?

## 7. SoMe & Marketing (10 min)
- Domene: heyconcierge.io? Status?
- Instagram handle: @heyconcierge.io / @heyconcierge.ai?
- LinkedIn bedriftsside
- TikTok — hvem lager innhold?
- Animasjonsvideo klar ✅ (Pixar-style intro)

## 8. Annet / Neste steg (5 min)
- Dev workflow: GitHub Issues + PRs
- Code review av mildrid/new-features branch
- Neste møte?
- AS-registrering status (Jacob startet i dag ✅)

---

**Tidsramme: 13:00-16:00 (3 timer)**

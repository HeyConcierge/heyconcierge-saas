# HeyConcierge — SEO & Digital Synlighetsstrategi

**Utarbeidet:** 18. februar 2026  
**Launch:** 1. april 2026  
**Domene:** heyconcierge.io  
**Status:** Nytt domene, null autoritet, 3-manns team, bootstrap-budsjett  

---

## Innhold

1. [Teknisk SEO](#1-teknisk-seo)
2. [Keyword Strategy](#2-keyword-strategy)
3. [Content Strategy](#3-content-strategy)
4. [Landing Page SEO](#4-landing-page-seo)
5. [Google Business Profile + Local SEO](#5-google-business-profile--local-seo)
6. [Paid Channels](#6-paid-channels)
7. [Social Media & Community](#7-social-media--community)
8. [Backlink Strategy](#8-backlink-strategy)
9. [Konkurrentanalyse](#9-konkurrentanalyse)
10. [KPIer og Tracking](#10-kpier-og-tracking)
11. [90-dagers Roadmap](#11-90-dagers-roadmap)

---

## 1. Teknisk SEO

### Site Structure

```
heyconcierge.io/
├── / (homepage — primary landing)
├── /features/
│   ├── /features/ai-guest-messaging/
│   ├── /features/whatsapp-concierge/
│   ├── /features/telegram-concierge/
│   ├── /features/multi-language/
│   ├── /features/upselling/
│   └── /features/automated-check-in/
├── /pricing/
├── /integrations/
│   ├── /integrations/airbnb/
│   ├── /integrations/booking-com/
│   ├── /integrations/guesty/
│   ├── /integrations/hostaway/
│   └── /integrations/ownerrez/
├── /blog/
├── /about/
├── /contact/
├── /demo/
├── /signup/
└── /legal/
    ├── /legal/privacy/
    └── /legal/terms/
```

**Viktig:** Hver integrasjonsside er en selvstendig landingsside med unik copy, screenshots, og SEO-optimalisert for "[PMS-navn] + AI guest messaging". Disse sidene er lavkonkurranse gull.

### Meta Tags — Mal

```html
<!-- Homepage -->
<title>HeyConcierge — AI Concierge for Airbnb & Vacation Rental Hosts | WhatsApp & Telegram</title>
<meta name="description" content="Automate guest messaging with AI. HeyConcierge handles check-in instructions, local tips, and upselling via WhatsApp & Telegram. 24/7. Multi-language. Free trial.">

<!-- Feature page eksempel -->
<title>AI Guest Messaging for Vacation Rentals | HeyConcierge</title>
<meta name="description" content="Let AI handle 90% of guest questions automatically. Works with Airbnb, Booking.com, and all major PMS. Set up in 5 minutes.">
```

**Regler:**
- Title: 50-60 tegn, primær keyword først
- Description: 140-155 tegn, inkluder CTA og differensiator
- Unikt per side — aldri dupliser
- Inkluder brand name i alle titles

### Schema Markup

Implementer disse fra dag 1:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "HeyConcierge",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, WhatsApp, Telegram",
  "description": "AI-powered guest concierge for short-term rental hosts",
  "url": "https://heyconcierge.io",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free trial available"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "0"
  },
  "creator": {
    "@type": "Organization",
    "name": "HeyConcierge",
    "url": "https://heyconcierge.io",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tromsø",
      "addressCountry": "NO"
    }
  }
}
```

Tillegg:
- **FAQPage** schema på pricing og feature-sider (øker CTR med FAQ-rich snippets)
- **BreadcrumbList** på alle undersider
- **Article** schema på bloggposter
- **Organization** schema i footer/about

### Tekniske Krav

| Element | Krav | Verktøy |
|---------|------|---------|
| Core Web Vitals | LCP < 2.5s, FID < 100ms, CLS < 0.1 | PageSpeed Insights |
| Mobile-first | 100% responsivt, touch-friendly CTAs | Chrome DevTools |
| HTTPS | SSL via Cloudflare eller hosting | Cloudflare |
| Sitemap | Auto-generert XML, submit til GSC | Next.js/framework plugin |
| Robots.txt | Tillat alt unntatt /admin, /api | Manuelt |
| Canonical tags | Self-referencing på alle sider | Framework |
| Hreflang | `en` default. Legg til `de`, `es`, `fr` når flerspråklig innhold er live (Fase 2+) | Manuelt |
| Image optimization | WebP, lazy loading, alt-tekst med keywords | Next/Image el. |
| Page speed | Statisk/SSG der mulig, minimal JS | Lighthouse |

**Stack-anbefaling:** Next.js på Vercel. Gir SSG, automatisk image optimization, edge caching, og perfekte Core Web Vitals uten config.

---

## 2. Keyword Strategy

### Primære Keywords (Engelsk — Globalt Fokus)

| Keyword | Est. Månedlig Søk | Konkurranse | Prioritet |
|---------|-------------------|-------------|-----------|
| AI guest messaging | 500-1K | Medium | ⭐⭐⭐ |
| vacation rental AI | 300-800 | Medium | ⭐⭐⭐ |
| Airbnb automation software | 1K-2K | Høy | ⭐⭐ |
| AI concierge vacation rental | 200-500 | Lav | ⭐⭐⭐ |
| WhatsApp Airbnb guest communication | 100-300 | Lav | ⭐⭐⭐ |
| guest messaging automation | 500-1K | Medium | ⭐⭐⭐ |
| short-term rental chatbot | 200-500 | Lav | ⭐⭐⭐ |
| Airbnb guest communication tool | 300-800 | Medium | ⭐⭐ |

### Sekundære Keywords

| Keyword | Est. Månedlig Søk | Konkurranse |
|---------|-------------------|-------------|
| vacation rental upselling | 200-400 | Lav |
| automated check-in instructions | 300-600 | Lav |
| Airbnb host tools 2026 | 500-1K | Medium |
| property management AI | 500-1K | Medium |
| guest experience automation | 200-400 | Lav |
| Booking.com host messaging | 100-300 | Lav |
| rental property chatbot | 200-400 | Lav |

### Long-tail Keywords (Gull for nytt domene!)

Disse har lav konkurranse og høy kjøpsintensjon. Globalt søkevolum (primært US/UK/AU/CA/EU):

**Guest Messaging & AI:**
- "how to automate airbnb guest messages" (300-500/mnd)
- "AI auto-reply airbnb guests" (200-400/mnd)
- "best guest messaging software for airbnb 2026" (100-300/mnd)
- "how to respond to airbnb guests faster" (300-500/mnd)
- "multilingual guest communication vacation rental" (50-100/mnd)
- "reduce airbnb response time" (100-200/mnd)

**WhatsApp/Telegram-spesifikke (HeyConcierge sin moat):**
- "whatsapp bot for vacation rental" (100-200/mnd)
- "whatsapp airbnb guest communication" (100-300/mnd)
- "telegram bot vacation rental host" (50-100/mnd)
- "send check-in instructions via whatsapp" (50-100/mnd)
- "whatsapp business for airbnb hosts" (200-400/mnd)
- "guest messaging app for short term rental" (100-200/mnd)

**PMS-spesifikke (fanger brukere av konkrete systemer):**
- "guesty ai messaging integration" (50-100/mnd)
- "hostaway automated guest messages" (50-100/mnd)
- "ownerrez guest communication automation" (30-50/mnd)
- "lodgify ai messaging" (20-50/mnd)
- "beds24 guest auto reply" (20-50/mnd)

**Revenue & Operations:**
- "vacation rental upselling strategies" (200-400/mnd)
- "airbnb check-in instructions automation" (200-400/mnd)
- "how to get 5-star reviews airbnb automatically" (200-500/mnd)
- "airbnb superhost response time hack" (100-200/mnd)

**Geo-modified (ekstremt lavt konkurransenivå):**
- "airbnb automation tools USA" (100-200/mnd)
- "vacation rental AI UK" (50-100/mnd)
- "short term rental chatbot Australia" (30-50/mnd)
- "airbnb host tools Europe" (50-100/mnd)

### Regionale Keywords (Ekspansjon — Fase 2+)

Norsk, tysk, spansk, fransk og portugisisk er sekundærmarkeder. Ikke prioritér flerspråklig SEO-innhold før organisk trafikk på engelsk overstiger 5K/mnd. Når tiden er inne:

| Marked | Eksempel-keywords | Volumpotensial | Konkurranse |
|--------|-------------------|----------------|-------------|
| 🇩🇪 Tyskland/Østerrike | "Airbnb Automatisierung", "KI Gästekommunikation", "Ferienwohnung Chatbot" | 500-1K/mnd samlet | Lav |
| 🇪🇸 Spania/LatAm | "automatización Airbnb", "mensajería huéspedes IA", "concierge IA alquiler vacacional" | 1K-2K/mnd samlet | Lav |
| 🇫🇷 Frankrike | "conciergerie IA location courte durée", "messagerie automatique Airbnb" | 500-1K/mnd samlet | Lav |
| 🇳🇴 Norge | "Airbnb automatisering", "AI chatbot utleie" | 50-200/mnd samlet | Null |

**Strategi:** 100% engelsk til 5K organic/mnd. Norsk kun for GBP-forankring (1-2 sider). Tysk og spansk er de største internasjonale mulighetene etter engelsk.

### Keyword Mapping

| Side | Primær Keyword | Sekundære |
|------|---------------|-----------|
| Homepage | AI concierge vacation rental | guest messaging, Airbnb automation |
| /features/ai-guest-messaging/ | AI guest messaging | automated replies, guest communication |
| /features/whatsapp-concierge/ | WhatsApp vacation rental bot | WhatsApp Airbnb, WhatsApp guest messaging |
| /integrations/airbnb/ | Airbnb guest messaging automation | Airbnb AI, Airbnb auto-reply |
| /integrations/guesty/ | Guesty AI messaging | Guesty integration, Guesty automation |
| /pricing/ | vacation rental AI pricing | guest messaging cost, affordable |

---

## 3. Content Strategy

### Pillar Pages (4 stk — bygges pre-launch)

1. **"The Complete Guide to AI Guest Messaging for Vacation Rentals"** (3000+ ord)
   - Target: "AI guest messaging" + "vacation rental AI"
   - Cluster: 8-10 støtteblogger

2. **"Airbnb Automation: Everything Hosts Need to Know in 2026"** (3000+ ord)
   - Target: "Airbnb automation" + "Airbnb host tools"
   - Cluster: 8-10 støtteblogger

3. **"WhatsApp for Vacation Rental Hosts: The Ultimate Guide"** (2500+ ord)
   - Target: "WhatsApp vacation rental" + "WhatsApp Airbnb"
   - Cluster: 5-7 støtteblogger

4. **"Guest Experience Automation: From Booking to Checkout"** (2500+ ord)
   - Target: "guest experience automation" + "check-in automation"
   - Cluster: 5-7 støtteblogger

### Blog Topics — Pre-Launch (Publiser 2x/uke fra nå)

**Uke 1-2 (Feb 18 - Mar 3):**
1. "5 Ways AI Is Changing Guest Communication in 2026"
2. "Why Airbnb Superhosts Are Switching to AI Messaging"
3. "How to Reduce Your Airbnb Response Time to Under 1 Minute"
4. "WhatsApp vs Email: Why Guests Prefer Messaging Apps"

**Uke 3-4 (Mar 3-17):**
5. "The Hidden Cost of Slow Guest Responses (And How to Fix It)"
6. "Automated Check-In Instructions: A Step-by-Step Guide"
7. "How to Upsell Late Checkout and Early Check-In Automatically"
8. "Booking.com vs Airbnb: Guest Communication Differences"

**Uke 5-6 (Mar 17-31):**
9. "Multi-Language Guest Communication Without Hiring Translators"
10. "How Property Managers Handle 100+ Listings Without Burnout"
11. "Guest Messaging Templates That Get 5-Star Reviews"
12. "The Rise of AI Concierges in Short-Term Rentals"

**Post-Launch (Apr+): 1-2x/uke**
- Comparison posts: "HeyConcierge vs [Competitor]" (target "alternative to X" keywords)
- Case studies med beta-brukere
- "Best AI tools for Airbnb hosts 2026" (listicle, inkluder HeyConcierge)
- Integrasjon-spesifikke guides ("How to Set Up AI Messaging with Guesty")
- Gjeste-perspektiv innhold ("What Guests Actually Want from Hosts")

### Content Format

- **Alle bloggposter:** Min 1500 ord, optimalisert for 1 primær + 2-3 sekundære keywords
- **Interne lenker:** Hver post linker til min 2 andre bloggposter + 1 feature/landingsside
- **CTA:** Hver post har mid-article CTA ("Want to try AI messaging? Start free →") og end CTA
- **Visuelle elementer:** Screenshots, infografikker, sammenligningstabeller (øker tid-på-side)
- **Featured snippet-optimalisering:** Bruk "What is..." + definisjon, nummererte lister, tabeller

---

## 4. Landing Page SEO — Dag 1 Requirements

### Homepage Must-Haves

```
[Hero Section]
H1: "AI-Powered Guest Concierge for Vacation Rental Hosts"
Subheading: "Automate guest messaging on WhatsApp & Telegram. 24/7. Multi-language. Works with Airbnb, Booking.com & all major PMS."
CTA: "Start Free Trial" / "See Demo"

[Social Proof]
- Logos: PMS-integrasjoner (Airbnb, Booking, Guesty, Hostaway)
- "Trusted by X hosts" (selv om det er 10 beta-brukere)

[Feature Grid]
- AI Guest Messaging → /features/ai-guest-messaging/
- WhatsApp & Telegram → /features/whatsapp-concierge/
- Multi-language (40+ languages) → /features/multi-language/
- Smart Upselling → /features/upselling/
- Automated Check-in → /features/automated-check-in/

[How It Works — 3 Steps]
1. Connect your PMS
2. Customize AI personality
3. Let AI handle guests 24/7

[Testimonials / Beta Feedback]

[FAQ Section med Schema]
- "How does HeyConcierge work?"
- "Which PMS does it integrate with?"
- "How much does HeyConcierge cost?"
- "Is it available in my language?"
- "Can I control what the AI says?"

[Blog Preview — Latest 3 posts]

[Footer med alle sider, legal, social links]
```

### On-Page SEO Checklist

- [ ] H1 med primær keyword (kun 1 H1 per side)
- [ ] H2s med sekundære keywords
- [ ] Keyword i første 100 ord
- [ ] Keyword i URL slug
- [ ] Internal links til feature-sider og blogg
- [ ] External links til autoritative kilder (1-2 per side)
- [ ] Alt-tekst på alle bilder med relevante keywords
- [ ] Open Graph tags for social sharing (bilde, tittel, description)
- [ ] Twitter Card meta tags
- [ ] Structured data (SoftwareApplication + FAQPage)
- [ ] Page load < 2 sekunder
- [ ] Mobile-optimalisert med touch-friendly elementer

### Landing Pages for Paid Traffic (Ikke-indekserte)

Lag separate landing pages for Google Ads som IKKE er indexert (noindex), men optimalisert for konvertering:
- `/lp/airbnb-automation/` — For "Airbnb automation" ads
- `/lp/guest-messaging/` — For "guest messaging" ads

---

## 5. Google Business Profile + Local SEO

### Oppsett

1. **Opprett Google Business Profile:**
   - Bedriftsnavn: HeyConcierge
   - Kategori: "Software Company" (primær) + "Internet Marketing Service" (sekundær)
   - Adresse: Tromsø-adresse (kontoradresse OK)
   - Telefon: Norsk nummer
   - Website: heyconcierge.io
   - Åpningstider: 09-17 (eller "Open 24 hours" for SaaS)

2. **Optimaliser Profil:**
   - Beskrivelse: Inkluder "AI concierge", "vacation rental", "global SaaS", "headquartered in Tromsø, Norway"
   - Legg til produkter: HeyConcierge Free, HeyConcierge Pro, HeyConcierge Enterprise
   - Bilder: Teambilder, kontor/workspace, product screenshots
   - Services: List opp alle features

3. **Posts:** Publiser 1x/uke — produktoppdateringer, blogghøydepunkter, events

### Lokal SEO-verdi

- Bygger autoritet for "AI concierge Norway", "vacation rental software Tromsø"
- Tromsø = turistdestinasjon → relevant kobling mellom lokasjon og produkt
- GBP gir en Knowledge Panel som ser profesjonelt ut for et nytt selskap
- NAP consistency (Name, Address, Phone) på alle plattformer

### Lokale Kataloger

Registrer HeyConcierge i:
- Proff.no
- Gulesider.no
- LinkedIn Company Page (Tromsø lokasjon)
- Brønnøysundregistrene (allerede gjort ved AS-registrering)
- Crunchbase (gratis profil)

---

## 6. Paid Channels

### Budsjettfordeling: kr 7 500/mnd (sweet spot)

| Kanal | Budsjett/mnd | Formål |
|-------|-------------|--------|
| Google Ads | kr 4 000 | Demand capture — folk som søker aktivt |
| Meta Ads (Facebook/Instagram) | kr 2 500 | Awareness + retargeting |
| LinkedIn Ads | kr 1 000 | B2B property managers (kun retargeting) |

### Google Ads — Strategi

**Kampanje 1: Brand Defense (kr 500/mnd)**
- Keywords: "heyconcierge", "hey concierge"
- Beskytter mot konkurrenter som byr på ditt brand
- CPC: < kr 2

**Kampanje 2: High-Intent Search (kr 2 500/mnd)**
- Keywords:
  - "AI guest messaging software" (exact/phrase)
  - "airbnb automation tool" (exact/phrase)
  - "vacation rental chatbot" (exact/phrase)
  - "whatsapp bot for airbnb" (exact/phrase)
- Negatives: "free", "open source", "DIY", "how to build"
- Target: Tier 1 (US, UK, AU, CA) → Tier 2 (DE, ES, FR, IT, NL, PT) → Tier 3 (APAC: JP, KR, TH, ID — kun hvis data viser traction)
- Landing: /lp/guest-messaging/ (dedicated konverteringsside)
- Forventet CPC: kr 15-40
- Forventet konvertering: 3-5% → 5-15 signups/mnd

**Kampanje 3: Competitor Keywords (kr 1 000/mnd)**
- Keywords: "Hospitable alternative", "Besty AI alternative", "OwnerRez messaging"
- Landing: Comparison page
- Lavere Quality Score, høyere CPC — men høy kjøpsintensjon

### Meta Ads — Strategi

**Kampanje 1: Awareness (kr 1 500/mnd)**
- Format: 15-30 sek video (demo av AI som svarer gjest)
- Targeting:
  - Interests: Airbnb hosting, vacation rental, property management
  - Behaviors: Small business owners
  - Custom: Lookalike fra email-liste (når den har 100+)
- Mål: Link clicks → blogginnhold
- Forventet CPM: kr 40-80

**Kampanje 2: Retargeting (kr 1 000/mnd)**
- Audience: Website visitors siste 30 dager (behøver Meta Pixel fra dag 1!)
- Format: Carousel med features + testimonials
- CTA: Start Free Trial
- Forventet ROAS: 3-5x

### LinkedIn Ads — Strategi

Med kr 1 000/mnd er LinkedIn kun verdt det for retargeting:
- Matched Audiences: Website visitors + email-liste
- Format: Single image ad
- Target: Property managers, hospitality professionals
- Budsjett for kald LinkedIn-annonsering er for høyt (kr 50-100 CPC) for bootstrap

### ROI-rangering for HeyConcierge

1. **Google Ads Search** — Best ROI. Fanger folk med kjøpsintensjon.
2. **Meta Retargeting** — Billig, høy konvertering på varmt publikum.
3. **Meta Awareness** — Bygger top-of-funnel, men lang payback.
4. **LinkedIn** — For dyrt som primærkanal med dette budsjettet.

### Tips for Bootstrap-budsjett

- Start med kun Google Ads Search i 2 uker. Mål konvertering.
- Legg til Meta retargeting når dere har 500+ monthly visitors.
- A/B-test annonsetekst aggressivt — bytt hver 2. uke.
- Bruk UTM-parametre på alt: `?utm_source=google&utm_medium=cpc&utm_campaign=high-intent`

---

## 7. Social Media & Community

### Kanalstrategi

| Kanal | Prioritet | Frekvens | Innholdstype |
|-------|-----------|----------|-------------|
| LinkedIn | ⭐⭐⭐ | 3-4x/uke | Thought leadership, product updates, industry insights |
| Instagram | ⭐⭐ | 3-4x/uke | Reels (demo), stories (behind-the-scenes), carousel (tips) |
| TikTok | ⭐⭐ | 2-3x/uke | Korte demo-videoer, "AI svarer crazy guest requests" |
| Twitter/X | ⭐⭐ | Daily | Hot takes, product updates, community engagement |
| YouTube | ⭐ | 2x/mnd | Tutorials, product demos, webinars |

### LinkedIn — Primærkanal for B2B

**Hvorfor:** Property managers og vacation rental professionals lever på LinkedIn. Hospitable, Guesty, og Hostaway bygger store audiences her.

**Innholdsplan:**
- **Mandag:** Industri-insight / trend ("WhatsApp open rate is 98% vs 20% for email. Why aren't more hosts using it?")
- **Onsdag:** Product/feature teaser med screenshot eller kort video
- **Fredag:** Behind-the-scenes / founder journey / startup lessons

**Taktikker:**
- Grunnlegger(e) poster fra personlige profiler (3-5x rekkevidde vs company page)
- Kommenter på ALLE relevante poster fra konkurrenter og industri-influencere
- Engasjer i LinkedIn-grupper: "Vacation Rental Professionals", "Airbnb Hosts", "Property Management"
- Tagg relevante folk (PMS-partnere, beta-brukere) i produktposter

### Instagram — Visuell Storytelling

**Content mix:**
- 40% Reels: AI-demo ("Watch AI handle this guest's 3am question"), tips for hosts
- 30% Carousel: "5 guest messages you should automate", "AI vs manual response comparison"
- 20% Stories: Polls, Q&A, behind-the-scenes, launch countdown
- 10% Static: Infographics, quotes, testimonials

**Hashtags:** #airbnbhost #vacationrental #shorttermrental #airbnbsuperhost #propertymanagement #hostlife #airbnbautomation #aiconcierge #guestexperience

### TikTok — Viral Potensial

**Formater som funker:**
- "POV: Your AI concierge at 3am" (humoristisk)
- "Guest asked [crazy question] — watch the AI handle it"
- "Day in the life of an Airbnb host with AI vs without"
- "I automated my Airbnb guest messaging — here's what happened"

**Mål:** Ikke salg. Awareness og entertainment. Én viral video = 100K+ views gratis.

### Community Building — Dominere Samtalen

1. **Start en "Short-Term Rental AI" community:**
   - Facebook-gruppe: "AI for Vacation Rental Hosts" (plattform-agnostisk, ikke selg)
   - Mål: 500 medlemmer innen 90 dager
   - Innhold: Tips, diskusjoner, Q&A — HeyConcierge nevnes organisk

2. **Infiltrer eksisterende communities:**
   - Reddit: r/airbnb_hosts, r/vrbo, r/ShortTermRentals — vær hjelpsom, ikke selg
   - Facebook: "Airbnb Hosts Forum", "Vacation Rental World"
   - Hospitable Community (de har et åpent forum med 3,596 medlemmer!)

3. **Email-liste fra dag 1:**
   - Lead magnet: "50 Guest Messaging Templates for Airbnb Hosts" (PDF)
   - Pop-up på blogg
   - Nurture-sekvens: 5 emails over 2 uker → free trial CTA

---

## 8. Backlink Strategy

### Prioritert Rekkefølge (Effort vs Impact)

#### Tier 1: Lavt Effort, Høy Impact (Uke 1-4)

1. **PMS Marketplace Listings**
   - Guesty Marketplace → Partner listing
   - Hostaway Marketplace → (Besty AI er allerede der, HeyConcierge må også)
   - OwnerRez integrations directory
   - Lodgify, Beds24, Smoobu
   - **Verdi:** Dofollow-lenke fra DA 40-60 domener + direkte trafikk fra relevante brukere

2. **Startup Directories (Gratis)**
   - Crunchbase
   - AngelList / Wellfound
   - BetaList (pre-launch)
   - Launching Next
   - SaaS Hub
   - AlternativeTo (list som alternativ til Hospitable, Besty AI)
   - **Verdi:** 10-15 backlinks fra DA 50-80 domener

3. **Review-plattformer**
   - Capterra (gratis listing)
   - G2 (gratis listing)
   - GetApp
   - Software Advice
   - **Verdi:** DA 90+ backlinks + review-drevet trafikk. Trenger min 5 reviews for synlighet.

#### Tier 2: Medium Effort, Høy Impact (Uke 4-8)

4. **Guest Posts**
   - Target-publikasjoner:
     - iGMS blog
     - Rental Scale-Up (industri-nyhetsbrev)
     - AirDNA (data-fokusert industri)
     - Short Term Rentalz
     - Vacation Rental Owners Forum
   - Pitch: "How AI Is Reducing Guest Response Times by 95%" (data-drevet artikkel)
   - **Verdi:** Dofollow backlink + thought leadership + referral traffic

5. **HARO / Connectively / Quoted**
   - Registrer som expert kilde for "vacation rentals", "AI in hospitality", "property management technology"
   - Svar på 2-3 forespørsler/uke
   - **Verdi:** Backlinks fra nyhetsmedier (DA 70+)

#### Tier 3: Høyt Effort, Veldig Høy Impact (Uke 8-12)

6. **Product Hunt Launch**
   - **Dato:** 2-3 uker etter launch (mid-april)
   - **Forberedelse:**
     - Bygg en hunter-relasjon (eller bruk egen profil)
     - Lag en killer landingsside for PH
     - Forbered 20+ folk som upvoter (ikke fake — reelle brukere/venner)
     - Teaser på social media 1 uke før
   - **Mål:** Top 5 Product of the Day
   - **Verdi:** DA 90+ backlink, 1000-5000 visitors på launch day, PR-dekning

7. **Original Research / Data Study**
   - "The State of Guest Communication in Vacation Rentals 2026"
   - Survey 200+ hosts (via Facebook-grupper + email-liste)
   - Publiser funn med infografikk
   - Pitch til industripublikasjoner
   - **Verdi:** Naturlig link magnet — journalister og bloggere linker til originaldata

### Backlink KPIer

| Metric | 30 dager | 60 dager | 90 dager |
|--------|----------|----------|----------|
| Referring domains | 15-20 | 35-50 | 60-80 |
| Domain Authority (Moz) | DA 5-8 | DA 10-15 | DA 15-20 |
| Domain Rating (Ahrefs) | DR 5-10 | DR 12-18 | DR 18-25 |

---

## 9. Konkurrentanalyse

### Besty AI (getbesty.ai)

**Styrker:**
- Tydelig posisjonering: AI-powered upselling + guest messaging
- Marketplace-tilstedeværelse (Hostaway, Guesty)
- Team-side som bygger tillit
- Fokus på revenue ("boost revenue by 30%")

**Svakheter:**
- Begrenset blogginnhold — lite organic content marketing
- Ingen synlig WhatsApp/Telegram-differensiering
- Ingen community/forum
- Relativt nytt domene, moderat autoritet

**Mulighet for HeyConcierge:**
- Skriv "Besty AI vs HeyConcierge" comparison page
- Target "Besty AI alternative" keyword
- Differensier på WhatsApp/Telegram-first approach

### Hospitable (hospitable.com)

**Styrker:**
- **Massiv content-maskin:** 100+ bloggartikler som ranker for high-volume keywords
- Pillar pages: "Airbnb templates", "Airbnb welcome book", "Airbnb SEO"
- Community forum med 3,596 medlemmer og 1,084 topics
- DA 50+ — etablert autoritet
- Full PMS-plattform (bredere enn kun messaging)

**Svakheter:**
- AI messaging er tilleggsfunksjon, ikke kjerne
- Ikke WhatsApp/Telegram-first
- Blogginnhold er bredt (generelle hosting-tips) — ikke dypt på AI
- Prising er høyere enn rene messaging-verktøy

**Mulighet for HeyConcierge:**
- IKKE konkurrér på brede hosting-keywords (de har for mye autoritet)
- Target AI-spesifikke nisjekeywords der Hospitable er svak
- "Hospitable vs HeyConcierge" — posisjonér som spesialist vs generalist
- Engasjer i Hospitable Community (de har åpent forum!)

### OwnerRez (ownerrez.com)

**Styrker:**
- Etablert PMS med sterk teknisk brukerbase
- God integrasjonsdokumentasjon
- Aktiv Reddit-tilstedeværelse

**Svakheter:**
- Minimalt AI-fokus i marketing
- Gammel-skole website-design
- Lite blogginnhold sammenlignet med Hospitable
- Ingen AI messaging-funksjon

**Mulighet for HeyConcierge:**
- OwnerRez-brukere trenger AI messaging → integrasjonsside + content
- Target "OwnerRez AI messaging", "OwnerRez automation"
- Guest post eller partnership-mulighet

### Andre Konkurrenter å Overvåke

| Konkurrent | Fokus | Trussel |
|-----------|-------|---------|
| Enso Connect | Guest experience platform | Medium — etablert, men bredt |
| HostBuddy AI | AI messaging | Høy — direkte konkurrent |
| Host-Pilot AI | AI operations | Medium — nyere aktør |
| AEVE AI | AI autopilot | Høy — AI-first, god thought leadership |

### Strategisk Gap-Analyse

**Ingen konkurrent eier disse posisjonene:**
1. ❌ "WhatsApp for vacation rentals" — ingen dominerer dette søket
2. ❌ "Telegram for Airbnb hosts" — blåhav
3. ❌ "AI concierge" + messaging app combination
4. ❌ Multilingual AI guest communication (spesifikt)
5. ❌ Geo-targeted content for key STR markets (Bali, Algarve, Costa del Sol, Gold Coast, Tulum, etc.)

**HeyConcierge sin moat:** WhatsApp/Telegram-first + multilingual AI = unik posisjon ingen konkurrent har tatt.

---

## 10. KPIer og Tracking

### Verktøy-Stack

| Verktøy | Kostnad | Formål |
|---------|---------|--------|
| Google Search Console | Gratis | Indeksering, søkeposisjon, CTR, impressions |
| Google Analytics 4 | Gratis | Trafikk, konvertering, brukeratferd |
| Google Tag Manager | Gratis | Event tracking, pixel management |
| Ahrefs Webmaster Tools | Gratis | Backlink-overvåking, site audit |
| Ubersuggest | Gratis/billig | Keyword tracking (opptil 25 keywords gratis) |
| Meta Pixel | Gratis | Retargeting + konverteringssporing |
| Hotjar (gratis plan) | Gratis | Heatmaps, recordings, feedback |

**Spar penger:** Ikke kjøp Ahrefs/Semrush ($99-199/mnd) ennå. Bruk gratisverktøy + Ubersuggest til dere har 5K+ monthly visitors.

### KPI-Dashboard

#### Månedlige KPIer

| KPI | Mål 30d | Mål 60d | Mål 90d |
|-----|---------|---------|---------|
| Organic sessions | 200 | 800 | 2,000 |
| Organic keywords (top 100) | 50 | 200 | 500 |
| Blog posts published | 8 | 16 | 24 |
| Referring domains | 20 | 50 | 80 |
| Domain Rating | DR 8 | DR 15 | DR 22 |
| Email subscribers | 50 | 200 | 500 |
| Free trial signups (total) | 20 | 80 | 200 |
| Trial → Paid conversion | 10% | 12% | 15% |
| Google Ads CPA | kr 200 | kr 150 | kr 120 |
| Social followers (total) | 200 | 600 | 1,500 |

#### Ukentlige Check-Ins

Hver mandag, sjekk:
1. GSC: Nye keywords som ranker, endringer i posisjon
2. GA4: Trafikk per kanal, bounce rate, konverteringer
3. Google Ads: CPC, CTR, konverteringer, negative keywords å legge til
4. Backlinks: Nye referring domains (Ahrefs Webmaster Tools)
5. Content: Neste ukes artikler planlagt og i produksjon

### Event Tracking (GTM)

Sett opp disse events i GA4 via GTM fra dag 1:

```
- page_view (automatic)
- sign_up_started (klikk "Start Free Trial")
- sign_up_completed (registrering fullført)
- demo_requested (klikk "See Demo")
- blog_cta_clicked (klikk CTA i bloggpost)
- pricing_viewed (besøker /pricing/)
- lead_magnet_downloaded (nedlasting av PDF)
- scroll_50 (scrollet 50% av siden)
```

---

## 11. 90-dagers Roadmap

### Fase 1: Pre-Launch Foundation (Uke 1-6 → 18. feb - 31. mars)

#### Uke 1 (18-24 feb)
- [ ] **Teknisk:** Sett opp Next.js prosjekt med SSG, deploy til Vercel
- [ ] **Teknisk:** Implementer GSC, GA4, GTM, Meta Pixel
- [ ] **Teknisk:** Konfigurer sitemap.xml, robots.txt, schema markup
- [ ] **Content:** Skriv og publiser bloggpost #1 og #2
- [ ] **SEO:** Keyword-research deep dive — verifiser søkevolum med Ubersuggest
- [ ] **Social:** Opprett LinkedIn Company Page + Instagram + Twitter/X
- [ ] **Social:** Grunnlegger(e) begynner å poste på personlig LinkedIn (3x/uke)

#### Uke 2 (24 feb - 3 mar)
- [ ] **Landing:** Homepage ferdigstilt med all SEO on-page
- [ ] **Landing:** /features/ sider (min 3 stk) live
- [ ] **Content:** Bloggpost #3 og #4 publisert
- [ ] **Content:** Start pillar page #1 ("Complete Guide to AI Guest Messaging")
- [ ] **Backlinks:** Submit til 10 startup directories (BetaList, Crunchbase, etc.)
- [ ] **Social:** Første Instagram Reel (AI-demo teaser)

#### Uke 3 (3-10 mar)
- [ ] **Landing:** /pricing/ side live
- [ ] **Landing:** /integrations/ sider (min Airbnb, Booking.com, Guesty)
- [ ] **Content:** Bloggpost #5 og #6
- [ ] **Content:** Pillar page #1 ferdig og publisert
- [ ] **Backlinks:** Submit til Capterra, G2, GetApp
- [ ] **Local:** Google Business Profile opprettet og optimalisert
- [ ] **Email:** Lead magnet ("50 Guest Messaging Templates") ferdig, optin form live

#### Uke 4 (10-17 mar)
- [ ] **Content:** Bloggpost #7 og #8
- [ ] **Content:** Start pillar page #2 ("Airbnb Automation Guide")
- [ ] **Backlinks:** Kontakt 5 PMS-er om marketplace listing
- [ ] **Backlinks:** Registrer på HARO/Connectively, begynn å svare
- [ ] **Social:** TikTok-konto live, første 3 videoer postet
- [ ] **Ads:** Sett opp Google Ads-kontoer, lag kampanjer (ikke aktiver ennå)

#### Uke 5 (17-24 mar)
- [ ] **Content:** Bloggpost #9 og #10
- [ ] **Content:** Pillar page #2 ferdig
- [ ] **Backlinks:** Pitch guest post til 3 industripublikasjoner
- [ ] **Social:** Facebook-gruppe "AI for Vacation Rental Hosts" opprettet
- [ ] **Ads:** Meta Ads kampanjer klargjort
- [ ] **PR:** Pre-launch email til beta wait-list

#### Uke 6 (24-31 mar) — LAUNCH WEEK PREP
- [ ] **Content:** Bloggpost #11 og #12
- [ ] **Landing:** Alle sider finpusset, hastighetsoptimalisert, testet
- [ ] **Landing:** Comparison pages ("vs Hospitable", "vs Besty AI") klare
- [ ] **Social:** Launch countdown på alle kanaler
- [ ] **Email:** Launch-announcement email drafted
- [ ] **Ads:** Google Ads og Meta Ads klare til aktivering
- [ ] **PR:** Product Hunt launch forberedt (assets, copy, supporters)

### Fase 2: Launch (Uke 7 → 1-7 april)

#### Uke 7 (1-7 apr) — 🚀 LAUNCH
- [ ] **LAUNCH DAY (1. apr):**
  - Aktiver alle ad-kampanjer
  - Send launch email til hele listen
  - Post på alle sosiale kanaler
  - Submit til Hacker News ("Show HN")
  - Post i relevante Reddit-communities
  - Post i alle Facebook-grupper
- [ ] **Content:** Launch announcement bloggpost
- [ ] **Social:** Daily posting hele uken — momentum!
- [ ] **Ads:** Monitor Google Ads daglig, juster bud
- [ ] **Metrics:** Daglig dashboard-sjekk

### Fase 3: Post-Launch Growth (Uke 8-12 → 8. apr - 29. apr)

#### Uke 8 (8-14 apr)
- [ ] **Content:** Første case study fra beta-bruker
- [ ] **Content:** "HeyConcierge vs [Competitor]" comparison post
- [ ] **Ads:** Analyser første uke-data, optimaliser kampanjer
- [ ] **Backlinks:** Followup med PMS marketplace submissions
- [ ] **Social:** Del bruker-testimonials
- [ ] **Metrics:** Første ukentlige metrics review

#### Uke 9 (14-21 apr) — Product Hunt Week
- [ ] **Product Hunt launch** (tirsdag eller onsdag)
- [ ] **Content:** 2 nye bloggposter
- [ ] **Social:** All-in på PH — del overalt, be om support
- [ ] **Backlinks:** PH-backlink + eventuelle PR-mentions

#### Uke 10 (21-28 apr)
- [ ] **Content:** 2 bloggposter + start pillar page #3 ("WhatsApp for Vacation Rental Hosts")
- [ ] **Ads:** Skaler det som funker, kill det som ikke funker
- [ ] **Social:** Webinar/live demo for Facebook-gruppe-medlemmer
- [ ] **Backlinks:** Guest post #1 publisert
- [ ] **Email:** Nurture-sekvens optimalisert basert på data

#### Uke 11-12 (28 apr - 12 mai)
- [ ] **Content:** 4 bloggposter, pillar page #3 ferdig
- [ ] **Ads:** Meta retargeting fullt operativt
- [ ] **Backlinks:** Original research study ("State of Guest Communication") startet
- [ ] **Social:** Evaluér kanalmix — doble ned på det som funker
- [ ] **Metrics:** Full 30-dagers post-launch analyse
- [ ] **Strategi:** Juster 90-dagers plan basert på data → lag neste kvartals plan

---

## Appendix: Quick Wins — Gjør FØRST

Hvis teamet er overvelmet, prioritér disse 10 tingene:

1. ✅ GSC + GA4 + GTM installert og verifisert
2. ✅ Homepage med korrekt SEO (title, meta, H1, schema)
3. ✅ 4 bloggposter publisert (long-tail keywords)
4. ✅ Google Business Profile opprettet
5. ✅ LinkedIn personlige profiler aktive (3x/uke posting)
6. ✅ 10 startup directory submissions
7. ✅ Capterra + G2 gratis listings
8. ✅ Lead magnet + email capture
9. ✅ Google Ads Search kampanje (kr 4K/mnd)
10. ✅ Meta Pixel installert (for fremtidig retargeting)

**Disse 10 tingene tar 2 uker og gir 80% av verdien.**

---

*Strategi utarbeidet 18. februar 2026. Oppdater kvartalsvis basert på data.*

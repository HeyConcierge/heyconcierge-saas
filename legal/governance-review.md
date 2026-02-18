# HeyConcierge — Regulatory Compliance Review

**Dato:** 18. februar 2026
**Reviewer:** AI Legal Review (Claude)
**Mål:** Compliance-gjennomgang før launch 1. april 2026
**Dokumenter gjennomgått:** Terms of Service, Privacy Policy, Data Processing Agreement

---

## Overordnet vurdering

Dokumentene er **solid utarbeidet** og dekker de viktigste GDPR-kravene godt. Det er likevel flere hull som MÅ tettes før launch, spesielt rundt EU AI Act-compliance, ePrivacy, manglende cookie policy, og ufullstendige PLACEHOLDER-felter.

---

## 1. GDPR — Databehandling, samtykke, rettigheter, DPA, overføring, sletting

### ✅ Dekket — bra

- **Roller korrekt definert:** HC som behandlingsansvarlig (host-data) og databehandler (gjestedata). Art. 26/28-kompatibelt.
- **Rettslig grunnlag:** Tydelig angitt per formål (kontrakt, berettiget interesse, samtykke, rettslig forpliktelse). Art. 6(1)-tabeller er gode.
- **DPA i tråd med Art. 28:** Dekker instruksjonsbasert behandling, konfidensialitet, sikkerhet, underleverandører, sletting, revisjon, bruddvarsling.
- **Oppbevaringsperioder:** Konkrete (90 dager gjest, 2 år host, 5 år regnskap). Automatisk sletting dokumentert.
- **Tredjelandsoverføring:** SCCs nevnt for Anthropic, Vercel, Stripe, Google. Transfer Impact Assessment nevnt.
- **Registrertes rettigheter:** Alle GDPR Art. 15-21 rettigheter listet. Kontaktpunkt og svarfrist (30 dager) angitt.
- **Breach notification:** 24 timer til controller, 72 timer til Datatilsynet. Art. 33/34-kompatibelt.
- **Dataminimering og formålsbegrensning:** Eksplisitt i DPA (Clause 9.1, 9.2).
- **Forbud mot salg av data og AI-trening:** Tydelig.

### ⚠️ Mangler — må fikses

1. **PLACEHOLDER-felter:** Firmanavn, adresse, org.nr. mangler overalt. GDPR Art. 13/14 krever full identifikasjon av behandlingsansvarlig. **Må fylles inn.**
2. **DPIA (Data Protection Impact Assessment):** DPA nevner at Processor skal bistå, men det er ingen indikasjon på at en DPIA faktisk er gjennomført. AI-behandling av gjestedata via tredjepart i USA tilsier at DPIA bør utføres. **Gjennomfør og dokumenter DPIA før launch.**
3. **Transfer Impact Assessment (TIA):** Nevnt som "where appropriate" — bør gjennomføres og dokumenteres for Anthropic-overføringen spesifikt. Schrems II-krav.
4. **Records of Processing Activities (ROPA):** DPA sier Processor fører dette (Art. 30(2)), men ingenting om at HC som controller også fører ROPA (Art. 30(1)). **Opprett intern ROPA.**
5. **DPO (Data Protection Officer):** Ingen nevnt. Vurder om HC har plikt til å utnevne DPO (Art. 37) — sannsynligvis ikke påkrevd for en startup, men bør dokumentere vurderingen.
6. **Gjesters informasjonsplikt:** HC delegerer dette helt til Host. Det bør lages en **standard gjestevarsel/privacy notice** som Hosts kan bruke, for å sikre at informasjonsplikten faktisk oppfylles i praksis.
7. **Samtykke til markedsføring:** Privacy Policy nevner "where separately obtained" — men det finnes ingen mekanisme eller dokumentasjon for dette.
8. **Barns personvern:** Aldersgrense satt til 16 år, men ingen mekanisme for verifisering. Akseptabelt for B2B-SaaS, men gjester kan i teorien være mindreårige.

### 🔴 Kritisk — MÅ fikses før launch

- **Fyll inn alle PLACEHOLDER-felter** (firmanavn, adresse, org.nr.) — uten dette er dokumentene juridisk ufullstendige.
- **Gjennomfør DPIA** for AI-behandling av gjestedata.
- **Lag standard gjeste-privacy notice** som Hosts kan distribuere.

---

## 2. EU AI Act — Klassifisering, transparens, dokumentasjon

### ✅ Dekket — bra

- **Transparens om AI-bruk:** ToS §1 og §8.1 krever at gjester informeres om at de snakker med AI. §5.1(c) nevner Anthropic Claude eksplisitt.
- **AI-output disclaimer:** ToS §10.4 og §13.4 — AI-svar kan være unøyaktige, Host er ansvarlig.
- **Ingen automatiserte beslutninger med rettsvirkning:** Privacy Policy §13 avklarer at AI-svar er informasjonelle.

### ⚠️ Mangler — må fikses

1. **Risikoklassifisering:** EU AI Act trådte i kraft august 2024, med gradvis ikrafttredelse. En chatbot som svarer på eiendomsspørsmål er sannsynligvis **begrenset risiko** (Art. 50 transparenskrav). Men det finnes **ingen eksplisitt AI Act-klassifisering** i dokumentene. **Dokumenter klassifiseringen formelt.**
2. **Art. 50 transparenskrav:** AI Act krever at brukere gjøres oppmerksom på at de interagerer med et AI-system. ToS §8.1 legger dette på Host, men:
   - Det bør være en **automatisk disclaimer i chatbotens velkomstmelding** — ikke bare pålagt Host.
   - Meldingen bør si eksplisitt: "Du snakker med en AI-drevet assistent, ikke et menneske."
3. **AI-systemdokumentasjon:** Ingen teknisk dokumentasjon av AI-systemet (input/output, tiltenkt bruk, begrensninger, testresultater). AI Act Art. 50+ krever dette for tilbydere.
4. **Menneskelig tilsyn:** Ingen dokumentert mekanisme for menneskelig overstyring av AI-svar. Hosts bør ha mulighet til å gripe inn i sanntid eller flagge problematiske svar.
5. **Logging av AI-interaksjoner:** 90 dagers oppbevaring er dokumentert, men AI Act kan kreve lengre logging for visse systemer. Avklar krav.
6. **AI-modellens leverandørkjede:** HC bruker Anthropic Claude — under AI Act er HC "deployer" og Anthropic er "provider". Ansvarsfordelingen bør dokumenteres.

### 🔴 Kritisk — MÅ fikses før launch

- **Implementer automatisk AI-transparensmelding** i botens velkomstmelding.
- **Dokumenter AI Act risikoklassifisering** formelt (begrenset risiko / Art. 50-system).
- **Opprett AI-systemdokumentasjon** (tiltenkt bruk, begrensninger, deployer/provider-roller).

---

## 3. Digital Services Act (DSA) — Plattformansvar, innholdsmoderering

### ✅ Dekket — bra

- **Acceptable Use Policy:** ToS §7 er solid med bred liste over forbudt bruk.
- **Overvåkning og håndheving:** §7.3 gir HC rett til å overvåke og suspendere.
- **Kontaktinformasjon:** Tilgjengelig (legal@, support@, privacy@).

### ⚠️ Mangler — må fikses

1. **DSA-klassifisering:** HC er sannsynligvis en **"intermediary service"** (mellommannstjeneste) under DSA. Det er ikke en plattform med bruker-generert innhold i tradisjonell forstand, men AI-generert innhold rettet mot sluttbrukere (gjester) kan falle inn under DSA-rammeverket. **Avklar juridisk status under DSA.**
2. **Rapporteringsmekanisme:** DSA krever transparensrapportering for visse tjenester. Ikke relevant for micro/SMB-tilbydere (<45M brukere), men kontaktpunkt for myndigheter bør likevel dokumenteres.
3. **Innholdsmoderering:** Ingen eksplisitt policy for moderering av AI-generert innhold. Hva skjer hvis boten gir farlig, ulovlig, eller diskriminerende informasjon? **Lag en content moderation policy.**
4. **Notice-and-action:** Ingen mekanisme for gjester eller tredjeparter å rapportere problematisk AI-innhold. Bør implementeres.

### 🔴 Kritisk

- Ingen kritiske DSA-mangler for en SMB pre-launch, men **content moderation policy bør på plass**.

---

## 4. ePrivacy-direktivet — Elektronisk kommunikasjon, cookies, meldinger

### ✅ Dekket — bra

- **Cookie-henvisning:** Privacy Policy §11 nevner cookies og refererer til en separat Cookie Policy.

### ⚠️ Mangler — må fikses

1. **Cookie Policy mangler:** §11 refererer til [PLACEHOLDER: URL]. **Selve Cookie Policy-dokumentet eksisterer ikke.** Må opprettes med:
   - Oversikt over alle cookies (nødvendige, analytiske, markedsføring)
   - Formål og varighet
   - Cookie consent banner/mekanisme (opt-in for ikke-nødvendige cookies)
2. **Elektronisk kommunikasjon:** HC sender meldinger til gjester via WhatsApp/Telegram. Under ePrivacy:
   - Gjesten initierer kontakt → dette er generelt OK (service-relatert kommunikasjon)
   - Men det bør dokumenteres at HC/Hosts **ikke sender uoppfordrede meldinger**
   - Hvis HC noen gang sender proaktive meldinger (f.eks. "velkommen"-meldinger), bør det avklares at dette er del av tjenesten gjesten har valgt
3. **Samtykkebannerr:** Ingen dokumentasjon av cookie consent-mekanisme på heyconcierge.io-nettsiden. **Implementer GDPR/ePrivacy-kompatibel cookie consent.**

### 🔴 Kritisk — MÅ fikses før launch

- **Opprett Cookie Policy og implementer cookie consent banner.**

---

## 5. Norsk lov — Markedsføringsloven, e-kom, Datatilsynet

### ✅ Dekket — bra

- **Lovvalg:** Norsk lov, Tromsø tingrett. Korrekt.
- **Datatilsynet:** Korrekt identifisert som tilsynsmyndighet med kontaktinfo.
- **Personopplysningsloven:** Referert i DPA og Privacy Policy.
- **Regnskapsloven:** 5 års oppbevaring av fakturadata. Korrekt.

### ⚠️ Mangler — må fikses

1. **Markedsføringsloven §15:** Forbud mot uoppfordret elektronisk markedsføring. Hvis HC sender nyheter/markedsføring til Hosts → trenger samtykke. Nåværende policy er uklar ("where separately obtained"). **Implementer opt-in for markedsføring.**
2. **Angrerettloven:** HC tilbyr gratis prøveperiode som konverterer til betalt abonnement. Under angrerettloven (for forbrukere) har kjøperen 14 dagers angrerett på fjernsalg. ToS sier "non-refundable" — dette kan være i strid med angrerettloven dersom noen Hosts kvalifiserer som forbrukere. **Vurder og dokumenter om angrerett gjelder, eller avklar at tjenesten er kun B2B.**
3. **Lov om elektronisk kommunikasjon (ekomloven):** Relevant for cookies og elektronisk kommunikasjon. Dekket av cookie-punktet over.
4. **Forbrukerkjøpsloven/avtaleloven:** Ansvarsbegrensningene i ToS §12-13 kan være ugyldige overfor forbrukere. Bør avklare at HC er en B2B-tjeneste og at Hosts er næringsdrivende.

### 🔴 Kritisk

- **Avklar B2B-status eksplisitt** i ToS for å unngå forbrukerrettighets-problematikk.

---

## 6. WhatsApp/Meta Business Policy

### ✅ Dekket — bra

- **ToS §8.4:** Hosts er ansvarlige for å overholde WhatsApp/Telegrams vilkår.
- **ToS §18:** Anerkjenner tredjepartstjenester og deres egne vilkår.
- **Privacy Policy:** Nevner WhatsApp-nummer som gjestedata.

### ⚠️ Mangler — må fikses

1. **Meta Business Messaging Policy:** Meta krever at bedrifter som bruker WhatsApp Business API:
   - Kun sender meldinger innenfor **24-timers servicevindu** etter kundens siste melding (eller bruker godkjente maler)
   - Ikke sender spam eller uoppfordrede meldinger
   - Gir brukere mulighet til å **opt-out** av meldinger
   - **Viser bedriftsnavn og profilinfo** korrekt
   - Overholder **Meta Commerce Policy** og **WhatsApp Business Policy**
   
   HC-dokumentene nevner ingen av disse spesifikke kravene. **Lag en intern WhatsApp compliance-sjekkliste.**

2. **WhatsApp Business Solution Provider (BSP):** Hvordan kobler HC seg til WhatsApp API? Via Twilio, 360dialog, Meta Cloud API direkte? Denne leverandøren og avtaleforholdet bør dokumenteres.

3. **Opt-out-mekanisme:** Gjester bør kunne si "stopp" eller lignende for å slutte å motta meldinger. **Implementer opt-out-funksjonalitet i boten.**

4. **Meta data-krav:** Meta krever at bedrifter har en privacy policy som dekker WhatsApp-databehandling. ✅ PP dekker dette, men bør lenkes fra WhatsApp-bedriftsprofilen.

### 🔴 Kritisk — MÅ fikses før launch

- **Implementer opt-out-mekanisme** for gjester i WhatsApp.
- **Dokumenter WhatsApp BSP/API-tilkobling** og sikre compliance med Metas vilkår.

---

## 7. Airbnb/Booking.com Partner Policies

### ✅ Dekket

- Ingen direkte referanse til Airbnb/Booking.com i dokumentene, noe som er **korrekt** — HC er ikke en API-partner med disse plattformene per se, men en uavhengig tjeneste som Hosts bruker.

### ⚠️ Mangler — må fikses

1. **Airbnb Terms of Service:** Airbnb forbyr generelt deling av gjestenes kontaktinfo med tredjeparter for markedsføringsformål. Hosts som bruker HC bør varsles om dette. Hosts er ansvarlige, men HC bør ha **veiledning om plattform-compliance** i sin dokumentasjon.

2. **Booking.com Partner Guidelines:** Lignende restriksjoner — gjestedata skal kun brukes til oppholdsrelaterte formål. HCs tjeneste (concierge) faller sannsynligvis innenfor tillatt bruk, men bør dokumenteres.

3. **Gjestkommunikasjon utenfor plattform:** Både Airbnb og Booking.com foretrekker at kommunikasjon skjer gjennom deres plattform. Å dirigere gjester til WhatsApp/Telegram kan stride mot visse plattformregler. **Legg til advarsel/veiledning for Hosts om dette.**

### 🔴 Kritisk

- Ingen kritiske blokkere, men **risiko for at Hosts bryter plattformregler** — HC bør ha en FAQ/veiledning.

---

## Prioritert handlingsliste — FØR 1. april launch

### 🔴 KRITISK (Must-have)

| # | Oppgave | Ansvar | Frist |
|---|---------|--------|-------|
| 1 | **Fyll inn alle PLACEHOLDER-felter** (firmanavn, adresse, org.nr.) i ToS, PP, DPA | Legal/Founders | Uke 10 |
| 2 | **Opprett Cookie Policy** og implementer cookie consent banner på nettside | Dev + Legal | Uke 11 |
| 3 | **Implementer automatisk AI-transparensmelding** i botens velkomstmelding ("Du snakker med en AI-assistent") | Dev | Uke 10 |
| 4 | **Gjennomfør og dokumenter DPIA** for AI-behandling av gjestedata | Legal/DPO | Uke 11 |
| 5 | **Dokumenter AI Act risikoklassifisering** (begrenset risiko / Art. 50) + AI-systemdokumentasjon | Legal | Uke 11 |
| 6 | **Implementer opt-out for gjester** i WhatsApp/Telegram ("send STOPP for å avslutte") | Dev | Uke 11 |
| 7 | **Dokumenter WhatsApp BSP-tilkobling** og verifiser compliance med Meta Business Policy | Dev + Legal | Uke 10 |
| 8 | **Lag standard gjeste-privacy notice** som Hosts kan bruke/tilpasse | Legal | Uke 11 |
| 9 | **Avklar B2B-status** eksplisitt i ToS (at tjenesten er for næringsdrivende, ikke forbrukere) | Legal | Uke 10 |

### ⚠️ VIKTIG (Should-have — helst før launch)

| # | Oppgave | Ansvar | Frist |
|---|---------|--------|-------|
| 10 | Gjennomfør Transfer Impact Assessment for Anthropic (USA) | Legal | Uke 12 |
| 11 | Opprett intern ROPA (Records of Processing Activities) | Legal | Uke 12 |
| 12 | Lag content moderation policy for AI-generert innhold | Legal + Product | Uke 12 |
| 13 | Implementer opt-in mekanisme for markedsføringskommunikasjon | Dev | Uke 12 |
| 14 | Dokumenter DPO-vurdering (trenger vi DPO?) | Legal | Uke 12 |
| 15 | Lag FAQ/veiledning for Hosts om Airbnb/Booking.com plattform-compliance | Content | Uke 13 |
| 16 | Implementer notice-and-action mekanisme for rapportering av problematisk AI-innhold | Dev | Uke 13 |

### 💡 NICE-TO-HAVE (Etter launch)

| # | Oppgave |
|---|---------|
| 17 | Dokumenter menneskelig tilsynsmekanisme for AI-svar |
| 18 | Vurder SOC 2-sertifisering |
| 19 | Utarbeid formell DSA-klassifiseringsanalyse |
| 20 | Lag norsk oversettelse av juridiske dokumenter |

---

## Oppsummering

**Dokumentene er på et godt nivå** for en startup — spesielt DPA, oppbevaringsperioder og GDPR-rettigheter er solid. De viktigste manglene er:

1. **Administrative hull** — PLACEHOLDER-felter, manglende Cookie Policy
2. **AI Act compliance** — Ny regulering som krever klassifisering og transparens
3. **Praktisk implementasjon** — Opt-out for gjester, AI-disclaimer i bot, gjestevarsel
4. **Meta/WhatsApp** — BSP-dokumentasjon og policy-compliance

Med 6 uker til launch er dette gjennomførbart dersom arbeidet starter umiddelbart.

---

*Denne gjennomgangen er veiledende og erstatter ikke juridisk rådgivning fra advokat. Anbefaler kvalitetssikring av en personvernadvokat, spesielt for AI Act-vurderingen.*

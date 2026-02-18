# WhatsApp / Meta Business Platform Compliance

**HeyConcierge AI Guest Concierge Service**

**Version 1.0 | February 2026**
**Prepared by:** HeyConcierge AS
**Contact:** hello@heyconcierge.io

---

## 1. Overview

HeyConcierge integrates with the **WhatsApp Business Platform** (via the WhatsApp Business API / Cloud API) to enable property hosts to deploy an AI-powered concierge chatbot that communicates with guests. This document describes how HeyConcierge complies with Meta's policies and WhatsApp's operational requirements.

---

## 2. Applicable Policies

| Policy | Scope |
|--------|-------|
| [Meta Business Messaging Policy](https://www.facebook.com/policies/business-messaging) | Governs all business messaging on Meta platforms |
| [WhatsApp Business Policy](https://www.whatsapp.com/legal/business-policy/) | Specific rules for WhatsApp Business accounts |
| [WhatsApp Commerce Policy](https://www.whatsapp.com/legal/commerce-policy/) | Rules for commercial transactions via WhatsApp |
| [WhatsApp Business Platform Terms of Service](https://www.whatsapp.com/legal/business-terms/) | API usage terms |
| [Meta Platform Terms](https://developers.facebook.com/terms/) | General Meta developer/platform terms |

---

## 3. Messaging Model Compliance

### 3.1 The 24-Hour Conversation Window

WhatsApp Business API operates on a **conversation-based pricing and messaging model**:

- **User-initiated conversations:** When a guest sends a message to the host's WhatsApp Business number, a **24-hour service window** opens. During this window, HeyConcierge can send any number of messages (including AI-generated responses) without restrictions on content type.
- **Business-initiated conversations:** Outside the 24-hour window, HeyConcierge (on behalf of the host) may only send **pre-approved message templates**.

**HeyConcierge implementation:**
- The concierge bot is **reactive** — it responds to guest-initiated messages.
- The bot does **not** send proactive marketing or promotional messages.
- If a host wishes to send a message outside the 24-hour window (e.g., check-in reminder), it must use an approved template.

### 3.2 Message Templates

Pre-approved message templates are required for:
- Business-initiated conversations outside the 24-hour window
- Certain categories of notifications (e.g., booking confirmations, check-in instructions)

**Template compliance:**
- All templates are submitted to Meta for approval before use
- Templates comply with Meta's template guidelines (no misleading content, proper category selection)
- Templates include the host's business name and clear purpose
- Templates do not contain prohibited content (see §5)

### 3.3 Conversation Categories

WhatsApp classifies conversations into categories affecting pricing and rules:

| Category | Use in HeyConcierge | Template Required? |
|----------|--------------------|--------------------|
| **Service** | Responding to guest enquiries (primary use case) | No (within 24h window) |
| **Utility** | Check-in instructions, booking confirmations | Yes (if business-initiated) |
| **Authentication** | Not used | N/A |
| **Marketing** | Not used | N/A |

HeyConcierge's primary use case is **service conversations** initiated by guests.

---

## 4. Opt-In and Consent Requirements

### 4.1 Meta's Opt-In Requirement

Meta requires that businesses obtain **opt-in consent** from users before sending them messages via WhatsApp Business API. The opt-in must:

- Clearly state that the person agrees to receive messages from the business on WhatsApp
- Include the business name
- Be obtained before initiating any business-initiated conversation

### 4.2 HeyConcierge's Opt-In Model

HeyConcierge's messaging model is primarily **guest-initiated** (the guest messages the bot first), which satisfies WhatsApp's opt-in requirements for service conversations. However:

**For guest-initiated conversations:**
- The guest initiates contact by sending a message to the host's WhatsApp number. This constitutes implicit opt-in for service responses.
- The bot's first response includes an AI disclosure and privacy notice.

**For host-initiated conversations (templates):**
- The host must ensure opt-in has been obtained before using HeyConcierge to send template messages.
- Recommended opt-in methods:
  - Booking confirmation email that includes: *"We may contact you via WhatsApp for check-in information and concierge assistance. Reply STOP to opt out."*
  - Check-in information form with WhatsApp communication consent checkbox
  - Pre-arrival message from the booking platform with opt-in language

### 4.3 Opt-Out

- Guests can opt out at any time by sending "STOP" or similar keywords.
- HeyConcierge will honour opt-out requests and cease messaging the guest.
- Hosts are responsible for maintaining opt-out records.

---

## 5. Content Restrictions

### 5.1 Prohibited Content

In accordance with Meta's policies, HeyConcierge does **not** send or facilitate:

- Spam or bulk unsolicited messages
- Threatening, abusive, or harassing content
- Content promoting illegal activities
- Misleading or deceptive messages
- Content that violates third-party intellectual property rights
- Adult content or gambling promotions
- Discriminatory content
- Messages impersonating other businesses or individuals

### 5.2 AI Content Safeguards

The AI concierge is constrained by system prompts to:
- Only respond to property-related enquiries
- Decline to provide medical, legal, or financial advice
- Not generate harmful, discriminatory, or inappropriate content
- Clearly identify as an AI assistant (AI Act transparency compliance)

---

## 6. Data Handling

### 6.1 Data Collected via WhatsApp

| Data | Source | Retention |
|------|--------|-----------|
| Guest phone number | WhatsApp API | 90 days (with conversation data) |
| Guest display name | WhatsApp API | 90 days |
| Message content (text) | Guest / AI bot | 90 days |
| Message metadata (timestamps, IDs) | WhatsApp API | 90 days |

### 6.2 WhatsApp's Own Data Processing

Meta/WhatsApp processes message metadata in accordance with [WhatsApp's Privacy Policy](https://www.whatsapp.com/legal/privacy-policy/). HeyConcierge does not control WhatsApp's own data processing.

### 6.3 End-to-End Encryption

Messages between guests and the WhatsApp Business API are **not end-to-end encrypted** in the same way as personal WhatsApp messages. The Cloud API processes messages on Meta's servers. HeyConcierge encrypts all data in transit (TLS) and at rest (AES-256) within its own infrastructure.

### 6.4 Data Sharing with Meta

By using the WhatsApp Business API, certain data (message metadata, delivery status) is processed by Meta. This is inherent to the WhatsApp platform. Hosts should be aware of this and include appropriate information in their guest privacy notices.

---

## 7. Business Verification

### 7.1 Meta Business Verification

HeyConcierge maintains a verified Meta Business account, which is required for WhatsApp Business API access. Business verification confirms:
- Legal business name and address
- Business registration (organisation number)
- Legitimate business purpose

### 7.2 Display Name

Each host's WhatsApp Business profile displays the host's business or property name, not "HeyConcierge", ensuring transparency about who the guest is communicating with.

---

## 8. Rate Limits and Quality

### 8.1 Messaging Limits

WhatsApp imposes messaging limits on business accounts based on quality rating:
- New accounts: 250 business-initiated conversations / 24h
- Scaling based on quality: up to 100,000 / 24h

HeyConcierge monitors messaging quality and volume to maintain good standing.

### 8.2 Quality Rating

Meta assigns quality ratings based on:
- User feedback (blocks, reports)
- Opt-in compliance
- Template quality

HeyConcierge monitors quality ratings via the Meta Business API and alerts hosts if quality drops.

---

## 9. Compliance Monitoring

| Activity | Frequency |
|----------|-----------|
| Review Meta policy updates | Quarterly |
| Monitor quality ratings | Ongoing (automated) |
| Audit template compliance | Before each new template |
| Review opt-in processes | Annually |
| Update this document | Annually or on policy change |

---

## 10. Responsibilities Matrix

| Obligation | Responsible Party |
|-----------|-------------------|
| Meta Business account verification | HeyConcierge AS |
| WhatsApp API integration & compliance | HeyConcierge AS |
| Template creation and submission | HeyConcierge AS (on behalf of host) |
| Guest opt-in for business-initiated messages | Host |
| Guest privacy notice | Host (template provided by HeyConcierge) |
| Content accuracy (property information) | Host |
| Honouring opt-out requests | HeyConcierge AS (automated) + Host |
| Monitoring quality rating | HeyConcierge AS |

---

**Approved by:** HeyConcierge AS
**Date:** February 2026
**Contact:** hello@heyconcierge.io

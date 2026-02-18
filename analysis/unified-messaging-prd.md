# HeyConcierge — Unified Messaging & Platform Integration PRD

**Version:** 1.0  
**Date:** 2026-02-17  
**Authors:** HeyConcierge Founding Team  
**Status:** Draft

---

## Vision

> "One AI that answers your guests everywhere — WhatsApp, Airbnb, Booking.com — with the same knowledge, in any language, 24/7."

HeyConcierge (HC) is an **AI Guest Communication Layer** that sits ON TOP of existing booking platforms. We don't replace Airbnb, Booking.com, or WhatsApp — we make them all smarter by injecting the same property-specific AI knowledge into every channel simultaneously.

**The core insight:** Guests book on different platforms, but they all ask the same questions. The host's knowledge shouldn't be siloed per channel.

### What HC Is NOT
- Not a PMS (Property Management System)
- Not a channel manager
- Not a booking engine

### What HC IS
- The AI communication brain that plugs into all of the above
- A unified inbox with AI superpowers
- The layer that ensures every guest gets instant, accurate, context-aware responses — regardless of where they booked

---

## Tier 1 — Pre-Launch (Must Have)

### 1. Unified Inbox

#### Overview
A single dashboard where hosts see ALL guest messages from all connected channels. No more switching between Airbnb app, Booking.com extranet, and WhatsApp Business.

#### Functional Requirements

| Requirement | Description | Priority |
|---|---|---|
| Multi-channel aggregation | Display messages from WhatsApp, Airbnb, Booking.com, and Telegram in one view | P0 |
| Real-time sync | Messages appear within seconds of being received on any platform | P0 |
| Unified AI responses | Same knowledge base powers AI replies across all channels | P0 |
| Channel identification | Clear visual indicator showing which platform each message came from | P0 |
| Human escalation | One-click takeover from AI to human, preserving full context | P0 |
| Status management | Mark conversations as: `new`, `ai-handling`, `escalated`, `human-replied`, `resolved` | P0 |
| Guest context panel | Side panel showing: booking dates, property, guest name, platform, past interactions | P1 |
| Inline reply | Host can reply directly from unified inbox; message routes to correct platform | P0 |
| Search & filter | Filter by property, channel, status, date range, guest name | P1 |
| Mobile-responsive | Must work on phone — hosts are mobile-first | P1 |

#### User Flow
```
Guest sends message on Airbnb
  → Webhook hits HC backend
  → Message stored in unified conversations table
  → AI evaluates: can I answer this confidently?
    → YES: AI responds via Airbnb API, marks as "ai-handling"
    → NO: Marks as "escalated", notifies host via push/WhatsApp
  → Host sees everything in unified inbox
  → Host can override AI response at any time
```

#### Technical: WhatsApp Business API (Existing — Extend)

HC already has a WhatsApp integration via `whatsapp_server.js`. Current state:
- Uses WhatsApp Cloud API (Meta Business Platform)
- Receives webhooks for incoming messages
- Sends AI-generated responses via property knowledge base

**What needs to change:**
- Refactor to shared message processing pipeline (not WhatsApp-specific)
- Add conversation threading support
- Implement the unified inbox data model

**WhatsApp Cloud API Key Details:**
- **Base URL:** `https://graph.facebook.com/v21.0/{phone-number-id}/messages`
- **Auth:** Bearer token (System User access token or temporary token)
- **Webhooks:** Configured in Meta App Dashboard → WhatsApp → Configuration
- **Rate limits:** 80 messages/second for business-initiated; no documented limit for replies within 24h window
- **Pricing (as of 2025):** Template-based pricing model (replaced conversation-based April 2025). Service conversations (user-initiated within 24h) are free. Marketing/utility templates charged per message (~$0.005-0.08 depending on country)
- **24-hour window:** Can reply freely within 24h of last user message. After that, must use approved templates.
- **Docs:** https://developers.facebook.com/docs/whatsapp/cloud-api

**Cost implications for HC:**
- Guest-initiated conversations (the majority of our use case) = **free** responses within 24h
- Automated triggers (check-in instructions, etc.) = template messages = paid
- Estimated cost per property/month: $2-10 depending on message volume

---

### 2. Airbnb Messaging API Integration

#### Platform Overview

Airbnb provides a **Homes API** for approved partners. The API includes messaging capabilities for reading and responding to guest messages.

- **Developer Portal:** https://developer.airbnb.com
- **API Docs:** https://developer.airbnb.com/homes/docs/introduction
- **Current API versions:** 2024.06.30 and 2024.12.31 (older versions deprecated January 2026)

#### Access Requirements

⚠️ **Critical:** Airbnb's API is NOT publicly available. You must be an **approved Connectivity Partner**.

**Application process:**
1. Apply via https://developer.airbnb.com
2. Must demonstrate: established software company, existing customer base, technical capability
3. Review process: 2-6 weeks (can be longer)
4. Requires: Company info, product description, integration plan, compliance acknowledgment
5. Once approved: OAuth2 credentials issued, access to sandbox/test environment

**Partnership tiers:**
- **Software Partner:** Full API access including messaging (this is what HC needs)
- Must meet minimum quality standards and response time SLAs

#### Authentication
- **OAuth 2.0** authorization code flow
- Host authorizes HC to access their Airbnb account
- HC receives access token + refresh token
- Tokens scoped to specific permissions (messages, reservations, listings)

#### Messaging API Capabilities (Based on Homes API)

```
# Endpoints (conceptual — exact paths require partner access)

GET  /v2/threads                    # List message threads
GET  /v2/threads/{thread_id}        # Get specific thread
GET  /v2/threads/{thread_id}/messages  # Get messages in thread
POST /v2/threads/{thread_id}/messages  # Send a message

# Webhooks
Airbnb pushes events for:
- New message received
- Reservation created/modified/cancelled
- Review submitted
```

#### Key Technical Considerations

| Consideration | Detail |
|---|---|
| Response time impact | Airbnb tracks host response time. Fast responses improve search ranking. **This is our #1 selling point.** |
| Message context | Each thread is tied to a reservation or inquiry. We get guest name, dates, listing ID. |
| Rate limits | Typically per-app limits (exact numbers under NDA after partner approval) |
| Webhooks | Real-time push for new messages — essential for fast AI response |
| Content restrictions | Cannot send promotional content, must follow Airbnb messaging policies |
| Thread types | Inquiry (pre-booking), reservation (active booking), post-stay |

#### Business Value

> **"HC improves your Airbnb search ranking by responding to guests in under 60 seconds, 24/7."**

This alone is a compelling sales pitch. Airbnb's algorithm favors:
- Response rate (target: 100%)
- Response time (target: < 1 hour, ideally < 5 minutes)
- HC delivers: < 1 minute, 100% of the time

#### Integration Architecture

```
Airbnb Webhook → HC Webhook Handler
  → Validate signature
  → Extract message + reservation context
  → Enrich with property knowledge base
  → AI generates response
  → POST response via Airbnb API
  → Store in unified conversations DB
  → Update inbox in real-time (WebSocket/SSE)
```

#### Implementation Plan

| Phase | Task | Timeline |
|---|---|---|
| 1 | Apply for Airbnb Partner Program | Week 1 |
| 2 | Build OAuth2 flow for host connection | Week 3-4 (after approval) |
| 3 | Implement webhook handler for incoming messages | Week 4-5 |
| 4 | AI response pipeline (reuse existing WhatsApp logic) | Week 5-6 |
| 5 | Send replies via Airbnb API | Week 6 |
| 6 | Unified inbox integration | Week 6-7 |
| 7 | Testing with real Airbnb accounts | Week 7-8 |

**Risk:** Partner approval timeline is uncertain. **Mitigation:** Apply immediately; build the unified architecture against WhatsApp first, then plug in Airbnb when access is granted.

---

### 3. Booking.com Messaging API Integration

#### Platform Overview

Booking.com provides a **Messaging API** as part of their Connectivity Partner APIs. This is more documented and accessible than Airbnb's.

- **Developer Portal:** https://developers.booking.com/connectivity/docs
- **Messaging API Docs:** https://developers.booking.com/connectivity/docs/messaging-api/understanding-the-messaging-api
- **Base URL:** `https://supply-xml.booking.com/messaging`
- **Current version:** 1.2 (latest, includes self-service requests)

#### Access Requirements

⚠️ **Critical caveat:** As of early 2026, Booking.com has **paused integrations with new connectivity providers** (per https://connect.booking.com). This may affect timeline.

**Application process:**
1. Apply via https://connect.booking.com
2. Submit integration plan and company details
3. Multi-stage approval process
4. Must demonstrate existing property management customers
5. Test environment provided after initial approval

**Workaround options if direct partnership is delayed:**
- Partner with an existing Connectivity Partner who can provide messaging API access
- Use an intermediary platform (e.g., channel manager) that has Booking.com messaging access
- Focus on Airbnb + WhatsApp first, add Booking.com when partnership opens

#### Messaging API Capabilities (Documented)

```
# Endpoints
GET  /messages                     # Retrieve messages
GET  /messages/latest              # Get latest messages (requires explicit enablement)
POST /messages                     # Send a message
POST /messages/{id}/reply          # Reply to a specific message
POST /messages/attachments         # Upload attachment
GET  /messages/attachments/{id}    # Download attachment
POST /conversations/{id}/tags      # Tag conversation (e.g., "no reply needed")
POST /messages/{id}/read           # Mark message as read

# Supported message types:
- Free text messages (guest ↔ property)
- Special requests (free text response)
- Self-service requests (check-in/out time, parking, bed preference, etc.)
- Pre-reservation messages (Request-to-Book flow)
```

#### Authentication
- Same as other Booking.com Connectivity APIs
- Machine account credentials (username/password or API key)
- Must enable `/messages/latest` endpoint access separately for new accounts

#### Key Technical Considerations

| Consideration | Detail |
|---|---|
| Self-service requests | Guests can make structured requests (date change, parking, extra bed). AI can respond to most via free text. |
| Extranet interaction | If HC responds to self-service requests via API, it disables extranet response for that request. Need to handle gracefully. |
| Date change / Cancellation | Must be handled via extranet, not API. Flag these for host. |
| Pre-reservation messages | Available with `messaging_api_rtb_enabled` feature flag. Useful for converting inquiries. |
| Rate limits | Not publicly documented; follow Booking.com guidelines |
| Historical messages | Can query past conversations for context |

#### Integration Architecture

```
Booking.com → HC Webhook/Polling Handler
  → Parse message + reservation context
  → Map to unified conversation model
  → AI generates response using property KB
  → POST reply via Booking.com Messaging API
  → Store in unified conversations DB
  → Handle self-service requests specially:
    → Answerable by AI → respond via API
    → Date change/cancellation → escalate to host with instructions
```

#### Booking.com-Specific Features

- **Self-service request auto-handling:** AI can respond to check-in time requests, parking queries, bed preferences automatically using property knowledge base
- **Attachment support:** Can send PDF check-in guides, maps, etc.
- **Conversation tagging:** Mark as "no reply needed" to keep Booking.com metrics clean

---

## Tier 2 — Launch Features

### 4. Automated Message Triggers

#### Overview
Pre-defined message sequences triggered by booking lifecycle events. These run across ALL channels — the guest gets the right message on the platform they booked through.

#### Trigger Definitions

| # | Trigger Event | Timing | Content | Personalization Variables |
|---|---|---|---|---|
| 1 | Booking confirmed | Immediate | Welcome message, excitement, what to expect | `{guest_name}`, `{property_name}`, `{check_in_date}`, `{nights}` |
| 2 | Pre-check-in | 24h before check-in | Check-in instructions, key/lock code, WiFi, parking | `{guest_name}`, `{key_code}`, `{wifi_name}`, `{wifi_password}`, `{address}`, `{check_in_time}` |
| 3 | Check-in day | Morning of check-in | "Everything you need" bundle — directions, house rules recap, emergency contacts | `{guest_name}`, `{property_name}`, `{host_name}`, `{emergency_phone}` |
| 4 | Day 2 stay check | 24h after check-in | "Is everything okay? Need anything?" | `{guest_name}`, `{host_name}` |
| 5 | Checkout day | Morning of checkout | Checkout instructions, thank you, where to leave keys | `{guest_name}`, `{checkout_time}`, `{key_instructions}` |
| 6 | Post-stay | 24h after checkout | Thank you + review request | `{guest_name}`, `{property_name}`, `{review_link}` |

#### Template System

```javascript
// Template model
{
  id: "pre-checkin-24h",
  trigger: "check_in",
  offset_hours: -24,
  channels: ["whatsapp", "airbnb", "booking"],  // send on guest's booking channel
  content_template: {
    en: "Hi {guest_name}! 🏠 Your stay at {property_name} starts tomorrow...",
    no: "Hei {guest_name}! 🏠 Oppholdet ditt på {property_name} starter i morgen...",
    // ... more languages
  },
  attachments: ["check_in_guide_pdf"],
  active: true,
  property_id: "uuid",
  // Per-property customizable
}
```

#### Channel-Specific Considerations

| Channel | Template Requirement | Notes |
|---|---|---|
| WhatsApp | Must use pre-approved Meta templates for business-initiated messages | Submit templates for approval during setup |
| Airbnb | No template system, but must follow messaging policies | No promotional content |
| Booking.com | Free text allowed for reservation-related messages | Keep it transactional |
| Telegram | No restrictions | Direct send |

#### Scheduling Engine

```
Cron job (runs every 5 minutes):
  → Query reservations where trigger conditions are met
  → Check if trigger message already sent (idempotency)
  → For each unsent trigger:
    → Determine channel (based on booking source)
    → Render template with personalization variables
    → Auto-translate if guest language differs
    → Send via appropriate channel API
    → Log in conversation history
```

**Extends existing:** `cron_daily_reminders.js` and `auto_messages.js` already handle basic scheduling. Refactor into a generic trigger engine.

---

### 5. Conversation Dashboard

#### Overview
Analytics and management view for all guest communications across all channels.

#### Dashboard Components

**1. Conversation List (Main View)**
- All conversations, sorted by most recent activity
- Filterable by: channel, property, status, date range, AI vs human
- Search by guest name or message content
- Bulk actions: mark resolved, assign to team member

**2. Metrics Panel**

| Metric | Description | Business Value |
|---|---|---|
| AI Response Rate | % of messages handled entirely by AI | Demonstrates ROI |
| Avg Response Time | Time from guest message to first response | Key selling point |
| Escalation Rate | % of conversations requiring human intervention | Shows AI quality |
| Resolution Rate | % of conversations resolved without human | Cost savings metric |
| Messages/Property/Month | Volume breakdown per property | Usage-based pricing input |
| Channel Distribution | % of messages per platform | Strategic insights |
| Guest Sentiment | Positive/neutral/negative per conversation | Quality indicator |

**3. Per-Property Breakdown**
- Each property shows its own stats
- Identify which properties generate most questions
- Suggest knowledge base improvements for high-escalation properties

**4. Sentiment Analysis**
- Simple classification: positive / neutral / negative / urgent
- Based on AI analysis of message content
- Flag negative sentiment for immediate host attention
- Track sentiment trends over time

#### Technical Implementation
- Real-time updates via WebSocket (or Supabase Realtime, if using existing stack)
- Aggregated metrics computed hourly, stored in `conversation_analytics` table
- Sentiment scored during message processing (piggyback on AI call)

---

### 6. Smart Escalation

#### Overview
Not every message should be handled by AI. Smart escalation ensures the right messages get to humans at the right time, with full context.

#### Escalation Logic

```
AI receives message
  → Generate response candidate
  → Compute confidence score (0.0 - 1.0)
  → Apply rules:

  IF confidence >= 0.85:
    → Send AI response automatically
    → Status: "ai-handling"
  
  ELIF confidence >= 0.60:
    → Draft AI response, hold for host review
    → Status: "needs-review"
    → Notify host: "AI drafted a response, please review"
  
  ELIF confidence < 0.60:
    → Don't send anything
    → Status: "escalated"
    → Notify host immediately: "Guest needs your attention"
    → Include: full conversation, guest context, what AI thinks the question is about
  
  SPECIAL CASES (always escalate):
    → Complaints or negative sentiment
    → Refund/cancellation requests
    → Safety/emergency mentions
    → Booking modification requests
    → Messages containing "speak to host/manager/human"
```

#### Confidence Scoring

The confidence score is derived from:
1. **Knowledge base match quality** — Did the AI find relevant information in the property KB?
2. **Question clarity** — Is the guest's question unambiguous?
3. **Response template availability** — Does this match a known FAQ pattern?
4. **Sentiment** — Negative sentiment → lower confidence
5. **Topic classification** — Some topics (pricing, complaints) always get lower confidence

#### Host Notification Channels
- Push notification (when mobile app exists)
- WhatsApp message to host's personal number (configurable)
- Email (fallback)
- Dashboard notification (if host is online)

#### Learning Loop

```
Host corrects/replaces AI response
  → Store correction as training signal
  → Over time, similar questions get better responses
  → Implementation: store (question, ai_answer, host_answer) tuples
  → Periodically review and update property knowledge base
  → V1: Manual KB updates based on correction patterns
  → V2: Semi-automatic suggestions ("We noticed you corrected X 5 times, update KB?")
```

---

## Tier 3 — Post-Launch

### 7. PMS / Channel Manager Marketplace Integration

#### Strategic Rationale
HC is NOT a PMS. Integrating with existing PMS platforms:
- Gives HC access to reservation data without building our own booking engine
- Provides distribution via marketplace listings (organic acquisition)
- Validates HC as a serious player in the ecosystem
- Hosts don't want to switch PMS — they want better messaging ON TOP of their PMS

#### Hostaway Integration

- **API Docs:** https://api.hostaway.com/documentation
- **Auth:** OAuth2 client credentials (API key + secret from Hostaway dashboard)
- **Webhooks:** Unified webhooks available for event subscriptions
- **Marketplace:** https://www.hostaway.com/marketplace/
- **Key endpoints for HC:**
  - `GET /reservations` — sync booking data
  - `GET /listings` — sync property info
  - `GET /conversations` — read existing messages
  - `POST /conversations/{id}/messages` — send messages through Hostaway
  - Webhooks for: new reservation, reservation update, new message

**Integration approach:**
1. Build as Hostaway marketplace app
2. Host connects via OAuth in HC dashboard
3. HC syncs properties + reservations
4. HC handles messaging via its own channel connections (WhatsApp, Airbnb, Booking.com)
5. Optionally sync conversation history to Hostaway

**Application process:** Submit via Hostaway partner program. Requires: working integration demo, documentation, support commitment.

#### Guesty Integration

- **API Docs:** https://open-api.guesty.com (Guesty Open API)
- **Marketplace:** 200+ integrations, submit via partner program
- **Auth:** OAuth2 or API key
- **Key endpoints for HC:**
  - `GET /reservations`
  - `GET /listings`
  - `GET /guests`
  - Webhooks for reservation events

**Integration approach:** Same pattern as Hostaway. Guesty's marketplace is larger and more mature — good distribution channel.

**Application process:** Apply via Guesty's partner program. More selective than Hostaway.

#### Lodgify Integration

- **API Docs:** https://www.lodgify.com/docs/api/
- **Smaller PMS, but growing in European market**
- **REST API with API key auth**
- **Less mature marketplace — easier to get listed**

#### Integration Priority

| PMS | Market Size | API Quality | Marketplace Distribution | Priority |
|---|---|---|---|---|
| Hostaway | Large (50k+ properties) | Good, well-documented | Strong marketplace | 1st |
| Guesty | Very large (global leader) | Excellent | Massive marketplace | 2nd |
| Lodgify | Medium (EU-focused) | Basic | Small marketplace | 3rd |

#### Timeline
1. **Month 1-2 post-launch:** Build Hostaway integration, apply to marketplace
2. **Month 3-4:** Guesty integration + marketplace application
3. **Month 5+:** Lodgify and other PMS platforms based on demand

---

### 8. Analytics & Reporting

#### Metrics Framework

**Operational Metrics (Host-Facing)**
| Metric | Calculation | Display |
|---|---|---|
| Messages handled | Count per property per channel per period | Bar chart |
| AI resolution rate | (AI-only conversations / total conversations) × 100 | Percentage + trend |
| Avg response time | Mean time from guest message to first response | Seconds (target: <60s) |
| Escalation rate | (Escalated / total) × 100 | Percentage |
| Guest satisfaction score | Sentiment analysis average | 1-5 scale proxy |

**Business Metrics (HC Internal)**
| Metric | Purpose |
|---|---|
| Messages per property/month | Usage-based pricing, capacity planning |
| Channel distribution | Investment priority (if 80% is Airbnb, focus there) |
| AI confidence distribution | Are we getting better over time? |
| Knowledge base coverage | What % of questions can AI answer? |
| Host engagement | How often do hosts log into dashboard? |
| Churn indicators | Declining usage, increasing escalation |

**Revenue Metrics (Future)**
| Metric | Description |
|---|---|
| Upsell conversion | If AI suggests late checkout / early check-in, how often accepted? |
| Direct booking attribution | If guest contacts via WhatsApp for rebooking |
| Review impact | Correlation between AI messaging and review scores |

#### Export & Reporting
- Monthly PDF report per property (auto-generated, emailed)
- CSV export for all raw data
- Dashboard with date range selector

---

## Technical Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    HeyConcierge Platform                       │
│                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │  Next.js     │  │  Unified    │  │  Conversation       │   │
│  │  Dashboard   │  │  Inbox UI   │  │  Dashboard UI       │   │
│  └──────┬───────┘  └──────┬──────┘  └──────────┬──────────┘   │
│         │                 │                     │              │
│         └─────────────────┼─────────────────────┘              │
│                           │                                    │
│                    ┌──────▼──────┐                             │
│                    │  API Layer  │ (Next.js API routes or      │
│                    │  /api/*     │  separate Express server)   │
│                    └──────┬──────┘                             │
│                           │                                    │
│              ┌────────────┼────────────┐                      │
│              │            │            │                       │
│       ┌──────▼───┐ ┌─────▼────┐ ┌────▼─────┐                │
│       │ Message   │ │ AI       │ │ Trigger  │                │
│       │ Router    │ │ Engine   │ │ Scheduler│                │
│       └──────┬────┘ └─────┬────┘ └────┬─────┘                │
│              │            │            │                       │
│       ┌──────▼────────────▼────────────▼─────┐                │
│       │          Message Queue                │                │
│       │     (BullMQ / Redis-backed)           │                │
│       └──────┬────────────┬──────────┬───────┘                │
│              │            │          │                         │
│       ┌──────▼───┐ ┌─────▼────┐ ┌──▼──────┐ ┌──────────┐   │
│       │ WhatsApp │ │ Airbnb   │ │Booking  │ │ Telegram │   │
│       │ Adapter  │ │ Adapter  │ │ Adapter │ │ Adapter  │   │
│       └──────┬───┘ └─────┬────┘ └──┬──────┘ └────┬─────┘   │
│              │            │         │              │          │
└──────────────┼────────────┼─────────┼──────────────┼──────────┘
               │            │         │              │
        ┌──────▼───┐ ┌─────▼────┐ ┌──▼──────┐ ┌────▼─────┐
        │ WhatsApp │ │ Airbnb   │ │Booking  │ │ Telegram │
        │ Cloud API│ │ Homes API│ │ Msg API │ │ Bot API  │
        └──────────┘ └──────────┘ └─────────┘ └──────────┘
```

### Database Schema Additions

```sql
-- Core unified messaging tables

-- Channels connected by a host
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  platform TEXT NOT NULL,  -- 'whatsapp' | 'airbnb' | 'booking' | 'telegram'
  credentials JSONB NOT NULL,  -- encrypted OAuth tokens, API keys, etc.
  status TEXT DEFAULT 'active',  -- 'active' | 'disconnected' | 'error'
  metadata JSONB,  -- platform-specific config
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unified conversations (one per guest per property per booking)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  channel_id UUID REFERENCES channels(id),
  platform TEXT NOT NULL,
  platform_thread_id TEXT,  -- Airbnb thread ID, Booking.com conversation ID, etc.
  guest_name TEXT,
  guest_phone TEXT,
  guest_email TEXT,
  reservation_id TEXT,  -- platform-specific reservation ID
  check_in_date DATE,
  check_out_date DATE,
  status TEXT DEFAULT 'new',  -- 'new' | 'ai-handling' | 'needs-review' | 'escalated' | 'resolved'
  sentiment TEXT,  -- 'positive' | 'neutral' | 'negative' | 'urgent'
  ai_resolution BOOLEAN DEFAULT FALSE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_property ON conversations(property_id, status);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

-- Individual messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  direction TEXT NOT NULL,  -- 'inbound' | 'outbound'
  sender_type TEXT NOT NULL,  -- 'guest' | 'ai' | 'host'
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text',  -- 'text' | 'image' | 'document' | 'audio'
  platform_message_id TEXT,  -- for deduplication and reference
  ai_confidence FLOAT,  -- 0.0-1.0, null for non-AI messages
  metadata JSONB,  -- platform-specific fields
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

-- Automated message triggers
CREATE TABLE message_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  trigger_type TEXT NOT NULL,  -- 'booking_confirmed' | 'pre_checkin' | 'checkin_day' | etc.
  offset_hours INTEGER NOT NULL,  -- relative to event (negative = before)
  template JSONB NOT NULL,  -- { "en": "...", "no": "...", ... }
  channels TEXT[] DEFAULT ARRAY['auto'],  -- 'auto' = same as booking channel
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger execution log (idempotency)
CREATE TABLE trigger_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_id UUID REFERENCES message_triggers(id),
  reservation_id TEXT NOT NULL,
  conversation_id UUID REFERENCES conversations(id),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trigger_id, reservation_id)
);

-- AI correction log (for learning loop)
CREATE TABLE ai_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id),
  original_response TEXT,
  host_correction TEXT,
  question_text TEXT,
  property_id UUID REFERENCES properties(id),
  applied_to_kb BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation analytics (hourly aggregates)
CREATE TABLE conversation_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  period_start TIMESTAMPTZ NOT NULL,
  period_type TEXT DEFAULT 'hourly',  -- 'hourly' | 'daily' | 'monthly'
  total_messages INTEGER DEFAULT 0,
  ai_responses INTEGER DEFAULT 0,
  human_responses INTEGER DEFAULT 0,
  escalations INTEGER DEFAULT 0,
  avg_response_time_seconds FLOAT,
  sentiment_positive INTEGER DEFAULT 0,
  sentiment_neutral INTEGER DEFAULT 0,
  sentiment_negative INTEGER DEFAULT 0,
  channel_breakdown JSONB,  -- {"whatsapp": 10, "airbnb": 5, ...}
  UNIQUE(property_id, period_start, period_type)
);
```

### Message Processing Pipeline

```javascript
// Unified message handler — all channels funnel through this

async function processIncomingMessage(message) {
  // 1. Normalize to unified format
  const unified = normalizeMessage(message);
  // { platform, threadId, guestName, content, reservationContext, ... }

  // 2. Find or create conversation
  const conversation = await findOrCreateConversation(unified);

  // 3. Store message
  const stored = await storeMessage(conversation.id, unified);

  // 4. Get property knowledge base
  const kb = await getPropertyKnowledgeBase(conversation.property_id);

  // 5. Generate AI response
  const aiResponse = await generateResponse({
    message: unified.content,
    conversationHistory: await getConversationHistory(conversation.id),
    knowledgeBase: kb,
    guestContext: {
      name: unified.guestName,
      checkIn: conversation.check_in_date,
      checkOut: conversation.check_out_date,
      platform: unified.platform,
    },
  });

  // 6. Evaluate confidence & escalation
  if (aiResponse.confidence >= 0.85) {
    await sendResponse(conversation, aiResponse.text);
    await updateConversationStatus(conversation.id, 'ai-handling');
  } else if (aiResponse.confidence >= 0.60) {
    await storeDraftResponse(conversation, aiResponse.text);
    await updateConversationStatus(conversation.id, 'needs-review');
    await notifyHost(conversation, 'review-needed');
  } else {
    await updateConversationStatus(conversation.id, 'escalated');
    await notifyHost(conversation, 'escalated');
  }

  // 7. Update real-time inbox
  await broadcastToInbox(conversation);
}
```

### Webhook Handler Design

```javascript
// Single webhook endpoint per platform

// WhatsApp: POST /api/webhooks/whatsapp
// Airbnb:   POST /api/webhooks/airbnb
// Booking:  POST /api/webhooks/booking
// Telegram: POST /api/webhooks/telegram

// Each handler:
// 1. Verify webhook signature (platform-specific)
// 2. Parse payload into normalized format
// 3. Enqueue in message queue
// 4. Return 200 immediately (don't block webhook)

// Queue worker processes messages asynchronously
```

### Message Queue

**Recommendation: BullMQ with Redis**
- Already common in Node.js ecosystem
- Handles retries, dead letter queues, rate limiting
- Can add per-platform rate limiting (e.g., Airbnb: max 5 req/sec)

```javascript
// Queues
const inboundQueue = new Queue('inbound-messages');   // incoming from platforms
const outboundQueue = new Queue('outbound-messages');  // sending to platforms
const triggerQueue = new Queue('trigger-messages');     // scheduled automations

// Per-platform rate limiting on outbound
outboundQueue.process('airbnb', 5, processAirbnbOutbound);   // 5 concurrent
outboundQueue.process('booking', 5, processBookingOutbound);
outboundQueue.process('whatsapp', 10, processWhatsAppOutbound);
```

### Rate Limiting Per Platform

| Platform | Known Limits | HC Strategy |
|---|---|---|
| WhatsApp Cloud API | 80 msg/sec (business tier) | Unlikely to hit; queue with 10 concurrent |
| Airbnb Homes API | Under NDA; typically conservative | Queue with 5 concurrent, exponential backoff |
| Booking.com Messaging API | Not publicly documented | Queue with 5 concurrent, exponential backoff |
| Telegram Bot API | 30 msg/sec to different chats | Queue with 20 concurrent |

---

## Competitive Positioning

### HC vs. Hostaway

| Dimension | Hostaway | HeyConcierge |
|---|---|---|
| Core product | PMS + Channel Manager | AI Communication Layer |
| Messaging | Basic inbox, limited AI | AI-first, deep knowledge base per property |
| WhatsApp | Via Twilio add-on | Native WhatsApp Cloud API |
| AI capabilities | Basic auto-responses | Context-aware, multilingual, property-specific AI |
| Price point | $40-200/mo per property | Lower — communication only |
| **Positioning** | **HC integrates WITH Hostaway** | **Not competing, complementing** |

### HC vs. Besty AI

| Dimension | Besty AI | HeyConcierge |
|---|---|---|
| Channels | Airbnb messaging only | WhatsApp + Airbnb + Booking.com + Telegram |
| WhatsApp | Not supported | Native, already built |
| AI approach | Airbnb-specific responses | Universal property KB across all channels |
| Direct guest contact | No (only in-platform) | Yes (WhatsApp = direct relationship) |
| **Positioning** | **Single-channel AI tool** | **Omnichannel AI communication platform** |

### HC vs. Guesty Messaging

| Dimension | Guesty | HeyConcierge |
|---|---|---|
| Core product | PMS with messaging add-on | Messaging-first with PMS integration |
| AI depth | Template-based, basic AI | Deep property knowledge base, contextual AI |
| Standalone | Must use Guesty PMS | Works with any PMS or standalone |
| Price | Premium (part of PMS package) | Affordable standalone pricing |
| **Positioning** | **HC is for hosts who want better messaging without switching PMS** |

### Unique HC Advantages
1. **WhatsApp-native:** No other competitor does WhatsApp + OTA messaging in one product
2. **Property knowledge base:** AI knows your specific property, not generic responses
3. **Channel-agnostic AI:** Same quality across all platforms
4. **Lightweight:** No PMS lock-in, integrates with what hosts already use
5. **Multilingual by default:** AI responds in guest's language automatically

---

## Go-to-Market Impact

### Messaging as the Wedge

**"Works with Airbnb, Booking.com, and WhatsApp"** = instant credibility with any host.

Every host has at least one of these problems:
- Airbnb response time killing their ranking
- Answering the same questions on multiple platforms
- Losing direct booking potential because guests can't reach them easily
- Waking up at 3 AM for guest messages

HC solves all of them.

### Distribution Channels

| Channel | Mechanism | Expected Impact |
|---|---|---|
| Airbnb Partner Marketplace | Listed as approved Airbnb integration | High — organic discovery by 4M+ Airbnb hosts |
| Hostaway Marketplace | Listed in Hostaway's app marketplace | Medium — access to 50k+ properties |
| Guesty Marketplace | Listed in Guesty's 200+ integration marketplace | Medium-High — global reach |
| WhatsApp word-of-mouth | Hosts share with other hosts | Organic — "how did you respond so fast?" |
| Content marketing | "How to improve your Airbnb response time" | SEO-driven acquisition |

### Primary Acquisition Narrative

> **For Airbnb hosts:**  
> "Your Airbnb ranking drops every time you take more than an hour to respond. HeyConcierge responds in under 60 seconds, 24/7, with answers specific to YOUR property. And it works on WhatsApp and Booking.com too."

> **For multi-platform hosts:**  
> "Stop switching between Airbnb, Booking.com, and WhatsApp. One inbox, one AI, all your properties."

> **For property managers:**  
> "Manage messaging for 50 properties across 3 platforms without hiring more staff."

### Launch Sequence

1. **Month 1:** WhatsApp AI messaging (already built) + Unified Inbox UI
2. **Month 2:** Airbnb integration (pending partner approval) + Automated triggers
3. **Month 3:** Booking.com integration (if partnership available) + Analytics dashboard
4. **Month 4:** Hostaway marketplace listing + Smart escalation refinements
5. **Month 5-6:** Guesty/Lodgify integrations + Advanced analytics

---

## Appendix A: API Documentation Links

| Platform | URL | Access |
|---|---|---|
| Airbnb Homes API | https://developer.airbnb.com/homes/docs/introduction | Partner-only |
| Airbnb API Portal | https://developer.airbnb.com | Partner application |
| Booking.com Messaging API | https://developers.booking.com/connectivity/docs/messaging-api/understanding-the-messaging-api | Connectivity Partner |
| Booking.com Connectivity Portal | https://connect.booking.com | Partnership application |
| WhatsApp Cloud API | https://developers.facebook.com/docs/whatsapp/cloud-api | Open (Meta Business account) |
| WhatsApp Pricing | https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing | Public |
| Hostaway API | https://api.hostaway.com/documentation | API key from dashboard |
| Guesty Open API | https://open-api.guesty.com | Partner/customer access |
| Lodgify API | https://www.lodgify.com/docs/api/ | API key |
| Telegram Bot API | https://core.telegram.org/bots/api | Open (BotFather token) |

## Appendix B: Key Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Airbnb partner approval delayed | Can't launch Airbnb integration | Medium | Build everything else first; Airbnb plugs in when ready |
| Booking.com partnership paused | Can't integrate Booking.com messaging | High | Focus on Airbnb + WhatsApp; explore existing partner intermediaries |
| AI sends incorrect information | Guest gets wrong check-in code, etc. | Low-Medium | Confidence thresholds, human review mode, explicit KB structure |
| Platform API changes | Breaking changes to messaging endpoints | Medium | Adapter pattern isolates platform specifics; monitor changelogs |
| Rate limiting / account suspension | Over-aggressive messaging flagged | Low | Conservative rate limits, queue-based sending, follow platform guidelines |
| GDPR / data privacy | Guest data stored across platforms | Medium | Data processing agreements, encryption at rest, retention policies, delete on request |

## Appendix C: Immediate Action Items

| # | Action | Owner | Deadline |
|---|---|---|---|
| 1 | Apply for Airbnb Partner Program | Business | This week |
| 2 | Apply for Booking.com Connectivity Partner | Business | This week |
| 3 | Design unified conversations DB schema | Tech | Week 1-2 |
| 4 | Refactor WhatsApp handler into adapter pattern | Tech | Week 2-3 |
| 5 | Build unified inbox UI (WhatsApp-only first) | Tech | Week 3-4 |
| 6 | Design message trigger system | Tech | Week 4-5 |
| 7 | Submit WhatsApp message templates to Meta | Business | Week 2 |
| 8 | Draft property onboarding flow for multi-channel | Both | Week 3 |

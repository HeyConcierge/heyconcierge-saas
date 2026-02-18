# Airbnb Partner Program — Application Guide for HeyConcierge

**Date:** 2026-02-17  
**Status:** Research complete, ready to apply  

---

## TL;DR

Airbnb's API is **not publicly available**. Access is granted only to approved **Connectivity Partners** (PMS/Channel Manager software companies). There is **no open application form** — Airbnb selectively recruits partners, but you can submit an inquiry through their partner portal. The process is opaque, slow, and heavily favors established companies with existing customer bases. HeyConcierge faces significant barriers as a pre-launch startup, but there are actionable steps to take now.

---

## 1. How Airbnb's Partner Program Works

### Program Structure
- **Connectivity Partners**: Software companies (PMS, Channel Managers) that integrate via Airbnb's API
- **Preferred Partners**: Top-tier partners meeting technical/performance benchmarks  
- **Preferred+ Partners**: Elite tier (e.g., Guesty, Hospitable, Hostaway, Lodgify)

### What the API Covers (Homes API)
From `developer.airbnb.com`:
- Create/manage listings (content, photos, amenities, pricing, availability)
- Manage reservations
- **Respond to messages and reviews** ← This is what HeyConcierge needs
- Version 2024.12.31 — deprecation enforcements ongoing as of Jan 2026

### API Scopes Relevant to HeyConcierge
Based on the developer docs OAuth flow, known scopes include:
- `partner_profile_read`
- `basic_profile_read`  
- `email_read`
- Messaging-specific scopes (not publicly documented, revealed after partner approval)

The Messaging API allows reading and sending messages on behalf of hosts — exactly what HeyConcierge needs for AI-powered guest communication.

---

## 2. Application Process

### Step 1: Create an Airbnb Account
- Go to **https://www.airbnb.com/partner**
- Sign up / Log in
- This is the partner portal entry point

### Step 2: Submit Partner Inquiry
There is **no public application form** currently accepting submissions. Airbnb states they are:
> "Looking only for prospective partners and reaching out to the prospective partners themselves. Their decision is based on supply opportunity, technology strength, combined with the ability to support shared customers."

**Available channels to apply:**
1. **Partner Portal** (`airbnb.com/partner`) — Log in and look for inquiry/contact options after authentication
2. **Airbnb Global Support** — Contact directly expressing partnership interest
3. **Email outreach** — partnerships@airbnb.com or connectivity-partners@airbnb.com (speculative, but commonly referenced)
4. **LinkedIn outreach** — Find Airbnb's Connectivity Partner team members (they have "Connectivity Partner Lead" roles)

### Step 3: If Accepted — Onboarding
- Receive API documentation access
- Assigned a dedicated partner manager
- Complete data security review
- Complete API quality review
- Build and certify integration
- Launch

---

## 3. What Airbnb Evaluates

Based on research across multiple sources:

| Criteria | What They Want | HeyConcierge Status |
|----------|---------------|-------------------|
| **Company maturity** | Established company with track record | ❌ Pre-launch startup |
| **Existing customer base** | Hosts already using your software | ❌ No customers yet |
| **Supply opportunity** | How many listings you'd bring/manage | ❌ Zero currently |
| **Technology strength** | Robust, production-ready platform | ⚠️ MVP in progress |
| **Data security** | Security review required | ⚠️ Not yet audited |
| **API quality** | Reliable, well-built integration | ⚠️ Not built yet |
| **Support capability** | Ability to support shared customers | ⚠️ Small team |
| **Use case fit** | PMS/Channel Manager primarily | ⚠️ Messaging-only is niche |

---

## 4. Draft Application / Outreach

### Email Template for Partnership Inquiry

**Subject:** Connectivity Partnership Inquiry — HeyConcierge AS (AI Guest Communication Platform)

---

Dear Airbnb Connectivity Partnerships Team,

I'm writing to express our interest in becoming an Airbnb Connectivity Partner.

**About HeyConcierge:**
HeyConcierge AS is a Norwegian technology company building an AI-powered guest communication platform for short-term rental hosts. Our platform enables:

- **Automated guest messaging** — AI-driven responses to guest inquiries using the host's property knowledge base
- **Multi-language support** — Instant communication in any language
- **24/7 availability** — Guests receive immediate, accurate responses at any hour
- **Smart escalation** — Complex or sensitive queries are routed to the human host
- **Multi-channel** — We already support WhatsApp and plan to integrate with all major OTA messaging channels

**Why Airbnb Integration Matters:**
The majority of guest communication happens through Airbnb's messaging system. Hosts managing multiple properties struggle to respond promptly, which impacts response rates, Superhost status, and guest satisfaction. HeyConcierge solves this by providing intelligent, context-aware automated responses.

**Technical Readiness:**
- Next.js frontend, Express.js backend, PostgreSQL database
- Deployed on Vercel (frontend) and Render (backend)
- WhatsApp Business API integration already operational
- OAuth 2.0 authentication flows implemented
- Webhook-based architecture ready for real-time message handling

**API Access Needed:**
We're specifically interested in the **Messaging API** to:
- Receive incoming guest messages via webhooks
- Send AI-generated responses on behalf of hosts
- Access reservation context for informed responses

**Company Details:**
- Company: HeyConcierge AS (Norwegian company, registration in progress)
- Contact: Jacob Nørby, jacob@norwegian.travel
- Website: heyconcierge.io (launching Q2 2026)
- Location: Norway

We'd welcome the opportunity to discuss how HeyConcierge can enhance the host experience on Airbnb. We're happy to provide a technical demo or additional documentation.

Best regards,  
Jacob Nørby  
Founder, HeyConcierge AS

---

## 5. Prerequisites to Fulfill First

### Critical (before applying):
1. **✅ Company registration** — Complete HeyConcierge AS registration, get org number
2. **✅ Professional email** — Set up jacob@heyconcierge.io (applying with @norwegian.travel looks less credible)
3. **✅ Website** — At minimum a landing page at heyconcierge.io explaining the product
4. **🔲 Working product demo** — Even a video walkthrough showing the WhatsApp integration working

### Important (strengthens application):
5. **🔲 Privacy policy & Terms of Service** — Published on website
6. **🔲 At least 1 beta customer** — A host using HeyConcierge (even for WhatsApp only)
7. **🔲 Security documentation** — Basic data handling/privacy docs (GDPR compliance as Norwegian company is a plus)
8. **🔲 Technical documentation** — Architecture overview showing you can handle the integration

### Nice to have:
9. **🔲 Multiple beta customers** with measurable results (response time improvements, etc.)
10. **🔲 PMS/Channel Manager features** — Even basic listing management increases approval chances

---

## 6. Timeline Expectations

| Phase | Expected Duration |
|-------|------------------|
| Submit inquiry | Immediate |
| Initial response from Airbnb | 2-8 weeks (many report no response) |
| Review & evaluation | 4-12 weeks |
| API access granted | Unknown (could be months) |
| Integration development | 4-8 weeks |
| Certification/quality review | 2-4 weeks |
| **Total optimistic** | **3-6 months** |
| **Total realistic** | **6-12+ months** |

⚠️ Many companies report **never hearing back** from Airbnb partnership inquiries.

---

## 7. Risks & Potential Rejection Reasons

### High Risk:
1. **No existing customer base** — Airbnb prioritizes partners who bring supply (listings/hosts)
2. **Pre-revenue startup** — No track record of reliability or support capability
3. **Messaging-only focus** — Airbnb's partner program is built around PMS/Channel Manager functionality; a messaging-only tool is unusual
4. **No website yet** — Immediate credibility issue
5. **Airbnb may not respond at all** — The partner program is notoriously selective and slow

### Medium Risk:
6. **Competition** — Hospitable (Preferred+ partner) already offers AI-powered messaging. Guesty has messaging features. Airbnb may see this space as covered.
7. **Small company** — One-person team vs. established companies with engineering teams
8. **Norwegian market** — Small market; Airbnb may prioritize larger markets

### Mitigations:
- **Build customer base first** on WhatsApp/direct booking channels, then approach Airbnb with traction
- **Consider partnering with an existing PMS** that has Airbnb API access (Hospitable, Guesty, etc.) rather than getting direct access
- **Use iCal/scraping** as interim workaround (not for messaging though)

---

## 8. Alternative Strategies

### Option A: Direct Airbnb Partnership (described above)
- Pros: Full API access, official partnership
- Cons: Very hard to get, especially pre-launch
- Timeline: 6-12+ months

### Option B: Integrate via Existing PMS Partner ⭐ RECOMMENDED
- Partner with Guesty, Hospitable, Hostaway, etc. who already have Airbnb API access
- Build HeyConcierge as a layer on top of their messaging data
- Many PMS platforms have their own APIs/webhooks that expose Airbnb messages
- Pros: Faster, more realistic, adds multi-platform support
- Cons: Dependency on third party, potential limitations

### Option C: Airbnb Browser Automation (risky)
- Automate Airbnb messaging through browser automation
- Pros: No partnership needed
- Cons: Against Airbnb ToS, fragile, account risk

### Option D: Build PMS Features First
- Expand HeyConcierge into a lightweight PMS/Channel Manager
- Apply for Airbnb partnership with broader feature set
- Pros: Better fit for partner program, larger market
- Cons: Massive scope increase

---

## 9. Recommended Action Plan

1. **Now:** Complete company registration, set up heyconcierge.io with landing page
2. **Now:** Set up professional email (jacob@heyconcierge.io)
3. **Week 1-2:** Create Airbnb account on partner portal, explore what's available after login
4. **Week 2:** Send partnership inquiry email (template above)
5. **Parallel:** Research Option B — investigate APIs of Hospitable, Guesty, Hostaway for messaging webhook access
6. **Month 1-3:** Build product, get beta customers on WhatsApp channel
7. **Month 3:** Follow up with Airbnb if no response, now with traction data
8. **Ongoing:** Monitor Airbnb developer blog for any changes to partner program accessibility

---

## 10. Key URLs

| Resource | URL |
|----------|-----|
| Partner Portal | https://www.airbnb.com/partner |
| Developer Docs (requires login) | https://developer.airbnb.com/ |
| Software Partners Page | https://www.airbnb.com/software-partners |
| 2025 Preferred Partners Announcement | https://news.airbnb.com/announcing-our-2025-preferred-software-partners/ |
| Help: Channel Manager Partners | https://www.airbnb.com/help/article/3304 |
| Help: Managing with PMS | https://www.airbnb.com/help/article/2683 |

---

*Research completed 2026-02-17. Sources: developer.airbnb.com, news.airbnb.com, elfsight.com, multiple community reports.*

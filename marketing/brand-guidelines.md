# HeyConcierge Brand Guidelines

> Last updated: February 2026

---

## Table of Contents

1. [Brand Identity](#brand-identity)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Logo Usage](#logo-usage)
5. [Mascot Usage](#mascot-usage)
6. [Photography & Imagery Style](#photography--imagery-style)
7. [Social Media Templates](#social-media-templates)
8. [Writing Style](#writing-style)

---

## Brand Identity

### Company Name
**HeyConcierge** — always one word, capital H and capital C.

| ✅ Correct | ❌ Incorrect |
|---|---|
| HeyConcierge | Hey Concierge |
| HeyConcierge | heyconcierge |
| HeyConcierge | HEY CONCIERGE |
| HeyConcierge | Heyconcierge |

### Tagline
**Full tagline:**
> "AI-powered guest communication for short-term rentals. 24/7. Every language. Every platform."

**Short tagline:**
> "Your AI guest concierge"

### Mission Statement
HeyConcierge empowers short-term rental hosts to deliver exceptional guest experiences through intelligent, multilingual, always-on AI communication — so hosts can focus on growing their business while every guest feels personally cared for.

### Tone of Voice
- **Friendly** — We're warm and welcoming, like the best hotel concierge you've ever met
- **Professional** — We know our stuff and communicate with confidence
- **Approachable** — No jargon walls, no corporate-speak
- **Trustworthy** — We deliver on promises and communicate transparently

> **Think:** A helpful hotel concierge who also speaks tech. Never corporate-stiff. Always human.

### Brand Personality
| Trait | Description |
|---|---|
| **Smart** | Intelligent AI that learns and adapts |
| **Warm** | Genuine care for guests and hosts |
| **Reliable** | 24/7 availability, consistent quality |
| **Multilingual** | Speaks every language your guests do |
| **Always-on** | Never sleeps, never takes a break |

---

## Color Palette

### Primary Colors

| Color | HEX | RGB | HSL | Usage |
|---|---|---|---|---|
| **Primary Purple** | `#6C5CE7` | `rgb(108, 92, 231)` | `hsl(247, 75%, 63%)` | Main brand color, buttons, links |
| **Light Purple** | `#A29BFE` | `rgb(162, 155, 254)` | `hsl(244, 98%, 80%)` | Gradients, accents, hover states |
| **Soft Purple BG** | `#F0EDFF` | `rgb(240, 237, 255)` | `hsl(250, 100%, 96%)` | Backgrounds, mascot face |
| **Dark Navy** | `#2D2B55` | `rgb(45, 43, 85)` | `hsl(243, 33%, 25%)` | Text, mascot eyes |
| **Accent Red** | `#FF6B6B` | `rgb(255, 107, 107)` | `hsl(0, 100%, 71%)` | Mascot hat, CTAs, alerts |
| **Warm Yellow** | `#FDCB6E` | `rgb(253, 203, 110)` | `hsl(39, 97%, 71%)` | Hat detail, highlights |
| **Blush Pink** | `#FFB8B8` | `rgb(255, 184, 184)` | `hsl(0, 100%, 86%)` | Cheeks, warmth accents |
| **Soft Purple BG (alt)** | `#E8E4FF` | `rgb(232, 228, 255)` | `hsl(249, 100%, 95%)` | Light backgrounds, cards |

### Secondary / UI Colors

| Color | HEX | RGB | HSL | Usage |
|---|---|---|---|---|
| **White** | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` | Backgrounds, cards |
| **Light Gray** | `#F8F9FA` | `rgb(248, 249, 250)` | `hsl(210, 17%, 98%)` | Page backgrounds |
| **Text Gray** | `#6B7280` | `rgb(107, 114, 128)` | `hsl(220, 9%, 46%)` | Secondary text, captions |
| **Dark Text** | `#1F2937` | `rgb(31, 41, 55)` | `hsl(215, 28%, 17%)` | Primary text, headings |
| **Success Green** | `#10B981` | `rgb(16, 185, 129)` | `hsl(160, 84%, 39%)` | Success states, confirmations |
| **Warning Orange** | `#F59E0B` | `rgb(245, 158, 11)` | `hsl(38, 92%, 50%)` | Warnings, attention |
| **Error Red** | `#EF4444` | `rgb(239, 68, 68)` | `hsl(0, 84%, 60%)` | Errors, destructive actions |

### Color Usage Rules

- **Primary Purple (#6C5CE7)** is the hero. Use it for primary CTAs, navigation highlights, and key UI elements.
- **Light Purple (#A29BFE)** for gradients paired with Primary Purple, secondary buttons, and decorative elements.
- **Soft Purple backgrounds (#F0EDFF, #E8E4FF)** for section backgrounds, card fills, and subtle highlighting.
- **Dark Navy (#2D2B55)** for heading text when used on light backgrounds.
- **Accent Red (#FF6B6B)** sparingly — CTAs, important alerts, the mascot's hat.
- Never use more than 3 brand colors in a single composition.

### Gradient

Primary gradient (for backgrounds, hero sections):
```css
background: linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%);
```

Dark gradient (for dark sections):
```css
background: linear-gradient(135deg, #2D2B55 0%, #6C5CE7 100%);
```

---

## Typography

### Font Family

| Use | Font | Weight | Fallback |
|---|---|---|---|
| **Headings** | Inter | Bold (700) / Semibold (600) | -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif |
| **Body** | Inter | Regular (400) / Medium (500) | -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif |
| **Code/Technical** | JetBrains Mono | Regular (400) | 'Courier New', monospace |

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| **H1** | 48px / 3rem | Bold (700) | 1.2 | -0.02em |
| **H2** | 36px / 2.25rem | Bold (700) | 1.25 | -0.01em |
| **H3** | 30px / 1.875rem | Semibold (600) | 1.3 | -0.01em |
| **H4** | 24px / 1.5rem | Semibold (600) | 1.35 | 0 |
| **H5** | 20px / 1.25rem | Semibold (600) | 1.4 | 0 |
| **H6** | 18px / 1.125rem | Semibold (600) | 1.4 | 0 |
| **Body Large** | 18px / 1.125rem | Regular (400) | 1.6 | 0 |
| **Body** | 16px / 1rem | Regular (400) | 1.6 | 0 |
| **Body Small** | 14px / 0.875rem | Regular (400) | 1.5 | 0 |
| **Caption** | 12px / 0.75rem | Medium (500) | 1.4 | 0.01em |
| **Overline** | 11px / 0.6875rem | Semibold (600) | 1.4 | 0.08em |

### CSS Implementation

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap');

:root {
  --font-heading: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-code: 'JetBrains Mono', 'Courier New', monospace;
}
```

---

## Logo Usage

### Official Logo

The official HeyConcierge logo is the **mascot character** — the purple concierge with red bellhop hat. This is the primary brand mark used across all platforms.

**Official file:** `assets/hc-logo-official.png` (400×400, transparent background)

**Pre-sized for SoMe:**
- LinkedIn: `assets/hc-logo-300x300.png`
- Instagram: `assets/hc-logo-320x320.png`
- TikTok: `assets/hc-logo-200x200.png`
- White background: `assets/hc-logo-white-bg.png`
- SVG source: `assets/mascot.svg` (vector, infinitely scalable)

### Additional Versions

| Version | File | Use Case |
|---|---|---|
| **Official (mascot)** | `assets/hc-logo-official.png` | Primary logo — all platforms |
| **Full Color** | `assets/logo.svg` | With text — light backgrounds |
| **Dark** | `assets/logo-dark.svg` | Light backgrounds (dark text + purple icon) |
| **Light** | `assets/logo-light.svg` | Dark backgrounds (white text + white icon) |
| **Icon Only** | Mascot from `assets/mascot.svg` | Favicons, app icons, small spaces |

### Sizing

- **Minimum size:** 32px height
- **Recommended web:** 40–48px height in navigation
- **Print minimum:** 25mm width

### Clear Space

Maintain a clear space equal to **1× the logo height** on all sides. No other elements should encroach on this space.

```
┌──────────────────────────────┐
│         1× height            │
│    ┌──────────────────┐      │
│ 1× │   HeyConcierge   │ 1×  │
│    └──────────────────┘      │
│         1× height            │
└──────────────────────────────┘
```

### Do's ✅

- Use official logo files from the brand kit
- Maintain the clear space around the logo
- Use appropriate version for the background color
- Scale proportionally

### Don'ts ❌

- Don't stretch or distort the logo
- Don't rotate the logo
- Don't change the logo colors
- Don't add effects (shadows, glows, outlines)
- Don't place on busy backgrounds without sufficient contrast
- Don't rearrange logo elements
- Don't use the old/unofficial logo versions
- Don't place on a background that clashes with brand colors

---

## Mascot Usage

### About the Mascot
The HeyConcierge mascot is a **friendly purple concierge character** — round, approachable, wearing a red concierge hat with a yellow detail. It has dark navy eyes, pink blush cheeks, and a soft purple body.

### When to Use

| Context | Example |
|---|---|
| **Onboarding** | Welcome screens, first-time user flows |
| **Empty States** | "No messages yet" screens |
| **Loading** | Animated loading states |
| **Marketing** | Social media posts, ads, landing pages |
| **Social Media** | Profile pictures, post illustrations |
| **Error Pages** | 404, maintenance pages |
| **Emails** | Welcome emails, newsletters |

### Mascot Variations

| File | Description |
|---|---|
| `assets/mascot.svg` | Standard mascot on transparent background |
| `assets/mascot-white-bg.svg` | Mascot on white circle background (social profiles) |

### Do's ✅

- Use at recommended sizes (minimum 48px)
- Use on brand-approved backgrounds
- Animate subtly (gentle bounce, wave)
- Pair with friendly copy

### Don'ts ❌

- Don't distort or stretch the mascot
- Don't recolor the mascot
- Don't add unauthorized accessories or modifications
- Don't use in contexts that could harm the brand
- Don't crop essential parts of the mascot
- Don't place on clashing color backgrounds

---

## Photography & Imagery Style

### Themes

| Theme | Description |
|---|---|
| **Cozy apartments** | Warm, well-lit living spaces that feel like home |
| **Happy travelers** | Diverse, genuine smiles — not overly posed |
| **City views** | Beautiful destinations from apartment balconies/windows |
| **Check-in moments** | Keys, door codes, welcome baskets, arrival joy |
| **Host life** | Property managers on phones/laptops, managing with ease |

### Style Guidelines

- **Warm color temperature** — slightly warm white balance
- **Natural lighting** preferred — golden hour is ideal
- **Authentic feel** — real moments, not staged corporate shoots
- **Diverse representation** — global travelers, various ages and backgrounds
- **Space and comfort** — images should feel inviting, not cramped

### Avoid ❌

- Generic corporate stock photos
- Overly staged, plastic-looking scenes
- Cold, clinical lighting
- Images with visible competing brand logos
- Low-resolution or pixelated images
- Oversaturated or heavily filtered photos

### Image Treatment

When using photos with brand overlay:
- Apply a subtle purple gradient overlay: `linear-gradient(135deg, rgba(108,92,231,0.3), rgba(162,155,254,0.2))`
- Or use a dark overlay for text readability: `rgba(45,43,85,0.6)`

---

## Social Media Templates

### Profile Pictures

Use the mascot on a white or Primary Purple (#6C5CE7) background, centered with adequate padding.

### Platform Dimensions

| Platform | Asset | Dimensions |
|---|---|---|
| **LinkedIn** | Company Logo | 300 × 300 px |
| **LinkedIn** | Banner | 1128 × 191 px |
| **Instagram** | Profile | 320 × 320 px |
| **Instagram** | Post (square) | 1080 × 1080 px |
| **Instagram** | Story / Reel | 1080 × 1920 px |
| **TikTok** | Profile | 200 × 200 px |
| **Twitter/X** | Profile | 400 × 400 px |
| **Twitter/X** | Banner | 1500 × 500 px |
| **Facebook** | Profile | 170 × 170 px |
| **Facebook** | Cover | 820 × 312 px |

### Post Style

- Clean, minimal design
- Primary Purple (#6C5CE7) as accent color
- White or Soft Purple (#F0EDFF) backgrounds
- Inter font for all text
- Mascot appearances in corners or as reactions
- Brand gradient for feature announcements
- Consistent bottom bar with logo + tagline

---

## Writing Style

### Terminology

| ✅ Use | ❌ Don't Use |
|---|---|
| HeyConcierge | Hey Concierge, heyconcierge, HEYCONCIERGE |
| Properties | Listings, units, rentals |
| Guests | Customers, users, tenants |
| Hosts | Property managers, operators, landlords |
| AI concierge | Chatbot, bot, virtual assistant |
| Messages | Chats, conversations, tickets |
| Auto-triggers | Automations, workflows (in casual context) |

### Voice Principles

1. **Be helpful first** — Lead with value, not features
2. **Be clear** — Simple language > jargon
3. **Be human** — Write like you talk (professionally)
4. **Be confident** — "HeyConcierge handles this" not "HeyConcierge can try to help"
5. **Be inclusive** — Global audience, diverse hosts and guests

### Punctuation & Formatting

- Use Oxford comma (a, b, and c)
- Em dash (—) without spaces for parenthetical statements
- Numbers: spell out one through nine, use digits for 10+
- Percentages: use the % symbol (not "percent")
- Time: 24/7 (not "twenty-four seven" or "24-7")
- Languages: capitalize (English, Norwegian, Spanish)

### Example Sentences

> ✅ "HeyConcierge responds to your guests in their language, 24/7."
>
> ✅ "Set up auto-triggers so your properties run themselves."
>
> ❌ "Our chatbot can assist your customers automatically."
>
> ❌ "Hey Concierge's bot manages your listing units."

---

## Brand Assets Checklist

- [ ] `assets/logo.svg` — Full color logo
- [ ] `assets/logo-dark.svg` — Dark version for light backgrounds
- [ ] `assets/logo-light.svg` — Light version for dark backgrounds
- [ ] `assets/mascot.svg` — Standard mascot
- [ ] `assets/mascot-white-bg.svg` — Mascot on white circle
- [ ] `color-palette.html` — Interactive color reference
- [ ] `social-templates.md` — Platform dimension specs
- [ ] `copy-bank.md` — Pre-written marketing copy

---

*© 2026 HeyConcierge. All rights reserved.*

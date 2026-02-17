# modules/ — Business Logic Layer

This directory contains the **domain logic** extracted from API route handlers.

## Why modules?

API routes in Next.js should be thin — they handle HTTP concerns (parsing request, returning response).
Heavy logic belongs here so it's:
- Testable in isolation
- Reusable across multiple routes
- Clear who owns what

## Structure & Ownership

| Module        | Owner  | Responsibility                                      |
|---------------|--------|-----------------------------------------------------|
| `auth/`       | Lars   | Login, session, cookie helpers                      |
| `properties/` | Lars   | Property CRUD, config sheets                        |
| `payments/`   | Lars   | Stripe integration, plan management                 |
| `bookings/`   | Erik   | iCal parsing, booking sync, calendar logic          |
| `messaging/`  | Jacob  | Telegram/WhatsApp send/receive helpers              |
| `ai/`         | Jacob  | Claude prompts, concierge logic, context building   |

## Convention

Each module exports plain functions. No HTTP, no Next.js-specific code.

```ts
// Example: modules/ai/concierge.ts
export async function buildPropertyContext(property: any, config: any): Promise<string> { ... }
export async function callClaude(messages: any[], systemPrompt: string): Promise<string> { ... }
```

Then API routes just call the module:
```ts
// app/api/telegram-webhook/route.ts
import { buildPropertyContext, callClaude } from '@/modules/ai/concierge'
```

## Status

Modules are being extracted incrementally as features are touched.
Don't refactor everything at once — extract when you're already editing a route.

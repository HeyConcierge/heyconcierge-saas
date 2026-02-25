# Hybrid Chat System Setup Guide

## Overview
AI + Human hybrid chat widget for HeyConcierge website with automatic escalation and Telegram notifications.

## Features
✅ Floating chat widget on public pages
✅ AI auto-reply powered by Claude (Anthropic)
✅ Smart escalation to human team
✅ Telegram notifications for new chats
✅ Dashboard for team to view/reply to chats
✅ Mobile-responsive design

## Setup Instructions

### 1. Database Setup

Run the SQL migration to create chat tables:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in Supabase SQL Editor:
# Copy contents of supabase/migrations/create_chat_system.sql
```

The migration creates:
- `chats` table (stores chat sessions)
- `messages` table (stores individual messages)
- RLS policies (security rules)

### 2. Environment Variables

Add to `.env.local`:

```bash
# Already in .env.local (from PDF parsing feature)
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# New variables needed:
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=-1001234567890
```

### 3. Get Telegram Bot Token

1. Open Telegram and search for `@BotFather`
2. Send `/newbot`
3. Follow prompts (bot name, username)
4. Copy the token (looks like `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. Add to `.env.local` as `TELEGRAM_BOT_TOKEN`

### 4. Get Telegram Chat ID

**Option A: For a group chat (recommended)**

1. Create a Telegram group for your team
2. Add your bot to the group
3. Send a test message in the group
4. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
5. Look for `"chat":{"id":-1001234567890}` (negative number for groups)
6. Copy the chat ID
7. Add to `.env.local` as `TELEGRAM_CHAT_ID`

**Option B: For direct messages**

1. Start a chat with your bot in Telegram
2. Send any message
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for `"chat":{"id":123456789}`
5. Copy the chat ID

### 5. AI Knowledge Base

The AI is configured with HeyConcierge product knowledge in:
`app/api/chat/send/route.ts`

Update the `KNOWLEDGE_BASE` constant to add more product info.

### 6. Escalation Logic

Messages are automatically escalated to human when user says:
- "human", "real person", "talk to someone"
- "billing", "payment", "refund", "cancel"
- Or AI fails to respond

Configure in `shouldEscalate()` function in `app/api/chat/send/route.ts`

### 7. Test the Chat

1. Start dev server: `npm run dev`
2. Go to homepage: `http://localhost:3000`
3. Click chat bubble (bottom-right)
4. Send a message
5. Check Telegram for notification (if escalated)
6. View in dashboard: `http://localhost:3000/dashboard/chats`

## Usage

### For Customers (Website Visitors)

1. Click floating chat bubble on website
2. Optionally provide name/email
3. Ask questions
4. Get instant AI responses
5. Request human help if needed

### For Team (Dashboard)

1. Go to `/dashboard/chats`
2. See all chats (active, escalated, resolved)
3. Click a chat to view conversation
4. Reply directly in dashboard
5. Mark as resolved when done

### Telegram Notifications

Team receives notifications for:
- New chats (when first message sent)
- Escalated chats (when user asks for human)
- Failed AI responses

Notification includes:
- User name/email (if provided)
- Chat message
- Link to dashboard

## Customization

### Widget Appearance

Edit `components/chat/ChatWidget.tsx`:
- Change colors (Tailwind classes)
- Modify welcome message
- Adjust bubble size/position

### AI Personality

Edit `app/api/chat/send/route.ts`:
- Update `KNOWLEDGE_BASE` for product knowledge
- Adjust system prompt for tone/style
- Change model (`claude-3-5-sonnet-20241022`)

### Escalation Rules

Edit `shouldEscalate()` in `app/api/chat/send/route.ts`:
- Add/remove trigger keywords
- Implement custom logic (e.g., sentiment analysis)

## Architecture

```
User Message → API Route (/api/chat/send)
                 ↓
            Save to Supabase
                 ↓
         Check Escalation Rules
                 ↓
    ┌────────────┴────────────┐
    ↓                         ↓
AI Reply               Telegram Notification
    ↓                         ↓
Save to DB              Team Dashboard
    ↓
Return to User
```

## Security

- RLS policies prevent unauthorized data access
- Public can only see their own chats
- Authenticated team can see all chats
- Sensitive env vars never exposed to client

## Troubleshooting

**Chat bubble doesn't appear**
- Check browser console for errors
- Verify component is imported in layout
- Clear browser cache

**AI not responding**
- Check `ANTHROPIC_API_KEY` is set
- Verify API key is valid
- Check server logs for errors

**Telegram notifications not working**
- Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`
- Ensure bot is added to group chat
- Check bot has permission to send messages

**Dashboard shows no chats**
- Run database migration
- Check RLS policies are enabled
- Verify Supabase connection

## Future Enhancements

- [ ] Reply from Telegram (bot listens for `/reply` commands)
- [ ] Real-time updates (Supabase Realtime)
- [ ] Chat analytics dashboard
- [ ] Multi-language support in widget
- [ ] File/image attachments
- [ ] Chat ratings/feedback
- [ ] Canned responses for team

## Support

Questions? Check:
- `components/chat/ChatWidget.tsx` - Widget UI
- `app/api/chat/send/route.ts` - AI logic
- `app/(dashboard)/chats/page.tsx` - Dashboard
- `supabase/migrations/create_chat_system.sql` - Database schema

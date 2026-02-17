-- Migration 004: Add Telegram support

-- 1. Add telegram_chat_id to guest_sessions
ALTER TABLE guest_sessions
ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT;

-- Unique index for Telegram chat ID lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_guest_sessions_telegram
ON guest_sessions(telegram_chat_id) WHERE telegram_chat_id IS NOT NULL;

-- Make guest_phone nullable (Telegram users may not have a phone on file)
ALTER TABLE guest_sessions
ALTER COLUMN guest_phone DROP NOT NULL;

-- 2. Add channel column to goconcierge_messages
ALTER TABLE goconcierge_messages
ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'whatsapp';

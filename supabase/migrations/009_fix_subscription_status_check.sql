-- Fix: drop and recreate the subscription_status CHECK constraint.
-- The original migration (005) used ADD COLUMN IF NOT EXISTS which may have
-- skipped the CHECK if the column already existed.  This ensures the
-- constraint matches the application code.

ALTER TABLE organizations DROP CONSTRAINT IF EXISTS organizations_subscription_status_check;

ALTER TABLE organizations ADD CONSTRAINT organizations_subscription_status_check
  CHECK (subscription_status IN ('trialing', 'active', 'cancelled', 'churned'));

-- Ensure the column default is set correctly
ALTER TABLE organizations ALTER COLUMN subscription_status SET DEFAULT 'trialing';

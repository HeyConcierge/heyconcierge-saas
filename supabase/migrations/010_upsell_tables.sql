-- Migration 010: Upsell tables for automated guest offer engine
-- Creates upsell_configs (per-property settings) and upsell_offers (individual offers)

-- upsell_configs: per-property configuration for each offer type
CREATE TABLE IF NOT EXISTS upsell_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT false,

  -- Late checkout
  late_checkout_enabled BOOLEAN NOT NULL DEFAULT false,
  late_checkout_price_per_hour NUMERIC NOT NULL DEFAULT 15,
  late_checkout_max_hours INTEGER NOT NULL DEFAULT 3,
  late_checkout_standard_time TEXT NOT NULL DEFAULT '11:00',
  late_checkout_send_hours_before INTEGER NOT NULL DEFAULT 12,

  -- Early check-in
  early_checkin_enabled BOOLEAN NOT NULL DEFAULT false,
  early_checkin_price_per_hour NUMERIC NOT NULL DEFAULT 15,
  early_checkin_max_hours INTEGER NOT NULL DEFAULT 3,
  early_checkin_standard_time TEXT NOT NULL DEFAULT '15:00',
  early_checkin_send_hours_before INTEGER NOT NULL DEFAULT 24,

  -- Gap night
  gap_night_enabled BOOLEAN NOT NULL DEFAULT false,
  gap_night_discount_pct NUMERIC NOT NULL DEFAULT 20,
  gap_night_base_price NUMERIC NOT NULL DEFAULT 100,
  gap_night_max_gap INTEGER NOT NULL DEFAULT 3,
  gap_night_send_days_before INTEGER NOT NULL DEFAULT 2,

  -- Stay extension
  stay_extension_enabled BOOLEAN NOT NULL DEFAULT false,
  stay_extension_discount_pct NUMERIC NOT NULL DEFAULT 10,
  stay_extension_send_hours_before INTEGER NOT NULL DEFAULT 24,

  -- Review request
  review_request_enabled BOOLEAN NOT NULL DEFAULT false,
  review_request_send_hours_after INTEGER NOT NULL DEFAULT 6,
  review_request_platform_urls JSONB DEFAULT '{}',

  -- General settings
  auto_send BOOLEAN NOT NULL DEFAULT true,
  message_language TEXT NOT NULL DEFAULT 'en',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(property_id)
);

-- upsell_offers: individual offers sent to guests
CREATE TABLE IF NOT EXISTS upsell_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  offer_type TEXT NOT NULL CHECK (offer_type IN ('late_checkout', 'early_checkin', 'gap_night', 'stay_extension', 'review_request')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'draft', 'sent', 'accepted', 'declined', 'expired')),
  price NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  offer_details JSONB DEFAULT '{}',
  guest_phone TEXT,
  channel TEXT DEFAULT 'telegram' CHECK (channel IN ('whatsapp', 'telegram')),
  message_text TEXT,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  guest_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_upsell_configs_property ON upsell_configs(property_id);
CREATE INDEX IF NOT EXISTS idx_upsell_offers_property ON upsell_offers(property_id);
CREATE INDEX IF NOT EXISTS idx_upsell_offers_status ON upsell_offers(status);
CREATE INDEX IF NOT EXISTS idx_upsell_offers_guest ON upsell_offers(guest_phone, status);
CREATE INDEX IF NOT EXISTS idx_upsell_offers_scheduled ON upsell_offers(status, scheduled_at)
  WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_upsell_offers_booking ON upsell_offers(booking_id, offer_type);

-- Timestamp trigger for upsell_configs
CREATE TRIGGER update_upsell_configs_updated_at
  BEFORE UPDATE ON upsell_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

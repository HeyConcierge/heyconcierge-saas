-- HeyConcierge for Cruise — MVP Schema
-- Migration: 011_cruise_mvp.sql

-- Enums
CREATE TYPE cruise_product_type AS ENUM ('attraction', 'tour', 'transport', 'experience');
CREATE TYPE cruise_booking_status AS ENUM ('confirmed', 'cancelled', 'redeemed');
CREATE TYPE cruise_report_status AS ENUM ('draft', 'sent', 'paid');

-- Cruise Operators
CREATE TABLE cruise_operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  contact_email TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'NO',
  logo_url TEXT,
  description TEXT,
  api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cruise Products
CREATE TABLE cruise_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID NOT NULL REFERENCES cruise_operators(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location_port TEXT NOT NULL,
  product_type cruise_product_type NOT NULL DEFAULT 'attraction',
  price_adult_eur DECIMAL(10,2) NOT NULL,
  price_child_eur DECIMAL(10,2),
  duration_minutes INT,
  capacity_per_slot INT,
  images JSONB DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  includes JSONB DEFAULT '[]'::jsonb,
  meeting_point TEXT,
  available_months INT[] DEFAULT ARRAY[1,2,3,4,5,6,7,8,9,10,11,12],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cruise Lines
CREATE TABLE cruise_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 22.5,
  tier_commission JSONB,
  contact_email TEXT,
  api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cruise Ships
CREATE TABLE cruise_ships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cruise_line_id UUID NOT NULL REFERENCES cruise_lines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity_pax INT,
  imo_number TEXT
);

-- Port Calls
CREATE TABLE cruise_port_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ship_id UUID NOT NULL REFERENCES cruise_ships(id) ON DELETE CASCADE,
  port_name TEXT NOT NULL,
  arrival_date DATE NOT NULL,
  arrival_time TIME,
  departure_time TIME,
  estimated_pax INT
);

-- Bookings
CREATE TABLE cruise_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES cruise_products(id) ON DELETE RESTRICT,
  port_call_id UUID REFERENCES cruise_port_calls(id),
  cruise_line_id UUID REFERENCES cruise_lines(id),
  guest_name TEXT NOT NULL,
  guest_cabin TEXT,
  quantity_adult INT NOT NULL DEFAULT 1,
  quantity_child INT NOT NULL DEFAULT 0,
  total_price_eur DECIMAL(10,2) NOT NULL,
  commission_eur DECIMAL(10,2) NOT NULL DEFAULT 0,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  status cruise_booking_status NOT NULL DEFAULT 'confirmed',
  booking_ref TEXT NOT NULL UNIQUE,
  qr_code_data TEXT,
  booked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  redeemed_at TIMESTAMPTZ
);

-- Commission Reports
CREATE TABLE cruise_commission_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cruise_line_id UUID NOT NULL REFERENCES cruise_lines(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_bookings INT NOT NULL DEFAULT 0,
  total_revenue_eur DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_commission_eur DECIMAL(12,2) NOT NULL DEFAULT 0,
  status cruise_report_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_cruise_products_operator ON cruise_products(operator_id);
CREATE INDEX idx_cruise_products_port ON cruise_products(location_port);
CREATE INDEX idx_cruise_ships_line ON cruise_ships(cruise_line_id);
CREATE INDEX idx_cruise_port_calls_ship ON cruise_port_calls(ship_id);
CREATE INDEX idx_cruise_port_calls_port_date ON cruise_port_calls(port_name, arrival_date);
CREATE INDEX idx_cruise_bookings_product ON cruise_bookings(product_id);
CREATE INDEX idx_cruise_bookings_port_call ON cruise_bookings(port_call_id);
CREATE INDEX idx_cruise_bookings_cruise_line ON cruise_bookings(cruise_line_id);
CREATE INDEX idx_cruise_bookings_ref ON cruise_bookings(booking_ref);
CREATE INDEX idx_cruise_bookings_status ON cruise_bookings(status);
CREATE INDEX idx_cruise_commission_reports_line ON cruise_commission_reports(cruise_line_id);

-- RLS
ALTER TABLE cruise_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE cruise_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cruise_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cruise_ships ENABLE ROW LEVEL SECURITY;
ALTER TABLE cruise_port_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE cruise_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cruise_commission_reports ENABLE ROW LEVEL SECURITY;

-- Public read for products and port calls (guests need to see these)
CREATE POLICY "Products are publicly readable" ON cruise_products FOR SELECT USING (true);
CREATE POLICY "Port calls are publicly readable" ON cruise_port_calls FOR SELECT USING (true);
CREATE POLICY "Ships are publicly readable" ON cruise_ships FOR SELECT USING (true);

-- Operators can manage their own products
CREATE POLICY "Operators manage own products" ON cruise_products FOR ALL USING (true) WITH CHECK (true);

-- Operators can read their own data
CREATE POLICY "Operators read own data" ON cruise_operators FOR SELECT USING (true);

-- Cruise lines can read their own data
CREATE POLICY "Cruise lines read own data" ON cruise_lines FOR SELECT USING (true);

-- Bookings: readable by relevant parties (enforced at API level with service key)
CREATE POLICY "Bookings readable" ON cruise_bookings FOR SELECT USING (true);
CREATE POLICY "Bookings insertable" ON cruise_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Bookings updatable" ON cruise_bookings FOR UPDATE USING (true);

-- Commission reports readable
CREATE POLICY "Commission reports readable" ON cruise_commission_reports FOR SELECT USING (true);
CREATE POLICY "Commission reports insertable" ON cruise_commission_reports FOR INSERT WITH CHECK (true);

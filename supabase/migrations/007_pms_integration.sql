-- PMS Integration Tables
-- HeyConcierge SaaS

-- ─── PMS Connections ─────────────────────────────────────────────────
-- Stores connection credentials for each org's PMS provider

CREATE TABLE IF NOT EXISTS pms_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('hostaway', 'guesty', 'smoobu', 'lodgify', 'beds24')),
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
  
  -- Credentials (encrypted at app level before storage)
  api_key_encrypted TEXT,
  client_id TEXT,
  client_secret TEXT,
  access_token TEXT,
  refresh_token TEXT,
  account_id TEXT,
  
  -- Sync metadata
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_interval_minutes INTEGER DEFAULT 60,
  webhook_secret TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One active connection per provider per org
  UNIQUE(organization_id, provider)
);

CREATE INDEX idx_pms_connections_org ON pms_connections(organization_id);
CREATE INDEX idx_pms_connections_status ON pms_connections(status) WHERE status = 'active';

-- ─── PMS Property Mappings ───────────────────────────────────────────
-- Links HC properties to their external PMS property IDs

CREATE TABLE IF NOT EXISTS pms_property_mappings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hc_property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  pms_provider TEXT NOT NULL CHECK (pms_provider IN ('hostaway', 'guesty', 'smoobu', 'lodgify', 'beds24')),
  external_property_id TEXT NOT NULL,
  external_property_name TEXT,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- One mapping per provider per external ID
  UNIQUE(pms_provider, external_property_id)
);

CREATE INDEX idx_pms_mappings_property ON pms_property_mappings(hc_property_id);
CREATE INDEX idx_pms_mappings_external ON pms_property_mappings(pms_provider, external_property_id);

-- ─── PMS Sync Log ────────────────────────────────────────────────────
-- Audit trail for all sync operations

CREATE TABLE IF NOT EXISTS pms_sync_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID NOT NULL REFERENCES pms_connections(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('properties', 'bookings', 'guests')),
  status TEXT NOT NULL CHECK (status IN ('success', 'partial', 'error')),
  records_synced INTEGER DEFAULT 0,
  errors JSONB,
  
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pms_sync_log_connection ON pms_sync_log(connection_id, created_at DESC);

-- ─── RLS Policies ────────────────────────────────────────────────────

ALTER TABLE pms_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE pms_property_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pms_sync_log ENABLE ROW LEVEL SECURITY;

-- Connections: org owners only
CREATE POLICY "Users manage own org PMS connections" ON pms_connections
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

-- Mappings: org owners only
CREATE POLICY "Users manage own org PMS mappings" ON pms_property_mappings
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

-- Sync log: read via connection ownership
CREATE POLICY "Users view own sync logs" ON pms_sync_log
  FOR SELECT USING (
    connection_id IN (
      SELECT id FROM pms_connections WHERE organization_id IN (
        SELECT id FROM organizations WHERE owner_id = auth.uid()
      )
    )
  );

-- ─── Updated_at triggers ─────────────────────────────────────────────

CREATE TRIGGER update_pms_connections_updated_at
  BEFORE UPDATE ON pms_connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_pms_mappings_updated_at
  BEFORE UPDATE ON pms_property_mappings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

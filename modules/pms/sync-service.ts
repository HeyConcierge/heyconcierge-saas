// PMS Sync Service — Orchestrates syncing from PMS providers to Supabase
// Handles property/booking sync, field mapping, conflict resolution, and logging

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  PmsProvider,
  PmsProviderName,
  PmsConnectionConfig,
  Property,
  Booking,
  SyncResult,
  SyncError,
} from './types';
import { createProvider } from './index';

export class PmsSyncService {
  private supabase: SupabaseClient;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = createClient(
      supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // ─── Full sync for a connection ────────────────────────────────────

  async syncConnection(connectionId: string): Promise<SyncResult[]> {
    const { data: connection, error } = await this.supabase
      .from('pms_connections')
      .select('*')
      .eq('id', connectionId)
      .single();

    if (error || !connection) {
      throw new Error(`Connection not found: ${connectionId}`);
    }

    const config: PmsConnectionConfig = {
      provider: connection.provider,
      apiKey: connection.api_key_encrypted, // In prod, decrypt first
      clientId: connection.client_id,
      clientSecret: connection.client_secret,
      accessToken: connection.access_token,
      refreshToken: connection.refresh_token,
      accountId: connection.account_id,
    };

    const provider = createProvider(config);
    const results: SyncResult[] = [];

    // Sync properties
    const propResult = await this.syncProperties(
      provider,
      connection.organization_id,
      connectionId
    );
    results.push(propResult);

    // Sync bookings for each mapped property
    const { data: mappings } = await this.supabase
      .from('pms_property_mappings')
      .select('*')
      .eq('pms_provider', connection.provider)
      .eq('organization_id', connection.organization_id);

    if (mappings) {
      const bookingResult = await this.syncAllBookings(
        provider,
        mappings,
        connectionId
      );
      results.push(bookingResult);
    }

    // Update last_sync
    await this.supabase
      .from('pms_connections')
      .update({ last_sync: new Date().toISOString(), status: 'active' })
      .eq('id', connectionId);

    return results;
  }

  // ─── Property Sync ─────────────────────────────────────────────────

  async syncProperties(
    provider: PmsProvider,
    organizationId: string,
    connectionId: string
  ): Promise<SyncResult> {
    const startedAt = new Date().toISOString();
    const errors: SyncError[] = [];
    let synced = 0;

    try {
      const properties = await provider.syncProperties();

      for (const prop of properties) {
        try {
          await this.upsertProperty(prop, organizationId, provider.name as PmsProviderName);
          synced++;
        } catch (err) {
          errors.push({
            externalId: prop.externalId,
            message: err instanceof Error ? err.message : String(err),
          });
        }
      }
    } catch (err) {
      errors.push({
        message: `Property sync failed: ${err instanceof Error ? err.message : String(err)}`,
      });
    }

    const result: SyncResult = {
      provider: provider.name as PmsProviderName,
      syncType: 'properties',
      status: errors.length === 0 ? 'success' : synced > 0 ? 'partial' : 'error',
      recordsSynced: synced,
      errors,
      startedAt,
      completedAt: new Date().toISOString(),
    };

    await this.logSync(connectionId, result);
    return result;
  }

  // ─── Booking Sync ──────────────────────────────────────────────────

  async syncAllBookings(
    provider: PmsProvider,
    mappings: Array<{
      hc_property_id: string;
      external_property_id: string;
    }>,
    connectionId: string
  ): Promise<SyncResult> {
    const startedAt = new Date().toISOString();
    const errors: SyncError[] = [];
    let synced = 0;

    for (const mapping of mappings) {
      try {
        const bookings = await provider.syncBookings(mapping.external_property_id);

        for (const booking of bookings) {
          try {
            await this.upsertBooking(booking, mapping.hc_property_id);
            synced++;
          } catch (err) {
            errors.push({
              externalId: booking.externalId,
              message: err instanceof Error ? err.message : String(err),
            });
          }
        }
      } catch (err) {
        errors.push({
          externalId: mapping.external_property_id,
          message: `Booking sync for property failed: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
    }

    const result: SyncResult = {
      provider: provider.name as PmsProviderName,
      syncType: 'bookings',
      status: errors.length === 0 ? 'success' : synced > 0 ? 'partial' : 'error',
      recordsSynced: synced,
      errors,
      startedAt,
      completedAt: new Date().toISOString(),
    };

    await this.logSync(connectionId, result);
    return result;
  }

  // ─── Upsert helpers ────────────────────────────────────────────────

  private async upsertProperty(
    prop: Property,
    organizationId: string,
    provider: PmsProviderName
  ): Promise<void> {
    // Check if mapping exists
    const { data: existing } = await this.supabase
      .from('pms_property_mappings')
      .select('hc_property_id')
      .eq('pms_provider', provider)
      .eq('external_property_id', prop.externalId)
      .maybeSingle();

    if (existing?.hc_property_id) {
      // Update existing property
      await this.supabase
        .from('properties')
        .update({
          name: prop.name,
          images: prop.images,
          ical_url: prop.icalUrl,
        })
        .eq('id', existing.hc_property_id);
    } else {
      // Create new property + mapping
      const { data: newProp, error } = await this.supabase
        .from('properties')
        .insert({
          organization_id: organizationId,
          name: prop.name,
          images: prop.images,
          ical_url: prop.icalUrl,
        })
        .select('id')
        .single();

      if (error || !newProp) {
        throw new Error(`Failed to create property: ${error?.message}`);
      }

      await this.supabase.from('pms_property_mappings').insert({
        hc_property_id: newProp.id,
        pms_provider: provider,
        external_property_id: prop.externalId,
        external_property_name: prop.name,
        organization_id: organizationId,
      });
    }
  }

  private async upsertBooking(booking: Booking, hcPropertyId: string): Promise<void> {
    // Upsert by property_id + booking_reference + platform to handle duplicates
    const { error } = await this.supabase.from('bookings').upsert(
      {
        property_id: hcPropertyId,
        guest_name: booking.guestName,
        guest_phone: booking.guestPhone,
        check_in_date: booking.checkInDate,
        check_out_date: booking.checkOutDate,
        platform: this.mapPlatform(booking.platform),
        booking_reference: booking.bookingReference || booking.externalId,
        status: booking.status,
        notes: booking.notes,
      },
      {
        onConflict: 'property_id,booking_reference,platform',
      }
    );

    if (error) {
      throw new Error(`Booking upsert failed: ${error.message}`);
    }
  }

  /**
   * Map PMS platform names to the enum in our bookings table
   */
  private mapPlatform(platform?: string): string {
    if (!platform) return 'other';
    const p = platform.toLowerCase();
    if (p.includes('airbnb')) return 'airbnb';
    if (p.includes('booking')) return 'booking';
    return 'other';
  }

  // ─── Sync Logging ─────────────────────────────────────────────────

  private async logSync(connectionId: string, result: SyncResult): Promise<void> {
    await this.supabase.from('pms_sync_log').insert({
      connection_id: connectionId,
      sync_type: result.syncType,
      status: result.status,
      records_synced: result.recordsSynced,
      errors: result.errors.length > 0 ? JSON.stringify(result.errors) : null,
      started_at: result.startedAt,
      completed_at: result.completedAt,
    });
  }
}

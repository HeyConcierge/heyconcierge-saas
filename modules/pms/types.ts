// PMS Integration Layer — Shared Types
// HeyConcierge SaaS

// ─── Core Domain Types ───────────────────────────────────────────────

export interface Property {
  externalId: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  propertyType?: string;
  icalUrl?: string;
  rawData?: Record<string, unknown>;
}

export interface Booking {
  externalId: string;
  propertyExternalId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  platform?: string;
  bookingReference?: string;
  totalPrice?: number;
  currency?: string;
  numberOfGuests?: number;
  notes?: string;
  rawData?: Record<string, unknown>;
}

export interface Guest {
  externalId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  language?: string;
  country?: string;
  rawData?: Record<string, unknown>;
}

// ─── Provider Interface ──────────────────────────────────────────────

export interface PmsProvider {
  name: string;
  syncProperties(): Promise<Property[]>;
  syncBookings(propertyId: string): Promise<Booking[]>;
  syncGuests(bookingId: string): Promise<Guest[]>;
  getProperty(externalId: string): Promise<Property>;
  webhookHandler?(payload: unknown): Promise<void>;
}

// ─── Connection / Config Types ───────────────────────────────────────

export type PmsProviderName = 'hostaway' | 'guesty' | 'smoobu' | 'lodgify' | 'beds24';

export interface PmsConnectionConfig {
  provider: PmsProviderName;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  accountId?: string;
}

export interface PmsConnection {
  id: string;
  organizationId: string;
  provider: PmsProviderName;
  status: 'active' | 'inactive' | 'error';
  lastSync?: string;
  config: PmsConnectionConfig;
}

// ─── Sync Types ──────────────────────────────────────────────────────

export interface SyncResult {
  provider: PmsProviderName;
  syncType: 'properties' | 'bookings' | 'guests';
  status: 'success' | 'partial' | 'error';
  recordsSynced: number;
  errors: SyncError[];
  startedAt: string;
  completedAt: string;
}

export interface SyncError {
  externalId?: string;
  message: string;
  code?: string;
}

// ─── Webhook Types ───────────────────────────────────────────────────

export interface WebhookEvent {
  provider: PmsProviderName;
  eventType: string;
  payload: unknown;
  receivedAt: string;
}

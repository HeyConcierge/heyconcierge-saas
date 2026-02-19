// Hostaway PMS Integration
// API Docs: https://api.hostaway.com/documentation
// Auth: OAuth2 client_credentials → Bearer token
// Rate limit: 15 req/10s per IP, 20 req/10s per account

import { Property, Booking, Guest } from './types';
import { BasePmsProvider, PmsApiError } from './base-provider';

interface HostawayTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface HostawayResponse<T> {
  status: string;
  result: T;
  count?: number;
  limit?: number;
  offset?: number;
}

interface HostawayListing {
  id: number;
  name: string;
  address: string;
  city: string;
  countryCode: string;
  lat: number;
  lng: number;
  picture: string;
  thumbnailUrl: string;
  bedrooms: number;
  bathrooms: number;
  personCapacity: number;
  propertyTypeId: number;
  listingImages?: { url: string }[];
}

interface HostawayReservation {
  id: number;
  listingMapId: number;
  channelId: number;
  channelName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  arrivalDate: string;
  departureDate: string;
  status: string;
  hostNote: string;
  totalPrice: number;
  currency: string;
  numberOfGuests: number;
  channelReservationId: string;
}

export class HostawayProvider extends BasePmsProvider {
  name = 'hostaway';

  private accountId: string;
  private clientId: string;
  private clientSecret: string;
  private tokenExpiresAt = 0;

  constructor(config: {
    accountId: string;
    clientId: string;
    clientSecret: string;
  }) {
    super('https://api.hostaway.com/v1', {}, { maxRequests: 14, windowMs: 10_000 });
    this.accountId = config.accountId;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
  }

  private async ensureToken(): Promise<void> {
    if (Date.now() < this.tokenExpiresAt) return;

    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: 'general',
    });

    const res = await fetch('https://api.hostaway.com/v1/accessTokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      throw new PmsApiError('Hostaway auth failed', res.status, await res.text());
    }

    const data = (await res.json()) as HostawayTokenResponse;
    this.headers['Authorization'] = `Bearer ${data.access_token}`;
    this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  }

  async syncProperties(): Promise<Property[]> {
    await this.ensureToken();
    const data = await this.get<HostawayResponse<HostawayListing[]>>('/listings', {
      limit: '100',
      offset: '0',
    });

    return data.result.map((l) => this.mapProperty(l));
  }

  async getProperty(externalId: string): Promise<Property> {
    await this.ensureToken();
    const data = await this.get<HostawayResponse<HostawayListing>>(
      `/listings/${externalId}`
    );
    return this.mapProperty(data.result);
  }

  async syncBookings(propertyId: string): Promise<Booking[]> {
    await this.ensureToken();
    const data = await this.get<HostawayResponse<HostawayReservation[]>>(
      '/reservations',
      { listingId: propertyId, limit: '100', offset: '0', includeResources: '1' }
    );

    return data.result.map((r) => this.mapBooking(r));
  }

  async syncGuests(bookingId: string): Promise<Guest[]> {
    await this.ensureToken();
    const data = await this.get<HostawayResponse<HostawayReservation>>(
      `/reservations/${bookingId}`
    );

    const r = data.result;
    if (!r.guestName) return [];

    const [firstName, ...rest] = r.guestName.split(' ');
    return [
      {
        externalId: `hostaway-guest-${r.id}`,
        firstName,
        lastName: rest.join(' ') || '',
        email: r.guestEmail,
        phone: r.guestPhone,
      },
    ];
  }

  async webhookHandler(payload: Record<string, unknown>): Promise<void> {
    // Hostaway webhook events: reservationCreated, reservationUpdated,
    // reservationCancelled, listingUpdated, etc.
    // The caller (webhook route) should parse event type and call appropriate sync
    const event = payload.event as string;
    console.log(`[Hostaway] Webhook event: ${event}`, JSON.stringify(payload).slice(0, 200));
  }

  // ─── Mappers ────────────────────────────────────────────────────────

  private mapProperty(l: HostawayListing): Property {
    return {
      externalId: String(l.id),
      name: l.name,
      address: l.address,
      city: l.city,
      country: l.countryCode,
      latitude: l.lat,
      longitude: l.lng,
      images: l.listingImages?.map((i) => i.url) || (l.picture ? [l.picture] : []),
      bedrooms: l.bedrooms,
      bathrooms: l.bathrooms,
      maxGuests: l.personCapacity,
      propertyType: String(l.propertyTypeId),
      rawData: l as unknown as Record<string, unknown>,
    };
  }

  private mapBooking(r: HostawayReservation): Booking {
    return {
      externalId: String(r.id),
      propertyExternalId: String(r.listingMapId),
      guestName: r.guestName,
      guestEmail: r.guestEmail,
      guestPhone: r.guestPhone,
      checkInDate: r.arrivalDate,
      checkOutDate: r.departureDate,
      status: this.mapStatus(r.status),
      platform: r.channelName?.toLowerCase() || 'hostaway',
      bookingReference: r.channelReservationId,
      totalPrice: r.totalPrice,
      currency: r.currency,
      numberOfGuests: r.numberOfGuests,
      notes: r.hostNote,
      rawData: r as unknown as Record<string, unknown>,
    };
  }

  private mapStatus(s: string): Booking['status'] {
    const map: Record<string, Booking['status']> = {
      new: 'confirmed',
      confirmed: 'confirmed',
      modified: 'confirmed',
      cancelled: 'cancelled',
      completed: 'completed',
      pending: 'pending',
    };
    return map[s] || 'confirmed';
  }
}

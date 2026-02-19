// Guesty PMS Integration
// API Docs: https://open-api-docs.guesty.com
// Auth: OAuth2 client_credentials → Bearer token
// Base URL: https://open-api.guesty.com/v1

import { Property, Booking, Guest } from './types';
import { BasePmsProvider, PmsApiError } from './base-provider';

interface GuestyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface GuestyListing {
  _id: string;
  title: string;
  nickname?: string;
  address: {
    full?: string;
    street?: string;
    city?: string;
    country?: string;
    lat?: number;
    lng?: number;
  };
  pictures?: { original: string; caption?: string }[];
  bedrooms?: number;
  bathrooms?: number;
  accommodates?: number;
  propertyType?: string;
}

interface GuestyReservation {
  _id: string;
  listingId: string;
  confirmationCode?: string;
  checkInDateLocalized: string;
  checkOutDateLocalized: string;
  status: string;
  source?: string;
  money?: {
    totalPaid?: number;
    currency?: string;
  };
  guestsCount?: number;
  guest: {
    _id: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  note?: string;
}

interface GuestyListResponse<T> {
  results: T[];
  count: number;
  limit: number;
  skip: number;
}

export class GuestyProvider extends BasePmsProvider {
  name = 'guesty';

  private clientId: string;
  private clientSecret: string;
  private tokenExpiresAt = 0;

  constructor(config: { clientId: string; clientSecret: string }) {
    super('https://open-api.guesty.com/v1', {});
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
  }

  private async ensureToken(): Promise<void> {
    if (Date.now() < this.tokenExpiresAt) return;

    const res = await fetch('https://open-api.guesty.com/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }).toString(),
    });

    if (!res.ok) {
      throw new PmsApiError('Guesty auth failed', res.status, await res.text());
    }

    const data = (await res.json()) as GuestyTokenResponse;
    this.headers['Authorization'] = `Bearer ${data.access_token}`;
    this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  }

  async syncProperties(): Promise<Property[]> {
    await this.ensureToken();
    const data = await this.get<GuestyListResponse<GuestyListing>>('/listings', {
      limit: '100',
      skip: '0',
    });
    return data.results.map((l) => this.mapProperty(l));
  }

  async getProperty(externalId: string): Promise<Property> {
    await this.ensureToken();
    const data = await this.get<GuestyListing>(`/listings/${externalId}`);
    return this.mapProperty(data);
  }

  async syncBookings(propertyId: string): Promise<Booking[]> {
    await this.ensureToken();
    const data = await this.get<GuestyListResponse<GuestyReservation>>(
      '/reservations',
      {
        listingId: propertyId,
        limit: '100',
        skip: '0',
      }
    );
    return data.results.map((r) => this.mapBooking(r));
  }

  async syncGuests(bookingId: string): Promise<Guest[]> {
    await this.ensureToken();
    const data = await this.get<GuestyReservation>(`/reservations/${bookingId}`);
    const g = data.guest;
    if (!g) return [];

    return [
      {
        externalId: g._id,
        firstName: g.firstName || g.fullName?.split(' ')[0] || '',
        lastName: g.lastName || g.fullName?.split(' ').slice(1).join(' ') || '',
        email: g.email,
        phone: g.phone,
      },
    ];
  }

  async webhookHandler(payload: Record<string, unknown>): Promise<void> {
    // Guesty webhooks: reservation.created, reservation.updated,
    // reservation.cancelled, listing.updated
    const event = payload.event as string;
    console.log(`[Guesty] Webhook: ${event}`, JSON.stringify(payload).slice(0, 200));
  }

  private mapProperty(l: GuestyListing): Property {
    return {
      externalId: l._id,
      name: l.title || l.nickname || '',
      address: l.address?.full || l.address?.street,
      city: l.address?.city,
      country: l.address?.country,
      latitude: l.address?.lat,
      longitude: l.address?.lng,
      images: l.pictures?.map((p) => p.original) || [],
      bedrooms: l.bedrooms,
      bathrooms: l.bathrooms,
      maxGuests: l.accommodates,
      propertyType: l.propertyType,
      rawData: l as unknown as Record<string, unknown>,
    };
  }

  private mapBooking(r: GuestyReservation): Booking {
    return {
      externalId: r._id,
      propertyExternalId: r.listingId,
      guestName: r.guest?.fullName || `${r.guest?.firstName || ''} ${r.guest?.lastName || ''}`.trim() || 'Unknown',
      guestEmail: r.guest?.email,
      guestPhone: r.guest?.phone,
      checkInDate: r.checkInDateLocalized,
      checkOutDate: r.checkOutDateLocalized,
      status: this.mapStatus(r.status),
      platform: r.source?.toLowerCase() || 'guesty',
      bookingReference: r.confirmationCode,
      totalPrice: r.money?.totalPaid,
      currency: r.money?.currency,
      numberOfGuests: r.guestsCount,
      notes: r.note,
      rawData: r as unknown as Record<string, unknown>,
    };
  }

  private mapStatus(s: string): Booking['status'] {
    const map: Record<string, Booking['status']> = {
      confirmed: 'confirmed',
      reserved: 'confirmed',
      checked_in: 'confirmed',
      checked_out: 'completed',
      canceled: 'cancelled',
      cancelled: 'cancelled',
      inquiry: 'pending',
    };
    return map[s] || 'confirmed';
  }
}

// Beds24 PMS Integration
// API Docs: https://beds24.com/api/v2 (Swagger)
// Auth: token header (long-life or refresh-based)
// Base URL: https://beds24.com/api/v2

import { Property, Booking, Guest } from './types';
import { BasePmsProvider, PmsApiError } from './base-provider';

interface Beds24Property {
  id: number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  maxGuests?: number;
  checkInTime?: string;
  checkOutTime?: string;
}

interface Beds24Booking {
  id: number;
  propertyId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  arrival: string;
  departure: string;
  status: string;
  referer?: string;
  price?: number;
  currency?: string;
  numAdult?: number;
  numChild?: number;
  notes?: string;
  bookId?: string;
}

interface Beds24AuthResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export class Beds24Provider extends BasePmsProvider {
  name = 'beds24';

  private refreshToken?: string;
  private tokenExpiresAt = 0;

  constructor(config: { token: string; refreshToken?: string }) {
    super('https://beds24.com/api/v2', {
      token: config.token,
    });
    this.refreshToken = config.refreshToken;
  }

  private async ensureToken(): Promise<void> {
    if (!this.refreshToken || Date.now() < this.tokenExpiresAt) return;

    const res = await fetch('https://beds24.com/api/v2/authentication/token', {
      method: 'GET',
      headers: {
        refreshToken: this.refreshToken,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new PmsApiError('Beds24 auth refresh failed', res.status, await res.text());
    }

    const data = (await res.json()) as Beds24AuthResponse;
    this.headers['token'] = data.token;
    this.tokenExpiresAt = Date.now() + ((data.expiresIn || 86400) - 300) * 1000;
  }

  async syncProperties(): Promise<Property[]> {
    await this.ensureToken();
    const data = await this.get<Beds24Property[]>('/properties');
    return (Array.isArray(data) ? data : []).map((p) => this.mapProperty(p));
  }

  async getProperty(externalId: string): Promise<Property> {
    await this.ensureToken();
    const data = await this.get<Beds24Property[]>('/properties', { id: externalId });
    const prop = Array.isArray(data) ? data[0] : data;
    if (!prop) throw new PmsApiError('Property not found', 404, '');
    return this.mapProperty(prop as Beds24Property);
  }

  async syncBookings(propertyId: string): Promise<Booking[]> {
    await this.ensureToken();
    const data = await this.get<Beds24Booking[]>('/bookings', {
      propertyId,
      includeInvoiceItems: 'false',
    });
    return (Array.isArray(data) ? data : []).map((b) => this.mapBooking(b));
  }

  async syncGuests(bookingId: string): Promise<Guest[]> {
    await this.ensureToken();
    const data = await this.get<Beds24Booking[]>('/bookings', { id: bookingId });
    const b = Array.isArray(data) ? data[0] : null;
    if (!b || (!b.firstName && !b.lastName)) return [];

    return [
      {
        externalId: `beds24-guest-${b.id}`,
        firstName: b.firstName || '',
        lastName: b.lastName || '',
        email: b.email,
        phone: b.phone,
      },
    ];
  }

  async webhookHandler(payload: Record<string, unknown>): Promise<void> {
    // Beds24 booking webhook: configured per-property in Settings → Properties → Access
    const bookingId = payload.bookingId as string;
    console.log(`[Beds24] Webhook for booking ${bookingId}`, JSON.stringify(payload).slice(0, 200));
  }

  private mapProperty(p: Beds24Property): Property {
    return {
      externalId: String(p.id),
      name: p.name,
      address: p.address,
      city: p.city,
      country: p.country,
      latitude: p.latitude,
      longitude: p.longitude,
      images: [],
      maxGuests: p.maxGuests,
      rawData: p as unknown as Record<string, unknown>,
    };
  }

  private mapBooking(b: Beds24Booking): Booking {
    const guestName = [b.firstName, b.lastName].filter(Boolean).join(' ') || 'Unknown';
    return {
      externalId: String(b.id),
      propertyExternalId: String(b.propertyId),
      guestName,
      guestEmail: b.email,
      guestPhone: b.phone,
      checkInDate: b.arrival,
      checkOutDate: b.departure,
      status: this.mapStatus(b.status),
      platform: b.referer?.toLowerCase() || 'beds24',
      bookingReference: b.bookId,
      totalPrice: b.price,
      currency: b.currency,
      numberOfGuests: (b.numAdult || 0) + (b.numChild || 0) || undefined,
      notes: b.notes,
      rawData: b as unknown as Record<string, unknown>,
    };
  }

  private mapStatus(s: string): Booking['status'] {
    const map: Record<string, Booking['status']> = {
      confirmed: 'confirmed',
      new: 'confirmed',
      cancelled: 'cancelled',
      '0': 'cancelled',
      '1': 'confirmed',
    };
    return map[s?.toLowerCase()] || 'confirmed';
  }
}

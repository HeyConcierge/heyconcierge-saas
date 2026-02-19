// Lodgify PMS Integration
// API Docs: https://docs.lodgify.com
// Auth: X-ApiKey header
// Base URL: https://api.lodgify.com

import { Property, Booking, Guest } from './types';
import { BasePmsProvider } from './base-provider';

interface LodgifyProperty {
  id: number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  images?: { url: string }[];
  bedrooms?: number;
  bathrooms?: number;
  max_guests?: number;
  property_type?: { name: string };
}

interface LodgifyBooking {
  id: number;
  property_id: number;
  guest: {
    name: string;
    email?: string;
    phone?: string;
  };
  arrival: string;
  departure: string;
  status: string;
  source?: string;
  total_amount?: number;
  currency?: string;
  people?: number;
  notes?: string;
  booking_number?: string;
}

interface LodgifyListResponse<T> {
  items: T[];
  count: number;
  total_count: number;
}

export class LodgifyProvider extends BasePmsProvider {
  name = 'lodgify';

  constructor(config: { apiKey: string }) {
    super('https://api.lodgify.com', {
      'X-ApiKey': config.apiKey,
      Accept: 'application/json',
    });
  }

  async syncProperties(): Promise<Property[]> {
    const data = await this.get<LodgifyProperty[]>('/v2/properties', {
      includeCount: 'true',
      size: '50',
      page: '1',
    });

    // v2/properties returns array directly
    return (Array.isArray(data) ? data : []).map((p) => this.mapProperty(p));
  }

  async getProperty(externalId: string): Promise<Property> {
    const data = await this.get<LodgifyProperty>(`/v2/properties/${externalId}`);
    return this.mapProperty(data);
  }

  async syncBookings(propertyId: string): Promise<Booking[]> {
    const data = await this.get<LodgifyBooking[]>('/v2/reservations/bookings', {
      property_id: propertyId,
      size: '100',
      page: '1',
    });

    return (Array.isArray(data) ? data : []).map((b) => this.mapBooking(b));
  }

  async syncGuests(bookingId: string): Promise<Guest[]> {
    const data = await this.get<LodgifyBooking>(`/v2/reservations/bookings/${bookingId}`);
    if (!data.guest?.name) return [];
    const [firstName, ...rest] = data.guest.name.split(' ');
    return [
      {
        externalId: `lodgify-guest-${data.id}`,
        firstName,
        lastName: rest.join(' '),
        email: data.guest.email,
        phone: data.guest.phone,
      },
    ];
  }

  async webhookHandler(payload: Record<string, unknown>): Promise<void> {
    const event = payload.event_type as string;
    console.log(`[Lodgify] Webhook: ${event}`, JSON.stringify(payload).slice(0, 200));
  }

  private mapProperty(p: LodgifyProperty): Property {
    return {
      externalId: String(p.id),
      name: p.name,
      address: p.address,
      city: p.city,
      country: p.country,
      latitude: p.latitude,
      longitude: p.longitude,
      images: p.images?.map((i) => i.url) || (p.image_url ? [p.image_url] : []),
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      maxGuests: p.max_guests,
      propertyType: p.property_type?.name,
      rawData: p as unknown as Record<string, unknown>,
    };
  }

  private mapBooking(b: LodgifyBooking): Booking {
    return {
      externalId: String(b.id),
      propertyExternalId: String(b.property_id),
      guestName: b.guest?.name || 'Unknown',
      guestEmail: b.guest?.email,
      guestPhone: b.guest?.phone,
      checkInDate: b.arrival,
      checkOutDate: b.departure,
      status: this.mapStatus(b.status),
      platform: b.source?.toLowerCase() || 'lodgify',
      bookingReference: b.booking_number,
      totalPrice: b.total_amount,
      currency: b.currency,
      numberOfGuests: b.people,
      notes: b.notes,
      rawData: b as unknown as Record<string, unknown>,
    };
  }

  private mapStatus(s: string): Booking['status'] {
    const map: Record<string, Booking['status']> = {
      Booked: 'confirmed',
      Open: 'confirmed',
      Cancelled: 'cancelled',
      Declined: 'cancelled',
      CheckedOut: 'completed',
    };
    return map[s] || 'confirmed';
  }
}

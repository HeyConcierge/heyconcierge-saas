// Smoobu PMS Integration
// API Docs: https://docs.smoobu.com
// Auth: API-Key header
// Base URL: https://login.smoobu.com/api

import { Property, Booking, Guest } from './types';
import { BasePmsProvider } from './base-provider';

interface SmoobuApartment {
  id: number;
  name: string;
  location?: {
    street?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  rooms?: { maxOccupancy?: number; beds?: number };
  timeZone?: string;
  type?: { name?: string };
}

interface SmoobuBooking {
  id: number;
  apartment: { id: number; name: string };
  channel: { id: number; name: string };
  arrival: string;
  departure: string;
  'guest-name'?: string;
  email?: string;
  phone?: string;
  adults?: number;
  children?: number;
  notice?: string;
  price?: number;
  'price-paid'?: number;
  currency?: string;
  'reference-id'?: string;
  type?: string;
  'created-at'?: string;
  modifiedAt?: string;
  blocked?: boolean;
}

interface SmoobuBookingsResponse {
  page_count: number;
  page_size: number;
  total_items: number;
  page: number;
  bookings: SmoobuBooking[];
}

export class SmoobuProvider extends BasePmsProvider {
  name = 'smoobu';

  constructor(config: { apiKey: string }) {
    super('https://login.smoobu.com/api', {
      'Api-Key': config.apiKey,
      'Cache-Control': 'no-cache',
    });
  }

  async syncProperties(): Promise<Property[]> {
    const data = await this.get<{ apartments: Record<string, SmoobuApartment> }>(
      '/apartments'
    );
    return Object.values(data.apartments).map((a) => this.mapProperty(a));
  }

  async getProperty(externalId: string): Promise<Property> {
    const data = await this.get<SmoobuApartment>(`/apartments/${externalId}`);
    return this.mapProperty(data);
  }

  async syncBookings(propertyId: string): Promise<Booking[]> {
    const allBookings: Booking[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const data = await this.get<SmoobuBookingsResponse>('/reservations', {
        apartment_id: propertyId,
        page: String(page),
        pageSize: '100',
      });

      for (const b of data.bookings) {
        if (!b.blocked) {
          allBookings.push(this.mapBooking(b));
        }
      }

      hasMore = page < data.page_count;
      page++;
    }

    return allBookings;
  }

  async syncGuests(bookingId: string): Promise<Guest[]> {
    // Smoobu includes guest info in the booking itself
    const data = await this.get<SmoobuBooking>(`/reservations/${bookingId}`);
    const name = data['guest-name'] || '';
    const [firstName, ...rest] = name.split(' ');

    return name
      ? [
          {
            externalId: `smoobu-guest-${data.id}`,
            firstName,
            lastName: rest.join(' '),
            email: data.email,
            phone: data.phone,
          },
        ]
      : [];
  }

  async webhookHandler(payload: Record<string, unknown>): Promise<void> {
    // Smoobu webhook: sends booking updates to configured URL
    // action field: newReservation, modifiedReservation, cancelledReservation
    const action = payload.action as string;
    console.log(`[Smoobu] Webhook: ${action}`, JSON.stringify(payload).slice(0, 200));
  }

  private mapProperty(a: SmoobuApartment): Property {
    return {
      externalId: String(a.id),
      name: a.name,
      address: a.location?.street,
      city: a.location?.city,
      country: a.location?.country,
      latitude: a.location?.latitude,
      longitude: a.location?.longitude,
      images: [],
      maxGuests: a.rooms?.maxOccupancy,
      propertyType: a.type?.name,
      rawData: a as unknown as Record<string, unknown>,
    };
  }

  private mapBooking(b: SmoobuBooking): Booking {
    return {
      externalId: String(b.id),
      propertyExternalId: String(b.apartment.id),
      guestName: b['guest-name'] || 'Unknown',
      guestEmail: b.email,
      guestPhone: b.phone,
      checkInDate: b.arrival,
      checkOutDate: b.departure,
      status: b.type === 'cancellation' ? 'cancelled' : 'confirmed',
      platform: b.channel?.name?.toLowerCase() || 'smoobu',
      bookingReference: b['reference-id'],
      totalPrice: b.price,
      currency: b.currency,
      numberOfGuests: (b.adults || 0) + (b.children || 0) || undefined,
      notes: b.notice,
      rawData: b as unknown as Record<string, unknown>,
    };
  }
}

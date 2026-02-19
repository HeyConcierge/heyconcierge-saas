// Base provider with shared HTTP client, rate limiting, and error handling

import { PmsProvider, Property, Booking, Guest } from './types';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export abstract class BasePmsProvider implements PmsProvider {
  abstract name: string;

  protected baseUrl: string;
  protected headers: Record<string, string>;
  private requestTimestamps: number[] = [];
  private rateLimitConfig: RateLimitConfig;

  constructor(
    baseUrl: string,
    headers: Record<string, string>,
    rateLimit: RateLimitConfig = { maxRequests: 10, windowMs: 10_000 }
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.headers = { 'Content-Type': 'application/json', ...headers };
    this.rateLimitConfig = rateLimit;
  }

  // ─── Rate-limited HTTP client ─────────────────────────────────────

  protected async request<T = unknown>(
    method: string,
    path: string,
    body?: unknown,
    queryParams?: Record<string, string>
  ): Promise<T> {
    await this.waitForRateLimit();

    const url = new URL(`${this.baseUrl}${path}`);
    if (queryParams) {
      for (const [k, v] of Object.entries(queryParams)) {
        url.searchParams.set(k, v);
      }
    }

    const options: RequestInit = {
      method,
      headers: this.headers,
    };
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(url.toString(), options);

    if (res.status === 429) {
      const retryAfter = parseInt(res.headers.get('Retry-After') || '5', 10);
      await this.sleep(retryAfter * 1000);
      return this.request<T>(method, path, body, queryParams);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new PmsApiError(
        `${this.name} API error: ${res.status} ${res.statusText}`,
        res.status,
        text
      );
    }

    return res.json() as Promise<T>;
  }

  protected get<T = unknown>(path: string, params?: Record<string, string>) {
    return this.request<T>('GET', path, undefined, params);
  }

  protected post<T = unknown>(path: string, body?: unknown) {
    return this.request<T>('POST', path, body);
  }

  protected put<T = unknown>(path: string, body?: unknown) {
    return this.request<T>('PUT', path, body);
  }

  // ─── Rate limiter ─────────────────────────────────────────────────

  private async waitForRateLimit() {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(
      (t) => now - t < this.rateLimitConfig.windowMs
    );
    if (this.requestTimestamps.length >= this.rateLimitConfig.maxRequests) {
      const oldest = this.requestTimestamps[0];
      const waitMs = this.rateLimitConfig.windowMs - (now - oldest) + 50;
      await this.sleep(waitMs);
    }
    this.requestTimestamps.push(Date.now());
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ─── Abstract methods ─────────────────────────────────────────────

  abstract syncProperties(): Promise<Property[]>;
  abstract syncBookings(propertyId: string): Promise<Booking[]>;
  abstract syncGuests(bookingId: string): Promise<Guest[]>;
  abstract getProperty(externalId: string): Promise<Property>;
}

// ─── Error class ──────────────────────────────────────────────────────

export class PmsApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public responseBody: string
  ) {
    super(message);
    this.name = 'PmsApiError';
  }
}

// PMS Integration Layer — Entry point
// Re-exports all providers and types

export * from './types';
export { BasePmsProvider, PmsApiError } from './base-provider';
export { HostawayProvider } from './hostaway';
export { SmoobuProvider } from './smoobu';
export { LodgifyProvider } from './lodgify';
export { GuestyProvider } from './guesty';
export { Beds24Provider } from './beds24';
export { PmsSyncService } from './sync-service';

import { PmsProvider, PmsProviderName, PmsConnectionConfig } from './types';
import { HostawayProvider } from './hostaway';
import { SmoobuProvider } from './smoobu';
import { LodgifyProvider } from './lodgify';
import { GuestyProvider } from './guesty';
import { Beds24Provider } from './beds24';

/**
 * Factory: create a PMS provider instance from a connection config
 */
export function createProvider(config: PmsConnectionConfig): PmsProvider {
  switch (config.provider) {
    case 'hostaway':
      return new HostawayProvider({
        accountId: config.accountId || '',
        clientId: config.clientId || '',
        clientSecret: config.clientSecret || '',
      });

    case 'smoobu':
      return new SmoobuProvider({
        apiKey: config.apiKey || '',
      });

    case 'lodgify':
      return new LodgifyProvider({
        apiKey: config.apiKey || '',
      });

    case 'guesty':
      return new GuestyProvider({
        clientId: config.clientId || '',
        clientSecret: config.clientSecret || '',
      });

    case 'beds24':
      return new Beds24Provider({
        token: config.accessToken || config.apiKey || '',
        refreshToken: config.refreshToken,
      });

    default:
      throw new Error(`Unknown PMS provider: ${config.provider}`);
  }
}

/**
 * All supported provider names
 */
export const SUPPORTED_PROVIDERS: PmsProviderName[] = [
  'hostaway',
  'smoobu',
  'lodgify',
  'guesty',
  'beds24',
];

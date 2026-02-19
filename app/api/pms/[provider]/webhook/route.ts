// PMS Webhook Endpoint
// POST /api/pms/[provider]/webhook
// Receives real-time updates from PMS providers

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createProvider, PmsProviderName, SUPPORTED_PROVIDERS } from '@/modules/pms';
import { PmsSyncService } from '@/modules/pms/sync-service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const providerName = params.provider as PmsProviderName;

  if (!SUPPORTED_PROVIDERS.includes(providerName)) {
    return NextResponse.json({ error: 'Unknown provider' }, { status: 404 });
  }

  try {
    const payload = await request.json();

    // Log the webhook event
    console.log(`[PMS Webhook] ${providerName}`, JSON.stringify(payload).slice(0, 500));

    // Find active connections for this provider
    const { data: connections } = await supabase
      .from('pms_connections')
      .select('*')
      .eq('provider', providerName)
      .eq('status', 'active');

    if (!connections || connections.length === 0) {
      return NextResponse.json({ ok: true, message: 'No active connections' });
    }

    // Process webhook for each connection
    const syncService = new PmsSyncService();

    for (const connection of connections) {
      try {
        // Verify webhook secret if configured
        if (connection.webhook_secret) {
          const signature = request.headers.get('x-webhook-signature') ||
            request.headers.get('x-signature') || '';
          // Provider-specific signature verification would go here
          // For now, log a warning if secret is set but no signature
          if (!signature) {
            console.warn(`[PMS Webhook] ${providerName}: No signature for connection ${connection.id}`);
          }
        }

        // Create provider and call webhook handler
        const provider = createProvider({
          provider: providerName,
          apiKey: connection.api_key_encrypted,
          clientId: connection.client_id,
          clientSecret: connection.client_secret,
          accessToken: connection.access_token,
          refreshToken: connection.refresh_token,
          accountId: connection.account_id,
        });

        if (provider.webhookHandler) {
          await provider.webhookHandler(payload);
        }

        // Trigger incremental sync
        await syncService.syncConnection(connection.id);
      } catch (err) {
        console.error(`[PMS Webhook] Error for connection ${connection.id}:`, err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[PMS Webhook] ${providerName} error:`, err);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

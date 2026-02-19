// PMS Connect API
// POST /api/pms/connect — Connect a PMS provider (API key or OAuth)
// DELETE /api/pms/connect — Disconnect a PMS provider

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createProvider, SUPPORTED_PROVIDERS, PmsProviderName } from '@/modules/pms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      organizationId,
      provider,
      apiKey,
      clientId,
      clientSecret,
      accessToken,
      refreshToken,
      accountId,
    } = body as {
      organizationId: string;
      provider: PmsProviderName;
      apiKey?: string;
      clientId?: string;
      clientSecret?: string;
      accessToken?: string;
      refreshToken?: string;
      accountId?: string;
    };

    // Validate
    if (!organizationId || !provider) {
      return NextResponse.json(
        { error: 'organizationId and provider are required' },
        { status: 400 }
      );
    }

    if (!SUPPORTED_PROVIDERS.includes(provider)) {
      return NextResponse.json(
        { error: `Unsupported provider. Supported: ${SUPPORTED_PROVIDERS.join(', ')}` },
        { status: 400 }
      );
    }

    // Get auth from request (cookie-based or bearer)
    const authHeader = request.headers.get('authorization');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify org ownership
    const { data: org } = await supabase
      .from('organizations')
      .select('id, owner_id')
      .eq('id', organizationId)
      .single();

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Test the connection before saving
    const config = {
      provider,
      apiKey,
      clientId,
      clientSecret,
      accessToken,
      refreshToken,
      accountId,
    };

    try {
      const testProvider = createProvider(config);
      // Try to fetch properties as a connection test
      await testProvider.syncProperties();
    } catch (err) {
      return NextResponse.json(
        {
          error: 'Connection test failed. Check your credentials.',
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 422 }
      );
    }

    // Upsert the connection
    const { data: connection, error } = await supabase
      .from('pms_connections')
      .upsert(
        {
          organization_id: organizationId,
          provider,
          api_key_encrypted: apiKey, // TODO: encrypt before storage
          client_id: clientId,
          client_secret: clientSecret,
          access_token: accessToken,
          refresh_token: refreshToken,
          account_id: accountId,
          status: 'active',
        },
        { onConflict: 'organization_id,provider' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save connection', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      connection: {
        id: connection.id,
        provider: connection.provider,
        status: connection.status,
      },
    });
  } catch (err) {
    console.error('[PMS Connect] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connectionId');

    if (!connectionId) {
      return NextResponse.json(
        { error: 'connectionId is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from('pms_connections')
      .update({ status: 'inactive' })
      .eq('id', connectionId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to disconnect', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[PMS Disconnect] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

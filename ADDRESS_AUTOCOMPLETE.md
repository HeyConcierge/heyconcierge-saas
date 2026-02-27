# Address Autocomplete (Google Places)

## What was added

1. **`components/AddressAutocomplete.tsx`** — Reusable autocomplete component using Google Places API via `@googlemaps/js-api-loader`. When a user selects an address, it auto-fills street address, postal code, city, country, and captures lat/lng.

2. **SQL Migration** (`supabase/migrations/012_property_coordinates.sql`) — Adds `latitude` and `longitude` columns to the `properties` table.

3. **New Property page** (`app/(dashboard)/property/new/page.tsx`) — Street Address input replaced with `AddressAutocomplete`. On selection, all address fields + lat/lng are populated and saved.

4. **Property Settings page** (`app/(dashboard)/property/[id]/settings/page.tsx`) — Same autocomplete on the Address field. Selecting a place updates address, postal code, city, country, and coordinates.

5. **`.env.example`** — Added `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

6. **npm packages** — `use-places-autocomplete`, `@googlemaps/js-api-loader`.

## Graceful fallback

If `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is not set, the component renders a plain text input — no errors, no broken UI.

## Setup

1. Get a Google Maps API key with Places API enabled
2. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key` in `.env.local`
3. Run the SQL migration: `012_property_coordinates.sql`

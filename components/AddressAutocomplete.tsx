'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface AddressResult {
  streetAddress: string
  postalCode: string
  city: string
  country: string // 2-letter code
  latitude: number | null
  longitude: number | null
}

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onAddressSelect?: (result: AddressResult) => void
  placeholder?: string
  label?: string
  className?: string
}

// Country code mapping for the COUNTRIES list used in the app
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  norway: 'NO', sweden: 'SE', denmark: 'DK', finland: 'FI',
  germany: 'DE', 'united kingdom': 'GB', france: 'FR', spain: 'ES',
  italy: 'IT', 'united states': 'US', canada: 'CA',
}

function getCountryCode(longName: string, shortName: string): string {
  if (shortName && shortName.length === 2) return shortName.toUpperCase()
  const lower = longName.toLowerCase()
  return COUNTRY_NAME_TO_CODE[lower] || shortName?.toUpperCase() || ''
}

// Extract address components from Google Place
function parseAddressComponents(components: google.maps.GeocoderAddressComponent[]): {
  streetNumber: string; route: string; postalCode: string; city: string; country: string
} {
  let streetNumber = '', route = '', postalCode = '', city = '', country = ''

  for (const c of components) {
    const types = c.types
    if (types.includes('street_number')) streetNumber = c.long_name
    else if (types.includes('route')) route = c.long_name
    else if (types.includes('postal_code')) postalCode = c.long_name
    else if (types.includes('locality') || types.includes('postal_town')) city = c.long_name
    else if (types.includes('country')) country = getCountryCode(c.long_name, c.short_name)
  }

  return { streetNumber, route, postalCode, city, country }
}

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = '123 Sunset Blvd',
  label = 'Street Address',
  className,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [apiLoaded, setApiLoaded] = useState(false)
  const [apiKey] = useState(() => process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '')

  // Load Google Maps JS API
  useEffect(() => {
    if (!apiKey || typeof window === 'undefined') return

    // Already loaded
    if (window.google?.maps?.places) {
      setApiLoaded(true)
      return
    }

    let cancelled = false

    const load = async () => {
      try {
        const { Loader } = await import('@googlemaps/js-api-loader')
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places'],
        })
        await loader.importLibrary('places')
        if (!cancelled) setApiLoaded(true)
      } catch (err) {
        console.error('Failed to load Google Maps API:', err)
      }
    }

    load()
    return () => { cancelled = true }
  }, [apiKey])

  // Initialize autocomplete on the input
  useEffect(() => {
    if (!apiLoaded || !inputRef.current || autocompleteRef.current) return

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['address_components', 'geometry', 'formatted_address'],
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.address_components) return

      const parsed = parseAddressComponents(place.address_components)
      const streetAddress = [parsed.route, parsed.streetNumber].filter(Boolean).join(' ')

      onChange(streetAddress)

      onAddressSelect?.({
        streetAddress,
        postalCode: parsed.postalCode,
        city: parsed.city,
        country: parsed.country,
        latitude: place.geometry?.location?.lat() ?? null,
        longitude: place.geometry?.location?.lng() ?? null,
      })
    })

    autocompleteRef.current = autocomplete
  }, [apiLoaded])

  // Fallback: no API key → plain input
  const inputClasses = className || "w-full px-4 py-3 rounded-xl border-2 border-[#E8E4FF] bg-white text-dark font-medium placeholder:text-[#C4BFFF] focus:border-primary focus:outline-none transition-colors"

  return (
    <div>
      {label && <label className="block text-sm font-bold text-dark mb-1.5">{label}</label>}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClasses}
      />
    </div>
  )
}

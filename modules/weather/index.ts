/**
 * Weather module for HeyConcierge
 * Uses Open-Meteo API (free, no API key required)
 * Ported from Jacob's original kora-ai-server
 */

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snowfall',
  73: 'Moderate snowfall',
  75: 'Heavy snowfall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}

interface WeatherData {
  temperature: number
  feelsLike: number
  description: string
  windSpeed: number
  humidity: number
  fetchedAt: number
}

interface WeatherCache {
  [key: string]: WeatherData
}

const cache: WeatherCache = {}
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

/**
 * Get current weather for a location
 * @param lat Latitude
 * @param lon Longitude
 * @returns Weather summary string for system prompt, or null on error
 */
export async function getWeather(lat: number, lon: number): Promise<string | null> {
  const cacheKey = `${lat},${lon}`
  const cached = cache[cacheKey]

  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return formatWeather(cached)
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`
    const res = await fetch(url)

    if (!res.ok) return null

    const data = await res.json()
    const current = data.current

    const weather: WeatherData = {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      description: WMO_CODES[current.weather_code] || 'Unknown',
      windSpeed: current.wind_speed_10m,
      humidity: current.relative_humidity_2m,
      fetchedAt: Date.now(),
    }

    cache[cacheKey] = weather
    return formatWeather(weather)
  } catch (err) {
    console.error('Weather fetch error:', err)
    return null
  }
}

function formatWeather(w: WeatherData): string {
  return `Current weather: ${w.description}, ${w.temperature}°C (feels like ${w.feelsLike}°C), wind ${w.windSpeed} km/h, humidity ${w.humidity}%`
}

/**
 * Get weather context string for a property's coordinates
 * Returns empty string if no coordinates or on error
 */
export async function getWeatherContext(lat?: number | null, lon?: number | null): Promise<string> {
  if (!lat || !lon) return ''
  const weather = await getWeather(lat, lon)
  return weather ? `\n\nWEATHER:\n${weather}` : ''
}

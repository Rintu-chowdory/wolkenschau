// Open-Meteo APIs — free, no API key required.
// https://open-meteo.com/ · https://open-meteo.com/en/docs/geocoding-api

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  const res = await fetch(
    `${GEO_URL}?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`
  );
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  return (data.results || []).map((r) => ({
    id: r.id,
    name: r.name,
    region: r.admin1 || "",
    country: r.country || "",
    countryCode: r.country_code || "",
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

export async function fetchWeatherBundle({ latitude, longitude }) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
    hourly: "temperature_2m,weather_code,precipitation_probability,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "7",
  });
  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error("Weather service unavailable");
  return res.json();
}

// ------------------------------------------------------- WMO code mapping
export const WMO = {
  0: { label: "Clear sky", icon: "☀️", group: "clear" },
  1: { label: "Mainly clear", icon: "🌤️", group: "clear" },
  2: { label: "Partly cloudy", icon: "⛅", group: "clouds" },
  3: { label: "Overcast", icon: "☁️", group: "clouds" },
  45: { label: "Fog", icon: "🌫️", group: "fog" },
  48: { label: "Freezing fog", icon: "🌫️", group: "fog" },
  51: { label: "Light drizzle", icon: "🌦️", group: "rain" },
  53: { label: "Drizzle", icon: "🌦️", group: "rain" },
  55: { label: "Heavy drizzle", icon: "🌦️", group: "rain" },
  56: { label: "Freezing drizzle", icon: "🌧️", group: "rain" },
  57: { label: "Freezing drizzle", icon: "🌧️", group: "rain" },
  61: { label: "Light rain", icon: "🌧️", group: "rain" },
  63: { label: "Rain", icon: "🌧️", group: "rain" },
  65: { label: "Heavy rain", icon: "🌧️", group: "rain" },
  66: { label: "Freezing rain", icon: "🌨️", group: "snow" },
  67: { label: "Freezing rain", icon: "🌨️", group: "snow" },
  71: { label: "Light snow", icon: "🌨️", group: "snow" },
  73: { label: "Snow", icon: "❄️", group: "snow" },
  75: { label: "Heavy snow", icon: "❄️", group: "snow" },
  77: { label: "Snow grains", icon: "❄️", group: "snow" },
  80: { label: "Light showers", icon: "🌦️", group: "rain" },
  81: { label: "Showers", icon: "🌧️", group: "rain" },
  82: { label: "Heavy showers", icon: "🌧️", group: "rain" },
  85: { label: "Snow showers", icon: "🌨️", group: "snow" },
  86: { label: "Snow showers", icon: "🌨️", group: "snow" },
  95: { label: "Thunderstorm", icon: "⛈️", group: "thunder" },
  96: { label: "Storm with hail", icon: "⛈️", group: "thunder" },
  99: { label: "Storm with hail", icon: "⛈️", group: "thunder" },
};

export function describe(code, isDay) {
  const w = WMO[code] || { label: "Unknown", icon: "🌡️", group: "clouds" };
  if (w.group === "clear" && !isDay) return { ...w, icon: code === 0 ? "🌙" : "☁️🌙" };
  return w;
}

export function themeFor(code, isDay) {
  const group = (WMO[code] || {}).group || "clouds";
  if (group === "clear") return isDay ? "clear-day" : "clear-night";
  if (group === "clouds") return isDay ? "clouds-day" : "clouds-night";
  return `${group}-day`;
}

// ------------------------------------------------------- unit helpers
export const cToF = (c) => (c * 9) / 5 + 32;

export function formatTemp(celsius, unit) {
  const v = unit === "f" ? cToF(celsius) : celsius;
  return `${Math.round(v)}°`;
}

export function formatSpeed(kmh, unit) {
  return unit === "f" ? `${Math.round(kmh * 0.6214)} mph` : `${Math.round(kmh)} km/h`;
}

export function compassDir(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

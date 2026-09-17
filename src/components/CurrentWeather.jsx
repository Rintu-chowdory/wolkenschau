import { describe, formatTemp, compassDir, formatSpeed } from "../api/weather";

export default function CurrentWeather({ place, data, unit, onToggleUnit, favorite, onToggleFavorite }) {
  const c = data.current;
  const w = describe(c.weather_code, c.is_day === 1);
  const updated = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <section className="card hero-card fade-in">
      <div className="hero-top">
        <div>
          <h1 className="city">
            {place.name}
            {place.countryCode && <span className="country">{place.countryCode}</span>}
          </h1>
          <p className="condition">
            {w.icon} {w.label}
          </p>
        </div>
        <div className="hero-actions">
          <button
            type="button"
            className={`icon-btn ${favorite ? "active" : ""}`}
            onClick={onToggleFavorite}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
            aria-label="Toggle favorite"
          >
            {favorite ? "★" : "☆"}
          </button>
          <button type="button" className="unit-btn" onClick={onToggleUnit} aria-label="Toggle units">
            {unit === "c" ? "°C" : "°F"}
          </button>
        </div>
      </div>

      <div className="hero-temp">
        <span className="hero-deg">{formatTemp(c.temperature_2m, unit)}</span>
        <div className="hero-sub">
          <span className="feels">Feels like {formatTemp(c.apparent_temperature, unit)}</span>
          <span className="meta">
            {formatSpeed(c.wind_speed_10m, unit)} · {compassDir(c.wind_direction_10m)} · Humidity{" "}
            {c.relative_humidity_2m}%
          </span>
        </div>
      </div>

      <p className="updated">Updated {updated} · Open-Meteo</p>
    </section>
  );
}

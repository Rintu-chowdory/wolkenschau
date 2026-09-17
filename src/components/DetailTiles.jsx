import { formatTemp, formatSpeed, compassDir } from "../api/weather";

function Tile({ icon, label, value, sub }) {
  return (
    <div className="tile">
      <span className="tile-icon">{icon}</span>
      <span className="tile-label">{label}</span>
      <span className="tile-value">{value}</span>
      {sub && <span className="tile-sub">{sub}</span>}
    </div>
  );
}

export default function DetailTiles({ data, unit }) {
  const c = data.current;
  const uv = data.daily.uv_index_max?.[0];

  return (
    <section className="card fade-in">
      <h2 className="card-title">Conditions</h2>
      <div className="tiles-grid">
        <Tile icon="💧" label="Humidity" value={`${c.relative_humidity_2m}%`} />
        <Tile
          icon="🧭"
          label="Wind"
          value={formatSpeed(c.wind_speed_10m, unit)}
          sub={compassDir(c.wind_direction_10m)}
        />
        <Tile icon="🌬️" label="Gusts" value={formatSpeed(c.wind_gusts_10m, unit)} />
        <Tile icon="🌡️" label="Feels like" value={formatTemp(c.apparent_temperature, unit)} />
        <Tile icon="☁️" label="Cloud cover" value={`${c.cloud_cover}%`} />
        <Tile icon="🌧️" label="Precipitation" value={`${c.precipitation} mm`} />
        <Tile icon="📉" label="Pressure" value={`${Math.round(c.pressure_msl)} hPa`} />
        {uv !== undefined && (
          <Tile
            icon="🕶️"
            label="UV index"
            value={Math.round(uv)}
            sub={uv < 3 ? "Low" : uv < 6 ? "Moderate" : uv < 8 ? "High" : "Very high"}
          />
        )}
      </div>
    </section>
  );
}

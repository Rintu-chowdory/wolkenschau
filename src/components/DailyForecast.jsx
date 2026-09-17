import { describe, formatTemp } from "../api/weather";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyForecast({ data, unit }) {
  const d = data.daily;
  const days = d.time.map((t, i) => {
    const date = new Date(t);
    const w = describe(d.weather_code[i], true);
    return {
      key: t,
      label: i === 0 ? "Today" : dayNames[date.getDay()],
      icon: w.icon,
      label2: w.label,
      max: d.temperature_2m_max[i],
      min: d.temperature_2m_min[i],
      precip: d.precipitation_probability_max?.[i] ?? 0,
    };
  });

  // range for the temperature bars
  const all = days.flatMap((x) => [x.max, x.min]);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const span = hi - lo || 1;

  return (
    <section className="card fade-in">
      <h2 className="card-title">7-day forecast</h2>
      <div className="daily-list">
        {days.map((x) => (
          <div className="daily-row" key={x.key}>
            <span className="d-name">{x.label}</span>
            <span className="d-icon" title={x.label2}>{x.icon}</span>
            <span className="d-precip">{x.precip > 0 ? `💧${x.precip}%` : ""}</span>
            <span className="d-min">{formatTemp(x.min, unit)}</span>
            <div className="d-bar" aria-hidden="true">
              <div
                className="d-bar-fill"
                style={{
                  left: `${((x.min - lo) / span) * 100}%`,
                  width: `${((x.max - x.min) / span) * 100}%`,
                }}
              />
            </div>
            <span className="d-max">{formatTemp(x.max, unit)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

import { describe, formatTemp } from "../api/weather";

// next 24 hourly points starting from the current hour
function next24(data) {
  const nowIdx = data.hourly.time.findIndex((t) => new Date(t).getTime() >= Date.now() - 3600e3);
  const start = Math.max(nowIdx, 0);
  return data.hourly.time.slice(start, start + 24).map((t, i) => ({
    time: t,
    temp: data.hourly.temperature_2m[start + i],
    code: data.hourly.weather_code[start + i],
    isDay: data.hourly.is_day[start + i],
    precip: data.hourly.precipitation_probability?.[start + i] ?? 0,
  }));
}

export default function HourlyStrip({ data, unit }) {
  const hours = next24(data);
  const temps = hours.map((h) => h.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const W = 24 * 46;
  const H = 90;

  // svg polyline points, normalized into the chart box
  const pts = hours.map((h, i) => {
    const x = i * 46 + 23;
    const y = min === max ? H / 2 : 12 + (1 - (h.temp - min) / (max - min)) * (H - 24);
    return `${x},${y.toFixed(1)}`;
  });

  return (
    <section className="card fade-in">
      <h2 className="card-title">Next 24 hours</h2>
      <div className="chart-scroll">
        <svg className="temp-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <polyline points={pts.join(" ")} fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {hours.map((h, i) => {
            const [x, y] = pts[i].split(",").map(Number);
            return <circle key={i} cx={x} cy={y} r="3.5" fill="#fff" opacity="0.9" />;
          })}
        </svg>
      </div>
      <div className="hourly-scroll">
        {hours.map((h, i) => {
          const w = describe(h.code, h.isDay === 1);
          const hour = new Date(h.time).toLocaleTimeString([], { hour: "2-digit" });
          return (
            <div className="hour-item" key={h.time}>
              <span className="hour-label">{i === 0 ? "Now" : hour}</span>
              <span className="hour-icon">{w.icon}</span>
              <span className="hour-temp">{formatTemp(h.temp, unit)}</span>
              <span className={`hour-precip ${h.precip > 30 ? "wet" : ""}`}>
                {h.precip > 0 ? `${h.precip}%` : ""}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function SunArc({ data }) {
  const sunrise = new Date(data.daily.sunrise[0]);
  const sunset = new Date(data.daily.sunset[0]);
  const now = new Date();

  const progress = Math.min(Math.max((now - sunrise) / (sunset - sunrise), 0), 1);
  const isDay = now >= sunrise && now <= sunset;

  // arc geometry: draw a semicircle from (20,80) to (280,80)
  const cx = 150, cy = 80, r = 130;
  const angle = Math.PI * (1 - progress);
  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  const fmt = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <section className="card sun-card fade-in">
      <h2 className="card-title">Sun path</h2>
      <svg viewBox="0 0 300 110" className="sun-svg" aria-hidden="true">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} className="sun-track" />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${sunX} ${sunY}`}
          className="sun-progress"
          fill="none"
        />
        {isDay ? (
          <g>
            <circle cx={sunX} cy={sunY} r="12" fill="rgba(251, 191, 36, 0.25)" />
            <circle cx={sunX} cy={sunY} r="7" className="sun-dot" />
          </g>
        ) : (
          <text x={cx} y={cy - 20} textAnchor="middle" className="sun-night">🌙</text>
        )}
        <line x1={cx - r} y1={cy + 4} x2={cx + r} y2={cy + 4} className="sun-horizon" />
      </svg>
      <div className="sun-times">
        <div>
          <span className="sun-label">Sunrise</span>
          <span className="sun-value">↑ {fmt(sunrise)}</span>
        </div>
        <div>
          <span className="sun-label">Sunset</span>
          <span className="sun-value">↓ {fmt(sunset)}</span>
        </div>
      </div>
    </section>
  );
}

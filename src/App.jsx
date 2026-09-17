import { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyStrip from "./components/HourlyStrip";
import DailyForecast from "./components/DailyForecast";
import DetailTiles from "./components/DetailTiles";
import SunArc from "./components/SunArc";
import { fetchWeatherBundle, themeFor } from "./api/weather";
import "./App.css";

const DEFAULT_PLACE = { name: "Baesweiler", countryCode: "DE", latitude: "50.9167", longitude: "6.1833" };
const LS = {
  unit: "wolkenschau.unit",
  recents: "wolkenschau.recents",
  favorites: "wolkenschau.favorites",
};

const load = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [place, setPlace] = useState(DEFAULT_PLACE);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState(() => load(LS.unit, "c"));
  const [recents, setRecents] = useState(() => load(LS.recents, []));
  const [favorites, setFavorites] = useState(() => load(LS.favorites, []));

  const favKey = (p) => `${p.latitude},${p.longitude}`;
  const isFavorite = favorites.some((f) => f.key === favKey(place));

  useEffect(() => localStorage.setItem(LS.unit, JSON.stringify(unit)), [unit]);
  useEffect(() => localStorage.setItem(LS.recents, JSON.stringify(recents)), [recents]);
  useEffect(() => localStorage.setItem(LS.favorites, JSON.stringify(favorites)), [favorites]);

  const loadWeather = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const bundle = await fetchWeatherBundle({ latitude: p.latitude, longitude: p.longitude });
      setData(bundle);
      setPlace(p);
    } catch (err) {
      setError(err.message || "Could not load weather data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(DEFAULT_PLACE);
  }, [loadWeather]);

  const remember = useCallback((p) => {
    setRecents((prev) => {
      const key = favKey(p);
      const entry = { key, name: p.name, latitude: p.latitude, longitude: p.longitude };
      return [entry, ...prev.filter((r) => r.key !== key)].slice(0, 5);
    });
  }, []);

  const selectPlace = useCallback(
    (p) => {
      loadWeather(p).then(() => remember(p));
    },
    [loadWeather, remember]
  );

  const toggleFavorite = () => {
    setFavorites((prev) =>
      isFavorite
        ? prev.filter((f) => f.key !== favKey(place))
        : [...prev, { key: favKey(place), name: place.name, latitude: place.latitude, longitude: place.longitude }]
    );
  };

  const theme = data ? themeFor(data.current.weather_code, data.current.is_day === 1) : "clear-day";

  return (
    <div className={`app theme-${theme}`}>
      <div className="bg-orb orb-1" aria-hidden="true" />
      <div className="bg-orb orb-2" aria-hidden="true" />

      <header className="app-header">
        <div className="brand">
          <span className="brand-icon">◈</span>
          <div>
            <h1 className="brand-name">Skycast</h1>
            <p className="brand-sub">Weather dashboard</p>
          </div>
        </div>
        <a
          className="byline"
          href="https://github.com/Rintu-chowdory"
          target="_blank"
          rel="noopener"
          title="Built by Rintu Chowdory"
        >
          <span className="byline-avatar">◈</span>
          <span className="byline-text">by <strong>Rintu Chowdory</strong></span>
          <span className="byline-arrow">↗</span>
        </a>
        {favorites.length > 0 && (
          <div className="fav-bar">
            {favorites.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`chip ${favKey(place) === f.key ? "chip-active" : ""}`}
                onClick={() => selectPlace(f)}
              >
                ★ {f.name}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="app-main">
        <SearchBar
          onSelect={selectPlace}
          onLocate={selectPlace}
          onPickRecent={(r) => selectPlace({ ...r, countryCode: "" })}
          recents={recents}
          loading={loading}
        />

        {error && (
          <div className="state-card glass">
            <span className="state-icon">⚠️</span>
            <p>{error}</p>
            <button type="button" className="retry-btn" onClick={() => loadWeather(place)}>
              Try again
            </button>
          </div>
        )}

        {loading && !data && (
          <div className="state-card glass">
            <div className="loader" />
            <p>Loading weather…</p>
          </div>
        )}

        {data && !error && (
          <>
            <CurrentWeather
              place={place}
              data={data}
              unit={unit}
              onToggleUnit={() => setUnit((u) => (u === "c" ? "f" : "c"))}
              favorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
            <div className={`grid-2 ${loading ? "is-loading" : ""}`}>
              <HourlyStrip data={data} unit={unit} />
              <SunArc data={data} />
            </div>
            <div className="grid-2">
              <DailyForecast data={data} unit={unit} />
              <DetailTiles data={data} unit={unit} />
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p className="footer-projects">
          More from Rintu:{" "}
          <a href="https://github.com/Rintu-chowdory/OpenAGI" target="_blank" rel="noopener">OpenAGI Personal Edition</a>
          <span className="dot-sep">·</span>
          <a href="https://rintu-chowdory.github.io/dialing-innovations/" target="_blank" rel="noopener">Dialing Innovations</a>
          <span className="dot-sep">·</span>
          <a href="https://rintu-chowdory.github.io/killercoda.com/" target="_blank" rel="noopener">Killercoda Hub</a>
        </p>
        <p>
          Data by <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a> · no API key, no
          tracking · <a href="https://github.com/Rintu-chowdory/wolkenschau" target="_blank" rel="noopener">Source on GitHub</a>
        </p>
      </footer>
    </div>
  );
}

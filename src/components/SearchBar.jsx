import { useState, useEffect, useRef, useCallback } from "react";
import { searchCities } from "../api/weather";

export default function SearchBar({ onSelect, onLocate, recents, onPickRecent, loading }) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const wrapRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced autocomplete
  useEffect(() => {
    clearTimeout(debounceRef.current);
    const query = input.trim();
    if (query.length < 2) {
      debounceRef.current = setTimeout(() => setResults([]), 0);
      return () => clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const cities = await searchCities(query);
        setResults(cities);
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [input]);

  // Close dropdown on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = useCallback(
    (place) => {
      setOpen(false);
      setInput(place.name);
      onSelect(place);
    },
    [onSelect]
  );

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setInput("");
        onLocate({
          name: "My Location",
          latitude: pos.coords.latitude.toFixed(4),
          longitude: pos.coords.longitude.toFixed(4),
        });
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  return (
    <div className="topbar" ref={wrapRef}>
      <div className="search-wrap">
        <span className="search-glass">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search any city…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          disabled={loading}
          aria-label="Search city"
        />
        <button
          type="button"
          className="locate-btn"
          onClick={locate}
          title="Use my location"
          aria-label="Use my location"
          disabled={locating}
        >
          {locating ? "…" : "📍"}
        </button>
      </div>

      {open && results.length > 0 && (
        <ul className="dropdown glass">
          {results.map((r) => (
            <li key={`${r.id}-${r.latitude}`}>
              <button type="button" className="dropdown-item" onClick={() => pick(r)}>
                <span className="dd-name">{r.name}</span>
                <span className="dd-meta">
                  {[r.region, r.country].filter(Boolean).join(", ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {recents.length > 0 && (
        <div className="recents">
          <span className="recents-label">Recent</span>
          {recents.map((r) => (
            <button
              key={r.key}
              type="button"
              className="chip"
              onClick={() => onPickRecent(r)}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

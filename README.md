<div align="center">

# ☁️ Wolkenschau

**Das Wetter im Blick** — a glassmorphic weather dashboard.

[![Live Demo](https://img.shields.io/badge/live-rintu--chowdory.github.io%2Fwolkenschau-6366f1?style=flat-square)](https://rintu-chowdory.github.io/wolkenschau/)
[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1?style=flat-square)](LICENSE)

</div>

---

*Wolkenschau* (German: **cloud view**) shows the weather the way the sky does —
the entire interface reacts to current conditions.

### ✨ Features

- **Dynamic weather themes** — the background gradient shifts with the actual weather and day/night cycle
- **Glassmorphism design** — frosted cards, floating gradient orbs, smooth animations
- **City search with autocomplete** — debounced geocoding dropdown, plus a "use my location" button
- **Next 24 hours** — SVG temperature line chart + scrollable hour strip with precipitation chances
- **7-day forecast** — min/max range bars and per-day precipitation probability
- **Sun-path arc** — animated SVG showing the sun's live position between sunrise and sunset
- **Conditions tiles** — humidity, wind + compass direction, gusts, pressure, cloud cover, UV index
- **°C/°F toggle, favorites and recent searches** — all persisted in localStorage
- **Zero API keys, zero tracking** — powered by the free [Open-Meteo](https://open-meteo.com/) API

### 🛠️ Built with

React 19 · Vite 7 · Tailwind CSS 3 · vanilla SVG charts — no chart libraries, no UI kits.

### 🚀 Run it

```bash
npm install
npm run dev
```

### 📦 Deploy

Push to `main` — GitHub Actions builds and deploys to GitHub Pages automatically.

---

Built by [Rintu Chowdory](https://github.com/Rintu-chowdory) · More: [OpenAGI Personal Edition](https://github.com/Rintu-chowdory/OpenAGI) · [Dialing Innovations](https://rintu-chowdory.github.io/dialing-innovations/) · [Killercoda Hub](https://rintu-chowdory.github.io/killercoda.com/)

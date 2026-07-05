import { useState } from "react"

const API_KEY = import.meta.env.VITE_API_KEY

const STRINGS = {
  en: {
    title: "Weather",
    subtitle: "Search any city for current conditions.",
    placeholder: "City name...",
    search: "Search",
    notFound: "City not found.",
    generic: "Something went wrong.",
    feels: "Feels like",
    humidity: "Humidity",
    wind: "Wind",
    pressure: "Pressure",
    tryWord: "Try",
    orOwn: ", or your own city.",
  },
  de: {
    title: "Wetter",
    subtitle: "Aktuelle Wetterlage für jede Stadt.",
    placeholder: "Stadtname...",
    search: "Suchen",
    notFound: "Stadt nicht gefunden.",
    generic: "Etwas ist schiefgelaufen.",
    feels: "Gefühlt",
    humidity: "Luftfeuchte",
    wind: "Wind",
    pressure: "Luftdruck",
    tryWord: "Probier",
    orOwn: " oder deine eigene Stadt.",
  },
}

const WEATHER_ICONS = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌫️",
  Smoke: "🌫️",
  Dust: "🌫️",
  Sand: "🌫️",
  Ash: "🌫️",
  Squall: "💨",
  Tornado: "🌪️",
}

function WeatherIcon({ main }) {
  return <span className="weather-icon">{WEATHER_ICONS[main] ?? "🌡️"}</span>
}

function StatBox({ label, value }) {
  return (
    <div className="stat">
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
    </div>
  )
}

function loadLang() {
  try {
    return window.localStorage.getItem("weather:lang") === "de" ? "de" : "en"
  } catch {
    return "en"
  }
}

export default function App() {
  const [lang, setLang] = useState(loadLang)
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const t = STRINGS[lang]

  function switchLang(next) {
    setLang(next)
    document.documentElement.lang = next
    try {
      window.localStorage.setItem("weather:lang", next)
    } catch {
      /* storage unavailable */
    }
  }

  async function fetchWeather(e) {
    e.preventDefault()
    const q = city.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    setWeather(null)
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${API_KEY}&units=metric&lang=${lang}`
      )
      if (!res.ok) throw new Error(res.status === 404 ? t.notFound : t.generic)
      const data = await res.json()
      setWeather(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function quickTry(name) {
    setCity(name)
    document.querySelector("form").requestSubmit()
  }

  const feels = weather ? Math.round(weather.main.feels_like) : null
  const temp = weather ? Math.round(weather.main.temp) : null
  const desc = weather ? weather.weather[0].description : null
  const main = weather ? weather.weather[0].main : null

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="header__row">
            <h1 className="title">{t.title}</h1>
            <div className="langToggle" role="group" aria-label="Language">
              <button
                type="button"
                className={lang === "en" ? "langToggle__btn langToggle__btn--on" : "langToggle__btn"}
                onClick={() => switchLang("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={lang === "de" ? "langToggle__btn langToggle__btn--on" : "langToggle__btn"}
                onClick={() => switchLang("de")}
              >
                DE
              </button>
            </div>
          </div>
          <p className="subtitle">{t.subtitle}</p>
        </header>

        <form className="search" onSubmit={fetchWeather}>
          <input
            className="search__input"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t.placeholder}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          <button className="search__btn" type="submit" disabled={loading}>
            {loading ? "..." : t.search}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {weather && (
          <div className="card">
            <div className="card__top">
              <div className="card__location">
                <span className="card__city">{weather.name}</span>
                <span className="card__country">{weather.sys.country}</span>
              </div>
              <WeatherIcon main={main} />
            </div>

            <div className="card__temp">
              {temp}<span className="card__unit">°C</span>
            </div>

            <div className="card__desc">{desc.charAt(0).toUpperCase() + desc.slice(1)}</div>

            <div className="stats">
              <StatBox label={t.feels} value={`${feels}°`} />
              <StatBox label={t.humidity} value={`${weather.main.humidity}%`} />
              <StatBox label={t.wind} value={`${Math.round(weather.wind.speed)} m/s`} />
              <StatBox label={t.pressure} value={`${weather.main.pressure} hPa`} />
            </div>
          </div>
        )}

        {!weather && !error && !loading && (
          <div className="hint">
            {t.tryWord}{" "}
            <button className="hint__btn" onClick={() => quickTry("London")}>London</button>,{" "}
            <button className="hint__btn" onClick={() => quickTry("Tokyo")}>{lang === "de" ? "Tokio" : "Tokyo"}</button>
            {t.orOwn}
          </div>
        )}
      </div>
    </div>
  )
}

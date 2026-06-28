import { useState } from "react"

const API_KEY = import.meta.env.VITE_API_KEY

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

export default function App() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchWeather(e) {
    e.preventDefault()
    const q = city.trim()
    if (!q) return
    setLoading(true)
    setError(null)
    setWeather(null)
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${API_KEY}&units=metric&lang=en`
      )
      if (!res.ok) throw new Error(res.status === 404 ? "City not found." : "Something went wrong.")
      const data = await res.json()
      setWeather(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const feels = weather ? Math.round(weather.main.feels_like) : null
  const temp = weather ? Math.round(weather.main.temp) : null
  const desc = weather ? weather.weather[0].description : null
  const main = weather ? weather.weather[0].main : null

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <h1 className="title">Weather</h1>
          <p className="subtitle">Search any city for current conditions.</p>
        </header>

        <form className="search" onSubmit={fetchWeather}>
          <input
            className="search__input"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City name..."
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          <button className="search__btn" type="submit" disabled={loading}>
            {loading ? "..." : "Search"}
          </button>
        </form>

        {error && (
          <div className="error">{error}</div>
        )}

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
              <StatBox label="Feels like" value={`${feels}°`} />
              <StatBox label="Humidity" value={`${weather.main.humidity}%`} />
              <StatBox label="Wind" value={`${Math.round(weather.wind.speed)} m/s`} />
              <StatBox label="Pressure" value={`${weather.main.pressure} hPa`} />
            </div>
          </div>
        )}

        {!weather && !error && !loading && (
          <div className="hint">
            Try <button className="hint__btn" onClick={() => { setCity("London"); document.querySelector("form").requestSubmit() }}>London</button>,{" "}
            <button className="hint__btn" onClick={() => { setCity("Tokyo"); document.querySelector("form").requestSubmit() }}>Tokyo</button>, or your own city.
          </div>
        )}
      </div>
    </div>
  )
}

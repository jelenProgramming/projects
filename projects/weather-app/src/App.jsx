import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'
import SkyReal from './SkyReal.jsx'
import Figures from './Figures.jsx'
import WeatherIcon from './WeatherIcon.jsx'
import { aggregate, geocode, conditionLabel, category } from './weather.js'

const KEY = import.meta.env.VITE_API_KEY
const DEFAULT = { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 }

const T = {
  en: {
    title: 'Consensus Weather', tagline: 'one forecast, averaged from many models',
    search: 'Search a city', feels: 'Feels like', range: 'model range',
    humidity: 'Humidity', wind: 'Wind', gusts: 'Gusts', precip: 'Precipitation', cloud: 'Cloud cover',
    pressure: 'Pressure', dew: 'Dew point', uv: 'UV index', visibility: 'Visibility',
    sunrise: 'Sunrise', sunset: 'Sunset', hourly: 'Next 24 hours', now: 'Now',
    confidence: 'Confidence', models: 'sources',
    outlook: '7-day outlook', showSources: 'Show sources', hideSources: 'Hide sources',
    loading: 'Reading the models', error: 'Could not load weather', retry: 'Retry',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], today: 'Today',
  },
  de: {
    title: 'Konsens-Wetter', tagline: 'eine Vorhersage, gemittelt aus vielen Modellen',
    search: 'Stadt suchen', feels: 'Gefühlt', range: 'Modellspanne',
    humidity: 'Luftfeuchte', wind: 'Wind', gusts: 'Böen', precip: 'Niederschlag', cloud: 'Bewölkung',
    pressure: 'Luftdruck', dew: 'Taupunkt', uv: 'UV-Index', visibility: 'Sicht',
    sunrise: 'Sonnenaufgang', sunset: 'Sonnenuntergang', hourly: 'Nächste 24 Stunden', now: 'Jetzt',
    confidence: 'Konfidenz', models: 'Quellen',
    outlook: '7-Tage-Ausblick', showSources: 'Quellen zeigen', hideSources: 'Quellen verbergen',
    loading: 'Modelle werden gelesen', error: 'Wetter nicht ladbar', retry: 'Erneut',
    days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], today: 'Heute', myLocation: 'Mein Standort',
  },
  sl: {
    title: 'Soglasno vreme', tagline: 'ena napoved, povprečena iz več modelov',
    search: 'Poišči mesto', feels: 'Občuti se kot', range: 'razpon modelov',
    humidity: 'Vlažnost', wind: 'Veter', gusts: 'Sunki', precip: 'Padavine', cloud: 'Oblačnost',
    pressure: 'Zračni tlak', dew: 'Rosišče', uv: 'UV-indeks', visibility: 'Vidljivost',
    sunrise: 'Sončni vzhod', sunset: 'Sončni zahod', hourly: 'Naslednjih 24 ur', now: 'Zdaj',
    confidence: 'Zanesljivost', models: 'virov',
    outlook: '7-dnevna napoved', showSources: 'Prikaži vire', hideSources: 'Skrij vire',
    loading: 'Berem modele', error: 'Vremena ni bilo mogoče naložiti', retry: 'Poskusi znova',
    days: ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'], today: 'Danes', myLocation: 'Moja lokacija',
  },
}
T.en.myLocation = 'My location'

const get = (k, d) => { try { return localStorage.getItem(k) || d } catch { return d } }
const put = (k, v) => { try { localStorage.setItem(k, v) } catch { /* storage blocked */ } }
const toTemp = (c, u) => Math.round(u === 'f' ? c * 9 / 5 + 32 : c)
const toWind = (kph, u) => Math.round(u === 'f' ? kph / 1.609 : kph)
const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
const compass = deg => (typeof deg === 'number' ? COMPASS[Math.round((deg % 360) / 45) % 8] : '')
const clock = iso => (iso ? iso.slice(11, 16) : '')

export default function App() {
  const [lang, setLang] = useState(() => { const s = get('wx:lang', 'en'); return s === 'de' || s === 'sl' ? s : 'en' })
  const [unit, setUnit] = useState(() => (get('wx:unit', 'c') === 'f' ? 'f' : 'c'))
  const [wx, setWx] = useState(null)
  const [place, setPlace] = useState('')
  const [status, setStatus] = useState('loading')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [openSources, setOpenSources] = useState(false)
  const [openPred, setOpenPred] = useState(-1)
  const t = T[lang]

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  const reduce = useRef(matchMedia('(prefers-reduced-motion: reduce)').matches).current
  const [shownC, setShownC] = useState(null)

  // count the big number up to the fresh consensus temperature
  useEffect(() => {
    if (!wx) return
    if (reduce) { setShownC(wx.tempC); return }
    const from = { v: shownC ?? wx.tempC - 6 }
    const anim = animate(from, {
      v: wx.tempC, duration: 900, ease: 'outCubic',
      onUpdate: () => setShownC(from.v),
    })
    return () => anim.cancel()
  }, [wx]) // eslint-disable-line react-hooks/exhaustive-deps

  // staggered entrance for the card and its tiles
  useEffect(() => {
    if (status !== 'ok' || reduce) return
    animate('.card', { opacity: [0, 1], translateY: [22, 0], duration: 550, ease: 'outCubic' })
    animate('.pred', { opacity: [0, 1], translateY: [-8, 0], delay: stagger(60), duration: 400, ease: 'outCubic' })
    animate('.grid > div', { opacity: [0, 1], translateY: [12, 0], delay: stagger(45, { start: 100 }), duration: 420, ease: 'outCubic' })
    animate('.hours .hour', { opacity: [0, 1], translateX: [14, 0], delay: stagger(24, { start: 120 }), duration: 360, ease: 'outCubic' })
    animate('.days .day', { opacity: [0, 1], scale: [0.86, 1], delay: stagger(38, { start: 200 }), duration: 420, ease: 'outBack' })
  }, [status, wx]) // eslint-disable-line react-hooks/exhaustive-deps

  async function load(lat, lon, label) {
    setStatus('loading'); setResults([]); setOpenPred(-1)
    try {
      const r = await aggregate(lat, lon, KEY)
      setWx(r); setPlace(label); setStatus('ok')
    } catch { setStatus('error') }
  }

  // on mount, try geolocation then fall back to a default city
  useEffect(() => {
    const fallback = () => load(DEFAULT.lat, DEFAULT.lon, `${DEFAULT.name}, ${DEFAULT.country}`)
    if (!navigator.geolocation) { fallback(); return }
    navigator.geolocation.getCurrentPosition(
      p => load(p.coords.latitude, p.coords.longitude, T[lang].myLocation),
      fallback, { timeout: 8000 },
    )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function onSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    try {
      const hits = await geocode(q, lang)
      if (hits.length === 1) pick(hits[0])
      else setResults(hits)
    } catch { setResults([]) }
  }
  const label = h => [h.name, h.admin, h.country].filter(Boolean).join(', ')
  function pick(h) { setQuery(''); setResults([]); load(h.lat, h.lon, label(h)) }
  const switchLang = l => { setLang(l); put('wx:lang', l) }
  const switchUnit = u => { setUnit(u); put('wx:unit', u) }

  const cat = wx?.category || 'clouds'
  const day = wx?.isDay ?? true
  const windUnit = unit === 'f' ? 'mph' : 'km/h'

  return (
    <div className={`app ${day ? 'day' : 'night'}`} data-cat={cat}>
      <SkyReal weather={wx} />
      <Figures cat={cat} day={day} className="mascots" />
      <div className="scrim" />
      <div className="ui">
        <header className="top">
          <span className="brand"><WeatherIcon cat={cat} day={day} size={26} /> {t.title}</span>
          <div className="toggles">
            <div className="seg">
              <button type="button" className={unit === 'c' ? 'on' : ''} onClick={() => switchUnit('c')}>°C</button>
              <button type="button" className={unit === 'f' ? 'on' : ''} onClick={() => switchUnit('f')}>°F</button>
            </div>
            <div className="seg">
              <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => switchLang('en')}>EN</button>
              <button type="button" className={lang === 'de' ? 'on' : ''} onClick={() => switchLang('de')}>DE</button>
              <button type="button" className={lang === 'sl' ? 'on' : ''} onClick={() => switchLang('sl')}>SL</button>
            </div>
          </div>
        </header>

        <form className="search" onSubmit={onSearch}>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search} aria-label={t.search} />
          <button type="submit" aria-label="search">→</button>
        </form>
        {results.length > 0 && (
          <ul className="results">
            {results.map((h, i) => (
              <li key={i}><button type="button" onClick={() => pick(h)}>{label(h)}</button></li>
            ))}
          </ul>
        )}

        {status === 'ok' && wx?.predictions?.length > 0 && (
          <div className="preds">
            {wx.predictions.map((p, i) => (
              <button
                key={i}
                type="button"
                className={`pred ${openPred === i ? 'pred--open' : ''}`}
                aria-expanded={openPred === i}
                onClick={() => setOpenPred(openPred === i ? -1 : i)}
              >
                <WeatherIcon cat={p.cat} day={day} size={22} />
                <span className="pred__txt">{p[lang]}</span>
                <span className="pred__chev">{openPred === i ? '▾' : '▸'}</span>
                {openPred === i && <span className="pred__detail">{p.detail[lang]}</span>}
              </button>
            ))}
          </div>
        )}

        {status === 'loading' && <div className="state">{t.loading}...</div>}
        {status === 'error' && (
          <div className="state">{t.error}. <button type="button" className="link" onClick={() => load(DEFAULT.lat, DEFAULT.lon, DEFAULT.name)}>{t.retry}</button></div>
        )}

        {status === 'ok' && wx && (
          <main className="card">
            <div className="place">{place}</div>
            <div className="now">
              <WeatherIcon cat={cat} day={day} size={92} />
              <div className="temp">{toTemp(shownC ?? wx.tempC, unit)}<span className="deg">°</span></div>
              <div className="cond">
                <div className="condName">{conditionLabel(cat, lang)}</div>
                <div className="feels">{t.feels} {toTemp(wx.feelsC, unit)}°</div>
                <div className="range">{t.range} {toTemp(wx.tempMin, unit)}° to {toTemp(wx.tempMax, unit)}°</div>
              </div>
            </div>

            <div className="conf">
              <div className="confBar"><span style={{ width: `${wx.confidence}%` }} /></div>
              <div className="confLabel">{t.confidence} {wx.confidence}% · {t.models} {wx.count}</div>
            </div>

            {wx.hourly?.length > 1 && (
              <div className="hours">
                {wx.hourly.slice(0, 24).map((h, i) => (
                  <div key={h.time} className="hour">
                    <span className="hName">{i === 0 ? t.now : String(h.hour).padStart(2, '0')}</span>
                    <WeatherIcon cat={category(h.code)} day={h.isDay} size={30} />
                    <span className="hTemp">{toTemp(h.tempC, unit)}°</span>
                    <span className="hPop">{h.pop > 5 ? `${h.pop}%` : ''}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid">
              <div><span>{t.humidity}</span><b>{wx.humidity}%</b></div>
              <div><span>{t.wind}</span><b>{toWind(wx.windKph, unit)} {windUnit} {compass(wx.windDir)}</b></div>
              <div><span>{t.gusts}</span><b>{wx.gustKph ? `${toWind(wx.gustKph, unit)} ${windUnit}` : '—'}</b></div>
              <div><span>{t.precip}</span><b>{(wx.precip || 0).toFixed(1)} mm</b></div>
              <div><span>{t.cloud}</span><b>{wx.cloud}%</b></div>
              <div><span>{t.pressure}</span><b>{wx.pressure ? `${wx.pressure} hPa` : '—'}</b></div>
              <div><span>{t.dew}</span><b>{typeof wx.dewC === 'number' ? `${toTemp(wx.dewC, unit)}°` : '—'}</b></div>
              <div><span>{t.uv}</span><b>{typeof wx.uv === 'number' ? Math.round(wx.uv) : '—'}</b></div>
              <div><span>{t.visibility}</span><b>{typeof wx.visibility === 'number' ? `${Math.round(wx.visibility / 1000)} km` : '—'}</b></div>
            </div>

            {wx.sun?.sunrise && (
              <div className="sun">
                <span>☀ {t.sunrise} {clock(wx.sun.sunrise)}</span>
                <span>{t.sunset} {clock(wx.sun.sunset)} ☾</span>
              </div>
            )}

            {wx.daily?.length > 0 && (
              <div className="outlook">
                <div className="outlookLabel">{t.outlook}</div>
                <div className="days">
                  {wx.daily.map((d, i) => (
                    <div key={d.date} className="day">
                      <span className="dName">{i === 0 ? t.today : t.days[new Date(d.date).getDay()]}</span>
                      <WeatherIcon cat={category(d.code)} day size={28} />
                      {d.pop > 5 && <span className="dPop">{d.pop}%</span>}
                      <span className="dTemp">{toTemp(d.max, unit)}°<i>{toTemp(d.min, unit)}°</i></span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button type="button" className="srcToggle" onClick={() => setOpenSources(v => !v)}>
              {openSources ? t.hideSources : t.showSources} ({wx.count})
            </button>
            {openSources && (
              <ul className="srcList">
                {wx.sources.map(s => (
                  <li key={s.id}>
                    <span className="sName"><WeatherIcon cat={s.cat} day size={18} /> {s.label}</span>
                    <span className="sProv">{s.provider}</span>
                    <span className="sTemp">{toTemp(s.tempC, unit)}°</span>
                  </li>
                ))}
              </ul>
            )}
          </main>
        )}

        <footer className="foot"><span>{t.tagline}</span><span className="copy">© 2026 David Jelen</span></footer>
      </div>
    </div>
  )
}

// weather app, consensus of 18 forecast models, colorful icons, hourly + predictions

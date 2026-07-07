import { useEffect, useState } from 'react'
import Sky from './Sky.jsx'
import { aggregate, geocode, conditionLabel, category } from './weather.js'

const KEY = import.meta.env.VITE_API_KEY
const DEFAULT = { name: 'Maribor', country: 'Slovenia', lat: 46.5547, lon: 15.6459 }

const T = {
  en: {
    title: 'Consensus Weather', tagline: 'one forecast, averaged from many models',
    search: 'Search a city', feels: 'Feels like', range: 'model range',
    humidity: 'Humidity', wind: 'Wind', precip: 'Precipitation', cloud: 'Cloud cover',
    confidence: 'Confidence', averagedFrom: 'averaged from', models: 'sources', rawModels: 'raw models',
    outlook: '7-day outlook', showSources: 'Show sources', hideSources: 'Hide sources',
    loading: 'Reading the models', error: 'Could not load weather', retry: 'Retry',
    real: 'Real', toon: 'Toon',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], today: 'Today',
  },
  de: {
    title: 'Konsens-Wetter', tagline: 'eine Vorhersage, gemittelt aus vielen Modellen',
    search: 'Stadt suchen', feels: 'Gefühlt', range: 'Modellspanne',
    humidity: 'Luftfeuchte', wind: 'Wind', precip: 'Niederschlag', cloud: 'Bewölkung',
    confidence: 'Konfidenz', averagedFrom: 'gemittelt aus', models: 'Quellen', rawModels: 'Rohmodelle',
    outlook: '7-Tage-Ausblick', showSources: 'Quellen zeigen', hideSources: 'Quellen verbergen',
    loading: 'Modelle werden gelesen', error: 'Wetter nicht ladbar', retry: 'Erneut',
    real: 'Real', toon: 'Comic',
    days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], today: 'Heute',
  },
}

const get = (k, d) => { try { return localStorage.getItem(k) || d } catch { return d } }
const put = (k, v) => { try { localStorage.setItem(k, v) } catch { /* storage blocked */ } }
const toTemp = (c, u) => Math.round(u === 'f' ? c * 9 / 5 + 32 : c)
const toWind = (kph, u) => Math.round(u === 'f' ? kph / 1.609 : kph)
const ICON = { clear: '☀', partly: '⛅', clouds: '☁', fog: '🌫', drizzle: '🌦', rain: '🌧', snow: '❄', thunder: '⛈' }
const icon = cat => ICON[cat] || '☁'

export default function App() {
  const [lang, setLang] = useState(() => (get('wx:lang', 'en') === 'de' ? 'de' : 'en'))
  const [unit, setUnit] = useState(() => (get('wx:unit', 'c') === 'f' ? 'f' : 'c'))
  const [mode, setMode] = useState(() => (get('wx:mode', 'real') === 'toon' ? 'toon' : 'real'))
  const [wx, setWx] = useState(null)
  const [place, setPlace] = useState('')
  const [status, setStatus] = useState('loading')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [openSources, setOpenSources] = useState(false)
  const t = T[lang]

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  async function load(lat, lon, label) {
    setStatus('loading'); setResults([])
    try {
      const r = await aggregate(lat, lon, KEY)
      setWx(r); setPlace(label); setStatus('ok')
    } catch { setStatus('error') }
  }

  // on mount, try geolocation then fall back to Maribor
  useEffect(() => {
    const fallback = () => load(DEFAULT.lat, DEFAULT.lon, `${DEFAULT.name}, ${DEFAULT.country}`)
    if (!navigator.geolocation) { fallback(); return }
    navigator.geolocation.getCurrentPosition(
      p => load(p.coords.latitude, p.coords.longitude, lang === 'de' ? 'Mein Standort' : 'My location'),
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
  const switchMode = m => { setMode(m); put('wx:mode', m) }

  const cat = wx?.category || 'clouds'
  const day = wx?.isDay ?? true

  return (
    <div className={`app ${day ? 'day' : 'night'}`} data-cat={cat} data-mode={mode}>
      <Sky weather={wx} mode={mode} />
      <div className="scrim" />
      <div className="ui">
        <header className="top">
          <span className="brand">{icon(cat)} {t.title}</span>
          <div className="toggles">
            <div className="seg">
              <button type="button" className={mode === 'real' ? 'on' : ''} onClick={() => switchMode('real')}>{t.real}</button>
              <button type="button" className={mode === 'toon' ? 'on' : ''} onClick={() => switchMode('toon')}>{t.toon}</button>
            </div>
            <div className="seg">
              <button type="button" className={unit === 'c' ? 'on' : ''} onClick={() => switchUnit('c')}>°C</button>
              <button type="button" className={unit === 'f' ? 'on' : ''} onClick={() => switchUnit('f')}>°F</button>
            </div>
            <div className="seg">
              <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => switchLang('en')}>EN</button>
              <button type="button" className={lang === 'de' ? 'on' : ''} onClick={() => switchLang('de')}>DE</button>
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

        {status === 'loading' && <div className="state">{t.loading}…</div>}
        {status === 'error' && (
          <div className="state">{t.error}. <button type="button" className="link" onClick={() => load(DEFAULT.lat, DEFAULT.lon, DEFAULT.name)}>{t.retry}</button></div>
        )}

        {status === 'ok' && wx && (
          <main className="card">
            <div className="place">{place}</div>
            <div className="now">
              <div className="temp">{toTemp(wx.tempC, unit)}<span className="deg">°</span></div>
              <div className="cond">
                <div className="condName">{conditionLabel(cat, lang)}</div>
                <div className="feels">{t.feels} {toTemp(wx.feelsC, unit)}°</div>
                <div className="range">{t.range} {toTemp(wx.tempMin, unit)}° to {toTemp(wx.tempMax, unit)}°</div>
              </div>
            </div>

            <div className="conf">
              <div className="confBar"><span style={{ width: `${wx.confidence}%` }} /></div>
              <div className="confLabel">{t.confidence} {wx.confidence}%</div>
            </div>

            <div className="grid">
              <div><span>{t.humidity}</span><b>{wx.humidity}%</b></div>
              <div><span>{t.wind}</span><b>{toWind(wx.windKph, unit)} {unit === 'f' ? 'mph' : 'km/h'}</b></div>
              <div><span>{t.precip}</span><b>{(wx.precip || 0).toFixed(1)} mm</b></div>
              <div><span>{t.cloud}</span><b>{wx.cloud}%</b></div>
            </div>

            {wx.daily?.length > 0 && (
              <div className="outlook">
                <div className="outlookLabel">{t.outlook}</div>
                <div className="days">
                  {wx.daily.map((d, i) => (
                    <div key={d.date} className="day">
                      <span className="dName">{i === 0 ? t.today : t.days[new Date(d.date).getDay()]}</span>
                      <span className="dIcon">{icon(category(d.code))}</span>
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
                    <span className="sName">{icon(s.cat)} {s.label}</span>
                    <span className="sProv">{s.provider}</span>
                    <span className="sTemp">{toTemp(s.tempC, unit)}°</span>
                  </li>
                ))}
              </ul>
            )}
          </main>
        )}

        <footer className="foot">{t.tagline}</footer>
      </div>
    </div>
  )
}

// weather app, consensus of 15+ forecast models, see MY-INFO for direction

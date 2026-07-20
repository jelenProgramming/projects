// multi-source forecast aggregation, keyless-first
// backbone: the reputable national-service models in models.js via open-meteo,
// each an independent forecast, deduplicated so every center votes once
// plus openweathermap as an extra provider when a key is present

import { OM_MODELS, OM_LABELS } from './models.js'

const CUR = ['temperature_2m', 'apparent_temperature', 'relative_humidity_2m', 'precipitation',
  'weather_code', 'cloud_cover', 'wind_speed_10m', 'wind_direction_10m', 'is_day',
  'surface_pressure', 'wind_gusts_10m', 'dew_point_2m', 'visibility', 'uv_index']

// wmo weather code -> coarse category that drives the animated sky
export function category(code) {
  if (code == null) return 'clouds'
  if (code === 0) return 'clear'
  if (code <= 2) return 'partly'
  if (code === 3) return 'clouds'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 51 && code <= 57) return 'drizzle'
  if (code >= 61 && code <= 67) return 'rain'
  if (code >= 71 && code <= 77) return 'snow'
  if (code >= 80 && code <= 82) return 'rain'
  if (code === 85 || code === 86) return 'snow'
  if (code >= 95) return 'thunder'
  return 'clouds'
}

const LABELS = {
  clear: { en: 'Clear', de: 'Klar', sl: 'Jasno' }, partly: { en: 'Partly cloudy', de: 'Teils bewölkt', sl: 'Delno oblačno' },
  clouds: { en: 'Cloudy', de: 'Bewölkt', sl: 'Oblačno' }, fog: { en: 'Fog', de: 'Nebel', sl: 'Megla' },
  drizzle: { en: 'Drizzle', de: 'Nieselregen', sl: 'Rosenje' }, rain: { en: 'Rain', de: 'Regen', sl: 'Dež' },
  snow: { en: 'Snow', de: 'Schnee', sl: 'Sneg' }, thunder: { en: 'Thunderstorm', de: 'Gewitter', sl: 'Nevihta' },
}
export const conditionLabel = (cat, lang) => (LABELS[cat] || LABELS.clouds)[lang] || LABELS[cat].en

// openweathermap condition id -> wmo code, so every source speaks the same language
function owmToWmo(id) {
  if (id == null) return 3
  if (id >= 200 && id < 300) return 95
  if (id >= 300 && id < 400) return 53
  if (id === 511) return 66
  if (id >= 500 && id < 532) return id >= 520 ? 81 : 63
  if (id >= 600 && id < 700) return 73
  if (id >= 700 && id < 800) return 45
  if (id === 800) return 0
  if (id === 801) return 1
  if (id === 802) return 2
  return 3
}

const num = a => a.filter(v => typeof v === 'number' && !Number.isNaN(v))
const mean = a => a.reduce((x, y) => x + y, 0) / a.length
const std = a => { const m = mean(a); return Math.sqrt(mean(a.map(v => (v - m) ** 2))) }
const median = a => { const v = num(a); if (!v.length) return NaN; const s = [...v].sort((x, y) => x - y); const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2 }
// drop the single lowest and highest reading once there are enough models, so a
// model that is far off cannot drag the consensus. this is dynamic, per-call
// outlier rejection: no model is ever banned, the extremes just sit out each call.
const trimmed = a => { const v = num(a); if (v.length >= 6) { const s = [...v].sort((x, y) => x - y); return s.slice(1, -1) } return v }
const robustMean = a => { const t = trimmed(a); return t.length ? mean(t) : NaN }
const mode = a => {
  const c = {}; let best = a[0], n = 0
  for (const v of a) { c[v] = (c[v] || 0) + 1; if (c[v] > n) { n = c[v]; best = v } }
  return best
}

export async function geocode(name, lang = 'en') {
  const u = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=6&language=${lang}&format=json`
  const r = await fetch(u)
  if (!r.ok) throw new Error('geocode failed')
  const j = await r.json()
  return (j.results || []).map(x => ({
    name: x.name, country: x.country, countryCode: x.country_code,
    admin: x.admin1, lat: x.latitude, lon: x.longitude,
  }))
}

async function fetchOpenMeteo(lat, lon) {
  // multi-model suffixing only works on hourly, so pull hourly and read the current hour
  const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m&hourly=${CUR.join(',')}&models=${OM_MODELS.join(',')}&forecast_days=1&timezone=auto`
  const r = await fetch(u)
  if (!r.ok) throw new Error('open-meteo failed')
  const d = await r.json()
  const h = d.hourly || {}, times = h.time || []
  const ref = (d.current?.time || '').slice(0, 13) + ':00' // this hour, on the hour
  let i = times.indexOf(ref)
  if (i < 0) i = Math.max(0, times.length - 1)
  const at = k => (Array.isArray(h[k]) ? h[k][i] : undefined)
  const out = []
  for (const m of OM_MODELS) {
    const t = at(`temperature_2m_${m}`)
    if (typeof t !== 'number') continue // this model has no data for the spot
    out.push({
      id: m, label: OM_LABELS[m] || m, provider: 'Open-Meteo', type: 'raw',
      tempC: t, feelsC: at(`apparent_temperature_${m}`), humidity: at(`relative_humidity_2m_${m}`),
      precip: at(`precipitation_${m}`), code: at(`weather_code_${m}`), cloud: at(`cloud_cover_${m}`),
      windKph: at(`wind_speed_10m_${m}`), windDir: at(`wind_direction_10m_${m}`), isDay: at(`is_day_${m}`),
      pressure: at(`surface_pressure_${m}`), gustKph: at(`wind_gusts_10m_${m}`),
      dewC: at(`dew_point_2m_${m}`), visibility: at(`visibility_${m}`), uv: at(`uv_index_${m}`),
    })
  }
  return out
}

async function fetchOWM(lat, lon, key) {
  if (!key) return []
  try {
    const u = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
    const r = await fetch(u)
    if (!r.ok) return []
    const j = await r.json()
    const day = j.sys && j.dt ? j.dt > j.sys.sunrise && j.dt < j.sys.sunset : 1
    return [{
      id: 'owm', label: 'OpenWeatherMap', provider: 'OpenWeatherMap', type: 'api',
      tempC: j.main?.temp, feelsC: j.main?.feels_like, humidity: j.main?.humidity,
      precip: j.rain?.['1h'] ?? j.snow?.['1h'] ?? 0, code: owmToWmo(j.weather?.[0]?.id),
      cloud: j.clouds?.all, windKph: (j.wind?.speed ?? 0) * 3.6, windDir: j.wind?.deg, isDay: day ? 1 : 0,
    }]
  } catch { return [] }
}

// 7-day outlook + sun times + daily maxima, from open-meteo best_match
async function fetchDaily(lat, lon) {
  try {
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max` +
      `&forecast_days=7&timezone=auto`
    const r = await fetch(u)
    if (!r.ok) return { days: [], sun: null }
    const d = (await r.json()).daily
    if (!d) return { days: [], sun: null }
    const days = d.time.map((t, i) => ({
      date: t, code: d.weather_code[i], max: d.temperature_2m_max[i], min: d.temperature_2m_min[i],
      pop: d.precipitation_probability_max?.[i], uvMax: d.uv_index_max?.[i],
    }))
    const sun = { sunrise: d.sunrise?.[0], sunset: d.sunset?.[0], uvMax: d.uv_index_max?.[0] }
    return { days, sun }
  } catch { return { days: [], sun: null } }
}

// hourly best_match series, from the current hour forward, for the strip and predictions
async function fetchHourly(lat, lon) {
  try {
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&hourly=temperature_2m,apparent_temperature,precipitation,precipitation_probability,weather_code,wind_speed_10m,wind_gusts_10m,is_day` +
      `&current=temperature_2m&forecast_hours=25&timezone=auto`
    const r = await fetch(u)
    if (!r.ok) return []
    const j = await r.json()
    const h = j.hourly || {}
    const times = h.time || []
    const ref = (j.current?.time || '').slice(0, 13)
    let start = times.findIndex(t => t.slice(0, 13) >= ref)
    if (start < 0) start = 0
    return times.slice(start).map((t, k) => {
      const i = start + k
      return {
        time: t, hour: Number(t.slice(11, 13)),
        tempC: h.temperature_2m?.[i], feelsC: h.apparent_temperature?.[i],
        precip: h.precipitation?.[i], pop: h.precipitation_probability?.[i],
        code: h.weather_code?.[i], windKph: h.wind_speed_10m?.[i], gustKph: h.wind_gusts_10m?.[i],
        isDay: h.is_day?.[i] !== 0,
      }
    })
  } catch { return [] }
}

// per-model hourly precip + weather code, for a model-averaged onset time.
// returns { hours:[iso...], perModel:{ id:{precip,code} } } from the current hour.
async function fetchModelHourly(lat, lon) {
  try {
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&hourly=precipitation,weather_code&models=${OM_MODELS.join(',')}&current=temperature_2m&forecast_hours=18&timezone=auto`
    const r = await fetch(u)
    if (!r.ok) return null
    const j = await r.json()
    const h = j.hourly || {}
    const times = h.time || []
    const ref = (j.current?.time || '').slice(0, 13)
    let start = times.findIndex(t => t.slice(0, 13) >= ref)
    if (start < 0) start = 0
    const hours = times.slice(start)
    const perModel = {}
    for (const m of OM_MODELS) {
      const precip = h[`precipitation_${m}`]
      const code = h[`weather_code_${m}`]
      if (!Array.isArray(precip) && !Array.isArray(code)) continue
      perModel[m] = { precip: precip ? precip.slice(start) : null, code: code ? code.slice(start) : null }
    }
    return { hours, perModel }
  } catch { return null }
}

// across the models, when does the event first appear? average those onset
// times and take the spread as the error. returns { agree, whenMin, sdMin } where
// whenMin is minutes from the first future hour, or null if too few models agree.
function onsetStats(modelHourly, wantCats) {
  if (!modelHourly) return null
  const { hours, perModel } = modelHourly
  if (!hours || hours.length < 2) return null
  const onsets = []
  let total = 0
  for (const id in perModel) {
    const { precip, code } = perModel[id]
    if (!Array.isArray(precip) && !Array.isArray(code)) continue
    total++ // this model covers the spot and gets a vote
    for (let k = 1; k < hours.length; k++) {
      const c = code && code[k] != null ? category(code[k]) : null
      const wet = (c && wantCats.has(c)) || (precip && precip[k] >= 0.2)
      if (wet) { onsets.push(k * 60); break } // minutes from the first future hour
    }
  }
  if (onsets.length < 3 || total < 5) return null
  // frac = share of covering models that see the event at all -> the real "chance"
  return { agree: onsets.length, total, frac: onsets.length / total, whenMin: mean(onsets), sdMin: std(onsets) }
}

// add mean minutes to a base "YYYY-MM-DDTHH:MM" string, return "HH:MM" (rounded to 5)
function clockPlus(baseIso, addMin) {
  const base = Number(baseIso.slice(11, 13)) * 60 + Number(baseIso.slice(14, 16))
  let mins = Math.round((base + addMin) / 5) * 5
  mins = ((mins % 1440) + 1440) % 1440
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
}

// scan the next hours for plausible, worth-mentioning changes.
// returns [{ kind, cat, hoursAway, en, de, detail:{en,de} }]
export function predictEvents(hourly, nowCat, modelHourly) {
  if (!hourly || hourly.length < 2) return []
  const out = []
  const wetCats = new Set(['rain', 'drizzle', 'thunder'])
  const nowWet = wetCats.has(nowCat)

  // rain starting within the window - surfaced only when a strong majority of the
  // models agree, so the chance shown is a real one, not a coin-flip.
  const firstWet = hourly.findIndex((h, i) => i > 0 && wetCats.has(category(h.code)))
  if (!nowWet && firstWet > 0 && firstWet <= 12) {
    const h = hourly[firstWet], c = category(h.code)
    // each noun carries its Slovenian gender so the adjective agrees:
    // dez (m) verjeten, rosenje (n) verjetno, nevihta (f) verjetna; slAcc = accusative.
    const N = {
      rain: { en: 'Rain', de: 'Regen', sl: 'Dež', slAdj: 'verjeten', slAcc: 'dež' },
      drizzle: { en: 'Drizzle', de: 'Nieselregen', sl: 'Rosenje', slAdj: 'verjetno', slAcc: 'rosenje' },
      thunder: { en: 'A storm', de: 'Ein Gewitter', sl: 'Nevihta', slAdj: 'verjetna', slAcc: 'nevihto' },
    }
    const noun = N[c] || N.rain
    const wantCats = c === 'thunder' ? new Set(['thunder']) : new Set(['rain', 'drizzle', 'thunder'])
    const os = onsetStats(modelHourly, wantCats)
    const base = modelHourly?.hours?.[0] || hourly[0]?.time
    // gate: at least 60% of the covering models must see it, or we say nothing.
    if (os && base && os.frac >= 0.6) {
      const chance = Math.round(os.frac * 100)
      const precise = os.sdMin <= 90 // models cluster tightly enough for a clock time
      const at = precise ? clockPlus(base, os.whenMin) : labelHour(h.time)
      const err = Math.max(5, Math.round(os.sdMin / 5) * 5)
      const chip = {
        en: precise ? `${noun.en} likely around ${at}` : `${noun.en} likely in ${firstWet}h`,
        de: precise ? `${noun.de} wahrscheinlich gegen ${at}` : `${noun.de} wahrscheinlich in ${firstWet} Std`,
        sl: precise ? `${noun.sl} ${noun.slAdj} okoli ${at}` : `${noun.sl} ${noun.slAdj} čez ${firstWet} h`,
      }
      const det = {
        en: `${os.agree} of ${os.total} models agree (${chance}% chance)${precise ? `, ${noun.en.toLowerCase()} near ${at}, ±${err} min` : `, ${noun.en.toLowerCase()} around ${at}`}. Worth an umbrella.`,
        de: `${os.agree} von ${os.total} Modellen stimmen überein (${chance}% Wahrscheinlichkeit)${precise ? `, ${noun.de.toLowerCase()} gegen ${at}, ±${err} Min` : `, ${noun.de.toLowerCase()} gegen ${at}`}. Schirm einpacken.`,
        sl: `${os.agree} od ${os.total} modelov se ujema (${chance} % verjetnost)${precise ? `, ${noun.slAcc} okoli ${at}, ±${err} min` : `, ${noun.slAcc} okoli ${at}`}. Splača se vzeti dežnik.`,
      }
      out.push({ kind: 'precip-start', cat: c, hoursAway: firstWet, chance, en: chip.en, de: chip.de, sl: chip.sl, detail: det })
    }
  }
  if (nowWet) {
    const firstDry = hourly.findIndex((h, i) => i > 0 && !wetCats.has(category(h.code)))
    if (firstDry > 0 && firstDry <= 12) {
      out.push({
        kind: 'precip-stop', cat: 'partly', hoursAway: firstDry,
        en: `Drying up in ${firstDry}h`, de: `Wird trocken in ${firstDry} Std`, sl: `Postane suho čez ${firstDry} h`,
        detail: {
          en: `Precipitation should ease around ${labelHour(hourly[firstDry].time)}.`,
          de: `Der Niederschlag lässt gegen ${labelHour(hourly[firstDry].time)} nach.`,
          sl: `Padavine naj bi ponehale okoli ${labelHour(hourly[firstDry].time)}.`,
        },
      })
    }
  }

  // sharp temperature move over the next 6h
  const window = hourly.slice(0, Math.min(hourly.length, 7))
  const temps = window.map(h => h.tempC).filter(v => typeof v === 'number')
  if (temps.length > 2) {
    const delta = temps[temps.length - 1] - temps[0]
    if (delta <= -5) {
      out.push({
        kind: 'temp-drop', cat: nowCat, hoursAway: window.length - 1,
        en: `Getting colder ${Math.round(delta)}°`, de: `Wird kälter ${Math.round(delta)}°`, sl: `Postaja hladneje ${Math.round(delta)}°`,
        detail: { en: `Temperature falls about ${Math.abs(Math.round(delta))}° over the next few hours.`, de: `Die Temperatur fällt in den nächsten Stunden um etwa ${Math.abs(Math.round(delta))}°.`, sl: `Temperatura v naslednjih urah pade za približno ${Math.abs(Math.round(delta))}°.` },
      })
    } else if (delta >= 5) {
      out.push({
        kind: 'temp-rise', cat: nowCat, hoursAway: window.length - 1,
        en: `Getting warmer +${Math.round(delta)}°`, de: `Wird wärmer +${Math.round(delta)}°`, sl: `Postaja topleje +${Math.round(delta)}°`,
        detail: { en: `Temperature climbs about ${Math.round(delta)}° over the next few hours.`, de: `Die Temperatur steigt in den nächsten Stunden um etwa ${Math.round(delta)}°.`, sl: `Temperatura v naslednjih urah naraste za približno ${Math.round(delta)}°.` },
      })
    }
  }

  // gust spike
  const gustPeak = window.reduce((m, h) => (typeof h.gustKph === 'number' && h.gustKph > m.v ? { v: h.gustKph, h } : m), { v: 0, h: null })
  if (gustPeak.v >= 45) {
    out.push({
      kind: 'wind', cat: nowCat, hoursAway: 0,
      en: `Gusts up to ${Math.round(gustPeak.v)} km/h`, de: `Böen bis ${Math.round(gustPeak.v)} km/h`, sl: `Sunki do ${Math.round(gustPeak.v)} km/h`,
      detail: { en: `Wind gusts peak near ${Math.round(gustPeak.v)} km/h around ${labelHour(gustPeak.h.time)}.`, de: `Windböen erreichen etwa ${Math.round(gustPeak.v)} km/h gegen ${labelHour(gustPeak.h.time)}.`, sl: `Sunki vetra dosežejo približno ${Math.round(gustPeak.v)} km/h okoli ${labelHour(gustPeak.h.time)}.` },
    })
  }

  return out.slice(0, 3)
}

function labelHour(iso) {
  const hh = iso.slice(11, 16)
  return hh
}

// robustly average the raw-model samples (outliers trimmed) and blend with the
// api samples. raw is weighted higher, it is many independent national models.
const blendField = (rawVals, apiVals) => {
  const r = num(rawVals), a = num(apiVals)
  if (!r.length && !a.length) return NaN
  if (!a.length) return robustMean(r)
  if (!r.length) return mean(a)
  return robustMean(r) * 0.7 + mean(a) * 0.3
}

// freshest single-model "now" reading (open-meteo best_match). used to anchor the
// headline temperature to the present moment instead of an hourly average, which
// is what makes "now" and the next hour actually match the sky outside.
async function fetchNow(lat, lon) {
  try {
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature&timezone=auto`
    const r = await fetch(u); if (!r.ok) return null
    const j = await r.json()
    const t = j.current?.temperature_2m
    return typeof t === 'number' ? { tempC: t, feelsC: j.current?.apparent_temperature } : null
  } catch { return null }
}

// official emergency alerts for the location, from the US National Weather Service
// (api.weather.gov: free, CORS-enabled, no key). returns real Tornado / Hurricane /
// Flood / Winter Storm warnings inside the US and its territories, and [] elsewhere,
// where aggregate() falls back to the model-derived warnings below. known event
// names are mapped to all three languages; anything else shows the official English.
const NWS_MAP = {
  'Tornado Warning': ['Tornado warning', 'Tornadowarnung', 'Opozorilo pred tornadom'],
  'Tornado Watch': ['Tornado watch', 'Tornado-Bereitschaft', 'Pripravljenost na tornado'],
  'Hurricane Warning': ['Hurricane warning', 'Hurrikanwarnung', 'Opozorilo pred orkanom'],
  'Hurricane Watch': ['Hurricane watch', 'Hurrikan-Bereitschaft', 'Pripravljenost na orkan'],
  'Tropical Storm Warning': ['Tropical storm warning', 'Tropensturmwarnung', 'Opozorilo pred tropskim viharjem'],
  'Severe Thunderstorm Warning': ['Severe thunderstorm', 'Schweres Gewitter', 'Huda nevihta'],
  'Flood Warning': ['Flood warning', 'Hochwasserwarnung', 'Opozorilo pred poplavami'],
  'Flash Flood Warning': ['Flash flood warning', 'Sturzflutwarnung', 'Opozorilo pred hudournikom'],
  'Winter Storm Warning': ['Winter storm warning', 'Wintersturmwarnung', 'Opozorilo pred snežnim viharjem'],
  'Blizzard Warning': ['Blizzard warning', 'Blizzardwarnung', 'Opozorilo pred snežnim metežem'],
  'Excessive Heat Warning': ['Extreme heat warning', 'Extreme Hitzewarnung', 'Opozorilo pred izjemno vročino'],
  'Heat Advisory': ['Heat advisory', 'Hitzewarnung', 'Opozorilo pred vročino'],
  'High Wind Warning': ['High wind warning', 'Sturmwarnung', 'Opozorilo pred močnim vetrom'],
  'Wind Advisory': ['Wind advisory', 'Windwarnung', 'Opozorilo pred vetrom'],
  'Red Flag Warning': ['Fire weather warning', 'Waldbrandwarnung', 'Opozorilo pred požari'],
}
async function fetchAlerts(lat, lon) {
  try {
    const u = `https://api.weather.gov/alerts/active?point=${lat.toFixed(4)},${lon.toFixed(4)}`
    const r = await fetch(u, { headers: { Accept: 'application/geo+json' } })
    if (!r.ok) return []
    const j = await r.json()
    const seen = new Set(), out = []
    for (const feat of j.features || []) {
      const p = feat.properties || {}
      const ev = p.event || ''
      if (!ev || seen.has(ev)) continue
      seen.add(ev)
      const sev = (p.severity === 'Extreme' || p.severity === 'Severe') ? 'severe' : 'warn'
      const m = NWS_MAP[ev]
      out.push({ id: 'nws-' + ev.replace(/\s+/g, '-').toLowerCase(), sev, official: true, en: m ? m[0] : ev, de: m ? m[1] : ev, sl: m ? m[2] : ev })
    }
    return out.slice(0, 4)
  } catch { return [] }
}

// severe-weather warnings derived from the consensus for this location. we only
// raise one when the averaged value (and the near-term hourly best_match) crosses
// a threshold, so a single wild model cannot trigger a false alarm. each carries a
// severity (severe = red, warn = amber) and the same phrasing in all three langs.
// note: tornado and earthquake are not derivable from forecast data, so they are
// out of scope; this covers the conditions the models can reliably indicate.
function buildWarnings({ cat, tempC, feelsC, gustKph, precip, visibility, hourly }) {
  const W = []
  const add = (id, sev, en, de, sl) => W.push({ id, sev, en, de, sl })
  const near = (hourly || []).slice(0, 12)
  const gust = Math.max(gustKph || 0, ...near.map(h => h.gustKph || 0))
  const rain = Math.max(precip || 0, ...near.map(h => h.precip || 0))
  if (gust >= 118) add('wind', 'severe', 'Hurricane-force winds', 'Orkanartige Winde', 'Orkanski vetrovi')
  else if (gust >= 90) add('wind', 'severe', 'Damaging winds', 'Sturmschäden möglich', 'Škodljiv veter')
  else if (gust >= 62) add('wind', 'warn', 'Gale-force gusts', 'Sturmböen', 'Sunki viharja')
  if (cat === 'thunder') add('storm', 'severe', 'Thunderstorm', 'Gewitter', 'Nevihta')
  if (rain >= 15) add('rain', 'warn', 'Heavy rain, flooding possible', 'Starkregen, Überflutung möglich', 'Močan dež, možne poplave')
  if (cat === 'snow' && rain >= 5) add('snow', 'warn', 'Heavy snowfall', 'Starker Schneefall', 'Močno sneženje')
  if (typeof tempC === 'number' && tempC >= 35) add('heat', 'warn', 'Extreme heat', 'Extreme Hitze', 'Izjemna vročina')
  else if (typeof feelsC === 'number' && feelsC <= -15) add('cold', 'warn', 'Extreme cold', 'Extreme Kälte', 'Izjemen mraz')
  if (typeof visibility === 'number' && visibility < 200) add('fog', 'warn', 'Dense fog', 'Dichter Nebel', 'Gosta megla')
  return W
}

// fetch everything in parallel, then average raw data with api data
export async function aggregate(lat, lon, owmKey) {
  const [om, owm, dailyRes, hourly, modelHourly, now, alerts] = await Promise.all([
    fetchOpenMeteo(lat, lon), fetchOWM(lat, lon, owmKey), fetchDaily(lat, lon), fetchHourly(lat, lon), fetchModelHourly(lat, lon), fetchNow(lat, lon), fetchAlerts(lat, lon),
  ])
  const daily = dailyRes.days || []
  const sun = dailyRes.sun || null
  const sources = [...om, ...owm].filter(s => typeof s.tempC === 'number')
  if (!sources.length) throw new Error('no sources returned')
  const raw = sources.filter(s => s.type === 'raw'), api = sources.filter(s => s.type === 'api')
  const f = k => blendField(raw.map(s => s[k]), api.map(s => s[k])) // blended field getter

  const temps = num(sources.map(s => s.tempC))
  const cats = sources.map(s => category(s.code))
  const cat = mode(cats)
  const agree = cats.filter(c => c === cat).length / cats.length
  const spread = std(temps)            // full spread, shown as the honest model range
  const coreSpread = std(trimmed(temps)) // outliers removed, drives the confidence read
  // confident when the models agree on the condition and cluster on temperature
  const confidence = Math.round(Math.max(0, Math.min(1, 0.6 * agree + 0.4 * (1 - Math.min(coreSpread / 4, 1)))) * 100)

  const nowCat = cat
  const predictions = predictEvents(hourly, nowCat, modelHourly)

  // anchor the headline temperature to the freshest reading. the robust consensus
  // still carries half the weight, so the ensemble identity holds, but the number
  // now tracks the present hour rather than lagging it.
  let tempC = f('tempC')
  if (now && typeof now.tempC === 'number' && Number.isFinite(tempC)) tempC = tempC * 0.5 + now.tempC * 0.5
  let feelsC = f('feelsC') || tempC
  if (now && typeof now.feelsC === 'number' && Number.isFinite(feelsC)) feelsC = feelsC * 0.5 + now.feelsC * 0.5

  return {
    count: sources.length, rawCount: raw.length, apiCount: api.length,
    tempC, tempMin: Math.min(...temps), tempMax: Math.max(...temps), spread,
    feelsC,
    humidity: Math.round(f('humidity')),
    precip: f('precip') || 0,
    cloud: Math.round(f('cloud')),
    windKph: f('windKph'),
    windDir: Math.round(f('windDir')),
    gustKph: f('gustKph'),
    pressure: Math.round(f('pressure')),
    dewC: f('dewC'),
    visibility: f('visibility'),
    uv: f('uv') ?? sun?.uvMax,
    isDay: mode(sources.map(s => s.isDay)) !== 0,
    category: cat, agreement: agree, confidence, daily, sun, hourly, predictions,
    // official emergency alerts for this exact point take priority; only if none are
    // returned do we fall back to the reliable model-derived warnings.
    warnings: (alerts && alerts.length) ? alerts : buildWarnings({ cat, tempC, feelsC, gustKph: f('gustKph'), precip: f('precip') || 0, visibility: f('visibility'), hourly }),
    sources: sources.map(s => ({ ...s, cat: category(s.code) })),
  }
}

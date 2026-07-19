// multi-source forecast aggregation, keyless-first
// backbone: 15 national-service models via open-meteo, each an independent forecast
// plus openweathermap as a 16th provider when a key is present

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
  clear: { en: 'Clear', de: 'Klar' }, partly: { en: 'Partly cloudy', de: 'Teils bewölkt' },
  clouds: { en: 'Cloudy', de: 'Bewölkt' }, fog: { en: 'Fog', de: 'Nebel' },
  drizzle: { en: 'Drizzle', de: 'Nieselregen' }, rain: { en: 'Rain', de: 'Regen' },
  snow: { en: 'Snow', de: 'Schnee' }, thunder: { en: 'Thunderstorm', de: 'Gewitter' },
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
  for (const id in perModel) {
    const { precip, code } = perModel[id]
    for (let k = 1; k < hours.length; k++) {
      const c = code && code[k] != null ? category(code[k]) : null
      const wet = (c && wantCats.has(c)) || (precip && precip[k] >= 0.2)
      if (wet) { onsets.push(k * 60); break } // minutes from the first future hour
    }
  }
  if (onsets.length < 3) return null
  const m = mean(onsets)
  const sd = std(onsets)
  return { agree: onsets.length, whenMin: m, sdMin: sd }
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

  // rain starting / stopping within the window
  const firstWet = hourly.findIndex((h, i) => i > 0 && wetCats.has(category(h.code)) && (h.pop == null || h.pop >= 40))
  if (!nowWet && firstWet > 0 && firstWet <= 12) {
    const h = hourly[firstWet], c = category(h.code)
    const noun = { rain: ['Rain', 'Regen'], drizzle: ['Drizzle', 'Nieselregen'], thunder: ['A storm', 'Ein Gewitter'] }[c] || ['Rain', 'Regen']
    const wantCats = c === 'thunder' ? new Set(['thunder']) : new Set(['rain', 'drizzle', 'thunder'])
    const os = onsetStats(modelHourly, wantCats)
    const base = modelHourly?.hours?.[0] || hourly[0]?.time
    let chip, det
    if (os && base) {
      const at = clockPlus(base, os.whenMin)
      const err = Math.max(5, Math.round(os.sdMin / 5) * 5)
      chip = { en: `${noun[0]} likely around ${at}`, de: `${noun[1]} wahrscheinlich gegen ${at}` }
      det = {
        en: `${os.agree} models put ${noun[0].toLowerCase()} near ${at}, give or take ${err} min${h.pop != null ? `, ${h.pop}% chance` : ''}. Worth an umbrella.`,
        de: `${os.agree} Modelle sehen ${noun[1].toLowerCase()} gegen ${at}, ±${err} Min${h.pop != null ? `, ${h.pop}% Wahrscheinlichkeit` : ''}. Schirm einpacken.`,
      }
    } else {
      chip = { en: `${noun[0]} likely in ${firstWet}h`, de: `${noun[1]} wahrscheinlich in ${firstWet} Std` }
      det = {
        en: `Models point to ${noun[0].toLowerCase()} starting around ${labelHour(h.time)}${h.pop != null ? `, ${h.pop}% chance` : ''}. Worth an umbrella.`,
        de: `Modelle deuten auf ${noun[1].toLowerCase()} ab etwa ${labelHour(h.time)}${h.pop != null ? `, ${h.pop}% Wahrscheinlichkeit` : ''}. Schirm einpacken.`,
      }
    }
    out.push({ kind: 'precip-start', cat: c, hoursAway: firstWet, en: chip.en, de: chip.de, detail: det })
  }
  if (nowWet) {
    const firstDry = hourly.findIndex((h, i) => i > 0 && !wetCats.has(category(h.code)))
    if (firstDry > 0 && firstDry <= 12) {
      out.push({
        kind: 'precip-stop', cat: 'partly', hoursAway: firstDry,
        en: `Drying up in ${firstDry}h`, de: `Trocken in ${firstDry} Std`,
        detail: {
          en: `The wet spell should ease around ${labelHour(hourly[firstDry].time)}.`,
          de: `Der Niederschlag laesst gegen ${labelHour(hourly[firstDry].time)} nach.`,
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
        en: `Turning colder, ${Math.round(delta)}°`, de: `Kaelter, ${Math.round(delta)}°`,
        detail: { en: `Temperature falls about ${Math.abs(Math.round(delta))}° over the next few hours.`, de: `Die Temperatur faellt in den naechsten Stunden um etwa ${Math.abs(Math.round(delta))}°.` },
      })
    } else if (delta >= 5) {
      out.push({
        kind: 'temp-rise', cat: nowCat, hoursAway: window.length - 1,
        en: `Warming up, +${Math.round(delta)}°`, de: `Waermer, +${Math.round(delta)}°`,
        detail: { en: `Temperature climbs about ${Math.round(delta)}° over the next few hours.`, de: `Die Temperatur steigt in den naechsten Stunden um etwa ${Math.round(delta)}°.` },
      })
    }
  }

  // gust spike
  const gustPeak = window.reduce((m, h) => (typeof h.gustKph === 'number' && h.gustKph > m.v ? { v: h.gustKph, h } : m), { v: 0, h: null })
  if (gustPeak.v >= 45) {
    out.push({
      kind: 'wind', cat: nowCat, hoursAway: 0,
      en: `Gusts up to ${Math.round(gustPeak.v)} km/h`, de: `Boeen bis ${Math.round(gustPeak.v)} km/h`,
      detail: { en: `Wind gusts peak near ${Math.round(gustPeak.v)} km/h around ${labelHour(gustPeak.h.time)}.`, de: `Windboeen erreichen etwa ${Math.round(gustPeak.v)} km/h gegen ${labelHour(gustPeak.h.time)}.` },
    })
  }

  return out.slice(0, 3)
}

function labelHour(iso) {
  const hh = iso.slice(11, 16)
  return hh
}

// average the raw-model samples and the api samples separately, then blend.
// raw is weighted higher, it is many independent national-model calculations
const blendField = (rawVals, apiVals) => {
  const r = num(rawVals), a = num(apiVals)
  if (!r.length && !a.length) return NaN
  if (!a.length) return mean(r)
  if (!r.length) return mean(a)
  return mean(r) * 0.6 + mean(a) * 0.4
}

// fetch everything in parallel, then average raw data with api data
export async function aggregate(lat, lon, owmKey) {
  const [om, owm, dailyRes, hourly, modelHourly] = await Promise.all([
    fetchOpenMeteo(lat, lon), fetchOWM(lat, lon, owmKey), fetchDaily(lat, lon), fetchHourly(lat, lon), fetchModelHourly(lat, lon),
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
  const spread = std(temps)
  // confident when the models agree on the condition and cluster on temperature
  const confidence = Math.round(Math.max(0, Math.min(1, 0.6 * agree + 0.4 * (1 - Math.min(spread / 4, 1)))) * 100)

  const nowCat = cat
  const predictions = predictEvents(hourly, nowCat, modelHourly)

  return {
    count: sources.length, rawCount: raw.length, apiCount: api.length,
    tempC: f('tempC'), tempMin: Math.min(...temps), tempMax: Math.max(...temps), spread,
    feelsC: f('feelsC') || f('tempC'),
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
    sources: sources.map(s => ({ ...s, cat: category(s.code) })),
  }
}

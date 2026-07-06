// multi-source forecast aggregation, keyless-first
// backbone: 15 national-service models via open-meteo, each an independent forecast
// plus openweathermap as a 16th provider when a key is present

const OM_MODELS = [
  'ecmwf_ifs025', 'ecmwf_aifs025', 'gfs_seamless', 'gfs_graphcast025', 'icon_seamless',
  'gem_seamless', 'meteofrance_seamless', 'jma_seamless', 'metno_seamless', 'ukmo_seamless',
  'knmi_seamless', 'dmi_seamless', 'bom_access_global', 'cma_grapes_global', 'italia_meteo_arpae_icon_2i',
]

// pretty names + the weather service behind each model
const OM_LABELS = {
  ecmwf_ifs025: 'ECMWF IFS', ecmwf_aifs025: 'ECMWF AIFS', gfs_seamless: 'NOAA GFS',
  gfs_graphcast025: 'GraphCast', icon_seamless: 'DWD ICON', gem_seamless: 'ECCC GEM',
  meteofrance_seamless: 'Meteo-France', jma_seamless: 'JMA', metno_seamless: 'MET Norway',
  ukmo_seamless: 'UK Met Office', knmi_seamless: 'KNMI', dmi_seamless: 'DMI',
  bom_access_global: 'BOM ACCESS', cma_grapes_global: 'CMA GRAPES', italia_meteo_arpae_icon_2i: 'ItaliaMeteo',
}

const CUR = ['temperature_2m', 'apparent_temperature', 'relative_humidity_2m', 'precipitation',
  'weather_code', 'cloud_cover', 'wind_speed_10m', 'wind_direction_10m', 'is_day']

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
  const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=${CUR.join(',')}&models=${OM_MODELS.join(',')}&timezone=auto`
  const r = await fetch(u)
  if (!r.ok) throw new Error('open-meteo failed')
  const c = (await r.json()).current || {}
  const out = []
  for (const m of OM_MODELS) {
    const t = c[`temperature_2m_${m}`]
    if (t == null) continue // model has no coverage here, skip it honestly
    out.push({
      id: m, label: OM_LABELS[m] || m, provider: 'Open-Meteo', type: 'raw',
      tempC: t, feelsC: c[`apparent_temperature_${m}`], humidity: c[`relative_humidity_2m_${m}`],
      precip: c[`precipitation_${m}`], code: c[`weather_code_${m}`], cloud: c[`cloud_cover_${m}`],
      windKph: c[`wind_speed_10m_${m}`], windDir: c[`wind_direction_10m_${m}`], isDay: c[`is_day_${m}`],
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

// a simple 7-day outlook from open-meteo best_match, for the strip
async function fetchDaily(lat, lon) {
  try {
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`
    const r = await fetch(u)
    if (!r.ok) return []
    const d = (await r.json()).daily
    if (!d) return []
    return d.time.map((t, i) => ({ date: t, code: d.weather_code[i], max: d.temperature_2m_max[i], min: d.temperature_2m_min[i] }))
  } catch { return [] }
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
  const [om, owm, daily] = await Promise.all([fetchOpenMeteo(lat, lon), fetchOWM(lat, lon, owmKey), fetchDaily(lat, lon)])
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

  return {
    count: sources.length, rawCount: raw.length, apiCount: api.length,
    tempC: f('tempC'), tempMin: Math.min(...temps), tempMax: Math.max(...temps), spread,
    feelsC: f('feelsC') || f('tempC'),
    humidity: Math.round(f('humidity')),
    precip: f('precip') || 0,
    cloud: Math.round(f('cloud')),
    windKph: f('windKph'),
    windDir: Math.round(f('windDir')),
    isDay: mode(sources.map(s => s.isDay)) !== 0,
    category: cat, agreement: agree, confidence, daily,
    sources: sources.map(s => ({ ...s, cat: category(s.code) })),
  }
}

// Registry of reputable forecast models, grouped by the national weather service
// that runs each one. This is the single place to add or remove a source.
//
// How it stays "always working": aggregate() requests every model in one call.
// Open-Meteo silently omits any id it does not recognise (no error), and the
// aggregator skips any model that returns no data for the requested location.
// So the global flagships carry every location worldwide, and the specialised
// high-res regional runs contribute extra samples only where they actually cover
// the spot. Nothing here can break a forecast; at worst a model sits out.
//
// Every entry is an operational model from a WMO national/international service
// or a peer-reviewed AI model, no scraped or low-quality sources.

export const MODEL_GROUPS = [
  { org: 'ECMWF', region: 'Europe / global', models: [
    ['ecmwf_ifs025', 'ECMWF IFS'],        // the global gold standard
    ['ecmwf_aifs025', 'ECMWF AIFS'],       // ECMWF's operational AI model
  ] },
  { org: 'NOAA', region: 'United States / global', models: [
    ['gfs_seamless', 'NOAA GFS'],
    ['gfs_global', 'NOAA GFS Global'],
    ['gfs_graphcast025', 'NOAA GraphCast'], // DeepMind/NOAA AI
  ] },
  { org: 'DWD', region: 'Germany / Europe', models: [
    ['icon_seamless', 'DWD ICON'],
    ['icon_global', 'DWD ICON Global'],
    ['icon_eu', 'DWD ICON-EU'],            // high-res Europe
    ['icon_d2', 'DWD ICON-D2'],            // very high-res central Europe
  ] },
  { org: 'ECCC', region: 'Canada / global', models: [
    ['gem_seamless', 'ECCC GEM'],
    ['gem_global', 'ECCC GEM Global'],
  ] },
  { org: 'Meteo-France', region: 'France / Europe', models: [
    ['meteofrance_seamless', 'Meteo-France'],
    ['meteofrance_arpege_seamless', 'MF ARPEGE'],
    ['meteofrance_arome_france_hd', 'MF AROME HD'], // high-res France
  ] },
  { org: 'JMA', region: 'Japan / global', models: [
    ['jma_seamless', 'JMA'],
    ['jma_gsm', 'JMA GSM'],
  ] },
  { org: 'MET Norway', region: 'Nordics', models: [
    ['metno_seamless', 'MET Norway'],
  ] },
  { org: 'UK Met Office', region: 'UK / global', models: [
    ['ukmo_seamless', 'UK Met Office'],
    ['ukmo_global_deterministic_10km', 'UKMO Global 10km'],
  ] },
  { org: 'KNMI', region: 'Netherlands / Europe', models: [
    ['knmi_seamless', 'KNMI'],
    ['knmi_harmonie_arome_europe', 'KNMI HARMONIE'], // high-res Europe
  ] },
  { org: 'DMI', region: 'Denmark / Europe', models: [
    ['dmi_seamless', 'DMI'],
    ['dmi_harmonie_arome_europe', 'DMI HARMONIE'],   // high-res Europe
  ] },
  { org: 'MeteoSwiss', region: 'Alps', models: [
    ['meteoswiss_icon_ch1', 'MeteoSwiss ICON-CH1'],  // 1 km alpine
    ['meteoswiss_icon_ch2', 'MeteoSwiss ICON-CH2'],  // 2 km alpine
  ] },
  { org: 'ItaliaMeteo', region: 'Italy / Adriatic', models: [
    ['italia_meteo_arpae_icon_2i', 'ItaliaMeteo ICON-2I'],
  ] },
  { org: 'KMA', region: 'Korea / global', models: [
    ['kma_seamless', 'KMA'],
    ['kma_gdps', 'KMA GDPS'],
  ] },
  { org: 'BOM', region: 'Australia / global', models: [
    ['bom_access_global', 'BOM ACCESS'],
  ] },
  { org: 'CMA', region: 'China / global', models: [
    ['cma_grapes_global', 'CMA GRAPES'],
  ] },
]

export const OM_MODELS = MODEL_GROUPS.flatMap(g => g.models.map(m => m[0]))
export const OM_LABELS = Object.fromEntries(MODEL_GROUPS.flatMap(g => g.models.map(m => [m[0], m[1]])))

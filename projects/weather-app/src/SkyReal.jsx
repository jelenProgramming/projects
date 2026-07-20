import { useMemo } from 'react'

// Hyperreal SVG sky. Photographic feel comes from real atmospheric gradients, a
// feTurbulence (Perlin) cloud layer with light + shadow passes, a bloomed sun with
// slow god rays, film grain and a vignette. Rain/snow are animated SVG particle
// tiles; thunder flashes. All motion is transform/opacity only (GPU friendly) and
// respects prefers-reduced-motion via the .reduce class on <html>.
// Techniques hand-built from researched tutorials (see AGENT-MEMORY.md). No canvas.

const WET = new Set(['rain', 'drizzle', 'thunder'])

const GRAD = {
  clear: { day: ['#124a92', '#2f78c4', '#6aa7dd', '#bcdcf2', '#eef1e6'], night: ['#070d20', '#0f1a3a', '#1d2b52', '#38466e'] },
  partly: { day: ['#1650a0', '#3f86cf', '#82b4e2', '#cfe4f5', '#e9f0ea'], night: ['#0a1230', '#152449', '#28396a', '#41527e'] },
  clouds: { day: ['#5f7285', '#8194a6', '#aebecb', '#d3dde5'], night: ['#141b28', '#232f40', '#3a4a5f'] },
  fog: { day: ['#9aa3ab', '#b7bfc6', '#d6dbe0', '#e6eaee'], night: ['#1a2028', '#2b333d', '#414a54'] },
  drizzle: { day: ['#54626f', '#71808d', '#97a4b0', '#b6c1cb'], night: ['#0f151c', '#1b2530', '#2f3a46'] },
  rain: { day: ['#20272e', '#33414b', '#51606c', '#77828d'], night: ['#0a0f16', '#151d27', '#28323e', '#3a4653'] },
  snow: { day: ['#5b6b7d', '#8598aa', '#b8c7d4', '#dde7ef'], night: ['#1a2634', '#2e4256', '#48627d'] },
  thunder: { day: ['#2b3038', '#3c434e', '#565d68', '#727a85'], night: ['#070a0f', '#12161d', '#20262f'] },
}
const CLOUD = {
  clear: { h: 300, freq: '0.008 0.016', a: -2.2, light: '#ffffff', shadow: '#8aa8c6', op: 0.65, seed: 3 },
  partly: { h: 340, freq: '0.008 0.015', a: -1.9, light: '#ffffff', shadow: '#88a4c0', op: 0.85, seed: 5 },
  clouds: { h: 470, freq: '0.007 0.013', a: -1.3, light: '#e9eef4', shadow: '#5f7286', op: 1, seed: 8 },
  fog: { h: 600, freq: '0.006 0.02', a: -0.6, light: '#dfe4e9', shadow: '#aab2ba', op: 0.9, seed: 9 },
  drizzle: { h: 440, freq: '0.006 0.012', a: -1.3, light: '#aeb9c3', shadow: '#3f4b57', op: 1, seed: 6 },
  rain: { h: 440, freq: '0.006 0.011', a: -1.4, light: '#9aa6b0', shadow: '#2c3843', op: 1, seed: 7 },
  snow: { h: 380, freq: '0.007 0.013', a: -1.5, light: '#eef4fa', shadow: '#9fb1c1', op: 1, seed: 11 },
  thunder: { h: 480, freq: '0.005 0.01', a: -1.2, light: '#6f7883', shadow: '#181c22', op: 1, seed: 13 },
}

const rnd = (a, b) => a + Math.random() * (b - a)

export default function SkyReal({ weather }) {
  const cat = weather?.category || 'clouds'
  const day = weather?.isDay ?? true
  const wind = weather?.windKph ?? 8
  const precip = weather?.precip ?? 0
  const tod = day ? 'day' : 'night'
  const stops = (GRAD[cat] || GRAD.clouds)[tod]
  const cl = CLOUD[cat] || CLOUD.clouds
  const clearish = cat === 'clear' || cat === 'partly'
  const wet = WET.has(cat)
  const heavy = Math.min(1, precip / 5)

  // particle tiles (memoised so they do not reshuffle each render)
  const streaks = useMemo(() => Array.from({ length: wet ? Math.round(60 + heavy * 60) : 0 }, () => ({
    x: rnd(-40, 840), y: rnd(0, 600), len: rnd(cat === 'drizzle' ? 8 : 14, cat === 'drizzle' ? 16 : 34),
    o: rnd(0.12, 0.42), w: rnd(0.8, 1.7),
  })), [cat, wet, heavy])
  const flakes = useMemo(() => Array.from({ length: cat === 'snow' ? 70 : 0 }, () => ({
    x: rnd(0, 800), y: rnd(0, 600), r: rnd(1.2, 3.2), o: rnd(0.5, 1), d: rnd(0, 6),
  })), [cat])
  const stars = useMemo(() => Array.from({ length: !day && clearish ? 110 : 0 }, () => ({
    x: rnd(0, 800), y: rnd(0, 360), r: rnd(0.3, 1.5), o: rnd(0.3, 1), d: rnd(0, 4),
  })), [day, clearish])

  const slant = Math.min(14, 4 + wind * 0.25)
  const fallDur = (cat === 'drizzle' ? 0.9 : 0.5) + (1 - heavy) * 0.3

  return (
    <svg className="sky" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="srSky" x1="0" y1="0" x2="0" y2="1">
          {stops.map((c, i) => <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />)}
        </linearGradient>
        <filter id="srClouds" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency={cl.freq} numOctaves="5" seed={cl.seed} result="n" />
          <feColorMatrix in="n" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${cl.a} 1.05`} result="a" />
          <feGaussianBlur in="a" stdDeviation="2.6" result="ab" />
          <feOffset in="ab" dx="5" dy="9" result="sh" />
          <feFlood floodColor={cl.shadow} result="sc" /><feComposite in="sc" in2="sh" operator="in" result="shc" />
          <feFlood floodColor={cl.light} result="lc" /><feComposite in="lc" in2="ab" operator="in" result="lcc" />
          <feMerge><feMergeNode in="shc" /><feMergeNode in="lcc" /></feMerge>
        </filter>
        <filter id="srGrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.035 0" /></filter>
        <radialGradient id="srSun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffef6" /><stop offset="0.22" stopColor="#fff6d8" />
          <stop offset="0.55" stopColor="#ffe9a8" stopOpacity="0.5" /><stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="srMoon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#eef2ff" /><stop offset="0.3" stopColor="#dfe6fb" stopOpacity="0.7" /><stop offset="1" stopColor="#dfe6fb" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="srVig" cx="0.5" cy="0.46" r="0.8">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor={day ? '#0a1c33' : '#000'} stopOpacity={wet || !day ? 0.4 : 0.26} />
        </radialGradient>
        <mask id="srCloudMask"><rect width="800" height={cl.h} fill="url(#srCloudMaskG)" /></mask>
        <linearGradient id="srCloudMaskG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={cat === 'fog' ? 0.9 : 0.35} />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" /><stop offset="0.85" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill="url(#srSky)" />

      {/* stars */}
      {stars.length > 0 && <g>{stars.map((s, i) =>
        <circle key={i} className="sr-star" cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} style={{ animationDelay: `${s.d}s` }} />)}</g>}

      {/* sun + god rays (day, clear-ish) */}
      {day && clearish && <>
        <rect width="800" height="600" fill="url(#srSun)" transform="translate(300 -120)" />
        <g className="sr-rays" style={{ transformOrigin: '600px 150px' }}>
          {Array.from({ length: 16 }, (_, i) => {
            const ang = (i / 16) * Math.PI * 2
            return <line key={i} x1={600 + Math.cos(ang) * 55} y1={150 + Math.sin(ang) * 55}
              x2={600 + Math.cos(ang) * 900} y2={150 + Math.sin(ang) * 900} stroke="#fff6d0" strokeOpacity="0.05" strokeWidth="18" />
          })}
        </g>
        <circle className="sr-bloom" cx="600" cy="150" r="46" fill="#fffdf3" style={{ transformOrigin: '600px 150px' }} />
      </>}

      {/* moon (night, clear-ish) */}
      {!day && clearish && <>
        <rect width="800" height="600" fill="url(#srMoon)" transform="translate(300 -150)" />
        <circle cx="600" cy="150" r="38" fill="#eff3ff" /><circle cx="612" cy="142" r="38" fill={stops[1]} opacity="0.35" />
      </>}

      {/* drifting clouds */}
      <g mask="url(#srCloudMask)" opacity={cl.op}>
        <g className="sr-clouds"><rect x="-200" width="1200" height={cl.h} filter="url(#srClouds)" /></g>
      </g>

      {/* rain: two stacked tiles translated for a seamless loop */}
      {wet && <g className="sr-rain" style={{ animationDuration: `${fallDur}s` }}>
        {[0, -600].map(off => <g key={off} transform={`translate(0 ${off})`}>
          {streaks.map((d, i) => <line key={i} x1={d.x} y1={d.y} x2={d.x + slant} y2={d.y + d.len}
            stroke={day ? '#dbe6f2' : '#aebccf'} strokeOpacity={d.o} strokeWidth={d.w} strokeLinecap="round" />)}
        </g>)}
      </g>}

      {/* snow */}
      {cat === 'snow' && <g className="sr-snow">
        {[0, -600].map(off => <g key={off} transform={`translate(0 ${off})`}>
          {flakes.map((f, i) => <circle key={i} cx={f.x} cy={f.y} r={f.r} fill="#fff" opacity={f.o} />)}
        </g>)}
      </g>}

      {/* thunder flash */}
      {cat === 'thunder' && <rect className="sr-flash" width="800" height="600" fill="#e9f0ff" />}

      {/* wet ground darkening */}
      {wet && <rect width="800" height="200" y="440" fill="url(#srGroundG)" />}
      <linearGradient id="srGroundG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0d1319" stopOpacity="0" /><stop offset="1" stopColor="#0d1319" stopOpacity="0.42" />
      </linearGradient>

      <rect width="800" height="600" fill="url(#srVig)" />
      <rect width="800" height="600" filter="url(#srGrain)" opacity="0.5" />
    </svg>
  )
}

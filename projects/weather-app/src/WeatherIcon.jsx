// coherent colorful weather icon set, one flat-with-gradient look across all
// conditions. driven by the same category strings the app already uses.
// pure inline svg, no dependencies.

const G = {
  sun: ['#ffd869', '#ffb020'],
  moon: ['#eef2ff', '#c7d2fe'],
  cloud: ['#eef2f7', '#b9c6d6'],
  cloudDark: ['#c3cede', '#8b9bb0'],
  rain: ['#7cc7ff', '#2f8fe0'],
  drop: ['#8fd2ff', '#3aa0e6'],
  snow: ['#ffffff', '#d7ecff'],
  bolt: ['#ffe066', '#ffB020'],
  fog: ['#d7dee8', '#aeb9c8'],
}

let uid = 0

function Defs({ id, stops }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={stops[0]} />
      <stop offset="1" stopColor={stops[1]} />
    </linearGradient>
  )
}

function Sun({ id, cx = 32, cy = 30, r = 13 }) {
  const rays = []
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const x1 = cx + Math.cos(a) * (r + 5)
    const y1 = cy + Math.sin(a) * (r + 5)
    const x2 = cx + Math.cos(a) * (r + 11)
    const y2 = cy + Math.sin(a) * (r + 11)
    rays.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffc03a" strokeWidth="3.4" strokeLinecap="round" />)
  }
  return (
    <g>
      {rays}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} stroke="#f59e0b" strokeWidth="1.5" />
    </g>
  )
}

function Moon({ id, cx = 34, cy = 28, r = 13 }) {
  return (
    <g>
      <path
        d={`M ${cx + r * 0.2} ${cy - r} a ${r} ${r} 0 1 0 ${r * 0.65} ${r * 1.7} a ${r * 0.82} ${r * 0.82} 0 1 1 ${-r * 0.65} ${-r * 1.7} z`}
        fill={`url(#${id})`}
        stroke="#a5b4fc"
        strokeWidth="1.4"
      />
    </g>
  )
}

function Cloud({ id, x = 14, y = 26, s = 1, stroke = '#94a3b8' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M8 20 a10 10 0 0 1 1.5 -19.8 a12 12 0 0 1 22.5 3 a8.5 8.5 0 0 1 -1 16.8 z"
        fill={`url(#${id})`}
        stroke={stroke}
        strokeWidth="1.4"
      />
    </g>
  )
}

function Drops({ color, y = 46, small }) {
  const xs = small ? [24, 32, 40] : [22, 32, 42]
  return xs.map((x, i) => (
    <path key={i} d={`M${x} ${y} q3 4 0 7 q-3 -3 0 -7 z`} fill={color} opacity={0.9} transform={`translate(0 ${(i % 2) * 3})`} />
  ))
}

function Flakes({ color, y = 47 }) {
  return [22, 32, 42].map((x, i) => (
    <g key={i} stroke={color} strokeWidth="1.8" strokeLinecap="round" transform={`translate(${x} ${y + (i % 2) * 3})`}>
      <line x1="-3" y1="0" x2="3" y2="0" />
      <line x1="0" y1="-3" x2="0" y2="3" />
      <line x1="-2.1" y1="-2.1" x2="2.1" y2="2.1" />
      <line x1="-2.1" y1="2.1" x2="2.1" y2="-2.1" />
    </g>
  ))
}

export default function WeatherIcon({ cat = 'clouds', day = true, size = 40, title }) {
  const k = uid++
  const gid = (n) => `wi${k}-${n}`
  const cloudGrad = cat === 'clouds' || cat === 'rain' || cat === 'drizzle' || cat === 'thunder' ? G.cloudDark : G.cloud
  const cloudStroke = cloudGrad === G.cloudDark ? '#7286a0' : '#a7b6c8'

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={title || cat}>
      <defs>
        <Defs id={gid('sun')} stops={G.sun} />
        <Defs id={gid('moon')} stops={G.moon} />
        <Defs id={gid('cloud')} stops={cloudGrad} />
        <Defs id={gid('cloud2')} stops={G.cloud} />
        <Defs id={gid('bolt')} stops={G.bolt} />
      </defs>

      {cat === 'clear' && (day ? <Sun id={gid('sun')} /> : <Moon id={gid('moon')} />)}

      {cat === 'partly' && (
        <g>
          {day ? <Sun id={gid('sun')} cx={24} cy={22} r={10} /> : <Moon id={gid('moon')} cx={24} cy={20} r={10} />}
          <Cloud id={gid('cloud2')} x={20} y={28} s={0.95} stroke="#a7b6c8" />
        </g>
      )}

      {cat === 'clouds' && (
        <g>
          <Cloud id={gid('cloud2')} x={8} y={18} s={0.7} stroke="#b8c4d4" />
          <Cloud id={gid('cloud')} x={16} y={24} s={1} stroke={cloudStroke} />
        </g>
      )}

      {cat === 'fog' && (
        <g>
          <Cloud id={gid('cloud')} x={16} y={18} s={1} stroke={cloudStroke} />
          {[46, 51, 56].map((y, i) => (
            <line key={i} x1={12 + (i % 2) * 4} y1={y} x2={52 - (i % 2) * 4} y2={y} stroke="#aeb9c8" strokeWidth="3" strokeLinecap="round" />
          ))}
        </g>
      )}

      {cat === 'drizzle' && (
        <g>
          <Cloud id={gid('cloud')} x={16} y={16} s={1} stroke={cloudStroke} />
          <Drops color="#7cc7ff" y={44} small />
        </g>
      )}

      {cat === 'rain' && (
        <g>
          <Cloud id={gid('cloud')} x={16} y={14} s={1} stroke={cloudStroke} />
          <Drops color="#38bdf8" y={44} />
        </g>
      )}

      {cat === 'snow' && (
        <g>
          <Cloud id={gid('cloud')} x={16} y={14} s={1} stroke={cloudStroke} />
          <Flakes color="#bae6fd" y={46} />
        </g>
      )}

      {cat === 'thunder' && (
        <g>
          <Cloud id={gid('cloud')} x={16} y={12} s={1} stroke={cloudStroke} />
          <path d="M32 40 l-7 11 h6 l-4 9 12 -13 h-6 l4 -7 z" fill={`url(#${gid('bolt')})`} stroke="#f59e0b" strokeWidth="1" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  )
}

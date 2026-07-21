// Two collectible-style mascot figurines on display bases, hand-built as SVG.
// Figure one wears an olive military bomber with a blunt fringe; figure two a
// cream varsity jacket with black sleeves over a red hoodie, with tousled hair.
// All fills are fully opaque (solid resin look, never see-through). Only the
// weather-reactive expression and a small prop change with the sky. Premium feel
// from form gradients, a rim highlight and a blurred contact shadow. Original art,
// all primitives, no external assets.

const WET = new Set(['rain', 'drizzle', 'thunder'])

// mood + prop per condition. figure one is the prepared one, two gets caught out.
function moods(cat, day) {
  if (WET.has(cat)) return { one: { face: 'calm', umbrella: true }, two: { face: 'annoyed', wet: true } }
  if (cat === 'snow') return { one: { face: 'calm', scarf: true }, two: { face: 'cold', cold: true } }
  if ((cat === 'clear' || cat === 'partly') && day) return { one: { face: 'cool', shades: true, sunscreen: true }, two: { face: 'hot', hot: true, sweat: true } }
  if (!day && (cat === 'clear' || cat === 'partly')) return { one: { face: 'calm' }, two: { face: 'calm' } }
  return { one: { face: 'calm' }, two: { face: 'meh' } }
}

// realistic-anime face (JJK / MHA / Baki register, not kawaii): sharp angular
// brows, narrow almond eyes with a bold upper lash line and a small highlight, a
// defined nose, an understated mouth. squint (a hard curve) for cool / hot moods.
function Face({ mood }) {
  const angry = mood === 'annoyed' || mood === 'cold'
  const squint = mood === 'cool' || mood === 'hot'
  return (
    <g>
      {/* brows */}
      <g stroke="#20242c" strokeWidth="2.2" strokeLinecap="round">
        {angry
          ? <><line x1="-15" y1="55" x2="-6" y2="58" /><line x1="15" y1="55" x2="6" y2="58" /></>
          : <><line x1="-15" y1="55" x2="-6" y2="54" /><line x1="15" y1="55" x2="6" y2="54" /></>}
      </g>
      {/* eyes: simple dots, or a squint curve for cool / hot */}
      {squint
        ? <g stroke="#20242c" strokeWidth="2.4" strokeLinecap="round" fill="none">
            <path d="M -14 62 Q -10 64 -6 62" /><path d="M 6 62 Q 10 64 14 62" />
          </g>
        : <g fill="#20242c"><circle cx="-10" cy="63" r="2.6" /><circle cx="10" cy="63" r="2.6" /></g>}
      {/* mouth */}
      {angry
        ? <path d="M -6 78 Q 0 74 6 78" fill="none" stroke="#20242c" strokeWidth="2.2" strokeLinecap="round" />
        : mood === 'hot'
          ? <ellipse cx="0" cy="77" rx="4" ry="2.8" fill="#20242c" />
          : <path d="M -6 76 Q 0 79 6 76" fill="none" stroke="#20242c" strokeWidth="2.2" strokeLinecap="round" />}
      {mood === 'cold' && <g fill="#8fd0ff" opacity="0.6"><circle cx="-13" cy="71" r="3.6" /><circle cx="13" cy="71" r="3.6" /></g>}
    </g>
  )
}

// shared body scaffold: base, shadow, legs, shoes, neck. torso + arms + hair are
// supplied by each figure so the two outfits stay distinct.
function Base({ id, skin }) {
  return (
    <>
      <ellipse cx="0" cy="176" rx="34" ry="8" fill="#0b1020" opacity="0.35" filter="url(#figBlur)" />
      <ellipse cx="0" cy="170" rx="32" ry="10" fill={`url(#base-${id})`} />
      <ellipse cx="-9" cy="166" rx="11" ry="2.6" fill="#ffffff" opacity="0.5" />
      <rect x="-13" y="139" width="10" height="28" rx="5" fill="url(#jeans)" />
      <rect x="3" y="139" width="10" height="28" rx="5" fill="url(#jeans)" />
      <path d="M -15 163 h 12 v 6 a 3 3 0 0 1 -3 3 h -9 z" fill="#e9edf2" />
      <path d="M 3 163 h 12 v 6 a 3 3 0 0 1 -3 3 h -9 z" fill="#e9edf2" />
      <rect x="-6" y="78" width="12" height="10" fill={skin} />
    </>
  )
}

function FigureOne({ m }) {
  const skin = '#eecba6'
  return (
    <g transform="translate(62 0)">
      <Base id="one" skin={skin} />
      {/* olive bomber: arms + ribbed cuffs */}
      <rect x="-28" y="96" width="10" height="34" rx="5" fill="url(#olive)" transform={m.umbrella ? 'rotate(-18 -23 100)' : ''} />
      <rect x="18" y="96" width="10" height="34" rx="5" fill="url(#olive)" />
      <rect x="-28" y="126" width="10" height="6" rx="2" fill="#3e4626" transform={m.umbrella ? 'rotate(-18 -23 100)' : ''} />
      <rect x="18" y="126" width="10" height="6" rx="2" fill="#3e4626" />
      {/* torso */}
      <path d="M -23 95 Q -25 138 -16 147 L 16 147 Q 25 138 23 95 Q 14 84 0 84 Q -14 84 -23 95 Z" fill="url(#olive)" />
      <rect x="-17" y="142" width="34" height="6" rx="2" fill="#3e4626" />
      <path d="M -14 86 Q 0 94 14 86 L 12 92 Q 0 99 -12 92 Z" fill="#47502b" />
      <line x1="0" y1="88" x2="0" y2="144" stroke="#3a4325" strokeWidth="2.2" />
      <line x1="-14" y1="112" x2="-2" y2="112" stroke="#3a4325" strokeWidth="1.8" />
      <path d="M 15 88 Q 24 104 20 134" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
      <circle cx={m.umbrella ? -31 : -23} cy={m.umbrella ? 94 : 132} r="5.2" fill={skin} />
      <circle cx="23" cy="132" r="5.2" fill={skin} />
      {/* head + short crop with a straight blunt fringe (short sides, not a bob) */}
      <ellipse cx="0" cy="62" rx="25" ry="25" fill="url(#skin-one)" />
      <path d="M -23 49 Q -23 32 0 31 Q 23 32 23 49 Q 19 45 15 46 Q 11 50 8 47 Q 4 51 0 47 Q -4 51 -8 47 Q -11 50 -15 46 Q -19 45 -23 49 Z" fill="#141414" />
      <Face mood={m.face} />
      {m.shades && <g><rect x="-18" y="57" width="15" height="9" rx="4" fill="#15181e" /><rect x="3" y="57" width="15" height="9" rx="4" fill="#15181e" /><rect x="-3" y="60" width="6" height="2.2" fill="#15181e" /></g>}
      {m.sunscreen && <g><rect x="-9" y="66" width="18" height="3.4" rx="1.7" fill="#ffffff" opacity="0.92" transform="rotate(-2 0 67)" /><circle cx="-14" cy="71" r="3" fill="#ffffff" opacity="0.85" /><circle cx="14" cy="71" r="3" fill="#ffffff" opacity="0.85" /></g>}
      {m.scarf && <path d="M -15 90 Q 0 98 15 90 L 13 99 Q 0 106 -13 99 Z" fill="#c0392f" />}
      {m.umbrella && <g>
        <line x1="-31" y1="94" x2="-31" y2="28" stroke="#2a2320" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M -60 28 Q -31 4 -2 28 Q -31 20 -60 28 Z" fill="url(#umb)" />
        <circle cx="-31" cy="6" r="2.4" fill="#2a2320" />
      </g>}
    </g>
  )
}

function FigureTwo({ m }) {
  const skin = '#f0cfa8'
  return (
    <g transform="translate(178 0)">
      <Base id="two" skin={skin} />
      {/* red hoodie peeking at the neck */}
      <path d="M -16 90 Q 0 100 16 90 L 16 104 Q 0 112 -16 104 Z" fill="#b23327" />
      <path d="M -12 84 Q 0 78 12 84 L 10 92 Q 0 88 -10 92 Z" fill="#c0392f" />
      {/* varsity: black sleeves + cuffs */}
      <rect x="-28" y="96" width="10" height="34" rx="5" fill="url(#sleeve)" />
      <rect x="18" y="96" width="10" height="34" rx="5" fill="url(#sleeve)" />
      <rect x="-28" y="126" width="10" height="6" rx="2" fill="#0f1013" />
      <rect x="18" y="126" width="10" height="6" rx="2" fill="#0f1013" />
      {/* cream body */}
      <path d="M -23 95 Q -25 138 -16 147 L 16 147 Q 25 138 23 95 Q 14 86 0 86 Q -14 86 -23 95 Z" fill="url(#cream)" />
      <rect x="-17" y="142" width="34" height="6" rx="2" fill="#1c1e22" />
      <rect x="-17" y="143.5" width="34" height="1.6" fill="#e8e0c8" />
      <line x1="-4" y1="100" x2="-5" y2="118" stroke="#c0392f" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="4" y1="100" x2="5" y2="118" stroke="#c0392f" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="112" r="4.5" fill="#1c1e22" /><circle cx="12" cy="112" r="2.2" fill="#e8e0c8" />
      <path d="M 15 90 Q 23 106 20 134" fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      <circle cx="-23" cy="132" r="5.2" fill={skin} />
      <circle cx="23" cy="132" r="5.2" fill={skin} />
      {/* head + tousled wavy hair (solid cap that sits on the scalp) */}
      <ellipse cx="0" cy="62" rx="25" ry="25" fill="url(#skin-two)" />
      <path d="M -25 56 Q -28 32 -10 29 Q -4 21 3 27 Q 11 21 17 30 Q 28 34 25 56 Q 21 49 22 53 Q 15 47 12 52 Q 7 46 3 52 Q -2 46 -6 52 Q -12 47 -16 52 Q -21 48 -25 56 Z" fill="#3a2a1e" />
      <Face mood={m.face} />
      {m.shades && <g><rect x="-18" y="57" width="15" height="9" rx="4" fill="#15181e" /><rect x="3" y="57" width="15" height="9" rx="4" fill="#15181e" /><rect x="-3" y="60" width="6" height="2.2" fill="#15181e" /></g>}
      {m.wet && <g fill="#bfe0ff"><ellipse cx="-20" cy="104" rx="1.7" ry="3.6" /><ellipse cx="21" cy="118" rx="1.7" ry="3.6" /><ellipse cx="4" cy="150" rx="1.7" ry="3.6" /></g>}
      {m.cold && <g fill="#8fd0ff" opacity="0.7"><circle cx="-13" cy="71" r="4" /><circle cx="13" cy="71" r="4" /></g>}
      {m.hot && <g fill="#ff7a6b" opacity="0.5"><circle cx="-13" cy="72" r="5" /><circle cx="13" cy="72" r="5" /></g>}
      {m.sweat && <g fill="#bfe0ff"><ellipse cx="20" cy="52" rx="2" ry="4.2" /><ellipse cx="-18" cy="55" rx="1.6" ry="3.4" /></g>}
    </g>
  )
}

export default function Figures({ cat = 'clouds', day = true, className = '' }) {
  const m = moods(cat, day)
  return (
    <svg className={className} viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Weather mascots">
      <defs>
        <filter id="figBlur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.4" /></filter>
        <linearGradient id="olive" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6b7640" /><stop offset="1" stopColor="#515b30" /></linearGradient>
        <linearGradient id="cream" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efe7cf" /><stop offset="1" stopColor="#d8cdac" /></linearGradient>
        <linearGradient id="sleeve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2d33" /><stop offset="1" stopColor="#17191e" /></linearGradient>
        <linearGradient id="jeans" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b4552" /><stop offset="1" stopColor="#2a323d" /></linearGradient>
        <linearGradient id="skin-one" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#f4d4b2" /><stop offset="1" stopColor="#dcae86" /></linearGradient>
        <linearGradient id="skin-two" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#f6d7b6" /><stop offset="1" stopColor="#e0b184" /></linearGradient>
        <radialGradient id="base-one" cx="0.4" cy="0.3" r="0.9"><stop offset="0" stopColor="#e7ecf3" /><stop offset="1" stopColor="#9aa9ba" /></radialGradient>
        <radialGradient id="base-two" cx="0.4" cy="0.3" r="0.9"><stop offset="0" stopColor="#e7ecf3" /><stop offset="1" stopColor="#9aa9ba" /></radialGradient>
        <linearGradient id="umb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9433f" /><stop offset="1" stopColor="#9e2f2c" /></linearGradient>
      </defs>
      <FigureOne m={m.one} />
      <FigureTwo m={m.two} />
    </svg>
  )
}

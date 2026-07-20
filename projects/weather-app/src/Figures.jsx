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
  const browL = angry ? 'M -17 51 L -4 57 L -4 59.4 L -17 54 Z' : 'M -17 53 L -4 55 L -4 57 L -17 55.4 Z'
  const browR = angry ? 'M 17 51 L 4 57 L 4 59.4 L 17 54 Z' : 'M 17 53 L 4 55 L 4 57 L 17 55.4 Z'
  return (
    <g>
      <path d={browL} fill="#171a1f" />
      <path d={browR} fill="#171a1f" />
      {squint
        ? <g stroke="#171a1f" strokeWidth="2.6" strokeLinecap="round" fill="none">
            <path d="M -15 62 Q -10 64.5 -5 61.5" /><path d="M 5 61.5 Q 10 64.5 15 62" />
          </g>
        : <g>
            <path d="M -16 60.5 Q -10 58.4 -4 61" stroke="#171a1f" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M 4 61 Q 10 58.4 16 60.5" stroke="#171a1f" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <ellipse cx="-10.5" cy="64" rx="2.4" ry="3.6" fill="#171a1f" />
            <ellipse cx="10.5" cy="64" rx="2.4" ry="3.6" fill="#171a1f" />
            <circle cx="-9.3" cy="62.6" r="1" fill="#ffffff" />
            <circle cx="11.7" cy="62.6" r="1" fill="#ffffff" />
          </g>}
      {/* defined nose */}
      <path d="M 0.5 66 q -1.8 3 -3 3.6" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.6" strokeLinecap="round" />
      {/* mouth per mood */}
      {angry
        ? <path d="M -6 79 Q 0 74 6 79" fill="none" stroke="#171a1f" strokeWidth="2.3" strokeLinecap="round" />
        : mood === 'hot'
          ? <path d="M -5 77 Q 0 82 5 77 Q 0 79.5 -5 77 Z" fill="#171a1f" />
          : mood === 'cool'
            ? <path d="M -6 77 Q 3 80 8 75" fill="none" stroke="#171a1f" strokeWidth="2.3" strokeLinecap="round" />
            : <path d="M -6 78 Q 0 80.5 6 78" fill="none" stroke="#171a1f" strokeWidth="2.3" strokeLinecap="round" />}
      {mood === 'cold' && <g fill="#8fd0ff" opacity="0.65"><circle cx="-14" cy="72" r="4" /><circle cx="14" cy="72" r="4" /></g>}
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
      {/* JoJo cel shadow on the shaded (right) side + hatched inking */}
      <path d="M 3 85 Q 15 85 23 96 Q 25 132 17 146 L 3 146 Z" fill="rgba(0,0,0,0.17)" />
      <g stroke="rgba(0,0,0,0.16)" strokeWidth="1" strokeLinecap="round">
        <line x1="8" y1="101" x2="20" y2="107" /><line x1="6" y1="112" x2="21" y2="120" /><line x1="8" y1="124" x2="20" y2="131" /><line x1="10" y1="135" x2="19" y2="141" />
      </g>
      <circle cx={m.umbrella ? -31 : -23} cy={m.umbrella ? 94 : 132} r="5.2" fill={skin} />
      <circle cx="23" cy="132" r="5.2" fill={skin} />
      {/* head + short crop with a straight blunt fringe (short sides, not a bob) */}
      <ellipse cx="0" cy="62" rx="25" ry="25" fill="url(#skin-one)" />
      <path d="M -23 49 Q -23 32 0 31 Q 23 32 23 49 Q 19 45 15 46 Q 11 50 8 47 Q 4 51 0 47 Q -4 51 -8 47 Q -11 50 -15 46 Q -19 45 -23 49 Z" fill="#141414" />
      <path d="M -16 39 Q -6 34 3 37" stroke="rgba(255,255,255,0.22)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
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
      {/* JoJo cel shadow + hatched inking on the cream panel */}
      <path d="M 3 88 Q 15 88 23 96 Q 25 132 17 147 L 3 147 Z" fill="rgba(0,0,0,0.13)" />
      <g stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeLinecap="round">
        <line x1="7" y1="123" x2="20" y2="129" /><line x1="6" y1="133" x2="20" y2="140" /><line x1="9" y1="142" x2="18" y2="146" />
      </g>
      <circle cx="-23" cy="132" r="5.2" fill={skin} />
      <circle cx="23" cy="132" r="5.2" fill={skin} />
      {/* head + tousled wavy hair (solid cap that sits on the scalp) */}
      <ellipse cx="0" cy="62" rx="25" ry="25" fill="url(#skin-two)" />
      <path d="M -25 56 Q -28 32 -10 29 Q -4 21 3 27 Q 11 21 17 30 Q 28 34 25 56 Q 21 49 22 53 Q 15 47 12 52 Q 7 46 3 52 Q -2 46 -6 52 Q -12 47 -16 52 Q -21 48 -25 56 Z" fill="#3a2a1e" />
      <path d="M -14 37 Q -3 31 7 35" stroke="rgba(255,255,255,0.2)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
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

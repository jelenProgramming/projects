// Two collectible-style figurines on display bases, hand-built as SVG. They are
// modelled on the two leads of Bloodhounds: GUN (Kim Gun-woo) the stoic, clean-cut
// heavy-hitter in a charcoal hoodie, and JIN (Hong Woo-jin) the talkative, street
// -smart one in an olive bomber and cap. All fills are fully opaque (solid resin
// look, never see-through); only the weather-reactive expression and a small prop
// change with the sky. Premium feel from form gradients, a rim highlight and a
// blurred contact shadow. No external art, all primitives.

const WET = new Set(['rain', 'drizzle', 'thunder'])

// mood + prop per condition. gun is the prepared one, jin gets caught out.
function moods(cat, day) {
  if (WET.has(cat)) return { gun: { face: 'calm', umbrella: true }, jin: { face: 'annoyed', wet: true } }
  if (cat === 'snow') return { gun: { face: 'calm', beanie: true }, jin: { face: 'cold', cold: true } }
  if ((cat === 'clear' || cat === 'partly') && day) return { gun: { face: 'cool', shades: true }, jin: { face: 'cool', shades: true, cap: true } }
  if (!day && (cat === 'clear' || cat === 'partly')) return { gun: { face: 'calm' }, jin: { face: 'calm' } }
  return { gun: { face: 'calm' }, jin: { face: 'meh' } }
}

function Face({ mood, skin }) {
  const brow = mood === 'annoyed' || mood === 'cold' || mood === 'meh'
  const frown = mood === 'annoyed' || mood === 'cold'
  const smirk = mood === 'cool'
  return (
    <g>
      {mood === 'cold' && <>
        <circle cx="-12" cy="70" r="4.5" fill="#8fd0ff" /><circle cx="12" cy="70" r="4.5" fill="#8fd0ff" />
      </>}
      {/* eyes / shades handled by caller overlay */}
      <g fill="#20242c">
        <ellipse cx="-10" cy="63" rx="2.8" ry={mood === 'cool' ? 2 : 3.2} />
        <ellipse cx="10" cy="63" rx="2.8" ry={mood === 'cool' ? 2 : 3.2} />
      </g>
      {brow && <g stroke="#20242c" strokeWidth="2.4" strokeLinecap="round">
        <line x1="-16" y1="55" x2="-5" y2="58" /><line x1="16" y1="55" x2="5" y2="58" />
      </g>}
      {frown
        ? <path d="M -7 78 Q 0 72 7 78" fill="none" stroke="#20242c" strokeWidth="2.4" strokeLinecap="round" />
        : smirk
          ? <path d="M -7 74 Q 2 79 8 73" fill="none" stroke="#20242c" strokeWidth="2.4" strokeLinecap="round" />
          : <path d="M -6 75 Q 0 79 6 75" fill="none" stroke="#20242c" strokeWidth="2.4" strokeLinecap="round" />}
    </g>
  )
}

// one figurine. id drives the gradient set; opts carry outfit + mood.
function Figure({ cx, id, skin, hair, m }) {
  return (
    <g transform={`translate(${cx} 0)`}>
      {/* contact shadow (solid, blurred) */}
      <ellipse cx="0" cy="176" rx="34" ry="8" fill="#0b1020" opacity="0.35" filter="url(#figBlur)" />
      {/* pedestal, fully opaque */}
      <ellipse cx="0" cy="170" rx="32" ry="10" fill={`url(#base-${id})`} />
      <ellipse cx="-9" cy="166" rx="11" ry="2.6" fill="#ffffff" opacity="0.5" />

      {/* legs (dark trousers) */}
      <rect x="-13" y="139" width="10" height="28" rx="5" fill={`url(#leg-${id})`} />
      <rect x="3" y="139" width="10" height="28" rx="5" fill={`url(#leg-${id})`} />
      {/* shoes */}
      <path d="M -15 163 h 12 v 6 a 3 3 0 0 1 -3 3 h -9 z" fill="#e9edf2" />
      <path d="M 3 163 h 12 v 6 a 3 3 0 0 1 -3 3 h -9 z" fill="#e9edf2" />

      {/* torso: jacket/hoodie, opaque form gradient */}
      <path d="M -23 95 Q -25 138 -16 147 L 16 147 Q 25 138 23 95 Q 14 82 0 82 Q -14 82 -23 95 Z" fill={`url(#jacket-${id})`} />
      {/* inner tee / zip line */}
      {id === 'jin'
        ? <path d="M 0 84 L 0 147" stroke="#eef1f5" strokeWidth="7" strokeLinecap="round" />
        : <path d="M 0 86 L 0 120" stroke="#1b2027" strokeWidth="2.4" />}
      {/* hood (gun) or collar (jin) */}
      {id === 'gun'
        ? <path d="M -20 92 Q 0 104 20 92 Q 16 84 0 84 Q -16 84 -20 92 Z" fill={`url(#jacketDark-${id})`} />
        : <path d="M -18 86 L -6 96 L -18 100 Z M 18 86 L 6 96 L 18 100 Z" fill={`url(#jacketDark-${id})`} />}
      {/* rim light */}
      <path d="M 15 88 Q 24 104 20 134" fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2.2" strokeLinecap="round" />

      {/* arms */}
      <rect x="-28" y="96" width="10" height="36" rx="5" fill={`url(#jacket-${id})`} transform={m.umbrella ? 'rotate(-18 -23 100)' : ''} />
      <rect x="18" y="96" width="10" height="36" rx="5" fill={`url(#jacket-${id})`} />
      {/* hands (wrapped, boxer nod) */}
      <circle cx={m.umbrella ? -31 : -23} cy={m.umbrella ? 94 : 132} r="5.2" fill={skin} />
      <circle cx="23" cy="132" r="5.2" fill={skin} />

      {/* neck + head */}
      <rect x="-6" y="78" width="12" height="10" fill={skin} />
      <ellipse cx="0" cy="62" rx="25" ry="25" fill={`url(#skin-${id})`} />
      {/* hair: short crop */}
      <path d="M -25 58 Q -24 34 0 33 Q 24 34 25 58 Q 22 44 12 42 Q 6 46 0 45 Q -6 46 -12 42 Q -22 44 -25 58 Z" fill={hair} />
      <path d="M 17 42 Q 25 50 23 62" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" />

      <Face mood={m.face} skin={skin} />

      {/* shades overlay */}
      {m.shades && <g>
        <rect x="-18" y="57" width="15" height="9" rx="4" fill="#15181e" />
        <rect x="3" y="57" width="15" height="9" rx="4" fill="#15181e" />
        <rect x="-3" y="60" width="6" height="2.2" fill="#15181e" />
      </g>}
      {/* beanie / cap */}
      {m.beanie && <path d="M -26 46 Q 0 26 26 46 L 26 40 Q 0 22 -26 40 Z" fill="#d7443f" />}
      {m.cap && <><path d="M -24 44 Q 0 26 24 44 Z" fill="#1f2933" /><path d="M 18 44 q 16 2 20 8 l -2 4 q -12 -6 -20 -6 z" fill="#1f2933" /></>}

      {/* cheeks when cold */}
      {m.face === 'cold' && <g fill="#8fd0ff" opacity="0.7"><circle cx="-13" cy="70" r="4" /><circle cx="13" cy="70" r="4" /></g>}

      {/* umbrella (gun, prepared) */}
      {m.umbrella && <g>
        <line x1="-31" y1="94" x2="-31" y2="28" stroke="#2a2320" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M -60 28 Q -31 4 -2 28 Q -31 20 -60 28 Z" fill={`url(#umb)`} />
        <path d="M -60 28 Q -46 22 -31 28 M -31 28 Q -16 22 -2 28" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" />
        <circle cx="-31" cy="6" r="2.4" fill="#2a2320" />
      </g>}
      {/* rain drips on jin */}
      {m.wet && <g fill="#bfe0ff"><ellipse cx="-20" cy="102" rx="1.7" ry="3.6" /><ellipse cx="21" cy="116" rx="1.7" ry="3.6" /><ellipse cx="4" cy="150" rx="1.7" ry="3.6" /></g>}
    </g>
  )
}

export default function Figures({ cat = 'clouds', day = true, className = '' }) {
  const m = moods(cat, day)
  return (
    <svg className={className} viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Weather mascots">
      <defs>
        <filter id="figBlur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.4" /></filter>
        {/* GUN: charcoal hoodie */}
        <linearGradient id="jacket-gun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a424e" /><stop offset="1" stopColor="#262c35" /></linearGradient>
        <linearGradient id="jacketDark-gun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b323c" /><stop offset="1" stopColor="#1d222a" /></linearGradient>
        <linearGradient id="leg-gun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b4048" /><stop offset="1" stopColor="#2a2e35" /></linearGradient>
        <linearGradient id="skin-gun" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#f4d4b2" /><stop offset="1" stopColor="#dcae86" /></linearGradient>
        <radialGradient id="base-gun" cx="0.4" cy="0.3" r="0.9"><stop offset="0" stopColor="#e7ecf3" /><stop offset="1" stopColor="#9aa9ba" /></radialGradient>
        {/* JIN: olive bomber */}
        <linearGradient id="jacket-jin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6d7a45" /><stop offset="1" stopColor="#505b31" /></linearGradient>
        <linearGradient id="jacketDark-jin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#57632f" /><stop offset="1" stopColor="#414a26" /></linearGradient>
        <linearGradient id="leg-jin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#39434f" /><stop offset="1" stopColor="#28303a" /></linearGradient>
        <linearGradient id="skin-jin" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stopColor="#f6d7b6" /><stop offset="1" stopColor="#e0b184" /></linearGradient>
        <radialGradient id="base-jin" cx="0.4" cy="0.3" r="0.9"><stop offset="0" stopColor="#e7ecf3" /><stop offset="1" stopColor="#9aa9ba" /></radialGradient>
        <linearGradient id="umb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9433f" /><stop offset="1" stopColor="#9e2f2c" /></linearGradient>
      </defs>
      <Figure cx="62" id="gun" skin="#eecba6" hair="#161616" m={m.gun} />
      <Figure cx="178" id="jin" skin="#f0cfa8" hair="#3b2a20" m={m.jin} />
    </svg>
  )
}

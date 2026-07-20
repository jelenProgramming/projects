// Two collectible-style chibi figurines on display bases, hand-built as SVG.
// They are the app's mascots: PIA is always prepared, MODEL is caught out. Their
// outfit and expression react to the calculated weather. Premium-resin feel comes
// from layered gradients (form shading), a soft rim highlight, an occlusion shadow
// under each base, and a glossy pedestal. No external art, all primitives.
//
// Techniques are hand-rolled from researched tutorials (see AGENT-MEMORY.md):
// vertical form gradients for volume, a radial hotspot for the rim light, and a
// blurred offset ellipse for the contact shadow.

const WET = new Set(['rain', 'drizzle', 'thunder'])

// per-condition styling for the two figures. p = prepared, c = caught-out.
function styleFor(cat, day) {
  if (WET.has(cat)) return {
    p: { mood: 'smug', umbrella: true, coat: '#f6c945', boots: true },
    c: { mood: 'soggy', umbrella: false, coat: '#8aa0b4', drips: true },
    caption: 'rain',
  }
  if (cat === 'snow') return {
    p: { mood: 'happy', hat: true, scarf: '#e5556b', coat: '#6ea8df', boots: true },
    c: { mood: 'cold', coat: '#9fb2c4', shiver: true },
    caption: 'snow',
  }
  if ((cat === 'clear' || cat === 'partly') && day) return {
    p: { mood: 'cool', shades: true, sunhat: true, coat: '#57c4b4' },
    c: { mood: 'hot', coat: '#e28f6d', sweat: true },
    caption: 'sun',
  }
  if (!day && (cat === 'clear' || cat === 'partly')) return {
    p: { mood: 'calm', coat: '#7c6cc4' },
    c: { mood: 'calm', coat: '#5f6f8c' },
    caption: 'night',
  }
  return { // clouds / fog default
    p: { mood: 'calm', coat: '#7f9ab0' },
    c: { mood: 'meh', coat: '#8a97a4' },
    caption: 'clouds',
  }
}

// one figurine. cx is the horizontal centre; s selects skin/hair identity.
function Figure({ cx, cfg, id, skin, hair }) {
  const mood = cfg.mood
  // brow + mouth per mood
  const brow = mood === 'soggy' || mood === 'cold' || mood === 'meh' || mood === 'hot'
  const frown = mood === 'soggy' || mood === 'cold' || mood === 'hot'
  const smile = mood === 'smug' || mood === 'happy' || mood === 'cool' || mood === 'calm'
  return (
    <g transform={`translate(${cx} 0)`} filter="url(#figSoft)">
      {/* contact shadow */}
      <ellipse cx="0" cy="176" rx="34" ry="8" fill="#000" opacity="0.28" filter="url(#figBlur)" />
      {/* pedestal */}
      <ellipse cx="0" cy="170" rx="32" ry="10" fill={`url(#baseGrad-${id})`} />
      <ellipse cx="0" cy="167" rx="32" ry="9" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" />
      <ellipse cx="-9" cy="165" rx="10" ry="2.4" fill="#ffffff" opacity="0.35" />

      {/* legs */}
      <rect x="-13" y="140" width="10" height="26" rx="5" fill={`url(#legGrad-${id})`} />
      <rect x="3" y="140" width="10" height="26" rx="5" fill={`url(#legGrad-${id})`} />
      {cfg.boots && <>
        <rect x="-14" y="158" width="12" height="12" rx="4" fill="#37414d" />
        <rect x="2" y="158" width="12" height="12" rx="4" fill="#37414d" />
      </>}

      {/* torso / coat */}
      <path d="M -22 96 Q -24 138 -16 146 L 16 146 Q 24 138 22 96 Q 14 84 0 84 Q -14 84 -22 96 Z" fill={`url(#coatGrad-${id})`} />
      <path d="M -22 96 Q 0 106 22 96 L 22 104 Q 0 114 -22 104 Z" fill="#000" opacity="0.08" />
      {/* rim light on the coat */}
      <path d="M 14 88 Q 23 100 20 132" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2.4" strokeLinecap="round" />

      {/* arms */}
      <rect x="-27" y="98" width="9" height="34" rx="4.5" fill={`url(#coatGrad-${id})`} transform={cfg.umbrella ? 'rotate(-16 -22 100)' : ''} />
      <rect x="18" y="98" width="9" height="34" rx="4.5" fill={`url(#coatGrad-${id})`} />
      {/* hands */}
      <circle cx={cfg.umbrella ? -30 : -22} cy={cfg.umbrella ? 96 : 132} r="5" fill={skin} />
      <circle cx="22" cy="132" r="5" fill={skin} />

      {/* scarf */}
      {cfg.scarf && <path d="M -14 92 Q 0 100 14 92 L 12 100 Q 0 108 -12 100 Z" fill={cfg.scarf} />}

      {/* head */}
      <g>
        <ellipse cx="0" cy="64" rx="26" ry="25" fill={`url(#headGrad-${id})`} />
        {/* hair cap */}
        <path d="M -26 60 Q -24 36 0 34 Q 24 36 26 60 Q 18 46 0 46 Q -18 46 -26 60 Z" fill={hair} />
        <path d="M 18 44 Q 26 52 24 64" fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
        {/* cheeks */}
        {(mood === 'hot') && <>
          <circle cx="-13" cy="70" r="5" fill="#ff7a7a" opacity="0.55" />
          <circle cx="13" cy="70" r="5" fill="#ff7a7a" opacity="0.55" />
        </>}
        {(mood === 'cold') && <>
          <circle cx="-13" cy="70" r="5" fill="#8fd0ff" opacity="0.6" />
          <circle cx="13" cy="70" r="5" fill="#8fd0ff" opacity="0.6" />
        </>}
        {/* eyes */}
        {cfg.shades ? (
          <g>
            <rect x="-18" y="58" width="15" height="9" rx="4" fill="#20242c" />
            <rect x="3" y="58" width="15" height="9" rx="4" fill="#20242c" />
            <rect x="-3" y="61" width="6" height="2.4" fill="#20242c" />
            <rect x="-16" y="60" width="5" height="2.4" rx="1" fill="#5a6472" />
          </g>
        ) : (
          <g fill="#232830">
            <ellipse cx="-10" cy="63" rx={mood === 'smug' ? 3.4 : 3} ry={mood === 'smug' ? 2 : 3.4} />
            <ellipse cx="10" cy="63" rx={mood === 'smug' ? 3.4 : 3} ry={mood === 'smug' ? 2 : 3.4} />
            <circle cx="-9" cy="62" r="1.1" fill="#fff" />
            <circle cx="11" cy="62" r="1.1" fill="#fff" />
          </g>
        )}
        {/* brows */}
        {brow && <g stroke="#2a2f38" strokeWidth="2.2" strokeLinecap="round">
          <line x1="-16" y1="54" x2="-6" y2="57" />
          <line x1="16" y1="54" x2="6" y2="57" />
        </g>}
        {/* mouth */}
        {smile
          ? <path d="M -7 74 Q 0 80 7 74" fill="none" stroke="#2a2f38" strokeWidth="2.2" strokeLinecap="round" />
          : frown
            ? <path d="M -7 78 Q 0 72 7 78" fill="none" stroke="#2a2f38" strokeWidth="2.2" strokeLinecap="round" />
            : <line x1="-6" y1="76" x2="6" y2="76" stroke="#2a2f38" strokeWidth="2.2" strokeLinecap="round" />}
      </g>

      {/* headwear */}
      {cfg.sunhat && <path d="M -30 42 Q 0 30 30 42 Q 0 50 -30 42 Z M -16 42 Q -14 24 0 24 Q 14 24 16 42 Z" fill="#f2d489" />}
      {cfg.hat && <path d="M -20 40 Q 0 20 20 40 L 18 44 Q 0 30 -18 44 Z" fill="#e5556b" />}

      {/* umbrella held by prepared figure */}
      {cfg.umbrella && (
        <g>
          <line x1="-30" y1="96" x2="-30" y2="30" stroke="#3a2f2a" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M -58 30 Q -30 6 -2 30 Q -30 22 -58 30 Z" fill="url(#umbGrad)" />
          <path d="M -58 30 Q -44 24 -30 30 M -30 30 Q -16 24 -2 30" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1" />
          <circle cx="-30" cy="8" r="2.4" fill="#3a2f2a" />
        </g>
      )}

      {/* drips / sweat / shiver marks */}
      {cfg.drips && <g fill="#bfe0ff" opacity="0.85">
        <ellipse cx="-20" cy="100" rx="1.6" ry="3.4" />
        <ellipse cx="20" cy="112" rx="1.6" ry="3.4" />
        <ellipse cx="0" cy="150" rx="1.6" ry="3.4" />
      </g>}
      {cfg.sweat && <ellipse cx="18" cy="56" rx="2" ry="4" fill="#bfe0ff" opacity="0.9" />}
      {cfg.shiver && <g stroke="#8fd0ff" strokeWidth="1.6" strokeLinecap="round" opacity="0.8">
        <path d="M 30 60 q 3 -3 0 -6" fill="none" /><path d="M 34 66 q 3 -3 0 -6" fill="none" />
      </g>}
    </g>
  )
}

export default function Figures({ cat = 'clouds', day = true, className = '' }) {
  const st = styleFor(cat, day)
  return (
    <svg className={className} viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Weather mascots">
      <defs>
        {/* soft form shadow for the whole figure */}
        <filter id="figSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0b1020" floodOpacity="0.28" />
        </filter>
        <filter id="figBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2" /></filter>

        {/* prepared figure (id p) gradients */}
        <linearGradient id="coatGrad-p" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={st.p.coat} stopOpacity="1" />
          <stop offset="1" stopColor={st.p.coat} stopOpacity="0.62" />
        </linearGradient>
        <linearGradient id="headGrad-p" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#ffe0c2" /><stop offset="1" stopColor="#e8b48c" />
        </linearGradient>
        <linearGradient id="legGrad-p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a5560" /><stop offset="1" stopColor="#333c46" /></linearGradient>
        <radialGradient id="baseGrad-p" cx="0.4" cy="0.3" r="0.9"><stop offset="0" stopColor="#e9eef5" /><stop offset="1" stopColor="#9fb0c2" /></radialGradient>

        {/* caught-out figure (id c) gradients */}
        <linearGradient id="coatGrad-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={st.c.coat} stopOpacity="1" />
          <stop offset="1" stopColor={st.c.coat} stopOpacity="0.62" />
        </linearGradient>
        <linearGradient id="headGrad-c" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#f6d3b0" /><stop offset="1" stopColor="#d99f78" />
        </linearGradient>
        <linearGradient id="legGrad-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a5560" /><stop offset="1" stopColor="#333c46" /></linearGradient>
        <radialGradient id="baseGrad-c" cx="0.4" cy="0.3" r="0.9"><stop offset="0" stopColor="#e9eef5" /><stop offset="1" stopColor="#9fb0c2" /></radialGradient>

        <linearGradient id="umbGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff8fa3" /><stop offset="1" stopColor="#e05a76" /></linearGradient>
      </defs>

      <Figure cx="62" cfg={st.p} id="p" skin="#f0c19a" hair="#3a2f2a" />
      <Figure cx="178" cfg={st.c} id="c" skin="#ecbf98" hair="#5a4632" />
    </svg>
  )
}

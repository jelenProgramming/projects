import { useMemo, useState } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import { useLang } from '../../i18n.jsx'
import { MATCHERS } from './matchAlgos.js'

/** Shared visualizer: text row with the pattern aligned under it, sliding. */
export default function StringMatchViz({ slug }) {
  const { tk, t } = useLang()
  const fn = MATCHERS[slug]
  const [text, setText] = useState('ABABDABACDABABCABAB')
  const [pattern, setPattern] = useState('ABABCABAB')
  const [tIn, setTIn] = useState('ABABDABACDABABCABAB')
  const [pIn, setPIn] = useState('ABABCABAB')
  const steps = useMemo(() => (fn ? fn(text, pattern) : []), [fn, text, pattern])
  const player = usePlayer(steps, { speed: 1.3 })
  const s = player.step
  const cw = 30

  const charColor = (idx) => {
    if (s.found != null && idx >= s.found && idx < s.found + pattern.length) return 'var(--done)'
    if (s.compare === idx) return s.match ? 'var(--done)' : 'var(--accent-4)'
    return 'var(--panel-2)'
  }

  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 220, overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${Math.max(text.length, 1) * cw + 20} 150`} style={{ minWidth: text.length * cw + 20 }}>
            {/* text row */}
            {text.split('').map((ch, idx) => (
              <g key={idx} transform={`translate(${10 + idx * cw},20)`}>
                <rect width={cw - 3} height={cw - 3} rx="4" fill={charColor(idx)} style={{ transition: 'fill 0.2s' }} />
                {idx === s.shiftChar && <rect width={cw - 3} height={cw - 3} rx="4" fill="none" stroke="var(--accent-3)" strokeWidth="3" />}
                <text x={(cw - 3) / 2} y={(cw - 3) / 2} textAnchor="middle" dominantBaseline="central" fontFamily="var(--mono)" fontSize="14" fill="var(--text)">{ch}</text>
                <text x={(cw - 3) / 2} y={-4} textAnchor="middle" fontSize="8" fill="var(--text-faint)" fontFamily="var(--mono)">{idx}</text>
                {idx === s.shiftChar && <text x={(cw - 3) / 2} y={-13} textAnchor="middle" fontSize="9" fill="var(--accent-3)" fontWeight="700">shift</text>}
              </g>
            ))}
            {/* pattern row aligned at offset i */}
            {s.i != null && s.i >= 0 && pattern.split('').map((ch, j) => {
              const idx = s.i + j
              const isCur = s.j === j
              return (
                <g key={'p' + j} transform={`translate(${10 + idx * cw},75)`}>
                  <rect width={cw - 3} height={cw - 3} rx="4" fill={isCur ? (s.match ? 'var(--done)' : 'var(--compare)') : 'var(--accent-3)'} opacity={isCur ? 1 : 0.5} style={{ transition: 'fill 0.2s' }} />
                  <text x={(cw - 3) / 2} y={(cw - 3) / 2} textAnchor="middle" dominantBaseline="central" fontFamily="var(--mono)" fontSize="14" fill="#06251f">{ch}</text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* KMP failure table */}
        {s.failTable && (
          <div style={{ marginTop: 12 }}>
            <div className="field-label">failure[] (prefix function)</div>
            <div className="array-row">
              {pattern.split('').map((ch, i) => (
                <div key={i} className="array-cell"><span className="ac-idx">{ch}</span>{s.failTable[i] ?? 0}</div>
              ))}
            </div>
          </div>
        )}
        {s.shiftChar != null && (
          <div className="note" style={{ marginTop: 12 }}>
            <strong>shift char</strong> {t({ en: '(ringed): the character this algorithm inspects to decide how far to jump. Horspool uses the window-end char; Sunday uses the char one past the window.', de: '(umrandet): das Zeichen, das dieser Algorithmus prueft, um die Sprungweite zu bestimmen. Horspool nutzt das Fensterend-Zeichen; Sunday das Zeichen eins hinter dem Fenster.' })}
          </div>
        )}
        {(s.patHash != null) && (
          <div className="note" style={{ marginTop: 12 }}>
            pattern hash = <b>{s.patHash}</b>  |  window hash = <b>{s.winHash}</b>
          </div>
        )}

        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>

      <div className="panel">
        <h3 className="section">{tk('input')}</h3>
        <div className="controls" style={{ marginTop: 4 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="field-label">{tk('text')}</label>
            <input type="text" value={tIn} onChange={(e) => setTIn(e.target.value.toUpperCase())} style={{ width: '100%' }} />
          </div>
          <div style={{ minWidth: 140 }}>
            <label className="field-label">{tk('pattern')}</label>
            <input type="text" value={pIn} onChange={(e) => setPIn(e.target.value.toUpperCase())} style={{ width: '100%' }} />
          </div>
          <button className="btn" style={{ alignSelf: 'flex-end' }} onClick={() => { if (tIn && pIn && pIn.length <= tIn.length) { setText(tIn); setPattern(pIn) } }}>{tk('run')}</button>
        </div>
      </div>
    </div>
  )
}

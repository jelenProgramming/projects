import { useMemo } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

// A simple TM that increments a binary number (adds 1).
function tmSteps() {
  const tape = '1011'.split('') // start
  const cells = ['_', ...tape, '_', '_']
  let head = cells.length - 3 // at last digit
  let state = 'right'
  const steps = []
  const snap = (msg) => steps.push({ cells: cells.slice(), head, state, message: msg })
  snap({ en: 'A Turing machine: an infinite tape, a head that reads/writes one cell, and a state. This one adds 1 to a binary number.', de: 'Eine Turingmaschine: ein unendliches Band, ein Kopf, der eine Zelle liest/schreibt, und ein Zustand. Diese addiert 1 zu einer Binaerzahl.' })
  // move to rightmost digit then add with carry
  state = 'carry'
  while (head >= 0) {
    snap({ en: `State CARRY, head reads '${cells[head]}'.`, de: `Zustand CARRY, Kopf liest '${cells[head]}'.` })
    if (cells[head] === '1') { cells[head] = '0'; head--; snap({ en: `1 + carry = 0, carry continues left.`, de: `1 + Uebertrag = 0, Uebertrag laeuft weiter nach links.` }) }
    else { cells[head] = '1'; snap({ en: `0 (or blank) + carry = 1, done. Halt.`, de: `0 (oder leer) + Uebertrag = 1, fertig. Halt.` }); break }
  }
  steps.push({ cells: cells.slice(), head, state: 'halt', done: true, message: { en: `Result: ${cells.join('').replace(/_/g, '')}. The machine halted.`, de: `Ergebnis: ${cells.join('').replace(/_/g, '')}. Die Maschine hielt an.` } })
  return steps
}
export default function Page({ content }) {
  const steps = useMemo(() => tmSteps(), [])
  const player = usePlayer(steps, { speed: 1 })
  const s = player.step
  const cw = 46
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 200, flexDirection: 'column', gap: 20 }}>
          <svg viewBox={`0 0 ${(s.cells || []).length * cw + 10} 100`} style={{ maxWidth: (s.cells || []).length * cw + 10 }}>
            {(s.cells || []).map((c, i) => (
              <g key={i} transform={`translate(${5 + i * cw},30)`}>
                <rect width={cw - 4} height={cw - 4} fill={i === s.head ? 'var(--compare)' : 'var(--panel-2)'} stroke="var(--border)" strokeWidth="1.5" style={{ transition: 'fill 0.2s' }} />
                <text x={(cw - 4) / 2} y={(cw - 4) / 2} textAnchor="middle" dominantBaseline="central" fontFamily="var(--mono)" fontSize="18" fill="var(--text)">{c}</text>
                {i === s.head && <polygon points={`${(cw - 4) / 2 - 6},${cw + 2} ${(cw - 4) / 2 + 6},${cw + 2} ${(cw - 4) / 2},${cw - 6}`} fill="var(--accent)" />}
              </g>
            ))}
          </svg>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--text-dim)' }}>state: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{s.state}</span></div>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

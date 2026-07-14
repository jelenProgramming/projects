import { useMemo, useState } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

function modexpSteps(base, exp, mod) {
  const steps = []; const rows = []
  const push = (msg) => steps.push({ rows: rows.slice(), message: msg })
  push({ en: `Compute ${base}^${exp} mod ${mod} by squaring. Read the exponent's bits; square each step, multiply when the bit is 1.`, de: `Berechne ${base}^${exp} mod ${mod} durch Quadrieren. Exponentenbits lesen; je Schritt quadrieren, bei Bit 1 multiplizieren.` })
  let result = 1, b = base % mod, e = exp
  const bits = exp.toString(2)
  push({ en: `${exp} in binary is ${bits}. Process bits from the least significant.`, de: `${exp} binaer ist ${bits}. Bits von der niederwertigsten verarbeiten.` })
  let bitIdx = 0
  while (e > 0) {
    const bit = e & 1
    if (bit) { result = (result * b) % mod; rows.push({ bit, b, result, used: true }); push({ en: `Bit = 1: result = result∗base = ${result}. base now ${b}.`, de: `Bit = 1: Ergebnis = Ergebnis∗Basis = ${result}. Basis nun ${b}.` }) }
    else { rows.push({ bit, b, result, used: false }); push({ en: `Bit = 0: skip multiply, result stays ${result}.`, de: `Bit = 0: keine Multiplikation, Ergebnis bleibt ${result}.` }) }
    e = e >> 1
    if (e > 0) b = (b * b) % mod
    bitIdx++
  }
  push({ en: `${base}^${exp} mod ${mod} = ${result}. Only ${bits.length} squarings instead of ${exp} multiplications - O(log exp).`, de: `${base}^${exp} mod ${mod} = ${result}. Nur ${bits.length} Quadrierungen statt ${exp} Multiplikationen - O(log exp).` })
  return steps
}
export default function Page({ content }) {
  const { tk } = useLang()
  const [base, setBase] = useState(7); const [exp, setExp] = useState(13); const [mod, setMod] = useState(11)
  const steps = useMemo(() => modexpSteps(base, exp, mod), [base, exp, mod])
  const player = usePlayer(steps, { speed: 1.2 })
  const s = player.step
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 240 }}>
          <table className="cx-table" style={{ maxWidth: 360 }}>
            <thead><tr><th>bit</th><th>base mod m</th><th>result</th></tr></thead>
            <tbody>{(s.rows || []).map((r, i) => <tr key={i}><td style={{ color: r.used ? 'var(--done)' : 'var(--text-faint)' }}>{r.bit}</td><td>{r.b}</td><td style={{ color: 'var(--accent)' }}>{r.result}</td></tr>)}</tbody>
          </table>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <div className="panel">
        <h3 className="section">{tk('input')}</h3>
        <div className="controls" style={{ marginTop: 4 }}>
          <input type="number" value={base} onChange={(e) => setBase(Math.max(1, +e.target.value || 1))} style={{ width: 80 }} />
          <input type="number" value={exp} onChange={(e) => setExp(Math.max(1, Math.min(1000, +e.target.value || 1)))} style={{ width: 80 }} />
          <input type="number" value={mod} onChange={(e) => setMod(Math.max(2, +e.target.value || 2))} style={{ width: 80 }} />
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

import { useMemo, useState } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

function gcdSteps(a, b) {
  const steps = []
  const rows = []
  const push = (msg) => steps.push({ rows: rows.slice(), message: msg })
  push({ en: `Euclid's algorithm: gcd(a,b) = gcd(b, a mod b), repeat until the remainder is 0.`, de: `Euklids Algorithmus: ggT(a,b) = ggT(b, a mod b), bis der Rest 0 ist.` })
  let x = a, y = b
  while (y !== 0) {
    const q = Math.floor(x / y), rem = x % y
    rows.push({ a: x, b: y, q, rem })
    push({ en: `${x} = ${q}∗${y} + ${rem}, so gcd(${x},${y}) = gcd(${y},${rem}).`, de: `${x} = ${q}∗${y} + ${rem}, also ggT(${x},${y}) = ggT(${y},${rem}).` })
    x = y; y = rem
  }
  push({ en: `Remainder is 0 - the gcd is ${x}.`, de: `Rest ist 0 - der ggT ist ${x}.` })
  return steps
}
export default function Page({ content }) {
  const { tk, t } = useLang()
  const [a, setA] = useState(48); const [b, setB] = useState(36)
  const [ai, setAi] = useState('48'); const [bi, setBi] = useState('36')
  const steps = useMemo(() => gcdSteps(a, b), [a, b])
  const player = usePlayer(steps, { speed: 1.2 })
  const s = player.step
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 240 }}>
          <table className="cx-table" style={{ maxWidth: 360 }}>
            <thead><tr><th>a</th><th>b</th><th>a = q∗b + r</th></tr></thead>
            <tbody>
              {(s.rows || []).map((r, i) => (
                <tr key={i}><td>{r.a}</td><td>{r.b}</td><td style={{ color: 'var(--accent)' }}>{r.a} = {r.q}∗{r.b} + {r.rem}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <div className="panel">
        <h3 className="section">{tk('input')}</h3>
        <div className="controls" style={{ marginTop: 4 }}>
          <input type="number" value={ai} onChange={(e) => setAi(e.target.value)} style={{ width: 100 }} />
          <input type="number" value={bi} onChange={(e) => setBi(e.target.value)} style={{ width: 100 }} />
          <button className="btn" onClick={() => { const x = parseInt(ai, 10), y = parseInt(bi, 10); if (x > 0 && y > 0) { setA(Math.max(x, y)); setB(Math.min(x, y)) } }}>{tk('apply')}</button>
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

import { useMemo, useState } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

function arithSteps(msg) {
  // probabilities from frequencies
  const freq = {}; for (const c of msg) freq[c] = (freq[c] || 0) + 1
  const syms = Object.keys(freq).sort()
  const total = msg.length
  const ranges = {}; let acc = 0
  for (const sx of syms) { ranges[sx] = [acc / total, (acc + freq[sx]) / total]; acc += freq[sx] }
  const steps = []
  let lo = 0, hi = 1
  steps.push({ lo, hi, ranges, message: { en: `Start with [0,1). Each symbol narrows the interval to its sub-range. The final interval encodes the whole message.`, de: `Mit [0,1) beginnen. Jedes Symbol verengt das Intervall auf seinen Teilbereich. Das finale Intervall codiert die ganze Nachricht.` } })
  for (const c of msg) {
    const w = hi - lo
    const [rl, rh] = ranges[c]
    const nlo = lo + w * rl, nhi = lo + w * rh
    steps.push({ lo: nlo, hi: nhi, ranges, sym: c, message: { en: `Read '${c}' (range [${rl.toFixed(2)},${rh.toFixed(2)})): narrow to [${nlo.toFixed(4)}, ${nhi.toFixed(4)}).`, de: `'${c}' lesen (Bereich [${rl.toFixed(2)},${rh.toFixed(2)})): auf [${nlo.toFixed(4)}, ${nhi.toFixed(4)}) verengen.` } })
    lo = nlo; hi = nhi
  }
  steps.push({ lo, hi, ranges, done: true, message: { en: `Done. Any number in [${lo.toFixed(5)}, ${hi.toFixed(5)}) (e.g. ${((lo + hi) / 2).toFixed(5)}) uniquely encodes "${msg}".`, de: `Fertig. Jede Zahl in [${lo.toFixed(5)}, ${hi.toFixed(5)}) (z.B. ${((lo + hi) / 2).toFixed(5)}) codiert "${msg}" eindeutig.` } })
  return steps
}
export default function Page({ content }) {
  const { tk } = useLang()
  const [msg, setMsg] = useState('ABAC')
  const [inp, setInp] = useState('ABAC')
  const steps = useMemo(() => arithSteps(msg), [msg])
  const player = usePlayer(steps, { speed: 1 })
  const s = player.step
  const W = 560, barY = 40
  const sx = (v) => 20 + v * (W - 40)
  // map current [lo,hi] onto a zoomed second bar
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 200, flexDirection: 'column', gap: 18 }}>
          <svg viewBox={`0 0 ${W} 120`} style={{ maxWidth: W }}>
            {/* full [0,1] with symbol ranges */}
            {Object.entries(s.ranges || {}).map(([sym, [a, b]]) => (
              <g key={sym}>
                <rect x={sx(a)} y={barY} width={sx(b) - sx(a) - 1} height="30" fill="var(--panel-2)" stroke="var(--border)" />
                <text x={(sx(a) + sx(b)) / 2} y={barY + 15} textAnchor="middle" dominantBaseline="central" fontFamily="var(--mono)" fontSize="12" fill="var(--text-dim)">{sym}</text>
              </g>
            ))}
            {/* current interval highlighted */}
            <rect x={sx(s.lo)} y={barY - 6} width={Math.max(1, sx(s.hi) - sx(s.lo))} height="42" fill="none" stroke="var(--compare)" strokeWidth="2.5" />
            <text x={sx(s.lo)} y={barY + 52} fontSize="10" fontFamily="var(--mono)" fill="var(--compare)">{s.lo?.toFixed(4)}</text>
            <text x={sx(s.hi)} y={barY + 52} fontSize="10" fontFamily="var(--mono)" fill="var(--compare)" textAnchor="end">{s.hi?.toFixed(4)}</text>
          </svg>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <div className="panel">
        <h3 className="section">{tk('input')}</h3>
        <div className="controls" style={{ marginTop: 4 }}>
          <input type="text" value={inp} onChange={(e) => setInp(e.target.value.toUpperCase())} style={{ flex: 1, minWidth: 180 }} />
          <button className="btn" onClick={() => inp && setMsg(inp.slice(0, 6))}>{tk('apply')}</button>
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

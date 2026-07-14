import { useMemo, useState } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'
import { buildHeap } from './heapAlgo.js'

export default function Page({ content }) {
  const { tk } = useLang()
  const [vals, setVals] = useState([4, 9, 2, 11, 7, 1, 13, 6])
  const [inp, setInp] = useState('4,9,2,11,7,1,13,6')
  const steps = useMemo(() => buildHeap(vals), [vals])
  const player = usePlayer(steps, { speed: 1.4 })
  const s = player.step
  const heap = s.heap || []
  // tree layout from array indices
  const depth = (i) => Math.floor(Math.log2(i + 1))
  const maxD = heap.length ? depth(heap.length - 1) : 0
  const W = 640, rowH = 70, r = 18
  const posOf = (i) => {
    const d = depth(i)
    const idxInRow = i - (2 ** d - 1)
    const rowCount = 2 ** d
    const x = (idxInRow + 0.5) / rowCount * W
    return { x, y: 30 + d * rowH }
  }
  const fill = (i) => i === s.active ? 'var(--compare)' : i === s.compare ? 'var(--accent-3)' : 'var(--accent-2)'
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'flex-start', minHeight: (maxD + 1) * rowH + 40 }}>
          <svg viewBox={`0 0 ${W} ${(maxD + 1) * rowH + 30}`} style={{ maxWidth: W }}>
            {heap.map((_, i) => { if (i === 0) return null; const p = Math.floor((i - 1) / 2); const a = posOf(i), b = posOf(p); return <line key={'e' + i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="tree-edge" /> })}
            {heap.map((val, i) => { const p = posOf(i); return (
              <g key={i} transform={`translate(${p.x},${p.y})`}>
                <circle r={r} fill={fill(i)} stroke="var(--border)" strokeWidth="2" style={{ transition: 'fill 0.3s' }} />
                <text textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" fill="#06251f">{val}</text>
              </g>
            ) })}
          </svg>
        </div>
        <div style={{ marginTop: 8 }}>
          <div className="field-label">array</div>
          <div className="array-row">
            {heap.map((v, i) => <div key={i} className={'array-cell' + (i === s.active ? ' probe' : '')}><span className="ac-idx">{i}</span>{v}</div>)}
          </div>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <div className="panel">
        <h3 className="section">{tk('input')}</h3>
        <div className="controls" style={{ marginTop: 4 }}>
          <input type="text" value={inp} onChange={(e) => setInp(e.target.value)} style={{ flex: 1, minWidth: 220 }} />
          <button className="btn" onClick={() => { const n = inp.split(/[ ,]+/).map((x) => parseInt(x, 10)).filter((x) => !isNaN(x)); if (n.length) setVals(n.slice(0, 15)) }}>{tk('apply')}</button>
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

import { useMemo, useState } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'
import { buildTrie } from './trieAlgo.js'

export default function Page({ content }) {
  const { tk } = useLang()
  const [words, setWords] = useState(['car', 'cat', 'card', 'dog'])
  const [inp, setInp] = useState('car, cat, card, dog')
  const steps = useMemo(() => buildTrie(words), [words])
  const player = usePlayer(steps, { speed: 1.3 })
  const s = player.step
  const nodes = s.nodes || []
  const maxD = Math.max(1, ...nodes.map((n) => n.depth))
  // assign x positions by index within depth
  const byDepth = {}
  nodes.forEach((n) => { (byDepth[n.depth] ||= []).push(n) })
  const xOf = {}
  Object.entries(byDepth).forEach(([d, list]) => list.forEach((n, i) => { xOf[n.id] = (i + 0.5) / list.length }))
  const W = 640, rowH = 72, r = 16
  const px = (id) => 30 + xOf[id] * (W - 60)
  const py = (d) => 30 + d * rowH
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'flex-start', minHeight: (maxD + 1) * rowH + 40 }}>
          <svg viewBox={`0 0 ${W} ${(maxD + 1) * rowH + 30}`} style={{ maxWidth: W }}>
            {nodes.map((n) => n.parentId != null && <line key={'e' + n.id} x1={px(n.id)} y1={py(n.depth)} x2={px(n.parentId)} y2={py(n.depth - 1)} className="tree-edge" />)}
            {nodes.map((n) => (
              <g key={n.id} transform={`translate(${px(n.id)},${py(n.depth)})`}>
                <circle r={r} fill={n.id === s.active ? 'var(--compare)' : n.end ? 'var(--done)' : 'var(--panel)'} stroke={n.end ? 'var(--done)' : 'var(--border)'} strokeWidth="2" style={{ transition: 'fill 0.3s' }} />
                {n.depth > 0 && <text textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" fill={n.id === s.active || n.end ? '#06251f' : 'var(--text)'}>{n.ch}</text>}
              </g>
            ))}
          </svg>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <div className="panel">
        <h3 className="section">{tk('input')}</h3>
        <div className="controls" style={{ marginTop: 4 }}>
          <input type="text" value={inp} onChange={(e) => setInp(e.target.value)} style={{ flex: 1, minWidth: 220 }} />
          <button className="btn" onClick={() => { const w = inp.split(/[ ,]+/).map((x) => x.trim().toLowerCase()).filter(Boolean); if (w.length) setWords(w.slice(0, 8)) }}>{tk('apply')}</button>
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

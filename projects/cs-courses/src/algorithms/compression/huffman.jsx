import { useMemo, useState } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'
import { huffman } from './compAlgos.js'

// layout a forest of trees (each serialized node has id, ch, f, left, right ids)
function layoutForest(forest) {
  // forest is array of root serialized nodes; we need the full node graph.
  // Each serialized root carries _node with real children -> rebuild positions.
  const placed = []
  let cursor = 0
  const W = 640
  function measure(node) { if (!node) return 0; if (!node.left && !node.right) return 1; return measure(node.left) + measure(node.right) }
  function walk(node, depth, xRange) {
    if (!node) return
    const [lo, hi] = xRange
    const mid = (lo + hi) / 2
    placed.push({ id: node.id, ch: node.ch, f: node.f, x: mid, y: depth })
    const leftW = measure(node.left), rightW = measure(node.right), total = leftW + rightW || 1
    if (node.left) { const split = lo + (hi - lo) * (leftW / total); placed.push({ edge: true, x1: mid, y1: depth, x2: (lo + split) / 2, y2: depth + 1 }); walk(node.left, depth + 1, [lo, split]) }
    if (node.right) { const split = lo + (hi - lo) * (leftW / total); placed.push({ edge: true, x1: mid, y1: depth, x2: (split + hi) / 2, y2: depth + 1 }); walk(node.right, depth + 1, [split, hi]) }
  }
  forest.forEach((root) => { const w = Math.max(1, measure(root._node || root)); walk(root._node || root, 0, [cursor, cursor + w]); cursor += w + 0.5 })
  return { placed, span: cursor }
}

export default function Page({ content }) {
  const { tk, t } = useLang()
  const [input, setInput] = useState('ABRACADABRA')
  const [inp, setInp] = useState('ABRACADABRA')
  const steps = useMemo(() => huffman(input), [input])
  const player = usePlayer(steps, { speed: 1.3 })
  const s = player.step
  const { placed, span } = useMemo(() => layoutForest(s.forest || []), [s.forest])
  const maxD = Math.max(1, ...placed.filter((p) => !p.edge).map((p) => p.y))
  const W = 660, rowH = 64, r = 17
  const px = (x) => 20 + (x / Math.max(span, 1)) * (W - 40)
  const py = (y) => 26 + y * rowH
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'flex-start', minHeight: (maxD + 1) * rowH + 40, overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${W} ${(maxD + 1) * rowH + 30}`} style={{ minWidth: W }}>
            {placed.filter((p) => p.edge).map((e, i) => <line key={'e' + i} x1={px(e.x1)} y1={py(e.y1)} x2={px(e.x2)} y2={py(e.y2)} className="tree-edge" />)}
            {placed.filter((p) => !p.edge).map((nd) => {
              const merging = s.merging && s.merging.includes(nd.id)
              return (
                <g key={nd.id} transform={`translate(${px(nd.x)},${py(nd.y)})`}>
                  <circle r={r} fill={merging ? 'var(--compare)' : nd.ch != null ? 'var(--accent-2)' : 'var(--panel-2)'} stroke="var(--border)" strokeWidth="2" style={{ transition: 'fill 0.3s' }} />
                  <text textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="700" fill={nd.ch != null ? '#06251f' : 'var(--text)'}>{nd.ch != null ? nd.ch : nd.f}</text>
                  {nd.ch != null && <text textAnchor="middle" y={r + 11} fontSize="9" fill="var(--text-faint)" fontFamily="var(--mono)">{nd.f}</text>}
                </g>
              )
            })}
          </svg>
        </div>
        {s.codes && (
          <div style={{ marginTop: 8 }}>
            <div className="field-label">{t({ en: 'Resulting codes', de: 'Resultierende Codes' })}</div>
            <div className="sorted-edge-list">
              {Object.entries(s.codes).map(([c, b]) => <span key={c} className="se used">'{c}' = {b}</span>)}
            </div>
          </div>
        )}
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <div className="panel">
        <h3 className="section">{tk('input')}</h3>
        <div className="controls" style={{ marginTop: 4 }}>
          <input type="text" value={inp} onChange={(e) => setInp(e.target.value.toUpperCase())} style={{ flex: 1, minWidth: 200 }} />
          <button className="btn" onClick={() => inp && setInput(inp.slice(0, 16))}>{tk('apply')}</button>
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

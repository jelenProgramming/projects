import { useState } from 'react'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

export default function Page({ content }) {
  const { t } = useLang()
  const [target, setTarget] = useState(42)
  // a tiny B-tree of order 3 (illustrative)
  const root = { keys: [30, 60], children: [[10, 20], [40, 50], [70, 80, 90]] }
  // find path
  let childIdx = root.keys.findIndex((k) => target < k)
  if (childIdx === -1) childIdx = root.keys.length
  const leaf = root.children[childIdx]
  const found = leaf.includes(target)
  const W = 600
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 240, flexDirection: 'column', gap: 30 }}>
          <svg viewBox={`0 0 ${W} 200`} style={{ maxWidth: W }}>
            {/* root */}
            <g transform={`translate(${W / 2 - 50},10)`}>
              {root.keys.map((k, i) => <g key={i}><rect x={i * 50} y="0" width="50" height="38" fill="var(--panel-2)" stroke="var(--accent-3)" strokeWidth="2" /><text x={i * 50 + 25} y="19" textAnchor="middle" dominantBaseline="central" fontFamily="var(--mono)" fontWeight="700" fill="var(--text)">{k}</text></g>)}
            </g>
            {/* children */}
            {root.children.map((leafKeys, ci) => {
              const cx = (ci + 0.5) * (W / 3)
              const isPath = ci === childIdx
              return <g key={ci} transform={`translate(${cx - leafKeys.length * 25},120)`}>
                {leafKeys.map((k, i) => {
                  const hit = isPath && k === target
                  return <g key={i}><rect x={i * 50} y="0" width="50" height="38" fill={hit ? 'var(--done)' : isPath ? 'color-mix(in srgb, var(--compare) 30%, var(--panel-2))' : 'var(--panel-2)'} stroke={isPath ? 'var(--compare)' : 'var(--border)'} strokeWidth="2" /><text x={i * 50 + 25} y="19" textAnchor="middle" dominantBaseline="central" fontFamily="var(--mono)" fontWeight="700" fill={hit ? '#04231a' : 'var(--text)'}>{k}</text></g>
                })}
                <line x1={leafKeys.length * 25} y1="-82" x2={leafKeys.length * 25} y2="0" stroke={isPath ? 'var(--compare)' : 'var(--border)'} strokeWidth={isPath ? 2.5 : 1} />
              </g>
            })}
          </svg>
        </div>
        <div className="controls" style={{ marginTop: 14 }}>
          <div className="control-group" style={{ flex: 1 }}>
            <span>{t({ en: 'Look up key', de: 'Schluessel suchen' })}</span>
            <input type="range" min="10" max="90" step="10" value={target} onChange={(e) => setTarget(+e.target.value)} />
            <span style={{ fontFamily: 'var(--mono)' }}>{target}</span>
          </div>
        </div>
        <div className="status-bar" style={{ marginTop: 12 }}>
          <span className="step-num">{found ? '✓' : '✗'}</span>
          <span className="desc">{t({ en: `At the root, ${target} routes to child ${childIdx + 1}; then scan that leaf. ${found ? 'Found' : 'Not present'}. Only 2 node reads instead of scanning every row - that is why an index is fast.`, de: `An der Wurzel fuehrt ${target} zu Kind ${childIdx + 1}; dann das Blatt durchsuchen. ${found ? 'Gefunden' : 'Nicht vorhanden'}. Nur 2 Knotenlesungen statt aller Zeilen - daher ist ein Index schnell.` })}</span>
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

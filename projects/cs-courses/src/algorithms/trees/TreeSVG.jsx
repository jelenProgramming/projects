/**
 * Renders a binary tree from a flat node list (each with normalized x in [0,1],
 * integer y depth, and child keys). Edges are drawn first, then nodes. Node
 * color reflects active / inserting / found state with smooth CSS transitions.
 */
export default function TreeSVG({ nodes, maxY, active, inserting, searching, found }) {
  const W = 640, rowH = 74, pad = 34, r = 19
  const H = (maxY + 1) * rowH + pad
  const px = (x) => pad + x * (W - 2 * pad)
  const py = (y) => pad + y * rowH
  const byKey = Object.fromEntries(nodes.map((n) => [n.key, n]))

  const nodeFill = (k) => {
    if (k === found) return 'var(--done)'
    if (k === active) return 'var(--compare)'
    return 'var(--panel)'
  }
  const nodeStroke = (k) => {
    if (k === found) return 'var(--done)'
    if (k === active) return 'var(--compare)'
    if (k === inserting || k === searching) return 'var(--accent-3)'
    return 'var(--border)'
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="graph-svg" style={{ maxWidth: W }}>
      {nodes.map((n) => (
        <g key={'e' + n.key}>
          {n.leftKey != null && byKey[n.leftKey] && (
            <line x1={px(n.x)} y1={py(n.y)} x2={px(byKey[n.leftKey].x)} y2={py(byKey[n.leftKey].y)} className="tree-edge" />
          )}
          {n.rightKey != null && byKey[n.rightKey] && (
            <line x1={px(n.x)} y1={py(n.y)} x2={px(byKey[n.rightKey].x)} y2={py(byKey[n.rightKey].y)} className="tree-edge" />
          )}
        </g>
      ))}
      {nodes.map((n) => (
        <g key={'n' + n.key} transform={`translate(${px(n.x)},${py(n.y)})`}>
          <circle r={r} fill={nodeFill(n.key)} stroke={nodeStroke(n.key)} strokeWidth={n.key === active || n.key === found ? 3.5 : 2}
            style={{ transition: 'fill 0.35s, stroke 0.35s' }} />
          <text textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700"
            fill={(n.key === active || n.key === found) ? '#06251f' : 'var(--text)'} style={{ transition: 'fill 0.35s' }}>{n.key}</text>
        </g>
      ))}
    </svg>
  )
}

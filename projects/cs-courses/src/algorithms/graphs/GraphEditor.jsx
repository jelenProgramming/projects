import { useLang } from '../../i18n.jsx'
import { NODE_LABELS as L } from './graphData.js'

/**
 * Form-based graph editor (no free text -> no typos). The user sets the node
 * count and fills an edge table: each row has a "from" dropdown, a "to"
 * dropdown, and a weight number field. Nodes are 0-indexed and laid out on a
 * circle automatically. Calls onChange({nodes, edges}).
 *
 * This builds the same {nodes:[{id,x,y}], edges:[[u,v,w]]} shape the algorithms
 * consume, so the visualizer runs on whatever graph the user assembles.
 */
function circleLayout(n) {
  const cx = 280, cy = 185, r = 140
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2
    return { id: i, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  })
}

export function makeGraph(n, edges) {
  return { nodes: circleLayout(n), edges: edges.filter(([u, v]) => u !== v && u < n && v < n) }
}

export default function GraphEditor({ graph, onChange }) {
  const { t, tk } = useLang()
  const n = graph.nodes.length
  const edges = graph.edges

  const setN = (newN) => {
    const nn = Math.max(2, Math.min(8, newN))
    onChange(makeGraph(nn, edges.filter(([u, v]) => u < nn && v < nn)))
  }
  const setEdge = (idx, field, value) => {
    const next = edges.map((e, i) => {
      if (i !== idx) return e
      const [u, v, w] = e
      if (field === 'u') return [value, v, w]
      if (field === 'v') return [u, value, w]
      return [u, v, value]
    })
    onChange(makeGraph(n, next))
  }
  const addEdge = () => {
    // pick a default pair that doesn't already exist
    let pair = [0, 1]
    for (let u = 0; u < n; u++) for (let v = u + 1; v < n; v++) {
      if (!edges.some(([a, b]) => (a === u && b === v) || (a === v && b === u))) { pair = [u, v]; break }
    }
    onChange(makeGraph(n, [...edges, [pair[0], pair[1], 5]]))
  }
  const removeEdge = (idx) => onChange(makeGraph(n, edges.filter((_, i) => i !== idx)))

  const opts = Array.from({ length: n }, (_, i) => i)

  return (
    <div className="panel">
      <h3 className="section">{tk('editGraph')}</h3>

      <div className="control-group" style={{ marginTop: 8 }}>
        <span>{t({ en: 'Number of nodes', de: 'Knotenanzahl' })}</span>
        <input type="range" min="2" max="8" value={n} onChange={(e) => setN(parseInt(e.target.value, 10))} />
        <span style={{ fontFamily: 'var(--mono)' }}>{n}</span>
        <span className="muted" style={{ fontSize: 12 }}>({opts.map((i) => L[i]).join(', ')})</span>
      </div>

      <table className="cx-table" style={{ marginTop: 14, maxWidth: 380 }}>
        <thead><tr>
          <th>{t({ en: 'From', de: 'Von' })}</th>
          <th>{t({ en: 'To', de: 'Nach' })}</th>
          <th>{t({ en: 'Weight', de: 'Gewicht' })}</th>
          <th></th>
        </tr></thead>
        <tbody>
          {edges.map(([u, v, w], idx) => (
            <tr key={idx}>
              <td><select value={u} onChange={(e) => setEdge(idx, 'u', +e.target.value)}>{opts.map((i) => <option key={i} value={i}>{L[i]}</option>)}</select></td>
              <td><select value={v} onChange={(e) => setEdge(idx, 'v', +e.target.value)}>{opts.map((i) => <option key={i} value={i}>{L[i]}</option>)}</select></td>
              <td><input type="number" min="1" max="99" value={w} onChange={(e) => setEdge(idx, 'w', Math.max(1, +e.target.value || 1))} style={{ width: 64 }} /></td>
              <td><button className="btn ghost" style={{ padding: '4px 9px' }} onClick={() => removeEdge(idx)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="controls" style={{ marginTop: 10 }}>
        <button className="btn" onClick={addEdge}>+ {tk('addEdge')}</button>
      </div>
      <div className="note" style={{ marginTop: 10 }}>
        {t({ en: 'Pick endpoints from the dropdowns and type the weight - no typing node names, so no typos. The graph is undirected; self-loops are ignored.', de: 'Endpunkte aus den Dropdowns wählen und Gewicht eingeben - keine Tippfehler. Der Graph ist ungerichtet; Schleifen werden ignoriert.' })}
      </div>
    </div>
  )
}

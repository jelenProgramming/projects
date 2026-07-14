import { NODE_LABELS as L, fmt, lbl } from './graphData.js'

/**
 * Renders a labelled N×N matrix (D, P, or weight C) with optional highlighting:
 *   hlRow / hlCol  - the current k row & column (Floyd-Warshall)
 *   changed:[i,j]  - the single cell that just changed (flashes)
 *   transform      - fmt for numbers, lbl for predecessor labels
 */
export default function MatrixPanel({ title, M, hlRow = -1, hlCol = -1, changed = null, isPred = false }) {
  const n = M.length
  const tf = isPred ? lbl : fmt
  return (
    <div>
      <div className="field-label">{title}</div>
      <table className="grid-table">
        <thead>
          <tr>
            <td className="hd" />
            {L.slice(0, n).map((c, j) => (
              <td key={j} className="hd" style={j === hlCol ? { color: 'var(--frontier)', fontWeight: 700 } : null}>{c}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {M.map((row, i) => (
            <tr key={i}>
              <td className="hd" style={i === hlRow ? { color: 'var(--frontier)', fontWeight: 700 } : null}>{L[i]}</td>
              {row.map((val, j) => {
                const isChanged = changed && changed[0] === i && changed[1] === j
                const inCross = i === hlRow || j === hlCol
                let style = {}
                if (isChanged) style = { background: 'var(--done)', color: '#04231a', fontWeight: 800 }
                else if (inCross) style = { background: 'color-mix(in srgb, var(--frontier) 18%, transparent)' }
                else if (i === j) style = { color: 'var(--text-faint)' }
                return <td key={j} style={{ ...style, transition: 'background 0.3s, color 0.3s' }}>{tf(val)}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

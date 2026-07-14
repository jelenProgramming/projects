import { useMemo } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

const L = ['A', 'B', 'C', 'D', 'E']
// directed edges for reachability
const EDGES = [[0, 1], [1, 2], [2, 3], [3, 1], [0, 4]]
function warshallSteps() {
  const n = 5
  const R = Array.from({ length: n }, () => new Array(n).fill(0))
  for (const [u, v] of EDGES) R[u][v] = 1
  const steps = []
  const snap = (extra, msg) => steps.push({ R: R.map((r) => r.slice()), ...extra, message: msg })
  snap({ k: -1 }, { en: 'Start from the direct-edge matrix. Warshall asks: can i reach j, possibly through intermediate nodes?', de: 'Mit der Direktkanten-Matrix starten. Warshall fragt: kann i j erreichen, evtl. ueber Zwischenknoten?' })
  for (let k = 0; k < n; k++) {
    snap({ k }, { en: `Round k = ${L[k]}: allow paths that pass through ${L[k]}.`, de: `Runde k = ${L[k]}: Pfade ueber ${L[k]} erlauben.` })
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      if (!R[i][j] && R[i][k] && R[k][j]) {
        R[i][j] = 1
        snap({ k, changed: [i, j] }, { en: `${L[i]}→${L[k]} and ${L[k]}→${L[j]} exist, so ${L[i]}→${L[j]} is reachable. Set R[${L[i]}][${L[j]}]=1.`, de: `${L[i]}→${L[k]} und ${L[k]}→${L[j]} existieren, also ${L[i]}→${L[j]} erreichbar. Setze R[${L[i]}][${L[j]}]=1.` })
      }
    }
  }
  snap({ k: n, done: true }, { en: 'Done. R[i][j]=1 means j is reachable from i. This is the transitive closure.', de: 'Fertig. R[i][j]=1 heisst j ist von i erreichbar. Das ist die transitive Huelle.' })
  return steps
}
export default function Page({ content }) {
  const { t } = useLang()
  const steps = useMemo(() => warshallSteps(), [])
  const player = usePlayer(steps, { speed: 1.6 })
  const s = player.step
  const R = s.R || []
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 300 }}>
          <table className="grid-table">
            <thead><tr><td className="hd" />{L.map((c, j) => <td key={j} className="hd" style={j === s.k ? { color: 'var(--frontier)', fontWeight: 700 } : null}>{c}</td>)}</tr></thead>
            <tbody>
              {R.map((row, i) => (
                <tr key={i}>
                  <td className="hd" style={i === s.k ? { color: 'var(--frontier)', fontWeight: 700 } : null}>{L[i]}</td>
                  {row.map((val, j) => {
                    const ch = s.changed && s.changed[0] === i && s.changed[1] === j
                    const cross = i === s.k || j === s.k
                    return <td key={j} style={ch ? { background: 'var(--done)', color: '#04231a', fontWeight: 800 } : cross ? { background: 'color-mix(in srgb, var(--frontier) 16%, transparent)' } : val ? { color: 'var(--accent)' } : { color: 'var(--text-faint)' }}>{val}</td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
        <div className="note" style={{ marginTop: 12 }}>{t({ en: 'Same triple-loop structure as Floyd-Warshall, but with booleans (reachable / not) instead of distances. k is always the outer loop.', de: 'Gleiche Dreifachschleife wie Floyd-Warshall, aber mit Booleschen Werten (erreichbar / nicht) statt Distanzen. k ist stets die aeussere Schleife.' })}</div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

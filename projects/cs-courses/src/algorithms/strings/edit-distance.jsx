import { useMemo, useState } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

function editSteps(a, b) {
  const steps = []; const n = a.length, m = b.length
  const D = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  const snap = (extra, msg) => steps.push({ D: D.map((r) => r.slice()), a, b, ...extra, message: msg })
  for (let i = 0; i <= n; i++) D[i][0] = i
  for (let j = 0; j <= m; j++) D[0][j] = j
  snap({}, { en: 'Initialize: row 0 and column 0 are the cost of turning a string into the empty string (pure deletions/insertions).', de: 'Initialisieren: Zeile 0 und Spalte 0 sind die Kosten, eine Zeichenkette in die leere zu verwandeln (nur Löschen/Einfügen).' })
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      const del = D[i - 1][j] + 1, ins = D[i][j - 1] + 1, sub = D[i - 1][j - 1] + cost
      D[i][j] = Math.min(del, ins, sub)
      snap({ cell: [i, j], from: cost === 0 ? 'diag' : 'min' }, cost === 0
        ? { en: `'${a[i - 1]}' = '${b[j - 1]}': free match, copy the diagonal -> D=${D[i][j]}.`, de: `'${a[i - 1]}' = '${b[j - 1]}': kostenloser Treffer, Diagonale kopieren -> D=${D[i][j]}.` }
        : { en: `'${a[i - 1]}' != '${b[j - 1]}': 1 + min(del ${D[i-1][j]}, ins ${D[i][j-1]}, sub ${D[i-1][j-1]}) = ${D[i][j]}.`, de: `'${a[i - 1]}' != '${b[j - 1]}': 1 + min(Loesch ${D[i-1][j]}, Einf ${D[i][j-1]}, Ersetz ${D[i-1][j-1]}) = ${D[i][j]}.` })
    }
  }
  snap({ cell: [n, m], done: true }, { en: `Edit distance = D[${n}][${m}] = ${D[n][m]}: the minimum single-character edits to turn one word into the other.`, de: `Editierdistanz = D[${n}][${m}] = ${D[n][m]}: die minimalen Einzelzeichen-Bearbeitungen.` })
  return steps
}

export default function Page({ content }) {
  const { tk, t } = useLang()
  const [a, setA] = useState('kitten'); const [b, setB] = useState('sitting')
  const [aIn, setAIn] = useState('kitten'); const [bIn, setBIn] = useState('sitting')
  const steps = useMemo(() => editSteps(a, b), [a, b])
  const player = usePlayer(steps, { speed: 2 })
  const s = player.step
  const D = s.D || []
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 300, overflowX: 'auto' }}>
          <table className="grid-table">
            <thead>
              <tr><td className="hd" /><td className="hd" />{b.split('').map((c, j) => <td key={j} className="hd">{c}</td>)}</tr>
            </thead>
            <tbody>
              {D.map((row, i) => (
                <tr key={i}>
                  <td className="hd">{i === 0 ? '' : a[i - 1]}</td>
                  {row.map((val, j) => {
                    const cur = s.cell && s.cell[0] === i && s.cell[1] === j
                    return <td key={j} style={cur ? { background: s.done ? 'var(--done)' : 'var(--compare)', color: '#1a1205', fontWeight: 800 } : (i === 0 || j === 0 ? { color: 'var(--text-faint)' } : {})}>{val}</td>
                  })}
                </tr>
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
          <input type="text" value={aIn} onChange={(e) => setAIn(e.target.value)} style={{ width: 140 }} />
          <input type="text" value={bIn} onChange={(e) => setBIn(e.target.value)} style={{ width: 140 }} />
          <button className="btn" onClick={() => { if (aIn && bIn && aIn.length <= 10 && bIn.length <= 12) { setA(aIn); setB(bIn) } }}>{tk('apply')}</button>
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

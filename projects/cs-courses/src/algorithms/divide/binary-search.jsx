import { useMemo, useState } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

function bsearchSteps(arr, target) {
  const steps = []
  let lo = 0, hi = arr.length - 1
  const snap = (extra, msg) => steps.push({ arr, lo, hi, ...extra, message: msg })
  snap({}, { en: `Binary search for ${target}. The array must be sorted. Halve the range each step.`, de: `Binaere Suche nach ${target}. Das Array muss sortiert sein. Bereich pro Schritt halbieren.` })
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    snap({ mid }, { en: `Check the middle, a[${mid}] = ${arr[mid]}.`, de: `Mitte pruefen, a[${mid}] = ${arr[mid]}.` })
    if (arr[mid] === target) { snap({ mid, found: mid }, { en: `Found ${target} at index ${mid}!`, de: `${target} an Index ${mid} gefunden!` }); return steps }
    if (arr[mid] < target) { snap({ mid }, { en: `${arr[mid]} &lt; ${target} - discard the left half, search right.`, de: `${arr[mid]} &lt; ${target} - linke Haelfte verwerfen, rechts suchen.` }); lo = mid + 1 }
    else { snap({ mid }, { en: `${arr[mid]} &gt; ${target} - discard the right half, search left.`, de: `${arr[mid]} &gt; ${target} - rechte Haelfte verwerfen, links suchen.` }); hi = mid - 1 }
  }
  snap({}, { en: `${target} is not in the array.`, de: `${target} ist nicht im Array.` })
  return steps
}
export default function Page({ content }) {
  const { tk } = useLang()
  const [arr] = useState([2, 5, 8, 12, 16, 23, 38, 56, 72, 91])
  const [target, setTarget] = useState(23)
  const [tin, setTin] = useState('23')
  const steps = useMemo(() => bsearchSteps(arr, target), [arr, target])
  const player = usePlayer(steps, { speed: 1.2 })
  const s = player.step
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 160 }}>
          <div className="array-row">
            {arr.map((v, i) => {
              const inRange = i >= s.lo && i <= s.hi
              let cls = 'array-cell'
              if (i === s.found) cls += ' changed'
              else if (i === s.mid) cls += ' probe'
              return <div key={i} className={cls} style={!inRange ? { opacity: 0.3 } : {}}><span className="ac-idx">{i}</span>{v}</div>
            })}
          </div>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <div className="panel">
        <h3 className="section">{tk('input')}</h3>
        <div className="controls" style={{ marginTop: 4 }}>
          <input type="number" value={tin} onChange={(e) => setTin(e.target.value)} style={{ width: 100 }} />
          <button className="btn" onClick={() => { const v = parseInt(tin, 10); if (!isNaN(v)) setTarget(v) }}>{tk('apply')}</button>
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

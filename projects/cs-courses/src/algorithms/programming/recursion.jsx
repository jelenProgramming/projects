import { useMemo, useState } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

function hanoiSteps(n) {
  const steps = []
  const pegs = [[], [], []]
  for (let d = n; d >= 1; d--) pegs[0].push(d)
  const snap = (msg) => steps.push({ pegs: pegs.map((p) => p.slice()), n, message: msg })
  const names = ['A', 'B', 'C']
  snap({ en: `Move ${n} disks from A to C using B. The trick: move n-1 to the spare, move the big one, move n-1 back. Pure recursion.`, de: `${n} Scheiben von A nach C mit B bewegen. Der Trick: n-1 auf den freien Stab, die grosse bewegen, n-1 zurueck. Reine Rekursion.` })
  function move(k, from, to, via) {
    if (k === 0) return
    move(k - 1, from, via, to)
    const disk = pegs[from].pop(); pegs[to].push(disk)
    snap({ en: `Move disk ${disk}: ${names[from]} → ${names[to]}.`, de: `Scheibe ${disk} bewegen: ${names[from]} → ${names[to]}.` })
    move(k - 1, via, to, from)
  }
  move(n, 0, 2, 1)
  snap({ en: `Done in ${2 ** n - 1} moves - always exactly 2^n - 1.`, de: `Fertig in ${2 ** n - 1} Zuegen - immer genau 2^n - 1.` })
  return steps
}
export default function Page({ content }) {
  const { tk, t } = useLang()
  const [n, setN] = useState(3)
  const steps = useMemo(() => hanoiSteps(n), [n])
  const player = usePlayer(steps, { speed: 1.6 })
  const s = player.step
  const pegs = s.pegs || [[], [], []]
  const pegW = 180, pegH = 200, maxW = 150
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'flex-end', minHeight: pegH + 40 }}>
          <svg viewBox={`0 0 ${pegW * 3} ${pegH + 20}`} style={{ maxWidth: pegW * 3 }}>
            {pegs.map((peg, pi) => (
              <g key={pi}>
                <rect x={pi * pegW + pegW / 2 - 3} y={20} width={6} height={pegH} fill="var(--border)" rx="3" />
                <rect x={pi * pegW + 20} y={pegH + 14} width={pegW - 40} height={6} fill="var(--border)" rx="3" />
                <text x={pi * pegW + pegW / 2} y={16} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text-dim)">{['A', 'B', 'C'][pi]}</text>
                {peg.map((disk, di) => {
                  const w = 30 + (disk / n) * (maxW - 30)
                  return <rect key={disk} x={pi * pegW + pegW / 2 - w / 2} y={pegH + 8 - (di + 1) * 22} width={w} height={18} rx="4"
                    fill={`hsl(${180 + disk * 30}, 60%, 55%)`} style={{ transition: 'all 0.25s' }} />
                })}
              </g>
            ))}
          </svg>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
        <div className="controls" style={{ marginTop: 12 }}>
          <div className="control-group"><span>{t({ en: 'Disks', de: 'Scheiben' })}</span>
            <input type="range" min="1" max="6" value={n} onChange={(e) => setN(+e.target.value)} />
            <span style={{ fontFamily: 'var(--mono)' }}>{n}</span></div>
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

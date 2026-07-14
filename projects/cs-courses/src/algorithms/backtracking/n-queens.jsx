import { useMemo } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { nQueens } from './backtrackAlgos.js'

export default function Page({ content }) {
  const steps = useMemo(() => nQueens(6), [])
  const player = usePlayer(steps, { speed: 1.6 })
  const s = player.step
  const n = s.n || 6
  const cell = 48
  const tryc = s.trying || s.placed || s.conflict || s.removing
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 360 }}>
          <svg viewBox={`0 0 ${n * cell} ${n * cell}`} style={{ maxWidth: n * cell }}>
            {Array.from({ length: n }).map((_, r) => Array.from({ length: n }).map((_, c) => {
              const dark = (r + c) % 2 === 1
              const isTry = tryc && tryc[0] === r && tryc[1] === c
              let fill = dark ? 'var(--panel-2)' : 'var(--bg-soft)'
              if (s.conflict && s.conflict[0] === r && s.conflict[1] === c) fill = 'var(--accent-4)'
              else if (s.placed && s.placed[0] === r && s.placed[1] === c) fill = 'var(--done)'
              else if (s.trying && s.trying[0] === r && s.trying[1] === c) fill = 'var(--compare)'
              return <rect key={r + '-' + c} x={c * cell} y={r * cell} width={cell} height={cell} fill={fill} style={{ transition: 'fill 0.25s' }} />
            }))}
            {(s.pos || []).map((col, row) => col >= 0 && (
              <text key={row} x={col * cell + cell / 2} y={row * cell + cell / 2} textAnchor="middle" dominantBaseline="central" fontSize={cell * 0.55}>♛</text>
            ))}
          </svg>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

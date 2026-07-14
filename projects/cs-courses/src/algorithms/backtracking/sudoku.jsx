import { useMemo } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { sudoku } from './backtrackAlgos.js'

export default function Page({ content }) {
  const steps = useMemo(() => sudoku(), [])
  const player = usePlayer(steps, { speed: 3 })
  const s = player.step
  const b = s.board
  if (!b) return <AlgoDetail content={content} />
  const cell = 42
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 9 * cell + 30 }}>
          <svg viewBox={`0 0 ${9 * cell} ${9 * cell}`} style={{ maxWidth: 9 * cell }}>
            {b.map((row, r) => row.map((val, c) => {
              const act = s.active && s.active[0] === r && s.active[1] === c
              const fill = act ? (s.backtrack ? 'var(--accent-4)' : 'var(--compare)') : 'var(--bg-soft)'
              return <rect key={r + '-' + c} x={c * cell} y={r * cell} width={cell} height={cell} fill={fill} stroke="var(--border-soft)" style={{ transition: 'fill 0.15s' }} />
            }))}
            {/* 3x3 box separators */}
            {[0, 3, 6, 9].map((i) => <g key={i}>
              <line x1={i * cell} y1="0" x2={i * cell} y2={9 * cell} stroke="var(--text-faint)" strokeWidth="2" />
              <line x1="0" y1={i * cell} x2={9 * cell} y2={i * cell} stroke="var(--text-faint)" strokeWidth="2" />
            </g>)}
            {b.map((row, r) => row.map((val, c) => val !== 0 && (
              <text key={'t' + r + '-' + c} x={c * cell + cell / 2} y={r * cell + cell / 2} textAnchor="middle" dominantBaseline="central"
                fontSize="18" fontWeight={s.given[r][c] ? 800 : 500} fill={s.given[r][c] ? 'var(--text)' : 'var(--accent)'} fontFamily="var(--mono)">{val}</text>
            )))}
          </svg>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

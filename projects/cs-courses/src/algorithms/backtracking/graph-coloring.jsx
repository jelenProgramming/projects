import { useMemo } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { graphColoring } from './backtrackAlgos.js'

const PALETTE = ['var(--panel)', '#f87171', '#60a5fa', '#34d399', '#fbbf24', '#c084fc']

export default function Page({ content }) {
  const steps = useMemo(() => graphColoring(3), [])
  const player = usePlayer(steps, { speed: 1.4 })
  const s = player.step
  const g = s.graph
  if (!g) return <AlgoDetail content={content} />
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 380 }}>
          <svg viewBox="0 0 600 390" style={{ maxWidth: 600 }}>
            {g.edges.map(([u, v], i) => (
              <line key={i} x1={g.nodes[u].x} y1={g.nodes[u].y} x2={g.nodes[v].x} y2={g.nodes[v].y} className="g-edge" />
            ))}
            {g.nodes.map((nd) => {
              const c = s.color[nd.id]
              const isActive = s.trying === nd.id || s.placed === nd.id || s.conflict === nd.id || s.removing === nd.id
              const fill = PALETTE[c] || 'var(--panel)'
              const stroke = s.conflict === nd.id ? 'var(--accent-4)' : isActive ? 'var(--compare)' : 'var(--border)'
              return (
                <g key={nd.id} transform={`translate(${nd.x},${nd.y})`}>
                  <circle r="24" fill={fill} stroke={stroke} strokeWidth={isActive ? 4 : 2} style={{ transition: 'fill 0.35s, stroke 0.3s' }} />
                  <text textAnchor="middle" dominantBaseline="central" fontSize="15" fontWeight="700" fill={c ? '#0b0d12' : 'var(--text)'}>{nd.id}</text>
                </g>
              )
            })}
          </svg>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

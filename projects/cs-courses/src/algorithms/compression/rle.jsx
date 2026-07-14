import { useMemo, useState } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'
import { rle } from './compAlgos.js'

export default function Page({ content }) {
  const { tk } = useLang()
  const [input, setInput] = useState('AAAABBBCCDAA')
  const [inp, setInp] = useState('AAAABBBCCDAA')
  const steps = useMemo(() => rle(input), [input])
  const player = usePlayer(steps, { speed: 1.4 })
  const s = player.step
  const cw = 30
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 180, flexDirection: 'column', gap: 24 }}>
          <svg viewBox={`0 0 ${input.length * cw + 20} 50`} style={{ maxWidth: input.length * cw + 20 }}>
            {input.split('').map((ch, i) => {
              const inRun = s.start != null && i >= s.start && i < s.start + (s.len || 0)
              return (
                <g key={i} transform={`translate(${10 + i * cw},10)`}>
                  <rect width={cw - 3} height={cw - 3} rx="4" fill={inRun ? 'var(--compare)' : 'var(--panel-2)'} style={{ transition: 'fill 0.2s' }} />
                  <text x={(cw - 3) / 2} y={(cw - 3) / 2} textAnchor="middle" dominantBaseline="central" fontFamily="var(--mono)" fontSize="14" fill="var(--text)">{ch}</text>
                </g>
              )
            })}
          </svg>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 18, color: 'var(--accent)' }}>{(s.out || []).join('')}<span style={{ color: 'var(--text-faint)' }}>{s.done ? '' : ' ...'}</span></div>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <div className="panel">
        <h3 className="section">{tk('input')}</h3>
        <div className="controls" style={{ marginTop: 4 }}>
          <input type="text" value={inp} onChange={(e) => setInp(e.target.value.toUpperCase())} style={{ flex: 1, minWidth: 200 }} />
          <button className="btn" onClick={() => inp && setInput(inp.slice(0, 30))}>{tk('apply')}</button>
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

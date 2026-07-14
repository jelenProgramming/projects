import { useMemo, useState } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'
import { lzw } from './compAlgos.js'

export default function Page({ content }) {
  const { tk, t } = useLang()
  const [input, setInput] = useState('TOBEORNOTTOBEORTOBEORNOT')
  const [inp, setInp] = useState('TOBEORNOTTOBEORTOBEORNOT')
  const steps = useMemo(() => lzw(input), [input])
  const player = usePlayer(steps, { speed: 1.6 })
  const s = player.step
  const cw = 26
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'flex-start', minHeight: 280, flexDirection: 'column', gap: 16, overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${input.length * cw + 20} 40`} style={{ minWidth: input.length * cw + 20 }}>
            {input.split('').map((ch, i) => (
              <g key={i} transform={`translate(${10 + i * cw},6)`}>
                <rect width={cw - 3} height={cw - 3} rx="3" fill={i === s.pos ? 'var(--compare)' : 'var(--panel-2)'} style={{ transition: 'fill 0.2s' }} />
                <text x={(cw - 3) / 2} y={(cw - 3) / 2} textAnchor="middle" dominantBaseline="central" fontFamily="var(--mono)" fontSize="12" fill="var(--text)">{ch}</text>
              </g>
            ))}
          </svg>
          <div style={{ width: '100%' }}>
            <div className="field-label">{t({ en: 'Output codes', de: 'Ausgabecodes' })}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 15, color: 'var(--accent)' }}>[{(s.out || []).join(', ')}]</div>
          </div>
          <div style={{ width: '100%' }}>
            <div className="field-label">{t({ en: 'Dictionary (new multi-char entries)', de: 'Woerterbuch (neue Mehrzeichen-Eintraege)' })}</div>
            <div className="sorted-edge-list">
              {(s.dict || []).map((e) => (
                <span key={e.v} className={'se' + (s.added === e.k ? ' cur' : '')}>{e.k} = {e.v}</span>
              ))}
            </div>
          </div>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <div className="panel">
        <h3 className="section">{tk('input')}</h3>
        <div className="controls" style={{ marginTop: 4 }}>
          <input type="text" value={inp} onChange={(e) => setInp(e.target.value.toUpperCase())} style={{ flex: 1, minWidth: 200 }} />
          <button className="btn" onClick={() => inp && setInput(inp.slice(0, 40))}>{tk('apply')}</button>
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

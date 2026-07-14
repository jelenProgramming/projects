import { Play, Pause, StepF, StepB, Reset } from './Icons.jsx'
import { useLang } from '../i18n.jsx'

/**
 * Reusable transport bar for any visualization driven by usePlayer.
 * Shows: step back / play-pause / step forward / reset + speed + a scrubber.
 */
export default function PlayerControls({ player, extra = null }) {
  const { playing, toggle, next, prev, reset, atEnd, atStart, index, total, speed, setSpeed, seek } = player
  const { tk } = useLang()

  return (
    <div>
      <div className="controls">
        <button className="btn" onClick={prev} disabled={atStart} title={tk('stepBack')}>
          <StepB />
        </button>
        <button className="btn primary" onClick={toggle} style={{ minWidth: 104 }}>
          {playing ? <><Pause /> {tk('pause')}</> : <><Play /> {atEnd ? tk('replay') : tk('play')}</>}
        </button>
        <button className="btn" onClick={next} disabled={atEnd} title={tk('stepForward')}>
          <StepF />
        </button>
        <button className="btn ghost" onClick={reset} title={tk('reset')}>
          <Reset /> {tk('reset')}
        </button>

        <div className="divider-v" />

        <div className="control-group">
          <span>{tk('speed')}</span>
          <input
            type="range" min="0.25" max="5" step="0.25" value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
          <span style={{ fontFamily: 'var(--mono)', minWidth: 34 }}>{speed}×</span>
        </div>

        {extra}
      </div>

      <input
        type="range"
        min="0" max={Math.max(0, total - 1)} value={index}
        onChange={(e) => seek(parseInt(e.target.value, 10))}
        style={{ width: '100%', marginTop: 14, accentColor: 'var(--accent-3)' }}
      />
    </div>
  )
}

import { useState, useMemo } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import { useLang } from '../../i18n.jsx'
import { SORTERS } from './sorters.js'
import { Shuffle } from '../../components/Icons.jsx'

const PRESETS = {
  random: (n, max) => Array.from({ length: n }, () => 1 + Math.floor(Math.random() * max)),
  nearly: (n) => { const a = Array.from({ length: n }, (_, i) => i + 1); for (let k = 0; k < Math.max(1, n / 8); k++) { const i = Math.floor(Math.random() * n), j = Math.min(n - 1, i + 1);[a[i], a[j]] = [a[j], a[i]] } return a },
  reversed: (n) => Array.from({ length: n }, (_, i) => n - i),
}

/**
 * Shared visualizer for all comparison/integer sorts. The specific algorithm is
 * chosen by `slug` (resolved from the route). Bars are colored from each step's
 * compare / swap / sorted / pivot / range fields. Counting sort additionally
 * shows its count[] array.
 */
export default function SortViz({ slug }) {
  const { tk } = useLang()
  const sorter = SORTERS[slug]
  const [size, setSize] = useState(16)
  const [data, setData] = useState(() => PRESETS.random(16, 40))
  const [custom, setCustom] = useState('')

  const steps = useMemo(() => (sorter ? sorter(data) : []), [sorter, data])
  const player = usePlayer(steps, { speed: 1.5 })
  const step = player.step

  const maxVal = Math.max(...data, 1)
  const compareSet = new Set(step.compare || [])
  const swapSet = new Set(step.swap || [])
  const sortedSet = new Set(step.sorted || [])
  const inRange = step.range ? (i) => i >= step.range[0] && i <= step.range[1] : () => true

  const barColor = (i) => {
    if (sortedSet.has(i)) return 'var(--done)'
    if (swapSet.has(i)) return 'var(--swap)'
    if (compareSet.has(i)) return 'var(--compare)'
    if (i === step.pivot) return 'var(--accent-3)'
    if (!inRange(i)) return 'color-mix(in srgb, var(--accent-2) 30%, transparent)'
    return 'var(--accent-2)'
  }

  const regen = (preset) => {
    setCustom('')
    setData(PRESETS[preset](size, 40))
  }
  const applyCustom = () => {
    const nums = custom.split(/[, ]+/).map((x) => parseInt(x, 10)).filter((x) => !isNaN(x) && x > 0)
    if (nums.length >= 2) { setData(nums.slice(0, 60)); setSize(nums.length) }
  }

  const showVals = data.length <= 24

  return (
    <div>
      <div className="panel">
        <div className="viz-stage">
          <div className="bars">
            {(step.array || data).map((val, i) => (
              <div key={i} className="bar" style={{ height: `${(val / maxVal) * 100}%`, background: barColor(i) }}>
                {showVals && <span className="bar-val">{val}</span>}
              </div>
            ))}
          </div>
        </div>

        <StatusBar player={player} />
        <PlayerControls player={player} />

        {/* counting sort's count[] array */}
        {step.count && (
          <div style={{ marginTop: 16 }}>
            <div className="field-label">count[]</div>
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {step.count.map((c, val) => (
                <div key={val} style={{
                  minWidth: 30, textAlign: 'center', padding: '4px 2px', borderRadius: 5,
                  fontFamily: 'var(--mono)', fontSize: 12,
                  background: val === step.countHL ? 'var(--compare)' : 'var(--panel-2)',
                  color: val === step.countHL ? '#1a1205' : 'var(--text-dim)',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ fontSize: 9, opacity: 0.7 }}>{val}</div>
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="legend">
          <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--compare)' }} /> {tk('comparing')}</span>
          <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--swap)' }} /> {tk('swapping')}</span>
          <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--accent-3)' }} /> {tk('pivot')}</span>
          <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--done)' }} /> {tk('sorted')}</span>
        </div>
      </div>

      <div className="panel">
        <h3 className="section">{tk('input')}</h3>
        <div className="controls" style={{ marginTop: 4 }}>
          <button className="btn" onClick={() => regen('random')}><Shuffle /> {tk('random')}</button>
          <button className="btn" onClick={() => regen('nearly')}>{tk('nearlySorted')}</button>
          <button className="btn" onClick={() => regen('reversed')}>{tk('reversed')}</button>
          <div className="divider-v" />
          <div className="control-group">
            <span>{tk('size')}</span>
            <input type="range" min="6" max="48" value={size}
              onChange={(e) => { const n = parseInt(e.target.value, 10); setSize(n); setCustom(''); setData(PRESETS.random(n, 40)) }} />
            <span style={{ fontFamily: 'var(--mono)' }}>{size}</span>
          </div>
        </div>
        <div className="controls" style={{ marginTop: 12 }}>
          <input type="text" placeholder={tk('customArray')} value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyCustom()}
            style={{ flex: 1, minWidth: 220 }} />
          <button className="btn" onClick={applyCustom}>{tk('apply')}</button>
        </div>
      </div>
    </div>
  )
}

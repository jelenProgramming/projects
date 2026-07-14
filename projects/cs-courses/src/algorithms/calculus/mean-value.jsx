import { useState } from 'react'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

/**
 * Mean Value Theorem visualizer: draws f on [a,b], the secant from (a,f(a)) to
 * (b,f(b)), and the point c where the tangent is PARALLEL to that secant - which
 * the MVT guarantees exists. Rolle's theorem is the special case f(a)=f(b)
 * (secant horizontal, so f'(c)=0).
 */
export default function Page({ content }) {
  const { t } = useLang()
  const [mode, setMode] = useState('mvt') // 'mvt' or 'rolle'
  // f(x) = 0.18x^3 - 0.9x^2 + x + 2 ; for rolle we shift endpoints to equal heights
  const f = (x) => 0.18 * x * x * x - 0.9 * x * x + 1.0 * x + 2
  const df = (x) => 0.54 * x * x - 1.8 * x + 1.0
  const a = 0.6, b = mode === 'rolle' ? 4.32 : 4.4
  // find c in (a,b) with f'(c) = (f(b)-f(a))/(b-a)
  const target = (f(b) - f(a)) / (b - a)
  let c = a, best = 1e9
  for (let x = a; x <= b; x += 0.001) { const d = Math.abs(df(x) - target); if (d < best) { best = d; c = x } }

  const W = 560, H = 380, pad = 40
  const xMin = 0, xMax = 5, yMin = 0, yMax = 6
  const sx = (x) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad)
  const sy = (y) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad)
  const curve = []; for (let x = xMin; x <= xMax; x += 0.02) curve.push(`${sx(x)},${sy(f(x))}`)
  const secY = (x) => f(a) + target * (x - a)
  const tanY = (x) => f(c) + df(c) * (x - c)

  return (
    <div>
      <div className="panel">
        <div className="controls" style={{ marginBottom: 14 }}>
          <button className={'btn' + (mode === 'mvt' ? ' primary' : '')} onClick={() => setMode('mvt')}>Mean Value Theorem</button>
          <button className={'btn' + (mode === 'rolle' ? ' primary' : '')} onClick={() => setMode('rolle')}>Rolle (f(a)=f(b))</button>
        </div>
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: H + 10 }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: W, width: '100%' }}>
            <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="var(--border)" />
            <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad} stroke="var(--border)" />
            <polyline points={curve.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
            {/* secant */}
            <line x1={sx(a)} y1={sy(secY(a))} x2={sx(b)} y2={sy(secY(b))} stroke="var(--compare)" strokeWidth="2" strokeDasharray="5 4" />
            {/* tangent at c, parallel to secant */}
            <line x1={sx(xMin)} y1={sy(tanY(xMin))} x2={sx(xMax)} y2={sy(tanY(xMax))} stroke="var(--accent-3)" strokeWidth="2" />
            {/* endpoint dots */}
            <circle cx={sx(a)} cy={sy(f(a))} r="5" fill="var(--compare)" />
            <circle cx={sx(b)} cy={sy(f(b))} r="5" fill="var(--compare)" />
            <circle cx={sx(c)} cy={sy(f(c))} r="6" fill="var(--accent-3)" />
            <text x={sx(a)} y={sy(f(a)) + 18} textAnchor="middle" fontSize="12" fontFamily="var(--mono)" fill="var(--text-dim)">a</text>
            <text x={sx(b)} y={sy(f(b)) + 18} textAnchor="middle" fontSize="12" fontFamily="var(--mono)" fill="var(--text-dim)">b</text>
            <text x={sx(c)} y={sy(f(c)) - 12} textAnchor="middle" fontSize="12" fontFamily="var(--mono)" fill="var(--accent-3)">c</text>
          </svg>
        </div>
        <div className="status-bar" style={{ marginTop: 12 }}>
          <span className="step-num">c</span>
          <span className="desc" dangerouslySetInnerHTML={{ __html: t(mode === 'rolle' ? {
            en: `Rolle: since f(a) = f(b), the secant is horizontal, so there is a point c ≈ ${c.toFixed(2)} in (a,b) where the tangent is also horizontal - <b>f′(c) = 0</b>.`,
            de: `Rolle: da f(a) = f(b), ist die Sekante waagerecht, also gibt es ein c ≈ ${c.toFixed(2)} in (a,b), wo die Tangente ebenfalls waagerecht ist - <b>f′(c) = 0</b>.`
          } : {
            en: `MVT: there is a point c ≈ ${c.toFixed(2)} in (a,b) where the tangent (blue) is <b>parallel</b> to the secant (yellow) - the instantaneous rate equals the average rate, <b>f′(c) = ${target.toFixed(2)}</b>.`,
            de: `MWS: es gibt ein c ≈ ${c.toFixed(2)} in (a,b), wo die Tangente (blau) <b>parallel</b> zur Sekante (gelb) ist - die momentane Rate gleicht der mittleren, <b>f′(c) = ${target.toFixed(2)}</b>.`
          }) }} />
        </div>
        <div className="legend">
          <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--compare)' }} /> {t({ en: 'Secant (average rate)', de: 'Sekante (mittlere Rate)' })}</span>
          <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--accent-3)' }} /> {t({ en: 'Tangent at c (instant rate)', de: 'Tangente bei c (Momentanrate)' })}</span>
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

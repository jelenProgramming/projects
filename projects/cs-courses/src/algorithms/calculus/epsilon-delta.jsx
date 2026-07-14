import { useState } from 'react'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

/**
 * Epsilon-Delta limit visualizer. Plots f(x) = x^2 near c, and shows: pick an
 * epsilon band around L = c^2, and a delta band appears around c such that the
 * whole graph over (c-delta, c+delta) stays inside the epsilon band. Drag epsilon
 * to watch delta shrink to fit. The formal statement is shown in math notation.
 */
export default function Page({ content }) {
  const { t } = useLang()
  const [epsilon, setEpsilon] = useState(1.2)
  const c = 2
  const L = c * c // f(x)=x^2, limit at c is 4

  // For f(x)=x^2, |x^2 - L| < eps  =>  delta = min(|sqrt(L+eps)-c|, |c-sqrt(L-eps)|)
  const hi = Math.sqrt(L + epsilon)
  const lo = Math.sqrt(Math.max(0, L - epsilon))
  const delta = Math.min(hi - c, c - lo)

  // plot coordinate system
  const W = 560, H = 380, pad = 40
  const xMin = 0.5, xMax = 3.5, yMin = 0, yMax = 12
  const sx = (x) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad)
  const sy = (y) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad)
  const f = (x) => x * x

  const curve = []
  for (let x = xMin; x <= xMax; x += 0.03) curve.push(`${sx(x)},${sy(f(x))}`)

  return (
    <div>
      <div className="panel">
        <div style={{ textAlign: 'center', marginBottom: 12, fontFamily: 'var(--mono)', fontSize: 15, color: 'var(--text)' }}>
          lim<sub>x→{c}</sub> x² = {L}   |   ∀ε&gt;0 ∃δ&gt;0 : 0&lt;|x-{c}|&lt;δ ⟹ |x²-{L}|&lt;ε
        </div>
        <div className="viz-stage" style={{ minHeight: H + 20, alignItems: 'center' }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: W, width: '100%' }}>
            {/* epsilon band (horizontal) around L */}
            <rect x={pad} y={sy(L + epsilon)} width={W - 2 * pad} height={sy(L - epsilon) - sy(L + epsilon)}
              fill="var(--compare)" opacity="0.13" />
            <line x1={pad} y1={sy(L + epsilon)} x2={W - pad} y2={sy(L + epsilon)} stroke="var(--compare)" strokeDasharray="4 3" strokeWidth="1.5" />
            <line x1={pad} y1={sy(L - epsilon)} x2={W - pad} y2={sy(L - epsilon)} stroke="var(--compare)" strokeDasharray="4 3" strokeWidth="1.5" />

            {/* delta band (vertical) around c */}
            <rect x={sx(c - delta)} y={pad} width={sx(c + delta) - sx(c - delta)} height={H - 2 * pad}
              fill="var(--accent-3)" opacity="0.15" />
            <line x1={sx(c - delta)} y1={pad} x2={sx(c - delta)} y2={H - pad} stroke="var(--accent-3)" strokeDasharray="4 3" strokeWidth="1.5" />
            <line x1={sx(c + delta)} y1={pad} x2={sx(c + delta)} y2={H - pad} stroke="var(--accent-3)" strokeDasharray="4 3" strokeWidth="1.5" />

            {/* axes */}
            <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="var(--border)" strokeWidth="1.5" />
            <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="var(--border)" strokeWidth="1.5" />

            {/* the curve */}
            <polyline points={curve.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2.5" />

            {/* L and c markers */}
            <line x1={pad} y1={sy(L)} x2={sx(c)} y2={sy(L)} stroke="var(--text-faint)" strokeDasharray="2 3" />
            <line x1={sx(c)} y1={sy(L)} x2={sx(c)} y2={H - pad} stroke="var(--text-faint)" strokeDasharray="2 3" />
            <circle cx={sx(c)} cy={sy(L)} r="5" fill="var(--accent)" />
            <text x={sx(c)} y={H - pad + 16} textAnchor="middle" fontSize="12" fontFamily="var(--mono)" fill="var(--text-dim)">c={c}</text>
            <text x={pad - 8} y={sy(L) + 4} textAnchor="end" fontSize="12" fontFamily="var(--mono)" fill="var(--text-dim)">L={L}</text>

            <text x={W - pad} y={sy(L + epsilon) - 5} textAnchor="end" fontSize="11" fill="var(--compare)">L+ε</text>
            <text x={W - pad} y={sy(L - epsilon) + 13} textAnchor="end" fontSize="11" fill="var(--compare)">L-ε</text>
          </svg>
        </div>

        <div className="controls" style={{ marginTop: 16 }}>
          <div className="control-group" style={{ flex: 1 }}>
            <span style={{ minWidth: 16, fontFamily: 'var(--mono)' }}>ε</span>
            <input type="range" min="0.2" max="3" step="0.05" value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))} style={{ flex: 1, maxWidth: 320 }} />
            <span style={{ fontFamily: 'var(--mono)', minWidth: 88 }}>ε = {epsilon.toFixed(2)}</span>
          </div>
        </div>
        <div className="status-bar" style={{ marginTop: 14 }}>
          <span className="step-num">δ</span>
          <span className="desc" dangerouslySetInnerHTML={{ __html: t({
            en: `For this ε, a δ = <b>${delta.toFixed(3)}</b> works: every x within ${delta.toFixed(3)} of c=${c} maps into the ε band around L=${L}. Shrink ε and δ must shrink too - but one always exists. <strong>That</strong> is what the limit existing means.`,
            de: `Fuer dieses ε funktioniert ein δ = <b>${delta.toFixed(3)}</b>: jedes x im Abstand ${delta.toFixed(3)} von c=${c} landet im ε-Band um L=${L}. Verkleinere ε und δ muss auch kleiner werden - aber es existiert immer eines. <strong>Das</strong> bedeutet, dass der Grenzwert existiert.`
          }) }} />
        </div>
        <div className="legend">
          <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--compare)' }} /> {t({ en: 'ε band (around L, on the output)', de: 'ε-Band (um L, am Ausgang)' })}</span>
          <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--accent-3)' }} /> {t({ en: 'δ band (around c, on the input)', de: 'δ-Band (um c, am Eingang)' })}</span>
        </div>
      </div>

      <AlgoDetail content={content} />
    </div>
  )
}

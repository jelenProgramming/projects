import { useState } from 'react'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

export default function Page({ content }) {
  const { t } = useLang()
  const [h, setH] = useState(1.5)
  const f = (x) => 0.25 * x * x * x - x + 2
  const df = (x) => 0.75 * x * x - 1
  const x0 = 1.2
  const W = 560, H = 380, pad = 36
  const xMin = -3, xMax = 3.2, yMin = -2, yMax = 6
  const sx = (x) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad)
  const sy = (y) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad)
  const curve = []; for (let x = xMin; x <= xMax; x += 0.03) curve.push(`${sx(x)},${sy(f(x))}`)
  const x1 = x0 + h
  const secSlope = (f(x1) - f(x0)) / h
  const tanSlope = df(x0)
  // secant line through (x0,f(x0)) and (x1,f(x1))
  const secY = (x) => f(x0) + secSlope * (x - x0)
  const tanY = (x) => f(x0) + tanSlope * (x - x0)
  return (
    <div>
      <div className="panel">
        <div style={{ textAlign: 'center', marginBottom: 10, fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--text)' }}>
          f'(x₀) = lim<sub>h→0</sub> [f(x₀+h) - f(x₀)] / h
        </div>
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: H + 10 }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: W, width: '100%' }}>
            <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="var(--border)" />
            <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad} stroke="var(--border)" />
            <polyline points={curve.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
            {/* secant */}
            <line x1={sx(xMin)} y1={sy(secY(xMin))} x2={sx(xMax)} y2={sy(secY(xMax))} stroke="var(--compare)" strokeWidth="2" strokeDasharray="5 4" />
            {/* tangent */}
            <line x1={sx(xMin)} y1={sy(tanY(xMin))} x2={sx(xMax)} y2={sy(tanY(xMax))} stroke="var(--accent-3)" strokeWidth="2" />
            <circle cx={sx(x0)} cy={sy(f(x0))} r="5" fill="var(--accent)" />
            <circle cx={sx(x1)} cy={sy(f(x1))} r="5" fill="var(--compare)" />
            <text x={sx(x0)} y={sy(f(x0)) + 20} fontSize="11" fill="var(--text-dim)" fontFamily="var(--mono)">x₀</text>
            <text x={sx(x1)} y={sy(f(x1)) - 10} fontSize="11" fill="var(--compare)" fontFamily="var(--mono)">x₀+h</text>
          </svg>
        </div>
        <div className="controls" style={{ marginTop: 14 }}>
          <div className="control-group" style={{ flex: 1 }}>
            <span style={{ fontFamily: 'var(--mono)' }}>h</span>
            <input type="range" min="0.05" max="2" step="0.05" value={h} onChange={(e) => setH(parseFloat(e.target.value))} style={{ flex: 1, maxWidth: 340 }} />
            <span style={{ fontFamily: 'var(--mono)', minWidth: 70 }}>h = {h.toFixed(2)}</span>
          </div>
        </div>
        <div className="status-bar" style={{ marginTop: 12 }}>
          <span className="step-num">slope</span>
          <span className="desc" dangerouslySetInnerHTML={{ __html: t({
            en: `Secant slope = <b style="color:var(--compare)">${secSlope.toFixed(3)}</b>. As h→0 it approaches the tangent slope f'(x₀) = <b style="color:var(--accent-3)">${tanSlope.toFixed(3)}</b>. The derivative <strong>is</strong> that limit.`,
            de: `Sekantensteigung = <b style="color:var(--compare)">${secSlope.toFixed(3)}</b>. Fuer h→0 naehert sie sich der Tangentensteigung f'(x₀) = <b style="color:var(--accent-3)">${tanSlope.toFixed(3)}</b>. Die Ableitung <strong>ist</strong> dieser Grenzwert.`
          }) }} />
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

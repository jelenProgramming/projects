import { useState } from 'react'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

export default function Page({ content }) {
  const { t } = useLang()
  const [n, setN] = useState(8)
  const f = (x) => -0.15 * x * x + 1.2 * x + 1
  const a = 0.5, b = 6
  const W = 560, H = 360, pad = 36
  const xMin = 0, xMax = 6.5, yMin = 0, yMax = 4
  const sx = (x) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad)
  const sy = (y) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad)
  const curve = []; for (let x = xMin; x <= xMax; x += 0.03) curve.push(`${sx(x)},${sy(f(x))}`)
  const dx = (b - a) / n
  let area = 0
  const rects = []
  for (let i = 0; i < n; i++) { const x = a + i * dx; const h = f(x + dx / 2); area += h * dx; rects.push({ x, h }) }
  // true integral approx (fine)
  let exact = 0; for (let x = a; x < b; x += 0.001) exact += f(x) * 0.001
  return (
    <div>
      <div className="panel">
        <div style={{ textAlign: 'center', marginBottom: 10, fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--text)' }}>
          ∫<sub>a</sub><sup>b</sup> f(x) dx = lim<sub>n→∞</sub> Σ f(xᵢ)∗Δx
        </div>
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: H + 10 }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: W, width: '100%' }}>
            {rects.map((r, i) => (
              <rect key={i} x={sx(r.x)} y={sy(r.h)} width={sx(r.x + dx) - sx(r.x) - 1} height={sy(0) - sy(r.h)}
                fill="var(--accent-3)" opacity="0.4" stroke="var(--accent-3)" strokeWidth="1" />
            ))}
            <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="var(--border)" />
            <polyline points={curve.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="controls" style={{ marginTop: 14 }}>
          <div className="control-group" style={{ flex: 1 }}>
            <span>n</span>
            <input type="range" min="2" max="60" value={n} onChange={(e) => setN(+e.target.value)} style={{ flex: 1, maxWidth: 340 }} />
            <span style={{ fontFamily: 'var(--mono)', minWidth: 90 }}>{n} {t({ en: 'rectangles', de: 'Rechtecke' })}</span>
          </div>
        </div>
        <div className="status-bar" style={{ marginTop: 12 }}>
          <span className="step-num">area</span>
          <span className="desc" dangerouslySetInnerHTML={{ __html: t({
            en: `Sum of rectangles = <b>${area.toFixed(3)}</b>, true integral ≈ <b style="color:var(--accent)">${exact.toFixed(3)}</b>. More, thinner rectangles → the sum converges to the exact area. That limit is the definite integral.`,
            de: `Summe der Rechtecke = <b>${area.toFixed(3)}</b>, echtes Integral ≈ <b style="color:var(--accent)">${exact.toFixed(3)}</b>. Mehr, duennere Rechtecke → die Summe konvergiert zur exakten Flaeche. Dieser Grenzwert ist das bestimmte Integral.`
          }) }} />
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

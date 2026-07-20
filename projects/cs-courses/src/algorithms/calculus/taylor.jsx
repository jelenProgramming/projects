import { useState } from 'react'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

const fact = (k) => { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r }
export default function Page({ content }) {
  const { t } = useLang()
  const [terms, setTerms] = useState(3)
  // approximate sin(x) by its Maclaurin series
  const f = (x) => Math.sin(x)
  const taylor = (x) => { let s = 0; for (let k = 0; k < terms; k++) { const n = 2 * k + 1; s += ((-1) ** k) * (x ** n) / fact(n) } return s }
  const W = 560, H = 360, pad = 36
  const xMin = -7, xMax = 7, yMin = -2.2, yMax = 2.2
  const sx = (x) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad)
  const sy = (y) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad)
  const cTrue = [], cApprox = []
  for (let x = xMin; x <= xMax; x += 0.03) { cTrue.push(`${sx(x)},${sy(f(x))}`); const a = taylor(x); if (a > yMin - 2 && a < yMax + 2) cApprox.push(`${sx(x)},${sy(Math.max(yMin - 1, Math.min(yMax + 1, a)))}`) }
  return (
    <div>
      <div className="panel">
        <div style={{ textAlign: 'center', marginBottom: 10, fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text)' }}>
          sin(x) ≈ x - x³/3! + x⁵/5! - x⁷/7! + ...
        </div>
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: H + 10 }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: W, width: '100%' }}>
            <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="var(--border)" />
            <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad} stroke="var(--border)" />
            <polyline points={cTrue.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
            <polyline points={cApprox.join(' ')} fill="none" stroke="var(--compare)" strokeWidth="2.5" strokeDasharray="6 4" />
          </svg>
        </div>
        <div className="controls" style={{ marginTop: 14 }}>
          <div className="control-group" style={{ flex: 1 }}>
            <span>{t({ en: 'Terms', de: 'Terme' })}</span>
            <input type="range" min="1" max="9" value={terms} onChange={(e) => setTerms(+e.target.value)} style={{ flex: 1, maxWidth: 320 }} />
            <span style={{ fontFamily: 'var(--mono)', minWidth: 80 }}>{terms} {t({ en: 'terms', de: 'Terme' })}</span>
          </div>
        </div>
        <div className="legend">
          <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--accent)' }} /> sin(x)</span>
          <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--compare)' }} /> {t({ en: 'Taylor approximation', de: 'Taylor-Näherung' })}</span>
        </div>
        <div className="note" style={{ marginTop: 12 }}>{t({ en: 'With more terms the polynomial hugs the true curve over a wider range. Near x=0 even a few terms are near-perfect; far out you need more.', de: 'Mit mehr Termen schmiegt sich das Polynom über einen grösseren Bereich an die echte Kurve. Nahe x=0 reichen wenige Terme; weit draussen braucht man mehr.' })}</div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

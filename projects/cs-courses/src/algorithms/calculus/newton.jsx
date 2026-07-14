import { useMemo } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

// find a root of f(x)=x^2-2 (=> sqrt 2) by Newton's method
const f = (x) => x * x - 2
const df = (x) => 2 * x
function newtonSteps() {
  const steps = []
  let x = 2.5
  const snap = (extra, msg) => steps.push({ x, ...extra, message: msg })
  snap({}, { en: "Newton's method finds a root of f(x)=x²-2 (i.e. √2). Start at a guess; follow the tangent down to the x-axis; repeat.", de: "Newtons Verfahren findet eine Nullstelle von f(x)=x²-2 (also √2). Mit einer Schaetzung beginnen; der Tangente zur x-Achse folgen; wiederholen." })
  for (let i = 0; i < 5; i++) {
    const fx = f(x), dfx = df(x)
    const xn = x - fx / dfx
    snap({ tangentAt: x, next: xn }, { en: `x = ${x.toFixed(5)}, f(x) = ${fx.toFixed(5)}. Tangent hits the axis at ${xn.toFixed(5)}.`, de: `x = ${x.toFixed(5)}, f(x) = ${fx.toFixed(5)}. Tangente trifft die Achse bei ${xn.toFixed(5)}.` })
    x = xn
    if (Math.abs(fx) < 1e-9) break
  }
  snap({ done: true }, { en: `Converged to ${x.toFixed(6)} ≈ √2. Newton roughly doubles the correct digits each step (quadratic convergence).`, de: `Konvergiert zu ${x.toFixed(6)} ≈ √2. Newton verdoppelt etwa die korrekten Stellen pro Schritt (quadratische Konvergenz).` })
  return steps
}
export default function Page({ content }) {
  const steps = useMemo(() => newtonSteps(), [])
  const player = usePlayer(steps, { speed: 1 })
  const s = player.step
  const W = 560, H = 360, pad = 36
  const xMin = 0, xMax = 3, yMin = -3, yMax = 7
  const sx = (x) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad)
  const sy = (y) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad)
  const curve = []; for (let x = xMin; x <= xMax; x += 0.02) curve.push(`${sx(x)},${sy(f(x))}`)
  const xt = s.tangentAt
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: H + 10 }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: W, width: '100%' }}>
            <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="var(--border)" />
            <polyline points={curve.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
            {xt != null && (() => { const yt = f(xt), m = df(xt); const tanY = (x) => yt + m * (x - xt); return (
              <>
                <line x1={sx(xMin)} y1={sy(tanY(xMin))} x2={sx(xMax)} y2={sy(tanY(xMax))} stroke="var(--compare)" strokeWidth="2" />
                <circle cx={sx(xt)} cy={sy(yt)} r="5" fill="var(--compare)" />
                <line x1={sx(xt)} y1={sy(yt)} x2={sx(xt)} y2={sy(0)} stroke="var(--text-faint)" strokeDasharray="2 3" />
                {s.next != null && <circle cx={sx(s.next)} cy={sy(0)} r="5" fill="var(--accent-3)" />}
              </>
            ) })()}
            <line x1={sx(Math.SQRT2)} y1={pad} x2={sx(Math.SQRT2)} y2={H - pad} stroke="var(--done)" strokeDasharray="3 3" opacity="0.6" />
            <text x={sx(Math.SQRT2)} y={pad - 4} textAnchor="middle" fontSize="11" fill="var(--done)">√2</text>
          </svg>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

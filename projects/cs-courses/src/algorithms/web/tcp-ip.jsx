import { useMemo } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import AlgoDetail from '../../components/AlgoDetail.jsx'

function handshakeSteps() {
  return [
    { phase: 0, message: { en: 'A TCP connection starts with a three-way handshake before any data flows.', de: 'Eine TCP-Verbindung beginnt mit einem Drei-Wege-Handshake, bevor Daten fliessen.' } },
    { phase: 1, arrow: 'rtl', label: 'SYN', message: { en: 'Client → Server: SYN (can we talk? here is my sequence number).', de: 'Client → Server: SYN (koennen wir reden? hier meine Sequenznummer).' } },
    { phase: 2, arrow: 'ltr', label: 'SYN-ACK', message: { en: 'Server → Client: SYN-ACK (yes, and here is mine).', de: 'Server → Client: SYN-ACK (ja, und hier meine).' } },
    { phase: 3, arrow: 'rtl', label: 'ACK', message: { en: 'Client → Server: ACK (got it). Connection established - now data can flow.', de: 'Client → Server: ACK (erhalten). Verbindung steht - jetzt koennen Daten fliessen.' } },
    { phase: 4, done: true, message: { en: 'Established. This handshake is why TCP is reliable but has initial latency.', de: 'Aufgebaut. Dieser Handshake macht TCP zuverlaessig, kostet aber Anfangslatenz.' } },
  ]
}
export default function Page({ content }) {
  const steps = useMemo(() => handshakeSteps(), [])
  const player = usePlayer(steps, { speed: 0.8 })
  const s = player.step
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 280 }}>
          <svg viewBox="0 0 560 240" style={{ maxWidth: 560 }}>
            <text x="80" y="24" textAnchor="middle" fontWeight="700" fill="var(--text)">Client</text>
            <text x="480" y="24" textAnchor="middle" fontWeight="700" fill="var(--text)">Server</text>
            <line x1="80" y1="36" x2="80" y2="220" stroke="var(--border)" strokeWidth="2" />
            <line x1="480" y1="36" x2="480" y2="220" stroke="var(--border)" strokeWidth="2" />
            {s.phase >= 1 && <Arrow y={70} dir="rtl" label="SYN" active={s.phase === 1} />}
            {s.phase >= 2 && <Arrow y={120} dir="ltr" label="SYN-ACK" active={s.phase === 2} />}
            {s.phase >= 3 && <Arrow y={170} dir="rtl" label="ACK" active={s.phase === 3} />}
            {s.done && <text x="280" y="215" textAnchor="middle" fill="var(--done)" fontWeight="700" fontSize="13">● ESTABLISHED</text>}
          </svg>
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}
function Arrow({ y, dir, label, active }) {
  const x1 = dir === 'rtl' ? 80 : 480, x2 = dir === 'rtl' ? 480 : 80
  const color = active ? 'var(--compare)' : 'var(--accent-3)'
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={active ? 3 : 2} markerEnd="url(#ah)" style={{ transition: 'stroke 0.3s' }} />
      <text x="280" y={y - 8} textAnchor="middle" fontFamily="var(--mono)" fontSize="13" fontWeight="700" fill={color}>{label}</text>
      <defs><marker id="ah" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill={color} /></marker></defs>
    </g>
  )
}

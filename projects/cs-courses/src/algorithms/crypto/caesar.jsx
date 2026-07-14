import { useState } from 'react'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const shiftChar = (ch, k) => { const i = A.indexOf(ch.toUpperCase()); return i < 0 ? ch : A[(i + k + 26) % 26] }

export default function Page({ content }) {
  const { tk, t } = useLang()
  const [text, setText] = useState('HELLO WORLD')
  const [k, setK] = useState(3)
  const out = text.split('').map((c) => shiftChar(c, k)).join('')
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ flexDirection: 'column', gap: 22, minHeight: 240, alignItems: 'center' }}>
          {/* alphabet shift wheel (linear) */}
          <svg viewBox="0 0 680 96" style={{ maxWidth: 680, width: '100%' }}>
            {A.split('').map((ch, i) => (
              <g key={i}>
                <text x={14 + i * 25} y={24} textAnchor="middle" fontFamily="var(--mono)" fontSize="13" fill="var(--text-faint)">{ch}</text>
                <line x1={14 + i * 25} y1={32} x2={14 + ((i + k) % 26) * 25} y2={64} stroke="var(--accent-3)" strokeWidth="1" opacity="0.35" />
                <text x={14 + i * 25} y={84} textAnchor="middle" fontFamily="var(--mono)" fontSize="13" fill="var(--accent)">{A[(i + k) % 26]}</text>
              </g>
            ))}
          </svg>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 18, color: 'var(--text-dim)', letterSpacing: 2 }}>{text}</div>
            <div style={{ fontSize: 22, margin: '6px 0', color: 'var(--text-faint)' }}>↓ {t({ en: 'shift', de: 'verschieben' })} {k}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 22, color: 'var(--accent)', letterSpacing: 2, fontWeight: 700 }}>{out}</div>
          </div>
        </div>
        <div className="controls" style={{ marginTop: 16 }}>
          <input type="text" value={text} onChange={(e) => setText(e.target.value.toUpperCase())} style={{ flex: 1, minWidth: 200 }} />
          <div className="control-group">
            <span>{tk('shift')}</span>
            <input type="range" min="0" max="25" value={k} onChange={(e) => setK(parseInt(e.target.value, 10))} />
            <span style={{ fontFamily: 'var(--mono)', minWidth: 24 }}>{k}</span>
          </div>
        </div>
        <div className="note" style={{ marginTop: 12 }}>{t({ en: 'ROT13 is just Caesar with shift 13. With only 25 possible shifts, brute force breaks it instantly.', de: 'ROT13 ist Caesar mit Verschiebung 13. Mit nur 25 moeglichen Verschiebungen knackt Brute Force es sofort.' })}</div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

import { useState } from 'react'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

const GATES = {
  AND: (a, b) => a & b, OR: (a, b) => a | b, XOR: (a, b) => a ^ b,
  NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b),
}
export default function Page({ content }) {
  const { t } = useLang()
  const [gate, setGate] = useState('AND')
  const [a, setA] = useState(1); const [b, setB] = useState(0)
  const out = GATES[gate](a, b)
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ flexDirection: 'column', gap: 24, minHeight: 240, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <button className="btn" onClick={() => setA(1 - a)} style={{ fontFamily: 'var(--mono)', fontSize: 18, width: 56, justifyContent: 'center' }}>A={a}</button>
              <button className="btn" onClick={() => setB(1 - b)} style={{ fontFamily: 'var(--mono)', fontSize: 18, width: 56, justifyContent: 'center' }}>B={b}</button>
            </div>
            <svg width="120" height="80" viewBox="0 0 120 80">
              <line x1="0" y1="25" x2="40" y2="25" stroke="var(--border)" strokeWidth="2" />
              <line x1="0" y1="55" x2="40" y2="55" stroke="var(--border)" strokeWidth="2" />
              <rect x="40" y="14" width="50" height="52" rx="8" fill="var(--panel-2)" stroke="var(--accent-3)" strokeWidth="2" />
              <text x="65" y="44" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" fill="var(--text)">{gate}</text>
              <line x1="90" y1="40" x2="120" y2="40" stroke={out ? 'var(--accent)' : 'var(--border)'} strokeWidth="3" />
            </svg>
            <div style={{ width: 56, height: 56, display: 'grid', placeItems: 'center', borderRadius: 10, fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 700,
              background: out ? 'var(--accent)' : 'var(--panel-2)', color: out ? '#06251f' : 'var(--text-faint)', border: '1px solid var(--border)' }}>{out}</div>
          </div>
          {/* truth table */}
          <table className="grid-table" style={{ fontSize: 14 }}>
            <thead><tr><td className="hd">A</td><td className="hd">B</td><td className="hd">{gate}</td></tr></thead>
            <tbody>
              {[[0,0],[0,1],[1,0],[1,1]].map(([ta, tb], i) => {
                const cur = ta === a && tb === b
                return <tr key={i}><td style={cur ? { background: 'var(--compare)', color: '#1a1205' } : {}}>{ta}</td><td style={cur ? { background: 'var(--compare)', color: '#1a1205' } : {}}>{tb}</td><td style={{ color: GATES[gate](ta, tb) ? 'var(--accent)' : 'var(--text-faint)', fontWeight: cur ? 800 : 400 }}>{GATES[gate](ta, tb)}</td></tr>
              })}
            </tbody>
          </table>
        </div>
        <div className="controls" style={{ marginTop: 16 }}>
          {Object.keys(GATES).map((g) => <button key={g} className={'btn' + (g === gate ? ' primary' : '')} onClick={() => setGate(g)}>{g}</button>)}
        </div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

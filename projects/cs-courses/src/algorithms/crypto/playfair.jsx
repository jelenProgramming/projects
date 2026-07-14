import { useState } from 'react'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

function buildMatrix(key) {
  const seen = new Set(); const seq = []
  const clean = (key + 'ABCDEFGHIKLMNOPQRSTUVWXYZ').toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '')
  for (const c of clean) if (!seen.has(c)) { seen.add(c); seq.push(c) }
  const m = []; for (let i = 0; i < 5; i++) m.push(seq.slice(i * 5, i * 5 + 5))
  return m
}
export default function Page({ content }) {
  const { tk, t } = useLang()
  const [key, setKey] = useState('MONARCHY')
  const m = buildMatrix(key)
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ minHeight: 280, alignItems: 'center', flexDirection: 'column', gap: 16 }}>
          <div className="field-label">{t({ en: '5×5 key matrix (J merged into I)', de: '5×5-Schluesselmatrix (J mit I verschmolzen)' })}</div>
          <table className="grid-table" style={{ fontSize: 18 }}>
            <tbody>
              {m.map((row, i) => <tr key={i}>{row.map((c, j) => <td key={j} style={{ width: 46, height: 46, color: 'var(--accent)', fontWeight: 700 }}>{c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
        <div className="controls" style={{ marginTop: 16 }}>
          <div style={{ flex: 1, minWidth: 200 }}><label className="field-label">{tk('key')}</label><input type="text" value={key} onChange={(e) => setKey(e.target.value.toUpperCase())} style={{ width: '100%' }} /></div>
        </div>
        <div className="note" style={{ marginTop: 12 }}>{t({ en: 'Playfair encrypts letter pairs using their positions in this 5×5 grid: same row → shift right, same column → shift down, otherwise → rectangle swap. Encrypting pairs (not single letters) hides letter frequencies.', de: 'Playfair verschluesselt Buchstabenpaare ueber ihre Position im 5×5-Gitter: gleiche Zeile → nach rechts, gleiche Spalte → nach unten, sonst → Rechteck-Tausch.' })}</div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

import { useState } from 'react'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export default function Page({ content }) {
  const { tk, t } = useLang()
  const [text, setText] = useState('ATTACKATDAWN')
  const [key, setKey] = useState('LEMON')
  const clean = text.replace(/[^A-Z]/gi, '').toUpperCase()
  const k = (key.replace(/[^A-Z]/gi, '').toUpperCase() || 'A')
  const rows = clean.split('').map((ch, i) => {
    const kc = k[i % k.length]
    const shift = A.indexOf(kc)
    const enc = A[(A.indexOf(ch) + shift) % 26]
    return { ch, kc, shift, enc }
  })
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ minHeight: 220, overflowX: 'auto', alignItems: 'center' }}>
          <table className="grid-table" style={{ fontSize: 13 }}>
            <tbody>
              <tr><td className="hd" style={{ textAlign: 'right', paddingRight: 8 }}>{t({ en: 'plain', de: 'Klar' })}</td>{rows.map((r, i) => <td key={i}>{r.ch}</td>)}</tr>
              <tr><td className="hd" style={{ textAlign: 'right', paddingRight: 8 }}>{tk('key')}</td>{rows.map((r, i) => <td key={i} style={{ color: 'var(--accent-3)' }}>{r.kc}</td>)}</tr>
              <tr><td className="hd" style={{ textAlign: 'right', paddingRight: 8 }}>{t({ en: 'cipher', de: 'Geheim' })}</td>{rows.map((r, i) => <td key={i} style={{ background: 'color-mix(in srgb, var(--accent) 18%, transparent)', color: 'var(--accent)', fontWeight: 700 }}>{r.enc}</td>)}</tr>
            </tbody>
          </table>
        </div>
        <div className="controls" style={{ marginTop: 16 }}>
          <div style={{ flex: 1, minWidth: 200 }}><label className="field-label">{t({ en: 'Plaintext', de: 'Klartext' })}</label><input type="text" value={text} onChange={(e) => setText(e.target.value.toUpperCase())} style={{ width: '100%' }} /></div>
          <div style={{ minWidth: 120 }}><label className="field-label">{tk('key')}</label><input type="text" value={key} onChange={(e) => setKey(e.target.value.toUpperCase())} style={{ width: '100%' }} /></div>
        </div>
        <div className="note" style={{ marginTop: 12 }}>{t({ en: 'Each letter uses a Caesar shift given by the repeating keyword. The same plaintext letter encrypts differently depending on position - that defeats simple frequency analysis.', de: 'Jeder Buchstabe nutzt eine Caesar-Verschiebung aus dem wiederholten Schluesselwort. Derselbe Klarbuchstabe wird je nach Position anders verschluesselt.' })}</div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

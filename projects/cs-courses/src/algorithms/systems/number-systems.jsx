import { useState } from 'react'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

export default function Page({ content }) {
  const { t } = useLang()
  const [dec, setDec] = useState(173)
  const clamp = (v) => Math.max(0, Math.min(255, v))
  const bin = dec.toString(2).padStart(8, '0')
  const hex = dec.toString(16).toUpperCase().padStart(2, '0')
  const bits = bin.split('').map((b, i) => ({ b: +b, val: 128 >> i }))
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ flexDirection: 'column', gap: 24, minHeight: 260, alignItems: 'center' }}>
          {/* bit boxes - clickable */}
          <div style={{ display: 'flex', gap: 6 }}>
            {bits.map((bit, i) => (
              <div key={i} onClick={() => setDec(dec ^ bit.val)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 700,
                  background: bit.b ? 'var(--accent)' : 'var(--panel-2)', color: bit.b ? '#06251f' : 'var(--text-faint)', border: '1px solid var(--border)', transition: 'all 0.15s' }}>{bit.b}</div>
                <div style={{ fontSize: 10, color: 'var(--text-faint)', fontFamily: 'var(--mono)', marginTop: 4 }}>{bit.val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>
            {t({ en: 'click a bit to flip it', de: 'Bit anklicken zum Umschalten' })}
          </div>
          <div style={{ display: 'flex', gap: 40, fontFamily: 'var(--mono)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'var(--text-faint)' }}>DEC</div><div style={{ fontSize: 28, color: 'var(--accent)', fontWeight: 700 }}>{dec}</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'var(--text-faint)' }}>BIN</div><div style={{ fontSize: 28, color: 'var(--accent-2)', fontWeight: 700 }}>{bin}</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: 'var(--text-faint)' }}>HEX</div><div style={{ fontSize: 28, color: 'var(--accent-3)', fontWeight: 700 }}>0x{hex}</div></div>
          </div>
        </div>
        <div className="controls" style={{ marginTop: 16 }}>
          <div className="control-group" style={{ flex: 1 }}>
            <span>DEC</span>
            <input type="range" min="0" max="255" value={dec} onChange={(e) => setDec(+e.target.value)} style={{ flex: 1, maxWidth: 300 }} />
            <input type="number" value={dec} onChange={(e) => setDec(clamp(+e.target.value || 0))} style={{ width: 80 }} />
          </div>
        </div>
        <div className="note" style={{ marginTop: 12 }}>{t({ en: 'Each bit is a power of two. Hex groups 4 bits into one digit (0-F), which is why one byte is exactly two hex digits. That grouping is the whole reason hex is used.', de: 'Jedes Bit ist eine Zweierpotenz. Hex fasst 4 Bits zu einer Ziffer (0-F) zusammen, weshalb ein Byte genau zwei Hex-Ziffern ist.' })}</div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

import { useState } from 'react'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

const LEFT = [{ id: 1, name: 'Ana' }, { id: 2, name: 'Ben' }, { id: 3, name: 'Cara' }]
const RIGHT = [{ uid: 2, city: 'Berlin' }, { uid: 3, city: 'Vienna' }, { uid: 4, city: 'Zurich' }]
const JOINS = ['INNER', 'LEFT', 'RIGHT', 'FULL']

function compute(type) {
  const rows = []
  const matchL = new Set(), matchR = new Set()
  LEFT.forEach((l) => RIGHT.forEach((r) => { if (l.id === r.uid) { rows.push({ l, r }); matchL.add(l.id); matchR.add(r.uid) } }))
  if (type === 'LEFT' || type === 'FULL') LEFT.forEach((l) => { if (!matchL.has(l.id)) rows.push({ l, r: null }) })
  if (type === 'RIGHT' || type === 'FULL') RIGHT.forEach((r) => { if (!matchR.has(r.uid)) rows.push({ l: null, r }) })
  return rows
}
export default function Page({ content }) {
  const { t } = useLang()
  const [type, setType] = useState('INNER')
  const rows = compute(type)
  const sql = `SELECT *\nFROM users u\n${type === 'INNER' ? 'INNER JOIN' : type === 'LEFT' ? 'LEFT JOIN' : type === 'RIGHT' ? 'RIGHT JOIN' : 'FULL OUTER JOIN'} cities c\n  ON u.id = c.uid;`
  return (
    <div>
      <div className="panel">
        <div className="controls" style={{ marginBottom: 16 }}>
          {JOINS.map((j) => <button key={j} className={'btn' + (j === type ? ' primary' : '')} onClick={() => setType(j)}>{j} JOIN</button>)}
        </div>
        <pre className="code" style={{ marginBottom: 16 }}>{sql}</pre>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <div>
            <div className="field-label">users</div>
            <table className="cx-table"><thead><tr><th>id</th><th>name</th></tr></thead><tbody>
              {LEFT.map((l) => <tr key={l.id}><td>{l.id}</td><td>{l.name}</td></tr>)}
            </tbody></table>
          </div>
          <div>
            <div className="field-label">cities</div>
            <table className="cx-table"><thead><tr><th>uid</th><th>city</th></tr></thead><tbody>
              {RIGHT.map((r) => <tr key={r.uid}><td>{r.uid}</td><td>{r.city}</td></tr>)}
            </tbody></table>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="field-label" style={{ color: 'var(--accent)' }}>{type} JOIN result</div>
            <table className="cx-table"><thead><tr><th>id</th><th>name</th><th>uid</th><th>city</th></tr></thead><tbody>
              {rows.map((row, i) => <tr key={i}>
                <td style={!row.l ? { color: 'var(--accent-4)' } : {}}>{row.l ? row.l.id : 'NULL'}</td>
                <td style={!row.l ? { color: 'var(--accent-4)' } : {}}>{row.l ? row.l.name : 'NULL'}</td>
                <td style={!row.r ? { color: 'var(--accent-4)' } : {}}>{row.r ? row.r.uid : 'NULL'}</td>
                <td style={!row.r ? { color: 'var(--accent-4)' } : {}}>{row.r ? row.r.city : 'NULL'}</td>
              </tr>)}
            </tbody></table>
          </div>
        </div>
        <div className="note" style={{ marginTop: 14 }}>{t({ en: 'INNER keeps only matching rows. LEFT keeps all users (NULLs where no city). RIGHT keeps all cities. FULL keeps everything. NULLs (pink) show where a side had no match.', de: 'INNER behält nur passende Zeilen. LEFT behält alle users (NULL ohne Stadt). RIGHT behält alle cities. FULL behält alles. NULL (pink) zeigt fehlende Treffer.' })}</div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

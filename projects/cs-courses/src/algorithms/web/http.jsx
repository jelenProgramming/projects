import { useState } from 'react'
import AlgoDetail from '../../components/AlgoDetail.jsx'
import { useLang } from '../../i18n.jsx'

const METHODS = { GET: { en: 'read data', de: 'Daten lesen' }, POST: { en: 'create data', de: 'Daten erstellen' }, PUT: { en: 'replace data', de: 'Daten ersetzen' }, DELETE: { en: 'remove data', de: 'Daten löschen' } }
const STATUS = [{ c: 200, t: 'OK', g: 'var(--done)' }, { c: 301, t: 'Moved', g: 'var(--accent-3)' }, { c: 404, t: 'Not Found', g: 'var(--compare)' }, { c: 500, t: 'Server Error', g: 'var(--accent-4)' }]
export default function Page({ content }) {
  const { t } = useLang()
  const [method, setMethod] = useState('GET')
  const [status, setStatus] = useState(200)
  const st = STATUS.find((s) => s.c === status)
  return (
    <div>
      <div className="panel">
        <div className="viz-stage" style={{ flexDirection: 'column', gap: 16, minHeight: 240, alignItems: 'stretch' }}>
          <div>
            <div className="field-label">{t({ en: 'Request', de: 'Anfrage' })}</div>
            <pre className="code">{method} /api/users/42 HTTP/1.1
Host: example.com
Accept: application/json
{method === 'POST' || method === 'PUT' ? '\n{ "name": "Ana" }' : ''}</pre>
          </div>
          <div>
            <div className="field-label">{t({ en: 'Response', de: 'Antwort' })}</div>
            <pre className="code"><span style={{ color: st.g, fontWeight: 700 }}>HTTP/1.1 {status} {st.t}</span>
Content-Type: application/json

{status === 200 ? '{ "id": 42, "name": "Ana" }' : status === 404 ? '{ "error": "user not found" }' : status === 301 ? '(redirect to new URL)' : '{ "error": "internal error" }'}</pre>
          </div>
        </div>
        <div className="controls" style={{ marginTop: 14 }}>
          {Object.keys(METHODS).map((m) => <button key={m} className={'btn' + (m === method ? ' primary' : '')} onClick={() => setMethod(m)}>{m}</button>)}
          <div className="divider-v" />
          {STATUS.map((s) => <button key={s.c} className={'btn' + (s.c === status ? ' primary' : '')} onClick={() => setStatus(s.c)}>{s.c}</button>)}
        </div>
        <div className="note" style={{ marginTop: 12 }}>{t({ en: `${method} = ${METHODS[method].en}. Status families: 2xx success, 3xx redirect, 4xx client error, 5xx server error. HTTP is stateless - each request stands alone.`, de: `${method} = ${METHODS[method].de}. Statusfamilien: 2xx Erfolg, 3xx Umleitung, 4xx Client-Fehler, 5xx Server-Fehler. HTTP ist zustandslos.` })}</div>
      </div>
      <AlgoDetail content={content} />
    </div>
  )
}

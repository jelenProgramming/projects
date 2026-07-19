import { useLang } from '../i18n.jsx'
import { renderTex , mathify } from './Math.jsx'

/**
 * Prominent "Definitions & Theorems" panel. Each def: { name, body, formal? }
 * where name/body are {en,de} (or string).
 *
 * `formal` is a language-neutral statement shown in a highlighted block. It may be:
 *   - a string            -> rendered as-is (HTML allowed), monospace block
 *   - { tex: '...' }      -> rendered as real math via KaTeX (display mode)
 * The { tex } form is the per-formula opt-in to LaTeX rendering.
 */
function Formal({ formal }) {
  if (formal && typeof formal === 'object' && formal.tex != null) {
    return <span className="formal formal-tex"
      dangerouslySetInnerHTML={{ __html: renderTex(formal.tex, { display: true }) }} />
  }
  return <span className="formal" dangerouslySetInnerHTML={{ __html: mathify(formal) }} />
}

export default function DefCards({ defs }) {
  const { t } = useLang()
  if (!defs || !defs.length) return null
  return (
    <div className="panel defs-panel">
      <h2 className="section">{t({ en: 'Definitions & named theorems', de: 'Definitionen & benannte Sätze' })}</h2>
      {defs.map((d, i) => (
        <div className="def-card" key={i}>
          <span className="def-name">{t(d.name)}</span>
          <div className="def-body">
            <span dangerouslySetInnerHTML={{ __html: mathify(t(d.body)) }} />
            {d.formal && <Formal formal={d.formal} />}
          </div>
        </div>
      ))}
    </div>
  )
}

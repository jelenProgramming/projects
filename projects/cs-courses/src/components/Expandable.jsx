import { useLang } from '../i18n.jsx'

/**
 * In cram mode, wraps a verbose section. If not expanded, shows a compact
 * "Explain more" button; clicking reveals the children (with the rolling-pin
 * flip) and remembers it. In explore mode it just renders children.
 */
export default function Expandable({ calm, open, onToggle, label, children }) {
  const { t } = useLang()
  if (!calm) return children
  if (open) {
    return (
      <div className="explain-reveal">
        {children}
        <button className="explain-toggle open" onClick={onToggle}>
          {t({ en: 'Show less', de: 'Weniger zeigen' })} ↑
        </button>
      </div>
    )
  }
  return (
    <button className="explain-toggle" onClick={onToggle}>
      {t({ en: 'Explain more', de: 'Mehr erklaeren' })}: {t(label)} ↓
    </button>
  )
}

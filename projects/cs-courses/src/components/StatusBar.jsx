import { useLang } from '../i18n.jsx'

/**
 * The "what is happening right now" line. The single most important teaching
 * element: every step carries a plain-language { en, de } message so a stuck
 * student can read what the algorithm just decided, not just see colors move.
 */
export default function StatusBar({ player }) {
  const { step, index, total } = player
  const { t } = useLang()
  const msg = t(step.message) || '-'
  return (
    <div className="status-bar">
      <span className="step-num">{index + 1} / {total}</span>
      <span className="desc" dangerouslySetInnerHTML={{ __html: msg }} />
    </div>
  )
}

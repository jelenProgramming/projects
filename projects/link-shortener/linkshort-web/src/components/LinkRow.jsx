import { useState } from 'react'
import { Copy, Check, Trash2 } from 'lucide-react'

function timeAgo(iso, t) {
  const d = (Date.now() - new Date(iso)) / 1000
  if (d < 60) return t.justNow
  if (d < 3600) return t.minAgo === 'm ago' ? `${Math.floor(d / 60)}m ago` : `vor ${Math.floor(d / 60)}${t.minAgo}`
  if (d < 86400) return t.hourAgo === 'h ago' ? `${Math.floor(d / 3600)}h ago` : `vor ${Math.floor(d / 3600)}${t.hourAgo}`
  return t.dayAgo === 'd ago' ? `${Math.floor(d / 86400)}d ago` : `vor ${Math.floor(d / 86400)}${t.dayAgo}`
}

export default function LinkRow({ link, active, onSelect, onDelete, t }) {
  const [copied, setCopied] = useState(false)

  function copy(e) {
    e.stopPropagation()
    navigator.clipboard?.writeText(link.short_url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    })
  }

  return (
    <div className={`row ${active ? 'row--active' : ''}`} onClick={() => onSelect(link.slug)}>
      <div className="row__main">
        <div className="row__short">
          <span className="row__slug">/{link.slug}</span>
          <button className={`row__copy ${copied ? 'row__copy--done' : ''}`} onClick={copy}>
            {copied ? <Check className="row-ico" aria-hidden="true" /> : <Copy className="row-ico" aria-hidden="true" />}
            {copied ? t.copied : t.copy}
          </button>
        </div>
        <div className="row__orig">{link.original_url}</div>
      </div>
      <div className="row__side">
        <div className="row__clicks">
          <span className="row__clicksnum">{link.clicks}</span>
          <span className="row__clickslbl">{t.clicks}</span>
        </div>
        <div className="row__time">{timeAgo(link.created_at, t)}</div>
        <button
          className="row__del"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(link.slug)
          }}
          title={t.deleteTitle}
        >
          <Trash2 className="row-ico" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

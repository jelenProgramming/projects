import { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ALGORITHMS, COURSE_LABELS, prefetchComponent } from '../registry.js'
import { useLang } from '../i18n.jsx'

// keyword search over every topic, by name, tagline and course
export default function SearchBar() {
  const { t, tk } = useLang()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(0)
  const box = useRef(null)

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (s.length < 2) return []
    return ALGORITHMS.filter((a) => {
      const name = a.name.toLowerCase()
      const tag = a.tagline ? (t(a.tagline) || '').toLowerCase() : ''
      const course = (t(COURSE_LABELS[a.course]) || '').toLowerCase()
      return name.includes(s) || tag.includes(s) || a.slug.includes(s) || course.includes(s)
    }).slice(0, 8)
  }, [q, t])

  function go(slug) {
    nav(`/algo/${slug}`)
    setQ(''); setOpen(false); setHi(0)
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(h + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)) }
    else if (e.key === 'Enter' && results[hi]) go(results[hi].slug)
    else if (e.key === 'Escape') { setQ(''); setOpen(false); e.currentTarget.blur() }
  }

  return (
    <div
      className="search"
      ref={box}
      onBlur={(e) => { if (!box.current || !box.current.contains(e.relatedTarget)) setOpen(false) }}
    >
      <input
        className="search-input"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setHi(0) }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        placeholder={tk('searchAlgos')}
        aria-label={tk('searchAlgos')}
        spellCheck={false}
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <div className="search-results">
          {results.map((a, i) => (
            <button
              key={a.slug}
              className={'search-result' + (i === hi ? ' hi' : '')}
              onMouseDown={() => go(a.slug)}
              onMouseEnter={() => { setHi(i); prefetchComponent(a.slug) }}
            >
              <span className="search-result-name">{a.star ? '★ ' : ''}{a.name}</span>
              <span className="search-result-course">{t(COURSE_LABELS[a.course]) || a.course}</span>
            </button>
          ))}
        </div>
      )}
      {open && q.trim().length >= 2 && results.length === 0 && (
        <div className="search-results"><div className="search-empty">{tk('noResults')}</div></div>
      )}
    </div>
  )
}

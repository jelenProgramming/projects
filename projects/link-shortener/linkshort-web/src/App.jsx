import { useEffect, useState } from 'react'
import { listLinks, createLink, linkStats, deleteLink } from './api'
import CreateForm from './components/CreateForm'
import LinkRow from './components/LinkRow'
import Stats from './components/Stats'

const STRINGS = {
  en: {
    tagline: 'Shorten a URL, then watch the clicks roll in.',
    yourLinks: 'Your links',
    noLinks: 'No links yet. Shorten one above.',
    pickLink: 'Pick a link to see its analytics.',
    footer: 'Laravel API + React | short links resolve on the API host',
    apiError: "Can't reach the API. Is the Laravel server running?",
    shorten: 'Shorten',
    shortening: 'Shortening...',
    urlPlaceholder: 'https://your-long-url.com/goes/here',
    slugHint: 'optional custom slug',
    slugPlaceholder: 'my-link',
    copy: 'copy',
    copied: 'copied',
    clicks: 'clicks',
    deleteTitle: 'Delete',
    loadingStats: 'Loading stats...',
    totalClicks: 'total clicks',
    last30: 'Clicks | last 30 days',
    topReferrers: 'Top referrers',
    recentClicks: 'Recent clicks',
    nothingYet: 'Nothing yet.',
    noClicks30: 'No clicks in the last 30 days yet.',
    justNow: 'just now',
    minAgo: 'm ago',
    hourAgo: 'h ago',
    dayAgo: 'd ago',
  },
  de: {
    tagline: 'URL kürzen und zusehen, wie die Klicks reinkommen.',
    yourLinks: 'Deine Links',
    noLinks: 'Noch keine Links. Kürze oben einen.',
    pickLink: 'Wähle einen Link, um seine Statistiken zu sehen.',
    footer: 'Laravel-API + React | Kurzlinks laufen über den API-Host',
    apiError: 'API nicht erreichbar. Läuft der Laravel-Server?',
    shorten: 'Kürzen',
    shortening: 'Kürze...',
    urlPlaceholder: 'https://deine-lange-url.com/geht/hier',
    slugHint: 'optionaler eigener Slug',
    slugPlaceholder: 'mein-link',
    copy: 'kopieren',
    copied: 'kopiert',
    clicks: 'Klicks',
    deleteTitle: 'Löschen',
    loadingStats: 'Lade Statistiken...',
    totalClicks: 'Klicks gesamt',
    last30: 'Klicks | letzte 30 Tage',
    topReferrers: 'Top-Referrer',
    recentClicks: 'Letzte Klicks',
    nothingYet: 'Noch nichts.',
    noClicks30: 'Noch keine Klicks in den letzten 30 Tagen.',
    justNow: 'gerade eben',
    minAgo: ' min',
    hourAgo: ' h',
    dayAgo: ' T',
  },
}

function loadLang() {
  try {
    return window.localStorage.getItem('linkshort:lang') === 'de' ? 'de' : 'en'
  } catch {
    return 'en'
  }
}

export default function App() {
  const [lang, setLang] = useState(loadLang)
  const [links, setLinks] = useState([])
  const [selected, setSelected] = useState(null)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [error, setError] = useState('')

  const t = STRINGS[lang]

  function switchLang(next) {
    setLang(next)
    document.documentElement.lang = next
    try {
      window.localStorage.setItem('linkshort:lang', next)
    } catch {
      /* storage unavailable */
    }
  }

  async function refresh() {
    try {
      setLinks(await listLinks())
      setError('')
    } catch (err) {
      setError(`${t.apiError} (${err.message})`)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCreate(url, slug) {
    const created = await createLink(url, slug)
    await refresh()
    selectLink(created.slug)
  }

  async function selectLink(slug) {
    setSelected(slug)
    setStatsLoading(true)
    setStats(null)
    try {
      setStats(await linkStats(slug))
    } catch {
      setStats(null)
    } finally {
      setStatsLoading(false)
    }
  }

  async function handleDelete(slug) {
    await deleteLink(slug)
    if (selected === slug) {
      setSelected(null)
      setStats(null)
    }
    refresh()
  }

  return (
    <div className="app">
      <header className="masthead">
        <div className="mastheadTop">
          <div className="brand">
            <span className="brand__mark">↳</span>
            <span className="brand__name">Linkshort</span>
          </div>
          <div className="langToggle" role="group" aria-label="Language">
            <button
              type="button"
              className={lang === 'en' ? 'langToggle__btn langToggle__btn--on' : 'langToggle__btn'}
              onClick={() => switchLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === 'de' ? 'langToggle__btn langToggle__btn--on' : 'langToggle__btn'}
              onClick={() => switchLang('de')}
            >
              DE
            </button>
          </div>
        </div>
        <p className="tagline">{t.tagline}</p>
      </header>

      <CreateForm onCreate={handleCreate} t={t} />

      {error && <div className="banner banner--error">{error}</div>}

      <div className="layout">
        <section className="list">
          <div className="list__head">{t.yourLinks}</div>
          {links.length === 0 && !error && (
            <div className="list__empty">{t.noLinks}</div>
          )}
          {links.map((link) => (
            <LinkRow
              key={link.slug}
              link={link}
              active={selected === link.slug}
              onSelect={selectLink}
              onDelete={handleDelete}
              t={t}
            />
          ))}
        </section>

        <section className="panel">
          {selected ? (
            <Stats data={stats} loading={statsLoading} t={t} />
          ) : (
            <div className="panel__empty">{t.pickLink}</div>
          )}
        </section>
      </div>

      <footer className="footer">{t.footer}</footer>
    </div>
  )
}

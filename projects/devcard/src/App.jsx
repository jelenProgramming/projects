import { useState } from 'react'
import { getProfile, topLanguages, topRepos, totals } from './api'
import SearchBar from './components/SearchBar'
import ProfileCard from './components/ProfileCard'
import StatGrid from './components/StatGrid'
import LanguageBars from './components/LanguageBars'
import RepoCard from './components/RepoCard'

const STRINGS = {
  en: {
    tagline: 'Turn any GitHub username into a profile at a glance.',
    tryPrefix: 'Try a username like',
    orOwn: 'or your own.',
    mostStarred: 'Most-starred repos',
    topLanguages: 'Top languages',
    joined: 'joined',
    noDescription: 'No description.',
    lookUp: 'Look up',
    loading: 'Loading...',
    usernamePlaceholder: 'username',
    footer: 'Built with React + Vite | data from the public GitHub API',
    statRepos: 'Repos',
    statStars: 'Stars',
    statForks: 'Forks',
    statFollowers: 'Followers',
  },
  de: {
    tagline: 'GitHub-Namen eingeben, Profil auf einen Blick sehen.',
    tryPrefix: 'Probier einen Namen wie',
    orOwn: 'oder deinen eigenen.',
    mostStarred: 'Repos mit den meisten Sternen',
    topLanguages: 'Top-Sprachen',
    joined: 'dabei seit',
    noDescription: 'Keine Beschreibung.',
    lookUp: 'Nachschlagen',
    loading: 'Lädt...',
    usernamePlaceholder: 'benutzername',
    footer: 'Gebaut mit React + Vite | Daten von der öffentlichen GitHub-API',
    statRepos: 'Repos',
    statStars: 'Sterne',
    statForks: 'Forks',
    statFollowers: 'Follower',
  },
  sl: {
    tagline: 'Katero koli uporabniško ime GitHub spremeni v profil na prvi pogled.',
    tryPrefix: 'Poskusi uporabniško ime, kot je',
    orOwn: 'ali svoje.',
    mostStarred: 'Repozitoriji z največ zvezdicami',
    topLanguages: 'Glavni jeziki',
    joined: 'član od',
    noDescription: 'Ni opisa.',
    lookUp: 'Poišči',
    loading: 'Nalaganje...',
    usernamePlaceholder: 'uporabniško ime',
    footer: 'Zgrajeno z React + Vite | podatki z javnega API-ja GitHub',
    statRepos: 'Repozitoriji',
    statStars: 'Zvezdice',
    statForks: 'Razvejitve',
    statFollowers: 'Sledilci',
  },
}

function loadLang() {
  try {
    const v = window.localStorage.getItem('devcard:lang'); return v === 'de' || v === 'sl' ? v : 'en'
  } catch {
    return 'en'
  }
}


function WaveDivider() {
  return (
    <div className="divider" aria-hidden="true">
      <svg viewBox="0 0 1440 64" preserveAspectRatio="none">
        <path d="M0,32 C180,60 320,4 520,18 C720,32 860,58 1060,44 C1240,32 1340,10 1440,26 L1440,64 L0,64 Z" />
      </svg>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState(loadLang)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const t = STRINGS[lang]

  function switchLang(next) {
    setLang(next)
    document.documentElement.lang = next
    try {
      window.localStorage.setItem('devcard:lang', next)
    } catch {
      /* storage unavailable */
    }
  }

  async function handleSearch(username) {
    setLoading(true)
    setError('')
    try {
      const res = await getProfile(username)
      setData(res)
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const langs = data ? topLanguages(data.repos) : []
  const repos = data ? topRepos(data.repos) : []
  const sums = data ? totals(data.repos) : { stars: 0, forks: 0 }

  return (
    <div className="app">
      <header className="masthead">
        <div className="mastheadTop">
          <div className="logo">
            <span className="logo__mark">{'</>'}</span>
            <span className="logo__text">DevCard</span>
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
            <button
              type="button"
              className={lang === 'sl' ? 'langToggle__btn langToggle__btn--on' : 'langToggle__btn'}
              onClick={() => switchLang('sl')}
            >
              SL
            </button>
          </div>
        </div>
        <p className="tagline">{t.tagline}</p>
        <SearchBar onSearch={handleSearch} loading={loading} t={t} />
      </header>

      <WaveDivider />

      {error && <div className="notice notice--error">{error}</div>}

      {!data && !error && !loading && (
        <div className="empty">
          <p>
            {t.tryPrefix}{' '}
            <button className="link" onClick={() => handleSearch('torvalds')}>torvalds</button>,{' '}
            <button className="link" onClick={() => handleSearch('gaearon')}>gaearon</button>{' '}
            {t.orOwn}
          </p>
        </div>
      )}

      {data && (
        <main className="result">
          <div className="meshGlow" aria-hidden="true" />
          <ProfileCard user={data.user} t={t} />
          <StatGrid user={data.user} stars={sums.stars} forks={sums.forks} t={t} />
          <LanguageBars langs={langs} t={t} />
          {repos.length > 0 && (
            <section className="repos">
              <h3 className="section-title">{t.mostStarred}</h3>
              <div className="repos__grid">
                {repos.map((r) => (
                  <RepoCard key={r.id} repo={r} t={t} />
                ))}
              </div>
            </section>
          )}
        </main>
      )}

      <footer className="footer">
        <span>{t.footer}</span>
        <span className="footer__rights">© 2026 David Jelen · <a href="https://github.com/jelenProgramming" target="_blank" rel="noopener noreferrer">jelenProgramming</a></span>
      </footer>
    </div>
  )
}

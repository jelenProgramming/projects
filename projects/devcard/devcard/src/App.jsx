import { useState } from 'react'
import { getProfile, topLanguages, topRepos, totals } from './api'
import SearchBar from './components/SearchBar'
import ProfileCard from './components/ProfileCard'
import StatGrid from './components/StatGrid'
import LanguageBars from './components/LanguageBars'
import RepoCard from './components/RepoCard'

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
        <div className="logo">
          <span className="logo__mark">{'</>'}</span>
          <span className="logo__text">DevCard</span>
        </div>
        <p className="tagline">Turn any GitHub username into a profile at a glance.</p>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </header>

      {error && <div className="notice notice--error">{error}</div>}

      {!data && !error && !loading && (
        <div className="empty">
          <p>Try a username like <button className="link" onClick={() => handleSearch('torvalds')}>torvalds</button>, <button className="link" onClick={() => handleSearch('gaearon')}>gaearon</button> or your own.</p>
        </div>
      )}

      {data && (
        <main className="result">
          <ProfileCard user={data.user} />
          <StatGrid user={data.user} stars={sums.stars} forks={sums.forks} />
          <LanguageBars langs={langs} />
          {repos.length > 0 && (
            <section className="repos">
              <h3 className="section-title">Most-starred repos</h3>
              <div className="repos__grid">
                {repos.map((r) => (
                  <RepoCard key={r.id} repo={r} />
                ))}
              </div>
            </section>
          )}
        </main>
      )}

      <footer className="footer">
        Built with React + Vite | data from the public GitHub API
      </footer>
    </div>
  )
}

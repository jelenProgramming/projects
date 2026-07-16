import { Star, GitFork } from 'lucide-react'

export default function RepoCard({ repo, t }) {
  return (
    <a className="repo" href={repo.html_url} target="_blank" rel="noreferrer">
      <div className="repo__name">{repo.name}</div>
      <p className="repo__desc">{repo.description || t.noDescription}</p>
      <div className="repo__meta">
        {repo.language && <span>{repo.language}</span>}
        <span><Star className="meta-ico" aria-hidden="true" /> {repo.stargazers_count}</span>
        <span><GitFork className="meta-ico" aria-hidden="true" /> {repo.forks_count}</span>
      </div>
    </a>
  )
}

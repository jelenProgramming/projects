export default function RepoCard({ repo, t }) {
  return (
    <a className="repo" href={repo.html_url} target="_blank" rel="noreferrer">
      <div className="repo__name">{repo.name}</div>
      <p className="repo__desc">{repo.description || t.noDescription}</p>
      <div className="repo__meta">
        {repo.language && <span>{repo.language}</span>}
        <span>★ {repo.stargazers_count}</span>
        <span>⑂ {repo.forks_count}</span>
      </div>
    </a>
  )
}

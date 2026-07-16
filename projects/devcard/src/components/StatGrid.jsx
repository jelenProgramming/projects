import { FolderGit2, Star, GitFork, Users } from 'lucide-react'

export default function StatGrid({ user, stars, forks, t }) {
  const stats = [
    { label: t.statRepos, value: user.public_repos, Icon: FolderGit2 },
    { label: t.statStars, value: stars, Icon: Star },
    { label: t.statForks, value: forks, Icon: GitFork },
    { label: t.statFollowers, value: user.followers, Icon: Users },
  ]
  return (
    <div className="stats">
      {stats.map(({ label, value, Icon }) => (
        <div className="stat" key={label}>
          <Icon className="stat__ico" aria-hidden="true" />
          <div className="stat__value">{value.toLocaleString()}</div>
          <div className="stat__label">{label}</div>
        </div>
      ))}
    </div>
  )
}

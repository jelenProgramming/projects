export default function StatGrid({ user, stars, forks, t }) {
  const stats = [
    { label: t.statRepos, value: user.public_repos },
    { label: t.statStars, value: stars },
    { label: t.statForks, value: forks },
    { label: t.statFollowers, value: user.followers },
  ]
  return (
    <div className="stats">
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <div className="stat__value">{s.value.toLocaleString()}</div>
          <div className="stat__label">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

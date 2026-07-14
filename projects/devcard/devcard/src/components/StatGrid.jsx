export default function StatGrid({ user, stars, forks }) {
  const stats = [
    { label: 'Repos', value: user.public_repos },
    { label: 'Stars', value: stars },
    { label: 'Forks', value: forks },
    { label: 'Followers', value: user.followers },
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

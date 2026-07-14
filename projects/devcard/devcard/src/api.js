const API = 'https://api.github.com'

export async function getProfile(username) {
  const [userRes, reposRes] = await Promise.all([
    fetch(`${API}/users/${username}`),
    fetch(`${API}/users/${username}/repos?per_page=100&sort=updated`),
  ])

  if (userRes.status === 404) throw new Error('No user with that username.')
  if (userRes.status === 403) throw new Error('GitHub rate limit hit. Wait a minute and retry.')
  if (!userRes.ok) throw new Error('Could not load this profile.')

  const user = await userRes.json()
  const repos = reposRes.ok ? await reposRes.json() : []
  return { user, repos }
}

export function topLanguages(repos, max = 6) {
  const counts = {}
  for (const r of repos) {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([name, n]) => ({ name, pct: Math.round((n / total) * 100) }))
}

export function topRepos(repos, max = 6) {
  return [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, max)
}

export function totals(repos) {
  return repos.reduce(
    (acc, r) => {
      acc.stars += r.stargazers_count
      acc.forks += r.forks_count
      return acc
    },
    { stars: 0, forks: 0 },
  )
}

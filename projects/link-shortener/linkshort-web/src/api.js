const BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = body.message || body.error || 'Request failed'
    throw new Error(msg)
  }
  return body
}

export const listLinks = () => req('/api/links')
export const createLink = (url, slug) =>
  req('/api/links', { method: 'POST', body: JSON.stringify({ url, slug: slug || null }) })
export const linkStats = (slug) => req(`/api/links/${slug}`)
export const deleteLink = (slug) => req(`/api/links/${slug}`, { method: 'DELETE' })

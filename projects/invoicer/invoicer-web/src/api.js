const BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

export const token = {
  get: () => localStorage.getItem('invoicer_token'),
  set: (t) => localStorage.setItem('invoicer_token', t),
  clear: () => localStorage.removeItem('invoicer_token'),
}

async function req(path, options = {}) {
  const t = token.get()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...options.headers,
    },
  })
  if (res.status === 401) {
    token.clear()
    throw new Error('Session expired. Please log in again.')
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body.message || 'Request failed')
  }
  return body
}

export const api = {
  register: (d) => req('/api/register', { method: 'POST', body: JSON.stringify(d) }),
  login: (d) => req('/api/login', { method: 'POST', body: JSON.stringify(d) }),
  logout: () => req('/api/logout', { method: 'POST' }),
  me: () => req('/api/me'),

  stats: () => req('/api/stats'),

  clients: () => req('/api/clients'),
  createClient: (d) => req('/api/clients', { method: 'POST', body: JSON.stringify(d) }),
  deleteClient: (id) => req(`/api/clients/${id}`, { method: 'DELETE' }),

  invoices: () => req('/api/invoices'),
  createInvoice: (d) => req('/api/invoices', { method: 'POST', body: JSON.stringify(d) }),
  deleteInvoice: (id) => req(`/api/invoices/${id}`, { method: 'DELETE' }),
}

// PDF needs the auth header, so fetch as a blob and trigger a download.
export async function downloadPdf(invoice) {
  const t = token.get()
  const res = await fetch(`${BASE}/api/invoices/${invoice.id}/pdf`, {
    headers: { Accept: 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) },
  })
  if (!res.ok) throw new Error('Could not generate PDF')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${invoice.number}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

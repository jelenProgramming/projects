import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({ name: '', email: '', address: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function load() {
    api.clients().then(setClients).catch((e) => setError(e.message))
  }

  useEffect(load, [])

  async function add(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setBusy(true)
    setError('')
    try {
      await api.createClient(form)
      setForm({ name: '', email: '', address: '' })
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this client and all their invoices?')) return
    await api.deleteClient(id)
    load()
  }

  return (
    <div className="clients">
      <form className="card cform" onSubmit={add}>
        <h2 className="card__title">Add a client</h2>
        <div className="cform__grid">
          <input className="field" placeholder="Client name *" value={form.name} onChange={set('name')} />
          <input className="field" type="email" placeholder="Email" value={form.email} onChange={set('email')} />
        </div>
        <textarea className="field field--area" placeholder="Address (optional)" value={form.address} onChange={set('address')} rows={2} />
        {error && <div className="form-error">{error}</div>}
        <button className="btn btn--primary" type="submit" disabled={busy}>
          {busy ? 'Saving...' : 'Add client'}
        </button>
      </form>

      <div className="card">
        <h2 className="card__title">Your clients</h2>
        {clients.length === 0 ? (
          <p className="muted-row">No clients yet.</p>
        ) : (
          <ul className="clist">
            {clients.map((c) => (
              <li key={c.id} className="clist__row">
                <div>
                  <div className="clist__name">{c.name}</div>
                  <div className="clist__sub">{c.email || 'no email'} | {c.invoices_count} invoices</div>
                </div>
                <button className="clist__del" onClick={() => remove(c.id)}>×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

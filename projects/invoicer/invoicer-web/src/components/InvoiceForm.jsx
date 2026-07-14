import { useEffect, useState } from 'react'
import { api } from '../api'

const today = () => new Date().toISOString().slice(0, 10)
const emptyItem = () => ({ description: '', quantity: 1, unit_price: 0 })

export default function InvoiceForm({ onCreated, onCancel }) {
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({
    client_id: '',
    issue_date: today(),
    due_date: '',
    status: 'draft',
    tax_rate: 0,
    notes: '',
  })
  const [items, setItems] = useState([emptyItem()])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api.clients().then((c) => {
      setClients(c)
      if (c.length) setForm((f) => ({ ...f, client_id: String(c[0].id) }))
    })
  }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function setItem(i, k, v) {
    setItems(items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)))
  }
  const addItem = () => setItems([...items, emptyItem()])
  const removeItem = (i) => setItems(items.length > 1 ? items.filter((_, idx) => idx !== i) : items)

  const subtotal = items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unit_price) || 0), 0)
  const tax = subtotal * ((Number(form.tax_rate) || 0) / 100)
  const total = subtotal + tax

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const payload = {
        ...form,
        client_id: Number(form.client_id),
        tax_rate: Number(form.tax_rate) || 0,
        due_date: form.due_date || null,
        items: items.map((it) => ({
          description: it.description,
          quantity: Number(it.quantity) || 0,
          unit_price: Number(it.unit_price) || 0,
        })),
      }
      const created = await api.createInvoice(payload)
      onCreated(created)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (clients.length === 0) {
    return (
      <div className="card">
        <p className="muted-row">Add a client first, then come back to create an invoice.</p>
        <button className="btn" onClick={onCancel}>Back</button>
      </div>
    )
  }

  return (
    <form className="card iform" onSubmit={submit}>
      <h2 className="card__title">New invoice</h2>

      <div className="iform__top">
        <label className="lbl">
          Client
          <select className="field" value={form.client_id} onChange={set('client_id')}>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="lbl">
          Status
          <select className="field" value={form.status} onChange={set('status')}>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
          </select>
        </label>
        <label className="lbl">
          Issue date
          <input className="field" type="date" value={form.issue_date} onChange={set('issue_date')} />
        </label>
        <label className="lbl">
          Due date
          <input className="field" type="date" value={form.due_date} onChange={set('due_date')} />
        </label>
      </div>

      <div className="items">
        <div className="items__head">
          <span>Description</span><span>Qty</span><span>Unit €</span><span>Amount</span><span></span>
        </div>
        {items.map((it, i) => (
          <div className="items__row" key={i}>
            <input className="field" placeholder="Service or product" value={it.description} onChange={(e) => setItem(i, 'description', e.target.value)} />
            <input className="field" type="number" min="0" step="0.01" value={it.quantity} onChange={(e) => setItem(i, 'quantity', e.target.value)} />
            <input className="field" type="number" min="0" step="0.01" value={it.unit_price} onChange={(e) => setItem(i, 'unit_price', e.target.value)} />
            <div className="items__amt">€{((Number(it.quantity) || 0) * (Number(it.unit_price) || 0)).toFixed(2)}</div>
            <button type="button" className="items__del" onClick={() => removeItem(i)}>×</button>
          </div>
        ))}
        <button type="button" className="btn btn--ghost" onClick={addItem}>+ Add line</button>
      </div>

      <div className="iform__foot">
        <label className="lbl lbl--tax">
          Tax %
          <input className="field" type="number" min="0" max="100" step="0.01" value={form.tax_rate} onChange={set('tax_rate')} />
        </label>
        <div className="totals">
          <div><span>Subtotal</span><span>€{subtotal.toFixed(2)}</span></div>
          <div><span>Tax</span><span>€{tax.toFixed(2)}</span></div>
          <div className="totals__grand"><span>Total</span><span>€{total.toFixed(2)}</span></div>
        </div>
      </div>

      <textarea className="field field--area" placeholder="Notes (optional)" value={form.notes} onChange={set('notes')} rows={2} />

      {error && <div className="form-error">{error}</div>}
      <div className="iform__actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? 'Creating...' : 'Create invoice'}
        </button>
      </div>
    </form>
  )
}

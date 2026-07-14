import { useEffect, useState } from 'react'
import { api, downloadPdf } from '../api'
import InvoiceForm from './InvoiceForm'

const money = (n) => '€' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function StatCards({ stats }) {
  if (!stats) return null
  const cards = [
    { label: 'Total invoiced', value: money(stats.total_invoiced) },
    { label: 'Paid', value: money(stats.paid), tone: 'ok' },
    { label: 'Outstanding', value: money(stats.outstanding), tone: 'warn' },
    { label: 'Invoices', value: stats.count },
  ]
  return (
    <div className="statcards">
      {cards.map((c) => (
        <div className={`statcard ${c.tone ? 'statcard--' + c.tone : ''}`} key={c.label}>
          <div className="statcard__value">{c.value}</div>
          <div className="statcard__label">{c.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [stats, setStats] = useState(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [pdfBusy, setPdfBusy] = useState(null)

  function load() {
    api.invoices().then(setInvoices).catch((e) => setError(e.message))
    api.stats().then(setStats).catch(() => {})
  }

  useEffect(load, [])

  async function remove(id) {
    if (!confirm('Delete this invoice?')) return
    await api.deleteInvoice(id)
    load()
  }

  async function getPdf(inv) {
    setPdfBusy(inv.id)
    try {
      await downloadPdf(inv)
    } catch (e) {
      setError(e.message)
    } finally {
      setPdfBusy(null)
    }
  }

  if (creating) {
    return (
      <InvoiceForm
        onCreated={() => { setCreating(false); load() }}
        onCancel={() => setCreating(false)}
      />
    )
  }

  return (
    <div className="invoices">
      <StatCards stats={stats} />

      <div className="invoices__bar">
        <h2 className="section-h">Invoices</h2>
        <button className="btn btn--primary" onClick={() => setCreating(true)}>+ New invoice</button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {invoices.length === 0 ? (
        <div className="card muted-row">No invoices yet. Create your first one.</div>
      ) : (
        <div className="card invtable">
          <div className="invtable__head">
            <span>Number</span><span>Client</span><span>Issued</span><span>Status</span><span className="r">Total</span><span></span>
          </div>
          {invoices.map((inv) => (
            <div className="invtable__row" key={inv.id}>
              <span className="invtable__num">{inv.number}</span>
              <span>{inv.client?.name}</span>
              <span className="invtable__date">{new Date(inv.issue_date).toLocaleDateString('en-GB')}</span>
              <span><span className={`badge badge--${inv.status}`}>{inv.status}</span></span>
              <span className="r invtable__total">{money(inv.total)}</span>
              <span className="invtable__actions">
                <button className="mini" onClick={() => getPdf(inv)} disabled={pdfBusy === inv.id}>
                  {pdfBusy === inv.id ? '...' : 'PDF'}
                </button>
                <button className="mini mini--del" onClick={() => remove(inv.id)}>×</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

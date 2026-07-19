import { useState } from 'react'
import { Scissors } from 'lucide-react'

export default function CreateForm({ onCreate, t }) {
  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!url.trim()) return
    setBusy(true)
    setError('')
    try {
      await onCreate(url.trim(), slug.trim())
      setUrl('')
      setSlug('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="create" onSubmit={submit}>
      <div className="create__row">
        <input
          className="create__url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t.urlPlaceholder}
          spellCheck={false}
        />
        <button className="create__btn" type="submit" disabled={busy}>
          {busy ? t.shortening : <><Scissors className="btn-ico" aria-hidden="true" /> {t.shorten}</>}
        </button>
      </div>
      <div className="create__row create__row--slug">
        <span className="create__slughint">{t.slugHint}</span>
        <input
          className="create__slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder={t.slugPlaceholder}
          spellCheck={false}
        />
      </div>
      {error && <div className="create__error">{error}</div>}
    </form>
  )
}

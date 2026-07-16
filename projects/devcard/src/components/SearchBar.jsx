import { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchBar({ onSearch, loading, t }) {
  const [value, setValue] = useState('')

  function submit(e) {
    e.preventDefault()
    const v = value.trim()
    if (v) onSearch(v)
  }

  return (
    <form className="search" onSubmit={submit}>
      <span className="search__prefix">github.com/</span>
      <input
        className="search__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t.usernamePlaceholder}
        autoFocus
        spellCheck={false}
      />
      <button className="search__btn" type="submit" disabled={loading}>
        {loading ? t.loading : <><Search className="btn-ico" aria-hidden="true" /> {t.lookUp}</>}
      </button>
    </form>
  )
}

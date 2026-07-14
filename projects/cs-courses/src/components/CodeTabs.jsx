import { useState } from 'react'

// Language toggle for code snippets. A topic supplies a `code` object keyed by
// { cpp, python, js, java, csharp }; each value is either a code string, or
// { na: 'note' } when the concept does not exist in that language (closest
// alternative or "not available"). C++ is the default, since the courses teach it.
const LANGS = [
  ['cpp', 'C++'],
  ['python', 'Python'],
  ['js', 'JavaScript'],
  ['java', 'Java'],
  ['csharp', 'C#'],
]

export default function CodeTabs({ code }) {
  const first = (LANGS.find(([k]) => code[k] != null) || LANGS[0])[0]
  const [active, setActive] = useState(first)
  const val = code[active]
  return (
    <div className="codetabs">
      <div className="codetabs-bar" role="tablist">
        {LANGS.map(([k, label]) => (
          <button
            key={k}
            role="tab"
            aria-selected={k === active}
            className={'codetab' + (k === active ? ' on' : '') + (code[k] == null ? ' empty' : '')}
            onClick={() => setActive(k)}
          >
            {label}
          </button>
        ))}
      </div>
      {val == null ? (
        <div className="code-na">Not shown for this language.</div>
      ) : typeof val === 'object' && val.na ? (
        <div className="code-na">{val.na}</div>
      ) : (
        <pre className="code"><code>{val}</code></pre>
      )}
    </div>
  )
}

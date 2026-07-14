import { useEffect, useMemo, useState } from 'react'
import { VERBS, PRONOUNS, isCorrect } from './verbs'
import Stats from './components/Stats'

const GROUPS = [
  { id: 'all', label: 'All verbs' },
  { id: 'irregular', label: 'Irregular' },
  { id: 'modal', label: 'Modal' },
  { id: 'regular', label: 'Regular' },
]

function loadBest() {
  try {
    return Number(localStorage.getItem('dt_best_streak')) || 0
  } catch {
    return 0
  }
}

function pickCard(group) {
  const pool = group === 'all' ? VERBS : VERBS.filter((v) => v.group === group)
  const verb = pool[Math.floor(Math.random() * pool.length)]
  const idx = Math.floor(Math.random() * PRONOUNS.length)
  return { verb, idx }
}

export default function App() {
  const [group, setGroup] = useState('all')
  const [card, setCard] = useState(() => pickCard('all'))
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(loadBest)
  const [seen, setSeen] = useState(0)
  const [right, setRight] = useState(0)

  const expected = card.verb.forms[card.idx]
  const pronoun = PRONOUNS[card.idx]
  const accuracy = useMemo(() => (seen ? Math.round((right / seen) * 100) : 0), [seen, right])

  function next(g = group) {
    setCard(pickCard(g))
    setAnswer('')
    setChecked(false)
    setCorrect(false)
  }

  function check() {
    if (!answer.trim()) return
    const ok = isCorrect(answer, expected)
    setChecked(true)
    setCorrect(ok)
    setSeen((s) => s + 1)
    if (ok) {
      setRight((r) => r + 1)
      const ns = streak + 1
      setStreak(ns)
      if (ns > best) {
        setBest(ns)
        try { localStorage.setItem('dt_best_streak', String(ns)) } catch {}
      }
    } else {
      setStreak(0)
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    if (checked) next()
    else check()
  }

  function changeGroup(g) {
    setGroup(g)
    next(g)
  }

  return (
    <div className="app">
      <header className="head">
        <h1 className="title">Konjugator</h1>
        <p className="sub">Drill the German present tense. Type the conjugated verb.</p>
      </header>

      <div className="groups">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            className={`chip ${group === g.id ? 'chip--on' : ''}`}
            onClick={() => changeGroup(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>

      <main className={`card ${checked ? (correct ? 'card--ok' : 'card--no') : ''}`}>
        <div className="card__group">{card.verb.group}</div>
        <div className="prompt">
          <span className="prompt__pron">{pronoun}</span>
          <span className="prompt__blank">_____</span>
        </div>
        <div className="prompt__verb">
          {card.verb.inf} <span className="prompt__en">· {card.verb.en}</span>
        </div>

        <form onSubmit={onSubmit} className="answer">
          <input
            className="answer__input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="conjugated form"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            disabled={checked}
          />
          <button className="answer__btn" type="submit">
            {checked ? 'Next →' : 'Check'}
          </button>
        </form>

        {checked && (
          <div className={`feedback ${correct ? 'feedback--ok' : 'feedback--no'}`}>
            {correct ? (
              <span>✓ Correct</span>
            ) : (
              <span>✗ It's <strong>{pronoun} {expected}</strong></span>
            )}
          </div>
        )}
      </main>

      <Stats streak={streak} best={best} seen={seen} accuracy={accuracy} />

      <footer className="footer">
        Tip: umlauts optional — type <code>ae oe ue ss</code> if you like. React + Vite.
      </footer>
    </div>
  )
}

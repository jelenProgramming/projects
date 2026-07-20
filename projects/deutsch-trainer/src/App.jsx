import { useMemo, useRef, useState } from 'react'
import { animate } from 'motion'
import { Check, ArrowRight } from 'lucide-react'
import { VERBS, PRONOUNS, isCorrect } from './verbs'
import Stats from './components/Stats'

const GROUPS = [
  { id: 'all',       de: 'Alle Verben',      en: 'All verbs' },
  { id: 'irregular', de: 'Unregelmäßige',    en: 'Irregular' },
  { id: 'modal',     de: 'Modalverben',      en: 'Modal' },
  { id: 'regular',   de: 'Regelmäßig',       en: 'Regular' },
]

function loadBest() {
  try { return Number(localStorage.getItem('dt_best_streak')) || 0 } catch { return 0 }
}

function pickCard(group) {
  const pool = group === 'all' ? VERBS : VERBS.filter((v) => v.group === group)
  const verb = pool[Math.floor(Math.random() * pool.length)]
  const idx = Math.floor(Math.random() * PRONOUNS.length)
  return { verb, idx }
}

// small confetti burst on a correct answer, vanilla, no deps
function burst() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const colors = ['#b9a5f5', '#ffc9d9', '#ffd98a', '#bdedd6', '#a8d8f5', '#ffffff']
  const cx = innerWidth / 2, cy = innerHeight * 0.42
  for (let i = 0; i < 26; i++) {
    const el = document.createElement('div')
    el.className = 'dt-confetti'
    el.style.background = colors[i % colors.length]
    document.body.appendChild(el)
    const ang = Math.random() * Math.PI * 2, dist = 120 + Math.random() * 220
    const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist - 60
    el.animate(
      [
        { transform: `translate(${cx}px, ${cy}px) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${cx + dx}px, ${cy + dy + 280}px) rotate(${(Math.random() * 720 - 360) | 0}deg)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(0.2,0.7,0.2,1)' },
    ).onfinish = () => el.remove()
  }
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

  const cardRef = useRef(null)

  function feedbackMotion(ok) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !cardRef.current) return
    if (ok) animate(cardRef.current, { scale: [1, 1.035, 1] }, { duration: 0.45, type: 'spring', bounce: 0.55 })
    else animate(cardRef.current, { x: [0, -11, 9, -6, 4, 0] }, { duration: 0.45 })
  }

  function check() {
    if (!answer.trim()) return
    const ok = isCorrect(answer, expected)
    setChecked(true)
    setCorrect(ok)
    feedbackMotion(ok)
    setSeen((s) => s + 1)
    if (ok) {
      burst()
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
        <h1 className="title">Konjugationstrainer</h1>
        <p className="sub-de">Auf dieser Seite können Sie deutsche Verben im Präsens üben. Wählen Sie eine Verbgruppe, lesen Sie den Satz und schreiben Sie die richtige konjugierte Form des Verbs.</p>
        <p className="sub-en">On this page you can practise German verbs in the present tense. Choose a verb group, read the sentence and write the correct conjugated form of the verb.</p>
      </header>

      <div className="groups">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            className={`chip ${group === g.id ? 'chip--on' : ''}`}
            onClick={() => changeGroup(g.id)}
          >
            <span className="chip-de">{g.de}</span>
            <span className="chip-en">{g.en}</span>
          </button>
        ))}
      </div>

      <main ref={cardRef} className={`card ${checked ? (correct ? 'card--ok' : 'card--no') : ''}`}>
        <div className="prompt">
          <span className="prompt__pron">{pronoun}</span>
          <span className="prompt__blank">{'―'.repeat(Math.max(6, expected.length + 2))}</span>
        </div>

        <div className="prompt__verb">
          <span className="verb-de">{card.verb.inf}</span>
          <span className="verb-sep">(</span>
          <span className="verb-en">{card.verb.en}</span>
          <span className="verb-sep">)</span>
        </div>

        <form onSubmit={onSubmit} className="answer">
          <input
            className="answer__input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Schreiben Sie das konjugierte Verb hier ... (write the conjugated verb here)"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            disabled={checked}
          />
          <button className="answer__btn" type="submit">
            {checked
              ? <><ArrowRight className="btn-ico" aria-hidden="true" /><span className="btn-de">Weiter</span><span className="btn-en">Next</span></>
              : <><Check className="btn-ico" aria-hidden="true" /><span className="btn-de">Prüfen</span><span className="btn-en">Check</span></>
            }
          </button>
        </form>

        {checked && (
          <div className={`feedback ${correct ? 'feedback--ok' : 'feedback--no'}`}>
            {correct ? (
              <span>Richtig! (Correct!)</span>
            ) : (
              <span>Falsch. Die richtige Antwort ist: <strong>{pronoun} {expected}</strong> (Wrong. The correct answer is: <strong>{pronoun} {expected}</strong>)</span>
            )}
          </div>
        )}
      </main>

      <Stats streak={streak} best={best} seen={seen} accuracy={accuracy} />
      <footer className="site-foot">© 2026 David Jelen · <a href="https://github.com/jelenProgramming" target="_blank" rel="noopener noreferrer">jelenProgramming</a></footer>
    </div>
  )
}

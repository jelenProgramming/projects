import { useNavigate } from 'react-router-dom'
import { CATEGORIES, ALGORITHMS, algosByCategory } from '../registry.js'
import { useLang } from '../i18n.jsx'
import { mathify } from '../components/Math.jsx'

const HERO = {
  title: { en: 'See the algorithm think.', de: 'Sieh den Algorithmus denken.' },
  body: {
    en: 'Every core algorithm and data structure you meet in a computer science degree, animated step by step, with a plain-language explanation of what happens on every move. Built for the moment a concept finally clicks for you.',
    de: 'Jeder wichtige Algorithmus und jede Datenstruktur, die dir im Informatikstudium begegnet, Schritt für Schritt animiert, mit einer verständlichen Erklärung zu jedem Zug. Gebaut für den Moment, in dem es bei dir endlich Klick macht.',
  },
  tip: {
    en: '<strong>Tip:</strong> algorithms marked ★ are the ones most likely to show up as "trace this by hand" exam questions - Dijkstra, Floyd-Warshall, Huffman, edit distance, LZW.',
    de: '<strong>Tipp:</strong> Mit ★ markierte Algorithmen kommen am ehesten als „von Hand nachvollziehen"-Prüfungsaufgaben vor - Dijkstra, Floyd-Warshall, Huffman, Editierdistanz, LZW.',
  },
}

export default function Home() {
  const nav = useNavigate()
  const { t, tk } = useLang()
  const vizCount = ALGORITHMS.filter((a) => a.kind === 'viz').length

  return (
    <div>
      <div className="home-hero">
        <h1>{t(HERO.title)}</h1>
        <p>{t(HERO.body)}</p>
        <div className="stat-row">
          <div className="stat">
            <div className="n">{ALGORITHMS.length}</div>
            <div className="l">{tk('algorithms')}</div>
          </div>
          <div className="stat">
            <div className="n">{vizCount}</div>
            <div className="l">{tk('interactive')}</div>
          </div>
          <div className="stat">
            <div className="n">{CATEGORIES.length}</div>
            <div className="l">{tk('categories')}</div>
          </div>
        </div>
      </div>

      <div className="cat-grid">
        {CATEGORIES.map((cat) => {
          const items = algosByCategory(cat.id)
          const Icon = cat.icon
          const viz = items.filter((a) => a.kind === 'viz').length
          return (
            <div
              key={cat.id}
              className="cat-card"
              onClick={() => nav(`/algo/${items[0].slug}`)}
            >
              <div className="cat-icon" style={{ background: cat.color + '22', color: cat.color }}>
                <Icon style={{ width: 20, height: 20 }} />
              </div>
              <h3>{cat.name}</h3>
              <p>{items.map((a) => a.name).slice(0, 4).join(' | ')}{items.length > 4 ? ' ...' : ''}</p>
              <div className="count">{items.length} {tk('algorithms')} | {viz} {tk('interactive')}</div>
            </div>
          )
        })}
      </div>

      <div className="note" style={{ marginTop: 28 }}>
        <span dangerouslySetInnerHTML={{ __html: mathify(t(HERO.tip)) }} />
      </div>
    </div>
  )
}

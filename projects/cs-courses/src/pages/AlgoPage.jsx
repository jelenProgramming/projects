import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getAlgo, getCategory, loadComponent, COURSE_LABELS, courseNeighbors } from '../registry.js'
import { useLang } from '../i18n.jsx'
import { useMode } from '../mode.jsx'
import { CONTENT } from '../content.js'
import ReadPage from '../components/ReadPage.jsx'
import { mathify } from '../components/Math.jsx'
import CodeTabs from '../components/CodeTabs.jsx'

// per-topic study pace, rushing (cram, condensed) vs chilling (full + animations)
const PACE = {
  rush: { en: 'Rush', de: 'Schnell' },
  chill: { en: 'Chill', de: 'Locker' },
}

export default function AlgoPage() {
  const { slug } = useParams()
  const { t, tk } = useLang()
  const { mode, setMode } = useMode()
  const algo = getAlgo(slug)

  if (!algo) {
    return <div className="empty">Topic "{slug}" not found.</div>
  }

  const cat = getCategory(algo.category)
  const Component = loadComponent(slug)
  const content = CONTENT[slug]
  const tldr = content?.tldr
  const { prev, next, index, total } = courseNeighbors(slug)

  return (
    <div>
      <div className="page-head">
        <div className="page-head-top">
          <div className="crumb">
            <span className="chip" style={{ background: cat.color + '22', color: cat.color }}>
              {cat.name}
            </span>
            <span>|</span>
            <span>{t(COURSE_LABELS[algo.course]) || algo.course}</span>
          </div>
          <div className="topic-mode" role="group" aria-label="Study pace">
            <button className={mode === 'calm' ? 'active' : ''} onClick={() => setMode('calm')} title="Rushing, condensed cram view">
              <span aria-hidden="true">💨</span>{t(PACE.rush)}
            </button>
            <button className={mode === 'explore' ? 'active' : ''} onClick={() => setMode('explore')} title="Chilling, full content and animations">
              <span aria-hidden="true">🧭</span>{t(PACE.chill)}
            </button>
          </div>
        </div>
        <h1 className="page-title">{algo.star ? '★ ' : ''}{algo.name}</h1>
        {algo.tagline && <p className="page-desc">{t(algo.tagline)}</p>}
      </div>

      {tldr && (
        <div className="tldr">
          <span className="tldr-label">TL;DR</span>
          <span className="tldr-text" dangerouslySetInnerHTML={{ __html: mathify(t(tldr)) }} />
        </div>
      )}

      {Component ? (
        <>
          <Component content={content} slug={slug} />
          {content?.code && (
            <div className="panel"><h2 className="section">{t({ en: 'In code', de: 'Im Code' })}</h2><CodeTabs code={content.code} /></div>
          )}
        </>
      ) : content ? (
        <ReadPage {...content} />
      ) : (
        <div className="panel">
          <p className="muted">{tk('notImplemented')}</p>
        </div>
      )}

      {prev && next && (
        <div className="chapter-nav">
          <Link to={`/algo/${prev.slug}`} className="chapter-nav-btn prev">
            <span className="chapter-nav-arrow">←</span>
            <span className="chapter-nav-text">
              <span className="chapter-nav-label">{tk('prevChapter')}</span>
              <span className="chapter-nav-name">{prev.name}</span>
            </span>
          </Link>
          <span className="chapter-nav-count">{index + 1} / {total}</span>
          <Link to={`/algo/${next.slug}`} className="chapter-nav-btn next">
            <span className="chapter-nav-text">
              <span className="chapter-nav-label">{tk('nextChapter')}</span>
              <span className="chapter-nav-name">{next.name}</span>
            </span>
            <span className="chapter-nav-arrow">→</span>
          </Link>
        </div>
      )}
    </div>
  )
}

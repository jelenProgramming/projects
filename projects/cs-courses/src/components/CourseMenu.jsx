import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { COURSE_ORDER, COURSE_SHORT, algosByCourse, prefetchComponent } from '../registry.js'
import { useLang } from '../i18n.jsx'
import KindIcon from './KindIcon.jsx'
import SearchBar from './SearchBar.jsx'

/**
 * Top course navigation bar. A long blue bar of course tabs; hovering a tab
 * drops down that course's topics; clicking the course name jumps to
 * the course's first topic. Replaces the sidebar.
 *
 * The study-mode / language / theme toggles are rendered inside the bar (passed
 * in as `toggles`) so they sit in the same flex row as the tabs and can never
 * overlap or clip the last course tab.
 *
 * Each dropdown opens with a legend explaining the two topic-type icons
 * (read = text explanation, viz = interactive visualizer), so the meaning is
 * always visible at the point of choosing.
 */
function DropdownLegend() {
  const { tk } = useLang()
  return (
    <div className="dropdown-legend">
      <span className="legend-item"><span className="tag read"><KindIcon kind="read" /></span>{tk('read')}</span>
      <span className="legend-item"><span className="tag viz"><KindIcon kind="viz" /></span>{tk('viz')}</span>
    </div>
  )
}

export default function CourseMenu({ toggles }) {
  const { t, tk } = useLang()
  const nav = useNavigate()
  const [open, setOpen] = useState(null)

  const courses = COURSE_ORDER
    .map((id) => ({ id, topics: algosByCourse(id) }))
    .filter((c) => c.topics.length > 0)

  // keep an open dropdown inside the viewport regardless of its tab position
  const fitDropdown = (el) => {
    if (!el) return
    el.style.left = '0'; el.style.right = 'auto'
    if (el.getBoundingClientRect().right > window.innerWidth - 8) { el.style.left = 'auto'; el.style.right = '0' }
  }

  return (
    <nav className="course-bar" onMouseLeave={() => setOpen(null)}>
      <div className="course-bar-top">
        <NavLink to="/" className="course-home" title="Home">▦</NavLink>
        <div className="course-bar-right">
          <SearchBar />
          <NavLink to="/info" className="course-info-tab">{tk('infoLink')}</NavLink>
          {toggles}
        </div>
      </div>
      <div className="course-bar-inner">
        {courses.map((c) => (
          <div
            key={c.id}
            className={'course-tab' + (open === c.id ? ' open' : '')}
            onMouseEnter={() => setOpen(c.id)}
          >
            <button
              className="course-tab-btn"
              onClick={() => { nav(`/algo/${c.topics[0].slug}`); setOpen(null) }}
            >
              {t(COURSE_SHORT[c.id] || { en: c.id, de: c.id })}
              <span className="course-tab-caret">▾</span>
            </button>
            {open === c.id && (
              <div className="course-dropdown" ref={fitDropdown}>
                {c.topics.map((topic) => (
                  <NavLink
                    key={topic.slug}
                    to={`/algo/${topic.slug}`}
                    className="course-dropdown-item"
                    onClick={() => setOpen(null)}
                    onMouseEnter={() => prefetchComponent(topic.slug)}
                  >
                    <span>{topic.star ? '★ ' : ''}{topic.name}</span>
                    <span className={'tag ' + (topic.kind === 'viz' ? 'viz' : 'read')}
                      title={topic.kind === 'viz' ? tk('viz') : tk('read')}>
                      <KindIcon kind={topic.kind} />
                    </span>
                  </NavLink>
                ))}
                <DropdownLegend />
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}

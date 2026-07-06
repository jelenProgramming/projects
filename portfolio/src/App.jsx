import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import styles from './App.module.css'
import ConstellationHero from './ConstellationHero.jsx'

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// wrap a state update in a native crossfade where supported
function withTransition(update) {
  if (!document.startViewTransition || reduceMotion()) { update(); return }
  document.startViewTransition(() => flushSync(update))
}

const UI = {
  en: {
    work: 'Work', about: 'About', getInTouch: 'Get in touch',
    eyebrow: 'CS student · FERI Maribor · Slovenia',
    titleA: 'I build web apps', titleB: 'and bring them to life.',
    heroSub: 'React, PHP, Laravel. EN / DE (C1). Open to freelance work and junior roles in Slovenia and Austria.',
    seeWork: 'See my work',
    stack: 'Stack',
    selected: 'Selected work', more: 'More projects',
    live: 'Live ↗', source: 'Source',
    aboutTitle: 'About',
    aboutBody: "I'm a first-year Computer Science student at FERI Maribor. I like carrying an idea all the way to a deployed, tested product, React on the front, Laravel and MySQL on the back. I work in English and German (C1) and I'm looking for junior or freelance work in Slovenia and Austria.",
    contactTitle: "Let's work together",
    contactSub: 'Student rates. Fast replies. English and German.',
    sendEmail: 'Send an email',
    stats: [
      { n: '7', l: 'projects live' },
      { n: '58', l: 'automated tests' },
      { n: 'C1', l: 'German' },
    ],
  },
  de: {
    work: 'Arbeit', about: 'Über mich', getInTouch: 'Kontakt',
    eyebrow: 'Informatikstudent · FERI Maribor · Slowenien',
    titleA: 'Ich baue Web-Apps', titleB: 'und bringe sie zum Leben.',
    heroSub: 'React, PHP, Laravel. EN / DE (C1). Offen für Freelance-Aufträge und Junior-Stellen in Slowenien und Österreich.',
    seeWork: 'Meine Arbeit',
    stack: 'Stack',
    selected: 'Ausgewählte Arbeit', more: 'Weitere Projekte',
    live: 'Live ↗', source: 'Quellcode',
    aboutTitle: 'Über mich',
    aboutBody: 'Ich studiere Informatik im ersten Jahr an der FERI Maribor. Ich bringe eine Idee gern bis zum fertigen, getesteten Produkt, React im Frontend, Laravel und MySQL im Backend. Ich arbeite auf Englisch und Deutsch (C1) und suche eine Junior- oder Freelance-Stelle in Slowenien und Österreich.',
    contactTitle: 'Arbeiten wir zusammen',
    contactSub: 'Studententarife. Schnelle Antworten. Deutsch und Englisch.',
    sendEmail: 'E-Mail schreiben',
    stats: [
      { n: '7', l: 'Projekte live' },
      { n: '58', l: 'automatisierte Tests' },
      { n: 'C1', l: 'Deutsch' },
    ],
  },
}

// featured flag is per project, never a fixed house rule
const projects = [
  {
    name: 'SQL Playground', featured: true,
    tags: ['TypeScript', 'React', 'WebAssembly', 'Vitest'],
    url: 'https://sql-playground-weld.vercel.app',
    source: 'https://github.com/jelenProgramming/sql-playground',
    desc: {
      en: 'Write and run real SQL in the browser: SQLite compiled to WebAssembly, a live schema explorer, and 12 guided exercises checked against actual result sets, so any correct query passes. TypeScript throughout, 58 unit tests with Vitest.',
      de: 'Echtes SQL im Browser schreiben und ausführen: SQLite als WebAssembly, ein Schema-Explorer und 12 Übungen, die gegen echte Ergebnismengen geprüft werden, jede korrekte Abfrage zählt. Durchgehend TypeScript, 58 Unit-Tests mit Vitest.',
    },
  },
  {
    name: 'CS Courses', featured: true,
    tags: ['React', 'Vite', 'KaTeX'],
    url: 'https://cs-courses.vercel.app',
    source: 'https://github.com/jelenProgramming/cs-courses',
    desc: {
      en: '97-topic interactive reference for first-year CS at FERI, algorithms, data structures, calculus, discrete math and more. 51 live visualizers, two study modes, KaTeX math, bilingual EN/DE.',
      de: '97 Themen als interaktives Nachschlagewerk für das erste Studienjahr an der FERI: Algorithmen, Datenstrukturen, Analysis, diskrete Mathematik und mehr. 51 Live-Visualisierungen, zwei Lernmodi, KaTeX für Formeln, zweisprachig EN/DE.',
    },
  },
  {
    name: 'Link Shortener', featured: true,
    tags: ['React', 'Laravel', 'MySQL', 'REST API'],
    url: 'https://linkshort-web-six.vercel.app',
    source: 'https://github.com/jelenProgramming/link-shortener',
    desc: {
      en: 'Create short URLs and track every click. Full-stack: a Laravel REST API with per-link analytics, clicks by day, top referrers, recent visits, and a React dashboard on Vercel.',
      de: 'Kurz-URLs erstellen und jeden Klick verfolgen. Full-Stack: eine Laravel-REST-API mit Statistiken pro Link, Klicks pro Tag, Top-Referrer, letzte Besuche, und ein React-Dashboard auf Vercel.',
    },
  },
  {
    name: 'Job Tracker', featured: true,
    tags: ['React', 'Laravel', 'Sanctum', 'MySQL'],
    url: 'https://job-tracker-web-fawn.vercel.app',
    source: 'https://github.com/jelenProgramming/job-tracker',
    desc: {
      en: 'Track job applications through every stage, from wishlist to offer. Auth with Laravel Sanctum, kanban-style status, company management, and an event timeline per application.',
      de: 'Bewerbungen durch jede Phase verfolgen, von der Wunschliste bis zum Angebot. Auth mit Laravel Sanctum, Status im Kanban-Stil, Firmenverwaltung und eine Ereignis-Timeline pro Bewerbung.',
    },
  },
  {
    name: 'Konjugationstrainer', featured: false,
    tags: ['React', 'Vite'],
    url: 'https://deutsch-trainer-orcin.vercel.app',
    source: 'https://github.com/jelenProgramming/deutsch-trainer',
    desc: {
      en: 'German verb conjugation drill. Type the present-tense form, get instant feedback. Accepts umlauts and alternate spellings.',
      de: 'Deutsche Verben im Präsens üben: Form eintippen, sofort Feedback bekommen. Akzeptiert Umlaute und alternative Schreibweisen.',
    },
  },
  {
    name: 'GitHub Dev Card', featured: false,
    tags: ['React', 'Vite', 'GitHub API'],
    url: 'https://github-dev-card-generator-gamma.vercel.app',
    source: 'https://github.com/jelenProgramming/github-dev-card-generator',
    desc: {
      en: 'Enter any GitHub username and generate a shareable developer card with stats, top languages and repo count.',
      de: 'GitHub-Benutzernamen eingeben und eine teilbare Entwicklerkarte mit Statistiken, Top-Sprachen und Repo-Anzahl generieren.',
    },
  },
  {
    name: 'Weather App', featured: false,
    tags: ['React', 'Vite', 'REST API'],
    url: 'https://weather-app-jelen.vercel.app',
    source: 'https://github.com/jelenProgramming/projects',
    desc: {
      en: 'Search weather by city, temperature, humidity, wind and conditions. Bilingual EN/DE.',
      de: 'Wetter nach Stadt suchen, Temperatur, Luftfeuchte, Wind und Bedingungen. Zweisprachig EN/DE.',
    },
  },
]

const stack = ['React', 'TypeScript', 'PHP', 'Laravel', 'SQL', 'JavaScript', 'HTML / CSS']

const loadLang = () => {
  try { return localStorage.getItem('portfolio:lang') === 'de' ? 'de' : 'en' } catch { return 'en' }
}

// reveal sections as they scroll in
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) {
        e.target.setAttribute('data-in', '')
        io.unobserve(e.target)
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// buttons drift toward the cursor
function useMagnetic() {
  useEffect(() => {
    if (reduceMotion()) return
    const els = [...document.querySelectorAll('[data-magnetic]')]
    const move = e => {
      const el = e.currentTarget, r = el.getBoundingClientRect()
      el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.25}px, ${(e.clientY - (r.top + r.height / 2)) * 0.4}px)`
    }
    const leave = e => { e.currentTarget.style.transform = '' }
    els.forEach(el => { el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave) })
    return () => els.forEach(el => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) })
  }, [])
}

export default function App() {
  const [lang, setLang] = useState(loadLang)
  const [sel, setSel] = useState(0)
  const t = UI[lang]
  const featured = projects.filter(p => p.featured)
  const rest = projects.filter(p => !p.featured)
  const current = featured[sel]

  useEffect(() => { document.documentElement.lang = lang }, [lang])
  useReveal()
  useMagnetic()

  const switchLang = next => {
    if (next === lang) return
    withTransition(() => setLang(next))
    try { localStorage.setItem('portfolio:lang', next) } catch { /* storage blocked */ }
  }

  const pickProject = i => withTransition(() => setSel(i))

  const onListKey = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); pickProject((sel + 1) % featured.length) }
    if (e.key === 'ArrowUp') { e.preventDefault(); pickProject((sel - 1 + featured.length) % featured.length) }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.logo}>DJ</span>
          <nav className={styles.nav}>
            <div className="langToggle" role="group" aria-label="Language">
              <button type="button" className={lang === 'en' ? 'langToggle__btn langToggle__btn--on' : 'langToggle__btn'} onClick={() => switchLang('en')}>EN</button>
              <button type="button" className={lang === 'de' ? 'langToggle__btn langToggle__btn--on' : 'langToggle__btn'} onClick={() => switchLang('de')}>DE</button>
            </div>
            <a href="#work" className={styles.navLink}>{t.work}</a>
            <a href="#about" className={styles.navLink}>{t.about}</a>
            <a href="#contact" className={styles.navCta}>{t.getInTouch}</a>
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <ConstellationHero />
          <div className={styles.heroInner}>
            <p className={styles.heroEyebrow} data-reveal>{t.eyebrow}</p>
            <h1 className={styles.heroTitle} data-reveal style={{ transitionDelay: '80ms' }}>
              {t.titleA}<br /><em>{t.titleB}</em>
            </h1>
            <p className={styles.heroSub} data-reveal style={{ transitionDelay: '160ms' }}>{t.heroSub}</p>
            <div className={styles.heroCtas} data-reveal style={{ transitionDelay: '240ms' }}>
              <a href="#work" className={styles.btnPrimary} data-magnetic>{t.seeWork}</a>
              <a href="https://github.com/jelenProgramming" target="_blank" rel="noopener noreferrer" className={styles.btnGhost} data-magnetic>GitHub ↗</a>
            </div>
          </div>
        </section>

        <div className={styles.wrap}>
          <section className={styles.stackSection} data-reveal>
            <p className={styles.stackLabel}>{t.stack}</p>
            <ul className={styles.stackList}>
              {stack.map(s => <li key={s} className={styles.stackChip}>{s}</li>)}
            </ul>
          </section>

          <section id="work" className={styles.work}>
            <h2 className={styles.sectionLabel} data-reveal>{t.selected}</h2>
            <div className={styles.switcher} data-reveal>
              <ul className={styles.switchList} onKeyDown={onListKey}>
                {featured.map((p, i) => (
                  <li key={p.name}>
                    <button
                      type="button"
                      className={i === sel ? `${styles.switchItem} ${styles.switchItemOn}` : styles.switchItem}
                      aria-current={i === sel}
                      onClick={() => pickProject(i)}
                    >
                      <span className={styles.switchIndex}>{String(i + 1).padStart(2, '0')}</span>
                      <span>{p.name}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <article className={styles.detail} key={current.name}>
                <h3 className={styles.detailName}>{current.name}</h3>
                <div className={styles.detailTags}>
                  {current.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                </div>
                <p className={styles.detailDesc}>{current.desc[lang]}</p>
                <div className={styles.detailLinks}>
                  <a href={current.url} target="_blank" rel="noopener noreferrer" className={styles.linkAccent} data-magnetic>{t.live}</a>
                  <a href={current.source} target="_blank" rel="noopener noreferrer" className={styles.linkMuted}>{t.source}</a>
                </div>
              </article>
            </div>

            <h2 className={`${styles.sectionLabel} ${styles.moreLabel}`} data-reveal>{t.more}</h2>
            <ul className={styles.moreList}>
              {rest.map(p => (
                <li key={p.name} className={styles.moreRow} data-reveal>
                  <div className={styles.moreMain}>
                    <h3 className={styles.moreName}>{p.name}</h3>
                    <p className={styles.moreDesc}>{p.desc[lang]}</p>
                  </div>
                  <div className={styles.moreLinks}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className={styles.linkAccent}>{t.live}</a>
                    <a href={p.source} target="_blank" rel="noopener noreferrer" className={styles.linkMuted}>{t.source}</a>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section id="about" className={styles.about}>
            <h2 className={styles.sectionLabel} data-reveal>{t.aboutTitle}</h2>
            <div className={styles.aboutGrid}>
              <p className={styles.aboutBody} data-reveal>{t.aboutBody}</p>
              <div className={styles.stats} data-reveal>
                {t.stats.map(s => (
                  <div key={s.l} className={styles.stat}>
                    <span className={styles.statNum}>{s.n}</span>
                    <span className={styles.statLabel}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className={styles.contact} data-reveal>
            <div className={styles.contactInner}>
              <div className={styles.contactText}>
                <h2>{t.contactTitle}</h2>
                <p>{t.contactSub}</p>
              </div>
              <div className={styles.contactLinks}>
                <a href="mailto:jelenprogramming@gmail.com" className={styles.btnPrimary} data-magnetic>{t.sendEmail}</a>
                <a href="https://linkedin.com/in/david-jelen-007067419" target="_blank" rel="noopener noreferrer" className={styles.btnGhost} data-magnetic>LinkedIn ↗</a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <span>© 2026 David Jelen</span>
        <a href="https://github.com/jelenProgramming" target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </div>
  )
}

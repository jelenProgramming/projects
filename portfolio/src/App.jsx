import { useEffect, useState } from 'react'
import styles from './App.module.css'

const UI = {
  en: {
    eyebrow: 'CS student · FERI Maribor · Slovenia',
    titleA: 'I build web apps',
    titleB: 'and ship them.',
    heroSub: 'React, PHP, Laravel. EN / DE (C1). Open to freelance work and junior roles in Slovenia and Austria.',
    seeWork: 'See my work',
    getInTouch: 'Get in touch',
    stack: 'Stack',
    projects: 'Projects',
    live: 'Live ↗',
    source: 'Source',
    contactTitle: "Let's work together",
    contactSub: 'Student rates. Fast replies. English and German.',
    sendEmail: 'Send an email',
  },
  de: {
    eyebrow: 'Informatikstudent · FERI Maribor · Slowenien',
    titleA: 'Ich baue Web-Apps',
    titleB: 'und bringe sie live.',
    heroSub: 'React, PHP, Laravel. EN / DE (C1). Offen für Freelance-Aufträge und Junior-Stellen in Slowenien und Österreich.',
    seeWork: 'Meine Arbeit',
    getInTouch: 'Kontakt',
    stack: 'Stack',
    projects: 'Projekte',
    live: 'Live ↗',
    source: 'Quellcode',
    contactTitle: 'Arbeiten wir zusammen',
    contactSub: 'Studententarife. Schnelle Antworten. Deutsch und Englisch.',
    sendEmail: 'E-Mail schreiben',
  },
}

const projects = [
  {
    name: 'CS Courses',
    description: {
      en: '97-topic interactive reference for FERI first-year CS — algorithms, data structures, calculus, discrete math, ARA, and more. 51 live visualizers, bilingual EN/DE, two study modes. KaTeX math rendering.',
      de: '97 Themen als interaktives Nachschlagewerk für das erste Studienjahr an der FERI: Algorithmen, Datenstrukturen, Analysis, diskrete Mathematik, ARA und mehr. 51 Live-Visualisierungen, zweisprachig EN/DE, zwei Lernmodi. KaTeX für Formeln.',
    },
    tags: ['React', 'Vite', 'KaTeX'],
    url: 'https://cs-courses.vercel.app',
    source: 'https://github.com/jelenProgramming/cs-courses',
  },
  {
    name: 'SQL Playground',
    description: {
      en: 'Write and run real SQL in the browser: SQLite compiled to WebAssembly, live schema explorer, and 12 guided exercises checked against actual result sets, so any correct query passes. TypeScript throughout, 58 unit tests with Vitest.',
      de: 'Echtes SQL im Browser schreiben und ausführen: SQLite als WebAssembly, Schema-Explorer und 12 Übungen, die gegen echte Ergebnismengen geprüft werden, jede korrekte Abfrage zählt. Durchgehend TypeScript, 58 Unit-Tests mit Vitest.',
    },
    tags: ['TypeScript', 'React', 'WebAssembly', 'Vitest'],
    url: 'https://sql-playground-weld.vercel.app',
    source: 'https://github.com/jelenProgramming/sql-playground',
  },
  {
    name: 'Link Shortener',
    description: {
      en: 'Create short URLs and track every click. Full-stack: Laravel REST API (Railway) with per-link analytics — clicks by day, top referrers, recent visits. React dashboard on Vercel.',
      de: 'Kurz-URLs erstellen und jeden Klick verfolgen. Full-Stack: Laravel-REST-API (Railway) mit Statistiken pro Link: Klicks pro Tag, Top-Referrer, letzte Besuche. React-Dashboard auf Vercel.',
    },
    tags: ['React', 'Laravel', 'MySQL', 'REST API'],
    url: 'https://linkshort-web-six.vercel.app',
    source: 'https://github.com/jelenProgramming/link-shortener',
  },
  {
    name: 'Job Tracker',
    description: {
      en: 'Track job applications through every stage — wishlist to offer. Auth with Laravel Sanctum, kanban-style status updates, company management, event timeline per application.',
      de: 'Bewerbungen durch jede Phase verfolgen, von der Wunschliste bis zum Angebot. Auth mit Laravel Sanctum, Statuswechsel im Kanban-Stil, Firmenverwaltung, Ereignis-Timeline pro Bewerbung.',
    },
    tags: ['React', 'Laravel', 'Sanctum', 'MySQL'],
    url: 'https://job-tracker-web-fawn.vercel.app',
    source: 'https://github.com/jelenProgramming/job-tracker',
  },
  {
    name: 'Konjugationstrainer',
    description: {
      en: 'German verb conjugation drill. Type the correct present-tense form, get instant feedback. Accepts both umlauts and alternate spellings. Built with React.',
      de: 'Deutsche Verben im Präsens üben: Form eintippen, sofort Feedback bekommen. Akzeptiert Umlaute und alternative Schreibweisen. Gebaut mit React.',
    },
    tags: ['React', 'Vite'],
    url: 'https://deutsch-trainer-orcin.vercel.app',
    source: 'https://github.com/jelenProgramming/deutsch-trainer',
  },
  {
    name: 'GitHub Dev Card',
    description: {
      en: 'Enter any GitHub username and generate a shareable developer profile card with stats, top languages, and repo count. Built with React and the GitHub API.',
      de: 'GitHub-Benutzernamen eingeben und eine teilbare Entwicklerkarte generieren, mit Statistiken, Top-Sprachen und Repo-Anzahl. Gebaut mit React und der GitHub-API.',
    },
    tags: ['React', 'Vite', 'GitHub API'],
    url: 'https://github-dev-card-generator-gamma.vercel.app',
    source: 'https://github.com/jelenProgramming/github-dev-card-generator',
  },
  {
    name: 'Weather App',
    description: {
      en: 'Search weather by city. Shows temperature, humidity, wind speed, and conditions. Bilingual EN/DE. Built with React and the OpenWeatherMap API.',
      de: 'Wetter nach Stadt suchen. Zeigt Temperatur, Luftfeuchte, Wind und Bedingungen. Zweisprachig EN/DE. Gebaut mit React und der OpenWeatherMap-API.',
    },
    tags: ['React', 'Vite', 'REST API'],
    url: 'https://weather-app-jelen.vercel.app',
    source: 'https://github.com/jelenProgramming/hello-world',
  },
]

const stack = ['React', 'TypeScript', 'PHP', 'Laravel', 'SQL', 'JavaScript', 'HTML / CSS']

function loadLang() {
  try {
    return window.localStorage.getItem('portfolio:lang') === 'de' ? 'de' : 'en'
  } catch {
    return 'en'
  }
}

export default function App() {
  const [lang, setLang] = useState(loadLang)
  const t = UI[lang]

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  function switchLang(next) {
    setLang(next)
    try {
      window.localStorage.setItem('portfolio:lang', next)
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>DJ</span>
        <nav className={styles.nav}>
          <div className="langToggle" role="group" aria-label="Language">
            <button
              type="button"
              className={lang === 'en' ? 'langToggle__btn langToggle__btn--on' : 'langToggle__btn'}
              onClick={() => switchLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === 'de' ? 'langToggle__btn langToggle__btn--on' : 'langToggle__btn'}
              onClick={() => switchLang('de')}
            >
              DE
            </button>
          </div>
          <a href="#projects">{t.projects}</a>
          <a href="#contact" className={styles.navCta}>{t.getInTouch}</a>
        </nav>
      </header>

      <main>
        <div className={styles.wrap}>
          <section className={styles.hero}>
            <p className={styles.heroEyebrow}>{t.eyebrow}</p>
            <h1 className={styles.heroTitle}>
              {t.titleA}<br />
              <em>{t.titleB}</em>
            </h1>
            <p className={styles.heroSub}>{t.heroSub}</p>
            <div className={styles.heroCtas}>
              <a href="#projects" className={styles.btnPrimary}>{t.seeWork}</a>
              <a href="https://github.com/jelenProgramming" target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>GitHub ↗</a>
            </div>
          </section>

          <hr className={styles.divider} />

          <section className={styles.stackSection}>
            <p className={styles.stackLabel}>{t.stack}</p>
            <ul className={styles.stackList}>
              {stack.map(s => (
                <li key={s} className={styles.stackChip}>{s}</li>
              ))}
            </ul>
          </section>

          <hr className={styles.divider} />

          <section id="projects" className={styles.projectsSection}>
            <h2 className={styles.sectionTitle}>{t.projects}</h2>
            <ul className={styles.projectList}>
              {projects.map(p => (
                <li key={p.name} className={styles.projectCard}>
                  <div className={styles.projectLeft}>
                    <h3 className={styles.projectName}>{p.name}</h3>
                    <div className={styles.projectTags}>
                      {p.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                    </div>
                  </div>
                  <div className={styles.projectRight}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className={styles.linkAccent}>{t.live}</a>
                    <a href={p.source} target="_blank" rel="noopener noreferrer" className={styles.linkMuted}>{t.source}</a>
                  </div>
                  <p className={styles.projectDesc}>{p.description[lang]}</p>
                </li>
              ))}
            </ul>
          </section>

          <hr className={styles.divider} />

          <section id="contact" className={styles.contactSection}>
            <div className={styles.contactInner}>
              <div className={styles.contactText}>
                <h2>{t.contactTitle}</h2>
                <p>{t.contactSub}</p>
              </div>
              <div className={styles.contactLinks}>
                <a href="mailto:jelenprogramming@gmail.com" className={styles.btnPrimary}>{t.sendEmail}</a>
                <a href="https://linkedin.com/in/david-jelen-007067419" target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>LinkedIn ↗</a>
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

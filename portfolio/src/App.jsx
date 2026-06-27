import styles from './App.module.css'

const projects = [
  {
    name: 'Link Shortener',
    description: 'Create short URLs and track every click. Full-stack: Laravel REST API (Railway) with per-link analytics — clicks by day, top referrers, recent visits. React dashboard on Vercel.',
    tags: ['React', 'Laravel', 'MySQL', 'REST API'],
    url: 'https://linkshort-web-six.vercel.app',
    source: 'https://github.com/jelenProgramming/link-shortener',
  },
  {
    name: 'Job Tracker',
    description: 'Track job applications through every stage — wishlist to offer. Auth with Laravel Sanctum, kanban-style status updates, company management, event timeline per application.',
    tags: ['React', 'Laravel', 'Sanctum', 'MySQL'],
    url: 'https://job-tracker-web.vercel.app',
    source: 'https://github.com/jelenProgramming/job-tracker',
  },
  {
    name: 'Konjugationstrainer',
    description: 'German verb conjugation drill. Type the correct present-tense form, get instant feedback. Accepts both umlauts and alternate spellings. Built with React.',
    tags: ['React', 'Vite'],
    url: 'https://deutsch-trainer-orcin.vercel.app',
    source: 'https://github.com/jelenProgramming/deutsch-trainer',
  },
  {
    name: 'GitHub Dev Card',
    description: 'Enter any GitHub username and generate a shareable developer profile card with stats, top languages, and repo count. Built with React and the GitHub API.',
    tags: ['React', 'Vite', 'GitHub API'],
    url: 'https://github-dev-card-generator-gamma.vercel.app',
    source: 'https://github.com/jelenProgramming/github-dev-card-generator',
  },
  {
    name: 'Weather App',
    description: 'Search weather by city. Shows temperature, humidity, wind speed, and conditions. Built with React and the OpenWeatherMap API.',
    tags: ['React', 'Vite', 'REST API'],
    url: 'https://vreme-app-chi.vercel.app',
    source: 'https://github.com/jelenProgramming/hello-world',
  },
]

const stack = ['React', 'PHP', 'Laravel', 'SQL', 'JavaScript', 'HTML / CSS']

export default function App() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>DJ</span>
        <nav className={styles.nav}>
          <a href="#projects">Projects</a>
          <a href="#contact" className={styles.navCta}>Get in touch</a>
        </nav>
      </header>

      <main>
        <div className={styles.wrap}>
          <section className={styles.hero}>
            <p className={styles.heroEyebrow}>CS student · FERI Maribor · Slovenia</p>
            <h1 className={styles.heroTitle}>
              I build web apps<br />
              <em>and ship them.</em>
            </h1>
            <p className={styles.heroSub}>
              React, PHP, Laravel. EN / DE (C1).
              Open to freelance work and junior roles in Slovenia and Austria.
            </p>
            <div className={styles.heroCtas}>
              <a href="#projects" className={styles.btnPrimary}>See my work</a>
              <a href="https://github.com/jelenProgramming" target="_blank" rel="noopener noreferrer" className={styles.btnGhost}>GitHub ↗</a>
            </div>
          </section>

          <hr className={styles.divider} />

          <section className={styles.stackSection}>
            <p className={styles.stackLabel}>Stack</p>
            <ul className={styles.stackList}>
              {stack.map(s => (
                <li key={s} className={styles.stackChip}>{s}</li>
              ))}
            </ul>
          </section>

          <hr className={styles.divider} />

          <section id="projects" className={styles.projectsSection}>
            <h2 className={styles.sectionTitle}>Projects</h2>
            <ul className={styles.projectList}>
              {projects.map(p => (
                <li key={p.name} className={styles.projectCard}>
                  <div className={styles.projectLeft}>
                    <h3 className={styles.projectName}>{p.name}</h3>
                    <div className={styles.projectTags}>
                      {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                    </div>
                  </div>
                  <div className={styles.projectRight}>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className={styles.linkAccent}>Live ↗</a>
                    <a href={p.source} target="_blank" rel="noopener noreferrer" className={styles.linkMuted}>Source</a>
                  </div>
                  <p className={styles.projectDesc}>{p.description}</p>
                </li>
              ))}
            </ul>
          </section>

          <hr className={styles.divider} />

          <section id="contact" className={styles.contactSection}>
            <div className={styles.contactInner}>
              <div className={styles.contactText}>
                <h2>Let's work together</h2>
                <p>Student rates. Fast replies. English and German.</p>
              </div>
              <div className={styles.contactLinks}>
                <a href="mailto:jelenprogramming@gmail.com" className={styles.btnPrimary}>Send an email</a>
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

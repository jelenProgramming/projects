import { useLang } from '../i18n.jsx'

// -----------------------------------------------------------------------------
// EDIT YOUR CONTACT DETAILS HERE  <- replace the placeholder values below
const CONTACT = {
  name: 'David Jelen',
  github: 'https://github.com/jelenProgramming',
  email: 'jelenprogramming@gmail.com',
  linkedin: 'https://linkedin.com/in/david-jelen-007067419',
}
// -----------------------------------------------------------------------------

const COURSES = [
  { name: { en: 'Programming I', de: 'Programmierung I' }, refs: [
    'Prata, S. (2005). C++ primer plus, 5th ed. Sams.',
    'Lippman, Lajoie, Moo (2013). C++ primer, 5th ed. Addison-Wesley.',
  ]},
  { name: { en: 'Programming II', de: 'Programmierung II' }, refs: [
    'B. Stroustrup: A Tour of C++, 2nd ed. Pearson Addison-Wesley, 2018.',
  ]},
  { name: { en: 'Algorithms & Data Structures', de: 'Algorithmen & Datenstrukturen' }, refs: [
    'Cormen, Leiserson, Rivest, Stein (2009). Introduction to Algorithms, 3rd ed. MIT Press.',
  ]},
  { name: { en: 'Applications of Computer Algorithms', de: 'Anwendungen von Computeralgorithmen' }, refs: [
    'Salomon & Motta (2010). Handbook of Data Compression, 5th ed. Springer.',
    'Adjeroh, Bell, Mukherjee (2008). The Burrows-Wheeler Transform. Springer.',
  ]},
  { name: { en: 'Discrete Structures', de: 'Diskrete Strukturen' }, refs: [
    'Rosen, K. H. (2019). Discrete Mathematics and Its Applications, 8th ed. McGraw-Hill.',
  ]},
  { name: { en: 'Mathematical Analysis', de: 'Mathematische Analysis' }, refs: [
    'Course lecture notes: limits & continuity, derivatives, integrals, sequences & series.',
  ]},
  { name: { en: 'Databases I', de: 'Datenbanken I' }, refs: [
    'Connolly & Begg (2015). Database Systems, 6th ed. Pearson.',
    'Elmasri & Navathe (2016). Fundamentals of Database Systems, 7th ed. Pearson.',
  ]},
  { name: { en: 'Foundations of Computer Systems', de: 'Grundlagen der Computersysteme' }, refs: [
    'Brookshear, J. G. (2012). Computer Science: An Overview, 11th ed. Addison-Wesley.',
  ]},
  { name: { en: 'Foundations of the World Wide Web', de: 'Grundlagen des World Wide Web' }, refs: [
    'Meloni, J. C. (2015). Sams Teach Yourself HTML, CSS, and JavaScript All in One, 2nd ed.',
    'Ullman, L. E. (2016). PHP for the Web, 5th ed. Peachpit Press.',
    'MDN Web Docs - developer.mozilla.org (HTTP, DNS, cookies, AJAX).',
  ]},
]

export default function Info() {
  const { t } = useLang()
  const hasGithub = !CONTACT.github.includes('YOUR_GITHUB')
  const hasEmail = !CONTACT.email.includes('YOUR_EMAIL')
  const hasLinkedin = !CONTACT.linkedin.includes('YOUR_LINKEDIN')

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">{t({ en: 'Info & Sources', de: 'Info & Quellen' })}</h1>
        <p className="page-desc">{t({
          en: 'An interactive, bilingual companion for the core algorithms, data structures and mathematics of a computer science degree. Built to make each concept click for you, one animated step at a time.',
          de: 'Ein interaktiver, zweisprachiger Begleiter für die zentralen Algorithmen, Datenstrukturen und die Mathematik eines Informatikstudiums. Gebaut, damit jedes Konzept bei dir Klick macht, Schritt für Schritt.',
        })}</p>
      </div>

      <div className="panel">
        <h3 className="section">{t({ en: 'About & contact', de: 'Über & Kontakt' })}</h3>
        <p className="muted" style={{ marginTop: 8 }}>{t({ en: 'Made by', de: 'Erstellt von' })} <strong style={{ color: 'var(--text)' }}>{CONTACT.name}</strong>.</p>
        <div className="contact-row">
          {hasGithub && <a className="contact-link" href={CONTACT.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
          {hasEmail && <a className="contact-link" href={`mailto:${CONTACT.email}`}>Email ↗</a>}
          {hasLinkedin && <a className="contact-link" href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
          {!hasGithub && !hasEmail && !hasLinkedin && (
            <span className="muted" style={{ fontSize: 12.5 }}>{t({ en: '(contact links: edit CONTACT in src/pages/Info.jsx)', de: '(Kontaktlinks: CONTACT in src/pages/Info.jsx bearbeiten)' })}</span>
          )}
        </div>
      </div>

      <div className="panel" style={{ marginTop: 14 }}>
        <h3 className="section">{t({ en: 'Sources & references', de: 'Quellen & Referenzen' })}</h3>
        <p className="muted" style={{ margin: '8px 0 4px', fontSize: 13 }}>{t({
          en: 'Standard reference works for each subject, listed for further reading. All explanations, code and visualizations here are original; algorithms and mathematical facts are not copyrightable.',
          de: 'Standardwerke zu jedem Fachgebiet, angegeben zur Vertiefung. Alle Erklärungen, der Code und die Visualisierungen sind eigenständig.',
        })}</p>
      </div>

      {COURSES.map((c, i) => (
        <div className="panel" key={i} style={{ marginTop: 12 }}>
          <h3 className="section" style={{ marginBottom: 10, color: 'var(--accent)' }}>{t(c.name)}</h3>
          <ul className="prose" style={{ paddingLeft: 18, margin: 0, fontSize: 13 }}>
            {c.refs.map((r, j) => <li key={j} style={{ marginBottom: 7 }}>{r}</li>)}
          </ul>
        </div>
      ))}
    </div>
  )
}

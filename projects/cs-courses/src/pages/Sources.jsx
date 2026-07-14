import { useLang } from '../i18n.jsx'

/**
 * Sources / references. Standard reference works for each subject, listed for
 * further reading. All explanations, code and visualizations in
 * this app are original; algorithms and mathematical facts are not copyrightable.
 */
const COURSES = [
  {
    name: { en: 'Programming I', de: 'Programmierung I' },
    refs: [
      'Prata, S. (2005). C++ primer plus, 5th ed. Sams.',
      'Sahni, S. (2005). Data structures, algorithms, and applications in C++, 2nd ed. Silicon Press.',
      'Deitel, P. J., & Deitel, H. M. (2017). C++: how to program, 10th Global ed. Pearson.',
      'Lippman, S. B., Lajoie, J., & Moo, B. E. (2013). C++ primer, 5th ed. Addison-Wesley.',
    ],
  },
  {
    name: { en: 'Programming II', de: 'Programmierung II' },
    refs: [
      'B. Stroustrup: A Tour of C++, Second Edition. Pearson Addison-Wesley, Boston, 2018.',
    ],
  },
  {
    name: { en: 'Algorithms & Data Structures', de: 'Algorithmen & Datenstrukturen' },
    refs: [
      'Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). Introduction to algorithms, 3rd ed. The MIT Press.',
    ],
  },
  {
    name: { en: 'Applications of Computer Algorithms', de: 'Anwendungen von Computeralgorithmen' },
    refs: [
      'Salomon, D., & Motta, G. (2010). Handbook of data compression, 5th ed. Springer. doi:10.1007/978-1-84882-903-9',
      'Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). Introduction to algorithms, 3rd ed. The MIT Press.',
      'Adjeroh, D., Bell, T. C., & Mukherjee, A. (2008). The Burrows-Wheeler transform: data compression, suffix arrays, and pattern matching. Springer.',
    ],
  },
  {
    name: { en: 'Discrete Structures', de: 'Diskrete Strukturen' },
    refs: [
      'Rosen, K. H. (2019). Discrete Mathematics and Its Applications, 8th ed. McGraw-Hill.',
    ],
  },
  {
    name: { en: 'Mathematical Analysis', de: 'Mathematische Analysis' },
    refs: [
      'Stewart, J. (2015). Calculus, 8th ed. Cengage Learning.',
    ],
  },
  {
    name: { en: 'Databases I', de: 'Datenbanken I' },
    refs: [
      'T. Connolly, C. Begg: Database Systems: A Practical Approach to Design, Implementation and Management, 6th ed. Pearson, 2015.',
      'R. Elmasri, S. Navathe: Fundamentals of Database Systems, 7th ed. Pearson, 2016.',
    ],
  },
  {
    name: { en: 'Foundations of Computer Systems', de: 'Grundlagen der Computersysteme' },
    refs: [
      'Brookshear, J. G. (2012). Computer science: an overview, 11th International ed. Addison-Wesley.',
    ],
  },
  {
    name: { en: 'Foundations of the World Wide Web', de: 'Grundlagen des World Wide Web' },
    refs: [
      'Meloni, J. C. (2015). Sams teach yourself HTML, CSS, and JavaScript all in one, 2nd ed. Sams.',
      'Ullman, L. E. (2016). PHP for the web, 5th ed. Peachpit Press.',
      'Collins, M. (2017). Pro HTML5 with CSS, JavaScript, and multimedia. Apress.',
    ],
  },
]

export default function Sources() {
  const { t } = useLang()
  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">{t({ en: 'Sources & References', de: 'Quellen & Referenzen' })}</h1>
        <p className="page-desc">{t({
          en: 'Standard reference works for each subject, listed for further reading. All explanations, code and visualizations in this project are original - algorithms and mathematical facts themselves are not copyrightable.',
          de: 'Standardwerke zu jedem Fachgebiet, aufgeführt zur Vertiefung. Alle Erklärungen, der Code und die Visualisierungen sind eigenständig - Algorithmen und mathematische Fakten selbst sind nicht urheberrechtlich geschützt.',
        })}</p>
      </div>

      {COURSES.map((c, i) => (
        <div className="panel" key={i} style={{ marginBottom: 14 }}>
          <h3 className="section" style={{ marginBottom: 10, color: 'var(--accent)' }}>{t(c.name)}</h3>
          <ul className="prose" style={{ paddingLeft: 18, margin: 0, fontSize: 13 }}>
            {c.refs.map((r, j) => <li key={j} style={{ marginBottom: 7 }}>{r}</li>)}
          </ul>
        </div>
      ))}

      <div className="note" style={{ marginTop: 20 }}>
        {t({
          en: 'Named theorems are stated on the relevant topic pages - e.g. the Dirichlet / pigeonhole principle, inclusion-exclusion, the binomial theorem, and the inference rules (Modus ponens, Modus tollens, disjunctive & hypothetical syllogism) - with the curriculum\'s Slovenian terminology preserved where it aids exam recognition.',
          de: 'Benannte Sätze stehen auf den jeweiligen Themenseiten - z.B. das Dirichlet- / Schubfachprinzip, Inklusion-Exklusion, der binomische Satz und die Schlussregeln (Modus ponens, Modus tollens, disjunktiver & hypothetischer Syllogismus).',
        })}
      </div>
    </div>
  )
}

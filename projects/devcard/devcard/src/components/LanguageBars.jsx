const COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Java: '#b07219',
  'C++': '#f34b7d', C: '#555555', 'C#': '#178600', PHP: '#4F5D95', HTML: '#e34c26',
  CSS: '#563d7c', Vue: '#41b883', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
  Shell: '#89e051', Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB',
}

export default function LanguageBars({ langs }) {
  if (!langs.length) return null
  return (
    <section className="langs">
      <h3 className="section-title">Top languages</h3>
      <div className="langs__list">
        {langs.map((l) => (
          <div className="lang" key={l.name}>
            <div className="lang__head">
              <span className="lang__dot" style={{ background: COLORS[l.name] || '#8b8b9a' }} />
              <span className="lang__name">{l.name}</span>
              <span className="lang__pct">{l.pct}%</span>
            </div>
            <div className="lang__track">
              <div
                className="lang__fill"
                style={{ width: `${l.pct}%`, background: COLORS[l.name] || '#8b8b9a' }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function BarChart({ data, t }) {
  if (!data.length) return <p className="stats__empty">{t.noClicks30}</p>
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <div className="chart">
      {data.map((d) => (
        <div className="chart__col" key={d.day} title={`${d.day}: ${d.count}`}>
          <div className="chart__bar" style={{ height: `${(d.count / max) * 100}%` }} />
          <div className="chart__label">{d.day.slice(5)}</div>
        </div>
      ))}
    </div>
  )
}

export default function Stats({ data, loading, t }) {
  if (loading) return <div className="stats stats--loading">{t.loadingStats}</div>
  if (!data) return null

  const { stats } = data
  return (
    <div className="stats">
      <div className="stats__head">
        <h3 className="stats__title">{data.link.short_url.replace(/^https?:\/\//, '')}</h3>
        <div className="stats__total">
          <span className="stats__totalnum">{stats.total}</span> {t.totalClicks}
        </div>
      </div>

      <div className="stats__section">
        <div className="stats__label">{t.last30}</div>
        <BarChart data={stats.by_day} t={t} />
      </div>

      <div className="stats__cols">
        <div className="stats__section">
          <div className="stats__label">{t.topReferrers}</div>
          {stats.top_referers.length ? (
            <ul className="reflist">
              {stats.top_referers.map((r, i) => (
                <li key={i}>
                  <span className="reflist__name">{r.referer}</span>
                  <span className="reflist__count">{r.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="stats__empty">{t.nothingYet}</p>
          )}
        </div>

        <div className="stats__section">
          <div className="stats__label">{t.recentClicks}</div>
          {stats.recent.length ? (
            <ul className="reflist">
              {stats.recent.map((r, i) => (
                <li key={i}>
                  <span className="reflist__name">{r.referer}</span>
                  <span className="reflist__count">{new Date(r.at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="stats__empty">{t.nothingYet}</p>
          )}
        </div>
      </div>
    </div>
  )
}

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { BarChart3, Globe, Clock3, MousePointerClick } from 'lucide-react'

function ClicksChart({ data, t }) {
  if (!data.length) return <p className="stats__empty">{t.noClicks30}</p>
  const rows = data.map((d) => ({ ...d, label: d.day.slice(5) }))
  return (
    <div className="chartwrap">
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={rows} margin={{ top: 6, right: 6, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="clicksFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#26304a" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" stroke="#6b7896" fontSize={11} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis stroke="#6b7896" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} width={34} />
          <Tooltip
            cursor={{ stroke: '#3b4666' }}
            contentStyle={{ background: '#131c2e', border: '1px solid #26304a', borderRadius: 10, color: '#e8edf7', fontSize: 12 }}
            labelStyle={{ color: '#9aa6c0' }}
          />
          <Area type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2} fill="url(#clicksFill)" />
        </AreaChart>
      </ResponsiveContainer>
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
          <MousePointerClick className="sec-ico" aria-hidden="true" />
          <span className="stats__totalnum">{stats.total}</span> {t.totalClicks}
        </div>
      </div>

      <div className="stats__section">
        <div className="stats__label"><BarChart3 className="sec-ico" aria-hidden="true" /> {t.last30}</div>
        <ClicksChart data={stats.by_day} t={t} />
      </div>

      <div className="stats__cols">
        <div className="stats__section">
          <div className="stats__label"><Globe className="sec-ico" aria-hidden="true" /> {t.topReferrers}</div>
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
          <div className="stats__label"><Clock3 className="sec-ico" aria-hidden="true" /> {t.recentClicks}</div>
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

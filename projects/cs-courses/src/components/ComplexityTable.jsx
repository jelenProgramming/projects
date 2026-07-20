import { useLang } from '../i18n.jsx'

/**
 * Renders a best/average/worst complexity table, auto-merging adjacent rows that
 * have identical time AND space into a single spanning row. If all rows collapse
 * to one, the label becomes "All cases" / "Alle Faelle". No leftover "/" cells.
 *
 * Each input row: { case:{en,de}|string, time, space, cls, note }
 */
export default function ComplexityTable({ rows = [] }) {
  const { t, tk } = useLang()
  if (!rows.length) return null

  // group consecutive rows with same time+space
  const groups = []
  for (const row of rows) {
    const last = groups[groups.length - 1]
    if (last && last.time === row.time && last.space === row.space) {
      last.cases.push(row.case)
      if (row.note) last.note = row.note
    } else {
      groups.push({ time: row.time, space: row.space, cls: row.cls, note: row.note, cases: [row.case] })
    }
  }

  const allMerged = groups.length === 1 && rows.length > 1
  const notes = groups.filter((g) => g.note)

  return (
    <>
      <table className="cx-table">
        <thead>
          <tr><th>{tk('case')}</th><th>{tk('time')}</th><th>{tk('space')}</th></tr>
        </thead>
        <tbody>
          {groups.map((g, i) => {
            const label = allMerged
              ? { en: 'All cases', de: 'Alle Fälle' }
              : g.cases.length > 1
                ? g.cases  // multiple labels merged but not all -> join
                : g.cases[0]
            const labelText = Array.isArray(label)
              ? label.map((c) => t(c)).join(' / ')
              : t(label)
            return (
              <tr key={i}>
                <td>{labelText}</td>
                <td className={g.cls}>{g.time}</td>
                <td>{g.space || '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {notes.length > 0 && (
        <div className="note" style={{ marginTop: 12 }}>
          {notes.map((g, i) => <div key={i}>{t(g.note)}</div>)}
        </div>
      )}
    </>
  )
}

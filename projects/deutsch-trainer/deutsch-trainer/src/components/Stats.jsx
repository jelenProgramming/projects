export default function Stats({ streak, best, seen, accuracy }) {
  const items = [
    { label: 'Streak', value: streak },
    { label: 'Best', value: best },
    { label: 'Answered', value: seen },
    { label: 'Accuracy', value: `${accuracy}%` },
  ]
  return (
    <div className="stats">
      {items.map((i) => (
        <div className="statbox" key={i.label}>
          <div className="statbox__value">{i.value}</div>
          <div className="statbox__label">{i.label}</div>
        </div>
      ))}
    </div>
  )
}

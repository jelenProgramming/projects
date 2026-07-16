import { Flame, Trophy, ListChecks, Target } from 'lucide-react'

export default function Stats({ streak, best, seen, accuracy }) {
  const items = [
    { label: 'Streak', value: streak, Icon: Flame },
    { label: 'Best', value: best, Icon: Trophy },
    { label: 'Answered', value: seen, Icon: ListChecks },
    { label: 'Accuracy', value: `${accuracy}%`, Icon: Target },
  ]
  return (
    <div className="stats">
      {items.map(({ label, value, Icon }) => (
        <div className="statbox" key={label}>
          <Icon className="statbox__ico" aria-hidden="true" />
          <div className="statbox__value">{value}</div>
          <div className="statbox__label">{label}</div>
        </div>
      ))}
    </div>
  )
}

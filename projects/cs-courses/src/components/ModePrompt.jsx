import { useMode } from '../mode.jsx'
import { useLang } from '../i18n.jsx'

/**
 * First-visit overlay that asks the user how they feel, and picks the study mode
 * from the answer. Only shows until a choice is made (persisted).
 */
export default function ModePrompt() {
  const { chosen, setMode } = useMode()
  const { t } = useLang()
  if (chosen) return null
  return (
    <div className="mode-prompt-backdrop">
      <div className="mode-prompt">
        <h2>{t({ en: 'Do you have time to learn, or do you need to cram as much as possible, as fast as possible?', de: 'Hast du Zeit zu lernen, oder musst du so viel wie möglich, so schnell wie möglich pauken?' })}</h2>
        <p>{t({ en: 'You can switch any time in the top bar.', de: 'Du kannst oben jederzeit wechseln.' })}</p>
        <div className="mode-prompt-options">
          <button className="mode-card" onClick={() => setMode('calm')}>
            <span className="mode-card-emoji">😮‍💨</span>
            <span className="mode-card-title">{t({ en: 'Stressed / cramming', de: 'Gestresst / am Pauken' })}</span>
            <span className="mode-card-sub">{t({ en: 'Just the essentials, calm and condensed. No distractions.', de: 'Nur das Wesentliche, ruhig und kompakt. Keine Ablenkung.' })}</span>
          </button>
          <button className="mode-card explore" onClick={() => setMode('explore')}>
            <span className="mode-card-emoji">🧭</span>
            <span className="mode-card-title">{t({ en: "I've got time to learn", de: 'Ich habe Zeit zu lernen' })}</span>
            <span className="mode-card-sub">{t({ en: 'Full explanations, animations, things to play with.', de: 'Volle Erklärungen, Animationen, zum Ausprobieren.' })}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

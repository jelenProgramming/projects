import { useLang } from '../i18n.jsx'
import { useMode } from '../mode.jsx'
import { useExpanded } from '../expand.js'
import ComplexityTable from './ComplexityTable.jsx'
import DefCards from './DefCards.jsx'
import Expandable from './Expandable.jsx'
import { mathify } from './Math.jsx'
import CodeTabs from './CodeTabs.jsx'

/**
 * ReadPage - shared layout for explanation ("read") topics. All text fields
 * accept a plain string or an { en, de } pair. Code stays English.
 *
 * Cram (calm) mode shows only essentials (defs, complexity, traps). Verbose
 * sections collapse to an "Explain more" button per section; expanding is
 * remembered across topics (useExpanded), with a reset control.
 */
export default function ReadPage({ intro = [], defs = [], how = [], paper = [], pseudocode, cpp, code = null, complexity = [], example = null, pitfalls = [], children }) {
  const { t, tk } = useLang()
  const { mode } = useMode()
  const calm = mode === 'calm'
  const { isOpen, toggle, resetAll, anyOpen } = useExpanded()

  const introEl = intro.length > 0 && (
    <div className="panel prose">{intro.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: mathify(t(p)) }} />)}</div>
  )
  const howEl = how.length > 0 && (
    <div className="panel">
      <h2 className="section">{tk('howItWorks')}</h2>
      <ol className="prose" style={{ paddingLeft: 20, marginTop: 12, marginBottom: 0 }}>
        {how.map((s, i) => <li key={i} dangerouslySetInnerHTML={{ __html: mathify(t(s)) }} />)}
      </ol>
    </div>
  )
  const pseudoEl = pseudocode && (
    <div className="panel"><h2 className="section">{tk('pseudocode')}</h2><pre className="code" style={{ marginTop: 12 }}>{pseudocode}</pre></div>
  )
  const cppEl = cpp && (
    <div className="panel">
      <h2 className="section">{tk('inCpp')}</h2>
      {cpp.caption && <p className="muted" style={{ margin: '6px 0 12px', fontSize: 13 }}>{t(cpp.caption)}</p>}
      <pre className="code">{cpp.code}</pre>
    </div>
  )
  const codeEl = code && (
    <div className="panel">
      <h2 className="section">{t({ en: 'In code', de: 'Im Code' })}</h2>
      <CodeTabs code={code} />
    </div>
  )

  return (
    <div className="cols">
      <div>
        {calm && anyOpen && (
          <button className="cram-reset" onClick={resetAll}>↺ {t({ en: 'Reset to condensed', de: 'Auf kompakt zuruecksetzen' })}</button>
        )}
        {defs.length > 0 && <DefCards defs={defs} />}
        {introEl && <Expandable calm={calm} open={isOpen('intro')} onToggle={() => toggle('intro')} label={t({ en: 'full description', de: 'volle Beschreibung' })}>{introEl}</Expandable>}
        {howEl && <Expandable calm={calm} open={isOpen('how')} onToggle={() => toggle('how')} label={tk('howItWorks')}>{howEl}</Expandable>}
        {example && (
          <div className="panel"><h2 className="section">{tk('workedExample')}</h2><div style={{ marginTop: 12 }}>{example}</div></div>
        )}
        {children}
        {pseudoEl && <Expandable calm={calm} open={isOpen('pseudocode')} onToggle={() => toggle('pseudocode')} label={tk('pseudocode')}>{pseudoEl}</Expandable>}
        {cppEl && <Expandable calm={calm} open={isOpen('cpp')} onToggle={() => toggle('cpp')} label={tk('inCpp')}>{cppEl}</Expandable>}
        {codeEl && <Expandable calm={calm} open={isOpen('code')} onToggle={() => toggle('code')} label={t({ en: 'In code', de: 'Im Code' })}>{codeEl}</Expandable>}
      </div>
      <div>
        {complexity.length > 0 && (
          <div className="panel"><h3 className="section">{tk('complexity')}</h3><ComplexityTable rows={complexity} /></div>
        )}
        {pitfalls.length > 0 && (
          <div className="panel">
            <h3 className="section">{tk('examTraps')}</h3>
            <ul className="prose" style={{ paddingLeft: 18, margin: 0 }}>
              {pitfalls.map((p, i) => <li key={i} dangerouslySetInnerHTML={{ __html: mathify(t(p)) }} />)}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

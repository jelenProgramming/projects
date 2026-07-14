import { useLang } from '../i18n.jsx'
import { useMode } from '../mode.jsx'
import { useExpanded } from '../expand.js'
import ComplexityTable from './ComplexityTable.jsx'
import DefCards from './DefCards.jsx'
import Expandable from './Expandable.jsx'
import { mathify } from './Math.jsx'

/**
 * AlgoDetail - explanatory section below an interactive visualizer. In cram mode
 * the verbose parts collapse to "Explain more" buttons (remembered per section).
 */
export default function AlgoDetail({ content }) {
  const { t, tk } = useLang()
  const { mode } = useMode()
  const calm = mode === 'calm'
  const { isOpen, toggle, resetAll, anyOpen } = useExpanded()
  if (!content) return null
  const { when, defs = [], how = [], paper = [], pseudocode, cpp, complexity = [], pitfalls = [] } = content

  const whenEl = when && (
    <div className="panel prose">
      <h2 className="section">{t({ en: 'When to use it', de: 'Wann man es einsetzt' })}</h2>
      <p style={{ marginTop: 10 }} dangerouslySetInnerHTML={{ __html: mathify(t(when)) }} />
    </div>
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

  return (
    <>
      {calm && anyOpen && (
        <button className="cram-reset" onClick={resetAll}>↺ {t({ en: 'Reset to condensed', de: 'Auf kompakt zuruecksetzen' })}</button>
      )}
      {defs.length > 0 && <DefCards defs={defs} />}
      {whenEl && <Expandable calm={calm} open={isOpen('when')} onToggle={() => toggle('when')} label={t({ en: 'when to use it', de: 'wann einsetzen' })}>{whenEl}</Expandable>}
      <div className="cols">
        <div>
          {howEl && <Expandable calm={calm} open={isOpen('how')} onToggle={() => toggle('how')} label={tk('howItWorks')}>{howEl}</Expandable>}
          {pseudoEl && <Expandable calm={calm} open={isOpen('pseudocode')} onToggle={() => toggle('pseudocode')} label={tk('pseudocode')}>{pseudoEl}</Expandable>}
          {cppEl && <Expandable calm={calm} open={isOpen('cpp')} onToggle={() => toggle('cpp')} label={tk('inCpp')}>{cppEl}</Expandable>}
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
    </>
  )
}

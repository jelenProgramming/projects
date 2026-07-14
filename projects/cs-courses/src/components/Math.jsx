import katex from 'katex'
import 'katex/dist/katex.min.css'

/**
 * KaTeX renderers. Math is opt-in per formula (manual, not auto-detected):
 * content marks a string as math by passing it here or by using a { tex } value.
 *
 *   <M>{'O(n \\log n)'}</M>           inline math, flows with text
 *   <BlockMath>{'\\sum_{i=1}^{n} i'}</BlockMath>   centered display block
 *   renderTex(str, {display})         -> HTML string, for dangerouslySetInnerHTML
 *
 * throwOnError:false means a bad formula renders as red source text instead of
 * blanking the page - safe to ship.
 */
const OPTS = { throwOnError: false, strict: false, output: 'htmlAndMathml' }

export function renderTex(tex, { display = false } = {}) {
  if (tex == null) return ''
  try {
    return katex.renderToString(String(tex), { ...OPTS, displayMode: display })
  } catch {
    return String(tex)
  }
}

// replace $...$ (inline) and $$...$$ (display) delimiters inside an HTML string
// with rendered KaTeX, so prose (tldr, definitions, notes) can carry typeset math
export function mathify(html) {
  if (typeof html !== 'string' || !html.includes('$')) return html
  return html
    .replace(/\$\$([^$]+)\$\$/g, (_, tex) => renderTex(tex, { display: true }))
    .replace(/\$([^$]+)\$/g, (_, tex) => renderTex(tex, { display: false }))
}

export function M({ children, display = false }) {
  return <span className={display ? 'katex-block' : 'katex-inline'}
    dangerouslySetInnerHTML={{ __html: renderTex(children, { display }) }} />
}

export function BlockMath({ children }) {
  return <div className="katex-block"
    dangerouslySetInnerHTML={{ __html: renderTex(children, { display: true }) }} />
}

export default M

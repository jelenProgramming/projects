import { useState, useMemo, useRef, useEffect } from 'react'
import { usePlayer } from '../../engine/usePlayer.js'
import PlayerControls from '../../components/PlayerControls.jsx'
import StatusBar from '../../components/StatusBar.jsx'
import MatrixPanel from './MatrixPanel.jsx'
import GraphEditor from './GraphEditor.jsx'
import { useLang } from '../../i18n.jsx'
import { SAMPLE, randomGraph, buildMatrix, NODE_LABELS as L, INF, fmt, lbl } from './graphData.js'
import { GRAPH_ALGOS } from './graphAlgos.js'

/**
 * Animated graph visualizer, shared by BFS/DFS/Dijkstra/Floyd-Warshall/Prim/Kruskal.
 * The graph is editable (form editor) and randomizable. On every graph change an
 * intro animation plays: nodes zoom in from a dot, each edge draws from a random
 * endpoint, then everything freezes and the algorithm animation runs on top.
 */
export default function GraphViz({ slug }) {
  const { t, tk } = useLang()
  const algo = GRAPH_ALGOS[slug]
  const [graph, setGraph] = useState(SAMPLE)
  const [editing, setEditing] = useState(false)
  const [introKey, setIntroKey] = useState(0)
  const C = useMemo(() => buildMatrix(graph), [graph])
  const steps = useMemo(() => (algo ? algo(C, 0) : []), [algo, C])
  const player = usePlayer(steps, { speed: 1.2 })
  const step = player.step

  const changeGraph = (g) => { setGraph(g); setIntroKey((k) => k + 1) }

  const nodeState = (id) => {
    if (step.current === id) return 'current'
    if (step.done && step.done.has && step.done.has(id)) return 'done'
    if (step.inTree && step.inTree.has(id)) return 'intree'
    if (step.visited && step.visited.has(id)) return 'visited'
    if (step.frontier && step.frontier.has(id)) return 'frontier'
    if (id === 0 && (slug === 'dijkstra' || slug === 'bfs' || slug === 'dfs' || slug === 'prim')) return 'start'
    return ''
  }

  const treeEdges = step.treeEdges || []
  const isTreeEdge = (u, v) => treeEdges.some(([a, b]) => (a === u && b === v) || (a === v && b === u))
  const activeEdge = step.edge
  const isActive = (u, v) => activeEdge && ((activeEdge[0] === u && activeEdge[1] === v) || (activeEdge[0] === v && activeEdge[1] === u))

  const showArrays = step.dist !== undefined
  const showMatrices = step.D !== undefined
  const showSortedEdges = step.sortedEdges !== undefined

  return (
    <div>
      {editing && <GraphEditor graph={graph} onChange={changeGraph} />}
      <div className="panel">
        <div className="controls" style={{ marginBottom: 12 }}>
          <button className={'btn' + (editing ? ' primary' : '')} onClick={() => setEditing((e) => !e)}>
            ✎ {editing ? t({ en: 'Done editing', de: 'Bearbeitung fertig' }) : tk('editGraph')}
          </button>
          <button className="btn" onClick={() => { changeGraph(randomGraph(6)); setEditing(false) }}>⟳ {tk('newGraph')}</button>
          <button className="btn ghost" onClick={() => { changeGraph(SAMPLE); setEditing(false) }}>{tk('resetGraph')}</button>
        </div>
        <div className="viz-stage" style={{ alignItems: 'center', minHeight: 380 }}>
          <GraphSVG graph={graph} nodeState={nodeState} isTreeEdge={isTreeEdge} isActive={isActive}
            stepKey={player.index} activeEdge={activeEdge} introKey={introKey} />
        </div>
        <StatusBar player={player} />
        <PlayerControls player={player} />

        <div className="legend">
          <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--compare)' }} /> {t({ en: 'Current / examining', de: 'Aktuell / wird geprueft' })}</span>
          {(slug === 'bfs' || slug === 'dfs') && <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--visit)' }} /> {tk('visited')}</span>}
          {(slug === 'bfs' || slug === 'dfs') && <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--frontier)' }} /> {t({ en: 'In queue / stack', de: 'In Warteschlange / Stapel' })}</span>}
          {slug === 'dijkstra' && <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--done)' }} /> {t({ en: 'Finalized', de: 'Finalisiert' })}</span>}
          {(slug === 'prim' || slug === 'kruskal') && <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--done)' }} /> {t({ en: 'In the MST', de: 'Im MST' })}</span>}
        </div>
      </div>

      {showArrays && (
        <div className="panel">
          <h3 className="section">{t({ en: 'The arrays you trace on an exam', de: 'Die Arrays, die du in der Pruefung nachtraegst' })}</h3>
          <ArrayPanel label={tk('distanceArray')} values={step.dist.map(fmt)} changed={step.changedArr} probe={step.probe} done={step.done} />
          <div style={{ height: 10 }} />
          <ArrayPanel label={tk('predecessorArray')} values={step.pred.map(lbl)} changed={step.changedArr} probe={step.probe} done={step.done} />
          <div className="note" style={{ marginTop: 14 }}>
            {t({ en: 'Watch dist[] drop from infinity to a number the instant an edge relaxes - that is the whole algorithm.', de: 'Beobachte, wie dist[] in dem Moment von unendlich auf eine Zahl faellt, in dem eine Kante relaxiert wird.' })}
          </div>
        </div>
      )}

      {showMatrices && (
        <div className="panel">
          <h3 className="section">{t({ en: 'The two matrices - both update together', de: 'Die zwei Matrizen - beide aktualisieren sich gemeinsam' })}</h3>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            <MatrixPanel title={tk('distMatrix')} M={step.D} hlRow={step.k} hlCol={step.k} changed={step.changed} />
            <MatrixPanel title={tk('predMatrix')} M={step.P} hlRow={step.k} hlCol={step.k} changed={step.changed} isPred />
          </div>
          <div className="note" style={{ marginTop: 14 }}>
            {t({ en: 'The highlighted row and column are the current intermediate node k. A cell can only change using values from row k and column k.', de: 'Die hervorgehobene Zeile und Spalte sind der aktuelle Zwischenknoten k. Eine Zelle kann sich nur mit Werten aus Zeile k und Spalte k aendern.' })}
          </div>
        </div>
      )}

      {showSortedEdges && (
        <div className="panel">
          <h3 className="section">{t({ en: 'Edges sorted by weight', de: 'Kanten nach Gewicht sortiert' })}</h3>
          <div className="sorted-edge-list">
            {step.sortedEdges.map(([u, v, w], idx) => {
              const used = (step.treeEdges || []).some(([a, b]) => (a === u && b === v) || (a === v && b === u))
              const cur = idx === step.considering
              return <span key={idx} className={'se' + (cur ? ' cur' : used ? ' used' : '')}>{L[u]}-{L[v]} ({w})</span>
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ---- SVG renderer with intro + growing-line animation ----
function GraphSVG({ graph, nodeState, isTreeEdge, isActive, stepKey, activeEdge, introKey }) {
  const byId = (id) => graph.nodes.find((n) => n.id === id)
  const [introStage, setIntroStage] = useState('done')
  useEffect(() => {
    if (introKey === 0) return
    setIntroStage('nodes')
    const t1 = setTimeout(() => setIntroStage('edges'), 140 + graph.nodes.length * 70)
    const t2 = setTimeout(() => setIntroStage('done'), 140 + graph.nodes.length * 70 + 650)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [introKey])
  const drawDir = useMemo(() => graph.edges.map(() => Math.random() < 0.5), [introKey])
  const showEdges = introStage !== 'nodes'
  const R = 22 // node radius - roomy enough for the number inside

  return (
    <svg viewBox="0 0 560 380" className="graph-svg" style={{ maxWidth: 560 }}>
      {graph.edges.map(([u, v, w], i) => {
        const a = byId(u), b = byId(v)
        if (!a || !b) return null
        const tree = isTreeEdge(u, v)
        const active = isActive(u, v)
        const cls = 'g-edge' + (tree ? ' tree' : active ? ' active' : activeEdge ? ' dim' : '') + (showEdges ? '' : ' intro-hidden')
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
        const from = drawDir[i] ? a : b, to = drawDir[i] ? b : a
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={cls} />
            {introStage === 'edges' && <GrowingLine key={'intro' + introKey + '-' + i} a={from} b={to} color="var(--border)" dur="0.45s" />}
            {active && introStage === 'done' && <GrowingLine key={stepKey} a={a} b={b} color="var(--compare)" dur="0.5s" />}
            <text x={mx} y={my} className={'g-edge-label' + (active ? ' active' : '') + (showEdges ? '' : ' intro-hidden')} dy={-4}>{w}</text>
          </g>
        )
      })}
      {graph.nodes.map((n, idx) => (
        <g key={n.id} className={'g-node ' + nodeState(n.id) + (introStage === 'nodes' ? ' intro-pop' : '')}
          style={introStage === 'nodes' ? { animationDelay: (idx * 70) + 'ms' } : undefined}
          transform={`translate(${n.x},${n.y})`}>
          <circle r={R} fill="var(--panel)" />
          <text textAnchor="middle" dominantBaseline="central">{L[n.id]}</text>
        </g>
      ))}
    </svg>
  )
}

/** A line that draws itself from a to b via stroke-dashoffset. */
function GrowingLine({ a, b, color = 'var(--compare)', dur = '0.5s' }) {
  const ref = useRef(null)
  const len = Math.hypot(b.x - a.x, b.y - a.y)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'none'
    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = `${len}`
    void el.getBoundingClientRect()
    requestAnimationFrame(() => {
      el.style.transition = `stroke-dashoffset ${dur} ease-out`
      el.style.strokeDashoffset = '0'
    })
  }, [len, color, dur])
  return <line ref={ref} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="g-edge-grow" stroke={color} />
}

function ArrayPanel({ label, values, changed, probe, done }) {
  return (
    <div>
      <div className="field-label">{label}</div>
      <div className="array-row">
        {values.map((val, i) => {
          let cls = 'array-cell'
          if (i === changed) cls += ' changed'
          else if (i === probe) cls += ' probe'
          if (done && done.has && done.has(i)) cls += ' done'
          return (
            <div key={i} className={cls}>
              <span className="ac-idx">{L[i]}</span>
              {val}
            </div>
          )
        })}
      </div>
    </div>
  )
}

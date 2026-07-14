import { neighbors, INF, lbl, NODE_LABELS as L } from './graphData.js'

/**
 * Graph algorithm step-generators. Each step snapshot may carry:
 *   visited:Set, frontier:Set, current, edge:[u,v], treeEdges:[[u,v]...]
 *   dist:[], pred:[]          (Dijkstra / Bellman-style)
 *   D:[[...]], P:[[...]], k,i,j, changed:[i,j]   (Floyd-Warshall matrices)
 *   message:{en,de}
 * The component reads these to color the graph + render the matrix/array panels.
 */

const arr = (a) => a.slice()
const mat = (m) => m.map((r) => r.slice())

// ----------------------------- BFS -----------------------------
export function bfs(C, start = 0) {
  const n = C.length
  const steps = []
  const visited = new Set()
  const order = []
  const queue = [start]
  const pred = new Array(n).fill(-1)
  steps.push({ visited: new Set(), frontier: new Set(queue), current: null, pred: arr(pred), order: [],
    message: { en: `Start BFS at ${L[start]}. Put it in the queue. BFS explores level by level.`, de: `BFS bei ${L[start]} starten. In die Warteschlange. BFS erkundet Ebene für Ebene.` } })
  while (queue.length) {
    const u = queue.shift()
    if (visited.has(u)) continue
    visited.add(u); order.push(u)
    steps.push({ visited: new Set(visited), frontier: new Set(queue), current: u, pred: arr(pred), order: arr(order),
      message: { en: `Dequeue ${L[u]} and mark it visited.`, de: `${L[u]} aus der Warteschlange nehmen und als besucht markieren.` } })
    for (const { v } of neighbors(C, u)) {
      if (!visited.has(v) && !queue.includes(v)) {
        queue.push(v); pred[v] = u
        steps.push({ visited: new Set(visited), frontier: new Set(queue), current: u, edge: [u, v], pred: arr(pred), order: arr(order),
          message: { en: `${L[v]} is unvisited - enqueue it (predecessor = ${L[u]}).`, de: `${L[v]} ist unbesucht - einreihen (Vorgänger = ${L[u]}).` } })
      }
    }
  }
  steps.push({ visited: new Set(visited), frontier: new Set(), current: null, pred: arr(pred), order: arr(order),
    message: { en: `Done. Visit order: ${order.map((i) => L[i]).join(' → ')}.`, de: `Fertig. Besuchsreihenfolge: ${order.map((i) => L[i]).join(' → ')}.` } })
  return steps
}

// ----------------------------- DFS -----------------------------
export function dfs(C, start = 0) {
  const n = C.length
  const steps = []
  const visited = new Set()
  const order = []
  const pred = new Array(n).fill(-1)
  steps.push({ visited: new Set(), frontier: new Set([start]), current: null, pred: arr(pred), order: [],
    message: { en: `Start DFS at ${L[start]}. DFS goes as deep as possible before backtracking.`, de: `DFS bei ${L[start]} starten. DFS geht so tief wie möglich, bevor es zurückgeht.` } })
  function visit(u) {
    visited.add(u); order.push(u)
    steps.push({ visited: new Set(visited), frontier: new Set(), current: u, pred: arr(pred), order: arr(order),
      message: { en: `Visit ${L[u]}. Recurse into its first unvisited neighbor.`, de: `${L[u]} besuchen. In den ersten unbesuchten Nachbarn rekursieren.` } })
    for (const { v } of neighbors(C, u)) {
      if (!visited.has(v)) {
        pred[v] = u
        steps.push({ visited: new Set(visited), frontier: new Set(), current: u, edge: [u, v], pred: arr(pred), order: arr(order),
          message: { en: `Go deeper: ${L[u]} → ${L[v]}.`, de: `Tiefer gehen: ${L[u]} → ${L[v]}.` } })
        visit(v)
        steps.push({ visited: new Set(visited), frontier: new Set(), current: u, pred: arr(pred), order: arr(order),
          message: { en: `Backtrack to ${L[u]}.`, de: `Zurück zu ${L[u]}.` } })
      }
    }
  }
  visit(start)
  steps.push({ visited: new Set(visited), frontier: new Set(), current: null, pred: arr(pred), order: arr(order),
    message: { en: `Done. Visit order: ${order.map((i) => L[i]).join(' → ')}.`, de: `Fertig. Besuchsreihenfolge: ${order.map((i) => L[i]).join(' → ')}.` } })
  return steps
}

// --------------------------- Dijkstra ---------------------------
// Shows dist[] and pred[] updating, with the relaxed edge highlighted.
export function dijkstra(C, start = 0) {
  const n = C.length
  const steps = []
  const dist = new Array(n).fill(INF)
  const pred = new Array(n).fill(-1)
  const done = new Set()
  dist[start] = 0
  steps.push({ dist: arr(dist), pred: arr(pred), done: new Set(), current: null,
    message: { en: `Initialize: dist[${L[start]}]=0, everything else ∞. dist[] holds the best known distance from ${L[start]}.`, de: `Initialisieren: dist[${L[start]}]=0, alles andere ∞. dist[] enthält die beste bekannte Distanz von ${L[start]}.` } })

  for (let iter = 0; iter < n; iter++) {
    // pick unfinished node with smallest dist
    let u = -1, best = INF
    for (let i = 0; i < n; i++) if (!done.has(i) && dist[i] < best) { best = dist[i]; u = i }
    if (u === -1) break
    done.add(u)
    steps.push({ dist: arr(dist), pred: arr(pred), done: new Set(done), current: u,
      message: { en: `Pick the unfinished node with the smallest dist: ${L[u]} (dist=${dist[u]}). Finalize it - its distance can't improve.`, de: `Wähle den unfertigen Knoten mit kleinster dist: ${L[u]} (dist=${dist[u]}). Finalisieren - seine Distanz kann sich nicht mehr verbessern.` } })
    for (const { v, w } of neighbors(C, u)) {
      if (done.has(v)) continue
      const cand = dist[u] + w
      const relax = cand < dist[v]
      steps.push({ dist: arr(dist), pred: arr(pred), done: new Set(done), current: u, edge: [u, v], probe: v,
        message: relax
          ? { en: `Relax edge ${L[u]}→${L[v]} (w=${w}): dist[${L[u]}]+${w} = ${cand} &lt; dist[${L[v]}]=${dist[v] === INF ? '∞' : dist[v]}. Update!`, de: `Kante ${L[u]}→${L[v]} (w=${w}) relaxieren: dist[${L[u]}]+${w} = ${cand} &lt; dist[${L[v]}]=${dist[v] === INF ? '∞' : dist[v]}. Aktualisieren!` }
          : { en: `Check edge ${L[u]}→${L[v]} (w=${w}): ${cand} ≥ dist[${L[v]}]=${dist[v] === INF ? '∞' : dist[v]}. No improvement.`, de: `Kante ${L[u]}→${L[v]} (w=${w}) prüfen: ${cand} ≥ dist[${L[v]}]=${dist[v] === INF ? '∞' : dist[v]}. Keine Verbesserung.` } })
      if (relax) {
        dist[v] = cand; pred[v] = u
        steps.push({ dist: arr(dist), pred: arr(pred), done: new Set(done), current: u, edge: [u, v], changedArr: v,
          message: { en: `dist[${L[v]}] = ${cand}, pred[${L[v]}] = ${L[u]}.`, de: `dist[${L[v]}] = ${cand}, pred[${L[v]}] = ${L[u]}.` } })
      }
    }
  }
  steps.push({ dist: arr(dist), pred: arr(pred), done: new Set(done), current: null, final: true,
    message: { en: `Done. dist[] now holds the shortest distance from ${L[start]} to every node; pred[] reconstructs the paths.`, de: `Fertig. dist[] enthält die kürzeste Distanz von ${L[start]} zu jedem Knoten; pred[] rekonstruiert die Pfade.` } })
  return steps
}

// ------------------------- Floyd-Warshall -------------------------
// The two-matrix classic: D (distances) and P (predecessors) both evolve.
export function floydWarshall(C) {
  const n = C.length
  const steps = []
  const D = mat(C).map((row, i) => row.map((w, j) => (i === j ? 0 : w === 0 ? INF : w)))
  const P = Array.from({ length: n }, (_, i) => C[i].map((w, j) => (w !== 0 && i !== j ? i : null)))
  steps.push({ D: mat(D), P: mat(P), k: -1,
    message: { en: 'Initialize D from the weight matrix (∞ where no edge, 0 on the diagonal). P[i][j] = i where an edge exists. We will allow paths through one more intermediate node each round.', de: 'D aus der Gewichtsmatrix initialisieren (∞ ohne Kante, 0 auf der Diagonale). P[i][j] = i, wo eine Kante existiert. Pro Runde erlauben wir einen weiteren Zwischenknoten.' } })

  for (let k = 0; k < n; k++) {
    steps.push({ D: mat(D), P: mat(P), k,
      message: { en: `Round k = ${L[k]}: can any path get shorter by going through ${L[k]}? Check every pair (i, j).`, de: `Runde k = ${L[k]}: Wird ein Pfad kürzer über ${L[k]}? Prüfe jedes Paar (i, j).` } })
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue
        const through = D[i][k] + D[k][j]
        if (D[i][k] !== INF && D[k][j] !== INF && through < D[i][j]) {
          const oldv = D[i][j]
          D[i][j] = through; P[i][j] = P[k][j]
          steps.push({ D: mat(D), P: mat(P), k, i, j, changed: [i, j], usedK: true,
            message: { en: `D[${L[i]}][${L[j]}]: ${oldv === INF ? '∞' : oldv} → ${through}  (via ${L[k]}: D[${L[i]}][${L[k]}]=${D[i][k]} + D[${L[k]}][${L[j]}]=${D[k][j]}). Set P[${L[i]}][${L[j]}] = ${lbl(P[i][j])}.`, de: `D[${L[i]}][${L[j]}]: ${oldv === INF ? '∞' : oldv} → ${through}  (über ${L[k]}: D[${L[i]}][${L[k]}]=${D[i][k]} + D[${L[k]}][${L[j]}]=${D[k][j]}). Setze P[${L[i]}][${L[j]}] = ${lbl(P[i][j])}.` } })
        }
      }
    }
  }
  steps.push({ D: mat(D), P: mat(P), k: n, final: true,
    message: { en: 'Done. D[i][j] is the shortest distance between every pair; P[i][j] lets you reconstruct the actual path.', de: 'Fertig. D[i][j] ist die kürzeste Distanz zwischen jedem Paar; P[i][j] rekonstruiert den tatsächlichen Pfad.' } })
  return steps
}

// ---------------------------- Prim ----------------------------
export function prim(C, start = 0) {
  const n = C.length
  const steps = []
  const inTree = new Set([start])
  const treeEdges = []
  steps.push({ inTree: new Set(inTree), treeEdges: [], current: start,
    message: { en: `Prim's MST: start the tree at ${L[start]}. Repeatedly add the cheapest edge that grows the tree.`, de: `Prims MST: Baum bei ${L[start]} beginnen. Wiederholt die billigste Kante hinzufügen, die den Baum erweitert.` } })
  while (inTree.size < n) {
    let best = null
    for (const u of inTree) for (const { v, w } of neighbors(C, u)) if (!inTree.has(v)) if (!best || w < best.w) best = { u, v, w }
    if (!best) break
    steps.push({ inTree: new Set(inTree), treeEdges: treeEdges.slice(), edge: [best.u, best.v],
      message: { en: `Cheapest edge leaving the tree: ${L[best.u]}-${L[best.v]} (w=${best.w}). Add it.`, de: `Billigste Kante aus dem Baum: ${L[best.u]}-${L[best.v]} (w=${best.w}). Hinzufügen.` } })
    inTree.add(best.v); treeEdges.push([best.u, best.v])
  }
  const total = treeEdges.reduce((s, [u, v]) => s + C[u][v], 0)
  steps.push({ inTree: new Set(inTree), treeEdges: treeEdges.slice(), done: true,
    message: { en: `MST complete. Total weight = ${total}.`, de: `MST fertig. Gesamtgewicht = ${total}.` } })
  return steps
}

// --------------------------- Kruskal ---------------------------
export function kruskal(C) {
  const n = C.length
  const steps = []
  const edges = []
  for (let u = 0; u < n; u++) for (let v = u + 1; v < n; v++) if (C[u][v] !== 0) edges.push([u, v, C[u][v]])
  edges.sort((a, b) => a[2] - b[2])
  const parent = Array.from({ length: n }, (_, i) => i)
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])))
  const treeEdges = []
  steps.push({ treeEdges: [], sortedEdges: edges.map((e) => e.slice()), considering: -1,
    message: { en: `Kruskal's MST: sort all edges by weight, then add each edge unless it would form a cycle (union-find).`, de: `Kruskals MST: alle Kanten nach Gewicht sortieren, dann jede Kante hinzufügen, außer sie bildet einen Zyklus (Union-Find).` } })
  edges.forEach(([u, v, w], idx) => {
    const ru = find(u), rv = find(v)
    const cycle = ru === rv
    steps.push({ treeEdges: treeEdges.slice(), sortedEdges: edges.map((e) => e.slice()), considering: idx, edge: [u, v],
      message: cycle
        ? { en: `${L[u]}-${L[v]} (w=${w}): both already connected - skip, it would make a cycle.`, de: `${L[u]}-${L[v]} (w=${w}): bereits verbunden - überspringen, würde Zyklus bilden.` }
        : { en: `${L[u]}-${L[v]} (w=${w}): different components - add it.`, de: `${L[u]}-${L[v]} (w=${w}): verschiedene Komponenten - hinzufügen.` } })
    if (!cycle) { parent[ru] = rv; treeEdges.push([u, v]) }
  })
  const total = treeEdges.reduce((s, [u, v]) => s + C[u][v], 0)
  steps.push({ treeEdges: treeEdges.slice(), sortedEdges: edges.map((e) => e.slice()), considering: -1, done: true,
    message: { en: `MST complete. Total weight = ${total}.`, de: `MST fertig. Gesamtgewicht = ${total}.` } })
  return steps
}

export const GRAPH_ALGOS = { bfs, dfs, dijkstra, 'floyd-warshall': floydWarshall, prim, kruskal }

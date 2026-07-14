/**
 * Sample graphs for the graph algorithms. Nodes have screen positions (for the
 * SVG layout); edges carry weights. We derive the adjacency/weight matrix from
 * the edge list so the matrix view and the graph view always agree.
 *
 * 0 in the matrix means "no edge" (matching the student's C++ convention where
 * C[u][v] == 0 means no connection).
 */

export const NODE_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

// A small weighted, connected graph laid out roughly in a circle/grid.
export const SAMPLE = {
  nodes: [
    { id: 0, x: 120, y: 70 },
    { id: 1, x: 320, y: 50 },
    { id: 2, x: 470, y: 140 },
    { id: 3, x: 410, y: 300 },
    { id: 4, x: 220, y: 320 },
    { id: 5, x: 80, y: 220 },
    { id: 6, x: 300, y: 185 },
  ],
  // [u, v, weight] - undirected
  edges: [
    [0, 1, 7], [0, 5, 5], [0, 6, 9],
    [1, 2, 8], [1, 6, 4],
    [2, 3, 6], [2, 6, 2],
    [3, 4, 5], [3, 6, 11],
    [4, 5, 6], [4, 6, 10],
    [5, 6, 3],
  ],
}

export function buildMatrix(graph, { directed = false } = {}) {
  const n = graph.nodes.length
  const C = Array.from({ length: n }, () => new Array(n).fill(0))
  for (const [u, v, w] of graph.edges) {
    C[u][v] = w
    if (!directed) C[v][u] = w
  }
  return C
}

export function neighbors(C, u) {
  const out = []
  for (let v = 0; v < C.length; v++) if (C[u][v] !== 0) out.push({ v, w: C[u][v] })
  return out
}


// Generate a random connected weighted graph with n nodes on a circle layout.
// Guarantees connectivity by first linking a spanning path, then adding extra
// random edges. Weights 1..9. Same {nodes,edges} shape as SAMPLE.
export function randomGraph(n = 6) {
  const cx = 280, cy = 185, r = 140
  const nodes = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2
    return { id: i, x: Math.round(cx + r * Math.cos(a)), y: Math.round(cy + r * Math.sin(a)) }
  })
  const w = () => 1 + Math.floor(Math.random() * 9)
  const seen = new Set()
  const key = (u, v) => (u < v ? u + '-' + v : v + '-' + u)
  const edges = []
  // spanning path so the graph is always connected
  const order = [...Array(n).keys()]
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[order[i], order[j]] = [order[j], order[i]] }
  for (let i = 1; i < n; i++) { const u = order[i - 1], v = order[i]; edges.push([u, v, w()]); seen.add(key(u, v)) }
  // a few extra random edges
  const extra = Math.max(2, Math.floor(n * 0.6))
  let tries = 0
  while (edges.length < n - 1 + extra && tries < 60) {
    const u = Math.floor(Math.random() * n), v = Math.floor(Math.random() * n)
    if (u !== v && !seen.has(key(u, v))) { edges.push([u, v, w()]); seen.add(key(u, v)) }
    tries++
  }
  return { nodes, edges }
}

export const INF = Infinity
export const fmt = (x) => (x === INF ? '∞' : x === null ? '-' : String(x))
export const lbl = (i) => (i == null || i < 0 ? '-' : NODE_LABELS[i])

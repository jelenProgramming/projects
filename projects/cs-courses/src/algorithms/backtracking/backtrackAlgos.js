/**
 * Backtracking step-generators: N-Queens, graph coloring, Sudoku.
 * Steps carry the board/assignment state + a flag for place / conflict / backtrack.
 */

// ---- N-Queens ---- board is an array col-per-row; -1 = empty
export function nQueens(n = 6) {
  const steps = []
  const pos = new Array(n).fill(-1)
  const snap = (extra, message) => steps.push({ n, pos: pos.slice(), ...extra, message })
  snap({}, { en: `Place ${n} queens so none attack another. Try column by column; backtrack on conflict.`, de: `Setze ${n} Damen, sodass keine eine andere bedroht. Spalte fuer Spalte; bei Konflikt zurueck.` })

  function safe(row, col) {
    for (let r = 0; r < row; r++) {
      if (pos[r] === col) return false
      if (Math.abs(pos[r] - col) === row - r) return false
    }
    return true
  }
  function solve(row) {
    if (row === n) { snap({ solved: true }, { en: 'All queens placed safely - solution found!', de: 'Alle Damen sicher gesetzt - Loesung gefunden!' }); return true }
    for (let col = 0; col < n; col++) {
      snap({ trying: [row, col] }, { en: `Try a queen at row ${row}, column ${col}.`, de: `Dame bei Zeile ${row}, Spalte ${col} versuchen.` })
      if (safe(row, col)) {
        pos[row] = col
        snap({ placed: [row, col] }, { en: `Safe - place it and move to row ${row + 1}.`, de: `Sicher - setzen und zu Zeile ${row + 1}.` })
        if (solve(row + 1)) return true
        snap({ removing: [row, col] }, { en: `Dead end below - backtrack, remove queen from row ${row}.`, de: `Sackgasse darunter - zurueck, Dame aus Zeile ${row} entfernen.` })
        pos[row] = -1
      } else {
        snap({ conflict: [row, col] }, { en: `Conflict with an existing queen - skip.`, de: `Konflikt mit vorhandener Dame - ueberspringen.` })
      }
    }
    return false
  }
  solve(0)
  return steps
}

// ---- Graph coloring ---- color a fixed small graph with k colors
const COLOR_GRAPH = {
  nodes: [{ id: 0, x: 300, y: 50 }, { id: 1, x: 480, y: 160 }, { id: 2, x: 410, y: 330 }, { id: 3, x: 190, y: 330 }, { id: 4, x: 120, y: 160 }],
  edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 3]],
}
export function graphColoring(k = 3) {
  const steps = []
  const g = COLOR_GRAPH
  const n = g.nodes.length
  const color = new Array(n).fill(0) // 0 = uncolored
  const adj = Array.from({ length: n }, () => [])
  for (const [u, v] of g.edges) { adj[u].push(v); adj[v].push(u) }
  const snap = (extra, message) => steps.push({ graph: g, color: color.slice(), k, ...extra, message })
  snap({}, { en: `Color every node using at most ${k} colors so that no two connected nodes share a color.`, de: `Faerbe jeden Knoten mit hoechstens ${k} Farben, sodass keine zwei verbundenen Knoten dieselbe Farbe haben.` })

  function ok(node, c) { return adj[node].every((nb) => color[nb] !== c) }
  function solve(node) {
    if (node === n) { snap({ solved: true }, { en: 'Every node colored with no conflicts - solution found!', de: 'Jeder Knoten konfliktfrei gefaerbt - Loesung gefunden!' }); return true }
    for (let c = 1; c <= k; c++) {
      snap({ trying: node, tryColor: c }, { en: `Try color ${c} on node ${node}.`, de: `Farbe ${c} an Knoten ${node} versuchen.` })
      if (ok(node, c)) {
        color[node] = c
        snap({ placed: node }, { en: `No neighbor uses color ${c} - assign it.`, de: `Kein Nachbar nutzt Farbe ${c} - zuweisen.` })
        if (solve(node + 1)) return true
        snap({ removing: node }, { en: `Backtrack - uncolor node ${node}.`, de: `Zurueck - Knoten ${node} entfaerben.` })
        color[node] = 0
      } else {
        snap({ conflict: node, tryColor: c }, { en: `A neighbor already uses color ${c} - skip.`, de: `Ein Nachbar nutzt Farbe ${c} - ueberspringen.` })
      }
    }
    return false
  }
  solve(0)
  return steps
}

// ---- Sudoku ---- solve a small puzzle (uses a fixed easy board)
const PUZZLE = [
  [5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9],
]
export function sudoku() {
  const steps = []
  const b = PUZZLE.map((r) => r.slice())
  const given = PUZZLE.map((r) => r.map((v) => v !== 0))
  let count = 0
  const snap = (extra, message) => { if (count++ > 1400) return; steps.push({ board: b.map((r) => r.slice()), given, ...extra, message }) }
  snap({}, { en: 'Fill the grid so every row, column and 3x3 box has 1-9. Try a digit, backtrack if it leads nowhere.', de: 'Fuelle das Gitter, sodass jede Zeile, Spalte und 3x3-Box 1-9 enthaelt. Ziffer versuchen, bei Sackgasse zurueck.' })
  function ok(r, c, v) {
    for (let i = 0; i < 9; i++) { if (b[r][i] === v || b[i][c] === v) return false }
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (b[br + i][bc + j] === v) return false
    return true
  }
  function solve() {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (b[r][c] === 0) {
        for (let v = 1; v <= 9; v++) {
          if (ok(r, c, v)) {
            b[r][c] = v
            snap({ active: [r, c], place: v }, { en: `Place ${v} at (${r + 1},${c + 1}).`, de: `${v} bei (${r + 1},${c + 1}) setzen.` })
            if (solve()) return true
            b[r][c] = 0
            snap({ active: [r, c], backtrack: true }, { en: `Backtrack at (${r + 1},${c + 1}).`, de: `Zurueck bei (${r + 1},${c + 1}).` })
          }
        }
        return false
      }
    }
    snap({ solved: true }, { en: 'Solved!', de: 'Geloest!' })
    return true
  }
  solve()
  return steps
}

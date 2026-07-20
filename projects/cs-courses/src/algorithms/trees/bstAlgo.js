/**
 * BST step-generator. Builds a tree by inserting values, then optionally runs a
 * search. Each step carries the full node layout (so the SVG can draw it) plus
 * which node is being compared / inserted / found.
 *
 * Layout: an in-order traversal assigns x positions; depth gives y. This keeps
 * the drawing tidy without a heavy layout library.
 */

function makeNode(key) { return { key, left: null, right: null } }

function layout(root) {
  // assign x by in-order index, y by depth
  const nodes = []
  let idx = 0
  function walk(n, depth) {
    if (!n) return
    walk(n.left, depth + 1)
    n._x = idx++; n._y = depth
    nodes.push(n)
    walk(n.right, depth + 1)
  }
  walk(root, 0)
  return nodes
}

function snapshot(root, extra, message) {
  // deep-ish clone of structure with positions for rendering
  const nodes = layout(root)
  const maxX = Math.max(1, nodes.length - 1)
  const maxY = Math.max(1, ...nodes.map((n) => n._y))
  const render = nodes.map((n) => ({
    key: n.key,
    x: nodes.length === 1 ? 0.5 : n._x / maxX,
    y: n._y,
    leftKey: n.left ? n.left.key : null,
    rightKey: n.right ? n.right.key : null,
  }))
  return { nodes: render, maxY, ...extra, message }
}

export function buildBST(values, search) {
  const steps = []
  let root = null

  function insert(key) {
    if (!root) { root = makeNode(key); steps.push(snapshot(root, { active: key }, { en: `Tree is empty: ${key} becomes the root.`, de: `Baum ist leer: ${key} wird die Wurzel.` })); return }
    let cur = root
    while (true) {
      steps.push(snapshot(root, { active: cur.key, inserting: key }, { en: `Compare ${key} with ${cur.key}.`, de: `Vergleiche ${key} mit ${cur.key}.` }))
      if (key === cur.key) { steps.push(snapshot(root, { active: cur.key }, { en: `${key} already exists - skip (no duplicates).`, de: `${key} existiert bereits - ueberspringen (keine Duplikate).` })); return }
      if (key < cur.key) {
        if (!cur.left) { cur.left = makeNode(key); steps.push(snapshot(root, { active: key }, { en: `${key} < ${cur.key} and left is empty: insert ${key} on the left.`, de: `${key} < ${cur.key} und links ist frei: ${key} links einfuegen.` })); return }
        steps.push(snapshot(root, { active: cur.key, inserting: key }, { en: `${key} < ${cur.key}: go left.`, de: `${key} < ${cur.key}: nach links.` }))
        cur = cur.left
      } else {
        if (!cur.right) { cur.right = makeNode(key); steps.push(snapshot(root, { active: key }, { en: `${key} > ${cur.key} and right is empty: insert ${key} on the right.`, de: `${key} > ${cur.key} und rechts ist frei: ${key} rechts einfuegen.` })); return }
        steps.push(snapshot(root, { active: cur.key, inserting: key }, { en: `${key} > ${cur.key}: go right.`, de: `${key} > ${cur.key}: nach rechts.` }))
        cur = cur.right
      }
    }
  }

  steps.push({ nodes: [], maxY: 1, message: { en: 'Start with an empty binary search tree. Left child < parent < right child, always.', de: 'Beginne mit einem leeren binären Suchbaum. Linkes Kind < Elter < rechtes Kind, immer.' } })
  for (const val of values) insert(val)
  steps.push(snapshot(root, {}, { en: 'Tree built. Now search for a value.', de: 'Baum gebaut. Jetzt einen Wert suchen.' }))

  if (search !== undefined && search !== null) {
    let cur = root
    while (cur) {
      steps.push(snapshot(root, { active: cur.key, searching: search }, { en: `Searching ${search}: compare with ${cur.key}.`, de: `Suche ${search}: vergleiche mit ${cur.key}.` }))
      if (search === cur.key) { steps.push(snapshot(root, { found: cur.key }, { en: `Found ${search}! Search took O(height) steps.`, de: `${search} gefunden! Suche dauerte O(Hoehe) Schritte.` })); return steps }
      cur = search < cur.key ? cur.left : cur.right
    }
    steps.push(snapshot(root, { searching: search }, { en: `${search} is not in the tree.`, de: `${search} ist nicht im Baum.` }))
  }
  return steps
}

/** Trie insertion: build a prefix tree from words, showing each char edge. */
export function buildTrie(words) {
  const steps = []
  let id = 1
  const root = { id: 0, ch: '', children: {}, end: false }
  const allNodes = () => {
    const list = []
    const walk = (n, depth, parentId) => { list.push({ id: n.id, ch: n.ch, end: n.end, depth, parentId }); Object.values(n.children).forEach((c) => walk(c, depth + 1, n.id)) }
    walk(root, 0, null)
    return list
  }
  const snap = (extra, msg) => steps.push({ nodes: allNodes(), ...extra, message: msg })
  snap({}, { en: 'Insert words into a trie. Each letter is an edge; shared prefixes share a path.', de: 'Wörter in einen Trie einfügen. Jeder Buchstabe ist eine Kante; gemeinsame Präfixe teilen einen Pfad.' })
  for (const word of words) {
    let cur = root
    for (const ch of word) {
      if (!cur.children[ch]) { cur.children[ch] = { id: id++, ch, children: {}, end: false }; cur = cur.children[ch]; snap({ active: cur.id }, { en: `'${ch}' is new - create an edge.`, de: `'${ch}' ist neu - Kante erstellen.` }) }
      else { cur = cur.children[ch]; snap({ active: cur.id }, { en: `'${ch}' already exists - follow it.`, de: `'${ch}' existiert - folgen.` }) }
    }
    cur.end = true
    snap({ active: cur.id, wordEnd: true }, { en: `Mark end of word "${word}".`, de: `Wortende von "${word}" markieren.` })
  }
  snap({ done: true }, { en: 'Trie built. Looking up any word is O(word length), regardless of how many are stored.', de: 'Trie gebaut. Ein Wort nachzuschlagen ist O(Wortlänge), egal wie viele gespeichert sind.' })
  return steps
}

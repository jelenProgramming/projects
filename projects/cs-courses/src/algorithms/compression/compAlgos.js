/** Compression step-generators: RLE, Huffman (tree), LZW (dictionary), arithmetic. */

export function rle(input) {
  const steps = []; const out = []
  const snap = (extra, msg) => steps.push({ input, out: out.slice(), ...extra, message: msg })
  snap({}, { en: 'Run-Length Encoding replaces a run of identical symbols with (count, symbol).', de: 'Lauflaengenkodierung ersetzt einen Lauf gleicher Symbole durch (Anzahl, Symbol).' })
  let i = 0
  while (i < input.length) {
    let run = 1
    while (i + run < input.length && input[i + run] === input[i]) run++
    snap({ start: i, len: run }, { en: `'${input[i]}' repeats ${run}x - emit ${run}${input[i]}.`, de: `'${input[i]}' wiederholt sich ${run}x - ${run}${input[i]} ausgeben.` })
    out.push(`${run}${input[i]}`)
    i += run
  }
  const ratio = ((out.join('').length / input.length) * 100).toFixed(0)
  snap({ done: true }, { en: `Done: "${out.join('')}" (${out.join('').length} vs ${input.length} chars, ${ratio}%). RLE only helps with long runs.`, de: `Fertig: "${out.join('')}" (${out.join('').length} statt ${input.length} Zeichen, ${ratio}%). RLE hilft nur bei langen Laeufen.` })
  return steps
}

export function huffman(input) {
  const steps = []
  const freq = {}
  for (const ch of input) freq[ch] = (freq[ch] || 0) + 1
  let id = 0
  let nodes = Object.entries(freq).map(([ch, f]) => ({ id: id++, ch, f, left: null, right: null }))
  const snapForest = (extra, msg) => steps.push({ forest: nodes.map(serialize), freq, ...extra, message: msg })
  function serialize(n) { return { id: n.id, ch: n.ch, f: n.f, left: n.left ? n.left.id : null, right: n.right ? n.right.id : null, _node: n } }
  snapForest({}, { en: 'Huffman: count frequencies, then repeatedly merge the two least-frequent nodes into a subtree.', de: 'Huffman: Haeufigkeiten zaehlen, dann wiederholt die zwei seltensten Knoten zu einem Teilbaum verschmelzen.' })
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f)
    const [x, y] = [nodes[0], nodes[1]]
    snapForest({ merging: [x.id, y.id] }, { en: `Merge the two smallest: '${x.ch || '*'}'(${x.f}) + '${y.ch || '*'}'(${y.f}) = ${x.f + y.f}.`, de: `Die zwei kleinsten verschmelzen: '${x.ch || '*'}'(${x.f}) + '${y.ch || '*'}'(${y.f}) = ${x.f + y.f}.` })
    const parent = { id: id++, ch: null, f: x.f + y.f, left: x, right: y }
    nodes = nodes.slice(2); nodes.push(parent)
  }
  // derive codes
  const codes = {}
  function walk(n, code) { if (!n) return; if (n.ch != null) { codes[n.ch] = code || '0' } else { walk(n.left, code + '0'); walk(n.right, code + '1') } }
  walk(nodes[0], '')
  steps.push({ forest: [serialize(nodes[0])], freq, codes, done: true, message: { en: `Tree complete. Codes: ${Object.entries(codes).map(([c, b]) => `'${c}'=${b}`).join(', ')}. Frequent symbols get the shortest codes.`, de: `Baum fertig. Codes: ${Object.entries(codes).map(([c, b]) => `'${c}'=${b}`).join(', ')}. Haeufige Symbole erhalten die kuerzesten Codes.` } })
  return steps
}

export function lzw(input) {
  const steps = []
  const dict = {}
  let next = 256
  // seed with single chars present
  const seen = [...new Set(input)].sort()
  seen.forEach((c) => { dict[c] = c.charCodeAt(0) })
  const out = []
  const dictView = () => Object.entries(dict).filter(([k]) => k.length > 1).map(([k, v]) => ({ k, v }))
  const snap = (extra, msg) => steps.push({ input, out: out.slice(), dict: dictView(), ...extra, message: msg })
  snap({}, { en: 'LZW starts with single characters in the dictionary (codes 0-255). It outputs codes and adds new multi-char entries as it goes.', de: 'LZW startet mit Einzelzeichen im Woerterbuch (Codes 0-255). Es gibt Codes aus und fuegt neue Mehrzeichen-Eintraege hinzu.' })
  let w = ''
  for (let idx = 0; idx < input.length; idx++) {
    const c = input[idx]
    const wc = w + c
    if (dict[wc] !== undefined) {
      w = wc
      snap({ pos: idx, current: w }, { en: `"${wc}" is in the dictionary - extend current string to "${w}".`, de: `"${wc}" ist im Woerterbuch - aktuelle Zeichenkette zu "${w}" erweitern.` })
    } else {
      out.push(dict[w])
      dict[wc] = next++
      snap({ pos: idx, emit: dict[w], added: wc, addedCode: next - 1 }, { en: `"${wc}" not found - output code for "${w}" (${dict[w]}), add "${wc}" = ${next - 1} to the dictionary.`, de: `"${wc}" nicht gefunden - Code fuer "${w}" (${dict[w]}) ausgeben, "${wc}" = ${next - 1} hinzufuegen.` })
      w = c
    }
  }
  if (w) { out.push(dict[w]); snap({ emit: dict[w], done: true }, { en: `Flush the last string "${w}" (${dict[w]}). Output codes: [${out.join(', ')}].`, de: `Letzte Zeichenkette "${w}" (${dict[w]}) ausgeben. Ausgabecodes: [${out.join(', ')}].` }) }
  return steps
}

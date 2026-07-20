/** Binary heap (max-heap) insert sequence, showing array + tree + sift-up. */
export function buildHeap(values) {
  const steps = []
  const h = []
  const snap = (extra, msg) => steps.push({ heap: h.slice(), ...extra, message: msg })
  snap({}, { en: 'Insert values into a max-heap one by one. Each new value sifts up until its parent is larger.', de: 'Werte nacheinander in einen Max-Heap einfügen. Jeder neue Wert steigt auf, bis sein Elter grösser ist.' })
  for (const val of values) {
    h.push(val)
    let i = h.length - 1
    snap({ active: i }, { en: `Add ${val} at the end (index ${i}).`, de: `${val} am Ende einfuegen (Index ${i}).` })
    while (i > 0) {
      const p = Math.floor((i - 1) / 2)
      snap({ active: i, compare: p }, { en: `Compare with parent h[${p}]=${h[p]}.`, de: `Mit Elter h[${p}]=${h[p]} vergleichen.` })
      if (h[i] > h[p]) {
        ;[h[i], h[p]] = [h[p], h[i]]
        snap({ active: p, swapped: [i, p] }, { en: `${val} &gt; ${h[i]} - swap up.`, de: `${val} &gt; ${h[i]} - nach oben tauschen.` })
        i = p
      } else { snap({ active: i }, { en: `Heap property holds - stop.`, de: `Heap-Eigenschaft gilt - stopp.` }); break }
    }
  }
  snap({ done: true }, { en: 'Max-heap complete: the largest value is always at the root.', de: 'Max-Heap fertig: der grösste Wert ist immer an der Wurzel.' })
  return steps
}

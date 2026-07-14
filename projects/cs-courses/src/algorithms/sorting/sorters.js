/**
 * Sorting step-generators.
 *
 * Each function takes an array and returns a list of steps. A step is:
 *   { array, compare:[i,j], swap:[i,j], sorted:[...indices], pivot, range, count, message }
 * `message` is an { en, de } pair so the narration is bilingual. No animation
 * logic lives here - just the algorithm, emitting a snapshot when something
 * interesting happens.
 */

const snap = (array, extra, message) => ({ array: [...array], compare: [], swap: [], sorted: [], ...extra, message })
const seq = (n) => Array.from({ length: n }, (_, k) => k)

export function bubbleSort(input) {
  const a = [...input]; const steps = []; const n = a.length; const sorted = []
  steps.push(snap(a, { sorted }, { en: 'Start. Bubble sort repeatedly swaps adjacent out-of-order pairs.', de: 'Start. Bubble Sort tauscht wiederholt benachbarte Paare, die falsch herum stehen.' }))
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push(snap(a, { compare: [j, j + 1], sorted: [...sorted] }, { en: `Compare a[${j}]=${a[j]} and a[${j + 1}]=${a[j + 1]}.`, de: `Vergleiche a[${j}]=${a[j]} und a[${j + 1}]=${a[j + 1]}.` }))
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        steps.push(snap(a, { swap: [j, j + 1], sorted: [...sorted] }, { en: `a[${j}] &gt; a[${j + 1}] - swap them.`, de: `a[${j}] &gt; a[${j + 1}] - tauschen.` }))
      }
    }
    sorted.unshift(n - 1 - i)
    steps.push(snap(a, { sorted: [...sorted] }, { en: `Largest unsorted value bubbled to position ${n - 1 - i}; it's now fixed.`, de: `Größter unsortierter Wert ist an Position ${n - 1 - i} aufgestiegen; jetzt fest.` }))
  }
  sorted.unshift(0)
  steps.push(snap(a, { sorted: [...sorted] }, { en: 'Done - the array is sorted.', de: 'Fertig - das Array ist sortiert.' }))
  return steps
}

export function selectionSort(input) {
  const a = [...input]; const steps = []; const n = a.length; const sorted = []
  steps.push(snap(a, {}, { en: 'Start. Selection sort finds the smallest remaining value and places it at the front.', de: 'Start. Selection Sort sucht den kleinsten verbleibenden Wert und setzt ihn nach vorne.' }))
  for (let i = 0; i < n - 1; i++) {
    let min = i
    steps.push(snap(a, { pivot: i, sorted: [...sorted], compare: [min] }, { en: `Assume a[${i}]=${a[i]} is the minimum of the rest.`, de: `Annahme: a[${i}]=${a[i]} ist das Minimum des Rests.` }))
    for (let j = i + 1; j < n; j++) {
      steps.push(snap(a, { pivot: min, compare: [j], sorted: [...sorted] }, { en: `Is a[${j}]=${a[j]} &lt; current min a[${min}]=${a[min]}?`, de: `Ist a[${j}]=${a[j]} &lt; aktuelles Min a[${min}]=${a[min]}?` }))
      if (a[j] < a[min]) { min = j; steps.push(snap(a, { pivot: min, sorted: [...sorted] }, { en: `Yes - new minimum is a[${j}]=${a[j]}.`, de: `Ja - neues Minimum ist a[${j}]=${a[j]}.` })) }
    }
    if (min !== i) { ;[a[i], a[min]] = [a[min], a[i]]; steps.push(snap(a, { swap: [i, min], sorted: [...sorted] }, { en: `Swap the minimum into position ${i}.`, de: `Minimum auf Position ${i} tauschen.` })) }
    sorted.push(i)
  }
  sorted.push(n - 1)
  steps.push(snap(a, { sorted: [...sorted] }, { en: 'Done - the array is sorted.', de: 'Fertig - das Array ist sortiert.' }))
  return steps
}

export function insertionSort(input) {
  const a = [...input]; const steps = []; const n = a.length
  steps.push(snap(a, { sorted: [0] }, { en: 'Start. Treat a[0] as a sorted region of size 1; insert each next value into place.', de: 'Start. a[0] gilt als sortierter Bereich der Größe 1; jeden nächsten Wert einsortieren.' }))
  for (let i = 1; i < n; i++) {
    const key = a[i]; let j = i - 1
    steps.push(snap(a, { pivot: i, sorted: seq(i) }, { en: `Take key = a[${i}] = ${key}. Shift larger values right.`, de: `Schlüssel = a[${i}] = ${key}. Größere Werte nach rechts schieben.` }))
    while (j >= 0 && a[j] > key) {
      steps.push(snap(a, { compare: [j], pivot: j + 1, sorted: seq(i) }, { en: `a[${j}]=${a[j]} &gt; ${key} - shift it right.`, de: `a[${j}]=${a[j]} &gt; ${key} - nach rechts schieben.` }))
      a[j + 1] = a[j]; j--
    }
    a[j + 1] = key
    steps.push(snap(a, { swap: [j + 1], sorted: seq(i + 1) }, { en: `Insert key ${key} at position ${j + 1}.`, de: `Schlüssel ${key} an Position ${j + 1} einfügen.` }))
  }
  steps.push(snap(a, { sorted: seq(n) }, { en: 'Done - the array is sorted.', de: 'Fertig - das Array ist sortiert.' }))
  return steps
}

export function mergeSort(input) {
  const a = [...input]; const steps = []; const n = a.length
  steps.push(snap(a, {}, { en: 'Start. Merge sort splits the array in half, sorts each half, then merges them.', de: 'Start. Merge Sort teilt das Array, sortiert beide Hälften und mischt sie.' }))
  function merge(lo, mid, hi) {
    const left = a.slice(lo, mid + 1); const right = a.slice(mid + 1, hi + 1)
    let i = 0, j = 0, k = lo
    steps.push(snap(a, { range: [lo, hi] }, { en: `Merge sorted halves [${lo}...${mid}] and [${mid + 1}...${hi}].`, de: `Sortierte Hälften [${lo}...${mid}] und [${mid + 1}...${hi}] mischen.` }))
    while (i < left.length && j < right.length) {
      steps.push(snap(a, { range: [lo, hi], compare: [lo + i, mid + 1 + j] }, { en: `Compare ${left[i]} and ${right[j]} - take the smaller.`, de: `${left[i]} und ${right[j]} vergleichen - den kleineren nehmen.` }))
      if (left[i] <= right[j]) { a[k] = left[i]; i++ } else { a[k] = right[j]; j++ }
      steps.push(snap(a, { range: [lo, hi], swap: [k] }, { en: `Place ${a[k]} at position ${k}.`, de: `${a[k]} an Position ${k} setzen.` })); k++
    }
    while (i < left.length) { a[k] = left[i]; i++; steps.push(snap(a, { range: [lo, hi], swap: [k] }, { en: `Copy leftover ${a[k]}.`, de: `Restwert ${a[k]} kopieren.` })); k++ }
    while (j < right.length) { a[k] = right[j]; j++; steps.push(snap(a, { range: [lo, hi], swap: [k] }, { en: `Copy leftover ${a[k]}.`, de: `Restwert ${a[k]} kopieren.` })); k++ }
  }
  function sort(lo, hi) {
    if (lo >= hi) return
    const mid = Math.floor((lo + hi) / 2)
    steps.push(snap(a, { range: [lo, hi] }, { en: `Split [${lo}...${hi}] at ${mid}.`, de: `[${lo}...${hi}] bei ${mid} teilen.` }))
    sort(lo, mid); sort(mid + 1, hi); merge(lo, mid, hi)
  }
  sort(0, n - 1)
  steps.push(snap(a, { sorted: seq(n) }, { en: 'Done - the array is sorted.', de: 'Fertig - das Array ist sortiert.' }))
  return steps
}

export function quickSort(input) {
  const a = [...input]; const steps = []; const n = a.length; const sorted = []
  steps.push(snap(a, {}, { en: 'Start. Quick sort picks a pivot, partitions around it, then recurses.', de: 'Start. Quick Sort wählt ein Pivot, partitioniert darum und rekursiert.' }))
  function partition(lo, hi) {
    const pivot = a[hi]
    steps.push(snap(a, { pivot: hi, range: [lo, hi] }, { en: `Pivot = a[${hi}] = ${pivot}. Move smaller values left.`, de: `Pivot = a[${hi}] = ${pivot}. Kleinere Werte nach links.` }))
    let i = lo - 1
    for (let j = lo; j < hi; j++) {
      steps.push(snap(a, { pivot: hi, compare: [j], range: [lo, hi] }, { en: `Is a[${j}]=${a[j]} ≤ pivot ${pivot}?`, de: `Ist a[${j}]=${a[j]} ≤ Pivot ${pivot}?` }))
      if (a[j] <= pivot) {
        i++
        if (i !== j) { ;[a[i], a[j]] = [a[j], a[i]]; steps.push(snap(a, { pivot: hi, swap: [i, j], range: [lo, hi] }, { en: `Yes - swap a[${i}] and a[${j}].`, de: `Ja - a[${i}] und a[${j}] tauschen.` })) }
      }
    }
    ;[a[i + 1], a[hi]] = [a[hi], a[i + 1]]
    steps.push(snap(a, { swap: [i + 1, hi], range: [lo, hi] }, { en: `Place pivot at its final position ${i + 1}.`, de: `Pivot an seine endgültige Position ${i + 1} setzen.` }))
    sorted.push(i + 1); return i + 1
  }
  function sort(lo, hi) {
    if (lo > hi) return
    if (lo === hi) { sorted.push(lo); return }
    const p = partition(lo, hi); sort(lo, p - 1); sort(p + 1, hi)
  }
  sort(0, n - 1)
  steps.push(snap(a, { sorted: seq(n) }, { en: 'Done - the array is sorted.', de: 'Fertig - das Array ist sortiert.' }))
  return steps
}

export function heapSort(input) {
  const a = [...input]; const steps = []; const n = a.length
  steps.push(snap(a, {}, { en: 'Start. Build a max-heap, then repeatedly move the max to the end.', de: 'Start. Max-Heap aufbauen, dann wiederholt das Maximum ans Ende setzen.' }))
  function heapify(size, i) {
    let largest = i; const l = 2 * i + 1, rr = 2 * i + 2
    if (l < size) { steps.push(snap(a, { compare: [largest, l], range: [0, size - 1] }, { en: `Compare parent a[${largest}]=${a[largest]} with child a[${l}]=${a[l]}.`, de: `Elter a[${largest}]=${a[largest]} mit Kind a[${l}]=${a[l]} vergleichen.` })); if (a[l] > a[largest]) largest = l }
    if (rr < size) { steps.push(snap(a, { compare: [largest, rr], range: [0, size - 1] }, { en: `Compare with right child a[${rr}]=${a[rr]}.`, de: `Mit rechtem Kind a[${rr}]=${a[rr]} vergleichen.` })); if (a[rr] > a[largest]) largest = rr }
    if (largest !== i) { ;[a[i], a[largest]] = [a[largest], a[i]]; steps.push(snap(a, { swap: [i, largest], range: [0, size - 1] }, { en: 'Swap to restore the heap property.', de: 'Tauschen, um die Heap-Eigenschaft wiederherzustellen.' })); heapify(size, largest) }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i)
  steps.push(snap(a, { range: [0, n - 1] }, { en: 'Max-heap built. Now extract the maximum repeatedly.', de: 'Max-Heap gebaut. Jetzt wiederholt das Maximum entnehmen.' }))
  const sorted = []
  for (let i = n - 1; i > 0; i--) {
    ;[a[0], a[i]] = [a[i], a[0]]; sorted.unshift(i)
    steps.push(snap(a, { swap: [0, i], sorted: [...sorted] }, { en: `Move the max ${a[i]} to position ${i}.`, de: `Maximum ${a[i]} auf Position ${i} setzen.` }))
    heapify(i, 0)
  }
  sorted.unshift(0)
  steps.push(snap(a, { sorted: [...sorted] }, { en: 'Done - the array is sorted.', de: 'Fertig - das Array ist sortiert.' }))
  return steps
}

export function countingSort(input) {
  const a = [...input]; const steps = []; const n = a.length; const max = Math.max(...a)
  const count = new Array(max + 1).fill(0)
  steps.push(snap(a, { count: [...count] }, { en: `Start. Counting sort tallies how many times each value 0...${max} appears - no comparisons.`, de: `Start. Counting Sort zählt, wie oft jeder Wert 0...${max} vorkommt - ohne Vergleiche.` }))
  for (let i = 0; i < n; i++) {
    count[a[i]]++
    steps.push(snap(a, { compare: [i], count: [...count], countHL: a[i] }, { en: `See a[${i}]=${a[i]} - increment count[${a[i]}] to ${count[a[i]]}.`, de: `a[${i}]=${a[i]} gesehen - count[${a[i]}] auf ${count[a[i]]} erhöhen.` }))
  }
  steps.push(snap(a, { count: [...count] }, { en: 'All counts tallied. Now write the values back in order.', de: 'Alle Zählungen fertig. Jetzt die Werte der Reihe nach zurückschreiben.' }))
  let k = 0
  for (let val = 0; val <= max; val++) {
    while (count[val] > 0) {
      a[k] = val
      steps.push(snap(a, { swap: [k], count: [...count], countHL: val }, { en: `Write ${val} (still ${count[val]} to place).`, de: `${val} schreiben (noch ${count[val]} zu setzen).` }))
      count[val]--; k++
    }
  }
  steps.push(snap(a, { sorted: seq(n), count: [...count] }, { en: 'Done - sorted in O(n + k) without a single comparison.', de: 'Fertig - in O(n + k) sortiert, ohne einen einzigen Vergleich.' }))
  return steps
}

export function radixSort(input) {
  const a = [...input]; const steps = []; const n = a.length; const max = Math.max(...a)
  steps.push(snap(a, {}, { en: 'Start. Radix sort sorts by each digit, least-significant first.', de: 'Start. Radix Sort sortiert nach jeder Ziffer, von der niederwertigsten an.' }))
  let exp = 1
  const digitName = (e) => e === 1 ? { en: 'ones', de: 'Einer' } : e === 10 ? { en: 'tens', de: 'Zehner' } : e === 100 ? { en: 'hundreds', de: 'Hunderter' } : { en: `10^${String(e).length - 1}`, de: `10^${String(e).length - 1}` }
  while (Math.floor(max / exp) > 0) {
    const output = new Array(n); const count = new Array(10).fill(0); const dn = digitName(exp)
    steps.push(snap(a, {}, { en: `Pass on the ${dn.en} digit.`, de: `Durchlauf für die ${dn.de}-Ziffer.` }))
    for (let i = 0; i < n; i++) {
      const d = Math.floor(a[i] / exp) % 10; count[d]++
      steps.push(snap(a, { compare: [i] }, { en: `a[${i}]=${a[i]} → ${dn.en} digit is ${d}.`, de: `a[${i}]=${a[i]} → ${dn.de}-Ziffer ist ${d}.` }))
    }
    for (let i = 1; i < 10; i++) count[i] += count[i - 1]
    for (let i = n - 1; i >= 0; i--) { const d = Math.floor(a[i] / exp) % 10; output[--count[d]] = a[i] }
    for (let i = 0; i < n; i++) a[i] = output[i]
    steps.push(snap(a, {}, { en: `Array after sorting by the ${dn.en} digit.`, de: `Array nach Sortierung der ${dn.de}-Ziffer.` })); exp *= 10
  }
  steps.push(snap(a, { sorted: seq(n) }, { en: 'Done - the array is sorted.', de: 'Fertig - das Array ist sortiert.' }))
  return steps
}

export const SORTERS = {
  'bubble-sort': bubbleSort,
  'selection-sort': selectionSort,
  'insertion-sort': insertionSort,
  'merge-sort': mergeSort,
  'quick-sort': quickSort,
  'heap-sort': heapSort,
  'counting-sort': countingSort,
  'radix-sort': radixSort,
}

/**
 * String matching step-generators. Each yields steps with:
 *   i (text align offset), j (pattern index), compare [ti], status, message
 * so the viz can show the pattern sliding under the text with char compares.
 */
const snap = (text, pattern, i, j, extra, message) => ({ text, pattern, i, j, ...extra, message })

export function naiveMatch(text, pattern) {
  const steps = []; const n = text.length, m = pattern.length
  steps.push(snap(text, pattern, 0, -1, {}, { en: 'Naive search: try every alignment, compare left to right, slide by 1 on a mismatch.', de: 'Naive Suche: jede Ausrichtung testen, links nach rechts vergleichen, bei Fehler um 1 schieben.' }))
  for (let i = 0; i <= n - m; i++) {
    let j = 0
    for (j = 0; j < m; j++) {
      const match = text[i + j] === pattern[j]
      steps.push(snap(text, pattern, i, j, { compare: i + j, match }, match
        ? { en: `text[${i + j}]='${text[i + j]}' = pattern[${j}] - match, keep going.`, de: `text[${i + j}]='${text[i + j]}' = pattern[${j}] - Treffer, weiter.` }
        : { en: `text[${i + j}]='${text[i + j]}' != pattern[${j}]='${pattern[j]}' - mismatch, slide by 1.`, de: `text[${i + j}]='${text[i + j]}' != pattern[${j}]='${pattern[j]}' - Fehler, um 1 schieben.` }))
      if (!match) break
    }
    if (j === m) { steps.push(snap(text, pattern, i, m - 1, { found: i }, { en: `Full match at index ${i}!`, de: `Volltreffer an Index ${i}!` })); return steps }
  }
  steps.push(snap(text, pattern, n - m, -1, {}, { en: 'No match found.', de: 'Kein Treffer.' }))
  return steps
}

export function kmpMatch(text, pattern) {
  const steps = []; const n = text.length, m = pattern.length
  // build failure function (prefix function)
  const f = new Array(m).fill(0)
  steps.push(snap(text, pattern, 0, -1, { phase: 'build' }, { en: 'KMP first builds a failure table: longest proper prefix that is also a suffix, for each position.', de: 'KMP baut zürst eine Fehlertabelle: längstes echtes Präfix, das auch Suffix ist, je Position.' }))
  let k = 0
  for (let i = 1; i < m; i++) {
    while (k > 0 && pattern[i] !== pattern[k]) k = f[k - 1]
    if (pattern[i] === pattern[k]) k++
    f[i] = k
    steps.push(snap(text, pattern, 0, i, { phase: 'build', failTable: f.slice() }, { en: `failure[${i}] = ${k}.`, de: `failure[${i}] = ${k}.` }))
  }
  // search
  steps.push(snap(text, pattern, 0, 0, { phase: 'search', failTable: f.slice() }, { en: 'Now scan the text. On a mismatch, jump the pattern using the table instead of restarting.', de: 'Jetzt den Text scannen. Bei Fehler das Muster per Tabelle springen statt neu zu starten.' }))
  let q = 0
  for (let i = 0; i < n; i++) {
    while (q > 0 && text[i] !== pattern[q]) {
      steps.push(snap(text, pattern, i - q, q, { phase: 'search', failTable: f.slice(), compare: i, match: false }, { en: `Mismatch - jump: q = failure[${q - 1}] = ${f[q - 1]} (no text backtrack).`, de: `Fehler - springen: q = failure[${q - 1}] = ${f[q - 1]} (kein Text-Ruecksprung).` }))
      q = f[q - 1]
    }
    const match = text[i] === pattern[q]
    steps.push(snap(text, pattern, i - q, q, { phase: 'search', failTable: f.slice(), compare: i, match }, match
      ? { en: `text[${i}]='${text[i]}' = pattern[${q}] - advance both.`, de: `text[${i}]='${text[i]}' = pattern[${q}] - beide weiter.` }
      : { en: `text[${i}]='${text[i]}' != pattern[0] - slide by 1.`, de: `text[${i}]='${text[i]}' != pattern[0] - um 1 schieben.` }))
    if (match) q++
    if (q === m) { steps.push(snap(text, pattern, i - m + 1, m - 1, { phase: 'search', failTable: f.slice(), found: i - m + 1 }, { en: `Full match at index ${i - m + 1}!`, de: `Volltreffer an Index ${i - m + 1}!` })); return steps }
  }
  steps.push(snap(text, pattern, n - m, -1, { phase: 'search', failTable: f.slice() }, { en: 'No match found.', de: 'Kein Treffer.' }))
  return steps
}

export function boyerMoore(text, pattern) {
  const steps = []; const n = text.length, m = pattern.length
  const last = {}
  for (let i = 0; i < m; i++) last[pattern[i]] = i
  steps.push(snap(text, pattern, 0, -1, { lastTable: { ...last } }, { en: 'Boyer-Moore compares the pattern right to left and jumps using the last-occurrence table on a mismatch.', de: 'Boyer-Moore vergleicht das Muster rechts nach links und springt bei Fehler per Letztes-Vorkommen-Tabelle.' }))
  let i = 0
  while (i <= n - m) {
    let j = m - 1
    while (j >= 0 && pattern[j] === text[i + j]) {
      steps.push(snap(text, pattern, i, j, { compare: i + j, match: true }, { en: `text[${i + j}]='${text[i + j]}' = pattern[${j}] - match, move left.`, de: `text[${i + j}]='${text[i + j]}' = pattern[${j}] - Treffer, nach links.` }))
      j--
    }
    if (j < 0) { steps.push(snap(text, pattern, i, 0, { found: i }, { en: `Full match at index ${i}!`, de: `Volltreffer an Index ${i}!` })); return steps }
    const bc = text[i + j]
    const shift = Math.max(1, j - (last[bc] ?? -1))
    steps.push(snap(text, pattern, i, j, { compare: i + j, match: false }, { en: `Mismatch '${text[i + j]}'. Last-occurrence shift = ${shift} - jump ahead.`, de: `Fehler '${text[i + j]}'. Letztes-Vorkommen-Sprung = ${shift} - vorspringen.` }))
    i += shift
  }
  steps.push(snap(text, pattern, Math.min(i, n - m), -1, {}, { en: 'No match found.', de: 'Kein Treffer.' }))
  return steps
}

export function rabinKarp(text, pattern) {
  const steps = []; const n = text.length, m = pattern.length
  const B = 256, MOD = 101
  let ph = 0, th = 0, h = 1
  for (let i = 0; i < m - 1; i++) h = (h * B) % MOD
  for (let i = 0; i < m; i++) { ph = (B * ph + pattern.charCodeAt(i)) % MOD; th = (B * th + text.charCodeAt(i)) % MOD }
  steps.push(snap(text, pattern, 0, -1, { patHash: ph, winHash: th }, { en: `Rabin-Karp hashes the pattern (=${ph}) and each window, comparing hashes first - O(1) per slide.`, de: `Rabin-Karp hasht das Muster (=${ph}) und jedes Fenster, vergleicht zuerst Hashes - O(1) je Schritt.` }))
  for (let i = 0; i <= n - m; i++) {
    const hitHash = ph === th
    steps.push(snap(text, pattern, i, -1, { patHash: ph, winHash: th, compare: i, match: hitHash }, hitHash
      ? { en: `Window hash ${th} = pattern hash ${ph} - verify characters.`, de: `Fensterhash ${th} = Musterhash ${ph} - Zeichen pruefen.` }
      : { en: `Window hash ${th} != ${ph} - definitely not a match, slide.`, de: `Fensterhash ${th} != ${ph} - sicher kein Treffer, schieben.` }))
    if (hitHash && text.substr(i, m) === pattern) { steps.push(snap(text, pattern, i, m - 1, { found: i, patHash: ph, winHash: th }, { en: `Hashes matched and characters confirm - match at ${i}!`, de: `Hashes passen und Zeichen bestaetigen - Treffer bei ${i}!` })); return steps }
    if (i < n - m) { th = (B * (th - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % MOD; if (th < 0) th += MOD }
  }
  steps.push(snap(text, pattern, n - m, -1, {}, { en: 'No match found.', de: 'Kein Treffer.' }))
  return steps
}


export function horspool(text, pattern) {
  const steps = []; const n = text.length, m = pattern.length
  // Horspool bad-char shift: based on the char at the END of the window
  const shift = {}
  for (let i = 0; i < m - 1; i++) shift[pattern[i]] = m - 1 - i
  const getShift = (c) => (shift[c] ?? m)
  const snap = (i, j, extra, message) => ({ text, pattern, i, j, ...extra, message })
  steps.push(snap(0, -1, { shiftChar: m - 1 }, { en: 'Horspool: compare right to left. On a mismatch, shift using the character aligned with the LAST position of the window (end of window).', de: 'Horspool: rechts nach links vergleichen. Bei Fehler per Zeichen an der LETZTEN Fensterposition (Fensterende) verschieben.' }))
  let i = 0
  while (i <= n - m) {
    let j = m - 1
    while (j >= 0 && pattern[j] === text[i + j]) {
      steps.push(snap(i, j, { compare: i + j, match: true }, { en: `text[${i + j}]='${text[i + j]}' = pattern[${j}] - match, move left.`, de: `text[${i + j}]='${text[i + j]}' = pattern[${j}] - Treffer, nach links.` }))
      j--
    }
    if (j < 0) { steps.push(snap(i, 0, { found: i }, { en: `Full match at index ${i}!`, de: `Volltreffer an Index ${i}!` })); return steps }
    const wc = text[i + m - 1]
    const sh = getShift(wc)
    steps.push(snap(i, j, { compare: i + j, match: false, shiftChar: i + m - 1 }, { en: `Mismatch. Look at the window-end char text[${i + m - 1}]='${wc}'. Its shift table value is ${sh} - jump ${sh}.`, de: `Fehler. Fensterend-Zeichen text[${i + m - 1}]='${wc}' ansehen. Tabellenwert ${sh} - um ${sh} springen.` }))
    i += sh
  }
  steps.push(snap(Math.min(i, n - m), -1, {}, { en: 'No match found.', de: 'Kein Treffer.' }))
  return steps
}

export function sunday(text, pattern) {
  const steps = []; const n = text.length, m = pattern.length
  // Sunday shift: based on the char JUST PAST the window (index i+m)
  const shift = {}
  for (let i = 0; i < m; i++) shift[pattern[i]] = m - i
  const getShift = (c) => (shift[c] ?? m + 1)
  const snap = (i, j, extra, message) => ({ text, pattern, i, j, ...extra, message })
  steps.push(snap(0, -1, { shiftChar: m }, { en: 'Sunday: on a mismatch, look at the character ONE PAST the end of the window (next of window) to decide the shift. Often jumps further than Horspool.', de: 'Sunday: bei Fehler das Zeichen EINS HINTER dem Fenster (next of window) ansehen, um den Sprung zu bestimmen. Springt oft weiter als Horspool.' }))
  let i = 0
  while (i <= n - m) {
    let j = 0
    while (j < m && pattern[j] === text[i + j]) {
      steps.push(snap(i, j, { compare: i + j, match: true }, { en: `text[${i + j}]='${text[i + j]}' = pattern[${j}] - match.`, de: `text[${i + j}]='${text[i + j]}' = pattern[${j}] - Treffer.` }))
      j++
    }
    if (j === m) { steps.push(snap(i, m - 1, { found: i }, { en: `Full match at index ${i}!`, de: `Volltreffer an Index ${i}!` })); return steps }
    steps.push(snap(i, j, { compare: i + j, match: false }, { en: `Mismatch at pattern[${j}].`, de: `Fehler bei pattern[${j}].` }))
    if (i + m >= n) break
    const nc = text[i + m]
    const sh = getShift(nc)
    steps.push(snap(i, j, { match: false, shiftChar: i + m }, { en: `Look at the char past the window: text[${i + m}]='${nc}'. Shift = ${sh} - jump ${sh}.`, de: `Zeichen hinter dem Fenster: text[${i + m}]='${nc}'. Sprung = ${sh} - um ${sh} springen.` }))
    i += sh
  }
  steps.push(snap(Math.min(i, n - m), -1, {}, { en: 'No match found.', de: 'Kein Treffer.' }))
  return steps
}

export const MATCHERS = { 'naive-match': naiveMatch, 'kmp': kmpMatch, 'boyer-moore': boyerMoore, 'rabin-karp': rabinKarp, 'horspool': horspool, 'sunday': sunday }

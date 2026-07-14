// Deep-enrichment overrides: richer versions of read topics, with the by-hand
// methods that show up as exam questions written as original notes (never the
// literal question). Spread LAST in content.js so these win over the base entry.
export const deepContent = {
  'hash-table': {
    tldr: { en: 'Stores key-value pairs by running the key through a <strong>hash function</strong> to pick a bucket. <strong>O(1) average</strong> for insert/lookup/delete, <strong>O(n) worst case</strong> when everything collides. The average is why hash tables are everywhere.', de: 'Speichert Schluessel-Wert-Paare, indem der Schluessel ueber eine <strong>Hashfunktion</strong> einen Behaelter waehlt. <strong>O(1) im Schnitt</strong>, <strong>O(n) im schlechtesten Fall</strong>, wenn alles kollidiert.' },
    defs: [
      { name: { en: 'Division method', de: 'Divisionsmethode' }, body: { en: 'The simplest hash: the key modulo the table size. Fast, but pick $m$ well (a prime far from a power of two) so every bit of the key influences the bucket.', de: 'Der einfachste Hash: Schluessel modulo Tabellengroesse. Schnell, aber $m$ gut waehlen (eine Primzahl fern einer Zweierpotenz), damit jedes Bit des Schluessels den Behaelter beeinflusst.' }, formal: { tex: 'h(k) = k \\bmod m' } },
      { name: { en: 'Multiplication method', de: 'Multiplikationsmethode' }, body: { en: 'Multiply the key by a constant $A \\in (0,1)$, keep the fractional part, then scale to the table. Works for any $m$, even a power of two.', de: 'Multipliziere den Schluessel mit einer Konstante $A \\in (0,1)$, nimm den Nachkommateil, skaliere auf die Tabelle. Funktioniert fuer jedes $m$, auch Zweierpotenzen.' }, formal: { tex: 'h(k) = \\lfloor m\\,(kA - \\lfloor kA \\rfloor) \\rfloor' } },
      { name: { en: 'Quadratic probing', de: 'Quadratisches Sondieren' }, body: { en: 'Open addressing where the $i$-th probe steps a quadratic distance from the base slot, breaking up the long runs that linear probing creates.', de: 'Offene Adressierung, bei der die $i$-te Sondierung quadratisch vom Basisplatz abweicht und die langen Ketten des linearen Sondierens aufbricht.' }, formal: { tex: "h(k,i) = (h'(k) + c_1 i + c_2 i^2) \\bmod m" } },
      { name: { en: 'Double hashing', de: 'Doppeltes Hashen' }, body: { en: 'Open addressing where a second hash sets the step size, so different keys walk the table in different patterns and clustering almost disappears.', de: 'Offene Adressierung, bei der ein zweiter Hash die Schrittweite setzt, sodass verschiedene Schluessel die Tabelle unterschiedlich durchlaufen und Cluster fast verschwinden.' }, formal: { tex: 'h(k,i) = (h_1(k) + i\\,h_2(k)) \\bmod m' } },
    ],
    intro: [
      { en: 'A <strong>hash function</strong> turns a key into a bucket index. Two keys landing in the same bucket is a <strong>collision</strong>, resolved either by <strong>chaining</strong> (each bucket holds a list) or <strong>open addressing</strong> (probe on to another slot in the same array).',
        de: 'Eine <strong>Hashfunktion</strong> macht aus einem Schluessel einen Behaelterindex. Landen zwei Schluessel im selben Behaelter, ist das eine <strong>Kollision</strong>, geloest durch <strong>Verkettung</strong> (Liste pro Behaelter) oder <strong>offene Adressierung</strong> (weiter zu einem anderen Platz im selben Feld sondieren).' },
      { en: 'The <strong>load factor</strong> $\\alpha = n/m$ (items over buckets) governs speed. Keep it well below 1 for open addressing; when it grows, allocate a bigger table and <strong>rehash</strong> every key.',
        de: 'Der <strong>Fuellgrad</strong> $\\alpha = n/m$ (Elemente durch Behaelter) bestimmt das Tempo. Halte ihn bei offener Adressierung deutlich unter 1; waechst er, ein groesseres Feld anlegen und jeden Schluessel <strong>neu hashen</strong>.' },
    ],
    how: [
      { en: 'To build a probe sequence by hand: compute the base slot with the auxiliary hash $h&#39;(k)$, then apply the probing formula for $i = 0, 1, 2, \\dots$ until a free slot appears, taking every result $\\bmod\\ m$.',
        de: 'Eine Sondierungsfolge von Hand: berechne den Basisplatz mit dem Hilfshash $h&#39;(k)$, wende dann die Sondierungsformel fuer $i = 0, 1, 2, \\dots$ an, bis ein freier Platz auftaucht, jedes Ergebnis $\\bmod\\ m$.' },
      { en: 'For <strong>double hashing</strong>, first compute both auxiliary hashes ($h_1$ by division, $h_2$ often by the multiplication method), then step by $h_2$ each probe.',
        de: 'Beim <strong>doppelten Hashen</strong> zuerst beide Hilfshashes berechnen ($h_1$ per Division, $h_2$ oft per Multiplikationsmethode), dann pro Sondierung um $h_2$ weitergehen.' },
    ],
    complexity: [
      { case: { en: 'Insert / Search / Delete - average', de: 'Einf./Suchen/Loeschen - Durchschnitt' }, time: 'O(1)', space: 'O(n)', cls: 'best' },
      { case: { en: 'Insert / Search / Delete - worst', de: 'Einf./Suchen/Loeschen - schlecht.' }, time: 'O(n)', space: 'O(n)', cls: 'worst', note: { en: 'All keys collide into one bucket (bad hash). A good hash plus a low load factor keeps it O(1) amortised.', de: 'Alle Schluessel kollidieren in einem Behaelter (schlechter Hash). Guter Hash plus niedriger Fuellgrad haelt es bei O(1) amortisiert.' } },
    ],
    pitfalls: [
      { en: '<strong>Quadratic probing</strong> may not reach every slot: with a bad $m$ it cycles through a fraction of the table and can fail to insert even when space remains.',
        de: '<strong>Quadratisches Sondieren</strong> erreicht evtl. nicht jeden Platz: bei schlechtem $m$ durchlaeuft es nur einen Teil der Tabelle und kann trotz freien Platzes scheitern.' },
      { en: '<strong>Double hashing</strong> needs $h_2(k)$ never zero and coprime with $m$, otherwise the step size cannot cover the whole table.',
        de: '<strong>Doppeltes Hashen</strong> braucht $h_2(k)$ nie null und teilerfremd zu $m$, sonst deckt die Schrittweite nicht die ganze Tabelle ab.' },
      { en: 'The division method with $m$ a power of two only looks at the low bits of the key, throwing away the rest. Prefer a prime.',
        de: 'Die Divisionsmethode mit $m$ als Zweierpotenz betrachtet nur die niederen Bits des Schluessels und verwirft den Rest. Bevorzuge eine Primzahl.' },
    ],
  },

  'big-o': {
    tldr: { en: '<strong>Big-O</strong> describes how a runtime or memory grows with the input size $n$, keeping only the dominant term and dropping constants. It is the language for comparing algorithms independent of the machine.', de: '<strong>Big-O</strong> beschreibt, wie Laufzeit oder Speicher mit der Eingabegroesse $n$ waechst, behaelt nur den dominanten Term und laesst Konstanten weg. Die Sprache zum maschinenunabhaengigen Vergleich von Algorithmen.' },
    defs: [
      { name: { en: 'Big-O (upper bound)', de: 'Big-O (obere Schranke)' }, body: { en: '$f(n) = O(g(n))$ means $f$ grows no faster than $g$, up to a constant, for large $n$. The everyday worst-case bound.', de: '$f(n) = O(g(n))$ heisst, $f$ waechst hoechstens so schnell wie $g$, bis auf eine Konstante, fuer grosse $n$. Die uebliche Worst-Case-Schranke.' }, formal: { tex: 'f(n) \\le c\\,g(n) \\ \\text{ for } n \\ge n_0' } },
      { name: { en: 'Big-Omega (lower bound)', de: 'Big-Omega (untere Schranke)' }, body: { en: '$\\Omega(g)$ is a lower bound: $f$ grows at least as fast as $g$.', de: '$\\Omega(g)$ ist eine untere Schranke: $f$ waechst mindestens so schnell wie $g$.' }, formal: { tex: 'f(n) \\ge c\\,g(n) \\ \\text{ for } n \\ge n_0' } },
      { name: { en: 'Big-Theta (tight)', de: 'Big-Theta (scharf)' }, body: { en: '$\\Theta(g)$ means both bounds hold: $f$ grows exactly like $g$.', de: '$\\Theta(g)$ heisst, beide Schranken gelten: $f$ waechst genau wie $g$.' }, formal: { tex: 'c_1 g(n) \\le f(n) \\le c_2 g(n)' } },
    ],
    intro: [
      { en: 'The common growth classes, slowest-growing first: constant $O(1)$, logarithmic $O(\\log n)$, linear $O(n)$, linearithmic $O(n \\log n)$, quadratic $O(n^2)$, and exponential $O(2^n)$. The gap between them dwarfs any constant factor once $n$ is large.',
        de: 'Die gaengigen Wachstumsklassen, langsamste zuerst: konstant $O(1)$, logarithmisch $O(\\log n)$, linear $O(n)$, linearithmisch $O(n \\log n)$, quadratisch $O(n^2)$, exponentiell $O(2^n)$. Der Abstand zwischen ihnen ueberwiegt jeden konstanten Faktor, sobald $n$ gross ist.' },
    ],
    how: [
      { en: '<strong>Scaling with a faster machine:</strong> if a run takes time proportional to $T(n)$ and the machine speeds up by a factor $s$, the largest solvable size grows by solving $T(n_2) = s\\,T(n_1)$. For $T(n) = n^k$ this means $n_2 = \\sqrt[k]{s}\\;n_1$, so faster hardware buys only a $k$-th root of the size for polynomial costs, and almost nothing for exponential ones.',
        de: '<strong>Skalierung mit schnellerer Maschine:</strong> braucht ein Lauf Zeit proportional zu $T(n)$ und die Maschine wird um Faktor $s$ schneller, folgt die groesste loesbare Groesse aus $T(n_2) = s\\,T(n_1)$. Fuer $T(n) = n^k$ heisst das $n_2 = \\sqrt[k]{s}\\;n_1$, schnellere Hardware bringt also nur eine $k$-te Wurzel der Groesse bei Polynomen und fast nichts bei Exponentiellem.' },
      { en: '<strong>Fitting a cost from two measurements:</strong> if you assume a form like $T(n) = a\\,2^{k n}$ and measure two times, divide the two equations to cancel $a$, take a logarithm to solve for $k$, then back-substitute for $a$. This turns two data points into a predictive formula.',
        de: '<strong>Kosten aus zwei Messungen bestimmen:</strong> nimmst du eine Form wie $T(n) = a\\,2^{k n}$ an und misst zweimal, teile die Gleichungen, um $a$ zu kuerzen, logarithmiere fuer $k$ und setze zurueck fuer $a$. So werden zwei Messpunkte zu einer Vorhersageformel.' },
    ],
    pitfalls: [
      { en: 'Big-O hides constants and lower-order terms, so a "slower" class can win for small $n$. It describes <strong>asymptotic</strong> behaviour, not a stopwatch.',
        de: 'Big-O verbirgt Konstanten und Terme niedriger Ordnung, eine "langsamere" Klasse kann fuer kleine $n$ gewinnen. Es beschreibt <strong>asymptotisches</strong> Verhalten, keine Stoppuhr.' },
      { en: 'Best, average and worst case can differ (quicksort is $O(n \\log n)$ average but $O(n^2)$ worst). State which one you mean.',
        de: 'Bester, mittlerer und schlechtester Fall koennen sich unterscheiden (Quicksort ist $O(n \\log n)$ im Schnitt, aber $O(n^2)$ schlecht). Sag, welchen du meinst.' },
    ],
  },

  'linked-list': {
    tldr: { en: 'A chain of <strong>nodes</strong>, each holding a value and a pointer to the next. Insert and delete at a known position are <strong>O(1)</strong>, but there is <strong>no random access</strong>: reaching the $k$-th element costs $O(k)$.', de: 'Eine Kette von <strong>Knoten</strong>, jeder mit einem Wert und einem Zeiger auf den naechsten. Einfuegen und Loeschen an bekannter Stelle ist <strong>O(1)</strong>, aber es gibt <strong>keinen wahlfreien Zugriff</strong>: das $k$-te Element kostet $O(k)$.' },
    defs: [
      { name: { en: 'Singly linked', de: 'Einfach verkettet' }, body: { en: 'Each node points only forward. Traversal is one-way; you keep a head pointer to the first node.', de: 'Jeder Knoten zeigt nur vorwaerts. Durchlauf ist einseitig; ein Kopfzeiger haelt den ersten Knoten.' } },
      { name: { en: 'Doubly linked', de: 'Doppelt verkettet' }, body: { en: 'Each node points both forward and back, so you can delete a node in $O(1)$ given only that node, and walk in either direction.', de: 'Jeder Knoten zeigt vor und zurueck, sodass man einen Knoten in $O(1)$ nur mit diesem Knoten loeschen und in beide Richtungen laufen kann.' } },
      { name: { en: 'Circular', de: 'Zirkulaer' }, body: { en: 'The last node points back to the first, handy for round-robin scheduling and ring buffers.', de: 'Der letzte Knoten zeigt zurueck auf den ersten, praktisch fuer Round-Robin und Ringpuffer.' } },
    ],
    intro: [
      { en: 'Unlike an array, a linked list is not one contiguous block; each node is allocated separately and found only through the pointer from its predecessor. That is what makes insertion cheap (relink two pointers) and indexing expensive (walk from the head).',
        de: 'Anders als ein Feld ist eine verkettete Liste kein zusammenhaengender Block; jeder Knoten wird einzeln angelegt und nur ueber den Zeiger seines Vorgaengers gefunden. Das macht Einfuegen billig (zwei Zeiger umhaengen) und Indizieren teuer (vom Kopf laufen).' },
    ],
    how: [
      { en: '<strong>Insert at head:</strong> point the new node at the old head, then move the head pointer. $O(1)$.',
        de: '<strong>Am Kopf einfuegen:</strong> neuen Knoten auf den alten Kopf zeigen lassen, dann Kopfzeiger versetzen. $O(1)$.' },
      { en: '<strong>Delete a node:</strong> relink its predecessor to its successor. $O(1)$ once you hold the node (doubly linked) or its predecessor (singly linked).',
        de: '<strong>Knoten loeschen:</strong> Vorgaenger auf Nachfolger umhaengen. $O(1)$, sobald man den Knoten haelt (doppelt) oder seinen Vorgaenger (einfach).' },
    ],
    complexity: [
      { case: { en: 'Insert / delete at position', de: 'Einf./Loeschen an Position' }, time: 'O(1)', space: 'O(n)', cls: 'best' },
      { case: { en: 'Access / search k-th', de: 'Zugriff / Suche k-tes' }, time: 'O(n)', space: 'O(n)', cls: 'worst' },
    ],
    pitfalls: [
      { en: 'Losing the pointer to the rest of the list mid-operation leaks or drops nodes. Reassign pointers in the right order, and guard the empty and single-node cases.',
        de: 'Den Zeiger auf den Rest der Liste mitten in der Operation zu verlieren, verliert Knoten. Zeiger in der richtigen Reihenfolge setzen und die Faelle leere Liste und ein Knoten absichern.' },
    ],
  },

  'stack-queue': {
    tldr: { en: 'Two restricted lists. A <strong>stack</strong> is <strong>LIFO</strong> (last in, first out); a <strong>queue</strong> is <strong>FIFO</strong> (first in, first out). Both do their core operations in <strong>O(1)</strong>.', de: 'Zwei eingeschraenkte Listen. Ein <strong>Stapel</strong> ist <strong>LIFO</strong> (zuletzt rein, zuerst raus); eine <strong>Warteschlange</strong> ist <strong>FIFO</strong> (zuerst rein, zuerst raus). Beide Kernoperationen in <strong>O(1)</strong>.' },
    defs: [
      { name: { en: 'Stack (LIFO)', de: 'Stapel (LIFO)' }, body: { en: 'Push adds to the top, pop removes from the top. Models call stacks, undo, and expression evaluation.', de: 'Push legt oben ab, Pop nimmt oben weg. Modelliert Aufrufstapel, Rueckgaengig und Ausdrucksauswertung.' } },
      { name: { en: 'Queue (FIFO)', de: 'Warteschlange (FIFO)' }, body: { en: 'Enqueue adds at the back, dequeue removes from the front. Models buffers, scheduling, and BFS.', de: 'Enqueue haengt hinten an, Dequeue nimmt vorne weg. Modelliert Puffer, Scheduling und BFS.' } },
      { name: { en: 'Circular queue', de: 'Ringpuffer' }, body: { en: 'A fixed array whose front and back indices wrap around modulo the capacity, reusing freed slots without shifting.', de: 'Ein festes Feld, dessen Vorder- und Hinterindex modulo der Kapazitaet umlaufen und freie Plaetze ohne Verschieben wiederverwenden.' }, formal: { tex: 'i_{next} = (i + 1) \\bmod \\text{capacity}' } },
    ],
    how: [
      { en: '<strong>Stack:</strong> keep a top index; push writes then increments, pop decrements then reads.',
        de: '<strong>Stapel:</strong> einen Top-Index halten; Push schreibt und erhoeht, Pop verringert und liest.' },
      { en: '<strong>Circular queue:</strong> advance front and back with $\\bmod$ capacity; track a count (or leave one slot empty) to tell a full queue from an empty one.',
        de: '<strong>Ringpuffer:</strong> Front und Back mit $\\bmod$ Kapazitaet weiterschalten; einen Zaehler fuehren (oder einen Platz frei lassen), um voll von leer zu unterscheiden.' },
    ],
    pitfalls: [
      { en: 'In a circular queue, front and back are equal both when it is <strong>empty and full</strong>. Resolve it with an explicit size counter or by keeping one slot always empty.',
        de: 'Im Ringpuffer sind Front und Back sowohl bei <strong>leer als auch voll</strong> gleich. Loese es mit einem Groessenzaehler oder indem ein Platz stets frei bleibt.' },
      { en: 'Popping an empty stack (underflow) or pushing a full fixed stack (overflow) must be checked, not assumed away.',
        de: 'Pop auf leerem Stapel (Unterlauf) oder Push auf vollem festen Stapel (Ueberlauf) muss geprueft, nicht angenommen werden.' },
    ],
  },
}

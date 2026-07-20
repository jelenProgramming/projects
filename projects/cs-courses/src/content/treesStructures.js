// Trees & data-structure content. Every entry includes a best/avg/worst
// complexity table (casovna in prostorska zahtevnost).
const cx = (c) => c
export const treesContent = {
  'bst': {
    tldr: { en: 'A tree where every left child &lt; parent &lt; every right child. Search, insert and delete are all <strong>O(h)</strong> where h is the height - <strong>O(log n) if balanced, O(n) if it degenerates into a list</strong>. That gap is the whole story.', de: 'Ein Baum, in dem jedes linke Kind &lt; Elter &lt; jedes rechte Kind. Suchen, Einfügen und Löschen sind alle <strong>O(h)</strong>, wobei h die Höhe ist - <strong>O(log n) wenn balanciert, O(n) wenn er zu einer Liste entartet</strong>. Diese Lücke ist der Kern.' },
    when: { en: 'When you need a sorted, dynamic collection with fast lookup, insertion and ordered traversal. In practice use a self-balancing variant (AVL, red-black) so height stays O(log n). A plain BST is the teaching version.', de: 'Wenn du eine sortierte, dynamische Sammlung mit schnellem Nachschlagen, Einfügen und geordnetem Durchlauf brauchst. In der Praxis eine selbstbalancierende Variante (AVL, Rot-Schwarz), damit die Höhe O(log n) bleibt.' },
    how: [
      { en: 'Search: start at the root, go left if the target is smaller, right if larger, until found or you hit null.', de: 'Suche: an der Wurzel starten, bei kleinerem Ziel nach links, bei grösserem nach rechts, bis gefunden oder null.' },
      { en: 'Insert: search for the key; the empty slot where the search ends is where the new node goes.', de: 'Einfügen: nach dem Schlüssel suchen; die leere Stelle, an der die Suche endet, ist der Platz des neuen Knotens.' },
      { en: 'Delete: leaf - just remove it; one child - splice it out; two children - replace with the in-order successor.', de: 'Löschen: Blatt - einfach entfernen; ein Kind - heraustrennen; zwei Kinder - durch In-Order-Nachfolger ersetzen.' },
    ],
    paper: [
      { en: 'Draw the root, then for each value: start at the root and write the comparison (&lt; goes left, &gt; goes right) until you reach an empty spot.', de: 'Wurzel zeichnen, dann für jeden Wert: an der Wurzel beginnen und den Vergleich notieren (&lt; nach links, &gt; nach rechts), bis ein freier Platz erreicht ist.' },
      { en: '<strong>In-order traversal</strong> (left, node, right) prints a BST in sorted order - the #1 way to check your tree is correct.', de: '<strong>In-Order-Durchlauf</strong> (links, Knoten, rechts) gibt einen BST sortiert aus - der beste Weg, die Korrektheit zu prüfen.' },
      { en: 'Pre-order = node, left, right. Post-order = left, right, node. Memorize where the <strong>node</strong> sits in each.', de: 'Pre-Order = Knoten, links, rechts. Post-Order = links, rechts, Knoten. Merke dir, wo der <strong>Knoten</strong> jeweils steht.' },
    ],
    cpp: { caption: { en: 'Standard implementation:', de: 'Standard-Implementierung:' }, code: `struct Node { int key; Node *parent, *left, *right; };

Node* search(Node* root, int k) {
    Node* x = root;
    while (x != nullptr) {
        if (k == x->key) return x;
        x = (k < x->key) ? x->left : x->right;
    }
    return nullptr;   // not found
}` },
    complexity: [
      { case: { en: 'Search/Insert/Delete - balanced', de: 'Suchen/Einf./Löschen - balanciert' }, time: 'O(log n)', space: 'O(n)', cls: 'best' },
      { case: { en: 'Search/Insert/Delete - average', de: 'Suchen/Einf./Löschen - Durchschnitt' }, time: 'O(log n)', space: 'O(n)', cls: 'avg' },
      { case: { en: 'Search/Insert/Delete - worst', de: 'Suchen/Einf./Löschen - schlecht.' }, time: 'O(n)', space: 'O(n)', cls: 'worst', note: { en: 'Worst case is a degenerate tree (insert sorted data into a plain BST → a linked list). Self-balancing trees guarantee O(log n).', de: 'Schlechtester Fall ist ein entarteter Baum (sortierte Daten in einen einfachen BST → eine verkettete Liste). Selbstbalancierende Bäume garantieren O(log n).' } },
    ],
    pitfalls: [
      { en: '<strong>Inserting already-sorted data builds a linked list</strong> (height = n) - the classic worst-case question.', de: '<strong>Sortierte Daten einzufügen baut eine verkettete Liste</strong> (Höhe = n) - die klassische Worst-Case-Frage.' },
      { en: 'Delete with two children: replace with in-order successor (smallest in right subtree) or predecessor - know the procedure.', de: 'Löschen mit zwei Kindern: durch In-Order-Nachfolger (kleinster im rechten Teilbaum) oder Vorgänger ersetzen.' },
    ],
  },
  'binary-heap': {
    tldr: { en: 'A complete binary tree kept in an array where every parent is ≤ (min-heap) or ≥ (max-heap) its children. Gives <strong>O(1) peek</strong> at the min/max and <strong>O(log n) insert and extract</strong>. The engine behind priority queues and heapsort.', de: 'Ein vollständiger Binärbaum in einem Array, in dem jeder Elter ≤ (Min-Heap) oder ≥ (Max-Heap) seiner Kinder ist. Bietet <strong>O(1)-Zugriff</strong> auf Min/Max und <strong>O(log n) Einfügen und Entnehmen</strong>. Die Basis von Prioritätswarteschlangen und Heapsort.' },
    when: { en: 'Priority queues, scheduling, Dijkstra/Prim, finding the k largest items, and heapsort. Use when you repeatedly need the smallest (or largest) element of a changing set.', de: 'Prioritätswarteschlangen, Scheduling, Dijkstra/Prim, die k grössten Elemente und Heapsort. Gut, wenn du wiederholt das kleinste (oder grösste) Element brauchst.' },
    how: [
      { en: 'Store as an array: node i has children 2i+1 and 2i+2, parent (i-1)/2. No pointers needed.', de: 'Als Array speichern: Knoten i hat Kinder 2i+1 und 2i+2, Elter (i-1)/2. Keine Zeiger nötig.' },
      { en: 'Insert: put the new value at the end, then "sift up" while it is smaller than its parent.', de: 'Einfügen: neuen Wert ans Ende, dann „nach oben sieben", solange er kleiner als sein Elter ist.' },
      { en: 'Extract-min: take the root, move the last element to the root, then "sift down".', de: 'Min entnehmen: Wurzel nehmen, letztes Element zur Wurzel, dann „nach unten sieben".' },
    ],
    paper: [
      { en: 'Write the heap as an array. To find children of index i, compute 2i+1 and 2i+2; for the parent, (i-1)/2 rounded down.', de: 'Den Heap als Array schreiben. Kinder von Index i: 2i+1 und 2i+2; Elter: (i-1)/2 abgerundet.' },
      { en: 'Insert: append at the end, then compare with the parent and swap upward until the parent is larger (max-heap).', de: 'Einfügen: hinten anhängen, dann mit dem Elter vergleichen und nach oben tauschen, bis der Elter grösser ist (Max-Heap).' },
      { en: 'Extract-max: write down the root, replace it with the last element, then sift down (swap with the larger child) until settled.', de: 'Max entnehmen: Wurzel notieren, durch das letzte Element ersetzen, dann nach unten sieben (mit dem grösseren Kind tauschen).' },
    ],
    complexity: [
      { case: { en: 'Peek (find min/max)', de: 'Zugriff (Min/Max)' }, time: 'O(1)', space: 'O(n)', cls: 'best' },
      { case: { en: 'Insert / Extract', de: 'Einfügen / Entnehmen' }, time: 'O(log n)', space: 'O(n)', cls: 'avg' },
      { case: { en: 'Build heap from array', de: 'Heap aus Array bauen' }, time: 'O(n)', space: 'O(1)', cls: 'best', note: { en: 'Building a heap is O(n), not O(n log n) - a favourite exam subtlety. Search for an arbitrary value is still O(n).', de: 'Einen Heap zu bauen ist O(n), nicht O(n log n) - eine beliebte Prüfungsfeinheit. Suche nach beliebigem Wert ist weiterhin O(n).' } },
    ],
    pitfalls: [
      { en: 'A heap is <strong>not</strong> sorted and <strong>not</strong> a BST - only the parent/child order holds. Searching it is O(n).', de: 'Ein Heap ist <strong>nicht</strong> sortiert und <strong>kein</strong> BST - nur die Elter/Kind-Ordnung gilt. Suche ist O(n).' },
      { en: 'Index math: children 2i+1, 2i+2; parent (i-1)/2 (0-based). Off-by-one here is a classic bug.', de: 'Index-Mathematik: Kinder 2i+1, 2i+2; Elter (i-1)/2 (0-basiert). Off-by-one ist ein klassischer Fehler.' },
    ],
  },
  'trie': {
    tldr: { en: 'A tree where each edge is a character, so a word is a path from the root. Lookup and insert are <strong>O(m)</strong> in the word length m - <strong>independent of how many words are stored</strong>. Trades memory for blazing prefix queries.', de: 'Ein Baum, in dem jede Kante ein Zeichen ist, sodass ein Wort ein Pfad von der Wurzel ist. Nachschlagen und Einfügen sind <strong>O(m)</strong> in der Wortlänge m - <strong>unabhängig von der Anzahl gespeicherter Wörter</strong>. Tauscht Speicher gegen blitzschnelle Präfixabfragen.' },
    when: { en: 'Autocomplete, spell-checkers, IP routing tables, and any "find all words with this prefix" task. Use when you have many strings sharing prefixes.', de: 'Autovervollständigung, Rechtschreibprüfung, IP-Routing-Tabellen und jede „finde alle Wörter mit diesem Präfix"-Aufgabe.' },
    how: [
      { en: 'Each node has up to k children, one per possible character.', de: 'Jeder Knoten hat bis zu k Kinder, eines pro möglichem Zeichen.' },
      { en: 'Insert: follow/create one edge per character; mark the final node as a word end.', de: 'Einfügen: pro Zeichen eine Kante folgen/erstellen; den letzten Knoten als Wortende markieren.' },
      { en: 'Lookup/prefix: walk the characters; if any edge is missing, it is not present.', de: 'Nachschlagen/Präfix: die Zeichen ablaufen; fehlt eine Kante, ist es nicht vorhanden.' },
    ],
    complexity: [
      { case: { en: 'Insert / Search / Prefix', de: 'Einfügen / Suchen / Präfix' }, time: 'O(m)', space: 'O(ALPHABET∗N)', cls: 'best', note: { en: 'm = length of the key. Independent of N, the number of stored words. The cost is memory: up to k pointers per node.', de: 'm = Länge des Schlüssels. Unabhängig von N, der Anzahl Wörter. Der Preis ist Speicher: bis zu k Zeiger pro Knoten.' } },
    ],
    pitfalls: [
      { en: 'Time is O(m), the key length - <strong>not</strong> O(log n). This independence from N is the whole point.', de: 'Zeit ist O(m), die Schlüssellänge - <strong>nicht</strong> O(log n). Diese Unabhängigkeit von N ist der Kern.' },
    ],
  },
  'linked-list': {
    tldr: { en: 'A chain of nodes where each holds a value and a pointer to the next (and, if doubly linked, the previous). <strong>O(1) insert/delete at a known position</strong>, but <strong>O(n) to find anything</strong> - the opposite trade-off to an array.', de: 'Eine Kette von Knoten, die je einen Wert und einen Zeiger auf den nächsten (und, wenn doppelt verkettet, den vorigen) halten. <strong>O(1) Einfügen/Löschen an bekannter Position</strong>, aber <strong>O(n), um etwas zu finden</strong> - der umgekehrte Kompromiss zum Array.' },
    when: { en: 'When you insert/delete a lot at the ends or at a held position and rarely need random access - queues, stacks, adjacency lists, the free list in an allocator.', de: 'Wenn du viel an den Enden oder an gehaltener Position einfügst/löschst und selten wahlfreien Zugriff brauchst - Warteschlangen, Stapel, Adjazenzlisten.' },
    how: [
      { en: 'Singly linked: each node points to next; you can only walk forward.', de: 'Einfach verkettet: jeder Knoten zeigt auf next; nur vorwärts laufbar.' },
      { en: 'Doubly linked: each node points to next and prev; you can walk both ways and delete in O(1) given the node.', de: 'Doppelt verkettet: jeder Knoten zeigt auf next und prev; in beide Richtungen laufbar, Löschen in O(1) bei gegebenem Knoten.' },
      { en: 'Insert at head: point the new node at the old head, move head. No shifting, unlike an array.', de: 'Am Kopf einfügen: neuen Knoten auf alten Kopf zeigen, Kopf verschieben. Kein Verschieben wie beim Array.' },
    ],
    paper: [
      { en: 'Draw each node as a box with the value and arrows to next (and prev if doubly linked). Mark head and tail.', de: 'Jeden Knoten als Kasten mit Wert und Pfeilen zu next (und prev bei doppelt) zeichnen. Kopf und Schwanz markieren.' },
      { en: 'To delete a node: redraw the neighbor arrows to skip it. For a doubly linked list update BOTH directions.', de: 'Zum Löschen: die Nachbarpfeile neu zeichnen, sodass der Knoten übersprungen wird. Bei doppelter Liste BEIDE Richtungen.' },
    ],
    cpp: { caption: { en: 'Standard implementation:', de: 'Standard-Implementierung:' }, code: `struct Element { int key; Element *prev, *next; };

void insertAtHead(Element*& head, Element*& tail, int value) {
    Element* n = new Element{value, nullptr, head};
    if (head) head->prev = n;
    else      tail = n;        // list was empty
    head = n;
}` },
    complexity: [
      { case: { en: 'Access / Search', de: 'Zugriff / Suche' }, time: 'O(n)', space: 'O(n)', cls: 'worst' },
      { case: { en: 'Insert / Delete at head or tail', de: 'Einf./Löschen an Kopf/Schwanz' }, time: 'O(1)', space: 'O(n)', cls: 'best' },
      { case: { en: 'Insert / Delete at known node', de: 'Einf./Löschen an bekanntem Knoten' }, time: 'O(1)', space: 'O(n)', cls: 'best', note: { en: 'Compare with an array: array access is O(1) but middle insert is O(n); a list is the reverse.', de: 'Vergleich mit Array: Array-Zugriff O(1), aber Einfügen in der Mitte O(n); Liste umgekehrt.' } },
    ],
    pitfalls: [
      { en: 'No random access: getting the i-th element is O(n). This is the key array-vs-list exam contrast.', de: 'Kein wahlfreier Zugriff: das i-te Element zu holen ist O(n). Der zentrale Array-vs-Liste-Kontrast.' },
      { en: 'Always update <strong>both</strong> prev and next when deleting from a doubly linked list, or you corrupt it.', de: 'Beim Löschen aus einer doppelt verketteten Liste <strong>beide</strong> Zeiger (prev und next) aktualisieren, sonst beschädigt.' },
    ],
  },
  'stack-queue': {
    tldr: { en: 'Two restricted lists. A <strong>stack</strong> is LIFO (last in, first out) - push/pop at one end. A <strong>queue</strong> is FIFO (first in, first out) - add at the back, remove at the front. Both are <strong>O(1)</strong> for their operations.', de: 'Zwei eingeschränkte Listen. Ein <strong>Stapel</strong> ist LIFO (zuletzt rein, zürst raus) - push/pop an einem Ende. Eine <strong>Warteschlange</strong> ist FIFO (zürst rein, zürst raus). Beide sind <strong>O(1)</strong>.' },
    when: { en: 'Stack: function calls, undo, expression parsing, DFS. Queue: scheduling, buffering, BFS. A circular queue reuses a fixed array so the front/back wrap around.', de: 'Stapel: Funktionsaufrufe, Rückgängig, Ausdrucksparsing, DFS. Warteschlange: Scheduling, Pufferung, BFS. Ein Ringpuffer nutzt ein festes Array wieder.' },
    how: [
      { en: 'Stack: push adds to the top, pop removes from the top. Only the top is ever visible.', de: 'Stapel: push legt oben ab, pop nimmt oben weg. Nur die Spitze ist sichtbar.' },
      { en: 'Queue: enqueue adds to the rear, dequeue removes from the front.', de: 'Warteschlange: enqueue hinten anfügen, dequeue vorne entnehmen.' },
      { en: 'Circular queue: keep head and tail indices into a fixed array; wrap with modulo so space is reused.', de: 'Ringpuffer: Kopf- und Schwanzindex in ein festes Array; mit Modulo umbrechen, um Platz wiederzuverwenden.' },
    ],
    cpp: { caption: { en: 'Standard implementation:', de: 'Standard-Implementierung:' }, code: `void enqueue(int x) {
    int nextTail = (tail + 1) % MAX;   // wrap around
    if (nextTail == head) { /* full */ return; }
    buffer[tail] = x;
    tail = nextTail;
}` },
    complexity: [
      { case: { en: 'Push / Pop / Enqueue / Dequeue', de: 'Push / Pop / Enqueue / Dequeue' }, time: 'O(1)', space: 'O(n)', cls: 'best' },
      { case: { en: 'Search', de: 'Suche' }, time: 'O(n)', space: 'O(n)', cls: 'worst', note: { en: 'Both give O(1) for their defined operations. Searching inside them is not what they are for.', de: 'Beide bieten O(1) für ihre Operationen. Suche darin ist nicht ihr Zweck.' } },
    ],
    pitfalls: [
      { en: 'Stack = LIFO, Queue = FIFO. Mixing them up is the most basic exam slip.', de: 'Stapel = LIFO, Warteschlange = FIFO. Verwechslung ist der einfachste Prüfungsfehler.' },
      { en: 'Circular queue: distinguishing "full" from "empty" needs care (leave one slot or keep a count).', de: 'Ringpuffer: „voll" von „leer" zu unterscheiden braucht Sorgfalt (einen Platz frei lassen oder zählen).' },
    ],
  },
  'hash-table': {
    tldr: { en: 'Stores key-value pairs by running the key through a hash function to pick a bucket. <strong>O(1) average</strong> for insert/lookup/delete, but <strong>O(n) worst case</strong> when everything collides into one bucket. The average is why hash tables are everywhere.', de: 'Speichert Schlüssel-Wert-Paare, indem der Schlüssel durch eine Hashfunktion einen Behälter wählt. <strong>O(1) im Durchschnitt</strong> für Einfügen/Suchen/Löschen, aber <strong>O(n) im schlechtesten Fall</strong>, wenn alles in einen Behälter kollidiert.' },
    when: { en: 'The default for fast key-value lookup: dictionaries, sets, caches, database indexes, deduplication. Use unless you need sorted order (then use a balanced tree).', de: 'Der Standard für schnelles Schlussel-Wert-Nachschlagen: Wörterbücher, Mengen, Caches, DB-Indizes. Nutze es, ausser du brauchst sortierte Ordnung (dann balancierter Baum).' },
    how: [
      { en: 'A hash function maps each key to a bucket index.', de: 'Eine Hashfunktion bildet jeden Schlüssel auf einen Behälterindex ab.' },
      { en: 'Collisions (two keys, same bucket) are handled by chaining (a list per bucket) or open addressing (probe for the next free slot).', de: 'Kollisionen (zwei Schlüssel, ein Behälter) löst man durch Verkettung (Liste pro Behälter) oder offene Adressierung (nächsten freien Platz suchen).' },
      { en: 'Keep the load factor (items / buckets) low; resize and rehash when it grows.', de: 'Den Füllgrad (Elemente / Behälter) niedrig halten; bei Wachstum vergrössern und neu hashen.' },
    ],
    complexity: [
      { case: { en: 'Insert / Search / Delete - average', de: 'Einf./Suchen/Löschen - Durchschnitt' }, time: 'O(1)', space: 'O(n)', cls: 'best' },
      { case: { en: 'Insert / Search / Delete - worst', de: 'Einf./Suchen/Löschen - schlecht.' }, time: 'O(n)', space: 'O(n)', cls: 'worst', note: { en: 'Worst case = all keys collide into one bucket (bad hash function). A good hash function keeps it O(1) amortized.', de: 'Schlechtester Fall = alle Schlüssel kollidieren in einem Behälter (schlechte Hashfunktion). Eine gute Hashfunktion hält es bei O(1) amortisiert.' } },
    ],
    pitfalls: [
      { en: 'Hash tables have <strong>no order</strong> - you cannot iterate keys sorted. Need order? Use a balanced BST.', de: 'Hashtabellen haben <strong>keine Ordnung</strong> - Schlüssel nicht sortiert durchlaufbar. Brauchst du Ordnung? Balancierter BST.' },
      { en: 'Worst case is O(n); the O(1) is average and depends on a good hash + low load factor.', de: 'Schlechtester Fall ist O(n); das O(1) ist Durchschnitt und hängt von gutem Hash + niedrigem Füllgrad ab.' },
    ],
  },
}

// Sorting + graph content (extracted). Part of the CONTENT aggregate.
export const sortingGraphsContent = {

  // ============================== SORTING ==============================
  'bubble-sort': {
    tldr: {
      en: 'Sorts by repeatedly swapping adjacent elements that are in the wrong order. <strong>Dead simple, but O(n²)</strong> - only ever used to teach the idea, never in real code. Stable.',
      de: 'Sortiert durch wiederholtes Tauschen benachbarter Elemente in falscher Reihenfolge. <strong>Kinderleicht, aber O(n²)</strong> - nur zur Veranschaulichung, nie in echtem Code. Stabil.',
    },
    when: {
      en: 'Effectively never in practice. Know it because it is the canonical first sort and a common exam warm-up. Its one redeeming property: it can detect an already-sorted array in O(n) with an early-exit flag.',
      de: 'In der Praxis praktisch nie. Man kennt es, weil es der klassische erste Sortieralgorithmus und ein häufiger Prüfungseinstieg ist. Sein einziger Vorteil: Mit einem Früh-Abbruch-Flag erkennt es ein bereits sortiertes Array in O(n).',
    },
    how: [
      { en: 'Walk through the array comparing each pair of adjacent elements.', de: 'Gehe durch das Array und vergleiche jedes benachbarte Paar.' },
      { en: 'If a pair is out of order, swap it.', de: 'Steht ein Paar falsch herum, tausche es.' },
      { en: 'After one full pass the largest element has "bubbled" to the end.', de: 'Nach einem Durchlauf ist das größte Element ans Ende „aufgestiegen".' },
      { en: 'Repeat for the remaining unsorted part until no swaps happen.', de: 'Wiederhole für den restlichen unsortierten Teil, bis kein Tausch mehr nötig ist.' },
    ],
    complexity: [
      { case: { en: 'Best (sorted)', de: 'Bester (sortiert)' }, time: 'O(n)', space: 'O(1)', cls: 'best', note: { en: 'Best case O(n) only if you add the early-exit "swapped?" flag.', de: 'Bester Fall O(n) nur mit Früh-Abbruch-Flag „getauscht?".' } },
      { case: { en: 'Average', de: 'Durchschnitt' }, time: 'O(n²)', space: 'O(1)', cls: 'avg' },
      { case: { en: 'Worst', de: 'Schlechtester' }, time: 'O(n²)', space: 'O(1)', cls: 'worst' },
    ],
    pitfalls: [
      { en: 'Without the early-exit flag, best case is still O(n²) - a common exam gotcha.', de: 'Ohne Früh-Abbruch-Flag ist der beste Fall weiterhin O(n²) - eine häufige Prüfungsfalle.' },
      { en: 'It is <strong>stable</strong> (equal elements keep their order). Selection sort is not.', de: 'Es ist <strong>stabil</strong> (gleiche Elemente behalten ihre Reihenfolge). Selection Sort nicht.' },
    ],
  },

  'selection-sort': {
    tldr: {
      en: 'Repeatedly finds the smallest remaining element and swaps it into place. <strong>Always O(n²)</strong>, even on sorted input, but does the <strong>fewest swaps</strong> of any sort (n-1). Not stable.',
      de: 'Sucht wiederholt das kleinste verbleibende Element und tauscht es an seinen Platz. <strong>Immer O(n²)</strong>, auch bei sortierter Eingabe, aber mit den <strong>wenigsten Tauschvorgängen</strong> (n-1). Nicht stabil.',
    },
    when: {
      en: 'When swaps are expensive (e.g. writing to flash memory) and the data set is small, because it does at most n-1 swaps total. Otherwise it is a teaching algorithm.',
      de: 'Wenn Tauschvorgänge teuer sind (z. B. Schreiben in Flash-Speicher) und die Datenmenge klein ist, da es höchstens n-1 Tauschvorgänge macht. Sonst ein Lehralgorithmus.',
    },
    how: [
      { en: 'Find the smallest element in the unsorted part.', de: 'Finde das kleinste Element im unsortierten Teil.' },
      { en: 'Swap it with the first unsorted position.', de: 'Tausche es mit der ersten unsortierten Position.' },
      { en: 'That position is now sorted; move the boundary one step right and repeat.', de: 'Diese Position ist nun sortiert; verschiebe die Grenze und wiederhole.' },
    ],
    complexity: [
      { case: { en: 'Best', de: 'Bester' }, time: 'O(n²)', space: 'O(1)', cls: 'avg', note: { en: 'Comparisons are always n(n-1)/2 regardless of input - there is no best case.', de: 'Vergleiche sind immer n(n-1)/2, unabhängig von der Eingabe - es gibt keinen besten Fall.' } },
      { case: { en: 'Average', de: 'Durchschnitt' }, time: 'O(n²)', space: 'O(1)', cls: 'avg' },
      { case: { en: 'Worst', de: 'Schlechtester' }, time: 'O(n²)', space: 'O(1)', cls: 'worst' },
    ],
    pitfalls: [
      { en: 'Unlike bubble/insertion sort, sorted input does <strong>not</strong> make it faster.', de: 'Anders als Bubble-/Insertion Sort wird es bei sortierter Eingabe <strong>nicht</strong> schneller.' },
      { en: 'Not stable in its standard swap form.', de: 'In der Standard-Tauschform nicht stabil.' },
    ],
  },

  'insertion-sort': {
    tldr: {
      en: 'Builds the sorted array one element at a time, inserting each new value into its correct spot among those already sorted. <strong>O(n²) worst case but O(n) on nearly-sorted data</strong> - genuinely the best choice for small or almost-sorted arrays. Stable.',
      de: 'Baut das sortierte Array Element für Element auf und fügt jeden neuen Wert an die richtige Stelle ein. <strong>O(n²) im schlechtesten Fall, aber O(n) bei fast sortierten Daten</strong> - die beste Wahl für kleine oder fast sortierte Arrays. Stabil.',
    },
    when: {
      en: 'Small arrays (most libraries switch to it below ~16 elements), data that arrives in a stream, or input that is already nearly sorted. This is the "reduce and conquer" example from the course.',
      de: 'Kleine Arrays (viele Bibliotheken wechseln unter ~16 Elementen dazu), Daten als Datenstrom oder fast sortierte Eingaben. Das „Reduce-and-Conquer"-Beispiel der Vorlesung.',
    },
    how: [
      { en: 'Treat the first element as a sorted region of size 1.', de: 'Behandle das erste Element als sortierten Bereich der Größe 1.' },
      { en: 'Take the next element (the "key").', de: 'Nimm das nächste Element (den „Schlüssel").' },
      { en: 'Shift every larger sorted element one step right to make a gap.', de: 'Verschiebe jedes größere sortierte Element nach rechts, um eine Lücke zu schaffen.' },
      { en: 'Drop the key into the gap. Repeat for all elements.', de: 'Setze den Schlüssel in die Lücke. Wiederhole für alle Elemente.' },
    ],
    complexity: [
      { case: { en: 'Best (sorted)', de: 'Bester (sortiert)' }, time: 'O(n)', space: 'O(1)', cls: 'best', note: { en: 'On nearly-sorted input it is close to linear - its key strength.', de: 'Bei fast sortierter Eingabe nahezu linear - seine zentrale Stärke.' } },
      { case: { en: 'Average', de: 'Durchschnitt' }, time: 'O(n²)', space: 'O(1)', cls: 'avg' },
      { case: { en: 'Worst (reversed)', de: 'Schlechtester (umgekehrt)' }, time: 'O(n²)', space: 'O(1)', cls: 'worst' },
    ],
    pitfalls: [
      { en: 'Stable and in-place - a frequent comparison point against selection sort.', de: 'Stabil und in-place - häufiger Vergleichspunkt mit Selection Sort.' },
    ],
  },

  'merge-sort': {
    tldr: {
      en: 'Splits the array in half, sorts each half recursively, then merges the two sorted halves. <strong>Guaranteed O(n log n) always, and stable</strong> - but needs O(n) extra memory, unlike quicksort. The textbook divide-and-conquer sort.',
      de: 'Teilt das Array, sortiert beide Hälften rekursiv und mischt sie zusammen. <strong>Garantiert immer O(n log n) und stabil</strong> - braucht aber O(n) zusätzlichen Speicher, anders als Quicksort. Der Lehrbuch-Sortieralgorithmus für Teile-und-herrsche.',
    },
    when: {
      en: 'When you need a guaranteed worst case (quicksort can degrade to O(n²)), when stability matters, or when sorting linked lists (merge sort needs no random access). Also the basis of external sorting for data too big for RAM.',
      de: 'Wenn ein garantierter schlechtester Fall nötig ist (Quicksort kann zu O(n²) entarten), wenn Stabilität zählt oder beim Sortieren verketteter Listen (kein wahlfreier Zugriff nötig). Auch Grundlage des externen Sortierens.',
    },
    how: [
      { en: 'If the range has 0 or 1 elements, it is already sorted - return.', de: 'Hat der Bereich 0 oder 1 Element, ist er sortiert - zurück.' },
      { en: 'Split the range at the middle into left and right halves.', de: 'Teile den Bereich in der Mitte in linke und rechte Hälfte.' },
      { en: 'Recursively sort each half.', de: 'Sortiere jede Hälfte rekursiv.' },
      { en: 'Merge: repeatedly take the smaller front element of the two halves into the output.', de: 'Mischen: nimm wiederholt das kleinere vordere Element beider Hälften in die Ausgabe.' },
    ],
    complexity: [
      { case: { en: 'Best', de: 'Bester' }, time: 'O(n log n)', space: 'O(n)', cls: 'best' },
      { case: { en: 'Average', de: 'Durchschnitt' }, time: 'O(n log n)', space: 'O(n)', cls: 'best' },
      { case: { en: 'Worst', de: 'Schlechtester' }, time: 'O(n log n)', space: 'O(n)', cls: 'avg', note: { en: 'Same in all cases - the recursion depth is always log n. The cost is the O(n) auxiliary array.', de: 'In allen Fällen gleich - die Rekursionstiefe ist stets log n. Der Preis ist das O(n)-Hilfsarray.' } },
    ],
    pitfalls: [
      { en: 'The extra O(n) memory is the standard exam answer for "why not always use merge sort?"', de: 'Der zusätzliche O(n)-Speicher ist die Standardantwort auf „Warum nicht immer Merge Sort?"' },
      { en: 'Stable if you break merge ties by taking from the left half first.', de: 'Stabil, wenn man beim Mischen Gleichstände zuerst aus der linken Hälfte nimmt.' },
    ],
  },

  'quick-sort': {
    tldr: {
      en: 'Picks a pivot, partitions the array so smaller values go left and larger go right, then recurses on each side. <strong>Fastest in practice and sorts in place</strong>, but O(n²) worst case on bad pivots, and not stable. The other divide-and-conquer sort.',
      de: 'Wählt ein Pivot, partitioniert das Array (kleiner links, größer rechts) und rekursiert auf beiden Seiten. <strong>In der Praxis am schnellsten und in-place</strong>, aber O(n²) im schlechtesten Fall bei schlechten Pivots, und nicht stabil.',
    },
    when: {
      en: 'The default general-purpose sort in most standard libraries (often as introsort, which switches to heap sort if recursion gets too deep, dodging the O(n²) trap). Use when average speed and low memory matter more than worst-case guarantees.',
      de: 'Der Standard-Sortieralgorithmus der meisten Bibliotheken (oft als Introsort, das bei zu tiefer Rekursion auf Heap Sort wechselt und so die O(n²)-Falle umgeht). Gut, wenn Durchschnittstempo und wenig Speicher wichtiger sind als Garantien.',
    },
    how: [
      { en: 'Choose a pivot (here, the last element).', de: 'Wähle ein Pivot (hier das letzte Element).' },
      { en: 'Partition: scan the range, moving every element ≤ pivot to the left side.', de: 'Partitioniere: durchlaufe den Bereich und schiebe jedes Element ≤ Pivot nach links.' },
      { en: 'Swap the pivot into the boundary - it is now in its final sorted position.', de: 'Tausche das Pivot an die Grenze - es steht nun an seiner endgültigen Position.' },
      { en: 'Recurse on the left and right partitions.', de: 'Rekursiere auf der linken und rechten Partition.' },
    ],
    cpp: {
      caption: { en: 'Standard implementation:', de: 'Standard-Implementierung:' },
      code: `int partition(int* a, int lo, int hi) {
    int pivot = a[hi];
    int i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (a[j] <= pivot) {
            i++;
            std::swap(a[i], a[j]);
        }
    }
    std::swap(a[i + 1], a[hi]);
    return i + 1;
}

void quickSort(int* a, int lo, int hi) {
    if (lo < hi) {
        int p = partition(a, lo, hi);
        quickSort(a, lo, p - 1);
        quickSort(a, p + 1, hi);
    }
}`,
    },
    complexity: [
      { case: { en: 'Best', de: 'Bester' }, time: 'O(n log n)', space: 'O(log n)', cls: 'best' },
      { case: { en: 'Average', de: 'Durchschnitt' }, time: 'O(n log n)', space: 'O(log n)', cls: 'best' },
      { case: { en: 'Worst', de: 'Schlechtester' }, time: 'O(n²)', space: 'O(log n)', cls: 'worst', note: { en: 'Worst case hits when the pivot is always the smallest/largest (e.g. already-sorted input with last-element pivot). Random or median-of-three pivots avoid it.', de: 'Der schlechteste Fall tritt ein, wenn das Pivot stets das kleinste/größte ist (z. B. sortierte Eingabe mit Letztes-Element-Pivot). Zufalls- oder Median-of-Three-Pivots vermeiden ihn.' } },
    ],
    pitfalls: [
      { en: '<strong>Already-sorted input is the worst case</strong> with a naive last-element pivot - counterintuitive and a classic exam question.', de: '<strong>Sortierte Eingabe ist der schlechteste Fall</strong> bei naivem Letztes-Element-Pivot - unerwartet und eine klassische Prüfungsfrage.' },
      { en: 'Not stable. In-place (only O(log n) stack for recursion).', de: 'Nicht stabil. In-place (nur O(log n) Stack für die Rekursion).' },
    ],
  },

  'heap-sort': {
    tldr: {
      en: 'Builds a max-heap from the array, then repeatedly swaps the root (the max) to the end and re-heapifies. <strong>Guaranteed O(n log n) and in-place</strong> - merge sort\'s time bound without its memory cost - but not stable and slower in practice than quicksort.',
      de: 'Baut einen Max-Heap, tauscht wiederholt die Wurzel (das Maximum) ans Ende und stellt die Heap-Eigenschaft wieder her. <strong>Garantiert O(n log n) und in-place</strong> - Merge Sorts Zeitschranke ohne Speicherkosten - aber nicht stabil und praktisch langsamer als Quicksort.',
    },
    when: {
      en: 'When you need an in-place sort with a guaranteed O(n log n) worst case and cannot spare merge sort\'s memory. Also the fallback inside introsort. The same heap structure powers priority queues.',
      de: 'Wenn ein in-place-Sortieren mit garantiertem O(n log n) nötig ist und Merge Sorts Speicher fehlt. Auch der Rückfall in Introsort. Dieselbe Heap-Struktur treibt Prioritätswarteschlangen an.',
    },
    how: [
      { en: 'Build a max-heap: heapify every internal node from the bottom up.', de: 'Baue einen Max-Heap: heapifiziere jeden inneren Knoten von unten nach oben.' },
      { en: 'The maximum is now at the root (index 0).', de: 'Das Maximum steht nun an der Wurzel (Index 0).' },
      { en: 'Swap the root with the last element of the heap and shrink the heap by one.', de: 'Tausche die Wurzel mit dem letzten Heap-Element und verkleinere den Heap um eins.' },
      { en: 'Heapify the new root to restore the heap, and repeat.', de: 'Heapifiziere die neue Wurzel und wiederhole.' },
    ],
    complexity: [
      { case: { en: 'Best', de: 'Bester' }, time: 'O(n log n)', space: 'O(1)', cls: 'best' },
      { case: { en: 'Average', de: 'Durchschnitt' }, time: 'O(n log n)', space: 'O(1)', cls: 'best' },
      { case: { en: 'Worst', de: 'Schlechtester' }, time: 'O(n log n)', space: 'O(1)', cls: 'best', note: { en: 'Building the heap is O(n), then n extractions of O(log n) each. In-place.', de: 'Heap-Aufbau ist O(n), dann n Entnahmen zu je O(log n). In-place.' } },
    ],
    pitfalls: [
      { en: 'Building the heap is O(n), not O(n log n) - a popular exam subtlety.', de: 'Der Heap-Aufbau ist O(n), nicht O(n log n) - eine beliebte Prüfungsfeinheit.' },
      { en: 'Not stable. Parent of index i is (i-1)/2; children are 2i+1 and 2i+2.', de: 'Nicht stabil. Elter von Index i ist (i-1)/2; Kinder sind 2i+1 und 2i+2.' },
    ],
  },

  'counting-sort': {
    tldr: {
      en: 'Sorts <strong>without any comparisons</strong> by counting how many times each value occurs, then writing values back in order. <strong>O(n + k) for k = value range</strong> - beats the O(n log n) comparison-sort limit, but only works for small integer keys. Stable.',
      de: 'Sortiert <strong>ohne jeden Vergleich</strong>, indem es zählt, wie oft jeder Wert vorkommt, und die Werte dann der Reihe nach zurückschreibt. <strong>O(n + k) bei Wertebereich k</strong> - schlägt die O(n log n)-Grenze, funktioniert aber nur für kleine ganzzahlige Schlüssel. Stabil.',
    },
    when: {
      en: 'When keys are integers in a small known range (e.g. ages 0-120, bytes 0-255). It is also the stable subroutine inside radix sort. Useless if the range k is much larger than n.',
      de: 'Wenn Schlüssel ganze Zahlen in kleinem, bekanntem Bereich sind (z. B. Alter 0-120, Bytes 0-255). Auch die stabile Teilroutine in Radix Sort. Nutzlos, wenn der Bereich k viel größer als n ist.',
    },
    how: [
      { en: 'Find the max value to size a count array of length k+1.', de: 'Finde den Maximalwert, um ein Zähl-Array der Länge k+1 anzulegen.' },
      { en: 'For each input element, increment count[value].', de: 'Erhöhe für jedes Element count[Wert].' },
      { en: 'Walk the count array in order, writing each value count[value] times back to the array.', de: 'Durchlaufe das Zähl-Array und schreibe jeden Wert count[Wert]-mal zurück.' },
    ],
    cpp: {
      caption: { en: 'Standard implementation:', de: 'Standard-Implementierung:' },
      code: `void countingSort(int *A, int numberCount) {
    int min = findMin(A, numberCount);
    int max = findMax(A, numberCount);
    int range = max - min + 1;
    int *count = new int[range]();
    for (int i = 0; i < numberCount; i++) count[A[i] - min]++;
    int idx = 0;
    for (int v = 0; v < range; v++)
        while (count[v]-- > 0) A[idx++] = v + min;
    delete[] count;
}`,
    },
    complexity: [
      { case: { en: 'All cases', de: 'Alle Fälle' }, time: 'O(n + k)', space: 'O(k)', cls: 'best', note: { en: 'k is the size of the value range. When k = O(n), this is linear. When k ≫ n, it is wasteful.', de: 'k ist die Größe des Wertebereichs. Bei k = O(n) ist es linear. Bei k ≫ n verschwenderisch.' } },
    ],
    pitfalls: [
      { en: 'Not a comparison sort, so the O(n log n) lower bound does not apply.', de: 'Kein Vergleichssortierer, daher gilt die O(n log n)-Untergrenze nicht.' },
      { en: 'Memory grows with the value range k, not the element count n.', de: 'Der Speicher wächst mit dem Wertebereich k, nicht mit der Elementzahl n.' },
    ],
  },

  // ============================== GRAPHS ==============================
  'bfs': {
    tldr: {
      en: 'Explores a graph <strong>level by level</strong> from a start node using a queue. On an unweighted graph it finds the <strong>shortest path in number of edges</strong>. Contrast DFS, which dives deep first.',
      de: 'Erkundet einen Graphen <strong>Ebene für Ebene</strong> vom Startknoten mit einer Warteschlange. In einem ungewichteten Graphen findet es den <strong>kürzesten Weg in Kantenzahl</strong>. Gegensatz zu DFS, das zuerst in die Tiefe geht.',
    },
    when: {
      en: 'Shortest path in an unweighted graph, finding all nodes within k steps, level-order traversal, or testing bipartiteness. Use a queue (FIFO).',
      de: 'Kürzester Weg in ungewichteten Graphen, alle Knoten innerhalb k Schritten, Ebenen-Traversierung oder Bipartitheitstest. Nutze eine Warteschlange (FIFO).',
    },
    how: [
      { en: 'Put the start node in a queue and mark it seen.', de: 'Startknoten in eine Warteschlange legen und als gesehen markieren.' },
      { en: 'Dequeue a node, visit it.', de: 'Einen Knoten entnehmen und besuchen.' },
      { en: 'Enqueue all its unseen neighbors (recording their predecessor).', de: 'Alle ungesehenen Nachbarn einreihen (Vorgänger merken).' },
      { en: 'Repeat until the queue is empty.', de: 'Wiederholen, bis die Warteschlange leer ist.' },
    ],
    complexity: [
      { case: { en: 'All cases', de: 'Alle Fälle' }, time: 'O(V + E)', space: 'O(V)', cls: 'best', note: { en: 'Adjacency list: every vertex and edge touched once.', de: 'Adjazenzliste: jeder Knoten und jede Kante wird einmal berührt.' } },
    ],
    pitfalls: [
      { en: 'BFS gives shortest paths only on <strong>unweighted</strong> graphs. With weights you need Dijkstra.', de: 'BFS liefert kürzeste Wege nur in <strong>ungewichteten</strong> Graphen. Mit Gewichten brauchst du Dijkstra.' },
      { en: 'Mark nodes seen <strong>when enqueuing</strong>, not when dequeuing, or you may enqueue duplicates.', de: 'Markiere Knoten <strong>beim Einreihen</strong>, nicht beim Entnehmen, sonst reihst du Duplikate ein.' },
    ],
  },

  'dfs': {
    tldr: {
      en: 'Explores a graph by going <strong>as deep as possible</strong> before backtracking, using a stack (or recursion). Does <strong>not</strong> find shortest paths, but is the backbone of cycle detection, topological sort, and connected components.',
      de: 'Erkundet einen Graphen, indem es <strong>so tief wie möglich</strong> geht, bevor es zurückgeht - mit einem Stapel (oder Rekursion). Findet <strong>keine</strong> kürzesten Wege, ist aber die Basis von Zyklenerkennung, topologischer Sortierung und Zusammenhangskomponenten.',
    },
    when: {
      en: 'Cycle detection, topological sorting, finding connected components, maze generation, and any problem that needs to fully explore one branch before another. Use a stack (LIFO) or recursion.',
      de: 'Zyklenerkennung, topologische Sortierung, Zusammenhangskomponenten, Labyrintherzeugung und jedes Problem, das einen Zweig vollständig erkunden muss. Nutze einen Stapel (LIFO) oder Rekursion.',
    },
    how: [
      { en: 'Visit the start node.', de: 'Startknoten besuchen.' },
      { en: 'Recurse into its first unvisited neighbor (go deep).', de: 'In den ersten unbesuchten Nachbarn rekursieren (in die Tiefe).' },
      { en: 'When stuck, backtrack to the last node with an unvisited neighbor.', de: 'Wenn es nicht weitergeht, zum letzten Knoten mit unbesuchtem Nachbarn zurück.' },
      { en: 'Continue until all reachable nodes are visited.', de: 'Weiter, bis alle erreichbaren Knoten besucht sind.' },
    ],
    complexity: [
      { case: { en: 'All cases', de: 'Alle Fälle' }, time: 'O(V + E)', space: 'O(V)', cls: 'best', note: { en: 'Recursion depth can reach O(V) - watch the stack on large graphs.', de: 'Die Rekursionstiefe kann O(V) erreichen - Vorsicht mit dem Stack bei großen Graphen.' } },
    ],
    pitfalls: [
      { en: 'DFS does <strong>not</strong> give shortest paths, even when unweighted - a frequent confusion with BFS.', de: 'DFS liefert <strong>keine</strong> kürzesten Wege, auch ungewichtet nicht - häufige Verwechslung mit BFS.' },
      { en: 'Recursive DFS = an explicit stack. Both are valid; know the conversion.', de: 'Rekursives DFS = expliziter Stapel. Beides gültig; kenne die Umwandlung.' },
    ],
  },

  'dijkstra': {
    tldr: {
      en: 'Finds the <strong>shortest path from one source</strong> to all nodes in a graph with <strong>non-negative</strong> edge weights. It greedily finalizes the closest unvisited node each round. <strong>Negative weights break it</strong> - use Bellman-Ford for those.',
      de: 'Findet den <strong>kürzesten Weg von einer Quelle</strong> zu allen Knoten in einem Graphen mit <strong>nicht-negativen</strong> Kantengewichten. Es finalisiert gierig pro Runde den nächstgelegenen unbesuchten Knoten. <strong>Negative Gewichte zerstören es</strong> - dafür Bellman-Ford.',
    },
    when: {
      en: 'Single-source shortest paths with non-negative weights: routing, maps, network latency. With a binary heap it runs in O((V+E) log V). If you need all pairs, use Floyd-Warshall; if weights can be negative, use Bellman-Ford.',
      de: 'Kürzeste Wege von einer Quelle mit nicht-negativen Gewichten: Routing, Karten, Netzwerklatenz. Mit Binärheap O((V+E) log V). Für alle Paare Floyd-Warshall; bei negativen Gewichten Bellman-Ford.',
    },
    how: [
      { en: 'Set dist[source] = 0 and every other dist = ∞.', de: 'Setze dist[Quelle] = 0 und alle anderen dist = ∞.' },
      { en: 'Pick the unfinished node with the smallest dist and finalize it.', de: 'Wähle den unfertigen Knoten mit kleinster dist und finalisiere ihn.' },
      { en: 'Relax each of its edges: if dist[u] + w(u,v) &lt; dist[v], update dist[v] and pred[v].', de: 'Relaxiere jede seiner Kanten: wenn dist[u] + w(u,v) &lt; dist[v], aktualisiere dist[v] und pred[v].' },
      { en: 'Repeat until every node is finalized.', de: 'Wiederhole, bis jeder Knoten finalisiert ist.' },
    ],
    cpp: {
      caption: { en: 'The relaxation step is the core (dist = distance, pred = predecessor, INF = infinity):', de: 'Der Relaxationsschritt ist der Kern (dist = Distanz, pred = Vorgaenger, INF = unendlich):' },
      code: `// relax edge u -> v with weight C[u][v]
if (dist[u] != INF && dist[u] + C[u][v] < dist[v]) {
    dist[v] = dist[u] + C[u][v];
    pred[v] = u;
}

// Dijkstra: each round, finalize the closest unfinished node, then relax it.
for (int iter = 0; iter < n; iter++) {
    int u = -1, best = INF;
    for (int i = 0; i < n; i++)
        if (!done[i] && dist[i] < best) { best = dist[i]; u = i; }
    if (u == -1) break;
    done[u] = true;
    for (int v = 0; v < n; v++)
        if (C[u][v] && !done[v] && dist[u] + C[u][v] < dist[v]) {
            dist[v] = dist[u] + C[u][v];
            pred[v] = u;
        }
}`,
    },
    complexity: [
      { case: { en: 'Array (this demo)', de: 'Array (diese Demo)' }, time: 'O(V²)', space: 'O(V)', cls: 'avg' },
      { case: { en: 'Binary heap', de: 'Binärheap' }, time: 'O((V+E) log V)', space: 'O(V)', cls: 'best' },
      { case: { en: 'Fibonacci heap', de: 'Fibonacci-Heap' }, time: 'O(E + V log V)', space: 'O(V)', cls: 'best', note: { en: 'The V² array version is fine for dense graphs; the heap version wins on sparse ones.', de: 'Die V²-Array-Version ist für dichte Graphen gut; die Heap-Version gewinnt bei dünnen.' } },
    ],
    pitfalls: [
      { en: '<strong>Negative edge weights break Dijkstra</strong> - once a node is finalized it is never reconsidered. This is the #1 exam question. Use Bellman-Ford for negative edges.', de: '<strong>Negative Kantengewichte zerstören Dijkstra</strong> - ein finalisierter Knoten wird nie neu betrachtet. Die Prüfungsfrage Nr. 1. Bei negativen Kanten Bellman-Ford.' },
      { en: '<strong>Bellman-Ford</strong> uses the same relaxation but applies it to all edges n times, in any order. That different order is what lets it tolerate negative weights and detect negative cycles, at O(V∗E). Dijkstra is faster but cannot handle negatives.', de: '<strong>Bellman-Ford</strong> nutzt dieselbe Relaxation, wendet sie aber n-mal auf alle Kanten an, in beliebiger Reihenfolge. Diese andere Reihenfolge erlaubt negative Gewichte und erkennt negative Zyklen, in O(V∗E). Dijkstra ist schneller, vertraegt aber keine negativen Werte.' },
    ],
  },

  'floyd-warshall': {
    tldr: {
      en: 'Finds the shortest path between <strong>every pair of nodes</strong> at once, by allowing one more intermediate node each round. Two matrices evolve together: <strong>D</strong> (distances) and <strong>P</strong> (predecessors). O(V³). This is the "fill the table by hand" exam classic.',
      de: 'Findet den kürzesten Weg zwischen <strong>jedem Knotenpaar</strong> auf einmal, indem pro Runde ein weiterer Zwischenknoten erlaubt wird. Zwei Matrizen entwickeln sich gemeinsam: <strong>D</strong> (Distanzen) und <strong>P</strong> (Vorgänger). O(V³). Der „Tabelle von Hand ausfüllen"-Klassiker.',
    },
    when: {
      en: 'All-pairs shortest paths on a small, dense graph; also works with negative edges (but not negative cycles). If you only need one source, Dijkstra is faster. Distinct from Warshall\'s algorithm, which computes reachability (transitive closure), not distances.',
      de: 'Kürzeste Wege aller Paare auf kleinem, dichtem Graphen; funktioniert auch mit negativen Kanten (aber keine negativen Zyklen). Brauchst du nur eine Quelle, ist Dijkstra schneller. Zu unterscheiden von Warshalls Algorithmus, der Erreichbarkeit (transitive Hülle) berechnet, keine Distanzen.',
    },
    how: [
      { en: 'Initialize D = weight matrix (∞ where no edge, 0 on the diagonal).', de: 'Initialisiere D = Gewichtsmatrix (∞ ohne Kante, 0 auf der Diagonale).' },
      { en: 'For each intermediate node k from 0 to n-1:', de: 'Für jeden Zwischenknoten k von 0 bis n-1:' },
      { en: 'For every pair (i, j): if going i → k → j is shorter than D[i][j], update D[i][j] and set P[i][j] = P[k][j].', de: 'Für jedes Paar (i, j): wenn i → k → j kürzer ist als D[i][j], aktualisiere D[i][j] und setze P[i][j] = P[k][j].' },
      { en: 'After the last k, D holds all shortest distances.', de: 'Nach dem letzten k enthält D alle kürzesten Distanzen.' },
    ],
    pseudocode: `for k in 0..n-1:
  for i in 0..n-1:
    for j in 0..n-1:
      if D[i][k] + D[k][j] < D[i][j]:
        D[i][j] = D[i][k] + D[k][j]
        P[i][j] = P[k][j]          # predecessor matrix`,
    paper: [
      { en: 'Reading the shortest path from the <strong>P (predecessor) matrix</strong> is the exam task. P[i][j] = the node that comes <em>just before</em> j on the shortest path from i to j.', de: 'Den kürzesten Weg aus der <strong>P-(Vorgänger-)Matrix</strong> abzulesen ist die Prüfungsaufgabe. P[i][j] = der Knoten <em>unmittelbar vor</em> j auf dem kürzesten Weg von i nach j.' },
      { en: 'To reconstruct the path from i to j: start at j and walk <em>backwards</em>. Write j down. Look up p = P[i][j]; write p before it. Now look up P[i][p]; write that before. Repeat until you reach i.', de: 'Pfad von i nach j rekonstruieren: bei j beginnen und <em>rückwärts</em> laufen. j notieren. p = P[i][j] nachschlagen, davor schreiben. Dann P[i][p] nachschlagen, davor schreiben. Wiederholen, bis i erreicht ist.' },
      { en: 'Example: path from A to D. j=D, P[A][D]=C → "C D". Now P[A][C]=B → "B C D". Now P[A][B]=A → done: <strong>A B C D</strong>. The row stays i=A the whole time; only the column changes to the node you just prepended.', de: 'Beispiel: Pfad A nach D. j=D, P[A][D]=C → "C D". Dann P[A][C]=B → "B C D". Dann P[A][B]=A → fertig: <strong>A B C D</strong>. Die Zeile bleibt durchweg i=A; nur die Spalte wechselt zum gerade vorangestellten Knoten.' },
      { en: 'If P[i][j] is empty/NIL and i≠j, there is no path. If you only get the D matrix (no P), the distance is read directly as D[i][j] but you cannot reconstruct the actual route.', de: 'Ist P[i][j] leer/NIL und i≠j, gibt es keinen Pfad. Hast du nur die D-Matrix (kein P), liest du die Distanz direkt als D[i][j], kannst aber die Route nicht rekonstruieren.' },
    ],
    complexity: [
      { case: { en: 'All cases', de: 'Alle Fälle' }, time: 'O(V³)', space: 'O(V²)', cls: 'avg', note: { en: 'Three nested loops over all nodes. Simple to code and to trace by hand.', de: 'Drei verschachtelte Schleifen über alle Knoten. Einfach zu programmieren und von Hand nachzuvollziehen.' } },
    ],
    pitfalls: [
      { en: 'The loop order is <strong>k, then i, then j</strong> - k must be the outer loop. Swapping them is the most common mistake.', de: 'Die Schleifenreihenfolge ist <strong>k, dann i, dann j</strong> - k muss die äußere Schleife sein. Vertauschen ist der häufigste Fehler.' },
      { en: 'Handles negative edges but <strong>not negative cycles</strong> (a negative value on the diagonal signals one).', de: 'Verträgt negative Kanten, aber <strong>keine negativen Zyklen</strong> (ein negativer Wert auf der Diagonale zeigt einen an).' },
      { en: 'Do not confuse it with <strong>Warshall</strong>\'s transitive closure (booleans, reachability) - same triple loop, different update.', de: 'Nicht mit <strong>Warshalls</strong> transitiver Hülle verwechseln (Boolesche Werte, Erreichbarkeit) - gleiche Dreifachschleife, andere Aktualisierung.' },
    ],
  },

  'prim': {
    tldr: {
      en: 'Builds a <strong>minimum spanning tree</strong> by growing one tree from a start node, always adding the cheapest edge that reaches a new node. Greedy. Best for <strong>dense</strong> graphs. Contrast Kruskal, which sorts all edges instead.',
      de: 'Baut einen <strong>minimalen Spannbaum</strong>, indem ein Baum von einem Startknoten wächst und stets die billigste Kante zu einem neuen Knoten hinzugefügt wird. Gierig. Am besten für <strong>dichte</strong> Graphen. Gegensatz zu Kruskal, das stattdessen alle Kanten sortiert.',
    },
    when: {
      en: 'Minimum spanning tree on a dense graph. With a heap it is O(E log V). If the graph is sparse or edges are already sorted, Kruskal is often simpler.',
      de: 'Minimaler Spannbaum auf dichtem Graphen. Mit Heap O(E log V). Bei dünnem Graphen oder vorsortierten Kanten ist Kruskal oft einfacher.',
    },
    how: [
      { en: 'Start the tree with any single node.', de: 'Beginne den Baum mit einem beliebigen Knoten.' },
      { en: 'Look at all edges leaving the tree to a node outside it.', de: 'Betrachte alle Kanten, die den Baum zu einem äußeren Knoten verlassen.' },
      { en: 'Add the cheapest such edge (and the node it reaches).', de: 'Füge die billigste solche Kante hinzu (und den erreichten Knoten).' },
      { en: 'Repeat until every node is in the tree.', de: 'Wiederhole, bis jeder Knoten im Baum ist.' },
    ],
    complexity: [
      { case: { en: 'Binary heap', de: 'Binärheap' }, time: 'O(E log V)', space: 'O(V)', cls: 'best' },
      { case: { en: 'Adjacency matrix', de: 'Adjazenzmatrix' }, time: 'O(V²)', space: 'O(V)', cls: 'avg', note: { en: 'Both Prim and Kruskal always produce a valid MST; on equal weights the tree may differ but total weight is identical.', de: 'Prim und Kruskal liefern stets einen gültigen MST; bei gleichen Gewichten kann der Baum abweichen, das Gesamtgewicht ist identisch.' } },
    ],
    pitfalls: [
      { en: 'Prim grows <strong>one connected tree</strong>; Kruskal may have several fragments that merge. Know the difference.', de: 'Prim lässt <strong>einen zusammenhängenden Baum</strong> wachsen; Kruskal kann mehrere Fragmente haben, die verschmelzen. Kenne den Unterschied.' },
    ],
  },

  'kruskal': {
    tldr: {
      en: 'Builds a <strong>minimum spanning tree</strong> by sorting all edges by weight and adding each one unless it would form a cycle (checked with union-find). Greedy. Best for <strong>sparse</strong> graphs. Contrast Prim, which grows a single tree.',
      de: 'Baut einen <strong>minimalen Spannbaum</strong>, indem alle Kanten nach Gewicht sortiert und einzeln hinzugefügt werden, sofern kein Zyklus entsteht (geprüft mit Union-Find). Gierig. Am besten für <strong>dünne</strong> Graphen. Gegensatz zu Prim, das einen einzelnen Baum wachsen lässt.',
    },
    when: {
      en: 'Minimum spanning tree on a sparse graph, or when edges are already sorted. The union-find structure makes cycle checks nearly O(1).',
      de: 'Minimaler Spannbaum auf dünnem Graphen oder bei vorsortierten Kanten. Die Union-Find-Struktur macht Zyklusprüfungen nahezu O(1).',
    },
    how: [
      { en: 'Sort every edge by weight, ascending.', de: 'Sortiere jede Kante aufsteigend nach Gewicht.' },
      { en: 'Take the next cheapest edge.', de: 'Nimm die nächstbilligste Kante.' },
      { en: 'If its two endpoints are in different components, add it (union them).', de: 'Wenn die Endpunkte in verschiedenen Komponenten sind, füge sie hinzu (vereinige sie).' },
      { en: 'If they are already connected, skip it (it would make a cycle). Stop at V-1 edges.', de: 'Sind sie schon verbunden, überspringe sie (Zyklus). Stoppe bei V-1 Kanten.' },
    ],
    cpp: {
      caption: { en: 'Standard implementation:', de: 'Standard-Implementierung:' },
      code: `struct Edge { int u, v, cost; };

int find(int* parent, int x) {
    while (parent[x] != x) x = parent[x];
    return x;
}

// edges sorted ascending by cost (sorted ascending by cost)
for (int i = 0; i < edgeCount; i++) {
    int ru = find(parent, edges[i].u);
    int rv = find(parent, edges[i].v);
    if (ru != rv) {              // no cycle -> add to MST
        parent[ru] = rv;
        mst.push_back(edges[i]);
    }
}`,
    },
    complexity: [
      { case: { en: 'All cases', de: 'Alle Fälle' }, time: 'O(E log E)', space: 'O(V)', cls: 'best', note: { en: 'Dominated by sorting the edges. Union-find adds only near-constant overhead.', de: 'Dominiert vom Sortieren der Kanten. Union-Find verursacht nur nahezu konstanten Mehraufwand.' } },
    ],
    pitfalls: [
      { en: 'You <strong>must</strong> use union-find (or equivalent) to detect cycles - a plain "is v visited" check is wrong here.', de: 'Du <strong>musst</strong> Union-Find (oder Äquivalent) zur Zyklenerkennung nutzen - eine einfache „ist v besucht"-Prüfung ist hier falsch.' },
      { en: 'Add path compression to find() to keep it near O(1).', de: 'Füge Pfadkompression zu find() hinzu, um es nahe O(1) zu halten.' },
    ],
  },

  'radix-sort': {
    tldr: {
      en: 'Sorts integers <strong>digit by digit</strong>, from least-significant to most, using a stable counting sort on each digit. <strong>O(d∗(n+b))</strong> for d digits and base b - linear when the numbers are bounded. The trick: it only works because the per-digit sort is stable.',
      de: 'Sortiert ganze Zahlen <strong>Ziffer für Ziffer</strong>, von der niederwertigsten zur höchsten, mit einem stabilen Counting Sort je Ziffer. <strong>O(d∗(n+b))</strong> bei d Ziffern und Basis b - linear bei beschränkten Zahlen. Der Clou: es funktioniert nur, weil die Ziffernsortierung stabil ist.',
    },
    when: {
      en: 'Large sets of fixed-width integers or strings (e.g. 32-bit numbers, IDs). Beats comparison sorts when the key length d is small relative to log n.',
      de: 'Große Mengen ganzzahliger Schlüssel fester Breite oder Zeichenketten (z. B. 32-Bit-Zahlen, IDs). Schlägt Vergleichssortierer, wenn die Schlüssellänge d klein gegenüber log n ist. Deine ARA-Version sortiert bitweise (Basis 2).',
    },
    how: [
      { en: 'Start with the least-significant digit (the ones).', de: 'Beginne mit der niederwertigsten Ziffer (den Einern).' },
      { en: 'Stably sort all numbers by just that digit (counting sort).', de: 'Sortiere alle Zahlen stabil nach nur dieser Ziffer (Counting Sort).' },
      { en: 'Move to the next digit and stably sort again.', de: 'Gehe zur nächsten Ziffer und sortiere erneut stabil.' },
      { en: 'After the most-significant digit, the array is fully sorted.', de: 'Nach der höchstwertigen Ziffer ist das Array vollständig sortiert.' },
    ],
    cpp: {
      caption: { en: 'Standard implementation:', de: 'Standard-Implementierung:' },
      code: `void radixSort(unsigned char *A, int numberCount) {
    unsigned char *B = new unsigned char[numberCount];
    for (int k = 0; k < 8; k++) {           // one pass per bit
        int C[2] = {0, 0};
        for (int i = 0; i < numberCount; i++) C[(A[i] >> k) & 1]++;
        C[1] += C[0];                        // prefix sum
        for (int i = numberCount - 1; i >= 0; i--)
            B[--C[(A[i] >> k) & 1]] = A[i];  // stable placement
        std::swap(A, B);
    }
    delete[] B;
}`,
    },
    complexity: [
      { case: { en: 'All cases', de: 'Alle Fälle' }, time: 'O(d∗(n+b))', space: 'O(n+b)', cls: 'best', note: { en: 'd = number of digits, b = base. With fixed-width keys d and b are constants, giving O(n).', de: 'd = Ziffernzahl, b = Basis. Bei fester Breite sind d und b konstant, also O(n).' } },
    ],
    pitfalls: [
      { en: 'The per-digit sort <strong>must be stable</strong> or the whole thing breaks - the #1 exam point.', de: 'Die Ziffernsortierung <strong>muss stabil sein</strong>, sonst bricht alles zusammen - der wichtigste Prüfungspunkt.' },
      { en: 'LSD (least-significant-digit) goes right-to-left; MSD goes left-to-right. Know which you are using.', de: 'LSD (niederwertigste Ziffer zuerst) läuft rechts-nach-links; MSD links-nach-rechts. Wisse, welche du nutzt.' },
    ],
  },

}

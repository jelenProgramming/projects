// Content for the remaining visual pages + compression/crypto read pages.
export const vizExtraContent = {
  'astar': {
    tldr: { en: 'A* finds the shortest path like Dijkstra but adds a <strong>heuristic</strong> (an estimate of remaining distance) to explore toward the goal first. With an admissible heuristic it is optimal AND faster than Dijkstra.', de: 'A* findet den kuerzesten Weg wie Dijkstra, ergaenzt aber eine <strong>Heuristik</strong> (Schaetzung der Restdistanz), um zielgerichtet zu suchen. Mit zulaessiger Heuristik optimal UND schneller.' },
    when: { en: 'Game pathfinding, robot navigation, maps. Use over Dijkstra whenever you can estimate distance to the goal (e.g. straight-line distance on a grid).', de: 'Pathfinding in Spielen, Roboternavigation, Karten. Besser als Dijkstra, wenn man die Restdistanz schaetzen kann.' },
    how: [
      { en: 'Each node gets f = g + h: g = cost so far, h = estimated cost to the goal.', de: 'Jeder Knoten bekommt f = g + h: g = bisherige Kosten, h = geschaetzte Restkosten.' },
      { en: 'Always expand the node with the smallest f.', de: 'Immer den Knoten mit kleinstem f expandieren.' },
      { en: 'If h never overestimates (admissible), the first time you reach the goal is the optimal path.', de: 'Ueberschaetzt h nie (zulaessig), ist der erste Zielerreich der optimale Pfad.' },
    ],
    complexity: [
      { case: { en: 'Worst case', de: 'Schlechtester Fall' }, time: 'O(E)', space: 'O(V)', cls: 'avg', note: { en: 'With h=0, A* IS Dijkstra. A perfect heuristic makes it explore almost only the path. Quality of h decides real speed.', de: 'Mit h=0 IST A* Dijkstra. Eine perfekte Heuristik laesst es fast nur den Pfad erkunden.' } },
    ],
    pitfalls: [
      { en: 'If the heuristic overestimates, A* can return a non-optimal path. Admissibility (never overestimate) is required for optimality.', de: 'Ueberschaetzt die Heuristik, kann A* einen nicht-optimalen Pfad liefern. Zulaessigkeit ist Pflicht.' },
    ],
  },
  'recursion': {
    tldr: { en: 'A function that calls itself, breaking a problem into smaller copies of itself until a <strong>base case</strong> stops it. Elegant for trees, divide-and-conquer and anything self-similar - but each call uses stack space.', de: 'Eine Funktion, die sich selbst aufruft und das Problem bis zu einem <strong>Basisfall</strong> verkleinert. Elegant fuer Baeume und Teile-und-herrsche - kostet aber Stack.' },
    when: { en: 'Tree/graph traversal, divide-and-conquer (merge sort, quicksort), backtracking, and problems with a naturally recursive definition (factorial, Fibonacci, Hanoi). Anything you can phrase as "solve a smaller version".', de: 'Baum-/Graphdurchlauf, Teile-und-herrsche, Backtracking und natuerlich rekursive Definitionen.' },
    how: [
      { en: 'Define the base case: the smallest input you can answer directly (sum of empty list = 0).', de: 'Basisfall definieren: die kleinste direkt beantwortbare Eingabe (Summe leerer Liste = 0).' },
      { en: 'Define the recursive case in terms of a smaller input: sum(list) = first + sum(rest).', de: 'Rekursionsfall ueber kleinere Eingabe: sum(liste) = erstes + sum(rest).' },
      { en: 'Each call adds a frame to the call stack; returns unwind it back up.', de: 'Jeder Aufruf legt einen Rahmen auf den Stack; Rueckgaben wickeln ihn ab.' },
    ],
    paper: [
      { en: 'Draw a box for each call with its argument. When a call makes another, draw a new box below it (the stack growing).', de: 'Pro Aufruf einen Kasten mit Argument zeichnen. Ruft er weiter, einen neuen Kasten darunter (wachsender Stack).' },
      { en: 'When a call hits the base case, write its return value and pass it up to the box above. Unwind until the first call returns.', de: 'Trifft ein Aufruf den Basisfall, Rueckgabewert notieren und nach oben reichen. Abwickeln bis zum ersten Aufruf.' },
      { en: 'For tree recursion (Fibonacci), the boxes form a tree - that branching is why naive Fibonacci is exponential.', de: 'Bei Baumrekursion (Fibonacci) bilden die Kaesten einen Baum - diese Verzweigung macht naives Fibonacci exponentiell.' },
    ],
    complexity: [
      { case: { en: 'Depends on recurrence', de: 'Haengt von der Rekurrenz ab' }, time: 'varies', space: 'O(depth)', cls: 'avg', note: { en: 'Space is O(recursion depth) for the call stack. Tail recursion can sometimes be optimized to O(1) space.', de: 'Speicher ist O(Rekursionstiefe) fuer den Stack. Endrekursion kann manchmal auf O(1) optimiert werden.' } },
    ],
    pitfalls: [
      { en: 'A missing or unreachable base case causes infinite recursion → stack overflow. Always reduce toward the base case.', de: 'Ein fehlender Basisfall verursacht Endlosrekursion → Stack Overflow.' },
      { en: 'Naive recursion can re-compute the same subproblem exponentially (Fibonacci). Memoization or DP fixes it.', de: 'Naive Rekursion kann Teilprobleme exponentiell wiederholen (Fibonacci). Memoisation oder DP behebt es.' },
    ],
  },
  // ---- compression viz + reads ----
  'rle': {
    tldr: { en: 'Run-Length Encoding replaces a run of identical symbols with a count and the symbol (AAAA → 4A). Brilliant for long runs (simple graphics, fax), useless and even <strong>expanding</strong> on varied data.', de: 'Lauflaengenkodierung ersetzt einen Lauf gleicher Symbole durch Anzahl + Symbol (AAAA → 4A). Top bei langen Laeufen, nutzlos bei abwechslungsreichen Daten.' },
    when: { en: 'Data with long repeats: simple bitmap graphics, fax, run-heavy sensor data, and as a stage inside bigger schemes (e.g. after BWT, or in JPEG).', de: 'Daten mit langen Wiederholungen: einfache Grafiken, Fax, und als Stufe in groesseren Verfahren.' },
    how: [
      { en: 'Scan the input; count consecutive identical symbols.', de: 'Eingabe scannen; aufeinanderfolgende gleiche Symbole zaehlen.' },
      { en: 'Output (count, symbol) for each run.', de: '(Anzahl, Symbol) pro Lauf ausgeben.' },
    ],
    complexity: [
      { case: { en: 'Encode / Decode', de: 'Kodieren / Dekodieren' }, time: 'O(n)', space: 'O(n)', cls: 'best', note: { en: 'Worst case (no repeats) the output is LARGER than the input - a real risk you must guard against.', de: 'Schlechtester Fall (keine Wiederholungen): die Ausgabe ist GROESSER als die Eingabe.' } },
    ],
    pitfalls: [
      { en: 'On data with no runs, RLE expands the data. Real formats add an escape so they never grow much.', de: 'Bei Daten ohne Laeufe vergroessert RLE die Daten. Echte Formate nutzen ein Escape-Zeichen.' },
    ],
  },
  'huffman': {
    tldr: { en: 'Builds an <strong>optimal prefix code</strong>: frequent symbols get short bit-codes, rare ones long, by repeatedly merging the two least-frequent nodes into a tree. No code is a prefix of another, so decoding is unambiguous.', de: 'Baut einen <strong>optimalen Praefixcode</strong>: haeufige Symbole kurz, seltene lang, durch wiederholtes Verschmelzen der zwei seltensten Knoten. Kein Code ist Praefix eines anderen.' },
    when: { en: 'The backbone of DEFLATE (ZIP, PNG, gzip), JPEG and MP3. Use whenever symbol frequencies are skewed and you want optimal per-symbol coding.', de: 'Das Rueckgrat von DEFLATE (ZIP, PNG, gzip), JPEG und MP3.' },
    how: [
      { en: 'Count each symbol\'s frequency; make each a leaf node.', de: 'Haeufigkeit jedes Symbols zaehlen; jedes als Blatt.' },
      { en: 'Repeatedly merge the two lowest-frequency nodes into a parent (sum of frequencies) until one tree remains.', de: 'Wiederholt die zwei seltensten Knoten zu einem Elter (Summe) verschmelzen, bis ein Baum bleibt.' },
      { en: 'Read codes off the tree: left = 0, right = 1. Frequent symbols sit shallow → short codes.', de: 'Codes vom Baum ablesen: links = 0, rechts = 1. Haeufige Symbole liegen flach → kurze Codes.' },
    ],
    paper: [
      { en: 'List symbols with frequencies. Repeatedly pick the two smallest, draw a node joining them labelled with their sum, and put that sum back in the list.', de: 'Symbole mit Haeufigkeiten auflisten. Wiederholt die zwei kleinsten waehlen, einen Knoten mit ihrer Summe zeichnen und die Summe zurueck in die Liste.' },
      { en: 'When one node remains, label every left edge 0 and right edge 1; each symbol\'s code is the path from the root.', de: 'Bleibt ein Knoten, jede linke Kante 0, rechte 1 beschriften; der Code jedes Symbols ist der Pfad von der Wurzel.' },
    ],
    complexity: [
      { case: { en: 'Build (with heap)', de: 'Bauen (mit Heap)' }, time: 'O(n log n)', space: 'O(n)', cls: 'best', note: { en: 'n = number of distinct symbols. Optimal among per-symbol prefix codes; arithmetic coding can beat it by coding fractional bits.', de: 'n = Anzahl verschiedener Symbole. Optimal unter Praefixcodes; arithmetische Kodierung schlaegt es mit Bruchteil-Bits.' } },
    ],
    pitfalls: [
      { en: 'The prefix property (no code is a prefix of another) is what makes it decodable - that is the whole point of the tree.', de: 'Die Praefix-Eigenschaft macht es dekodierbar - das ist der Sinn des Baums.' },
    ],
  },
  'lzw': {
    tldr: { en: 'Builds a <strong>dictionary</strong> of substrings as it reads, outputting a code per known phrase and adding the phrase+next-char as a new entry. No dictionary is sent - the decoder rebuilds it. Powers GIF and old Unix compress.', de: 'Baut beim Lesen ein <strong>Woerterbuch</strong> von Teilstrings, gibt pro bekannter Phrase einen Code aus und fuegt Phrase+naechstes Zeichen als Eintrag hinzu. Kein Woerterbuch wird gesendet.' },
    when: { en: 'GIF images, the Unix compress utility, PDF streams. Good for data with repeated substrings; needs no prior frequency analysis (single pass).', de: 'GIF-Bilder, Unix-compress, PDF-Streams. Gut bei wiederholten Teilstrings; kein Vorwissen noetig.' },
    how: [
      { en: 'Start with all single characters in the dictionary (codes 0-255).', de: 'Mit allen Einzelzeichen im Woerterbuch beginnen (Codes 0-255).' },
      { en: 'Read the longest string W already in the dictionary; output its code.', de: 'Den laengsten bereits enthaltenen String W lesen; seinen Code ausgeben.' },
      { en: 'Add W + (next character) as a new dictionary entry, then continue from that next character.', de: 'W + (naechstes Zeichen) als neuen Eintrag hinzufuegen, dann ab diesem Zeichen weiter.' },
    ],
    paper: [
      { en: 'Keep two columns: the current string W, and the dictionary. For each input char c: if W+c is known, extend W to W+c; else output code(W), add W+c with the next free code, and set W=c.', de: 'Zwei Spalten fuehren: aktueller String W und Woerterbuch. Pro Zeichen c: ist W+c bekannt, W zu W+c erweitern; sonst code(W) ausgeben, W+c mit naechstem Code hinzufuegen, W=c.' },
    ],
    complexity: [
      { case: { en: 'Encode / Decode', de: 'Kodieren / Dekodieren' }, time: 'O(n)', space: 'O(dict)', cls: 'best', note: { en: 'Single linear pass. The decoder reconstructs the same dictionary, so only codes are transmitted.', de: 'Ein linearer Durchlauf. Der Dekodierer rekonstruiert dasselbe Woerterbuch.' } },
    ],
    pitfalls: [
      { en: 'The decoder builds the dictionary one step behind the encoder - the tricky edge case is a code used the moment it is created.', de: 'Der Dekodierer baut das Woerterbuch einen Schritt versetzt - der Sonderfall ist ein Code, der im Moment seiner Erstellung genutzt wird.' },
    ],
  },
  'arithmetic': {
    tldr: { en: 'Encodes an entire message as a <strong>single fractional number</strong> in [0,1), narrowing the interval by each symbol\'s probability. Beats Huffman because it is not limited to whole-bit codes per symbol.', de: 'Kodiert eine ganze Nachricht als <strong>eine Bruchzahl</strong> in [0,1), indem jedes Symbol das Intervall nach seiner Wahrscheinlichkeit verengt. Schlaegt Huffman, da nicht an Ganz-Bit-Codes gebunden.' },
    when: { en: 'High-compression contexts: modern image/video codecs, where squeezing fractional bits per symbol matters. More complex than Huffman but tighter.', de: 'Hoch-Kompressions-Kontexte: moderne Bild-/Video-Codecs. Komplexer als Huffman, aber dichter.' },
    how: [
      { en: 'Assign each symbol a sub-interval of [0,1) sized by its probability.', de: 'Jedem Symbol ein Teilintervall von [0,1) nach Wahrscheinlichkeit zuweisen.' },
      { en: 'For each symbol, narrow the current interval to that symbol\'s sub-range.', de: 'Pro Symbol das aktuelle Intervall auf dessen Teilbereich verengen.' },
      { en: 'After the whole message, any number in the final tiny interval encodes it uniquely.', de: 'Nach der Nachricht codiert jede Zahl im finalen Intervall sie eindeutig.' },
    ],
    complexity: [
      { case: { en: 'Encode / Decode', de: 'Kodieren / Dekodieren' }, time: 'O(n)', space: 'O(1)', cls: 'best', note: { en: 'Approaches the information-theoretic entropy limit more closely than Huffman, at higher implementation complexity.', de: 'Naehert sich der Entropiegrenze staerker als Huffman, bei hoeherer Komplexitaet.' } },
    ],
    pitfalls: [
      { en: 'Naive implementations hit floating-point precision limits; real ones use integer arithmetic with renormalization.', de: 'Naive Implementierungen stossen an Gleitkomma-Grenzen; echte nutzen Ganzzahlarithmetik mit Renormalisierung.' },
    ],
  },
  'shannon-fano': {
    tldr: { en: 'An early prefix code: sort symbols by frequency, then recursively split them into two near-equal-probability halves (0 for one side, 1 for the other). Good, but <strong>not always optimal</strong> - Huffman superseded it.', de: 'Ein frueher Praefixcode: Symbole nach Haeufigkeit sortieren, dann rekursiv in zwei etwa gleich wahrscheinliche Haelften teilen. Gut, aber nicht immer optimal - Huffman loeste es ab.' },
    when: { en: 'Mostly of historical and educational value (it shows the top-down vs Huffman\'s bottom-up idea). Huffman is preferred in practice.', de: 'Vor allem historischer/didaktischer Wert (top-down vs Huffmans bottom-up). In der Praxis Huffman.' },
    how: [
      { en: 'Sort symbols by descending frequency.', de: 'Symbole nach absteigender Haeufigkeit sortieren.' },
      { en: 'Split the list into two parts with as equal total frequency as possible; assign 0 to one, 1 to the other.', de: 'Die Liste in zwei moeglichst gleich haeufige Teile spalten; 0 und 1 zuweisen.' },
      { en: 'Recurse on each part until single symbols remain.', de: 'Auf jeden Teil rekursieren, bis Einzelsymbole bleiben.' },
    ],
    complexity: [
      { case: { en: 'Build', de: 'Bauen' }, time: 'O(n log n)', space: 'O(n)', cls: 'avg', note: { en: 'Top-down splitting; Huffman\'s bottom-up merging guarantees optimality, Shannon-Fano does not.', de: 'Top-down-Teilung; Huffmans bottom-up garantiert Optimalitaet, Shannon-Fano nicht.' } },
    ],
    pitfalls: [
      { en: 'It can produce longer average codes than Huffman - the reason Huffman replaced it.', de: 'Es kann laengere Durchschnittscodes als Huffman erzeugen - daher abgeloest.' },
    ],
  },
  'lz77': {
    tldr: { en: 'LZ77 compresses by replacing repeated text with a <strong>(distance, length)</strong> pointer back into a sliding window of recent data. LZ78 instead builds an explicit dictionary. Together they seed almost all modern compressors.', de: 'LZ77 ersetzt wiederholten Text durch einen <strong>(Abstand, Laenge)</strong>-Zeiger in ein Schiebefenster. LZ78 baut ein explizites Woerterbuch.' },
    when: { en: 'LZ77 underlies DEFLATE (ZIP, gzip, PNG); LZ78 leads to LZW (GIF). Any general-purpose lossless compression starts here.', de: 'LZ77 liegt DEFLATE (ZIP, gzip, PNG) zugrunde; LZ78 fuehrt zu LZW (GIF).' },
    how: [
      { en: 'LZ77: keep a window of recent text. Find the longest match for the upcoming text within it; output (distance back, length, next char).', de: 'LZ77: ein Fenster behalten. Den laengsten Treffer darin finden; (Abstand, Laenge, naechstes Zeichen) ausgeben.' },
      { en: 'If no match, output the literal character.', de: 'Kein Treffer: das Zeichen literal ausgeben.' },
      { en: 'LZ78: build a dictionary of phrases; output (dictionary index, next char) and add the new phrase.', de: 'LZ78: ein Woerterbuch von Phrasen bauen; (Index, naechstes Zeichen) ausgeben und Phrase hinzufuegen.' },
    ],
    paper: [
      { en: 'LZ77: draw a vertical bar splitting "already seen" (search buffer) from "to come" (lookahead). For each step, find the longest lookahead prefix that appears in the search buffer; write (how far back, how long, next char); slide the bar right by length+1.', de: 'LZ77: einen Strich zwischen „gesehen" und „kommt" zeichnen. Den laengsten Lookahead-Praefix im Suchpuffer finden; (Abstand, Laenge, naechstes Zeichen) notieren; den Strich um Laenge+1 verschieben.' },
    ],
    complexity: [
      { case: { en: 'Encode (naive)', de: 'Kodieren (naiv)' }, time: 'O(n∗w)', space: 'O(w)', cls: 'avg', note: { en: 'w = window size; hashing speeds match-finding. Decoding is O(n) and trivially fast.', de: 'w = Fenstergroesse; Hashing beschleunigt die Suche. Dekodieren ist O(n).' } },
    ],
    pitfalls: [
      { en: 'A bigger window finds more matches (better ratio) but slows encoding - the core LZ77 trade-off.', de: 'Ein groesseres Fenster findet mehr Treffer, verlangsamt aber - der LZ77-Kompromiss.' },
    ],
  },
  'golomb': {
    tldr: { en: 'Golomb coding optimally encodes <strong>non-negative integers</strong> that follow a geometric distribution (lots of small values), using a parameter M to split each number into a quotient (unary) and remainder (binary). Used where small numbers dominate.', de: 'Golomb-Kodierung kodiert nicht-negative ganze Zahlen mit geometrischer Verteilung optimal, per Parameter M in Quotient (unaer) und Rest (binaer).' },
    when: { en: 'Encoding gaps/residuals that are usually small: image codecs (JPEG-LS), audio (FLAC), inverted-index gaps in search engines.', de: 'Kodierung meist kleiner Abstaende/Residuen: Bildcodecs (JPEG-LS), Audio (FLAC), Suchmaschinen-Indizes.' },
    how: [
      { en: 'Pick a parameter M (tuned to the data).', de: 'Einen Parameter M waehlen (auf die Daten abgestimmt).' },
      { en: 'For value n: write quotient q = n/M in unary, then remainder r = n mod M in binary.', de: 'Fuer Wert n: Quotient q = n/M unaer, dann Rest r = n mod M binaer.' },
      { en: 'Small numbers get short codes; the geometric assumption makes this near-optimal.', de: 'Kleine Zahlen erhalten kurze Codes; die geometrische Annahme macht es nahezu optimal.' },
    ],
    complexity: [
      { case: { en: 'Encode / Decode', de: 'Kodieren / Dekodieren' }, time: 'O(n)', space: 'O(1)', cls: 'best', note: { en: 'Golomb-Rice is the special case M = power of 2, making the remainder a plain bit field (very fast).', de: 'Golomb-Rice ist der Sonderfall M = Zweierpotenz, der Rest wird ein Bitfeld (sehr schnell).' } },
    ],
    pitfalls: [
      { en: 'The parameter M must match the data\'s distribution; a bad M wrecks the compression ratio.', de: 'Der Parameter M muss zur Verteilung passen; ein schlechtes M ruiniert die Kompression.' },
    ],
  },
  'bwt': {
    tldr: { en: 'The Burrows-Wheeler Transform <strong>reorders</strong> (doesn\'t compress) text so identical characters cluster together, making it far more compressible by RLE/MTF afterward. Reversible. The heart of bzip2.', de: 'Die Burrows-Wheeler-Transformation <strong>ordnet</strong> Text um (komprimiert nicht), sodass gleiche Zeichen sich gruppieren und danach per RLE/MTF besser komprimierbar sind. Umkehrbar. Kern von bzip2.' },
    when: { en: 'bzip2 compression and bioinformatics (BWT-based read alignment like BWA). Use as a preprocessing stage before an entropy coder.', de: 'bzip2 und Bioinformatik (BWT-basiertes Alignment). Als Vorstufe vor einem Entropiekodierer.' },
    how: [
      { en: 'Form all rotations of the string; sort them lexicographically.', de: 'Alle Rotationen des Strings bilden; lexikografisch sortieren.' },
      { en: 'The transform is the last column of the sorted rotation matrix.', de: 'Die Transformation ist die letzte Spalte der sortierten Rotationsmatrix.' },
      { en: 'It clusters repeated contexts together; a marker (or index) lets you invert it exactly.', de: 'Sie gruppiert wiederholte Kontexte; ein Index erlaubt exakte Umkehrung.' },
    ],
    complexity: [
      { case: { en: 'Transform', de: 'Transformation' }, time: 'O(n) - O(n log n)', space: 'O(n)', cls: 'avg', note: { en: 'Done well with a suffix array. It does not compress by itself - it makes the data more compressible.', de: 'Gut mit einem Suffixarray. Es komprimiert nicht selbst - es macht Daten komprimierbarer.' } },
    ],
    pitfalls: [
      { en: 'BWT alone changes size by zero - it only rearranges. The compression comes from the stage after it (MTF + RLE + entropy).', de: 'BWT allein aendert die Groesse nicht - es ordnet nur um. Die Kompression kommt aus der Folgestufe.' },
    ],
  },
  'suffix': {
    tldr: { en: 'A <strong>suffix array</strong> (sorted list of all suffix start positions) or <strong>suffix tree</strong> (trie of all suffixes) lets you answer substring queries in O(m). Ukkonen builds a suffix tree in O(n). Powerful but memory-heavy.', de: 'Ein <strong>Suffixarray</strong> (sortierte Startpositionen aller Suffixe) oder <strong>Suffixbaum</strong> beantwortet Teilstring-Abfragen in O(m). Ukkonen baut den Baum in O(n).' },
    when: { en: 'Fast repeated substring search, longest-common-substring, bioinformatics (genome indexing), and full-text indexes. Use when one text is queried many times.', de: 'Schnelle Teilstringsuche, laengster gemeinsamer Teilstring, Genom-Indizierung, Volltextindizes.' },
    how: [
      { en: 'Suffix array: list the starting index of every suffix, then sort them by the suffix they point to.', de: 'Suffixarray: den Startindex jedes Suffixes auflisten und nach dem Suffix sortieren.' },
      { en: 'Suffix tree: a compressed trie of all suffixes; any substring is a path from the root.', de: 'Suffixbaum: ein komprimierter Trie aller Suffixe; jeder Teilstring ist ein Pfad von der Wurzel.' },
      { en: 'Ukkonen\'s algorithm builds the suffix tree online in linear time.', de: 'Ukkonens Algorithmus baut den Suffixbaum online in linearer Zeit.' },
    ],
    complexity: [
      { case: { en: 'Build (suffix array)', de: 'Bauen (Suffixarray)' }, time: 'O(n log n)', space: 'O(n)', cls: 'avg' },
      { case: { en: 'Substring query', de: 'Teilstring-Abfrage' }, time: 'O(m)', space: 'O(n)', cls: 'best', note: { en: 'Suffix arrays use far less memory than suffix trees and are preferred in practice; Ukkonen builds trees in O(n).', de: 'Suffixarrays brauchen viel weniger Speicher als Suffixbaeume und werden bevorzugt.' } },
    ],
    pitfalls: [
      { en: 'Suffix trees are powerful but memory-hungry (often 10-20× the text). Suffix arrays are the practical choice.', de: 'Suffixbaeume sind maechtig, aber speicherhungrig. Suffixarrays sind die praktische Wahl.' },
    ],
  },
  // ---- crypto ----
  'caesar': {
    tldr: { en: 'Shifts every letter by a fixed amount (shift 3: A→D). Only 25 possible keys, so it falls instantly to brute force or frequency analysis. The "hello world" of cryptography, not real security.', de: 'Verschiebt jeden Buchstaben um einen festen Betrag (Verschiebung 3: A→D). Nur 25 Schluessel, faellt sofort durch Brute Force.' },
    when: { en: 'Teaching, puzzles (ROT13 to hide spoilers), and as the conceptual seed for the Vigenere cipher. Never for actual confidentiality.', de: 'Lehre, Raetsel (ROT13), und als Keim fuer die Vigenere-Chiffre. Nie fuer echte Vertraulichkeit.' },
    how: [
      { en: 'Map each letter to the one k positions later in the alphabet, wrapping Z→A.', de: 'Jeden Buchstaben k Positionen weiter abbilden, Z→A umbrechen.' },
      { en: 'Decrypt by shifting back by k.', de: 'Entschluesseln durch Rueckverschiebung um k.' },
    ],
    complexity: [
      { case: { en: 'Encrypt / Decrypt', de: 'Ver-/Entschluesseln' }, time: 'O(n)', space: 'O(1)', cls: 'best', note: { en: 'Brute-forcing all 25 keys is trivial. Letter frequencies survive the shift, so analysis breaks it instantly.', de: 'Alle 25 Schluessel durchzuprobieren ist trivial. Buchstabenhaeufigkeiten ueberleben.' } },
    ],
    pitfalls: [
      { en: 'It preserves letter frequencies, so even without brute force, frequency analysis cracks it.', de: 'Es erhaelt Buchstabenhaeufigkeiten, daher knackt Frequenzanalyse es.' },
    ],
  },
  'vigenere': {
    tldr: { en: 'Applies a different Caesar shift to each letter, cycling through a keyword. For centuries "unbreakable" because it flattens single-letter frequencies - until Kasiski found the key length via repeated patterns.', de: 'Wendet je Buchstabe eine andere Caesar-Verschiebung an, zyklisch per Schluesselwort. Lange „unknackbar", bis Kasiski die Schluessellaenge fand.' },
    when: { en: 'Historical interest and teaching polyalphabetic ciphers. The idea (a repeating key stream) lives on; the cipher itself is broken.', de: 'Historisches Interesse und Lehre polyalphabetischer Chiffren. Die Idee lebt weiter; die Chiffre ist gebrochen.' },
    how: [
      { en: 'Repeat the keyword across the message.', de: 'Das Schluesselwort ueber die Nachricht wiederholen.' },
      { en: 'Each letter is Caesar-shifted by its keyword letter (A=0, B=1, ...).', de: 'Jeder Buchstabe wird um seinen Schluesselbuchstaben verschoben.' },
      { en: 'The same plaintext letter encrypts differently at different positions - hiding simple frequencies.', de: 'Derselbe Klarbuchstabe wird je Position anders verschluesselt.' },
    ],
    complexity: [
      { case: { en: 'Encrypt / Decrypt', de: 'Ver-/Entschluesseln' }, time: 'O(n)', space: 'O(k)', cls: 'best', note: { en: 'Broken by the Kasiski examination: repeated ciphertext segments reveal the key length, reducing it to k Caesars.', de: 'Gebrochen durch Kasiski: wiederholte Segmente verraten die Schluessellaenge.' } },
    ],
    pitfalls: [
      { en: 'A short, repeating key is the weakness. Repetitions in the ciphertext leak the key length.', de: 'Ein kurzer, sich wiederholender Schluessel ist die Schwaeche.' },
    ],
  },
  'playfair': {
    tldr: { en: 'Encrypts letter <strong>pairs</strong> using a 5×5 key grid (I/J share a cell): same row → shift right, same column → shift down, otherwise → rectangle corners. Encrypting digraphs hides single-letter frequencies far better than Caesar.', de: 'Verschluesselt Buchstaben<strong>paare</strong> mit einem 5×5-Gitter (I/J teilen eine Zelle): gleiche Zeile → rechts, gleiche Spalte → runter, sonst → Rechteckecken.' },
    when: { en: 'Historical (used in WWI/WWII for tactical messages). Teaches digraph substitution. Not secure by modern standards.', de: 'Historisch (im 1./2. Weltkrieg). Lehrt Digramm-Substitution. Nicht modern sicher.' },
    how: [
      { en: 'Build a 5×5 grid from the keyword (unique letters first, then the rest; I and J share a cell).', de: 'Ein 5×5-Gitter aus dem Schluesselwort bauen (I und J teilen eine Zelle).' },
      { en: 'Split the message into letter pairs (insert an X between doubles).', de: 'Die Nachricht in Paare teilen (X zwischen Doppelte einfuegen).' },
      { en: 'Same row → each letter\'s right neighbor; same column → below; rectangle → swap to the other corners in the same row.', de: 'Gleiche Zeile → rechter Nachbar; gleiche Spalte → darunter; Rechteck → andere Ecken derselben Zeile.' },
    ],
    complexity: [
      { case: { en: 'Encrypt / Decrypt', de: 'Ver-/Entschluesseln' }, time: 'O(n)', space: 'O(1)', cls: 'best', note: { en: 'Stronger than monoalphabetic ciphers (it hides single-letter frequency), but digraph frequency analysis still breaks it.', de: 'Staerker als monoalphabetisch, aber Digramm-Frequenzanalyse knackt es.' } },
    ],
    pitfalls: [
      { en: 'I and J share one cell - forgetting that breaks both encryption and decryption.', de: 'I und J teilen eine Zelle - das zu vergessen bricht alles.' },
    ],
  },
  'adfgx': {
    tldr: { en: 'A WWI German cipher combining a 5×5 substitution (each letter → a pair from A,D,F,G,X) with a columnar <strong>transposition</strong> keyed by a word. The two-stage fractionation made it hard to break by hand.', de: 'Eine deutsche WK1-Chiffre: 5×5-Substitution (jeder Buchstabe → ein Paar aus A,D,F,G,X) plus spaltenweise <strong>Transposition</strong>. Die zweistufige Fraktionierung erschwerte das Brechen.' },
    when: { en: 'Historical interest; a clean example of combining substitution + transposition, which together are stronger than either alone.', de: 'Historisch; ein klares Beispiel fuer Substitution + Transposition kombiniert.' },
    how: [
      { en: 'Substitute each letter with its row+column labels (A,D,F,G,X) from a 5×5 key square.', de: 'Jeden Buchstaben durch seine Zeilen+Spalten-Label (A,D,F,G,X) ersetzen.' },
      { en: 'Write the resulting letters under a keyword, then read them out column by column in alphabetical key order (transposition).', de: 'Die Buchstaben unter ein Schluesselwort schreiben, dann spaltenweise in alphabetischer Reihenfolge auslesen.' },
    ],
    complexity: [
      { case: { en: 'Encrypt / Decrypt', de: 'Ver-/Entschluesseln' }, time: 'O(n)', space: 'O(n)', cls: 'avg', note: { en: 'The combination of fractionating substitution + transposition is what gave it strength for its era.', de: 'Die Kombination aus fraktionierender Substitution + Transposition gab ihm Staerke fuer seine Zeit.' } },
    ],
    pitfalls: [
      { en: 'Letters A,D,F,G,X were chosen because they sound very different in Morse code, reducing transmission errors.', de: 'A,D,F,G,X wurden gewaehlt, weil sie in Morse sehr verschieden klingen.' },
    ],
  },
  // ---- CS-core viz detail ----
  'sql-joins': {
    when: { en: 'Combining data spread across normalized tables - the everyday core of SQL. Whenever data was split (by normalization) you join it back to answer real questions.', de: 'Daten aus normalisierten Tabellen kombinieren - der Alltag von SQL.' },
    how: [
      { en: 'INNER JOIN: only rows that match in both tables.', de: 'INNER JOIN: nur Zeilen, die in beiden passen.' },
      { en: 'LEFT JOIN: all left rows, with NULLs where the right has no match. RIGHT JOIN: the mirror.', de: 'LEFT JOIN: alle linken Zeilen, NULL wo rechts kein Treffer. RIGHT JOIN: gespiegelt.' },
      { en: 'FULL OUTER JOIN: all rows from both sides, NULLs where either lacks a match.', de: 'FULL OUTER JOIN: alle Zeilen beider Seiten, NULL wo ein Treffer fehlt.' },
    ],
    pitfalls: [
      { en: 'A JOIN with a missing or wrong ON condition becomes a Cartesian product (every row × every row) - an accidental explosion.', de: 'Ein JOIN ohne korrekte ON-Bedingung wird ein kartesisches Produkt - eine versehentliche Explosion.' },
    ],
  },
  'number-systems': {
    when: { en: 'Reading memory dumps, colors (#FF8800), permissions, bit masks, and understanding how all data is ultimately binary. Foundational for systems work.', de: 'Speicherabbilder lesen, Farben (#FF8800), Bitmasken, und verstehen, dass alle Daten binaer sind.' },
    how: [
      { en: 'Binary: base 2, each digit a power of two (...8,4,2,1).', de: 'Binaer: Basis 2, jede Stelle eine Zweierpotenz.' },
      { en: 'Hex: base 16 (0-9, A-F); one hex digit = exactly 4 bits, so two hex digits = one byte.', de: 'Hex: Basis 16; eine Hex-Ziffer = 4 Bits, zwei = ein Byte.' },
      { en: 'To convert decimal→binary, repeatedly divide by 2 and read remainders bottom-up.', de: 'Dezimal→binaer: wiederholt durch 2 teilen, Reste von unten lesen.' },
    ],
    complexity: [
      { case: { en: 'Conversion', de: 'Umrechnung' }, time: 'O(bits)', space: 'O(1)', cls: 'best', note: { en: 'Hex exists because it maps cleanly onto binary (4 bits per digit), unlike decimal.', de: 'Hex existiert, weil es sauber auf Binaer abbildet (4 Bits pro Ziffer).' } },
    ],
    pitfalls: [
      { en: 'A leading 0x means hex, 0b means binary. Reading 10 as decimal ten when it is binary two is the classic slip.', de: '0x heisst hex, 0b binaer. 10 binaer ist zwei, nicht zehn.' },
    ],
  },
  'logic-gates': {
    when: { en: 'The physical basis of all computation: gates build adders, memory, and CPUs. Also mirrors boolean logic in code (&&, ||, !).', de: 'Die physische Basis aller Berechnung: Gatter bauen Addierer, Speicher, CPUs.' },
    how: [
      { en: 'AND: 1 only if both inputs are 1. OR: 1 if at least one is 1. NOT: flips the bit.', de: 'AND: 1 nur wenn beide 1. OR: 1 wenn mindestens eines 1. NOT: kippt das Bit.' },
      { en: 'XOR: 1 if the inputs differ. NAND/NOR: negated AND/OR - and NAND alone can build any circuit.', de: 'XOR: 1 wenn verschieden. NAND/NOR: negiertes AND/OR - NAND allein baut jede Schaltung.' },
      { en: 'A truth table lists the output for all 2ⁿ input combinations.', de: 'Eine Wahrheitstabelle listet die Ausgabe aller 2ⁿ Kombinationen.' },
    ],
    complexity: [
      { case: { en: 'Truth table', de: 'Wahrheitstabelle' }, time: '2^n rows', space: '-', cls: 'avg', note: { en: 'NAND and NOR are "universal" - any boolean function can be built from just one of them.', de: 'NAND und NOR sind „universell" - jede boolesche Funktion baubar aus nur einem.' } },
    ],
    pitfalls: [
      { en: 'XOR (differ) vs OR (at least one) is the pair people confuse - XOR is exclusive.', de: 'XOR (verschieden) vs OR (mindestens eines) wird verwechselt - XOR ist exklusiv.' },
    ],
  },
  'turing-machine': {
    when: { en: 'The theoretical model that defines what is computable at all. Anything a real computer can do, a Turing machine can do (Church-Turing thesis). Pure CS foundations.', de: 'Das theoretische Modell, das Berechenbarkeit definiert. Was ein realer Computer kann, kann eine Turingmaschine (Church-Turing-These).' },
    how: [
      { en: 'An infinite tape of cells, a head that reads/writes one cell and moves left/right, and a finite set of states.', de: 'Ein unendliches Band, ein Kopf der eine Zelle liest/schreibt und sich bewegt, und endliche Zustaende.' },
      { en: 'A transition rule says: given (state, symbol read) → write a symbol, move, change state.', de: 'Eine Regel: (Zustand, gelesenes Symbol) → Symbol schreiben, bewegen, Zustand wechseln.' },
      { en: 'It halts in an accept/reject state, or runs forever - which is itself undecidable (the halting problem).', de: 'Sie haelt im Akzeptier-/Ablehnzustand oder laeuft ewig - selbst unentscheidbar (Halteproblem).' },
    ],
    complexity: [
      { case: { en: 'Model', de: 'Modell' }, time: '-', space: '-', cls: 'best', note: { en: 'Equivalent in power to any modern computer. The halting problem proves some questions are uncomputable.', de: 'Gleich maechtig wie jeder moderne Computer. Das Halteproblem beweist Unberechenbarkeit.' } },
    ],
    pitfalls: [
      { en: 'It is a thought experiment, not a practical machine - its value is defining the limits of computation.', de: 'Es ist ein Gedankenexperiment, keine praktische Maschine - sein Wert ist die Grenze der Berechenbarkeit.' },
    ],
  },
  'http': {
    when: { en: 'Every web request and REST API. Knowing methods and status codes is daily bread for any web developer.', de: 'Jede Web-Anfrage und REST-API. Methoden und Statuscodes sind taeglich Brot.' },
    how: [
      { en: 'A request has a method (GET/POST/...), a path, headers, and an optional body.', de: 'Eine Anfrage hat Methode, Pfad, Header und optional einen Body.' },
      { en: 'A response has a status code, headers, and a body.', de: 'Eine Antwort hat Statuscode, Header und Body.' },
      { en: 'Status families: 2xx success, 3xx redirect, 4xx client error, 5xx server error.', de: 'Statusfamilien: 2xx Erfolg, 3xx Umleitung, 4xx Client-Fehler, 5xx Server-Fehler.' },
    ],
    pitfalls: [
      { en: 'GET should be safe and idempotent (no side effects); using GET to change data is a real bug and security risk.', de: 'GET sollte sicher und idempotent sein; GET zum Aendern von Daten ist ein Fehler und Sicherheitsrisiko.' },
    ],
  },
  'tcp-ip': {
    when: { en: 'The protocol under almost all reliable internet traffic (web, email, file transfer). The handshake explains connection latency and why TCP is "reliable".', de: 'Das Protokoll unter fast allem zuverlaessigen Internetverkehr. Der Handshake erklaert Latenz und Zuverlaessigkeit.' },
    how: [
      { en: 'SYN: client proposes a connection with an initial sequence number.', de: 'SYN: Client schlaegt eine Verbindung mit Anfangs-Sequenznummer vor.' },
      { en: 'SYN-ACK: server acknowledges and sends its own sequence number.', de: 'SYN-ACK: Server bestaetigt und sendet seine Sequenznummer.' },
      { en: 'ACK: client acknowledges; the connection is established and data flows reliably (with retransmission of lost packets).', de: 'ACK: Client bestaetigt; die Verbindung steht und Daten fliessen zuverlaessig.' },
    ],
    complexity: [
      { case: { en: 'Handshake', de: 'Handshake' }, time: '1 round trip', space: '-', cls: 'avg', note: { en: 'This setup cost is why TCP has latency; UDP skips it (no handshake, no reliability) for speed.', de: 'Diese Aufbaukosten verursachen Latenz; UDP ueberspringt sie fuer Tempo.' } },
    ],
    pitfalls: [
      { en: 'TCP guarantees order and delivery; UDP does not. Choosing TCP for real-time video adds harmful latency - match the protocol to the need.', de: 'TCP garantiert Reihenfolge und Zustellung; UDP nicht. TCP fuer Echtzeitvideo schadet.' },
    ],
  },
}

import { lazy } from 'react'
import { Sort, Graph, Tree, Grid, Text, Compress, Key, Layers, Book, Sigma, Function as FnIcon, Code, Database, Chip, Globe } from './components/Icons.jsx'

/**
 * THE REGISTRY - single source of truth for every topic in the app.
 * Adding a topic = add one entry here + (for visual ones) a component file at
 * src/algorithms/<category>/<slug>.jsx. "read" topics need only a content.js
 * entry; AlgoPage renders them automatically.
 */

export const CATEGORIES = [
  { id: 'sorting',      name: 'Sorting',              icon: Sort,     color: '#5eead4' },
  { id: 'graphs',       name: 'Graphs & Pathfinding', icon: Graph,    color: '#38bdf8' },
  { id: 'trees',        name: 'Trees & Structures',   icon: Tree,     color: '#818cf8' },
  { id: 'backtracking', name: 'Backtracking',         icon: Grid,     color: '#f472b6' },
  { id: 'strings',      name: 'String Algorithms',    icon: Text,     color: '#fbbf24' },
  { id: 'dp',           name: 'Dynamic Programming',  icon: Layers,   color: '#34d399' },
  { id: 'compression',  name: 'Compression & Coding', icon: Compress, color: '#a78bfa' },
  { id: 'crypto',       name: 'Cryptography',         icon: Key,      color: '#fb7185' },
  { id: 'divide',       name: 'Divide & Conquer',     icon: Book,     color: '#22d3ee' },
  { id: 'discrete',     name: 'Discrete Math',        icon: Sigma,    color: '#2dd4bf' },
  { id: 'calculus',     name: 'Calculus Essentials',  icon: FnIcon,   color: '#60a5fa' },
  { id: 'programming',  name: 'Programming Concepts', icon: Code,     color: '#f59e0b' },
  { id: 'databases',    name: 'Databases',            icon: Database, color: '#4ade80' },
  { id: 'systems',      name: 'Computer Systems',     icon: Chip,     color: '#fb923c' },
  { id: 'web',          name: 'Web Foundations',      icon: Globe,    color: '#22d3ee' },
]

const v = (slug, name, category, course, extra = {}) => ({ slug, name, category, kind: 'viz', course, ...extra })
const r = (slug, name, category, course, extra = {}) => ({ slug, name, category, kind: 'read', course, ...extra })

export const ALGORITHMS = [
  v('bubble-sort',    'Bubble Sort',    'sorting', 'extra',  { tagline: { en: 'The simplest swap-based sort', de: 'Der einfachste tauschbasierte Sortieralgorithmus', sl: 'Najpreprostejše urejanje z zamenjavami' } }),
  v('selection-sort', 'Selection Sort', 'sorting', 'extra',  { tagline: { en: 'Pick the smallest, repeat', de: 'Das Kleinste wählen, wiederholen', sl: 'Izberi najmanjšega, ponovi' } }),
  v('insertion-sort', 'Insertion Sort', 'sorting', 'AIPS',   { tagline: { en: 'Reduce-and-conquer sorting', de: 'Sortieren durch Einfügen', sl: 'Urejanje z vstavljanjem' } }),
  v('merge-sort',     'Merge Sort',     'sorting', 'AIPS',   { tagline: { en: 'Divide and conquer: sort by merging', de: 'Teile und herrsche: Sortieren durch Mischen', sl: 'Deli in vladaj: urejanje z zlivanjem' } }),
  v('quick-sort',     'Quick Sort',     'sorting', 'AIPS',   { tagline: { en: 'Divide and conquer: partition around a pivot', de: 'Teile und herrsche: Partitionieren um ein Pivot', sl: 'Deli in vladaj: razdelitev okoli pivota' } }),
  v('heap-sort',      'Heap Sort',      'sorting', 'AIPS',   { tagline: { en: 'Sort using a binary heap', de: 'Sortieren mit einem Binärheap', sl: 'Urejanje z binarno kopico' } }),
  v('counting-sort',  'Counting Sort',  'sorting', 'ARA',    { tagline: { en: 'Linear-time counting', de: 'Lineares Zählen', sl: 'Štetje v linearnem času' } }),
  v('radix-sort',     'Radix Sort',     'sorting', 'ARA',    { tagline: { en: 'Linear-time: digit by digit', de: 'Lineare Zeit: Ziffer für Ziffer', sl: 'Linearni čas: števko za števko' } }),

  v('bfs',            'Breadth-First Search', 'graphs', 'AIPS', { tagline: { en: 'Shortest path in hops', de: 'Kürzester Weg in Schritten', sl: 'Najkrajša pot po skokih' } }),
  v('dfs',            'Depth-First Search',   'graphs', 'AIPS', { tagline: { en: 'Go as deep as possible first', de: 'Zürst so tief wie möglich gehen', sl: 'Najprej čim globlje' } }),
  v('dijkstra',       'Dijkstra',             'graphs', 'AIPS', { tagline: { en: 'Shortest path with dist[] and pred[] arrays', de: 'Kürzester Weg mit dist[]- und pred[]-Arrays', sl: 'Najkrajša pot s poljema dist[] in pred[]' }, star: true }),
  v('floyd-warshall', 'Floyd-Warshall',       'graphs', 'AIPS', { tagline: { en: 'All-pairs: the two-matrix (D and P) exam classic', de: 'Alle Paare: der Zwei-Matrizen-Klassiker (D und P)', sl: 'Vsi pari: izpitni klasik z matrikama D in P' }, star: true }),
  v('prim',           'Prim MST',             'graphs', 'AIPS', { tagline: { en: 'Minimum spanning tree, grow from a node', de: 'Minimaler Spannbaum, von einem Knoten aus', sl: 'Minimalno vpeto drevo, rast iz vozlišča' } }),
  v('kruskal',        'Kruskal MST',          'graphs', 'AIPS', { tagline: { en: 'MST by sorting edges plus union-find', de: 'MST durch Kantensortierung plus Union-Find', sl: 'MST z urejanjem povezav in union-find' } }),
  v('astar',          'A* Pathfinding',       'graphs', 'extra',{ tagline: { en: 'Dijkstra plus a heuristic, on a grid', de: 'Dijkstra plus Heuristik, auf einem Raster', sl: 'Dijkstra s hevristiko na mreži' } }),

  v('bst',            'Binary Search Tree', 'trees', 'AIPS', { tagline: { en: 'Insert / search / delete', de: 'Einfügen / Suchen / Löschen', sl: 'Vstavljanje / iskanje / brisanje' } }),
  v('binary-heap',    'Binary Heap',        'trees', 'AIPS', { tagline: { en: 'Heapify and priority queue', de: 'Heapify und Prioritätswarteschlange', sl: 'Kopičenje in prednostna vrsta' } }),
  v('trie',           'Trie (prefix tree)', 'trees', 'ARA',  { tagline: { en: 'Prefix tree for strings', de: 'Präfixbaum für Zeichenketten', sl: 'Predponsko drevo za nize' } }),
  r('linked-list',    'Linked Lists',       'trees', 'AIPS', { tagline: { en: 'Singly and doubly linked', de: 'Einfach und doppelt verkettet', sl: 'Enojno in dvojno povezan seznam' } }),
  r('stack-queue',    'Stack & Queue',      'trees', 'AIPS', { tagline: { en: 'Stack, queue and circular queue', de: 'Stapel, Warteschlange und Ringpuffer', sl: 'Sklad, vrsta in krožna vrsta' } }),
  r('hash-table',     'Hash Table',         'trees', 'AIPS', { tagline: { en: 'Chaining and open addressing', de: 'Verkettung und offene Adressierung', sl: 'Veriženje in odprto naslavljanje' } }),

  v('n-queens',       'N-Queens',       'backtracking', 'AIPS', { tagline: { en: 'Place queens, backtrack on conflict', de: 'Damen setzen, bei Konflikt zurückverfolgen', sl: 'Postavi dame, sestopi ob konfliktu' } }),
  v('graph-coloring', 'Graph Coloring', 'backtracking', 'AIPS', { tagline: { en: 'Color nodes so neighbors differ', de: 'Knoten färben, sodass Nachbarn sich unterscheiden', sl: 'Pobarvaj vozlišča, da se sosedje razlikujejo' } }),
  v('sudoku',         'Sudoku Solver',  'backtracking', 'extra',{ tagline: { en: 'Classic backtracking', de: 'Klassisches Backtracking', sl: 'Klasično sestopanje' } }),

  v('naive-match',    'Naive Matching',   'strings', 'ARA', { tagline: { en: 'Brute-force pattern search', de: 'Brute-Force-Mustersuche', sl: 'Iskanje vzorca z grobo silo' } }),
  v('kmp',            'Knuth-Morris-Pratt','strings', 'ARA', { tagline: { en: 'Prefix function, never backtrack the text', de: 'Präfixfunktion, kein Zurückspringen im Text', sl: 'Predponska funkcija, brez vračanja po besedilu' } }),
  v('boyer-moore',    'Boyer-Moore',      'strings', 'ARA', { tagline: { en: 'Bad-character jumps', de: 'Sprünge per Bad-Character-Regel', sl: 'Skoki po slabem znaku' } }),
  v('rabin-karp',     'Rabin-Karp',       'strings', 'ARA', { tagline: { en: 'Rolling hash matching', de: 'Abgleich per rollendem Hash', sl: 'Ujemanje s kotalečim zgoščevanjem' } }),
  v('sunday',         'Sunday',           'strings', 'ARA', { tagline: { en: 'Shift by the char just past the window', de: 'Verschieben per Zeichen direkt hinter dem Fenster', sl: 'Premik po znaku tik za oknom' }, star: true }),
  v('horspool',       'Horspool',         'strings', 'ARA', { tagline: { en: 'Shift by the char at the window end', de: 'Verschieben per Zeichen am Fensterende', sl: 'Premik po znaku na koncu okna' } }),

  v('edit-distance',  'Edit Distance',    'dp', 'ARA',  { tagline: { en: 'Wagner-Fischer DP table', de: 'Wagner-Fischer DP-Tabelle', sl: 'Tabela DP po Wagner-Fischerju' }, star: true }),
  r('optimal-bst',    'Optimal BST',      'dp', 'AIPS', { tagline: { en: 'Optimal binary search trees', de: 'Optimale binäre Suchbäume', sl: 'Optimalna dvojiška iskalna drevesa' } }),
  r('knapsack',       '0/1 Knapsack',     'dp', 'AIPS', { tagline: { en: 'DP and branch-and-bound', de: 'DP und Branch-and-Bound', sl: 'DP ter razveji in omeji' } }),
  r('tsp',            'Travelling Salesman','dp', 'AIPS', { tagline: { en: 'The travelling salesman problem', de: 'Das Problem des Handlungsreisenden', sl: 'Problem trgovskega potnika' } }),

  v('rle',            'Run-Length Encoding','compression', 'ARA', { tagline: { en: 'The simplest compressor', de: 'Der einfachste Kompressor', sl: 'Najpreprostejši stiskalnik' } }),
  v('huffman',        'Huffman Coding',     'compression', 'ARA', { tagline: { en: 'Optimal prefix codes plus tree', de: 'Optimale Präfixcodes plus Baum', sl: 'Optimalne predponske kode z drevesom' }, star: true }),
  v('lzw',            'LZW',                'compression', 'ARA', { tagline: { en: 'Dictionary compression, traced live', de: 'Wörterbuch-Kompression, live nachvollzogen', sl: 'Slovarsko stiskanje, prikazano v živo' }, star: true }),
  r('shannon-fano',   'Shannon-Fano',      'compression', 'ARA', { tagline: { en: 'Top-down prefix coding', de: 'Top-down-Präfixcodierung', sl: 'Predponsko kodiranje od zgoraj navzdol' } }),
  r('arithmetic',     'Arithmetic Coding', 'compression', 'ARA', { tagline: { en: 'Interval subdivision coding', de: 'Codierung durch Intervallteilung', sl: 'Kodiranje z delitvijo intervala' } }),
  r('lz77',           'LZ77 / LZ78',       'compression', 'ARA', { tagline: { en: 'Sliding-window dictionary compression', de: 'Wörterbuch-Kompression mit Schiebefenster', sl: 'Slovarsko stiskanje z drsnim oknom' } }),
  r('golomb',         'Golomb Coding',     'compression', 'ARA', { tagline: { en: 'Coding integers with a parameter', de: 'Ganzzahlcodierung mit Parameter', sl: 'Kodiranje celih števil s parametrom' } }),
  r('bwt',            'Burrows-Wheeler',   'compression', 'ARA', { tagline: { en: 'BWT plus MTF transform', de: 'BWT plus MTF-Transformation', sl: 'BWT in transformacija MTF' } }),
  r('suffix',         'Suffix Array / Tree','compression', 'ARA', { tagline: { en: 'Suffix array, suffix tree, Ukkonen', de: 'Suffixarray, Suffixbaum, Ukkonen', sl: 'Priponsko polje, priponsko drevo, Ukkonen' } }),
  r('arithmetic-transforms', 'Arithmetic Transforms (E1/E2/E3)', 'compression', 'ARA', { tagline: { en: 'Rescaling the interval to avoid underflow', de: 'Intervall-Reskalierung gegen Unterlauf', sl: 'Preskaliranje intervala proti podkoračitvi' } }),
  r('rice-golomb',    'Rice & Rice-Golomb',  'compression', 'ARA', { tagline: { en: 'Golomb with power-of-two m, plus sign folding', de: 'Golomb mit Zweierpotenz-m, plus Vorzeichenfaltung', sl: 'Golomb z m potenco dvojke in zgibanjem predznaka' } }),
  r('basc',           'BASC',                'compression', 'ARA', { tagline: { en: 'Binary adaptive sequential coding of integer runs', de: 'Binäre adaptive sequentielle Codierung von Ganzzahlfolgen', sl: 'Binarno prilagodljivo zaporedno kodiranje nizov celih števil' } }),

  v('caesar',         'Caesar / Shift',   'crypto', 'ARA', { tagline: { en: 'Shift cipher', de: 'Verschiebechiffre', sl: 'Zamična šifra' } }),
  v('vigenere',       'Vigenere',         'crypto', 'ARA', { tagline: { en: 'Keyword cipher', de: 'Schlüsselwort-Chiffre', sl: 'Šifra s ključno besedo' } }),
  v('playfair',       'Playfair',         'crypto', 'ARA', { tagline: { en: '5x5 digraph cipher', de: '5x5-Digramm-Chiffre', sl: 'Šifra digrafov 5x5' } }),
  r('adfgx',          'ADFGX',            'crypto', 'ARA', { tagline: { en: 'Fractionating transposition cipher', de: 'Fraktionierende Transpositionschiffre', sl: 'Frakcionirna transpozicijska šifra' } }),

  v('binary-search',  'Binary Search',        'divide', 'AIPS', { tagline: { en: 'Halve the search space each step', de: 'Den Suchraum in jedem Schritt halbieren', sl: 'Prepolovi iskalni prostor na vsakem koraku' } }),
  r('strassen',       'Strassen Multiplication','divide', 'AIPS', { tagline: { en: 'Subcubic matrix multiplication', de: 'Subkubische Matrixmultiplikation', sl: 'Podkubično množenje matrik' } }),
  r('master-theorem', 'Master Theorem',       'divide', 'core', { tagline: { en: 'Solve divide-and-conquer recurrences', de: 'Rekurrenzen von Teile-und-herrsche lösen', sl: 'Reševanje rekurzij deli in vladaj' } }),

  v('warshall',       'Warshall Closure',     'discrete', 'DS', { tagline: { en: 'Reachability matrix, boolean sibling of Floyd-Warshall', de: 'Erreichbarkeitsmatrix, boolesches Geschwister von Floyd-Warshall', sl: 'Matrika dosegljivosti, logični sorodnik Floyd-Warshalla' }, star: true }),
  v('euclid-gcd',     'Euclidean Algorithm',  'discrete', 'DS', { tagline: { en: 'Greatest common divisor by repeated remainder', de: 'Grösster gemeinsamer Teiler durch wiederholten Rest', sl: 'Največji skupni delitelj s ponavljajočim ostankom' } }),
  r('extended-euclid','Extended Euclid',      'discrete', 'DS', { tagline: { en: 'GCD plus Bezout coefficients and modular inverse', de: 'ggT plus Bezout-Koeffizienten und modulares Inverses', sl: 'GCD z Bezoutovima koeficientoma in modularnim inverzom' } }),
  v('modular-exp',    'Modular Exponentiation','discrete', 'DS', { tagline: { en: 'Fast power by squaring, mod m', de: 'Schnelle Potenz durch Quadrieren, mod m', sl: 'Hitro potenciranje s kvadriranjem, mod m' } }),
  r('crt',            'Chinese Remainder Theorem','discrete', 'DS', { tagline: { en: 'Solve simultaneous congruences', de: 'Simultane Kongrünzen lösen', sl: 'Reševanje sočasnih kongruenc' } }),
  r('combinatorics',  'Counting & Combinatorics','discrete', 'DS', { tagline: { en: 'Permutations, combinations, pigeonhole', de: 'Permutationen, Kombinationen, Schubfachprinzip', sl: 'Permutacije, kombinacije, Dirichletovo načelo' } }),
  r('induction',      'Mathematical Induction','discrete', 'DS', { tagline: { en: 'Prove statements for all n', de: 'Aussagen für alle n beweisen', sl: 'Dokazovanje trditev za vse n' } }),
  r('logic-proofs',   'Logic & Proofs',       'discrete', 'DS', { tagline: { en: 'Propositions, truth tables, inference', de: 'Aussagen, Wahrheitstabellen, Schlussfolgerung', sl: 'Izjave, pravilnostne tabele, sklepanje' } }),
  r('relations',      'Sets, Relations, Functions','discrete', 'DS', { tagline: { en: 'The vocabulary everything is built on', de: 'Das Vokabular, auf dem alles aufbaut', sl: 'Besedišče, na katerem vse temelji' } }),
  r('recurrences',    'Recurrence Relations', 'discrete', 'DS', { tagline: { en: 'Solve linear recurrences with the characteristic equation', de: 'Lineare Rekurrenzen mit der charakteristischen Gleichung lösen', sl: 'Reševanje linearnih rekurzij s karakteristično enačbo' } }),
  r('graph-theory',   'Graph Theory Basics',  'discrete', 'DS', { tagline: { en: 'Degree, trees, Euler vs Hamilton', de: 'Grad, Bäume, Euler vs Hamilton', sl: 'Stopnja, drevesa, Euler proti Hamiltonu' } }),

  v('epsilon-delta',  'Epsilon-Delta Limit',  'calculus', 'MA', { tagline: { en: 'See for-all epsilon, exists delta', de: 'Sieh für-alle epsilon, existiert delta', sl: 'Poglej: za vsak epsilon obstaja delta' }, star: true }),
  v('derivative',     'The Derivative',       'calculus', 'MA', { tagline: { en: 'Secant slope to tangent slope', de: 'Sekantensteigung zu Tangentensteigung', sl: 'Od naklona sekante do naklona tangente' } }),
  v('riemann',        'Riemann Sums',         'calculus', 'MA', { tagline: { en: 'Rectangles converging to the area', de: 'Rechtecke, die gegen die Fläche konvergieren', sl: 'Pravokotniki, ki konvergirajo k ploščini' } }),
  v('taylor',         'Taylor Series',        'calculus', 'MA', { tagline: { en: 'Approximate a curve with a polynomial', de: 'Eine Kurve mit einem Polynom annähern', sl: 'Približaj krivuljo s polinomom' } }),
  v('newton',         'Newton Method',        'calculus', 'MA', { tagline: { en: 'Find roots by following tangents', de: 'Nullstellen finden, indem man Tangenten folgt', sl: 'Iskanje ničel po tangentah' } }),
  r('sequences',      'Sequences & Series',   'calculus', 'MA', { tagline: { en: 'Convergence and divergence', de: 'Konvergenz und Divergenz', sl: 'Konvergenca in divergenca' } }),
  v('mean-value',     'Rolle & Mean Value Theorem', 'calculus', 'MA', { tagline: { en: 'The cornerstone existence theorems of calculus', de: 'Die zentralen Existenzsätze der Analysis', sl: 'Temeljni eksistenčni izreki analize' }, star: true }),
  r('elementary-functions','Elementary Functions', 'calculus', 'MA', { tagline: { en: 'Exp, log, trig, hyperbolic and inverses', de: 'Exp, Log, Trig, hyperbolisch und Umkehrungen', sl: 'Eksponentna, logaritemska, trigonometrične, hiperbolične in inverzne' } }),
  r('continuity',     'Limits & Continuity',  'calculus', 'MA', { tagline: { en: 'Continuity, IVT and the extreme value theorem', de: 'Stetigkeit, Zwischenwert- und Extremwertsatz', sl: 'Zveznost, izrek o vmesni vrednosti in izrek o ekstremih' } }),
  r('integration-techniques','Integration Techniques', 'calculus', 'MA', { tagline: { en: 'Substitution, by parts, partial fractions', de: 'Substitution, partiell, Partialbrüche', sl: 'Substitucija, per partes, delni ulomki' } }),
  r('functions-mappings','Functions & Mappings', 'calculus', 'MA', { tagline: { en: 'Injective, surjective, bijective, inverse', de: 'Injektiv, surjektiv, bijektiv, Umkehrung', sl: 'Injektivnost, surjektivnost, bijektivnost, inverz' } }),
  r('real-numbers',   'Real Numbers & Completeness', 'calculus', 'MA', { tagline: { en: 'Supremum, density, why limits work', de: 'Supremum, Dichte, warum Grenzwerte funktionieren', sl: 'Supremum, gostota, zakaj limite delujejo' } }),

  r('big-o',          'Big-O & Complexity',   'programming', 'core', { tagline: { en: 'How runtime scales with input size', de: 'Wie die Laufzeit mit der Eingabegrösse wächst', sl: 'Kako se čas izvajanja veča z velikostjo vhoda' }, star: true }),
  r('variables-types','Variables & Types',    'programming', 'P1', { tagline: { en: 'How data is named and stored', de: 'Wie Daten benannt und gespeichert werden', sl: 'Kako se podatki poimenujejo in shranjujejo' } }),
  r('control-flow',   'Control Flow',         'programming', 'P1', { tagline: { en: 'Conditionals and loops', de: 'Bedingungen und Schleifen', sl: 'Pogojni stavki in zanke' } }),
  r('functions',      'Functions & Parameters','programming', 'P1', { tagline: { en: 'By value vs by reference', de: 'Wert- vs. Referenzübergabe', sl: 'Po vrednosti proti po referenci' } }),
  v('recursion',      'Recursion',            'programming', 'P1', { tagline: { en: 'Factorial, Fibonacci, Towers of Hanoi', de: 'Fakultät, Fibonacci, Türme von Hanoi', sl: 'Fakulteta, Fibonacci, Hanojski stolpi' } }),
  r('pointers',       'Pointers & Memory',    'programming', 'P1', { tagline: { en: 'Stack, heap, and what a pointer is', de: 'Stack, Heap und was ein Zeiger ist', sl: 'Sklad, kopica in kaj je kazalec' } }),
  r('oop',            'Object-Oriented Programming','programming', 'P2', { tagline: { en: 'Classes, inheritance, polymorphism', de: 'Klassen, Vererbung, Polymorphie', sl: 'Razredi, dedovanje, polimorfizem' } }),
  r('templates',      'Templates & Generics', 'programming', 'P2', { tagline: { en: 'template typename T and the STL', de: 'template typename T und die STL', sl: 'template typename T in STL' } }),
  r('constructors',        'Constructors & Destructors', 'programming', 'P2', { tagline: { en: 'Object lifecycle: build and clean up', de: 'Objektlebenszyklus: aufbauen und aufräumen', sl: 'Življenjski cikel objekta: gradnja in čiščenje' } }),
  r('composition',         'Composition & Aggregation', 'programming', 'P2', { tagline: { en: 'has-a: objects inside objects', de: 'hat-ein: Objekte in Objekten', sl: 'ima-a: objekti znotraj objektov' } }),
  r('operator-overloading','Operator Overloading', 'programming', 'P2', { tagline: { en: 'Give + == << meaning for your types', de: 'Gib + == << Bedeutung für deine Typen', sl: 'Določi pomen +, ==, << za svoje tipe' } }),
  r('multiple-inheritance','Multiple Inheritance', 'programming', 'P2', { tagline: { en: 'Many bases, and the diamond problem', de: 'Viele Basen und das Diamantproblem', sl: 'Več osnovnih razredov in problem diamanta' } }),
  r('move-semantics',      'Move Semantics (C++11)', 'programming', 'P2', { tagline: { en: 'Rvalue references, move not copy', de: 'Rvalü-Referenzen, verschieben statt kopieren', sl: 'Reference na R-vrednost, premakni namesto kopiraj' } }),
  r('header-source-split', 'Headers & Separate Compilation', 'programming', 'P2', { tagline: { en: 'Declarations in .h, definitions in .cpp', de: 'Deklarationen in .h, Definitionen in .cpp', sl: 'Deklaracije v .h, definicije v .cpp' } }),
  r('bit-manipulation',    'Bit Manipulation', 'programming', 'P2', { tagline: { en: 'Masks, shifts and bitwise operators', de: 'Masken, Shifts und Bitoperatoren', sl: 'Maske, premiki in bitni operatorji' } }),

  r('relational-model','Relational Model',    'databases', 'PB', { tagline: { en: 'Tables, rows, relational algebra', de: 'Tabellen, Zeilen, relationale Algebra', sl: 'Tabele, vrstice, relacijska algebra' } }),
  v('sql-joins',      'SQL Joins',            'databases', 'PB', { tagline: { en: 'INNER, LEFT, RIGHT, FULL, visualized', de: 'INNER, LEFT, RIGHT, FULL, visualisiert', sl: 'INNER, LEFT, RIGHT, FULL, prikazano' }, star: true }),
  r('sql-basics',     'SQL Basics',           'databases', 'PB', { tagline: { en: 'DDL, DML, TCL: the core statements', de: 'DDL, DML, TCL: die Kernbefehle', sl: 'DDL, DML, TCL: temeljni stavki' } }),
  r('keys',           'Keys & ER Model',      'databases', 'PB', { tagline: { en: 'Primary, foreign keys, cardinality', de: 'Primär-, Fremdschlüssel, Kardinalität', sl: 'Primarni, tuji ključi, kardinalnost' } }),
  r('normalization',  'Normalization',        'databases', 'PB', { tagline: { en: '1NF to BCNF, functional dependencies', de: '1NF bis BCNF, funktionale Abhängigkeiten', sl: 'Od 1NF do BCNF, funkcijske odvisnosti' } }),
  v('btree-index',    'Indexes & B-Trees',    'databases', 'PB', { tagline: { en: 'Why a query with an index is fast', de: 'Warum eine Abfrage mit Index schnell ist', sl: 'Zakaj je poizvedba z indeksom hitra' } }),
  r('transactions',   'Transactions & ACID',  'databases', 'PB', { tagline: { en: 'Atomicity, consistency, isolation, durability', de: 'Atomarität, Konsistenz, Isolation, Dauerhaftigkeit', sl: 'Atomarnost, konsistentnost, izolacija, trajnost' } }),
  r('sql-advanced',   'Advanced SQL',         'databases', 'PB', { tagline: { en: 'Aggregates, GROUP BY, subqueries, views', de: 'Aggregate, GROUP BY, Unterabfragen, Sichten', sl: 'Agregati, GROUP BY, podpoizvedbe, pogledi' } }),
  r('triggers',       'Triggers & Stored Procedures', 'databases', 'PB', { tagline: { en: 'Automatic SQL on data events, and stored routines', de: 'Automatisches SQL bei Datenereignissen, gespeicherte Routinen', sl: 'Samodejni SQL ob podatkovnih dogodkih in shranjene rutine' } }),

  v('number-systems', 'Number Systems',       'systems', 'ORS', { tagline: { en: 'Binary, decimal, hex, interactive', de: 'Binär, Dezimal, Hex, interaktiv', sl: 'Dvojiško, desetiško, šestnajstiško, interaktivno' }, star: true }),
  r('binary-arithmetic','Binary Arithmetic',  'systems', 'ORS', { tagline: { en: 'Twos complement, add and subtract', de: 'Zweierkomplement, addieren und subtrahieren', sl: 'Dvojiški komplement, seštevanje in odštevanje' } }),
  v('logic-gates',    'Logic Gates',          'systems', 'ORS', { tagline: { en: 'AND, OR, NOT, XOR: build the table', de: 'AND, OR, NOT, XOR: die Tabelle bauen', sl: 'AND, OR, NOT, XOR: sestavi tabelo' } }),
  r('von-neumann',    'Von Neumann Architecture','systems', 'ORS', { tagline: { en: 'CPU, memory, the fetch-execute cycle', de: 'CPU, Speicher, der Hol-Ausführ-Zyklus', sl: 'CPE, pomnilnik, cikel prevzemi-izvedi' } }),
  r('memory-hierarchy','Memory & Cache',      'systems', 'ORS', { tagline: { en: 'Registers, cache, RAM, disk', de: 'Register, Cache, RAM, Festplatte', sl: 'Registri, predpomnilnik, RAM, disk' } }),
  v('turing-machine', 'Turing Machine',       'systems', 'ORS', { tagline: { en: 'The simplest model of computation, running', de: 'Das einfachste Rechenmodell, in Aktion', sl: 'Najpreprostejši model računanja v delovanju' } }),
  r('processes-threads','Processes & Threads','systems', 'core', { tagline: { en: 'Concurrency basics', de: 'Grundlagen der Nebenläufigkeit', sl: 'Osnove sočasnosti' } }),

  r('how-web-works',  'How the Web Works',    'web', 'OSS', { tagline: { en: 'Browser, server, request, response', de: 'Browser, Server, Anfrage, Antwort', sl: 'Brskalnik, strežnik, zahteva, odgovor' } }),
  v('http',           'HTTP',                 'web', 'OSS', { tagline: { en: 'Methods, status codes, an inspectable request', de: 'Methoden, Statuscodes, eine prüfbare Anfrage', sl: 'Metode, statusne kode, pregledljiva zahteva' } }),
  r('dns',            'DNS',                  'web', 'OSS', { tagline: { en: 'How a name becomes an IP address', de: 'Wie aus einem Namen eine IP-Adresse wird', sl: 'Kako ime postane naslov IP' } }),
  v('tcp-ip',         'TCP/IP Handshake',     'web', 'OSS', { tagline: { en: 'The three-way handshake, step by step', de: 'Der Drei-Wege-Handshake, Schritt für Schritt', sl: 'Trosmerno rokovanje, korak za korakom' } }),
  r('cookies-sessions','Cookies & Sessions',  'web', 'OSS', { tagline: { en: 'How a stateless protocol remembers you', de: 'Wie ein zustandsloses Protokoll sich dich merkt', sl: 'Kako si vas protokol brez stanja zapomni' } }),
  r('json-xml',       'JSON & XML',           'web', 'OSS', { tagline: { en: 'The data formats the web speaks', de: 'Die Datenformate, die das Web spricht', sl: 'Podatkovni formati, ki jih govori splet' } }),
  r('css',            'CSS',                  'web', 'OSS', { tagline: { en: 'The cascade, box model, Flexbox and Grid', de: 'Kaskade, Boxmodell, Flexbox und Grid', sl: 'Kaskada, škatlični model, Flexbox in Grid' } }),
  r('javascript',     'JavaScript',           'web', 'OSS', { tagline: { en: 'Objects, prototypes and classes', de: 'Objekte, Prototypen und Klassen', sl: 'Objekti, prototipi in razredi' } }),
  r('async-js',       'Asynchronous JavaScript','web', 'OSS', { tagline: { en: 'Callbacks, Promises, async / await', de: 'Callbacks, Promises, async / await', sl: 'Povratni klici, Promise, async / await' } }),
  r('web-security',   'Web Security',         'web', 'OSS', { tagline: { en: 'XSS, SQL injection, CSRF and defences', de: 'XSS, SQL-Injection, CSRF und Abwehr', sl: 'XSS, vrivanje SQL, CSRF in obramba' }, star: true }),
  r('web-frameworks', 'Web Frameworks',       'web', 'OSS', { tagline: { en: 'MVC on the server, SPAs on the client', de: 'MVC am Server, SPAs am Client', sl: 'MVC na strežniku, SPA na odjemalcu' } }),
]

const modules = import.meta.glob('./algorithms/**/*.jsx')

// Cache the lazy() wrapper per slug. Without this, loadComponent() built a fresh
// lazy component on every AlgoPage render, so React Suspense re-triggered the
// "Loading..." fallback on *every* navigation even when the chunk was already in
// memory. Memoizing means a revisited (or prefetched) page resolves instantly.
const lazyCache = new Map()
const importerFor = (slug) => {
  const match = Object.keys(modules).find((p) => p.endsWith('/' + slug + '.jsx'))
  return match ? modules[match] : null
}

export function loadComponent(slug) {
  if (lazyCache.has(slug)) return lazyCache.get(slug)
  const importer = importerFor(slug)
  const comp = importer ? lazy(importer) : null
  lazyCache.set(slug, comp)
  return comp
}

// Warm a chunk before the user clicks (called on dropdown hover). Kicks off the
// dynamic import so the module is already downloaded by navigation time.
export function prefetchComponent(slug) {
  const importer = importerFor(slug)
  if (importer) importer()
}

export function getAlgo(slug) { return ALGORITHMS.find((a) => a.slug === slug) }
export function getCategory(id) { return CATEGORIES.find((c) => c.id === id) }
export function algosByCategory(catId) { return ALGORITHMS.filter((a) => a.category === catId) }

export const COURSE_LABELS = {
  AIPS: { en: 'Algorithms & Data Structures', de: 'Algorithmen & Datenstrukturen' },
  ARA: { en: 'Applied Algorithms', de: 'Angewandte Algorithmen' },
  DS: { en: 'Discrete Mathematics', de: 'Diskrete Mathematik' },
  MA: { en: 'Calculus & Analysis', de: 'Analysis' },
  P1: { en: 'Programming I', de: 'Programmierung I' },
  P2: { en: 'Programming II', de: 'Programmierung II' },
  PB: { en: 'Databases I', de: 'Datenbanken I' },
  ORS: { en: 'Computer Systems', de: 'Computersysteme' },
  OSS: { en: 'Web Foundations', de: 'Grundlagen des Web' },
  core: { en: 'Universal CS core', de: 'Universeller Informatik-Kern' },
  extra: { en: 'Added beyond the curriculum', de: 'Über den Lehrplan hinaus ergänzt' },
}

// Course display order for the top navigation bar.
export const COURSE_ORDER = ['P1', 'P2', 'AIPS', 'ARA', 'DS', 'MA', 'PB', 'ORS', 'OSS', 'core', 'extra']

export function algosByCourse(courseId) {
  return ALGORITHMS.filter((a) => a.course === courseId)
}

export const COURSE_SHORT = {
  P1: { en: 'Programming I', de: 'Programmierung I' },
  P2: { en: 'Programming II', de: 'Programmierung II' },
  AIPS: { en: 'Algorithms & Data Structures', de: 'Algorithmen & Datenstrukturen' },
  ARA: { en: 'Applied Algorithms', de: 'Angewandte Algorithmen' },
  DS: { en: 'Discrete Mathematics', de: 'Diskrete Mathematik' },
  MA: { en: 'Calculus', de: 'Analysis' },
  PB: { en: 'Databases', de: 'Datenbanken' },
  ORS: { en: 'Computer Systems', de: 'Computersysteme' },
  OSS: { en: 'Web Foundations', de: 'Web-Grundlagen' },
  core: { en: 'CS Core', de: 'Informatik-Kern' },
  extra: { en: 'Extras', de: 'Extras' },
}

// Circular prev/next within a course, for the arrow navigation on each page.
export function courseNeighbors(slug) {
  const algo = getAlgo(slug)
  if (!algo) return { prev: null, next: null, course: null, index: 0, total: 0 }
  const list = algosByCourse(algo.course)
  const i = list.findIndex((a) => a.slug === slug)
  const prev = list[(i - 1 + list.length) % list.length]
  const next = list[(i + 1) % list.length]
  return { prev, next, course: algo.course, index: i, total: list.length }
}

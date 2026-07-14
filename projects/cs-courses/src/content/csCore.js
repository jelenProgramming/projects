// CS-core content: databases (deep), programming concepts, systems, web.
// Databases get full depth: ER building blocks, cardinalities, 1NF/2NF/3NF/BCNF.
export const csCoreContent = {
  // ================= DATABASES =================
  'relational-model': {
    tldr: { en: 'Data as <strong>relations</strong> (tables): rows are tuples, columns are attributes. Built on set theory, queried with relational algebra. The model behind every SQL database, designed by Codd in 1970.', de: 'Daten als <strong>Relationen</strong> (Tabellen): Zeilen sind Tupel, Spalten sind Attribute. Auf Mengenlehre aufgebaut, mit relationaler Algebra abgefragt.' },
    intro: [
      { en: 'A <strong>relation</strong> is a table with a fixed set of named, typed columns (attributes) and a set of rows (tuples). Because it is a set, row order is irrelevant and duplicate rows are not allowed.', de: 'Eine <strong>Relation</strong> ist eine Tabelle mit fester Menge benannter, typisierter Spalten (Attribute) und einer Menge von Zeilen (Tupeln). Als Menge ist die Zeilenreihenfolge irrelevant und Duplikate sind verboten.' },
      { en: '<strong>Relational algebra</strong> is the formal query language: <code>σ</code> (selection: pick rows), <code>π</code> (projection: pick columns), <code>⋈</code> (join: combine tables), plus union, difference and Cartesian product. SQL is a practical wrapper over these operations.', de: '<strong>Relationale Algebra</strong> ist die formale Abfragesprache: <code>σ</code> (Selektion: Zeilen), <code>π</code> (Projektion: Spalten), <code>⋈</code> (Verbund: Tabellen kombinieren), plus Vereinigung, Differenz, kartesisches Produkt. SQL ist eine praktische Huelle darueber.' },
    ],
    how: [
      { en: 'Each attribute draws values from a domain (a type, e.g. INTEGER, VARCHAR).', de: 'Jedes Attribut nimmt Werte aus einer Domaene (Typ, z.B. INTEGER, VARCHAR).' },
      { en: 'A row (tuple) is one record; the whole relation is the set of all current rows.', de: 'Eine Zeile (Tupel) ist ein Datensatz; die Relation ist die Menge aller aktuellen Zeilen.' },
      { en: 'The conceptual ER model is translated into these relations during logical design.', de: 'Das konzeptuelle ER-Modell wird im logischen Entwurf in diese Relationen uebersetzt.' },
    ],
    pitfalls: [
      { en: 'A relation is a SET: no duplicate rows, no inherent order. "First row" is meaningless without an ORDER BY.', de: 'Eine Relation ist eine MENGE: keine Duplikate, keine Reihenfolge. „Erste Zeile" ist ohne ORDER BY bedeutungslos.' },
    ],
  },
  'keys': {
    tldr: { en: 'Keys identify rows and link tables. A <strong>primary key</strong> uniquely identifies each row; a <strong>foreign key</strong> references another table\'s primary key. The ER model captures entities, attributes, relationships and their <strong>cardinalities</strong> (1:1, 1:M, N:1, M:N).', de: 'Schluessel identifizieren Zeilen und verbinden Tabellen. Ein <strong>Primaerschluessel</strong> identifiziert jede Zeile eindeutig; ein <strong>Fremdschluessel</strong> verweist auf den Primaerschluessel einer anderen Tabelle.' },
    intro: [
      { en: '<strong>ER model building blocks:</strong> an <strong>entity</strong> is a thing you store (Student, Course); an <strong>attribute</strong> is a property of it (name, credits); a <strong>relationship</strong> connects entities (Student <strong>enrolls in</strong> Course). This is the conceptual design, drawn as an ER diagram before any tables exist.', de: '<strong>ER-Bausteine:</strong> eine <strong>Entitaet</strong> ist ein gespeichertes Ding (Student, Kurs); ein <strong>Attribut</strong> eine Eigenschaft (Name, Punkte); eine <strong>Beziehung</strong> verbindet Entitaeten (Student <strong>belegt</strong> Kurs). Das ist der konzeptuelle Entwurf.' },
      { en: '<strong>Cardinality</strong> says how many of one entity relate to the other: <code>1:1</code> (one country, one capital), <code>1:M</code> (one customer, many orders), <code>N:1</code> (many employees, one department - the mirror of 1:M), and <code>M:N</code> (students ↔ courses, each side many). An <code>M:N</code> relationship becomes its own junction table holding two foreign keys.', de: '<strong>Kardinalitaet</strong> sagt, wie viele einer Entitaet sich auf die andere beziehen: <code>1:1</code> (ein Land, eine Hauptstadt), <code>1:M</code> (ein Kunde, viele Bestellungen), <code>N:1</code> (viele Mitarbeiter, eine Abteilung), <code>M:N</code> (Studenten ↔ Kurse). Eine <code>M:N</code>-Beziehung wird zur eigenen Verbindungstabelle mit zwei Fremdschluesseln.' },
    ],
    how: [
      { en: '<strong>Primary key:</strong> a minimal set of columns that uniquely identifies every row. Cannot be NULL.', de: '<strong>Primaerschluessel:</strong> minimale Spaltenmenge, die jede Zeile eindeutig identifiziert. Nie NULL.' },
      { en: '<strong>Candidate key:</strong> any column set that could serve as primary key. <strong>Composite key:</strong> a key made of several columns.', de: '<strong>Schluesselkandidat:</strong> jede Spaltenmenge, die Primaerschluessel sein koennte. <strong>Zusammengesetzter Schluessel:</strong> aus mehreren Spalten.' },
      { en: '<strong>Foreign key:</strong> a column referencing another table\'s primary key, enforcing referential integrity (you cannot reference a row that does not exist).', de: '<strong>Fremdschluessel:</strong> verweist auf den Primaerschluessel einer anderen Tabelle und erzwingt referentielle Integritaet.' },
    ],
    paper: [
      { en: 'Draw entities as boxes, attributes as ovals, relationships as diamonds. Write the cardinality (1, M, N) at each end of a relationship line.', de: 'Entitaeten als Kaesten, Attribute als Ovale, Beziehungen als Rauten zeichnen. Die Kardinalitaet (1, M, N) an jedes Ende der Beziehungslinie schreiben.' },
      { en: 'To convert to tables: each entity → a table; a 1:M relationship → put the "1" side\'s key as a foreign key on the "M" side; an M:N → a new junction table with both keys.', de: 'Umwandlung in Tabellen: jede Entitaet → eine Tabelle; 1:M → Schluessel der „1"-Seite als Fremdschluessel auf die „M"-Seite; M:N → neue Verbindungstabelle mit beiden Schluesseln.' },
    ],
    pitfalls: [
      { en: 'An M:N relationship can NEVER be stored with a single foreign key - it always needs a junction (bridge) table. The #1 ER-to-tables mistake.', de: 'Eine M:N-Beziehung kann NIE mit einem einzelnen Fremdschluessel gespeichert werden - sie braucht immer eine Verbindungstabelle.' },
      { en: '1:M and N:1 are the same relationship seen from opposite ends - do not count them as different.', de: '1:M und N:1 sind dieselbe Beziehung von beiden Enden - nicht als verschieden zaehlen.' },
    ],
  },
  'normalization': {
    tldr: { en: 'Organizing tables to eliminate redundancy and update anomalies by splitting them according to <strong>functional dependencies</strong>. Progresses 1NF → 2NF → 3NF → BCNF, each removing a specific kind of bad dependency.', de: 'Tabellen so organisieren, dass Redundanz und Anomalien durch Aufteilung nach <strong>funktionalen Abhaengigkeiten</strong> verschwinden. 1NF → 2NF → 3NF → BCNF.' },
    intro: [
      { en: 'A <strong>functional dependency</strong> A → B means: knowing A determines B (a student ID determines the student\'s name). Normalization removes dependencies that cause data to be stored redundantly, which otherwise leads to update, insert and delete anomalies.', de: 'Eine <strong>funktionale Abhaengigkeit</strong> A → B heisst: A bestimmt B (eine Matrikelnummer bestimmt den Namen). Normalisierung entfernt Abhaengigkeiten, die zu redundanter Speicherung und damit zu Anomalien fuehren.' },
    ],
    how: [
      { en: '<strong>1NF (First Normal Form):</strong> every cell holds a single atomic value - no lists, no repeating groups. "phones: 040-1, 041-2" in one cell violates 1NF.', de: '<strong>1NF:</strong> jede Zelle haelt einen atomaren Wert - keine Listen, keine Wiederholungsgruppen.' },
      { en: '<strong>2NF (Second Normal Form):</strong> in 1NF AND no non-key attribute depends on only PART of a composite key. Only relevant when the primary key is composite.', de: '<strong>2NF:</strong> in 1NF UND kein Nichtschluesselattribut haengt von nur einem TEIL eines zusammengesetzten Schluessels ab.' },
      { en: '<strong>3NF (Third Normal Form):</strong> in 2NF AND no non-key attribute depends on another non-key attribute (no transitive dependency). If zip → city and id → zip, then city depends on id only through zip - split it out.', de: '<strong>3NF:</strong> in 2NF UND kein Nichtschluesselattribut haengt von einem anderen Nichtschluesselattribut ab (keine transitive Abhaengigkeit).' },
      { en: '<strong>BCNF:</strong> a stricter 3NF - every determinant (left side of a dependency) must be a candidate key.', de: '<strong>BCNF:</strong> strengeres 3NF - jede Determinante muss ein Schluesselkandidat sein.' },
    ],
    paper: [
      { en: 'Write all functional dependencies. Find the primary key (the minimal attribute set that determines everything).', de: 'Alle funktionalen Abhaengigkeiten notieren. Primaerschluessel finden (minimale Menge, die alles bestimmt).' },
      { en: '1NF: split any multi-valued cell into separate rows. 2NF: move attributes that depend on part of the key into their own table. 3NF: move transitively-dependent attributes (non-key → non-key) into their own table.', de: '1NF: mehrwertige Zellen in Zeilen aufteilen. 2NF: teilweise abhaengige Attribute auslagern. 3NF: transitiv abhaengige Attribute auslagern.' },
      { en: 'Mnemonic: each non-key attribute must depend on "the key, the whole key, and nothing but the key".', de: 'Merksatz: jedes Nichtschluesselattribut haengt ab von „dem Schluessel, dem ganzen Schluessel und nichts als dem Schluessel".' },
    ],
    pitfalls: [
      { en: '2NF only matters with a COMPOSITE primary key; with a single-column key you jump straight from 1NF to 3NF.', de: '2NF ist nur bei ZUSAMMENGESETZTEM Schluessel relevant; bei einspaltigem Schluessel direkt von 1NF zu 3NF.' },
      { en: 'Over-normalizing forces more joins; sometimes 3NF is deliberately relaxed (denormalized) for read performance.', de: 'Ueber-Normalisierung erzwingt mehr Joins; manchmal wird 3NF bewusst gelockert (denormalisiert) fuer Lesetempo.' },
    ],
  },
  'sql-basics': {
    tldr: { en: 'SQL splits into <strong>DDL</strong> (CREATE/ALTER/DROP - structure), <strong>DML</strong> (INSERT/UPDATE/DELETE/SELECT - data), and <strong>TCL</strong> (COMMIT/ROLLBACK - transactions). One declarative language for defining and querying relational data.', de: 'SQL teilt sich in <strong>DDL</strong> (CREATE/ALTER/DROP - Struktur), <strong>DML</strong> (INSERT/UPDATE/DELETE/SELECT - Daten) und <strong>TCL</strong> (COMMIT/ROLLBACK - Transaktionen).' },
    intro: [
      { en: 'SQL is <strong>declarative</strong>: you describe WHAT you want, not how to get it - the query planner decides the execution. A SELECT runs logically as FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY, which is why you cannot use a SELECT alias in a WHERE clause.', de: 'SQL ist <strong>deklarativ</strong>: du beschreibst WAS du willst, nicht wie. Ein SELECT laeuft logisch FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.' },
    ],
    how: [
      { en: '<strong>DDL</strong> defines structure: CREATE TABLE, ALTER TABLE, DROP TABLE.', de: '<strong>DDL</strong> definiert Struktur: CREATE TABLE, ALTER TABLE, DROP TABLE.' },
      { en: '<strong>DML</strong> manipulates data: INSERT, UPDATE, DELETE, and the SELECT query with WHERE / JOIN / GROUP BY / HAVING.', de: '<strong>DML</strong> manipuliert Daten: INSERT, UPDATE, DELETE und SELECT mit WHERE / JOIN / GROUP BY / HAVING.' },
      { en: '<strong>TCL</strong> controls transactions: COMMIT to save, ROLLBACK to undo. <strong>DCL</strong> (GRANT/REVOKE) controls permissions.', de: '<strong>TCL</strong> steuert Transaktionen: COMMIT, ROLLBACK. <strong>DCL</strong> (GRANT/REVOKE) steuert Rechte.' },
    ],
    pitfalls: [
      { en: 'WHERE filters rows BEFORE grouping; HAVING filters groups AFTER. Using an aggregate in WHERE is an error.', de: 'WHERE filtert Zeilen VOR der Gruppierung; HAVING filtert Gruppen DANACH. Ein Aggregat in WHERE ist ein Fehler.' },
      { en: 'DELETE without a WHERE empties the whole table. DROP removes the table itself. Different danger levels.', de: 'DELETE ohne WHERE leert die ganze Tabelle. DROP entfernt die Tabelle selbst.' },
    ],
  },
  'transactions': {
    tldr: { en: 'A transaction groups operations so they all succeed or all fail together. <strong>ACID</strong>: Atomicity (all-or-nothing), Consistency (rules stay valid), Isolation (concurrent transactions don\'t interfere), Durability (committed data survives crashes).', de: 'Eine Transaktion gruppiert Operationen, sodass alle gelingen oder alle scheitern. <strong>ACID</strong>: Atomaritaet, Konsistenz, Isolation, Dauerhaftigkeit.' },
    intro: [
      { en: 'The classic example: transferring money. Debiting one account and crediting another must both happen or neither - otherwise money vanishes or is created. Wrapping them in a transaction guarantees <strong>atomicity</strong>.', de: 'Das klassische Beispiel: Geldueberweisung. Abbuchen und Gutschreiben muessen beide oder keines geschehen - sonst verschwindet oder entsteht Geld. Eine Transaktion garantiert <strong>Atomaritaet</strong>.' },
    ],
    how: [
      { en: '<strong>Atomicity:</strong> the whole transaction commits, or it rolls back entirely.', de: '<strong>Atomaritaet:</strong> die ganze Transaktion committet oder wird komplett zurueckgerollt.' },
      { en: '<strong>Consistency:</strong> it moves the database from one valid state to another (constraints hold).', de: '<strong>Konsistenz:</strong> sie fuehrt von einem gueltigen Zustand zum naechsten (Constraints gelten).' },
      { en: '<strong>Isolation:</strong> concurrent transactions appear to run one at a time; isolation levels trade safety for speed.', de: '<strong>Isolation:</strong> nebenlaeufige Transaktionen wirken seriell; Isolationsstufen tauschen Sicherheit gegen Tempo.' },
      { en: '<strong>Durability:</strong> once committed, the data survives a crash (written to disk / log).', de: '<strong>Dauerhaftigkeit:</strong> nach Commit ueberlebt die Daten einen Absturz.' },
    ],
    pitfalls: [
      { en: 'Weaker isolation levels allow anomalies: dirty reads, non-repeatable reads, phantom reads. Know which level prevents which.', de: 'Schwaechere Isolationsstufen erlauben Anomalien: Dirty Reads, Non-Repeatable Reads, Phantom Reads.' },
    ],
  },
  'btree-index': {
    when: { en: 'Speeding up database lookups, range queries and sorting. Almost every primary key and many columns are backed by a B-tree (or B+-tree) index.', de: 'Datenbank-Lookups, Bereichsabfragen und Sortierung beschleunigen. Fast jeder Primaerschluessel hat einen B-Baum-Index.' },
    how: [
      { en: 'A B-tree is a balanced tree where each node holds many keys and has many children - kept shallow so few disk reads are needed.', de: 'Ein B-Baum ist ein balancierter Baum, dessen Knoten viele Schluessel und Kinder halten - flach gehalten fuer wenige Plattenzugriffe.' },
      { en: 'Searching follows keys down the tree; each node read is one disk access, so log_B(n) reads find any row.', de: 'Die Suche folgt Schluesseln nach unten; jeder Knoten ist ein Plattenzugriff, also log_B(n) Zugriffe.' },
      { en: 'Without an index, the database must scan every row (O(n)); with one it is O(log n).', de: 'Ohne Index muss jede Zeile gescannt werden (O(n)); mit Index O(log n).' },
    ],
    complexity: [
      { case: { en: 'Search / Insert / Delete', de: 'Suchen / Einf. / Loeschen' }, time: 'O(log n)', space: 'O(n)', cls: 'best' },
      { case: { en: 'Full table scan (no index)', de: 'Voller Scan (kein Index)' }, time: 'O(n)', space: 'O(1)', cls: 'worst', note: { en: 'Indexes speed reads but slow writes (the tree must be updated) and use extra space - a real trade-off.', de: 'Indizes beschleunigen Lesen, verlangsamen Schreiben und brauchen Platz - ein echter Kompromiss.' } },
    ],
    pitfalls: [
      { en: 'An index helps reads but adds cost to every INSERT/UPDATE/DELETE. Indexing every column is a mistake.', de: 'Ein Index hilft Lesen, kostet aber bei jedem Schreiben. Jede Spalte zu indizieren ist ein Fehler.' },
    ],
  },
  // ================= PROGRAMMING CONCEPTS =================
  'big-o': {
    tldr: { en: 'Big-O describes how an algorithm\'s time or space grows as input size n grows, ignoring constants. O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ). The language for comparing algorithms.', de: 'Big-O beschreibt, wie Zeit oder Speicher mit der Eingabegroesse n waechst, ohne Konstanten. O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ).' },
    intro: [
      { en: 'Big-O measures the <strong>growth rate</strong>, not the actual time. An O(n) algorithm that does 100 operations per item can be slower than an O(n²) one for small n - but for large n the growth rate always wins. That is why we drop constants and lower-order terms: O(3n² + 5n) is just O(n²).', de: 'Big-O misst die <strong>Wachstumsrate</strong>, nicht die echte Zeit. Fuer grosse n gewinnt die Wachstumsrate immer. Daher lassen wir Konstanten und niedrigere Terme weg: O(3n² + 5n) ist O(n²).' },
      { en: 'Best/average/worst case matter: quicksort is O(n log n) average but O(n²) worst. Big-O is the upper bound; Ω is the lower bound; Θ is both (a tight bound).', de: 'Bester/durchschnittlicher/schlechtester Fall zaehlen: Quicksort ist O(n log n) im Schnitt, O(n²) schlecht. Big-O ist obere Schranke; Ω untere; Θ beides.' },
    ],
    how: [
      { en: 'Count the dominant operation as a function of n.', de: 'Die dominante Operation als Funktion von n zaehlen.' },
      { en: 'Drop constants and lower-order terms - keep only the fastest-growing part.', de: 'Konstanten und niedrigere Terme weglassen - nur den am schnellsten wachsenden Teil behalten.' },
      { en: 'Nested loops over n multiply (O(n²)); halving the input each step gives O(log n).', de: 'Verschachtelte Schleifen ueber n multiplizieren (O(n²)); Halbieren ergibt O(log n).' },
    ],
    complexity: [
      { case: { en: 'Constant / Log / Linear', de: 'Konstant / Log / Linear' }, time: 'O(1), O(log n), O(n)', space: '-', cls: 'best' },
      { case: { en: 'Linearithmic / Quadratic', de: 'Linearithmisch / Quadratisch' }, time: 'O(n log n), O(n²)', space: '-', cls: 'avg' },
      { case: { en: 'Exponential / Factorial', de: 'Exponentiell / Faktoriell' }, time: 'O(2ⁿ), O(n!)', space: '-', cls: 'worst', note: { en: 'Anything exponential is intractable beyond small n - the line between "scales" and "doesn\'t".', de: 'Alles Exponentielle ist jenseits kleiner n unhandhabbar.' } },
    ],
    pitfalls: [
      { en: 'Big-O hides constants: an O(n) with a huge constant can lose to O(n²) for small inputs. It describes scaling, not raw speed.', de: 'Big-O verbirgt Konstanten: O(n) mit grosser Konstante kann bei kleinen Eingaben gegen O(n²) verlieren.' },
    ],
  },
  'variables-types': {
    tldr: { en: 'A variable is a named box in memory holding a value of some <strong>type</strong> (int, double, bool, char, string). The type fixes the size, the valid operations, and how the bits are interpreted.', de: 'Eine Variable ist ein benannter Speicherplatz mit einem Wert eines <strong>Typs</strong> (int, double, bool, char, string). Der Typ legt Groesse, gueltige Operationen und Bit-Deutung fest.' },
    intro: [
      { en: 'Types matter because the same bits mean different things: the bytes for the integer 1078530011 and the float 3.14159 can be identical - the type tells the CPU how to read them. <strong>Static typing</strong> (C++, Java) checks types at compile time; <strong>dynamic typing</strong> (Python, JS) checks at run time.', de: 'Typen zaehlen, weil dieselben Bits Verschiedenes bedeuten. <strong>Statische Typisierung</strong> (C++, Java) prueft beim Kompilieren; <strong>dynamische</strong> (Python, JS) zur Laufzeit.' },
    ],
    how: [
      { en: 'Primitive types: integers (whole numbers), floating-point (decimals), boolean (true/false), char (one character).', de: 'Primitive Typen: Ganzzahlen, Gleitkomma, Boolean, Zeichen.' },
      { en: 'Each has a fixed size (e.g. a 32-bit int holds -2.1 billion to +2.1 billion) and overflows if exceeded.', de: 'Jeder hat feste Groesse (32-Bit-int: -2,1 bis +2,1 Mrd.) und laeuft bei Ueberschreitung ueber.' },
    ],
    pitfalls: [
      { en: 'Integer overflow wraps around silently; floating-point cannot represent 0.1 exactly. Both cause real bugs.', de: 'Ganzzahl-Ueberlauf laeuft still um; Gleitkomma kann 0,1 nicht exakt darstellen.' },
    ],
  },
  'control-flow': {
    tldr: { en: 'How a program decides what to run next: <strong>conditionals</strong> (if/else, switch) choose a branch; <strong>loops</strong> (for, while) repeat. Together they let a fixed program handle infinitely many inputs.', de: 'Wie ein Programm entscheidet, was als Naechstes laeuft: <strong>Bedingungen</strong> (if/else, switch) waehlen einen Zweig; <strong>Schleifen</strong> (for, while) wiederholen.' },
    how: [
      { en: 'if/else runs a block only when a condition is true.', de: 'if/else fuehrt einen Block nur bei wahrer Bedingung aus.' },
      { en: 'A for loop repeats a known number of times; a while loop repeats until a condition becomes false.', de: 'Eine for-Schleife wiederholt bekannt oft; eine while-Schleife bis eine Bedingung falsch wird.' },
      { en: 'break exits a loop early; continue skips to the next iteration.', de: 'break verlaesst die Schleife frueh; continue springt zur naechsten Iteration.' },
    ],
    pitfalls: [
      { en: 'An off-by-one in a loop bound, or a condition that never becomes false (infinite loop), are the classic beginner bugs.', de: 'Ein Off-by-one in der Schleifengrenze oder eine nie falsch werdende Bedingung (Endlosschleife) sind klassische Anfaengerfehler.' },
    ],
  },
  'functions': {
    tldr: { en: 'A function is a named, reusable block that takes parameters and returns a value. Arguments pass <strong>by value</strong> (a copy) or <strong>by reference</strong> (the original) - the difference decides whether the callee can change your data.', de: 'Eine Funktion ist ein benannter, wiederverwendbarer Block mit Parametern und Rueckgabe. Argumente werden <strong>als Wert</strong> (Kopie) oder <strong>als Referenz</strong> (Original) uebergeben.' },
    how: [
      { en: 'By value: the function gets a copy; changes do not affect the caller\'s variable.', de: 'Als Wert: die Funktion erhaelt eine Kopie; Aenderungen betreffen den Aufrufer nicht.' },
      { en: 'By reference (or pointer): the function gets access to the original; changes persist.', de: 'Als Referenz (oder Zeiger): die Funktion greift auf das Original zu; Aenderungen bleiben.' },
      { en: 'Functions enable decomposition - breaking a big problem into small, testable pieces.', de: 'Funktionen ermoeglichen Dekomposition - ein grosses Problem in kleine, testbare Teile zerlegen.' },
    ],
    pitfalls: [
      { en: 'Passing a large object by value silently copies it (slow). Pass by const reference to avoid the copy without allowing changes.', de: 'Ein grosses Objekt als Wert zu uebergeben kopiert es still (langsam). Als const-Referenz uebergeben.' },
    ],
  },
  'pointers': {
    tldr: { en: 'A pointer is a variable that holds a <strong>memory address</strong> rather than a value. It lets you share data without copying, build linked structures, and manage the heap - but a wrong pointer is the classic crash.', de: 'Ein Zeiger haelt eine <strong>Speicheradresse</strong> statt eines Werts. Er erlaubt Datenteilen ohne Kopie, verkettete Strukturen und Heap-Verwaltung.' },
    intro: [
      { en: 'Memory splits into the <strong>stack</strong> (fast, automatic, for local variables and call frames) and the <strong>heap</strong> (manual, for data that outlives a function, allocated with new/malloc). A pointer into the heap is how you keep data alive across function calls - and freeing it twice or never is how you get bugs.', de: 'Speicher teilt sich in <strong>Stack</strong> (schnell, automatisch, lokale Variablen) und <strong>Heap</strong> (manuell, fuer langlebige Daten, mit new/malloc). Ein Zeiger in den Heap haelt Daten am Leben.' },
    ],
    how: [
      { en: '&x gives the address of x; *p gives the value at the address p points to (dereferencing).', de: '&x liefert die Adresse von x; *p den Wert an der Adresse, auf die p zeigt (Dereferenzierung).' },
      { en: 'A linked list / tree is just nodes connected by pointers to other nodes.', de: 'Eine verkettete Liste / ein Baum ist nur Knoten, verbunden durch Zeiger.' },
      { en: 'Heap memory you allocate must be freed exactly once when done.', de: 'Heap-Speicher muss genau einmal freigegeben werden.' },
    ],
    paper: [
      { en: 'Draw each variable as a box. A pointer is a box holding an arrow to another box. To "dereference", follow the arrow.', de: 'Jede Variable als Kasten zeichnen. Ein Zeiger ist ein Kasten mit Pfeil zu einem anderen. „Dereferenzieren" = dem Pfeil folgen.' },
      { en: 'To trace pointer code: keep a table of variable → address → value, and update the arrows as assignments happen. Walk a linked list by repeatedly following the "next" arrow until null.', de: 'Zeigercode nachvollziehen: Tabelle Variable → Adresse → Wert fuehren und Pfeile bei Zuweisungen aktualisieren. Eine Liste durchlaufen: dem „next"-Pfeil folgen bis null.' },
    ],
    pitfalls: [
      { en: 'Dereferencing a null or freed pointer crashes (segfault). Use-after-free and double-free are the classic memory bugs.', de: 'Einen Null- oder freigegebenen Zeiger zu dereferenzieren stuerzt ab. Use-after-free und Double-free sind die klassischen Fehler.' },
    ],
  },
  'oop': {
    tldr: { en: 'Object-oriented programming bundles data and the functions that act on it into <strong>objects</strong> (instances of classes). Four pillars: encapsulation, inheritance, polymorphism, abstraction.', de: 'Objektorientierte Programmierung buendelt Daten und Funktionen in <strong>Objekten</strong> (Instanzen von Klassen). Vier Saeulen: Kapselung, Vererbung, Polymorphie, Abstraktion.' },
    how: [
      { en: '<strong>Encapsulation:</strong> hide internal data behind a public interface (private fields, public methods).', de: '<strong>Kapselung:</strong> interne Daten hinter einer oeffentlichen Schnittstelle verbergen.' },
      { en: '<strong>Inheritance:</strong> a class can extend another, reusing and specializing its behavior.', de: '<strong>Vererbung:</strong> eine Klasse kann eine andere erweitern und spezialisieren.' },
      { en: '<strong>Polymorphism:</strong> the same call (e.g. shape.area()) runs different code depending on the actual object type (virtual functions).', de: '<strong>Polymorphie:</strong> derselbe Aufruf laeuft je nach Objekttyp unterschiedlich (virtuelle Funktionen).' },
      { en: '<strong>Abstraction:</strong> expose only what matters; an abstract class defines an interface without full implementation.', de: '<strong>Abstraktion:</strong> nur das Wesentliche zeigen; eine abstrakte Klasse definiert eine Schnittstelle.' },
    ],
    pitfalls: [
      { en: 'Prefer composition over deep inheritance hierarchies - they get rigid and fragile fast.', de: 'Komposition statt tiefer Vererbungshierarchien bevorzugen - die werden schnell starr.' },
    ],
  },
  'templates': {
    tldr: { en: 'Templates (generics) let you write code once that works for any type. <code>template &lt;typename T&gt;</code> in C++ produces a type-specialized version at compile time, with no runtime cost. The STL is built entirely on them.', de: 'Templates (Generics) lassen Code einmal fuer beliebige Typen schreiben. <code>template &lt;typename T&gt;</code> erzeugt zur Compilezeit eine typspezialisierte Version, ohne Laufzeitkosten.' },
    intro: [
      { en: 'Without generics you would write <code>maxInt</code>, <code>maxDouble</code>, <code>maxString</code> separately. A template writes <code>max&lt;T&gt;</code> once and the compiler stamps out each needed version. The C++ <strong>STL</strong> (vector, map, sort, ...) is generic so it works with any element type.', de: 'Ohne Generics schriebst du <code>maxInt</code>, <code>maxDouble</code> getrennt. Ein Template schreibt <code>max&lt;T&gt;</code> einmal; der Compiler erzeugt jede Version. Die <strong>STL</strong> ist generisch.' },
    ],
    how: [
      { en: 'Write the function/class with a type parameter T instead of a concrete type.', de: 'Funktion/Klasse mit Typparameter T statt konkretem Typ schreiben.' },
      { en: 'The compiler instantiates a concrete version for each type you actually use.', de: 'Der Compiler instanziiert pro genutztem Typ eine konkrete Version.' },
      { en: 'This gives type safety AND zero runtime overhead (unlike Java\'s type erasure).', de: 'Das gibt Typsicherheit UND null Laufzeitkosten.' },
    ],
    pitfalls: [
      { en: 'Template errors are notoriously verbose because they surface at instantiation, deep inside library code.', de: 'Template-Fehler sind beruechtigt ausfuehrlich, da sie bei der Instanziierung tief im Bibliothekscode erscheinen.' },
    ],
  },
  // ================= SYSTEMS =================
  'binary-arithmetic': {
    tldr: { en: 'Computers add and subtract in binary using <strong>two\'s complement</strong> to represent negatives: flip the bits and add 1. This makes subtraction just addition, so one circuit does both.', de: 'Computer rechnen binaer mit <strong>Zweierkomplement</strong> fuer negative Zahlen: Bits kippen und 1 addieren. So wird Subtraktion zu Addition.' },
    how: [
      { en: 'Add bit by bit right to left, carrying a 1 when the column sums to 2 or 3 - exactly like decimal.', de: 'Bit fuer Bit rechts nach links addieren, bei Spaltensumme 2 oder 3 einen Uebertrag - wie im Dezimalen.' },
      { en: 'Two\'s complement of a number: invert all bits, add 1. Now -5 + 5 = 0 with plain addition.', de: 'Zweierkomplement: alle Bits invertieren, 1 addieren. Dann -5 + 5 = 0 mit normaler Addition.' },
      { en: 'The leftmost bit is the sign: 0 = positive, 1 = negative.', de: 'Das linkeste Bit ist das Vorzeichen: 0 = positiv, 1 = negativ.' },
    ],
    complexity: [
      { case: { en: 'Add / subtract n bits', de: 'Addieren / Subtrahieren n Bits' }, time: 'O(n)', space: 'O(1)', cls: 'best', note: { en: 'Two\'s complement is used precisely so subtraction needs no separate circuit - just negate and add.', de: 'Zweierkomplement wird genutzt, damit Subtraktion keine eigene Schaltung braucht.' } },
    ],
    pitfalls: [
      { en: 'Overflow: adding two positives can give a negative if the result exceeds the bit width. The sign bit flips unexpectedly.', de: 'Ueberlauf: zwei Positive koennen negativ ergeben, wenn das Ergebnis die Bitbreite ueberschreitet.' },
    ],
  },
  'von-neumann': {
    tldr: { en: 'The architecture of nearly every computer: a single memory holds <strong>both program and data</strong>, and a CPU repeatedly fetches, decodes and executes instructions. Its limit (the "von Neumann bottleneck") is the CPU-memory bus.', de: 'Die Architektur fast jedes Computers: ein Speicher haelt <strong>Programm und Daten</strong>, eine CPU holt, dekodiert und fuehrt Befehle wiederholt aus.' },
    how: [
      { en: 'The CPU has a control unit, an ALU (arithmetic/logic), and registers (tiny fast storage).', de: 'Die CPU hat ein Steuerwerk, eine ALU (Arithmetik/Logik) und Register (winziger schneller Speicher).' },
      { en: 'The fetch-decode-execute cycle: fetch the next instruction from memory, decode it, execute it, repeat.', de: 'Der Hol-Dekodier-Ausfuehr-Zyklus: naechsten Befehl holen, dekodieren, ausfuehren, wiederholen.' },
      { en: 'Because code and data share one memory and one bus, the CPU often waits on memory - the bottleneck.', de: 'Da Code und Daten einen Speicher und Bus teilen, wartet die CPU oft auf den Speicher - der Engpass.' },
    ],
    pitfalls: [
      { en: 'Program and data living in the same memory is what enables both flexibility and self-modifying code (and some security holes).', de: 'Programm und Daten im selben Speicher ermoeglichen Flexibilitaet und selbstmodifizierenden Code.' },
    ],
  },
  'memory-hierarchy': {
    tldr: { en: 'Storage is a pyramid trading speed for size: <strong>registers → cache (L1/L2/L3) → RAM → SSD/disk</strong>. Each level down is bigger but ~10-100× slower. Caching keeps hot data near the CPU.', de: 'Speicher ist eine Pyramide aus Tempo vs Groesse: <strong>Register → Cache → RAM → SSD/Platte</strong>. Jede Stufe ist groesser, aber ~10-100× langsamer.' },
    how: [
      { en: 'Registers: a few dozen, sub-nanosecond. Cache: KB-MB, a few nanoseconds. RAM: GB, ~100 ns. Disk: TB, milliseconds.', de: 'Register: Dutzende, Sub-Nanosekunde. Cache: KB-MB, Nanosekunden. RAM: GB, ~100 ns. Platte: TB, Millisekunden.' },
      { en: 'When the CPU needs data, it checks each level in turn; a cache "hit" is fast, a "miss" falls through to slower memory.', de: 'Braucht die CPU Daten, prueft sie jede Stufe; ein Cache-„Hit" ist schnell, ein „Miss" faellt auf langsameren Speicher durch.' },
      { en: 'Locality (reusing recent data, or nearby data) is why caching works at all.', de: 'Lokalitaet (kuerzliche oder benachbarte Daten wiederverwenden) ist der Grund, warum Caching funktioniert.' },
    ],
    pitfalls: [
      { en: 'Cache-friendly code (sequential access) can be many times faster than the same algorithm with random access - locality matters as much as Big-O for real speed.', de: 'Cache-freundlicher Code (sequentieller Zugriff) kann um ein Vielfaches schneller sein - Lokalitaet zaehlt fuer echtes Tempo so viel wie Big-O.' },
    ],
  },
  'processes-threads': {
    tldr: { en: 'A <strong>process</strong> is a running program with its own memory; a <strong>thread</strong> is a unit of execution inside a process, sharing its memory. Threads enable concurrency but introduce race conditions.', de: 'Ein <strong>Prozess</strong> ist ein laufendes Programm mit eigenem Speicher; ein <strong>Thread</strong> eine Ausfuehrungseinheit darin, die den Speicher teilt.' },
    how: [
      { en: 'Processes are isolated: one crashing does not take down others. Communication between them is explicit (IPC).', de: 'Prozesse sind isoliert: stuerzt einer ab, bleiben andere. Kommunikation ist explizit (IPC).' },
      { en: 'Threads within a process share memory, so they communicate cheaply - but must coordinate access.', de: 'Threads in einem Prozess teilen Speicher, kommunizieren also guenstig - muessen Zugriff aber koordinieren.' },
      { en: 'The OS scheduler interleaves them on the CPU cores, giving the illusion of simultaneity (and real parallelism on multiple cores).', de: 'Der OS-Scheduler verschachtelt sie auf den Kernen, was Gleichzeitigkeit vortaeuscht (und auf mehreren Kernen echte Parallelitaet ist).' },
    ],
    pitfalls: [
      { en: 'Shared mutable state across threads causes race conditions; you need locks/mutexes, which can in turn deadlock.', de: 'Geteilter veraenderlicher Zustand verursacht Race Conditions; Locks/Mutexe noetig, die wiederum verklemmen koennen.' },
    ],
  },
  // ================= WEB =================
  'how-web-works': {
    tldr: { en: 'You type a URL; the browser resolves the domain via <strong>DNS</strong>, opens a <strong>TCP</strong> connection, sends an <strong>HTTP</strong> request, and the server returns HTML/CSS/JS that the browser renders. Client asks, server answers.', de: 'Du tippst eine URL; der Browser loest die Domain per <strong>DNS</strong>, oeffnet eine <strong>TCP</strong>-Verbindung, sendet eine <strong>HTTP</strong>-Anfrage, der Server antwortet mit HTML/CSS/JS.' },
    intro: [
      { en: 'The web is a <strong>client-server</strong> system layered on the internet. The <strong>client</strong> (your browser) and the <strong>server</strong> (a machine hosting the site) speak <strong>HTTP</strong>, which itself rides on <strong>TCP/IP</strong>. The browser is also a rendering engine: it parses the returned HTML into a DOM tree, applies CSS, and runs JavaScript - which is why a page can change after it loads without a new request (that is what AJAX and single-page apps do).', de: 'Das Web ist ein <strong>Client-Server</strong>-System auf dem Internet. Der <strong>Client</strong> (dein Browser) und der <strong>Server</strong> sprechen <strong>HTTP</strong>, das auf <strong>TCP/IP</strong> aufsetzt. Der Browser ist auch eine Render-Engine: er parst HTML zu einem DOM-Baum, wendet CSS an und fuehrt JavaScript aus.' },
      { en: 'Static vs dynamic: a <strong>static</strong> page is a file served as-is; a <strong>dynamic</strong> page is generated per request by server code (PHP, Node, etc.), often pulling from a database. The browser cannot tell the difference - it just receives HTML.', de: 'Statisch vs dynamisch: eine <strong>statische</strong> Seite ist eine Datei; eine <strong>dynamische</strong> wird pro Anfrage von Servercode (PHP, Node) erzeugt, oft aus einer Datenbank. Der Browser sieht keinen Unterschied - er erhaelt nur HTML.' },
    ],
    how: [
      { en: 'DNS turns the domain name into an IP address.', de: 'DNS macht aus dem Domainnamen eine IP-Adresse.' },
      { en: 'The browser opens a TCP (often TLS-encrypted) connection to that IP.', de: 'Der Browser oeffnet eine TCP-Verbindung (oft TLS-verschluesselt) zu dieser IP.' },
      { en: 'It sends an HTTP request; the server responds with status + content; the browser parses and renders it.', de: 'Er sendet eine HTTP-Anfrage; der Server antwortet mit Status + Inhalt; der Browser rendert.' },
    ],
    pitfalls: [
      { en: 'It is request-response and stateless: the server forgets you between requests unless cookies/sessions carry state.', de: 'Es ist Anfrage-Antwort und zustandslos: der Server vergisst dich zwischen Anfragen ohne Cookies/Sessions.' },
      { en: 'A single page load is many requests, not one: the HTML triggers more requests for CSS, JS, images and fonts - each its own round trip.', de: 'Ein Seitenaufruf sind viele Anfragen, nicht eine: das HTML loest weitere fuer CSS, JS, Bilder und Schriften aus.' },
    ],
  },
  'dns': {
    tldr: { en: 'DNS is the internet\'s phone book: it translates human names (example.com) into IP addresses (93.184.216.34). A hierarchical, cached lookup from root → TLD → authoritative server.', de: 'DNS ist das Telefonbuch des Internets: es uebersetzt Namen (example.com) in IP-Adressen. Eine hierarchische, gecachte Aufloesung von Root → TLD → autoritativem Server.' },
    how: [
      { en: 'Your resolver asks a root server, which points to the .com TLD server, which points to the domain\'s authoritative server, which returns the IP.', de: 'Dein Resolver fragt einen Root-Server, der auf den .com-Server zeigt, der auf den autoritativen Server zeigt, der die IP liefert.' },
      { en: 'Results are cached at every level (browser, OS, resolver) with a TTL, so repeat lookups are instant.', de: 'Ergebnisse werden auf jeder Ebene mit einer TTL gecacht, sodass Wiederholungen sofort sind.' },
      { en: 'Record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail).', de: 'Eintragstypen: A (IPv4), AAAA (IPv6), CNAME (Alias), MX (Mail).' },
    ],
    pitfalls: [
      { en: 'DNS changes are not instant - caching (TTL) means updates can take time to propagate worldwide.', de: 'DNS-Aenderungen sind nicht sofort - Caching (TTL) bedeutet, Updates brauchen Zeit zur Verbreitung.' },
      { en: 'DNS resolution happens BEFORE any HTTP request - a slow or failed DNS lookup looks like "the site is down" even when the server is fine.', de: 'DNS-Aufloesung passiert VOR jeder HTTP-Anfrage - ein langsamer DNS-Lookup wirkt wie „die Seite ist down", obwohl der Server laeuft.' },
    ],
  },
  'cookies-sessions': {
    tldr: { en: 'HTTP is stateless, so to "remember" a logged-in user the server sets a <strong>cookie</strong> (small data stored by the browser, resent on every request). A <strong>session</strong> keeps the real data server-side, with the cookie holding only an ID.', de: 'HTTP ist zustandslos; um einen Nutzer zu „merken", setzt der Server ein <strong>Cookie</strong> (kleine Browserdaten, bei jeder Anfrage mitgesendet). Eine <strong>Session</strong> haelt die Daten serverseitig, das Cookie nur eine ID.' },
    intro: [
      { en: 'Because each HTTP request is independent, the server needs a token to recognize returning visitors. On login the server sends <code>Set-Cookie: sessionid=abc123</code>; the browser attaches <code>Cookie: sessionid=abc123</code> to every later request, and the server looks up the matching session to know who you are.', de: 'Da jede HTTP-Anfrage unabhaengig ist, braucht der Server ein Token. Beim Login sendet er <code>Set-Cookie: sessionid=abc123</code>; der Browser haengt es an jede Anfrage, der Server schlaegt die Session nach.' },
    ],
    how: [
      { en: '<strong>Cookie:</strong> a name=value pair the browser stores and resends to the same domain. Can have an expiry, or vanish when the browser closes (session cookie).', de: '<strong>Cookie:</strong> ein name=wert-Paar, das der Browser speichert und an dieselbe Domain zuruecksendet.' },
      { en: '<strong>Session:</strong> server-side storage keyed by a session ID. The cookie carries only the ID, so sensitive data never lives in the browser.', de: '<strong>Session:</strong> serverseitiger Speicher per Session-ID. Das Cookie traegt nur die ID.' },
      { en: 'Security flags: HttpOnly (JS cannot read it), Secure (HTTPS only), SameSite (limits cross-site sending).', de: 'Sicherheits-Flags: HttpOnly (kein JS-Zugriff), Secure (nur HTTPS), SameSite (begrenzt Cross-Site).' },
    ],
    pitfalls: [
      { en: 'Cookies are sent on EVERY request to the domain - storing large data in them slows every request. Use a session ID + server storage.', de: 'Cookies werden bei JEDER Anfrage gesendet - grosse Daten darin verlangsamen alles. Session-ID + Serverspeicher nutzen.' },
      { en: 'Without HttpOnly/Secure/SameSite, cookies are vulnerable to XSS theft and CSRF.', de: 'Ohne HttpOnly/Secure/SameSite sind Cookies anfaellig fuer XSS-Diebstahl und CSRF.' },
    ],
  },
  'json-xml': {
    tldr: { en: 'Two text formats for exchanging structured data. <strong>JSON</strong> is lightweight, JS-native, and dominates web APIs; <strong>XML</strong> is verbose but supports schemas, namespaces and attributes. Both are language-independent.', de: 'Zwei Textformate fuer strukturierte Daten. <strong>JSON</strong> ist leichtgewichtig, JS-nativ und dominiert Web-APIs; <strong>XML</strong> ist ausfuehrlicher, unterstuetzt aber Schemata und Namespaces.' },
    intro: [
      { en: 'Both solve the same problem: how do two programs (maybe in different languages, on different machines) exchange structured data as plain text? <strong>JSON</strong> (JavaScript Object Notation) maps directly onto the objects and arrays of almost every language, which is why APIs returning JSON are trivial to consume. <strong>XML</strong> (eXtensible Markup Language) predates it, is heavier, but supports validation against a schema (DTD/XSD), namespaces to avoid name clashes, and attributes on elements.', de: 'Beide loesen dasselbe: wie tauschen zwei Programme strukturierte Daten als Text aus? <strong>JSON</strong> bildet direkt auf Objekte und Arrays fast jeder Sprache ab. <strong>XML</strong> ist aelter, schwerer, unterstuetzt aber Schema-Validierung (DTD/XSD), Namespaces und Attribute.' },
    ],
    how: [
      { en: 'JSON: objects { "key": value }, arrays [ ... ], with strings, numbers, booleans, null. Maps directly to most languages\' data structures.', de: 'JSON: Objekte { "key": wert }, Arrays [ ... ], mit Strings, Zahlen, Booleans, null.' },
      { en: 'XML: nested <tags> with optional attributes and a closing tag. More structure, more ceremony.', de: 'XML: verschachtelte <Tags> mit optionalen Attributen und schliessendem Tag. Mehr Struktur, mehr Aufwand.' },
    ],
    pitfalls: [
      { en: 'JSON has no comments and no date type; trailing commas are invalid. These trip people up constantly.', de: 'JSON hat keine Kommentare und keinen Datumstyp; abschliessende Kommas sind ungueltig.' },
      { en: 'XML distinguishes attributes (<code>&lt;user id="5"&gt;</code>) from child elements; JSON has only key-value pairs. Translating between them is not always 1:1.', de: 'XML unterscheidet Attribute von Kindelementen; JSON hat nur Schluessel-Wert-Paare. Die Uebersetzung ist nicht immer 1:1.' },
    ],
  },
}

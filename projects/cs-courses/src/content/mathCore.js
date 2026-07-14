// Discrete math + calculus + remaining DP/divide content. Complexity tables on
// the algorithmic ones; calculus pages focus on intuition + formal notation.
export const mathCoreContent = {
  'warshall': {
    tldr: { en: 'Computes the <strong>transitive closure</strong> of a graph: can i reach j (possibly through other nodes)? Same triple loop as Floyd-Warshall but with booleans instead of distances. <strong>O(V³)</strong>.', de: 'Berechnet die <strong>transitive Huelle</strong> eines Graphen: kann i j erreichen (evtl. ueber andere Knoten)? Gleiche Dreifachschleife wie Floyd-Warshall, aber boolesch statt Distanzen. <strong>O(V³)</strong>.' },
    when: { en: 'Reachability queries, detecting whether a relation is transitive, dependency analysis, and equivalence/closure problems in discrete math. Use when you need yes/no connectivity, not shortest distance.', de: 'Erreichbarkeitsabfragen, Transitivitaetspruefung einer Relation, Abhaengigkeitsanalyse und Huellen-Probleme in der diskreten Mathematik.' },
    how: [
      { en: 'Start with the adjacency matrix (1 where a direct edge exists).', de: 'Mit der Adjazenzmatrix beginnen (1 bei direkter Kante).' },
      { en: 'For each intermediate node k, for every pair (i,j): if i→k and k→j are both reachable, mark i→j reachable.', de: 'Fuer jeden Zwischenknoten k, fuer jedes Paar (i,j): sind i→k und k→j erreichbar, markiere i→j als erreichbar.' },
      { en: 'After all k, R[i][j]=1 means j is reachable from i.', de: 'Nach allen k bedeutet R[i][j]=1, dass j von i erreichbar ist.' },
    ],
    paper: [
      { en: 'Write the matrix. For each k (outer), scan row i and column k: wherever R[i][k]=1, OR row k into row i.', de: 'Matrix schreiben. Pro k (aussen) Zeile i und Spalte k scannen: wo R[i][k]=1, Zeile k in Zeile i ODER-verknuepfen.' },
      { en: 'Do k = A, then B, then C... in order. k is always the outermost loop - the same rule as Floyd-Warshall.', de: 'k = A, dann B, dann C... der Reihe nach. k ist stets die aeusserste Schleife - dieselbe Regel wie Floyd-Warshall.' },
    ],
    complexity: [
      { case: { en: 'All cases', de: 'Alle Faelle' }, time: 'O(V³)', space: 'O(V²)', cls: 'avg', note: { en: 'Three nested loops over all nodes; k must be the outer loop, exactly like Floyd-Warshall.', de: 'Drei verschachtelte Schleifen; k muss aussen sein, genau wie Floyd-Warshall.' } },
    ],
    pitfalls: [
      { en: 'Warshall = reachability (boolean); Floyd-Warshall = shortest distances (numbers). Same structure, different update.', de: 'Warshall = Erreichbarkeit (boolesch); Floyd-Warshall = kuerzeste Distanzen (Zahlen). Gleiche Struktur, andere Aktualisierung.' },
    ],
  },
  'euclid-gcd': {
    tldr: { en: 'Finds the greatest common divisor by repeatedly replacing (a,b) with (b, a mod b) until the remainder is 0. <strong>O(log min(a,b))</strong> - astonishingly fast, and one of the oldest algorithms.', de: 'Findet den groessten gemeinsamen Teiler, indem (a,b) wiederholt durch (b, a mod b) ersetzt wird, bis der Rest 0 ist. <strong>O(log min(a,b))</strong>.' },
    when: { en: 'Simplifying fractions, modular arithmetic, cryptography (RSA key math), and as a subroutine in the extended version for modular inverses.', de: 'Brueche kuerzen, modulare Arithmetik, Kryptographie (RSA), und als Teilroutine der erweiterten Version fuer modulare Inverse.' },
    how: [
      { en: 'If b is 0, the gcd is a.', de: 'Ist b 0, ist der ggT a.' },
      { en: 'Otherwise compute a mod b, then repeat with (b, a mod b).', de: 'Sonst a mod b berechnen, dann mit (b, a mod b) wiederholen.' },
      { en: 'The remainders shrink fast, so it terminates in logarithmically many steps.', de: 'Die Reste schrumpfen schnell, daher endet es in logarithmisch vielen Schritten.' },
    ],
    paper: [
      { en: 'Write a = q∗b + r repeatedly. Each line, the old b becomes the new a, and r becomes the new b.', de: 'Wiederholt a = q∗b + r schreiben. Pro Zeile wird das alte b zum neuen a und r zum neuen b.' },
      { en: 'Stop when r = 0; the last non-zero remainder (the current b) is the gcd.', de: 'Stoppen, wenn r = 0; der letzte Rest ungleich 0 (das aktuelle b) ist der ggT.' },
    ],
    complexity: [
      { case: { en: 'All cases', de: 'Alle Faelle' }, time: 'O(log min(a,b))', space: 'O(1)', cls: 'best', note: { en: 'Worst case is consecutive Fibonacci numbers - that is where it takes the most steps.', de: 'Schlechtester Fall sind aufeinanderfolgende Fibonacci-Zahlen - dort braucht es die meisten Schritte.' } },
    ],
    pitfalls: [
      { en: 'gcd(a,0) = a, not 0 - the base case people get backwards.', de: 'ggT(a,0) = a, nicht 0 - der oft vertauschte Basisfall.' },
    ],
  },
  'modular-exp': {
    tldr: { en: 'Computes b^e mod m using <strong>exponentiation by squaring</strong> in <strong>O(log e)</strong> instead of e multiplications. Without it, RSA and Diffie-Hellman (huge exponents) would be impossible.', de: 'Berechnet b^e mod m durch <strong>Quadrieren</strong> in <strong>O(log e)</strong> statt e Multiplikationen. Ohne es waeren RSA und Diffie-Hellman unmoeglich.' },
    when: { en: 'All of public-key cryptography, primality testing (Fermat, Miller-Rabin), and hashing. Anywhere you raise to a large power under a modulus.', de: 'Die gesamte Public-Key-Kryptographie, Primzahltests (Fermat, Miller-Rabin) und Hashing.' },
    how: [
      { en: 'Read the exponent in binary.', de: 'Den Exponenten binaer lesen.' },
      { en: 'Square the running base at every bit; when the bit is 1, multiply it into the result.', de: 'Die laufende Basis bei jedem Bit quadrieren; bei Bit 1 ins Ergebnis multiplizieren.' },
      { en: 'Take mod m after every operation to keep numbers small.', de: 'Nach jeder Operation mod m nehmen, um Zahlen klein zu halten.' },
    ],
    complexity: [
      { case: { en: 'All cases', de: 'Alle Faelle' }, time: 'O(log e)', space: 'O(1)', cls: 'best', note: { en: 'log e squarings vs e naive multiplications - the difference between feasible and impossible for crypto-size exponents.', de: 'log e Quadrierungen statt e Multiplikationen - der Unterschied zwischen machbar und unmoeglich.' } },
    ],
    pitfalls: [
      { en: 'Reduce mod m after EVERY multiply, not just at the end, or the numbers overflow.', de: 'Nach JEDER Multiplikation mod m, nicht erst am Ende, sonst laufen die Zahlen ueber.' },
    ],
  },
  'extended-euclid': {
    tldr: { en: 'Euclid that also finds integers x, y with <strong>ax + by = gcd(a,b)</strong> (Bezout). Its main use: computing the <strong>modular inverse</strong> needed for RSA decryption. O(log min(a,b)).', de: 'Euklid, der zusaetzlich ganze x, y mit <strong>ax + by = ggT(a,b)</strong> findet (Bezout). Hauptnutzen: das <strong>modulare Inverse</strong> fuer RSA.' },
    when: { en: 'Computing modular inverses (a⁻¹ mod m), solving linear Diophantine equations, and the Chinese Remainder Theorem.', de: 'Modulare Inverse (a⁻¹ mod m), lineare diophantische Gleichungen und der chinesische Restsatz.' },
    how: [
      { en: 'Run Euclid, but carry coefficients backward.', de: 'Euklid ausfuehren, aber Koeffizienten rueckwaerts mitfuehren.' },
      { en: 'At the base case gcd = a, the coefficients are (1, 0).', de: 'Im Basisfall ggT = a sind die Koeffizienten (1, 0).' },
      { en: 'Substitute back up the chain to express the gcd as ax + by.', de: 'Die Kette hochsubstituieren, um den ggT als ax + by auszudruecken.' },
    ],
    complexity: [
      { case: { en: 'All cases', de: 'Alle Faelle' }, time: 'O(log min(a,b))', space: 'O(log n)', cls: 'best', note: { en: 'Same speed as plain Euclid; the modular inverse exists only when gcd(a,m)=1.', de: 'So schnell wie einfacher Euklid; das modulare Inverse existiert nur bei ggT(a,m)=1.' } },
    ],
    pitfalls: [
      { en: 'a has a modular inverse mod m only if gcd(a,m) = 1 (they are coprime).', de: 'a hat ein Inverses mod m nur, wenn ggT(a,m) = 1 (teilerfremd).' },
    ],
  },
  'crt': {
    tldr: { en: 'The Chinese Remainder Theorem reconstructs a unique number from its remainders modulo several <strong>coprime</strong> moduli. If x≡a₁(mod m₁) and x≡a₂(mod m₂), there is exactly one x mod m₁m₂.', de: 'Der chinesische Restsatz rekonstruiert eine eindeutige Zahl aus ihren Resten modulo mehrerer <strong>teilerfremder</strong> Moduln.' },
    when: { en: 'Speeding up RSA (CRT optimization), combining modular computations, and many number-theory exam problems.', de: 'RSA-Beschleunigung (CRT-Optimierung), Kombination modularer Berechnungen und viele zahlentheoretische Aufgaben.' },
    how: [
      { en: 'Given x ≡ aᵢ (mod mᵢ) for pairwise-coprime mᵢ, let M = product of all mᵢ.', de: 'Gegeben x ≡ aᵢ (mod mᵢ) fuer paarweise teilerfremde mᵢ, sei M = Produkt aller mᵢ.' },
      { en: 'For each i compute Mᵢ = M/mᵢ and its inverse mod mᵢ.', de: 'Fuer jedes i Mᵢ = M/mᵢ und sein Inverses mod mᵢ berechnen.' },
      { en: 'Sum aᵢ∗Mᵢ∗(Mᵢ⁻¹) and take mod M for the unique answer.', de: 'aᵢ∗Mᵢ∗(Mᵢ⁻¹) summieren und mod M fuer die eindeutige Antwort.' },
    ],
    complexity: [
      { case: { en: 'All cases', de: 'Alle Faelle' }, time: 'O(k log M)', space: 'O(k)', cls: 'avg', note: { en: 'k = number of congruences. The moduli MUST be pairwise coprime for a unique solution.', de: 'k = Anzahl Kongruenzen. Die Moduln MUESSEN paarweise teilerfremd sein.' } },
    ],
    pitfalls: [
      { en: 'No unique solution if the moduli are not coprime - the headline condition.', de: 'Keine eindeutige Loesung, wenn die Moduln nicht teilerfremd sind - die zentrale Bedingung.' },
    ],
  },
  'combinatorics': {
    tldr: { en: 'Counting without listing. Built on two rules - <strong>sum</strong> (disjoint choices add) and <strong>product</strong> (independent steps multiply) - giving permutations P(n,k)=n!/(n-k)! (order matters) and combinations C(n,k)=n!/(k!(n-k)!) (order doesn\'t). Plus the pigeonhole principle.', de: 'Zaehlen ohne Auflisten. Zwei Regeln - <strong>Summe</strong> (disjunkte Wahlen addieren) und <strong>Produkt</strong> (unabhaengige Schritte multiplizieren) - ergeben Permutationen P(n,k)=n!/(n-k)! und Kombinationen C(n,k)=n!/(k!(n-k)!). Plus Schubfachprinzip.' },
    intro: [
      { en: '<strong>Sum rule</strong>: if sets A₁...Aₖ are pairwise disjoint, |A₁ ∪ ... ∪ Aₖ| = |A₁| + ... + |Aₖ|. <strong>Product rule</strong>: for a sequence of independent choices, the totals multiply.', de: '<strong>Summenregel</strong>: sind A₁...Aₖ paarweise disjunkt, dann |A₁ ∪ ... ∪ Aₖ| = |A₁| + ... + |Aₖ|. <strong>Produktregel</strong>: bei unabhaengigen Wahlen multiplizieren sich die Anzahlen.' },
      { en: '<strong>Ordered without repetition</strong> (permutations): P(n,k) = n!/(n-k)!; with k=n this is n!. <strong>Unordered without repetition</strong> (combinations): C(n,k) = n!/(k!(n-k)!). <strong>With repetition</strong>: ordered is nᵏ, unordered is C(n+k-1, k).', de: '<strong>Geordnet ohne Wiederholung</strong> (Permutationen): P(n,k) = n!/(n-k)!; mit k=n ist es n!. <strong>Ungeordnet ohne Wiederholung</strong> (Kombinationen): C(n,k) = n!/(k!(n-k)!). <strong>Mit Wiederholung</strong>: geordnet nᵏ, ungeordnet C(n+k-1, k).' },
      { en: '<strong>Inclusion-exclusion</strong>: |A ∪ B| = |A| + |B| - |A ∩ B|, generalizing to alternating sums over all intersections. <strong>Binomial theorem</strong>: (a+b)ⁿ = Σ C(n,k) aⁿ⁻ᵏ bᵏ.', de: '<strong>Inklusion-Exklusion</strong>: |A ∪ B| = |A| + |B| - |A ∩ B|, verallgemeinert zu alternierenden Summen. <strong>Binomischer Satz</strong>: (a+b)ⁿ = Σ C(n,k) aⁿ⁻ᵏ bᵏ.' },
    ],
    how: [
      { en: 'Pigeonhole (Dirichlet): if a function f: A→B has |A| = n > m = |B|, then two distinct elements share an image - f(x) = f(x\').', de: 'Schubfach (Dirichlet): hat f: A→B mit |A| = n > m = |B|, dann teilen zwei verschiedene Elemente ein Bild - f(x) = f(x\').' },
      { en: 'Generalized pigeonhole: with n items in m boxes, some box holds at least ⌈n/m⌉ items.', de: 'Verallgemeinert: bei n Objekten in m Faechern enthaelt ein Fach mindestens ⌈n/m⌉ Objekte.' },
    ],
    complexity: [
      { case: { en: 'Permutation P(n,k)', de: 'Permutation P(n,k)' }, time: 'n!/(n-k)!', space: '-', cls: 'avg' },
      { case: { en: 'Combination C(n,k)', de: 'Kombination C(n,k)' }, time: 'n!/(k!(n-k)!)', space: '-', cls: 'best', note: { en: 'The decision tree: order matters? → permutation. Repetition allowed? → switch formula. Get those two questions right and the rest follows.', de: 'Der Entscheidungsbaum: Reihenfolge wichtig? → Permutation. Wiederholung erlaubt? → andere Formel.' } },
    ],
    pitfalls: [
      { en: 'Permutation vs combination: "a 3-person podium from 8" (order matters) is P(8,3); "a 3-person committee from 8" (order doesn\'t) is C(8,3). Same numbers, different answer.', de: 'Permutation vs Kombination: „3er-Podium aus 8" (Reihenfolge zaehlt) ist P(8,3); „3er-Komitee aus 8" ist C(8,3).' },
      { en: 'Pigeonhole only guarantees a collision EXISTS, never which box. It is an existence tool, not a constructive one.', de: 'Schubfach garantiert nur, DASS eine Kollision existiert, nie wo. Ein Existenzwerkzeug.' },
    ],
  },
  'induction': {
    tldr: { en: 'A proof technique: show a statement holds for a base case (n=1), then show that if it holds for n it holds for n+1. Together these prove it for <strong>all</strong> n - like dominoes falling.', de: 'Eine Beweistechnik: zeige die Aussage fuer einen Basisfall (n=1), dann dass aus n auch n+1 folgt. Zusammen beweist das alle n - wie fallende Dominosteine.' },
    when: { en: 'Proving formulas (sums, inequalities), correctness of recursive algorithms, and properties of recursively-defined structures. The backbone of CS proofs.', de: 'Formeln beweisen (Summen, Ungleichungen), Korrektheit rekursiver Algorithmen und Eigenschaften rekursiver Strukturen.' },
    how: [
      { en: 'Base case: prove the statement for the smallest n (often 0 or 1).', de: 'Basisfall: die Aussage fuer das kleinste n beweisen (oft 0 oder 1).' },
      { en: 'Inductive hypothesis: assume it holds for some n = k.', de: 'Induktionsannahme: annehmen, sie gilt fuer ein n = k.' },
      { en: 'Inductive step: using that assumption, prove it for n = k+1.', de: 'Induktionsschritt: mit dieser Annahme fuer n = k+1 beweisen.' },
    ],
    complexity: [
      { case: { en: 'Proof technique', de: 'Beweistechnik' }, time: '-', space: '-', cls: 'best', note: { en: 'Strong induction assumes the statement for all values ≤ k, not just k - useful for recurrences.', de: 'Starke Induktion nimmt die Aussage fuer alle Werte ≤ k an, nicht nur k - nuetzlich fuer Rekurrenzen.' } },
    ],
    pitfalls: [
      { en: 'A missing or wrong base case invalidates the whole proof - the most common error.', de: 'Ein fehlender oder falscher Basisfall macht den ganzen Beweis ungueltig - der haeufigste Fehler.' },
    ],
  },
  'logic-proofs': {
    tldr: { en: 'Propositional logic: statements combined with ¬, ∧, ∨, ⇒, ⇔, judged by truth tables. The named <strong>inference rules</strong> (Modus ponens, Modus tollens, syllogisms) are valid argument patterns you cite by name in proofs.', de: 'Aussagenlogik: Aussagen verknuepft mit ¬, ∧, ∨, ⇒, ⇔, beurteilt per Wahrheitstabelle. Die benannten <strong>Schlussregeln</strong> (Modus ponens, Modus tollens, Syllogismen) sind gueltige Argumentmuster.' },
    intro: [
      { en: 'A <strong>proposition</strong> is a statement that is true (1) or false (0). Connectives: ¬ (not), ∧ (and), ∨ (or), ⇒ (implies), ⇔ (iff). The implication A ⇒ B is equivalent to ¬A ∨ B - and is false ONLY when A is true and B is false.', de: 'Eine <strong>Aussage</strong> ist wahr (1) oder falsch (0). Junktoren: ¬, ∧, ∨, ⇒, ⇔. Die Implikation A ⇒ B ist gleichwertig zu ¬A ∨ B - und nur falsch, wenn A wahr und B falsch.' },
      { en: 'The valid <strong>inference rules</strong> you cite by name: <strong>Modus ponens</strong> (A, A⇒B ⊢ B), <strong>Modus tollens</strong> (¬B, A⇒B ⊢ ¬A), <strong>disjunctive syllogism</strong> (¬A, A∨B ⊢ B), <strong>hypothetical syllogism</strong> (A⇒B, B⇒C ⊢ A⇒C), simplification (A∧B ⊢ B), addition (A ⊢ A∨B).', de: 'Die benannten <strong>Schlussregeln</strong>: <strong>Modus ponens</strong> (A, A⇒B ⊢ B), <strong>Modus tollens</strong> (¬B, A⇒B ⊢ ¬A), <strong>disjunktiver Syllogismus</strong> (¬A, A∨B ⊢ B), <strong>hypothetischer Syllogismus</strong> (A⇒B, B⇒C ⊢ A⇒C).' },
      { en: 'A <strong>tautology</strong> is true under every assignment; a <strong>contradiction</strong> false under every one. Proof by contradiction (reductio ad absurdum) assumes the negation and derives a contradiction.', de: 'Eine <strong>Tautologie</strong> ist immer wahr; ein <strong>Widerspruch</strong> immer falsch. Der Widerspruchsbeweis nimmt die Negation an und leitet einen Widerspruch ab.' },
    ],
    how: [
      { en: 'Build a truth table: list all 2ⁿ combinations of the n variables, then evaluate the formula column by column.', de: 'Wahrheitstabelle bauen: alle 2ⁿ Kombinationen der n Variablen auflisten, dann die Formel spaltenweise auswerten.' },
      { en: 'To prove an argument valid, show the implication (premises ⇒ conclusion) is a tautology.', de: 'Ein Argument als gueltig beweisen: zeige, dass (Praemissen ⇒ Schluss) eine Tautologie ist.' },
    ],
    complexity: [
      { case: { en: 'Truth table', de: 'Wahrheitstabelle' }, time: '2^n rows', space: '-', cls: 'avg', note: { en: 'Key equivalences to memorize: A⇒B ≡ ¬A∨B, De Morgan ¬(A∧B) ≡ ¬A∨¬B, contrapositive A⇒B ≡ ¬B⇒¬A.', de: 'Wichtige Aequivalenzen: A⇒B ≡ ¬A∨B, De Morgan ¬(A∧B) ≡ ¬A∨¬B, Kontraposition A⇒B ≡ ¬B⇒¬A.' } },
    ],
    pitfalls: [
      { en: 'Implication with a false premise is TRUE ("if 2+2=5 then I am king" is a true statement). A⇒B fails only when A is true and B false.', de: 'Implikation mit falscher Praemisse ist WAHR. A⇒B scheitert nur bei A wahr, B falsch.' },
      { en: 'Affirming the consequent (B, A⇒B ⊢ A) is INVALID - a classic fallacy, not Modus ponens.', de: 'Bejahung des Konsequens (B, A⇒B ⊢ A) ist UNGUELTIG - ein klassischer Fehlschluss.' },
    ],
  },
  'relations': {
    tldr: { en: 'A relation R on a set A is any set of ordered pairs from A×A. Its <strong>properties</strong> classify it: reflexive, symmetric, transitive (and more). The three together define an <strong>equivalence relation</strong>, which partitions A into disjoint classes.', de: 'Eine Relation R auf einer Menge A ist eine Menge geordneter Paare aus A×A. Ihre <strong>Eigenschaften</strong> klassifizieren sie: reflexiv, symmetrisch, transitiv. Alle drei zusammen definieren eine <strong>Aequivalenzrelation</strong>, die A in disjunkte Klassen teilt.' },
    intro: [
      { en: 'A <strong>relation</strong> R ⊆ A×A relates element a to b when (a,b) ∈ R, written aRb. The exam tests whether a given relation has each property - here are the exact definitions:', de: 'Eine <strong>Relation</strong> R ⊆ A×A verbindet a mit b, wenn (a,b) ∈ R, geschrieben aRb. Die Pruefung testet, ob eine Relation jede Eigenschaft hat - hier die exakten Definitionen:' },
      { en: '<strong>Reflexive</strong>: aRa for every a ∈ A.   <strong>Irreflexive</strong>: never aRa.   <strong>Symmetric</strong>: aRb ⟹ bRa.   <strong>Asymmetric</strong>: aRb ⟹ ¬bRa.   <strong>Antisymmetric</strong>: (aRb ∧ bRa) ⟹ a = b.   <strong>Transitive</strong>: (aRb ∧ bRc) ⟹ aRc.', de: '<strong>Reflexiv</strong>: aRa fuer jedes a ∈ A.   <strong>Irreflexiv</strong>: nie aRa.   <strong>Symmetrisch</strong>: aRb ⟹ bRa.   <strong>Asymmetrisch</strong>: aRb ⟹ ¬bRa.   <strong>Antisymmetrisch</strong>: (aRb ∧ bRa) ⟹ a = b.   <strong>Transitiv</strong>: (aRb ∧ bRc) ⟹ aRc.' },
      { en: 'An <strong>equivalence relation</strong> is reflexive, symmetric AND transitive. It splits A into <strong>equivalence classes</strong> - disjoint subsets where everything is related (e.g. "has the same remainder mod 3" splits the integers into 3 classes). A <strong>partial order</strong> is reflexive, antisymmetric and transitive (e.g. ≤, or subset ⊆).', de: 'Eine <strong>Aequivalenzrelation</strong> ist reflexiv, symmetrisch UND transitiv. Sie teilt A in <strong>Aequivalenzklassen</strong>. Eine <strong>Halbordnung</strong> ist reflexiv, antisymmetrisch und transitiv (z.B. ≤ oder ⊆).' },
    ],
    paper: [
      { en: 'To check a property, test its definition against every relevant pair. Reflexive: is (a,a) present for ALL a? One missing pair kills it.', de: 'Eine Eigenschaft pruefen: ihre Definition an jedem Paar testen. Reflexiv: ist (a,a) fuer ALLE a da? Ein fehlendes Paar widerlegt es.' },
      { en: 'Symmetric: for every (a,b) in R, is (b,a) also in R? Transitive: for every chain a→b→c, is a→c present? Find one counterexample to disprove; otherwise it holds.', de: 'Symmetrisch: ist zu jedem (a,b) auch (b,a) da? Transitiv: ist zu jeder Kette a→b→c auch a→c da? Ein Gegenbeispiel widerlegt; sonst gilt es.' },
    ],
    complexity: [
      { case: { en: 'Equivalence relation', de: 'Aequivalenzrelation' }, time: 'reflexive + symmetric + transitive', space: '-', cls: 'best', note: { en: 'A relation can be reflexive AND irreflexive only if A is empty. Symmetric + antisymmetric together force a subset of the diagonal.', de: 'Eine Relation ist reflexiv UND irreflexiv nur bei leerer Menge A. Symmetrisch + antisymmetrisch erzwingt eine Teilmenge der Diagonale.' } },
    ],
    pitfalls: [
      { en: 'Antisymmetric is NOT "not symmetric". Antisymmetric means aRb ∧ bRa forces a = b - a relation can be both symmetric and antisymmetric (only the diagonal).', de: 'Antisymmetrisch ist NICHT „nicht symmetrisch". Es bedeutet aRb ∧ bRa erzwingt a = b - eine Relation kann beides sein (nur die Diagonale).' },
      { en: 'Transitivity is vacuously true if there are no chains a→b→c to check. "No counterexample" = it holds.', de: 'Transitivitaet gilt leer, wenn es keine Ketten a→b→c gibt. „Kein Gegenbeispiel" = es gilt.' },
    ],
  },
  // ---- CALCULUS (intuition-focused, formal notation in the viz) ----
  'epsilon-delta': {
    defs: [
      { name: { en: 'Limit (ε-δ definition)', de: 'Grenzwert (ε-δ-Definition)' },
        body: { en: 'L is the limit of f at c if f(x) can be made arbitrarily close to L by taking x close enough to c (but not equal to c).', de: 'L ist der Grenzwert von f bei c, wenn f(x) beliebig nahe an L gebracht werden kann, indem man x nahe genug an c waehlt (aber ungleich c).' },
        formal: { tex: '\\forall \\varepsilon>0\\;\\exists \\delta>0:\\; 0<|x-c|<\\delta \\implies |f(x)-L|<\\varepsilon' } },
      { name: { en: 'Continuity at a point', de: 'Stetigkeit in einem Punkt' },
        body: { en: 'f is continuous at c if the limit exists, f(c) is defined, and they are equal. Intuitively: no jump, hole or break at c.', de: 'f ist stetig bei c, wenn der Grenzwert existiert, f(c) definiert ist und beide gleich sind. Anschaulich: kein Sprung, kein Loch bei c.' },
        formal: { tex: '\\lim_{x \\to c} f(x) = f(c)' } },
      { name: { en: 'One-sided limits', de: 'Einseitige Grenzwerte' },
        body: { en: 'The two-sided limit exists only if the left limit and the right limit exist and agree.', de: 'Der beidseitige Grenzwert existiert nur, wenn linker und rechter Grenzwert existieren und uebereinstimmen.' },
        formal: { tex: '\\lim_{x \\to c^-} f(x) = \\lim_{x \\to c^+} f(x) = L' } },
    ],
    when: { en: 'The rigorous definition of a limit - the foundation of continuity, derivatives and integrals. You rarely compute with it, but understanding it is what separates "I can plug in numbers" from "I understand calculus".', de: 'Die strenge Definition eines Grenzwerts - die Grundlage von Stetigkeit, Ableitung und Integral.' },
    how: [
      { en: 'Claim: lim(x→c) f(x) = L means f(x) can be forced arbitrarily close to L.', de: 'Behauptung: lim(x→c) f(x) = L heisst, f(x) laesst sich beliebig nah an L zwingen.' },
      { en: 'Formally: for every tolerance ε > 0 there exists a δ > 0 such that 0 < |x - c| < δ guarantees |f(x) - L| < ε.', de: 'Formal: zu jeder Toleranz ε > 0 existiert ein δ > 0, sodass 0 < |x - c| < δ garantiert |f(x) - L| < ε.' },
      { en: 'You pick the ε (how close to L); the challenge is producing a δ (how close to c) that works.', de: 'Du waehlst ε (Naehe zu L); die Aufgabe ist ein passendes δ (Naehe zu c).' },
    ],
    complexity: [
      { case: { en: 'Definition', de: 'Definition' }, time: '-', space: '-', cls: 'best', note: { en: 'The order matters: ε is given FIRST, then you find δ. Swapping them is the classic misunderstanding.', de: 'Die Reihenfolge zaehlt: ε kommt ZUERST, dann findest du δ.' } },
    ],
    pitfalls: [
      { en: 'ε comes first, δ depends on it - not the other way around. This is THE thing to internalize.', de: 'ε zuerst, δ haengt davon ab - nicht umgekehrt. DAS muss sitzen.' },
    ],
  },
  'derivative': {
    defs: [
      { name: { en: 'Derivative (definition)', de: 'Ableitung (Definition)' },
        body: { en: 'The derivative of f at x is the limit of the difference quotient - the slope of the tangent line, if the limit exists.', de: 'Die Ableitung von f bei x ist der Grenzwert des Differenzenquotienten - die Tangentensteigung, falls der Grenzwert existiert.' },
        formal: { tex: 'f^{\\prime}(x) = \\lim_{h \\to 0} \\dfrac{f(x+h) - f(x)}{h}' } },
      { name: { en: 'Differentiable ⟹ continuous', de: 'Differenzierbar ⟹ stetig' },
        body: { en: 'If f is differentiable at c then it is continuous at c. The converse is false: |x| is continuous at 0 but not differentiable there.', de: 'Ist f bei c differenzierbar, dann ist es dort stetig. Die Umkehrung gilt nicht: |x| ist bei 0 stetig, aber nicht differenzierbar.' } },
      { name: { en: "Fermat's theorem (interior extremum)", de: 'Satz von Fermat (inneres Extremum)' },
        body: { en: 'If f has a local maximum or minimum at an interior point c and f is differentiable there, then the derivative is zero. This is THE "f\'(x)=0 at an extremum" rule - it gives the candidate points for optimization.', de: 'Hat f an einem inneren Punkt c ein lokales Maximum oder Minimum und ist dort differenzierbar, dann ist die Ableitung null. Das ist die „f\'(x)=0 im Extremum"-Regel - sie liefert die Kandidatenpunkte.' },
        formal: { tex: 'f^{\\prime}(c) = 0 \\;\\text{ at an interior extremum } c' } },
    ],
    when: { en: 'Rates of change: velocity, growth, slopes, optimization (max/min where f\'=0). The single most-used tool in applied math, physics and ML.', de: 'Aenderungsraten: Geschwindigkeit, Wachstum, Steigungen, Optimierung (Max/Min bei f\'=0).' },
    how: [
      { en: 'The secant line through (x, f(x)) and (x+h, f(x+h)) has slope [f(x+h)-f(x)]/h.', de: 'Die Sekante durch (x, f(x)) und (x+h, f(x+h)) hat die Steigung [f(x+h)-f(x)]/h.' },
      { en: 'As h → 0 the secant becomes the tangent; its slope is the derivative f\'(x).', de: 'Fuer h → 0 wird die Sekante zur Tangente; ihre Steigung ist die Ableitung f\'(x).' },
      { en: 'The derivative is itself a function: the slope of f at every point.', de: 'Die Ableitung ist selbst eine Funktion: die Steigung von f an jedem Punkt.' },
    ],
    complexity: [
      { case: { en: 'Definition', de: 'Definition' }, time: '-', space: '-', cls: 'best', note: { en: 'f\'(x) = lim(h→0) [f(x+h)-f(x)]/h. A function is differentiable only where this limit exists (smooth, no corners).', de: 'f\'(x) = lim(h→0) [f(x+h)-f(x)]/h. Differenzierbar nur, wo dieser Grenzwert existiert.' } },
    ],
    pitfalls: [
      { en: 'Differentiable ⟹ continuous, but not the reverse (|x| is continuous at 0 but has no derivative there).', de: 'Differenzierbar ⟹ stetig, aber nicht umgekehrt (|x| ist bei 0 stetig, aber nicht differenzierbar).' },
    ],
  },
  'riemann': {
    defs: [
      { name: { en: 'Definite integral (Riemann)', de: 'Bestimmtes Integral (Riemann)' },
        body: { en: 'The definite integral is the limit of Riemann sums as the partition width goes to zero - the signed area between f and the x-axis.', de: 'Das bestimmte Integral ist der Grenzwert der Riemann-Summen, wenn die Streifenbreite gegen null geht - die vorzeichenbehaftete Flaeche.' },
        formal: { tex: '\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x' } },
      { name: { en: 'Fundamental Theorem of Calculus', de: 'Hauptsatz der Differential- und Integralrechnung' },
        body: { en: 'Differentiation and integration are inverse operations: if F is an antiderivative of f, the definite integral is just F(b) - F(a).', de: 'Ableiten und Integrieren sind Umkehroperationen: ist F eine Stammfunktion von f, ist das bestimmte Integral F(b) - F(a).' },
        formal: { tex: '\\int_a^b f(x)\\,dx = F(b) - F(a), \\quad F^{\\prime} = f' } },
    ],
    when: { en: 'The definite integral = area under a curve = accumulated total (distance from speed, charge from current). The other half of calculus, inverse to the derivative.', de: 'Das bestimmte Integral = Flaeche unter der Kurve = akkumulierte Summe. Die andere Haelfte der Analysis, invers zur Ableitung.' },
    how: [
      { en: 'Slice [a,b] into n strips of width Δx.', de: '[a,b] in n Streifen der Breite Δx schneiden.' },
      { en: 'Approximate the area as a sum of rectangle areas Σ f(xᵢ)∗Δx.', de: 'Die Flaeche als Summe der Rechteckflaechen Σ f(xᵢ)∗Δx naehern.' },
      { en: 'As n → ∞ (thinner strips) the sum converges to the exact area - the definite integral.', de: 'Fuer n → ∞ konvergiert die Summe zur exakten Flaeche - das bestimmte Integral.' },
    ],
    complexity: [
      { case: { en: 'Definition', de: 'Definition' }, time: '-', space: '-', cls: 'best', note: { en: 'The Fundamental Theorem links it to derivatives: ∫f = F where F\'=f. That is why integration "undoes" differentiation.', de: 'Der Hauptsatz verbindet es mit Ableitungen: ∫f = F mit F\'=f.' } },
    ],
    pitfalls: [
      { en: 'Area below the x-axis counts as negative in a definite integral.', de: 'Flaeche unter der x-Achse zaehlt im bestimmten Integral negativ.' },
    ],
  },
  'taylor': {
    defs: [
      { name: { en: 'Taylor series', de: 'Taylor-Reihe' },
        body: { en: 'A function is approximated near a point a by a polynomial built from its derivatives at a. Centered at a = 0 it is called a Maclaurin series.', de: 'Eine Funktion wird nahe einem Punkt a durch ein Polynom aus ihren Ableitungen bei a angenaehert. Um a = 0 heisst sie Maclaurin-Reihe.' },
        formal: { tex: 'f(x) = \\sum_{n=0}^{\\infty} \\dfrac{f^{(n)}(a)}{n!}\\,(x-a)^n' } },
    ],
    when: { en: 'Approximating hard functions (sin, eˣ, ln) with polynomials a computer can actually evaluate. Behind calculators, physics approximations, and numerical methods.', de: 'Schwierige Funktionen (sin, eˣ, ln) mit Polynomen naehern, die ein Computer auswerten kann.' },
    how: [
      { en: 'Match the function\'s value and derivatives at one point with a polynomial.', de: 'Wert und Ableitungen der Funktion an einem Punkt mit einem Polynom abgleichen.' },
      { en: 'Each added term (using the next derivative / k!) improves the fit over a wider range.', de: 'Jeder weitere Term (naechste Ableitung / k!) verbessert die Naeherung ueber einen groesseren Bereich.' },
      { en: 'Near the expansion point even a few terms are extremely accurate.', de: 'Nahe dem Entwicklungspunkt sind schon wenige Terme sehr genau.' },
    ],
    complexity: [
      { case: { en: 'Concept', de: 'Konzept' }, time: '-', space: '-', cls: 'best', note: { en: 'A Maclaurin series is just a Taylor series centered at 0. More terms = wider accurate range.', de: 'Eine Maclaurin-Reihe ist eine Taylor-Reihe um 0. Mehr Terme = groesserer genauer Bereich.' } },
    ],
    pitfalls: [
      { en: 'Accuracy is local: far from the center, you need many more terms (or it may diverge).', de: 'Genauigkeit ist lokal: weit vom Zentrum braucht man viel mehr Terme (oder es divergiert).' },
    ],
  },
  'newton': {
    defs: [
      { name: { en: 'Newton iteration', de: 'Newton-Iteration' },
        body: { en: 'Each step replaces the current guess with where its tangent line crosses the x-axis.', de: 'Jeder Schritt ersetzt die Schaetzung durch den Schnittpunkt ihrer Tangente mit der x-Achse.' },
        formal: { tex: 'x_{n+1} = x_n - \\dfrac{f(x_n)}{f^{\\prime}(x_n)}' } },
    ],
    tldr: { en: 'Finds a root of f(x)=0 by following the tangent line down to the x-axis and repeating. <strong>Quadratic convergence</strong> - it roughly doubles the correct digits each step. Can diverge from a bad start.', de: 'Findet eine Nullstelle von f(x)=0, indem es der Tangente zur x-Achse folgt und wiederholt. <strong>Quadratische Konvergenz</strong>.' },
    when: { en: 'Solving equations with no closed form, optimization (finding where the derivative is 0), square roots, and numerical libraries everywhere.', de: 'Gleichungen ohne geschlossene Form loesen, Optimierung, Quadratwurzeln und ueberall in numerischen Bibliotheken.' },
    how: [
      { en: 'Start from a guess x₀.', de: 'Mit einer Schaetzung x₀ beginnen.' },
      { en: 'Follow the tangent at xₙ to where it crosses the x-axis: xₙ₊₁ = xₙ - f(xₙ)/f\'(xₙ).', de: 'Der Tangente bei xₙ bis zur x-Achse folgen: xₙ₊₁ = xₙ - f(xₙ)/f\'(xₙ).' },
      { en: 'Repeat until f(xₙ) is close enough to 0.', de: 'Wiederholen, bis f(xₙ) nahe genug an 0 ist.' },
    ],
    complexity: [
      { case: { en: 'Convergence', de: 'Konvergenz' }, time: 'quadratic', space: 'O(1)', cls: 'best', note: { en: 'Doubles correct digits per step near the root - but a poor starting guess or f\'=0 can make it diverge.', de: 'Verdoppelt korrekte Stellen pro Schritt nahe der Nullstelle - aber schlechte Schaetzung oder f\'=0 kann divergieren.' } },
    ],
    pitfalls: [
      { en: 'If f\'(x) is near 0, the tangent is nearly flat and the method shoots far away - it can fail to converge.', de: 'Ist f\'(x) nahe 0, ist die Tangente fast flach und das Verfahren schiesst weit weg.' },
    ],
  },
  'sequences': {
    defs: [
      { name: { en: 'Convergence of a sequence', de: 'Konvergenz einer Folge' },
        body: { en: 'A sequence converges to L if its terms eventually stay arbitrarily close to L.', de: 'Eine Folge konvergiert gegen L, wenn ihre Glieder schliesslich beliebig nahe an L bleiben.' },
        formal: { tex: '\\forall \\varepsilon>0\\;\\exists N:\\; n>N \\implies |a_n - L| < \\varepsilon' } },
      { name: { en: 'Geometric series', de: 'Geometrische Reihe' },
        body: { en: 'A geometric series converges exactly when the ratio has absolute value below 1, and then it has a closed-form sum.', de: 'Eine geometrische Reihe konvergiert genau dann, wenn der Betrag des Quotienten kleiner als 1 ist, mit geschlossener Summe.' },
        formal: { tex: '\\sum_{n=0}^{\\infty} r^n = \\dfrac{1}{1-r}, \\quad |r| < 1' } },
      { name: { en: 'n-th term test (divergence)', de: 'Trivialkriterium (Divergenz)' },
        body: { en: 'If the terms do not approach 0, the series diverges. WARNING: terms → 0 does NOT prove convergence (the harmonic series Σ1/n diverges).', de: 'Streben die Glieder nicht gegen 0, divergiert die Reihe. ACHTUNG: Glieder → 0 beweist KEINE Konvergenz (Σ1/n divergiert).' },
        formal: { tex: 'a_n \\not\\to 0 \\implies \\sum a_n \\text{ diverges}' } },
    ],
    tldr: { en: 'A sequence is an ordered list (a₁, a₂, ...); a series is their sum. The central question is <strong>convergence</strong>: does it approach a finite limit, or grow without bound?', de: 'Eine Folge ist eine geordnete Liste; eine Reihe ihre Summe. Die zentrale Frage ist <strong>Konvergenz</strong>: naehert sie sich einem endlichen Grenzwert?' },
    when: { en: 'Underlies limits, Taylor series, algorithm analysis (recurrence solutions), and any infinite-process reasoning.', de: 'Grundlage von Grenzwerten, Taylor-Reihen, Algorithmenanalyse und jedem unendlichen Prozess.' },
    how: [
      { en: 'A sequence converges if its terms get arbitrarily close to a single value L.', de: 'Eine Folge konvergiert, wenn ihre Glieder beliebig nah an einen Wert L kommen.' },
      { en: 'A geometric series Σ rⁿ converges exactly when |r| < 1, to 1/(1-r).', de: 'Eine geometrische Reihe Σ rⁿ konvergiert genau bei |r| < 1, zu 1/(1-r).' },
      { en: 'Tests (ratio, comparison, integral) decide convergence when it is not obvious.', de: 'Tests (Quotienten-, Vergleichs-, Integraltest) entscheiden Konvergenz.' },
    ],
    complexity: [
      { case: { en: 'Geometric series', de: 'Geometrische Reihe' }, time: 'Σrⁿ = 1/(1-r)', space: '-', cls: 'best', note: { en: 'Converges iff |r|<1. The harmonic series Σ1/n diverges even though its terms → 0 - a famous trap.', de: 'Konvergiert gdw |r|<1. Die harmonische Reihe Σ1/n divergiert, obwohl die Glieder → 0 - eine beruehmte Falle.' } },
    ],
    pitfalls: [
      { en: 'Terms going to 0 does NOT guarantee the series converges (Σ1/n diverges). Necessary, not sufficient.', de: 'Glieder gegen 0 garantieren KEINE Konvergenz (Σ1/n divergiert). Notwendig, nicht hinreichend.' },
    ],
  },
  'mean-value': {
    defs: [
      { name: { en: "Rolle's theorem", de: 'Satz von Rolle' },
        body: { en: 'If f is continuous on [a,b], differentiable on (a,b), and f(a) = f(b), then there is at least one interior point c where the derivative is zero.', de: 'Ist f auf [a,b] stetig, auf (a,b) differenzierbar und f(a) = f(b), dann gibt es mindestens einen inneren Punkt c mit Ableitung null.' },
        formal: { tex: 'f(a)=f(b) \\implies \\exists\\, c \\in (a,b):\\; f^{\\prime}(c) = 0' } },
      { name: { en: 'Mean Value Theorem (Lagrange)', de: 'Mittelwertsatz (Lagrange)' },
        body: { en: 'If f is continuous on [a,b] and differentiable on (a,b), then there is a point c where the tangent slope equals the average slope (the secant). Rolle is the special case f(a)=f(b).', de: 'Ist f auf [a,b] stetig und auf (a,b) differenzierbar, dann gibt es ein c, wo die Tangentensteigung der mittleren Steigung (Sekante) gleicht. Rolle ist der Sonderfall f(a)=f(b).' },
        formal: { tex: '\\exists\\, c \\in (a,b):\\; f^{\\prime}(c) = \\dfrac{f(b) - f(a)}{b - a}' } },
    ],
    when: { en: 'These are existence theorems - they guarantee a point exists without telling you to compute much. They underpin Taylor\'s theorem, error bounds, and proofs that a function is constant/increasing. On exams you cite them by name to justify a step.', de: 'Existenzsaetze - sie garantieren einen Punkt, ohne viel Rechnung. Sie stuetzen Taylors Satz, Fehlerschranken und Monotoniebeweise. In Pruefungen zitierst du sie namentlich.' },
    how: [
      { en: 'Check the hypotheses first: continuous on the CLOSED interval [a,b], differentiable on the OPEN interval (a,b).', de: 'Zuerst die Voraussetzungen pruefen: stetig auf dem ABGESCHLOSSENEN [a,b], differenzierbar auf dem OFFENEN (a,b).' },
      { en: 'MVT: the guaranteed c has tangent parallel to the secant through the endpoints.', de: 'MWS: das garantierte c hat eine Tangente parallel zur Sekante durch die Endpunkte.' },
      { en: 'Rolle: when the endpoints have equal height, that parallel tangent is horizontal, so f′(c)=0.', de: 'Rolle: bei gleich hohen Endpunkten ist diese Tangente waagerecht, also f′(c)=0.' },
    ],
    complexity: [
      { case: { en: 'Theorem', de: 'Satz' }, time: 'existence result', space: '-', cls: 'best', note: { en: 'Both REQUIRE differentiability on the open interval. f(x)=|x| on [-1,1] has no such c - it is not differentiable at 0, so the hypotheses fail.', de: 'Beide ERFORDERN Differenzierbarkeit auf dem offenen Intervall. f(x)=|x| auf [-1,1] hat kein solches c.' } },
    ],
    pitfalls: [
      { en: 'The hypotheses are not optional: drop differentiability at even one interior point and the conclusion can fail (e.g. |x|).', de: 'Die Voraussetzungen sind nicht optional: faellt die Differenzierbarkeit an nur einem inneren Punkt weg, kann der Schluss scheitern (z.B. |x|).' },
      { en: 'The theorems say c EXISTS, not that it is unique - there may be several such points.', de: 'Die Saetze sagen, c EXISTIERT, nicht dass es eindeutig ist - es kann mehrere geben.' },
    ],
  },

  // ---- DP / DIVIDE read pages ----
  'optimal-bst': {
    tldr: { en: 'Given keys with known search frequencies, build the BST that <strong>minimizes total expected search cost</strong> - frequent keys end up near the root. Solved with O(n³) dynamic programming.', de: 'Bei Schluesseln mit bekannten Suchhaeufigkeiten den BST bauen, der die <strong>erwarteten Suchkosten minimiert</strong>. Per O(n³) dynamischer Programmierung.' },
    when: { en: 'Building optimal lookup structures when access patterns are known and skewed (compilers, dictionaries with known word frequencies).', de: 'Optimale Nachschlagestrukturen bei bekannten, schiefen Zugriffsmustern.' },
    how: [
      { en: 'Try every key as the root of every sub-range.', de: 'Jeden Schluessel als Wurzel jedes Teilbereichs versuchen.' },
      { en: 'The cost of a tree = root frequency + cost of optimal left and right subtrees.', de: 'Baumkosten = Wurzelhaeufigkeit + Kosten der optimalen Teilbaeume.' },
      { en: 'Fill a DP table over increasing range sizes, keeping the cheapest root for each range.', de: 'Eine DP-Tabelle ueber wachsende Bereiche fuellen, je billigste Wurzel behalten.' },
    ],
    complexity: [
      { case: { en: 'Standard DP', de: 'Standard-DP' }, time: 'O(n³)', space: 'O(n²)', cls: 'avg', note: { en: 'Knuth\'s optimization brings it to O(n²). Distinct from a balanced BST, which ignores frequencies.', de: 'Knuths Optimierung bringt es auf O(n²). Anders als ein balancierter BST, der Haeufigkeiten ignoriert.' } },
    ],
    pitfalls: [
      { en: 'Optimal ≠ balanced: a skewed tree can be optimal if the frequent keys sit shallow.', de: 'Optimal ≠ balanciert: ein schiefer Baum kann optimal sein, wenn haeufige Schluessel flach liegen.' },
    ],
  },
  'knapsack': {
    tldr: { en: 'Choose items (each with a weight and value) to maximize value within a weight limit. <strong>0/1 knapsack</strong> (take or leave each) is solved by O(nW) DP; the greedy approach works only for the fractional version.', de: 'Gegenstaende (Gewicht + Wert) waehlen, um den Wert unter einer Gewichtsgrenze zu maximieren. <strong>0/1-Rucksack</strong> per O(nW) DP.' },
    when: { en: 'Budget allocation, cargo loading, resource selection - any "pick a subset under a capacity to maximize value" problem.', de: 'Budgetzuteilung, Frachtbeladung, Ressourcenauswahl.' },
    how: [
      { en: 'DP table: best value using the first i items within weight limit w.', de: 'DP-Tabelle: bester Wert mit den ersten i Gegenstaenden bei Limit w.' },
      { en: 'For each item, choose the better of: skip it, or take it (value + best for the remaining weight).', de: 'Pro Gegenstand das Bessere waehlen: ueberspringen oder nehmen (Wert + Bestes fuer Restgewicht).' },
      { en: 'Branch-and-bound prunes the search using an optimistic upper bound.', de: 'Branch-and-Bound beschneidet die Suche mit einer optimistischen Schranke.' },
    ],
    complexity: [
      { case: { en: '0/1 (DP)', de: '0/1 (DP)' }, time: 'O(n∗W)', space: 'O(n∗W)', cls: 'avg', note: { en: 'O(nW) is "pseudo-polynomial" - it depends on the numeric capacity W, not just n. 0/1 knapsack is NP-hard.', de: 'O(nW) ist „pseudopolynomiell" - haengt von der Kapazitaet W ab, nicht nur n. 0/1-Rucksack ist NP-schwer.' } },
    ],
    pitfalls: [
      { en: 'Greedy (best value/weight first) is OPTIMAL for fractional knapsack but WRONG for 0/1 - the key distinction.', de: 'Greedy ist OPTIMAL fuer den fraktionalen, aber FALSCH fuer den 0/1-Rucksack - die zentrale Unterscheidung.' },
    ],
  },
  'tsp': {
    tldr: { en: 'Find the shortest route visiting every city exactly once and returning home. <strong>NP-hard</strong>: brute force is O(n!), the Held-Karp DP is O(n²∗2ⁿ). For large n you use heuristics, not exact answers.', de: 'Die kuerzeste Rundreise ueber alle Staedte finden. <strong>NP-schwer</strong>: Brute Force O(n!), Held-Karp-DP O(n²∗2ⁿ).' },
    when: { en: 'Logistics, routing, circuit-board drilling, DNA assembly. The canonical hard optimization problem; in practice solved approximately.', de: 'Logistik, Routenplanung, Platinenbohren, DNA-Assemblierung. Das kanonische schwere Optimierungsproblem.' },
    how: [
      { en: 'Exact (Held-Karp): DP over subsets of visited cities + current city.', de: 'Exakt (Held-Karp): DP ueber Teilmengen besuchter Staedte + aktuelle Stadt.' },
      { en: 'Branch-and-bound prunes routes that already exceed the best found.', de: 'Branch-and-Bound beschneidet Routen, die das beste Ergebnis schon ueberschreiten.' },
      { en: 'Heuristics (nearest-neighbor, 2-opt, Christofides) give good-enough routes fast.', de: 'Heuristiken (Naechster-Nachbar, 2-opt, Christofides) liefern schnell gute Routen.' },
    ],
    complexity: [
      { case: { en: 'Brute force', de: 'Brute Force' }, time: 'O(n!)', space: 'O(n)', cls: 'worst' },
      { case: { en: 'Held-Karp DP', de: 'Held-Karp-DP' }, time: 'O(n²∗2ⁿ)', space: 'O(n∗2ⁿ)', cls: 'avg', note: { en: 'Both are exponential. No known polynomial exact algorithm exists (it is NP-hard).', de: 'Beide exponentiell. Kein bekannter polynomieller exakter Algorithmus (NP-schwer).' } },
    ],
    pitfalls: [
      { en: 'There is no known efficient exact solution - if you find one, you have solved P vs NP.', de: 'Es gibt keine bekannte effiziente exakte Loesung - faendest du eine, haettest du P vs NP geloest.' },
    ],
  },
  'strassen': {
    tldr: { en: 'Multiplies two n×n matrices in <strong>O(n^2.81)</strong> instead of the naive O(n³), by cleverly using 7 recursive multiplications instead of 8. A landmark divide-and-conquer result.', de: 'Multipliziert zwei n×n-Matrizen in <strong>O(n^2.81)</strong> statt naiv O(n³), durch 7 statt 8 rekursive Multiplikationen.' },
    when: { en: 'Large matrix multiplication where the constant-factor overhead pays off. More important as a proof that the naive O(n³) is not optimal.', de: 'Grosse Matrixmultiplikation. Wichtiger als Beweis, dass naiv O(n³) nicht optimal ist.' },
    how: [
      { en: 'Split each matrix into four n/2 × n/2 blocks.', de: 'Jede Matrix in vier n/2 × n/2 Bloecke teilen.' },
      { en: 'The naive method needs 8 block multiplications; Strassen rewrites them as 7 (plus more additions).', de: 'Naiv braucht 8 Blockmultiplikationen; Strassen schreibt sie als 7 (plus mehr Additionen).' },
      { en: 'Recursing with 7 instead of 8 changes the exponent from 3 to log₂7 ≈ 2.81.', de: 'Rekursion mit 7 statt 8 aendert den Exponenten von 3 auf log₂7 ≈ 2.81.' },
    ],
    complexity: [
      { case: { en: 'Strassen', de: 'Strassen' }, time: 'O(n^2.81)', space: 'O(n²)', cls: 'avg', note: { en: 'Naive is O(n³). The win comes from 7 vs 8 recursive multiplications (Master Theorem).', de: 'Naiv ist O(n³). Der Gewinn kommt von 7 statt 8 Multiplikationen (Master-Theorem).' } },
    ],
    pitfalls: [
      { en: 'The extra additions and recursion overhead mean it only beats the naive method for fairly large n.', de: 'Der Zusatzaufwand bedeutet, dass es erst fuer recht grosse n schneller ist.' },
    ],
  },
  'master-theorem': {
    tldr: { en: 'A formula that instantly gives the Big-O of most divide-and-conquer recurrences $T(n)=a\\cdot T(n/b)+f(n)$, by comparing $f(n)$ against $n^{\\log_b a}$. Skips solving the recurrence by hand.', de: 'Eine Formel, die sofort die Big-O der meisten Teile-und-herrsche-Rekurrenzen $T(n)=a\\cdot T(n/b)+f(n)$ liefert.' },
    when: { en: 'Analyzing any recursive divide-and-conquer algorithm: merge sort, binary search, Strassen, Karatsuba. The fastest way to a complexity answer on an exam.', de: 'Analyse jedes rekursiven Teile-und-herrsche-Algorithmus: Merge Sort, binaere Suche, Strassen, Karatsuba.' },
    how: [
      { en: 'Write the recurrence as T(n) = a∗T(n/b) + f(n): a subproblems of size n/b, plus f(n) work to combine.', de: 'Rekurrenz als T(n) = a∗T(n/b) + f(n) schreiben.' },
      { en: 'Compare f(n) with n^(log_b a).', de: 'f(n) mit n^(log_b a) vergleichen.' },
      { en: 'Case 1: f smaller → T = Θ(n^(log_b a)). Case 2: equal → Θ(n^(log_b a)∗log n). Case 3: f larger → Θ(f(n)).', de: 'Fall 1: f kleiner → Θ(n^(log_b a)). Fall 2: gleich → Θ(n^(log_b a)∗log n). Fall 3: f groesser → Θ(f(n)).' },
    ],
    complexity: [
      { case: { en: 'Merge sort: a=2,b=2,f=n', de: 'Merge Sort: a=2,b=2,f=n' }, time: 'Θ(n log n)', space: '-', cls: 'best' },
      { case: { en: 'Binary search: a=1,b=2', de: 'Binaere Suche: a=1,b=2' }, time: 'Θ(log n)', space: '-', cls: 'best', note: { en: 'Compare f(n) to n^(log_b a) - that comparison is the whole theorem.', de: 'f(n) mit n^(log_b a) vergleichen - dieser Vergleich ist das ganze Theorem.' } },
    ],
    pitfalls: [
      { en: 'It does not cover every recurrence (e.g. uneven splits like T(n)=T(n/3)+T(2n/3)). Know its limits.', de: 'Es deckt nicht jede Rekurrenz ab (z.B. ungleiche Teilungen). Kenne die Grenzen.' },
    ],
  },
}

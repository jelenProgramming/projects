// Content for backtracking, strings, dp, divide, discrete, calculus, compression, crypto.
// Every algorithm carries a best/avg/worst complexity table.
export const algosExtraContent = {
  // ---- BACKTRACKING ----
  'n-queens': {
    tldr: { en: 'Place N queens on an N×N board so none attack another, by placing column by column and <strong>backtracking</strong> the moment a placement conflicts. Exponential, but pruning makes it practical for moderate N.', de: 'Setze N Damen auf ein N×N-Brett, sodass keine eine andere bedroht, Spalte fuer Spalte, mit <strong>Backtracking</strong>, sobald eine Setzung kollidiert. Exponentiell, aber durch Pruning fuer maessige N praktikabel.' },
    when: { en: 'The textbook example of backtracking and constraint satisfaction. The pattern (try, recurse, undo) generalizes to Sudoku, graph coloring, and any "fill slots under constraints" puzzle.', de: 'Das Lehrbuchbeispiel fuer Backtracking und Constraint-Erfuellung. Das Muster (versuchen, rekursieren, zuruecknehmen) verallgemeinert sich auf Sudoku, Graphfaerbung und jedes Constraint-Puzzle.' },
    how: [
      { en: 'Place a queen in the first safe square of the current row.', de: 'Setze eine Dame auf das erste sichere Feld der aktuellen Zeile.' },
      { en: 'Recurse to the next row.', de: 'Rekursiere zur naechsten Zeile.' },
      { en: 'If no square in a row is safe, <strong>backtrack</strong>: undo the previous row\'s queen and try its next option.', de: 'Ist kein Feld sicher, <strong>Backtracking</strong>: die Dame der vorigen Zeile zuruecknehmen und ihre naechste Option versuchen.' },
      { en: 'Success when all N rows are filled.', de: 'Erfolg, wenn alle N Zeilen gefuellt sind.' },
    ],
    paper: [
      { en: 'Draw the board. Place a queen, then cross out its row, column, and both diagonals - those squares are now forbidden.', de: 'Brett zeichnen. Dame setzen, dann ihre Zeile, Spalte und beide Diagonalen durchstreichen - diese Felder sind verboten.' },
      { en: 'Move to the next row; if every square is crossed out, erase the last queen and move it forward. That erasing is the backtrack.', de: 'Zur naechsten Zeile; ist jedes Feld durchgestrichen, die letzte Dame loeschen und weiterruecken. Dieses Loeschen ist das Backtracking.' },
    ],
    complexity: [
      { case: { en: 'Worst case', de: 'Schlechtester Fall' }, time: 'O(N!)', space: 'O(N)', cls: 'worst', note: { en: 'Pruning (checking safety before recursing) cuts the real search far below N! but the worst case is still factorial.', de: 'Pruning (Sicherheitspruefung vor der Rekursion) drueckt die reale Suche weit unter N!, der schlechteste Fall bleibt aber faktoriell.' } },
    ],
    pitfalls: [
      { en: 'The diagonal check is where bugs hide: two squares share a diagonal when |row1-row2| = |col1-col2|.', de: 'Die Diagonalpruefung versteckt Fehler: zwei Felder teilen eine Diagonale, wenn |Zeile1-Zeile2| = |Spalte1-Spalte2|.' },
    ],
  },
  'graph-coloring': {
    tldr: { en: 'Assign one of k colors to every node so no two connected nodes share a color, via backtracking. Deciding if k colors suffice (the chromatic number) is <strong>NP-complete</strong> for k≥3.', de: 'Weise jedem Knoten eine von k Farben zu, sodass keine zwei verbundenen Knoten dieselbe Farbe teilen, per Backtracking. Zu entscheiden, ob k Farben genuegen (chromatische Zahl), ist fuer k≥3 <strong>NP-vollstaendig</strong>.' },
    when: { en: 'Register allocation in compilers, scheduling (exams that share students can\'t be at the same time), map coloring, frequency assignment. Any "things that conflict must differ" problem.', de: 'Registerzuteilung in Compilern, Scheduling, Kartenfaerbung, Frequenzzuteilung. Jedes „Konfliktpartner muessen sich unterscheiden"-Problem.' },
    how: [
      { en: 'Pick an uncolored node.', de: 'Einen ungefaerbten Knoten waehlen.' },
      { en: 'Try each color 1..k that no neighbor already uses.', de: 'Jede Farbe 1..k versuchen, die kein Nachbar nutzt.' },
      { en: 'Recurse; if no color works for a later node, backtrack and recolor.', de: 'Rekursieren; klappt fuer einen spaeteren Knoten keine Farbe, zurueck und umfaerben.' },
    ],
    complexity: [
      { case: { en: 'Worst case', de: 'Schlechtester Fall' }, time: 'O(k^V)', space: 'O(V)', cls: 'worst', note: { en: 'V nodes, each tried with up to k colors. NP-complete in general; heuristics help in practice.', de: 'V Knoten, je bis zu k Farben. Allgemein NP-vollstaendig; Heuristiken helfen praktisch.' } },
    ],
    pitfalls: [
      { en: 'Two colors suffice if and only if the graph is bipartite (no odd cycle) - a common exam fact.', de: 'Zwei Farben genuegen genau dann, wenn der Graph bipartit ist (kein ungerader Zyklus) - haeufige Pruefungstatsache.' },
    ],
  },
  'sudoku': {
    tldr: { en: 'Fill a 9×9 grid so each row, column and 3×3 box holds 1-9, by trying digits in empty cells and <strong>backtracking</strong> on dead ends. Same engine as N-Queens.', de: 'Fuelle ein 9×9-Gitter, sodass jede Zeile, Spalte und 3×3-Box 1-9 enthaelt, durch Ziffern-Versuche in leeren Zellen und <strong>Backtracking</strong> bei Sackgassen.' },
    when: { en: 'A friendly demonstration of constraint-satisfaction backtracking. The real-world cousins are scheduling and resource-allocation solvers.', de: 'Eine zugaengliche Demo von Constraint-Backtracking. Die Verwandten in der Praxis sind Scheduling- und Ressourcen-Solver.' },
    how: [
      { en: 'Find the next empty cell.', de: 'Die naechste leere Zelle finden.' },
      { en: 'Try digits 1-9; keep one only if it breaks no row/column/box rule.', de: 'Ziffern 1-9 versuchen; eine nur behalten, wenn sie keine Zeilen-/Spalten-/Box-Regel verletzt.' },
      { en: 'Recurse; if the grid gets stuck, erase and try the next digit (backtrack).', de: 'Rekursieren; steckt das Gitter fest, loeschen und naechste Ziffer (Backtracking).' },
    ],
    complexity: [
      { case: { en: 'Worst case', de: 'Schlechtester Fall' }, time: 'O(9^m)', space: 'O(m)', cls: 'worst', note: { en: 'm = empty cells. Constraint checks prune most of the 9^m space, so real puzzles solve fast.', de: 'm = leere Zellen. Constraint-Pruefungen beschneiden den Grossteil von 9^m, echte Raetsel loesen schnell.' } },
    ],
    pitfalls: [
      { en: 'Choosing the most-constrained empty cell first (fewest candidates) dramatically speeds the search.', de: 'Zuerst die am staerksten eingeschraenkte Zelle (wenigste Kandidaten) zu waehlen, beschleunigt die Suche stark.' },
    ],
  },
  // ---- STRINGS ----
  'naive-match': {
    tldr: { en: 'Check the pattern against every position in the text, left to right, sliding by one on a mismatch. <strong>O(nm)</strong> worst case - simple but slow. The baseline every smarter algorithm beats.', de: 'Pruefe das Muster an jeder Textposition, links nach rechts, bei Fehler um eins schieben. <strong>O(nm)</strong> im schlechtesten Fall - einfach, aber langsam.' },
    when: { en: 'Short texts or one-off searches where the code simplicity outweighs speed. Mostly a teaching baseline against KMP, Boyer-Moore, etc.', de: 'Kurze Texte oder Einmalsuchen, wo Einfachheit ueber Tempo siegt. Meist eine Lehr-Basislinie gegen KMP, Boyer-Moore usw.' },
    how: [
      { en: 'Align the pattern at text position i.', de: 'Muster an Textposition i ausrichten.' },
      { en: 'Compare characters left to right.', de: 'Zeichen links nach rechts vergleichen.' },
      { en: 'On a mismatch, slide the pattern one position right and restart - re-checking characters you already saw.', de: 'Bei Fehler das Muster um eins nach rechts schieben und neu starten - bereits gesehene Zeichen erneut pruefen.' },
    ],
    complexity: [
      { case: { en: 'Best', de: 'Bester' }, time: 'O(n)', space: 'O(1)', cls: 'best' },
      { case: { en: 'Worst', de: 'Schlechtester' }, time: 'O(n∗m)', space: 'O(1)', cls: 'worst', note: { en: 'Worst case like text "AAAA...A", pattern "AAAB": almost a full pattern scan at every position.', de: 'Schlechtester Fall wie Text "AAAA...A", Muster "AAAB": fast ein voller Musterscan an jeder Position.' } },
    ],
    pitfalls: [
      { en: 'The waste is re-comparing characters after a mismatch. KMP removes exactly that waste.', de: 'Die Verschwendung ist das erneute Vergleichen nach einem Fehler. KMP beseitigt genau das.' },
    ],
  },
  'kmp': {
    tldr: { en: 'Searches in <strong>O(n+m)</strong> by precomputing a failure table so that, on a mismatch, it shifts the pattern smartly and <strong>never re-reads a text character</strong>. The classic linear-time string search.', de: 'Sucht in <strong>O(n+m)</strong>, indem es eine Fehlertabelle vorberechnet, sodass es bei einem Fehler das Muster clever verschiebt und <strong>nie ein Textzeichen erneut liest</strong>.' },
    when: { en: 'Guaranteed linear search regardless of input, streaming text (you never need to back up), and as a building block in other string algorithms.', de: 'Garantiert lineare Suche unabhaengig von der Eingabe, Streaming-Text (kein Zuruecksetzen) und als Baustein anderer String-Algorithmen.' },
    how: [
      { en: 'Precompute failure[j] = length of the longest proper prefix of pattern[0..j] that is also a suffix.', de: 'failure[j] vorberechnen = Laenge des laengsten echten Praefixes von pattern[0..j], das auch Suffix ist.' },
      { en: 'Scan the text once. On a match, advance both.', de: 'Den Text einmal scannen. Bei Treffer beide weiter.' },
      { en: 'On a mismatch at pattern position j, jump to failure[j-1] instead of restarting - the text pointer never moves backward.', de: 'Bei Fehler an Musterposition j zu failure[j-1] springen statt neu zu starten - der Textzeiger geht nie zurueck.' },
    ],
    complexity: [
      { case: { en: 'Build table', de: 'Tabelle bauen' }, time: 'O(m)', space: 'O(m)', cls: 'best' },
      { case: { en: 'Search', de: 'Suche' }, time: 'O(n)', space: 'O(m)', cls: 'best', note: { en: 'Total O(n+m) in all cases - the worst case is linear too, unlike naive.', de: 'Insgesamt O(n+m) in allen Faellen - auch der schlechteste ist linear, anders als naiv.' } },
    ],
    pitfalls: [
      { en: 'The failure function is over the <strong>pattern only</strong>, never the text. Building it is the part people get wrong.', de: 'Die Fehlerfunktion bezieht sich nur auf das <strong>Muster</strong>, nie auf den Text. Ihr Aufbau ist der Fehlerpunkt.' },
    ],
  },
  'boyer-moore': {
    tldr: { en: 'Compares the pattern <strong>right to left</strong> and skips ahead using a bad-character table, often examining far fewer than n characters - <strong>sub-linear in practice</strong>. The fastest general string search for large alphabets.', de: 'Vergleicht das Muster <strong>rechts nach links</strong> und springt per Bad-Character-Tabelle, oft weit weniger als n Zeichen - <strong>praktisch sublinear</strong>.' },
    when: { en: 'Searching long texts over large alphabets (natural language, byte data). It is what grep-like tools use. The longer the pattern, the bigger the jumps.', de: 'Lange Texte ueber grossen Alphabeten (natuerliche Sprache, Bytes). grep-aehnliche Werkzeuge nutzen es. Je laenger das Muster, desto groesser die Spruenge.' },
    how: [
      { en: 'Align the pattern and compare from its rightmost character leftward.', de: 'Muster ausrichten und vom rechtesten Zeichen nach links vergleichen.' },
      { en: 'On a mismatch, use the bad-character rule: shift so the mismatched text character lines up with its last occurrence in the pattern.', de: 'Bei Fehler die Bad-Character-Regel: so verschieben, dass das fehlerhafte Zeichen mit seinem letzten Vorkommen im Muster fluchtet.' },
      { en: 'If the character is not in the pattern, skip the whole pattern length.', de: 'Ist das Zeichen nicht im Muster, die ganze Musterlaenge ueberspringen.' },
    ],
    complexity: [
      { case: { en: 'Best', de: 'Bester' }, time: 'O(n/m)', space: 'O(k)', cls: 'best' },
      { case: { en: 'Average', de: 'Durchschnitt' }, time: 'O(n)', space: 'O(k)', cls: 'avg' },
      { case: { en: 'Worst', de: 'Schlechtester' }, time: 'O(n∗m)', space: 'O(k)', cls: 'worst', note: { en: 'k = alphabet size. Best case skips m at a time. Full Boyer-Moore adds a good-suffix rule to bound the worst case to O(n).', de: 'k = Alphabetgroesse. Bester Fall springt je m. Voll-Boyer-Moore ergaenzt eine Good-Suffix-Regel und begrenzt den schlechtesten Fall auf O(n).' } },
    ],
    pitfalls: [
      { en: 'Right-to-left comparison is the key idea and what makes the big jumps possible.', de: 'Der Rechts-nach-links-Vergleich ist die Kernidee und ermoeglicht die grossen Spruenge.' },
    ],
  },
  'rabin-karp': {
    tldr: { en: 'Hashes the pattern and each text window, comparing <strong>hashes</strong> first and only verifying characters on a hash hit. A <strong>rolling hash</strong> updates each window in O(1). Great for multiple-pattern search.', de: 'Hasht das Muster und jedes Textfenster, vergleicht zuerst <strong>Hashes</strong> und prueft Zeichen nur bei Treffer. Ein <strong>rollender Hash</strong> aktualisiert jedes Fenster in O(1).' },
    when: { en: 'Searching for many patterns at once (hash them all), plagiarism/duplicate detection, and 2D pattern search. The rolling hash is the reusable idea.', de: 'Suche nach vielen Mustern gleichzeitig, Plagiats-/Duplikaterkennung und 2D-Mustersuche. Der rollende Hash ist die wiederverwendbare Idee.' },
    how: [
      { en: 'Compute a hash of the pattern and of the first text window.', de: 'Hash des Musters und des ersten Fensters berechnen.' },
      { en: 'Slide the window; update its hash in O(1) by removing the old char and adding the new (rolling hash).', de: 'Fenster schieben; Hash in O(1) aktualisieren, altes Zeichen raus, neues rein (rollender Hash).' },
      { en: 'When hashes match, verify the actual characters (to rule out a collision).', de: 'Bei Hash-Treffer die echten Zeichen pruefen (Kollision ausschliessen).' },
    ],
    complexity: [
      { case: { en: 'Average', de: 'Durchschnitt' }, time: 'O(n+m)', space: 'O(1)', cls: 'best' },
      { case: { en: 'Worst', de: 'Schlechtester' }, time: 'O(n∗m)', space: 'O(1)', cls: 'worst', note: { en: 'Worst case is many hash collisions (bad modulus). A good prime modulus keeps it near linear.', de: 'Schlechtester Fall sind viele Hash-Kollisionen (schlechter Modul). Ein guter Primmodul haelt es nahe linear.' } },
    ],
    pitfalls: [
      { en: 'A hash match does not guarantee a real match - you must verify characters, or collisions give false positives.', de: 'Ein Hash-Treffer garantiert keinen echten Treffer - Zeichen pruefen, sonst falsche Positive durch Kollisionen.' },
    ],
  },
  'horspool': {
    tldr: { en: 'A simplified Boyer-Moore that uses only the bad-character rule, keyed on <strong>the character at the end of the window</strong>. Easy to implement, fast in practice, O(nm) worst case.', de: 'Ein vereinfachtes Boyer-Moore, nur mit Bad-Character-Regel, basierend auf <strong>dem Zeichen am Fensterende</strong>. Einfach, praktisch schnell, O(nm) im schlechtesten Fall.' },
    when: { en: 'When you want most of Boyer-Moore\'s speed with much simpler code. A common practical choice.', de: 'Wenn man fast die Geschwindigkeit von Boyer-Moore mit viel einfacherem Code will. Eine haeufige praktische Wahl.' },
    how: [
      { en: 'Compare the window right to left.', de: 'Fenster rechts nach links vergleichen.' },
      { en: 'On any mismatch, look at the text character aligned with the LAST position of the window.', de: 'Bei Fehler das Textzeichen an der LETZTEN Fensterposition ansehen.' },
      { en: 'Shift the pattern so that character aligns with its rightmost occurrence in the pattern (excluding the last).', de: 'Muster so verschieben, dass dieses Zeichen mit seinem rechtesten Vorkommen im Muster fluchtet (ohne das letzte).' },
    ],
    complexity: [
      { case: { en: 'Average', de: 'Durchschnitt' }, time: 'O(n)', space: 'O(k)', cls: 'avg' },
      { case: { en: 'Worst', de: 'Schlechtester' }, time: 'O(n∗m)', space: 'O(k)', cls: 'worst', note: { en: 'Shift is always decided by the window-end character. k = alphabet size.', de: 'Der Sprung entscheidet sich stets am Fensterend-Zeichen. k = Alphabetgroesse.' } },
    ],
    pitfalls: [
      { en: 'It looks at the window-end char; Sunday looks one past the window. Confusing the two is the classic error.', de: 'Es schaut auf das Fensterend-Zeichen; Sunday eins dahinter. Verwechslung ist der klassische Fehler.' },
    ],
  },
  'sunday': {
    tldr: { en: 'A Boyer-Moore variant that, on a mismatch, inspects <strong>the character one position past the window</strong> to decide the shift - often jumping further than Horspool. Simple and fast.', de: 'Eine Boyer-Moore-Variante, die bei Fehler <strong>das Zeichen eine Position hinter dem Fenster</strong> prueft - springt oft weiter als Horspool. Einfach und schnell.' },
    when: { en: 'A strong simple choice for general searching, especially when patterns are short. Often beats Horspool on average.', de: 'Eine starke, einfache Wahl fuer allgemeine Suche, besonders bei kurzen Mustern. Schlaegt Horspool oft im Schnitt.' },
    how: [
      { en: 'Compare the window (either direction).', de: 'Fenster vergleichen (beliebige Richtung).' },
      { en: 'On a mismatch, look at text[i+m] - the character just AFTER the current window.', de: 'Bei Fehler text[i+m] ansehen - das Zeichen direkt NACH dem Fenster.' },
      { en: 'Shift so that character aligns with its rightmost occurrence in the pattern; if absent, shift past it entirely.', de: 'So verschieben, dass dieses Zeichen mit seinem rechtesten Vorkommen fluchtet; fehlt es, komplett darueber hinweg.' },
    ],
    complexity: [
      { case: { en: 'Average', de: 'Durchschnitt' }, time: 'O(n)', space: 'O(k)', cls: 'avg' },
      { case: { en: 'Worst', de: 'Schlechtester' }, time: 'O(n∗m)', space: 'O(k)', cls: 'worst', note: { en: 'The shift character is one past the window (index i+m) - this is the defining detail.', de: 'Das Sprungzeichen liegt eins hinter dem Fenster (Index i+m) - das ist das definierende Detail.' } },
    ],
    pitfalls: [
      { en: 'Look at the char AFTER the window, not the last char IN it - that is what separates Sunday from Horspool.', de: 'Das Zeichen NACH dem Fenster ansehen, nicht das letzte DARIN - das trennt Sunday von Horspool.' },
    ],
  },
  // ---- DP & DIVIDE ----
  'binary-search': {
    tldr: { en: 'Finds a value in a <strong>sorted</strong> array by repeatedly halving the search range. <strong>O(log n)</strong> - 30 steps suffice for a billion items. Useless on unsorted data.', de: 'Findet einen Wert in einem <strong>sortierten</strong> Array, indem der Bereich wiederholt halbiert wird. <strong>O(log n)</strong> - 30 Schritte genuegen fuer eine Milliarde Elemente.' },
    when: { en: 'Any lookup in sorted data; also the pattern behind "binary search on the answer" optimization problems and finding insertion points. Requires random access (arrays, not linked lists).', de: 'Jede Suche in sortierten Daten; auch das Muster hinter „Binaere Suche auf der Antwort" und dem Finden von Einfuegepunkten. Braucht wahlfreien Zugriff.' },
    how: [
      { en: 'Look at the middle element of the current range.', de: 'Das mittlere Element des aktuellen Bereichs ansehen.' },
      { en: 'If it equals the target, done. If smaller, discard the left half; if larger, discard the right half.', de: 'Gleich dem Ziel? Fertig. Kleiner? Linke Haelfte verwerfen; groesser? Rechte verwerfen.' },
      { en: 'Repeat on the remaining half until found or the range is empty.', de: 'Auf der verbleibenden Haelfte wiederholen, bis gefunden oder der Bereich leer ist.' },
    ],
    complexity: [
      { case: { en: 'Best', de: 'Bester' }, time: 'O(1)', space: 'O(1)', cls: 'best' },
      { case: { en: 'Average / Worst', de: 'Durchschnitt / Schlecht.' }, time: 'O(log n)', space: 'O(1)', cls: 'avg', note: { en: 'The array MUST be sorted first; sorting is O(n log n), so binary search pays off when you search many times.', de: 'Das Array MUSS zuerst sortiert sein; Sortieren ist O(n log n), daher lohnt binaere Suche bei vielen Suchen.' } },
    ],
    pitfalls: [
      { en: 'mid = lo + (hi-lo)/2, not (lo+hi)/2, to avoid integer overflow - a famous real-world bug.', de: 'mid = lo + (hi-lo)/2, nicht (lo+hi)/2, um Ueberlauf zu vermeiden - ein beruehmter realer Fehler.' },
      { en: 'Off-by-one in the loop bounds (lo ≤ hi vs lo < hi) is the #1 implementation mistake.', de: 'Off-by-one in den Schleifengrenzen (lo ≤ hi vs lo < hi) ist der haeufigste Fehler.' },
    ],
  },
  'edit-distance': {
    tldr: { en: 'The minimum number of single-character insertions, deletions, or substitutions to turn one string into another, via a DP table. <strong>O(nm)</strong>. The "fill the grid" exam classic.', de: 'Die minimale Anzahl von Einzelzeichen-Einfuegungen, -Loeschungen oder -Ersetzungen, um eine Zeichenkette in eine andere zu verwandeln, per DP-Tabelle. <strong>O(nm)</strong>.' },
    when: { en: 'Spell-checkers, DNA sequence alignment, diff tools, fuzzy search, autocorrect. Whenever you need "how similar are these two strings".', de: 'Rechtschreibpruefung, DNA-Alignment, Diff-Werkzeuge, unscharfe Suche, Autokorrektur. Immer wenn „wie aehnlich sind diese Zeichenketten".' },
    how: [
      { en: 'Build a table D where D[i][j] = edit distance between the first i chars of A and first j of B.', de: 'Tabelle D bauen, D[i][j] = Editierdistanz der ersten i Zeichen von A und ersten j von B.' },
      { en: 'Row 0 and column 0 are 0,1,2,... (cost of pure insertions/deletions).', de: 'Zeile 0 und Spalte 0 sind 0,1,2,... (Kosten reiner Einfuegungen/Loeschungen).' },
      { en: 'Each cell = min(delete D[i-1][j]+1, insert D[i][j-1]+1, substitute D[i-1][j-1]+cost). cost is 0 if the chars match.', de: 'Jede Zelle = min(Loeschen D[i-1][j]+1, Einfuegen D[i][j-1]+1, Ersetzen D[i-1][j-1]+Kosten). Kosten 0 bei Zeichengleichheit.' },
    ],
    paper: [
      { en: 'Draw the grid with A down the side and B across the top. Fill row 0 and column 0 with 0,1,2,...', de: 'Gitter mit A an der Seite, B oben zeichnen. Zeile 0 und Spalte 0 mit 0,1,2,... fuellen.' },
      { en: 'Fill left-to-right, top-to-bottom. For each cell look at three neighbors (up, left, up-left) and take the minimum per the rule.', de: 'Links-nach-rechts, oben-nach-unten fuellen. Pro Zelle drei Nachbarn (oben, links, oben-links) ansehen und das Minimum nehmen.' },
      { en: 'The answer is the bottom-right cell.', de: 'Die Antwort ist die Zelle unten rechts.' },
    ],
    complexity: [
      { case: { en: 'All cases', de: 'Alle Faelle' }, time: 'O(n∗m)', space: 'O(n∗m)', cls: 'avg', note: { en: 'Space can be reduced to O(min(n,m)) by keeping only two rows - a common optimization question.', de: 'Speicher auf O(min(n,m)) reduzierbar, indem nur zwei Zeilen gehalten werden - haeufige Optimierungsfrage.' } },
    ],
    pitfalls: [
      { en: 'Substitution cost is 0 when characters are equal (copy the diagonal), 1 otherwise. Forgetting that breaks everything.', de: 'Ersetzungskosten sind 0 bei Zeichengleichheit (Diagonale kopieren), sonst 1. Das zu vergessen bricht alles.' },
    ],
  },
}

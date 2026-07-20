// Gap-fill topics for Analysis, Discrete Math and Databases.
// Original explanations matched to the curriculum, not copied from any slides.
export const extraTopicsContent = {
  'elementary-functions': {
    tldr: {
      en: 'The building-block functions of analysis: <strong>polynomials and rational</strong> functions, the <strong>exponential</strong> and its inverse the <strong>logarithm</strong>, the <strong>trigonometric</strong> functions and their inverses, and the <strong>hyperbolic</strong> functions. Every function you meet is built from these by composition and arithmetic.',
      de: 'Die Bausteinfunktionen der Analysis: <strong>Polynome und rationale</strong> Funktionen, die <strong>Exponentialfunktion</strong> und ihre Umkehrung, der <strong>Logarithmus</strong>, die <strong>trigonometrischen</strong> Funktionen samt Umkehrungen und die <strong>hyperbolischen</strong> Funktionen. Jede Funktion entsteht aus diesen durch Verkettung und Arithmetik.',
    },
    intro: [
      { en: 'The <strong>exponential</strong> $a^x$ and the <strong>logarithm</strong> $\\log_a x$ are inverses: $a^{\\log_a x} = x$. The natural base $e$ makes $\\frac{d}{dx}e^x = e^x$, which is why it appears everywhere in calculus.',
        de: 'Die <strong>Exponentialfunktion</strong> $a^x$ und der <strong>Logarithmus</strong> $\\log_a x$ sind Umkehrfunktionen: $a^{\\log_a x} = x$. Die natürliche Basis $e$ erfüllt $\\frac{d}{dx}e^x = e^x$, weshalb sie in der Analysis allgegenwärtig ist.' },
      { en: 'The <strong>trigonometric</strong> functions are periodic ($\\sin$ and $\\cos$ with period $2\\pi$); their inverses ($\\arcsin$, $\\arccos$, $\\arctan$) are only defined on restricted ranges. The <strong>hyperbolic</strong> functions $\\sinh$ and $\\cosh$ are their exponential cousins: $\\cosh x = \\frac{e^x + e^{-x}}{2}$.',
        de: 'Die <strong>trigonometrischen</strong> Funktionen sind periodisch ($\\sin$ und $\\cos$ mit Periode $2\\pi$); ihre Umkehrungen ($\\arcsin$, $\\arccos$, $\\arctan$) sind nur auf eingeschränkten Bereichen definiert. Die <strong>hyperbolischen</strong> Funktionen $\\sinh$ und $\\cosh$ sind ihre exponentiellen Verwandten: $\\cosh x = \\frac{e^x + e^{-x}}{2}$.' },
    ],
    how: [
      { en: '<strong>Change of base:</strong> $\\log_a x = \\frac{\\ln x}{\\ln a}$, so one logarithm gives you all of them.',
        de: '<strong>Basiswechsel:</strong> $\\log_a x = \\frac{\\ln x}{\\ln a}$, ein Logarithmus liefert also alle.' },
      { en: '<strong>Key identity:</strong> $\\sin^2 x + \\cos^2 x = 1$, the Pythagorean identity that underlies most trig manipulation.',
        de: '<strong>Zentrale Identität:</strong> $\\sin^2 x + \\cos^2 x = 1$, die pythagoreische Identität hinter den meisten trigonometrischen Umformungen.' },
    ],
    pitfalls: [
      { en: 'The logarithm is only defined for $x > 0$, and $\\arcsin$/$\\arccos$ only for $x \\in [-1, 1]$. Check the domain before you evaluate.',
        de: 'Der Logarithmus ist nur für $x > 0$ definiert und $\\arcsin$/$\\arccos$ nur für $x \\in [-1, 1]$. Prüfe den Definitionsbereich vor dem Einsetzen.' },
    ],
  },

  'continuity': {
    tldr: {
      en: 'A function is <strong>continuous</strong> at a point when its limit there equals its value: no jumps, holes or blow-ups. Continuity on a closed interval unlocks the great existence theorems, the <strong>Intermediate Value</strong> and <strong>Extreme Value</strong> theorems.',
      de: 'Eine Funktion ist an einer Stelle <strong>stetig</strong>, wenn ihr Grenzwert dort gleich ihrem Wert ist: keine Sprünge, Löcher oder Polstellen. Stetigkeit auf einem abgeschlossenen Intervall schaltet die grossen Existenzsätze frei, den <strong>Zwischenwertsatz</strong> und den <strong>Extremwertsatz</strong>.',
    },
    intro: [
      { en: 'Formally, $f$ is continuous at $c$ when $\\lim_{x \\to c} f(x) = f(c)$. Three things must hold: the value $f(c)$ exists, the limit exists, and they are equal.',
        de: 'Formal ist $f$ stetig in $c$, wenn $\\lim_{x \\to c} f(x) = f(c)$. Drei Dinge müssen gelten: der Wert $f(c)$ existiert, der Grenzwert existiert und beide sind gleich.' },
      { en: 'Discontinuities come in flavours: <strong>removable</strong> (a single hole you could patch), <strong>jump</strong> (left and right limits differ), and <strong>infinite</strong> (a vertical asymptote).',
        de: 'Unstetigkeiten gibt es in Varianten: <strong>hebbar</strong> (ein einzelnes Loch, das man schliessen könnte), <strong>Sprung</strong> (links- und rechtsseitiger Grenzwert verschieden) und <strong>unendlich</strong> (senkrechte Asymptote).' },
    ],
    how: [
      { en: '<strong>Intermediate Value Theorem:</strong> a function continuous on $[a,b]$ takes every value between $f(a)$ and $f(b)$. This is why a sign change guarantees a root.',
        de: '<strong>Zwischenwertsatz:</strong> eine auf $[a,b]$ stetige Funktion nimmt jeden Wert zwischen $f(a)$ und $f(b)$ an. Deshalb garantiert ein Vorzeichenwechsel eine Nullstelle.' },
      { en: '<strong>Extreme Value Theorem:</strong> a function continuous on a closed, bounded interval attains a maximum and a minimum.',
        de: '<strong>Extremwertsatz:</strong> eine auf einem abgeschlossenen, beschränkten Intervall stetige Funktion nimmt ein Maximum und ein Minimum an.' },
    ],
    pitfalls: [
      { en: 'Both theorems need a <strong>closed</strong> interval and genuine continuity; on an open interval a function can approach but never reach its bound.',
        de: 'Beide Sätze brauchen ein <strong>abgeschlossenes</strong> Intervall und echte Stetigkeit; auf einem offenen Intervall kann eine Funktion ihre Schranke annähern, aber nie erreichen.' },
    ],
  },

  'integration-techniques': {
    tldr: {
      en: 'Beyond the basic antiderivatives lie three workhorses: <strong>substitution</strong> (reverse the chain rule), <strong>integration by parts</strong> (reverse the product rule), and <strong>partial fractions</strong> (split a rational function into simple pieces).',
      de: 'Jenseits der Grundstammfunktionen gibt es drei Arbeitspferde: <strong>Substitution</strong> (Kettenregel rückwärts), <strong>partielle Integration</strong> (Produktregel rückwärts) und <strong>Partialbrüche</strong> (eine rationale Funktion in einfache Teile zerlegen).',
    },
    intro: [
      { en: '<strong>Substitution</strong> replaces an inner expression by $u$: if the integrand contains $g(x)$ and its derivative $g&#39;(x)$, set $u = g(x)$ so $du = g&#39;(x)\\,dx$ and the integral simplifies.',
        de: '<strong>Substitution</strong> ersetzt einen inneren Ausdruck durch $u$: enthält der Integrand $g(x)$ und seine Ableitung $g&#39;(x)$, setze $u = g(x)$, sodass $du = g&#39;(x)\\,dx$ und das Integral einfacher wird.' },
      { en: '<strong>Integration by parts</strong> comes straight from the product rule: $\\int u\\,dv = uv - \\int v\\,du$. Pick $u$ so that its derivative is simpler.',
        de: '<strong>Partielle Integration</strong> folgt direkt aus der Produktregel: $\\int u\\,dv = uv - \\int v\\,du$. Wähle $u$ so, dass seine Ableitung einfacher ist.' },
    ],
    how: [
      { en: '<strong>Partial fractions:</strong> a proper rational function $\\frac{P(x)}{Q(x)}$ splits into a sum of terms like $\\frac{A}{x-a}$, each of which integrates to a logarithm.',
        de: '<strong>Partialbrüche:</strong> eine echt gebrochene rationale Funktion $\\frac{P(x)}{Q(x)}$ zerfällt in eine Summe von Termen wie $\\frac{A}{x-a}$, die jeweils zu einem Logarithmus integrieren.' },
      { en: 'A common mnemonic for choosing $u$ in parts is <strong>LIATE</strong>: logarithmic, inverse-trig, algebraic, trig, exponential, in that priority.',
        de: 'Eine gängige Merkhilfe für die Wahl von $u$ bei der partiellen Integration ist <strong>LIATE</strong>: logarithmisch, arkus, algebraisch, trigonometrisch, exponentiell, in dieser Reihenfolge.' },
    ],
    pitfalls: [
      { en: 'When you substitute in a <strong>definite</strong> integral, either convert the limits to the new variable or change back before plugging them in.',
        de: 'Substituierst du in einem <strong>bestimmten</strong> Integral, wandle entweder die Grenzen in die neue Variable um oder rechne vor dem Einsetzen zurück.' },
    ],
  },

  'recurrences': {
    tldr: {
      en: 'A <strong>recurrence</strong> defines each term from earlier ones, like Fibonacci $a_n = a_{n-1} + a_{n-2}$. A <strong>linear homogeneous</strong> recurrence is solved with its <strong>characteristic equation</strong>, the discrete-math cousin of solving a differential equation.',
      de: 'Eine <strong>Rekurrenz</strong> definiert jedes Glied aus frühreren, wie Fibonacci $a_n = a_{n-1} + a_{n-2}$. Eine <strong>lineare homogene</strong> Rekurrenz löst man mit ihrer <strong>charakteristischen Gleichung</strong>, dem diskreten Gegenstück zum Lösen einer Differentialgleichung.',
    },
    intro: [
      { en: 'For a recurrence $a_n = c_1 a_{n-1} + c_2 a_{n-2}$, guess $a_n = r^n$. Substituting gives the <strong>characteristic equation</strong> $r^2 = c_1 r + c_2$, whose roots build the general solution.',
        de: 'Für eine Rekurrenz $a_n = c_1 a_{n-1} + c_2 a_{n-2}$ setzt man $a_n = r^n$ an. Einsetzen liefert die <strong>charakteristische Gleichung</strong> $r^2 = c_1 r + c_2$, deren Wurzeln die allgemeine Lösung bilden.' },
      { en: 'With two distinct roots $r_1, r_2$ the solution is $a_n = A\\,r_1^n + B\\,r_2^n$; the constants $A, B$ come from the initial values.',
        de: 'Bei zwei verschiedenen Wurzeln $r_1, r_2$ ist die Lösung $a_n = A\\,r_1^n + B\\,r_2^n$; die Konstanten $A, B$ folgen aus den Anfangswerten.' },
    ],
    how: [
      { en: '<strong>Distinct roots:</strong> $a_n = A r_1^n + B r_2^n$. <strong>Repeated root</strong> $r$: $a_n = (A + Bn)\\,r^n$.',
        de: '<strong>Verschiedene Wurzeln:</strong> $a_n = A r_1^n + B r_2^n$. <strong>Doppelte Wurzel</strong> $r$: $a_n = (A + Bn)\\,r^n$.' },
      { en: 'Solve for $A$ and $B$ by substituting the initial terms (for Fibonacci, $a_0$ and $a_1$).',
        de: 'Bestimme $A$ und $B$ durch Einsetzen der Anfangsglieder (bei Fibonacci $a_0$ und $a_1$).' },
    ],
    pitfalls: [
      { en: 'This method is for <strong>linear</strong> recurrences with constant coefficients. Divide-and-conquer running times like $T(n) = a\\,T(\\tfrac{n}{b}) + f(n)$ use the Master Theorem instead.',
        de: 'Diese Methode gilt für <strong>lineare</strong> Rekurrenzen mit konstanten Koeffizienten. Laufzeiten von Teile-und-herrsche wie $T(n) = a\\,T(\\tfrac{n}{b}) + f(n)$ nutzen stattdessen das Mastertheorem.' },
    ],
  },

  'graph-theory': {
    tldr: {
      en: 'A <strong>graph</strong> is a set of <strong>vertices</strong> joined by <strong>edges</strong>. The core vocabulary: degree, paths and cycles, connectivity, trees, the difference between <strong>Euler</strong> (every edge once) and <strong>Hamilton</strong> (every vertex once) traversals, plus bipartite and planar graphs.',
      de: 'Ein <strong>Graph</strong> ist eine Menge von <strong>Knoten</strong>, verbunden durch <strong>Kanten</strong>. Das Kernvokabular: Grad, Wege und Kreise, Zusammenhang, Bäume, der Unterschied zwischen <strong>Euler</strong> (jede Kante einmal) und <strong>Hamilton</strong> (jeder Knoten einmal), dazu bipartite und planare Graphen.',
    },
    intro: [
      { en: 'The <strong>degree</strong> of a vertex is how many edges touch it. The handshaking lemma says the degrees sum to twice the number of edges: $\\sum \\deg(v) = 2|E|$, so the number of odd-degree vertices is always even.',
        de: 'Der <strong>Grad</strong> eines Knotens ist die Zahl der anliegenden Kanten. Das Handschlaglemma sagt, die Grade summieren sich zum Doppelten der Kantenzahl: $\\sum \\deg(v) = 2|E|$, die Zahl der Knoten ungeraden Grades ist also stets gerade.' },
      { en: 'A <strong>tree</strong> is a connected graph with no cycles; it has exactly $|V| - 1$ edges. A <strong>bipartite</strong> graph splits its vertices into two sides with edges only between the sides.',
        de: 'Ein <strong>Baum</strong> ist ein zusammenhängender Graph ohne Kreise; er hat genau $|V| - 1$ Kanten. Ein <strong>bipartiter</strong> Graph teilt seine Knoten in zwei Seiten mit Kanten nur zwischen den Seiten.' },
    ],
    how: [
      { en: '<strong>Euler path</strong> (every edge once) exists exactly when the graph is connected and has zero or two odd-degree vertices.',
        de: '<strong>Eulerweg</strong> (jede Kante einmal) existiert genau dann, wenn der Graph zusammenhängend ist und null oder zwei Knoten ungeraden Grades hat.' },
      { en: '<strong>Hamilton path</strong> (every vertex once) has no such simple test, it is NP-hard in general, which is what makes it so much harder than Euler.',
        de: '<strong>Hamiltonweg</strong> (jeder Knoten einmal) hat keinen solchen einfachen Test, er ist im Allgemeinen NP-schwer, was ihn viel schwerer macht als Euler.' },
    ],
    pitfalls: [
      { en: 'Euler and Hamilton sound similar but are worlds apart: one has a one-line criterion, the other is intractable. Do not confuse edge-traversal with vertex-traversal.',
        de: 'Euler und Hamilton klingen ähnlich, sind aber grundverschieden: das eine hat ein Einzeilenkriterium, das andere ist unlösbar schwer. Verwechsle Kanten- nicht mit Knotendurchlauf.' },
    ],
  },

  'sql-advanced': {
    tldr: {
      en: 'Beyond a plain SELECT: <strong>aggregate functions</strong> (COUNT, SUM, AVG) with <strong>GROUP BY</strong> and <strong>HAVING</strong> for reporting, <strong>subqueries</strong> (a SELECT nested inside another), and <strong>views</strong> (a saved query you can treat like a table).',
      de: 'Jenseits eines einfachen SELECT: <strong>Aggregatfunktionen</strong> (COUNT, SUM, AVG) mit <strong>GROUP BY</strong> und <strong>HAVING</strong> für Auswertungen, <strong>Unterabfragen</strong> (ein SELECT in einem anderen) und <strong>Sichten</strong> (eine gespeicherte Abfrage, die sich wie eine Tabelle nutzen lässt).',
    },
    intro: [
      { en: '<strong>GROUP BY</strong> collapses rows that share a value into one group, and aggregates summarise each group. <strong>WHERE</strong> filters rows before grouping; <strong>HAVING</strong> filters the groups after.',
        de: '<strong>GROUP BY</strong> fasst Zeilen mit gleichem Wert zu einer Gruppe zusammen, und Aggregate fassen jede Gruppe zusammen. <strong>WHERE</strong> filtert Zeilen vor der Gruppierung; <strong>HAVING</strong> filtert die Gruppen danach.' },
      { en: 'A <strong>subquery</strong> lets one query feed another, for example selecting customers whose spend is above the overall average computed by an inner SELECT.',
        de: 'Eine <strong>Unterabfrage</strong> lässt eine Abfrage eine andere speisen, etwa Kunden zu wählen, deren Umsatz über dem von einem inneren SELECT berechneten Durchschnitt liegt.' },
    ],
    how: [
      { en: '<strong>Aggregates:</strong> <code>SELECT dept, AVG(salary) FROM emp GROUP BY dept HAVING AVG(salary) &gt; 3000</code>.',
        de: '<strong>Aggregate:</strong> <code>SELECT dept, AVG(salary) FROM emp GROUP BY dept HAVING AVG(salary) &gt; 3000</code>.' },
      { en: '<strong>View:</strong> <code>CREATE VIEW v AS SELECT ...</code> names a query so complex logic is written once and reused.',
        de: '<strong>Sicht:</strong> <code>CREATE VIEW v AS SELECT ...</code> benennt eine Abfrage, sodass komplexe Logik einmal geschrieben und wiederverwendet wird.' },
    ],
    pitfalls: [
      { en: 'Every column in the SELECT that is not inside an aggregate must appear in the GROUP BY, otherwise the query is ambiguous and rejected.',
        de: 'Jede Spalte im SELECT, die nicht in einem Aggregat steht, muss im GROUP BY erscheinen, sonst ist die Abfrage mehrdeutig und wird abgelehnt.' },
    ],
  },

  'triggers': {
    tldr: {
      en: 'A <strong>trigger</strong> is a block of SQL the database runs <strong>automatically</strong> in response to an INSERT, UPDATE or DELETE on a table. A <strong>stored procedure</strong> is a named routine you call on demand. Both push logic into the database itself, close to the data.',
      de: 'Ein <strong>Trigger</strong> ist ein SQL-Block, den die Datenbank <strong>automatisch</strong> bei einem INSERT, UPDATE oder DELETE auf einer Tabelle ausführt. Eine <strong>gespeicherte Prozedur</strong> ist eine benannte Routine, die du bei Bedarf aufrufst. Beide verlagern Logik in die Datenbank, nah an die Daten.',
    },
    intro: [
      { en: 'A trigger fires <strong>BEFORE</strong> or <strong>AFTER</strong> its event and runs <strong>FOR EACH ROW</strong> affected. Inside it, <code>NEW</code> is the incoming row and <code>OLD</code> the previous one, so you can validate, log, or keep a derived column in sync automatically.',
        de: 'Ein Trigger feuert <strong>BEFORE</strong> oder <strong>AFTER</strong> seinem Ereignis und läuft <strong>FOR EACH ROW</strong> pro betroffener Zeile. Darin ist <code>NEW</code> die neue und <code>OLD</code> die vorige Zeile, sodass du automatisch prüfen, protokollieren oder eine abgeleitete Spalte pflegen kannst.' },
      { en: 'Common uses: an <strong>audit log</strong> that records every change, <strong>enforcing a rule</strong> the schema cannot express, or maintaining a running total or average without touching the application.',
        de: 'Typische Zwecke: ein <strong>Änderungsprotokoll</strong>, das jede Änderung festhält, das <strong>Durchsetzen einer Regel</strong>, die das Schema nicht ausdrücken kann, oder das Pflegen einer laufenden Summe oder eines Durchschnitts ohne die Anwendung.' },
    ],
    pseudocode: `CREATE TRIGGER log_grade_change\nAFTER UPDATE ON enrolment\nFOR EACH ROW\n  INSERT INTO grade_history(student_id, old_grade, new_grade, changed_at)\n  VALUES (OLD.student_id, OLD.grade, NEW.grade, NOW());`,
    how: [
      { en: '<strong>Stored procedure:</strong> <code>CREATE PROCEDURE name(params) BEGIN ... END</code>, then <code>CALL name(args)</code>. It can take parameters and hold multi-step logic in one place.',
        de: '<strong>Gespeicherte Prozedur:</strong> <code>CREATE PROCEDURE name(params) BEGIN ... END</code>, dann <code>CALL name(args)</code>. Sie nimmt Parameter und bündelt mehrstufige Logik an einem Ort.' },
    ],
    pitfalls: [
      { en: 'Triggers run <strong>invisibly</strong>: a plain INSERT can set off a chain of them, which makes surprises hard to debug. Keep each trigger small and beware triggers that fire other triggers.',
        de: 'Trigger laufen <strong>unsichtbar</strong>: ein simples INSERT kann eine Kette auslösen, was Überraschungen schwer auffindbar macht. Halte jeden Trigger klein und hüte dich vor Triggern, die andere Trigger auslösen.' },
    ],
  },

  'functions-mappings': {
    tldr: {
      en: 'A <strong>function</strong> (mapping) sends each input to <strong>exactly one</strong> output. The properties that matter: <strong>injective</strong> (one-to-one), <strong>surjective</strong> (onto), and <strong>bijective</strong> (both, and therefore invertible). Composition chains mappings; the inverse undoes a bijection.',
      de: 'Eine <strong>Funktion</strong> (Abbildung) schickt jede Eingabe auf <strong>genau eine</strong> Ausgabe. Die wichtigen Eigenschaften: <strong>injektiv</strong> (eineindeutig), <strong>surjektiv</strong> (auf ganz Y) und <strong>bijektiv</strong> (beides, also umkehrbar). Verkettung reiht Abbildungen; die Umkehrung macht eine Bijektion rückgängig.',
    },
    intro: [
      { en: 'A function $f: X \\to Y$ has a <strong>domain</strong> $X$, a <strong>codomain</strong> $Y$, and a rule assigning each $x$ a single $f(x)$. The <strong>image</strong> is the set of values actually hit.',
        de: 'Eine Funktion $f: X \\to Y$ hat einen <strong>Definitionsbereich</strong> $X$, einen <strong>Wertevorrat</strong> $Y$ und eine Regel, die jedem $x$ ein einziges $f(x)$ zuordnet. Das <strong>Bild</strong> ist die Menge der tatsächlich getroffenen Werte.' },
    ],
    how: [
      { en: '<strong>Injective:</strong> different inputs give different outputs ($f(a) = f(b) \\Rightarrow a = b$). <strong>Surjective:</strong> every $y$ in the codomain is hit. <strong>Bijective:</strong> both, so $f$ has an inverse $f^{-1}$.',
        de: '<strong>Injektiv:</strong> verschiedene Eingaben liefern verschiedene Ausgaben ($f(a) = f(b) \\Rightarrow a = b$). <strong>Surjektiv:</strong> jedes $y$ im Wertevorrat wird getroffen. <strong>Bijektiv:</strong> beides, also hat $f$ eine Umkehrung $f^{-1}$.' },
      { en: '<strong>Composition:</strong> $(g \\circ f)(x) = g(f(x))$, applying $f$ first. It is associative but not commutative.',
        de: '<strong>Verkettung:</strong> $(g \\circ f)(x) = g(f(x))$, zürst $f$. Sie ist assoziativ, aber nicht kommutativ.' },
    ],
    pitfalls: [
      { en: 'Surjectivity depends on the chosen codomain: $f(x) = x^2$ is onto $[0, \\infty)$ but not onto all of $\\mathbb{R}$. Only a <strong>bijection</strong> can be inverted.',
        de: 'Surjektivität hängt vom gewählten Wertevorrat ab: $f(x) = x^2$ ist surjektiv auf $[0, \\infty)$, aber nicht auf ganz $\\mathbb{R}$. Nur eine <strong>Bijektion</strong> ist umkehrbar.' },
    ],
  },

  'real-numbers': {
    tldr: {
      en: 'The <strong>real numbers</strong> complete the rationals by filling every gap on the line (numbers like $\\sqrt{2}$ and $\\pi$ that no fraction reaches). Their defining property is <strong>completeness</strong>: every set bounded above has a least upper bound, which is exactly what makes limits and calculus work.',
      de: 'Die <strong>reellen Zahlen</strong> vervollständigen die rationalen, indem sie jede Lücke auf der Zahlengerade füllen (Zahlen wie $\\sqrt{2}$ und $\\pi$, die kein Bruch erreicht). Ihre bestimmende Eigenschaft ist die <strong>Vollständigkeit</strong>: jede nach oben beschränkte Menge hat eine kleinste obere Schranke, was genau Grenzwerte und Analysis möglich macht.',
    },
    intro: [
      { en: 'The rationals have holes: there is no fraction whose square is $2$. The reals patch every such hole, giving a continuous line with no gaps between the rationals, which are nonetheless <strong>dense</strong> (a rational sits arbitrarily close to any real).',
        de: 'Die rationalen Zahlen haben Löcher: kein Bruch hat das Quadrat $2$. Die reellen füllen jedes solche Loch und geben eine lüchenlose, stetige Gerade, in der die rationalen dennoch <strong>dicht</strong> liegen (eine rationale Zahl liegt beliebig nah an jeder reellen).' },
    ],
    how: [
      { en: 'The <strong>supremum</strong> (least upper bound) and <strong>infimum</strong> (greatest lower bound) generalise max and min to sets that never attain their bound, like the supremum $1$ of $\\{1 - \\tfrac{1}{n}\\}$.',
        de: 'Das <strong>Supremum</strong> (kleinste obere Schranke) und <strong>Infimum</strong> (grösste untere Schranke) verallgemeinern Max und Min auf Mengen, die ihre Schranke nie erreichen, etwa das Supremum $1$ von $\\{1 - \\tfrac{1}{n}\\}$.' },
      { en: 'The <strong>absolute value</strong> $|x|$ measures distance from zero and satisfies the triangle inequality $|a + b| \\le |a| + |b|$, the workhorse of every limit proof.',
        de: 'Der <strong>Betrag</strong> $|x|$ misst den Abstand zu null und erfüllt die Dreiecksungleichung $|a + b| \\le |a| + |b|$, das Arbeitspferd jedes Grenzwertbeweises.' },
    ],
    pitfalls: [
      { en: 'A supremum need not belong to the set: $\\{x : x^2 &lt; 2\\}$ has supremum $\\sqrt{2}$, which is not in it. That gap is precisely why the rationals are not complete.',
        de: 'Ein Supremum muss nicht zur Menge gehören: $\\{x : x^2 &lt; 2\\}$ hat das Supremum $\\sqrt{2}$, das nicht darin liegt. Genau diese Lücke macht die rationalen Zahlen unvollständig.' },
    ],
  },
}

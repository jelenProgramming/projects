// Programming I: the imperative core, with a C++ snippet per topic and the
// same idea shown in Python, JavaScript, Java and C#. Original explanations.
export const prog1Content = {
  'variables-types': {
    tldr: { en: 'A <strong>variable</strong> is a named box that stores a value of some <strong>type</strong>. In <strong>statically typed</strong> languages (C++, Java, C#) the type is fixed at compile time; in <strong>dynamically typed</strong> ones (Python, JavaScript) the type travels with the value at run time.', de: 'Eine <strong>Variable</strong> ist ein benannter Behälter für einen Wert eines <strong>Typs</strong>. In <strong>statisch typisierten</strong> Sprachen (C++, Java, C#) steht der Typ zur Compilezeit fest; in <strong>dynamisch typisierten</strong> (Python, JavaScript) reist der Typ zur Laufzeit mit dem Wert.', sl: '<strong>Spremenljivka</strong> je poimenovana škatla, ki hrani vrednost nekega <strong>tipa</strong>. V <strong>statično tipiziranih</strong> jezikih (C++, Java, C#) je tip določen ob prevajanju; v <strong>dinamično tipiziranih</strong> (Python, JavaScript) tip potuje z vrednostjo med izvajanjem.' },
    intro: [
      { en: 'The type decides how many bytes the value occupies, what operations are allowed, and how it is interpreted. An <code>int</code> and a <code>double</code> of the same bit pattern mean completely different numbers.', de: 'Der Typ bestimmt, wie viele Bytes der Wert belegt, welche Operationen erlaubt sind und wie er interpretiert wird. Ein <code>int</code> und ein <code>double</code> mit gleichem Bitmuster bedeuten völlig verschiedene Zahlen.', sl: 'Tip določa, koliko bajtov vrednost zaseda, katere operacije so dovoljene in kako se razlaga. <code>int</code> in <code>double</code> z enakim bitnim vzorcem pomenita popolnoma različni števili.' },
    ],
    how: [
      { en: 'Common primitive types: whole numbers (<code>int</code>), real numbers (<code>double</code>), single characters (<code>char</code>), truth values (<code>bool</code>), and text (<code>string</code>).', de: 'Gängige primitive Typen: ganze Zahlen (<code>int</code>), reelle Zahlen (<code>double</code>), einzelne Zeichen (<code>char</code>), Wahrheitswerte (<code>bool</code>) und Text (<code>string</code>).', sl: 'Pogosti primitivni tipi: cela števila (<code>int</code>), realna števila (<code>double</code>), posamezni znaki (<code>char</code>), logične vrednosti (<code>bool</code>) in besedilo (<code>string</code>).' },
      { en: 'A local variable lives on the <strong>stack</strong> and disappears when its block ends. Static typing catches type errors before the program ever runs.', de: 'Eine lokale Variable liegt auf dem <strong>Stack</strong> und verschwindet am Blockende. Statische Typisierung fängt Typfehler ab, bevor das Programm läuft.', sl: 'Lokalna spremenljivka živi na <strong>skladu</strong> in izgine, ko se njen blok konča. Statična tipizacija ujame tipske napake, še preden se program zažene.' },
    ],
    code: {
      cpp: `int age = 20;\ndouble price = 9.99;\nchar grade = 'A';\nstd::string name = "Ann";\nbool ok = true;`,
      python: `age = 20\nprice = 9.99\ngrade = 'A'\nname = "Ann"\nok = True    # types are inferred at run time`,
      js: `let age = 20;\nconst price = 9.99;\nlet grade = "A";\nlet name = "Ann";\nlet ok = true;`,
      java: `int age = 20;\ndouble price = 9.99;\nchar grade = 'A';\nString name = "Ann";\nboolean ok = true;`,
      csharp: `int age = 20;\ndouble price = 9.99;\nchar grade = 'A';\nstring name = "Ann";\nbool ok = true;`,
    },
    pitfalls: [
      { en: 'Integer division truncates: <code>7 / 2</code> is <code>3</code>, not <code>3.5</code>, unless one operand is a real number. A frequent silent bug.', de: 'Ganzzahldivision schneidet ab: <code>7 / 2</code> ist <code>3</code>, nicht <code>3.5</code>, ausser ein Operand ist reell. Ein häufiger stiller Fehler.', sl: 'Celoštevilsko deljenje odreže: <code>7 / 2</code> je <code>3</code>, ne <code>3.5</code>, razen če je en operand realno število. Pogosta tiha napaka.' },
      { en: 'Fixed-size integer types <strong>overflow</strong> when a value exceeds their range, wrapping around instead of growing.', de: 'Ganzzahltypen fester Grösse laufen bei Überschreitung ihres Bereichs <strong>über</strong> und springen um, statt zu wachsen.', sl: 'Celoštevilski tipi s fiksno velikostjo se ob preseganju obsega <strong>prelijejo</strong> in se ovijejo, namesto da bi rasli.' },
    ],
  },

  'control-flow': {
    tldr: { en: 'Control flow decides <strong>which</strong> statements run and <strong>how often</strong>: <strong>conditionals</strong> (if / else / switch) branch on a test, and <strong>loops</strong> (for / while) repeat until a condition changes. Together they turn a straight-line script into an algorithm.', de: 'Ablaufsteuerung entscheidet, <strong>welche</strong> Anweisungen laufen und <strong>wie oft</strong>: <strong>Bedingungen</strong> (if / else / switch) verzweigen nach einem Test, <strong>Schleifen</strong> (for / while) wiederholen, bis sich eine Bedingung ändert.', sl: 'Krmiljenje poteka odloča, <strong>kateri</strong> stavki se izvedejo in <strong>kako pogosto</strong>: <strong>pogojni stavki</strong> (if / else / switch) se vejijo glede na test, <strong>zanke</strong> (for / while) pa se ponavljajo, dokler se pogoj ne spremeni. Skupaj spremenijo linearni skript v algoritem.' },
    intro: [
      { en: 'A <strong>for</strong> loop is for a known count; a <strong>while</strong> loop repeats as long as a condition holds; <strong>if / else</strong> chooses a path. A <strong>switch</strong> is a clean multi-way branch on one value.', de: 'Eine <strong>for</strong>-Schleife für eine bekannte Anzahl; eine <strong>while</strong>-Schleife wiederholt, solange eine Bedingung gilt; <strong>if / else</strong> wählt einen Pfad. Ein <strong>switch</strong> ist eine saubere Mehrfachverzweigung über einen Wert.', sl: 'Zanka <strong>for</strong> je za znano število ponovitev; zanka <strong>while</strong> se ponavlja, dokler pogoj velja; <strong>if / else</strong> izbere pot. <strong>switch</strong> je pregledna večsmerna vejitev po eni vrednosti.' },
    ],
    how: [
      { en: 'Every loop needs a <strong>progress step</strong> toward its exit condition, or it never ends.', de: 'Jede Schleife braucht einen <strong>Fortschritt</strong> zur Abbruchbedingung, sonst endet sie nie.', sl: 'Vsaka zanka potrebuje <strong>korak napredka</strong> proti izstopnemu pogoju, sicer se nikoli ne konča.' },
    ],
    code: {
      cpp: `if (x > 0) std::cout << "pos";\nelse         std::cout << "non-pos";\n\nfor (int i = 0; i < n; i++)\n  sum += i;`,
      python: `if x > 0:\n    print("pos")\nelse:\n    print("non-pos")\n\nfor i in range(n):\n    total += i`,
      js: `if (x > 0) console.log("pos");\nelse       console.log("non-pos");\n\nfor (let i = 0; i < n; i++)\n  sum += i;`,
      java: `if (x > 0) System.out.println("pos");\nelse       System.out.println("non-pos");\n\nfor (int i = 0; i < n; i++)\n  sum += i;`,
      csharp: `if (x > 0) Console.WriteLine("pos");\nelse       Console.WriteLine("non-pos");\n\nfor (int i = 0; i < n; i++)\n  sum += i;`,
    },
    pitfalls: [
      { en: 'An <strong>off-by-one</strong> in the loop bound (<code>&lt;</code> vs <code>&lt;=</code>) either skips the last item or runs one step too far. The most common loop bug.', de: 'Ein <strong>Off-by-One</strong> in der Schleifengrenze (<code>&lt;</code> vs <code>&lt;=</code>) überspringt das letzte Element oder läuft einen Schritt zu weit. Der häufigste Schleifenfehler.', sl: 'Napaka <strong>za ena</strong> v meji zanke (<code>&lt;</code> proti <code>&lt;=</code>) bodisi izpusti zadnji element bodisi teče en korak predaleč. Najpogostejša napaka v zankah.' },
    ],
  },

  'functions': {
    tldr: { en: 'A <strong>function</strong> packages a piece of logic behind a name and a parameter list, so it can be reused and tested in isolation. The key question is <strong>how arguments are passed</strong>: <strong>by value</strong> (a copy) or <strong>by reference</strong> (the original).', de: 'Eine <strong>Funktion</strong> verpackt Logik hinter Name und Parameterliste, sodass sie wiederverwendbar und isoliert testbar ist. Zentrale Frage: <strong>wie werden Argumente übergeben</strong>: <strong>per Wert</strong> (eine Kopie) oder <strong>per Referenz</strong> (das Original).', sl: '<strong>Funkcija</strong> zapakira del logike za imenom in seznamom parametrov, da jo je mogoče ponovno uporabiti in preizkusiti ločeno. Ključno vprašanje je, <strong>kako se podajajo argumenti</strong>: <strong>po vrednosti</strong> (kopija) ali <strong>po referenci</strong> (izvirnik).' },
    intro: [
      { en: '<strong>By value</strong> copies the argument, so the function cannot change the caller&#39;s variable. <strong>By reference</strong> passes the original, so changes are visible outside. C++ picks with <code>&amp;</code>; managed languages pass primitives by value and objects by reference automatically.', de: '<strong>Per Wert</strong> kopiert das Argument, die Funktion kann die Variable des Aufrufers nicht ändern. <strong>Per Referenz</strong> übergibt das Original, Änderungen sind aussen sichtbar. C++ wählt mit <code>&amp;</code>; verwaltete Sprachen übergeben Primitive per Wert und Objekte per Referenz automatisch.', sl: '<strong>Po vrednosti</strong> kopira argument, zato funkcija ne more spremeniti klicateljeve spremenljivke. <strong>Po referenci</strong> poda izvirnik, zato so spremembe vidne navzven. C++ izbira z <code>&amp;</code>; upravljani jeziki samodejno podajajo primitivne tipe po vrednosti, objekte pa po referenci.' },
    ],
    how: [
      { en: 'A function should do <strong>one</strong> thing, take what it needs as parameters, and return its result rather than reaching for global state.', de: 'Eine Funktion sollte <strong>eine</strong> Sache tun, ihre Eingaben als Parameter nehmen und das Ergebnis zurückgeben, statt auf globalen Zustand zuzugreifen.', sl: 'Funkcija naj počne <strong>eno</strong> stvar, naj vzame, kar potrebuje, kot parametre in naj vrne rezultat, namesto da posega po globalnem stanju.' },
    ],
    code: {
      cpp: `int add(int a, int b) { return a + b; }\n\nvoid inc(int& x) { x++; }   // by reference: changes the caller`,
      python: `def add(a, b):\n    return a + b\n\n# numbers are immutable, so a function cannot rebind the caller's int`,
      js: `function add(a, b) { return a + b; }\n\n// primitives pass by value, objects by reference`,
      java: `int add(int a, int b) { return a + b; }\n\n// primitives pass by value, object references by value`,
      csharp: `int Add(int a, int b) => a + b;\n\nvoid Inc(ref int x) => x++;   // ref parameter, like C++ by-reference`,
    },
    pitfalls: [
      { en: 'Passing a large object <strong>by value</strong> copies it every call. In C++ pass by <code>const&amp;</code> to avoid the copy without allowing changes.', de: 'Ein grosses Objekt <strong>per Wert</strong> zu übergeben kopiert es bei jedem Aufruf. In C++ per <code>const&amp;</code> übergeben, um die Kopie ohne Änderungsrecht zu vermeiden.', sl: 'Podajanje velikega objekta <strong>po vrednosti</strong> ga kopira ob vsakem klicu. V C++ ga podajajte po <code>const&amp;</code>, da se izognete kopiji brez pravice do spreminjanja.' },
    ],
  },

  'pointers': {
    tldr: { en: 'A <strong>pointer</strong> is a variable that stores a <strong>memory address</strong>. Through it you read or change the value living at that address, and you walk the heap, arrays and linked structures. A <strong>reference</strong> is a safer alias for an existing variable. This is a C and C++ signature; managed languages hide it.', de: 'Ein <strong>Zeiger</strong> ist eine Variable, die eine <strong>Speicheradresse</strong> hält. Über ihn liest oder änderst du den Wert an dieser Adresse und durchläufst Heap, Felder und verkettete Strukturen. Eine <strong>Referenz</strong> ist ein sicherer Alias für eine bestehende Variable. Typisch für C und C++; verwaltete Sprachen verbergen es.', sl: '<strong>Kazalec</strong> je spremenljivka, ki hrani <strong>pomnilniški naslov</strong>. Prek njega berete ali spreminjate vrednost na tem naslovu ter se sprehajate po kopici, poljih in povezanih strukturah. <strong>Referenca</strong> je varnejši vzdevek za obstoječo spremenljivko. To je značilnost jezikov C in C++; upravljani jeziki jo skrivajo.' },
    intro: [
      { en: 'Memory splits into the <strong>stack</strong> (fast, automatic local variables) and the <strong>heap</strong> (manually managed, long-lived allocations). A pointer is how you reach a heap allocation: <code>new</code> gives you the address, <code>delete</code> frees it.', de: 'Speicher teilt sich in <strong>Stack</strong> (schnelle, automatische lokale Variablen) und <strong>Heap</strong> (manuell verwaltete, langlebige Allokationen). Ein Zeiger erreicht eine Heap-Allokation: <code>new</code> liefert die Adresse, <code>delete</code> gibt sie frei.', sl: 'Pomnilnik se deli na <strong>sklad</strong> (hitre, samodejne lokalne spremenljivke) in <strong>kopico</strong> (ročno upravljane, dolgožive dodelitve). Kazalec je način, kako dosežete dodelitev na kopici: <code>new</code> vam da naslov, <code>delete</code> ga sprosti.' },
    ],
    how: [
      { en: '<code>&amp;x</code> takes the address of <code>x</code>; <code>*p</code> <strong>dereferences</strong> the pointer to reach the value; <code>p-&gt;field</code> is shorthand for <code>(*p).field</code>.', de: '<code>&amp;x</code> nimmt die Adresse von <code>x</code>; <code>*p</code> <strong>dereferenziert</strong> den Zeiger zum Wert; <code>p-&gt;field</code> ist Kurzform für <code>(*p).field</code>.', sl: '<code>&amp;x</code> vzame naslov <code>x</code>; <code>*p</code> <strong>dereferencira</strong> kazalec do vrednosti; <code>p-&gt;field</code> je okrajšava za <code>(*p).field</code>.' },
    ],
    code: {
      cpp: `int x = 5;\nint* p = &x;   // p holds the address of x\n*p = 10;       // change x through the pointer\nint& r = x;    // reference: an alias for x`,
      python: { na: 'Python has no pointers. Every variable is a name bound to an object, and you never touch raw addresses. The closest idea is that two names can bind to the same object, so a change through one is seen through the other.' },
      js: { na: 'JavaScript has no pointers. Primitives are copied by value and objects are handled through references, but memory addresses are never exposed.' },
      java: { na: 'Java has no explicit pointers. Object variables are references managed by the JVM, and there is no address arithmetic or manual free.' },
      csharp: `int x = 5;\nref int r = ref x;   // safe reference alias, like C++ int&\n// raw pointers exist only inside an unsafe block:\n// unsafe { int* p = &x; *p = 10; }`,
    },
    pitfalls: [
      { en: 'A <strong>dangling pointer</strong> (pointing at freed memory) and a <strong>null dereference</strong> are the classic crashes. After <code>delete</code>, set the pointer to <code>nullptr</code>.', de: 'Ein <strong>hängender Zeiger</strong> (auf freigegebenen Speicher) und eine <strong>Null-Dereferenzierung</strong> sind die klassischen Abstürze. Nach <code>delete</code> den Zeiger auf <code>nullptr</code> setzen.', sl: '<strong>Viseči kazalec</strong> (kaže na sproščen pomnilnik) in <strong>razrešitev ničelnega kazalca</strong> sta klasična sesutja. Po <code>delete</code> nastavite kazalec na <code>nullptr</code>.' },
      { en: 'Every <code>new</code> needs exactly one matching <code>delete</code>, or you leak memory. Modern C++ prefers smart pointers that free automatically.', de: 'Jedes <code>new</code> braucht genau ein passendes <code>delete</code>, sonst leckt Speicher. Modernes C++ bevorzugt Smart Pointer, die automatisch freigeben.', sl: 'Vsak <code>new</code> potrebuje natanko en ustrezen <code>delete</code>, sicer pušča pomnilnik. Sodobni C++ ima raje pametne kazalce, ki sproščajo samodejno.' },
    ],
  },

  'recursion': {
    tldr: { en: '<strong>Recursion</strong> is a function that calls itself on a smaller input, with a <strong>base case</strong> that stops the descent. Each call gets its own stack frame. It shines on self-similar problems: factorials, tree walks, divide-and-conquer.', de: '<strong>Rekursion</strong> ist eine Funktion, die sich mit kleinerer Eingabe selbst aufruft, mit einem <strong>Basisfall</strong>, der den Abstieg stoppt. Jeder Aufruf hat seinen eigenen Stapelrahmen. Sie glänzt bei selbstähnlichen Problemen: Fakultäten, Baumdurchläufe, Teile-und-herrsche.', sl: '<strong>Rekurzija</strong> je funkcija, ki kliče samo sebe na manjšem vhodu, z <strong>osnovnim primerom</strong>, ki ustavi sestop. Vsak klic dobi svoj skladovni okvir. Blesti pri samopodobnih problemih: fakultete, sprehodi po drevesih, deli in vladaj.' },
    intro: [
      { en: 'Two parts are mandatory: the <strong>base case</strong> (the smallest input, answered directly) and the <strong>recursive case</strong> (reduce the problem and call yourself). Miss the base case and the calls never stop, overflowing the stack.', de: 'Zwei Teile sind Pflicht: der <strong>Basisfall</strong> (kleinste Eingabe, direkt beantwortet) und der <strong>Rekursionsfall</strong> (Problem verkleinern und sich selbst aufrufen). Fehlt der Basisfall, enden die Aufrufe nie und der Stapel läuft über.', sl: 'Obvezna sta dva dela: <strong>osnovni primer</strong> (najmanjši vhod, odgovorjen neposredno) in <strong>rekurzivni primer</strong> (zmanjšaj problem in pokliči samega sebe). Če izpustiš osnovni primer, se klici nikoli ne ustavijo in sklad se prelije.' },
    ],
    how: [
      { en: 'Every recursion has an equivalent <strong>iterative</strong> version using an explicit stack; recursion just lets the call stack do that bookkeeping for you.', de: 'Jede Rekursion hat eine gleichwertige <strong>iterative</strong> Version mit explizitem Stapel; Rekursion lässt nur den Aufrufstapel diese Buchhaltung übernehmen.', sl: 'Vsaka rekurzija ima enakovredno <strong>iterativno</strong> različico z eksplicitnim skladom; rekurzija zgolj prepusti to knjigovodstvo klicnemu skladu.' },
    ],
    code: {
      cpp: `int fact(int n) {\n  if (n <= 1) return 1;      // base case\n  return n * fact(n - 1);    // recursive case\n}`,
      python: `def fact(n):\n    if n <= 1:            # base case\n        return 1\n    return n * fact(n - 1)`,
      js: `function fact(n) {\n  if (n <= 1) return 1;      // base case\n  return n * fact(n - 1);\n}`,
      java: `int fact(int n) {\n  if (n <= 1) return 1;      // base case\n  return n * fact(n - 1);\n}`,
      csharp: `int Fact(int n) =>\n  n <= 1 ? 1 : n * Fact(n - 1);`,
    },
    pitfalls: [
      { en: 'Deep recursion can <strong>overflow the stack</strong>. Plain factorial or Fibonacci recursion also repeats work; memoise or go iterative for large inputs.', de: 'Tiefe Rekursion kann den <strong>Stapel überlaufen</strong> lassen. Einfache Fakultäts- oder Fibonacci-Rekursion wiederholt zudem Arbeit; memoisiere oder iteriere bei grossen Eingaben.', sl: 'Globoka rekurzija lahko <strong>prelije sklad</strong>. Preprosta rekurzija za fakulteto ali Fibonaccija tudi ponavlja delo; pri velikih vhodih memoizirajte ali preidite na iteracijo.' },
    ],
  },
}

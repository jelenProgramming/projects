// Programming II (C++): object-oriented design, generics and C++11.
// Original explanations written to match the curriculum topics, not copied from any slides.
export const prog2Content = {
  'constructors': {
    tldr: {
      en: 'A <strong>constructor</strong> runs automatically when an object is created and sets up its initial state; a <strong>destructor</strong> runs when the object is destroyed and releases whatever it owns. C++ generates default versions, but the moment an object manages a resource you must take control of them.',
      de: 'Ein <strong>Konstruktor</strong> laeuft automatisch bei der Erzeugung eines Objekts und legt seinen Anfangszustand fest; ein <strong>Destruktor</strong> laeuft bei der Zerstoerung und gibt frei, was das Objekt besitzt. C++ erzeugt Standardversionen, doch sobald ein Objekt eine Ressource verwaltet, musst du sie selbst schreiben.',
    },
    code: {
      cpp: `class Point {
  int x, y;
public:
  Point() : x(0), y(0) {}          // default constructor
  Point(int a, int b) : x(a), y(b) {}
  ~Point() {}                       // destructor
};`,
      python: `class Point:
    def __init__(self, x=0, y=0):   # constructor
        self.x, self.y = x, y
    def __del__(self):              # destructor, rarely needed
        pass`,
      js: `class Point {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
}   // no destructors; the garbage collector reclaims objects`,
      java: `class Point {
  int x, y;
  Point() { this(0, 0); }
  Point(int x, int y) { this.x = x; this.y = y; }
}   // no destructors; finalizers are discouraged`,
      csharp: `class Point {
  int x, y;
  public Point() : this(0, 0) {}
  public Point(int x, int y) { this.x = x; this.y = y; }
  ~Point() {}   // finalizer, rarely needed
}`,
    },
    intro: [
      { en: 'A constructor has the same name as the class and no return type. You can supply several, overloaded by their parameters: a <strong>default constructor</strong> (no arguments), <strong>parameterised constructors</strong>, a <strong>copy constructor</strong> <code>T(const T&amp;)</code>, and a <strong>conversion constructor</strong> that turns a single value into an object.',
        de: 'Ein Konstruktor traegt den Klassennamen und hat keinen Rueckgabetyp. Es kann mehrere geben, ueberladen nach ihren Parametern: einen <strong>Standardkonstruktor</strong> (ohne Argumente), <strong>parametrisierte Konstruktoren</strong>, einen <strong>Kopierkonstruktor</strong> <code>T(const T&amp;)</code> und einen <strong>Umwandlungskonstruktor</strong>, der aus einem einzelnen Wert ein Objekt macht.' },
      { en: 'Members should be set in the <strong>initialiser list</strong> (<code>T() : x(0), y(0) {}</code>) rather than assigned inside the body: this initialises them exactly once, works for <code>const</code> and reference members, and avoids a wasted default construction.',
        de: 'Member gehoeren in die <strong>Initialisierungsliste</strong> (<code>T() : x(0), y(0) {}</code>), nicht in den Rumpf: das initialisiert sie genau einmal, funktioniert fuer <code>const</code>- und Referenz-Member und vermeidet eine ueberfluessige Standardkonstruktion.' },
    ],
    how: [
      { en: '<strong>Default constructor:</strong> used when you write <code>T a;</code>. Declare any other constructor and the compiler stops generating this one for free.',
        de: '<strong>Standardkonstruktor:</strong> greift bei <code>T a;</code>. Sobald du einen anderen Konstruktor deklarierst, erzeugt der Compiler diesen nicht mehr automatisch.' },
      { en: '<strong>Conversion constructor:</strong> a one-argument constructor lets the compiler convert implicitly (<code>Complex c = 3.0;</code>). Mark it <code>explicit</code> to forbid silent conversions.',
        de: '<strong>Umwandlungskonstruktor:</strong> ein einargumentiger Konstruktor erlaubt implizite Umwandlung (<code>Complex c = 3.0;</code>). Mit <code>explicit</code> verbietest du stille Umwandlungen.' },
      { en: '<strong>Copy constructor and destructor:</strong> the copy constructor builds a new object from an existing one; the destructor <code>~T()</code> frees resources at end of scope or on <code>delete</code>.',
        de: '<strong>Kopierkonstruktor und Destruktor:</strong> der Kopierkonstruktor baut ein neues Objekt aus einem bestehenden; der Destruktor <code>~T()</code> gibt Ressourcen am Blockende oder bei <code>delete</code> frei.' },
    ],
    pitfalls: [
      { en: 'The compiler-generated copy constructor does a <strong>shallow copy</strong>: two objects end up owning the same pointer, and both destructors free it, a double free. If a class owns memory, write the copy constructor, copy assignment and destructor together (the <strong>rule of three</strong>).',
        de: 'Der vom Compiler erzeugte Kopierkonstruktor macht eine <strong>flache Kopie</strong>: zwei Objekte besitzen denselben Zeiger, und beide Destruktoren geben ihn frei, ein doppeltes Freigeben. Besitzt eine Klasse Speicher, schreibe Kopierkonstruktor, Kopierzuweisung und Destruktor zusammen (<strong>Dreierregel</strong>).' },
      { en: 'Forgetting <code>explicit</code> on a single-argument constructor invites conversions you never intended.',
        de: 'Ein vergessenes <code>explicit</code> bei einem einargumentigen Konstruktor laedt ungewollte Umwandlungen ein.' },
    ],
  },

  'composition': {
    tldr: {
      en: 'Objects can contain other objects. <strong>Composition</strong> is strong ownership: the part cannot exist without the whole and dies with it (a Car has an Engine). <strong>Aggregation</strong> is weak: the part is shared and outlives the whole (a Team has Players who exist independently). Both model a <strong>has-a</strong> relationship.',
      de: 'Objekte koennen andere Objekte enthalten. <strong>Komposition</strong> ist starker Besitz: der Teil existiert nicht ohne das Ganze und stirbt mit ihm (ein Auto hat einen Motor). <strong>Aggregation</strong> ist schwach: der Teil wird geteilt und ueberlebt das Ganze (ein Team hat Spieler, die unabhaengig existieren). Beide modellieren eine <strong>hat-ein</strong>-Beziehung.',
    },
    code: {
      cpp: `class Car {
  Engine engine;    // composition: owned by value
  Driver* driver;   // aggregation: referenced, not owned
};`,
      python: `class Car:
    def __init__(self, driver):
        self.engine = Engine()   # composition
        self.driver = driver     # aggregation`,
      js: `class Car {
  constructor(driver) {
    this.engine = new Engine();  // composition
    this.driver = driver;        // aggregation
  }
}`,
      java: `class Car {
  private final Engine engine = new Engine();  // composition
  private Driver driver;                        // aggregation
}`,
      csharp: `class Car {
  private readonly Engine engine = new();  // composition
  private Driver driver;                    // aggregation
}`,
    },
    intro: [
      { en: 'A data member can be of any type, including another class. When the containing object is built, its members are constructed first (in declaration order); when it is destroyed, its members are destroyed last, in reverse order.',
        de: 'Ein Datenmember kann jeden Typ haben, auch eine andere Klasse. Beim Bau des umschliessenden Objekts werden zuerst die Member konstruiert (in Deklarationsreihenfolge); bei der Zerstoerung werden sie zuletzt und in umgekehrter Reihenfolge abgebaut.' },
      { en: 'Choose containment when the relationship is <strong>has-a</strong> rather than <strong>is-a</strong>. A Car is not an Engine, so it should hold one, not inherit from one.',
        de: 'Waehle Enthaltensein, wenn die Beziehung <strong>hat-ein</strong> statt <strong>ist-ein</strong> ist. Ein Auto ist kein Motor, also sollte es einen halten, nicht von ihm erben.' },
    ],
    how: [
      { en: '<strong>Composition:</strong> the whole owns the part by value (or through an owning pointer it deletes). Their lifetimes are tied together.',
        de: '<strong>Komposition:</strong> das Ganze besitzt den Teil als Wert (oder ueber einen besitzenden Zeiger, den es loescht). Ihre Lebensdauern sind verbunden.' },
      { en: '<strong>Aggregation:</strong> the whole only references the part (a non-owning pointer or reference); the part is created and destroyed elsewhere.',
        de: '<strong>Aggregation:</strong> das Ganze verweist nur auf den Teil (nicht besitzender Zeiger oder Referenz); der Teil wird anderswo erzeugt und zerstoert.' },
    ],
    pitfalls: [
      { en: 'Reaching for inheritance when containment fits is the classic over-design. Prefer <strong>composition over inheritance</strong>: it couples classes far less tightly and is easier to change later.',
        de: 'Vererbung zu greifen, wo Enthaltensein passt, ist der klassische Ueberentwurf. Bevorzuge <strong>Komposition vor Vererbung</strong>: sie koppelt Klassen viel loser und laesst sich spaeter leichter aendern.' },
    ],
  },

  'operator-overloading': {
    tldr: {
      en: '<strong>Operator overloading</strong> gives operators like <code>+</code>, <code>==</code> and <code>&lt;&lt;</code> a custom meaning for your own types, so a <code>Complex</code> or <code>Vector</code> reads like a built-in number. It is a form of <strong>ad-hoc polymorphism</strong>: one symbol, different behaviour chosen by the operand types.',
      de: '<strong>Operatorueberladung</strong> gibt Operatoren wie <code>+</code>, <code>==</code> und <code>&lt;&lt;</code> eine eigene Bedeutung fuer deine Typen, sodass sich ein <code>Complex</code> oder <code>Vector</code> wie eine eingebaute Zahl liest. Es ist eine Form von <strong>Ad-hoc-Polymorphie</strong>: ein Symbol, unterschiedliches Verhalten je nach Operandentyp.',
    },
    code: {
      cpp: `struct Vec {
  double x, y;
  Vec operator+(const Vec& o) const { return {x + o.x, y + o.y}; }
};`,
      python: `class Vec:
    def __init__(self, x, y): self.x, self.y = x, y
    def __add__(self, o):            # overload +
        return Vec(self.x + o.x, self.y + o.y)`,
      js: { na: 'JavaScript does not allow operator overloading. Write a named method instead, for example v.add(o).' },
      java: { na: 'Java does not support operator overloading (apart from the built-in + on String). Use a named method like v.add(o).' },
      csharp: `struct Vec {
  public double X, Y;
  public static Vec operator +(Vec a, Vec b) => new() { X = a.X + b.X, Y = a.Y + b.Y };
}`,
    },
    intro: [
      { en: 'You define a function named <code>operator</code> followed by the symbol. It can be a <strong>member</strong> (the left operand is <code>this</code>) or a <strong>free function</strong> (often a <code>friend</code>), which you need when the left operand is not your type, for example <code>cout &lt;&lt; obj</code>, where the left side is a stream.',
        de: 'Du definierst eine Funktion <code>operator</code> gefolgt vom Symbol. Sie kann <strong>Member</strong> sein (der linke Operand ist <code>this</code>) oder <strong>freie Funktion</strong> (oft <code>friend</code>), noetig wenn der linke Operand nicht dein Typ ist, etwa <code>cout &lt;&lt; obj</code>, wo links ein Stream steht.' },
    ],
    how: [
      { en: '<strong>Arithmetic (<code>+</code>, <code>-</code>):</strong> usually free functions that return a new value by value, so <code>a + b</code> leaves its operands unchanged.',
        de: '<strong>Arithmetik (<code>+</code>, <code>-</code>):</strong> meist freie Funktionen, die einen neuen Wert per Wert zurueckgeben, sodass <code>a + b</code> die Operanden unveraendert laesst.' },
      { en: '<strong>Comparison (<code>==</code>, <code>&lt;</code>):</strong> return <code>bool</code>, and define them consistently so containers and sorting behave.',
        de: '<strong>Vergleich (<code>==</code>, <code>&lt;</code>):</strong> geben <code>bool</code> zurueck; definiere sie konsistent, damit Container und Sortierung funktionieren.' },
      { en: '<strong>Stream (<code>&lt;&lt;</code>):</strong> a free function <code>ostream&amp; operator&lt;&lt;(ostream&amp; os, const T&amp; x)</code> that returns the stream so calls chain.',
        de: '<strong>Stream (<code>&lt;&lt;</code>):</strong> eine freie Funktion <code>ostream&amp; operator&lt;&lt;(ostream&amp; os, const T&amp; x)</code>, die den Stream zurueckgibt, damit Aufrufe verkettet werden.' },
    ],
    pitfalls: [
      { en: 'Overload only where the meaning is obvious. A surprising <code>+</code> hurts readability more than a named method would.',
        de: 'Ueberlade nur, wo die Bedeutung offensichtlich ist. Ein ueberraschendes <code>+</code> schadet der Lesbarkeit mehr als eine benannte Methode.' },
      { en: 'Return arithmetic results by value and comparison results as <code>bool</code>; returning a reference to a local object is undefined behaviour.',
        de: 'Gib arithmetische Ergebnisse per Wert und Vergleiche als <code>bool</code> zurueck; eine Referenz auf ein lokales Objekt zurueckzugeben ist undefiniertes Verhalten.' },
    ],
  },

  'multiple-inheritance': {
    tldr: {
      en: 'A class can inherit from <strong>several</strong> base classes at once, combining their data and methods. It is powerful but introduces the <strong>diamond problem</strong>: when two bases share a common ancestor, the grandchild ends up with two copies of it. <strong>Virtual inheritance</strong> collapses them back to one.',
      de: 'Eine Klasse kann von <strong>mehreren</strong> Basisklassen zugleich erben und deren Daten und Methoden vereinen. Das ist maechtig, bringt aber das <strong>Diamantproblem</strong>: teilen sich zwei Basen einen gemeinsamen Vorfahren, erhaelt das Enkelkind zwei Kopien davon. <strong>Virtuelle Vererbung</strong> fuehrt sie wieder zu einer zusammen.',
    },
    code: {
      cpp: `struct A { void f(); };
struct B { void g(); };
struct C : public A, public B {};   // inherits both`,
      python: `class A: ...
class B: ...
class C(A, B):   # multiple inheritance; the MRO fixes the order
    pass`,
      js: { na: 'JavaScript has single-prototype inheritance only. Combine behaviour with mixins that copy methods onto the prototype.' },
      java: { na: 'Java allows only single class inheritance. A class implements several interfaces to combine multiple types.' },
      csharp: { na: 'C# allows only single class inheritance. Implement multiple interfaces to combine capabilities.' },
    },
    intro: [
      { en: 'With <code>class C : public A, public B</code>, C has everything from both A and B. If a name exists in both, you must qualify it (<code>A::f()</code>) to resolve the ambiguity.',
        de: 'Bei <code>class C : public A, public B</code> hat C alles aus A und B. Existiert ein Name in beiden, musst du ihn qualifizieren (<code>A::f()</code>), um die Mehrdeutigkeit aufzuloesen.' },
      { en: 'The diamond: A is a base of both B and C, and D inherits from B and C. Without care, D holds two A sub-objects. Declaring the inheritance <code>virtual</code> (<code>class B : virtual public A</code>) makes D share a single A.',
        de: 'Der Diamant: A ist Basis von B und C, und D erbt von B und C. Ohne Vorsicht haelt D zwei A-Teilobjekte. Deklarierst du die Vererbung <code>virtual</code> (<code>class B : virtual public A</code>), teilt sich D ein einziges A.' },
    ],
    how: [
      { en: '<strong>Name clashes:</strong> qualify with the base class name, or bring one name in with a <code>using</code> declaration.',
        de: '<strong>Namenskonflikte:</strong> mit dem Basisklassennamen qualifizieren oder einen Namen per <code>using</code>-Deklaration hereinholen.' },
      { en: '<strong>Virtual bases</strong> are constructed by the <strong>most-derived</strong> class, exactly once, before the non-virtual bases.',
        de: '<strong>Virtuelle Basen</strong> werden von der <strong>am staerksten abgeleiteten</strong> Klasse genau einmal und vor den nicht virtuellen Basen konstruiert.' },
    ],
    pitfalls: [
      { en: 'Multiple inheritance of concrete classes often signals a design that composition would model more cleanly. It is most defensible for combining <strong>interfaces</strong> (abstract classes with no data).',
        de: 'Mehrfachvererbung konkreter Klassen deutet oft auf einen Entwurf hin, den Komposition sauberer modelliert. Am ehesten vertretbar ist sie zum Kombinieren von <strong>Schnittstellen</strong> (abstrakte Klassen ohne Daten).' },
    ],
  },

  'move-semantics': {
    tldr: {
      en: 'C++11 added <strong>rvalue references</strong> (<code>T&amp;&amp;</code>) so an object can <strong>move</strong> resources out of a temporary instead of copying them: stealing a pointer is far cheaper than deep-copying an array. A <strong>move constructor</strong> and <strong>move assignment</strong> capture this, and <code>std::move</code> asks for it explicitly.',
      de: 'C++11 fuehrte <strong>Rvalue-Referenzen</strong> (<code>T&amp;&amp;</code>) ein, sodass ein Objekt Ressourcen aus einem temporaeren Objekt <strong>verschieben</strong> statt kopieren kann: einen Zeiger zu stehlen ist viel billiger als ein Feld tief zu kopieren. Ein <strong>Verschiebekonstruktor</strong> und eine <strong>Verschiebezuweisung</strong> fangen das ab, und <code>std::move</code> fordert es ausdruecklich an.',
    },
    code: {
      cpp: `class Buf {
  int* data;
public:
  Buf(Buf&& o) noexcept : data(o.data) { o.data = nullptr; }  // move constructor
};
Buf b = std::move(a);   // steal a's buffer instead of copying`,
      python: { na: 'Python has no move semantics; it is garbage-collected and passes object references, so there is nothing to move by hand.' },
      js: { na: 'JavaScript has no move semantics; objects are garbage-collected and handled through references.' },
      java: { na: 'Java has no move semantics; the garbage collector manages object memory.' },
      csharp: { na: 'C# has no move semantics for reference types (the GC manages them); value types are simply copied.' },
    },
    intro: [
      { en: 'An <strong>lvalue</strong> has a name and a lasting address; an <strong>rvalue</strong> is a temporary about to disappear. When the source is a disposable rvalue there is no reason to copy: the new object can take over its buffer and leave the empty husk to be destroyed.',
        de: 'Ein <strong>Lvalue</strong> hat einen Namen und eine dauerhafte Adresse; ein <strong>Rvalue</strong> ist ein temporaeres Objekt kurz vor dem Verschwinden. Ist die Quelle ein wegwerfbarer Rvalue, gibt es keinen Grund zu kopieren: das neue Objekt uebernimmt den Puffer und laesst die leere Huelle zerstoeren.' },
      { en: 'This is why passing and returning big containers by value became cheap in C++11: the compiler moves rather than copies. Related additions include <code>constexpr</code> (values computed at compile time) and brace initialisation.',
        de: 'Deshalb wurde das Uebergeben und Zurueckgeben grosser Container per Wert in C++11 billig: der Compiler verschiebt statt zu kopieren. Verwandte Neuerungen sind <code>constexpr</code> (zur Compilezeit berechnete Werte) und die Klammerinitialisierung.' },
    ],
    how: [
      { en: '<strong>Move constructor</strong> <code>T(T&amp;&amp; other)</code>: take <code>other</code>&#39;s resource pointers, then null them so its destructor does nothing.',
        de: '<strong>Verschiebekonstruktor</strong> <code>T(T&amp;&amp; other)</code>: uebernimm die Ressourcenzeiger von <code>other</code> und setze sie dann auf null, damit dessen Destruktor nichts tut.' },
      { en: '<strong>std::move(x)</strong> casts <code>x</code> to an rvalue reference, signalling that its contents may be taken. After a move, <code>x</code> is valid but unspecified, so do not rely on its value.',
        de: '<strong>std::move(x)</strong> wandelt <code>x</code> in eine Rvalue-Referenz um und signalisiert, dass sein Inhalt genommen werden darf. Nach einem Verschieben ist <code>x</code> gueltig, aber unbestimmt, verlasse dich also nicht auf seinen Wert.' },
    ],
    pitfalls: [
      { en: 'Do not <code>std::move</code> a value you still need; after the move it is emptied.',
        de: 'Verschiebe mit <code>std::move</code> keinen Wert, den du noch brauchst; nach dem Verschieben ist er geleert.' },
      { en: 'If you write a destructor or copy operations, the compiler will not generate move operations for you, so declare them yourself (the <strong>rule of five</strong>).',
        de: 'Schreibst du einen Destruktor oder Kopieroperationen, erzeugt der Compiler keine Verschiebeoperationen, also deklariere sie selbst (<strong>Fuenferregel</strong>).' },
    ],
  },
}

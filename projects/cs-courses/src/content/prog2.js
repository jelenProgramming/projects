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

  'header-source-split': {
    tldr: {
      en: 'A C++ program splits every class into a <strong>header</strong> (.h) with declarations and a <strong>source file</strong> (.cpp) with definitions. Headers say <em>what exists</em>, sources say <em>how it works</em>. Each .cpp compiles on its own, the linker joins the results, and <strong>include guards</strong> keep a header from being pasted twice.',
      de: 'Ein C++-Programm teilt jede Klasse in einen <strong>Header</strong> (.h) mit Deklarationen und eine <strong>Quelldatei</strong> (.cpp) mit Definitionen. Header sagen, <em>was existiert</em>, Quellen sagen, <em>wie es funktioniert</em>. Jede .cpp wird einzeln uebersetzt, der Linker fuegt die Ergebnisse zusammen, und <strong>Include-Guards</strong> verhindern doppeltes Einfuegen eines Headers.',
    },
    code: {
      cpp: `// date.h : the interface
#ifndef DATE_H
#define DATE_H
#include <string>

class Date {
  unsigned day, month, year;
public:
  static const unsigned MonthsPerYear;   // class-wide constant
  Date(unsigned d, unsigned m, unsigned y);
  std::string toString() const;
  static bool isLeapYear(unsigned y);
};
#endif

// date.cpp : the implementation
#include "date.h"
const unsigned Date::MonthsPerYear = 12;
Date::Date(unsigned d, unsigned m, unsigned y) : day(d), month(m), year(y) {}
bool Date::isLeapYear(unsigned y) { return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0; }`,
      python: `# one module per file; import gives you the same split for free
# date.py
class Date:
    MONTHS_PER_YEAR = 12          # class attribute
    def __init__(self, d, m, y):
        self.d, self.m, self.y = d, m, y
    @staticmethod
    def is_leap_year(y):
        return (y % 4 == 0 and y % 100 != 0) or y % 400 == 0`,
      js: `// ES modules split interface and use naturally
// date.js
export class Date2 {
  static MONTHS_PER_YEAR = 12
  constructor(d, m, y) { this.d = d; this.m = m; this.y = y }
  static isLeapYear(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 }
}`,
      java: `// one public class per file, the compiler enforces the split
public class Date {
  public static final int MONTHS_PER_YEAR = 12;
  private int d, m, y;
  Date(int d, int m, int y) { this.d = d; this.m = m; this.y = y; }
  static boolean isLeapYear(int y) { return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0; }
}`,
      csharp: `// namespaces and assemblies play the header role; no separate files needed
public class Date {
  public const int MonthsPerYear = 12;
  int d, m, y;
  public Date(int d, int m, int y) { this.d = d; this.m = m; this.y = y; }
  public static bool IsLeapYear(int y) => (y % 4 == 0 && y % 100 != 0) || y % 400 == 0;
}`,
    },
    intro: [
      { en: 'The compiler processes each .cpp file (a <strong>translation unit</strong>) independently. When unit A calls code from unit B, A only needs the declarations, exactly what the header provides via <code>#include</code>. The <strong>linker</strong> then matches every call to its one definition.',
        de: 'Der Compiler verarbeitet jede .cpp-Datei (eine <strong>Uebersetzungseinheit</strong>) unabhaengig. Ruft Einheit A Code aus Einheit B auf, braucht A nur die Deklarationen, genau das liefert der Header per <code>#include</code>. Der <strong>Linker</strong> verbindet dann jeden Aufruf mit seiner einen Definition.' },
      { en: '<strong>static</strong> members live on the class, not on any object: one shared copy. Declare them in the header, define them once in the .cpp (<code>const unsigned Date::MonthsPerYear = 12;</code>). Static member functions can run without an object, ideal for checks like <code>isLeapYear</code>.',
        de: '<strong>static</strong>-Member gehoeren zur Klasse, nicht zu einem Objekt: eine gemeinsame Kopie. Im Header deklarieren, in der .cpp genau einmal definieren (<code>const unsigned Date::MonthsPerYear = 12;</code>). Statische Memberfunktionen laufen ohne Objekt, ideal fuer Pruefungen wie <code>isLeapYear</code>.' },
    ],
    how: [
      { en: '<strong>Include guard:</strong> <code>#ifndef DATE_H / #define DATE_H / #endif</code> makes a second include of the same header expand to nothing, preventing duplicate definitions.',
        de: '<strong>Include-Guard:</strong> <code>#ifndef DATE_H / #define DATE_H / #endif</code> laesst ein zweites Einfuegen desselben Headers zu nichts expandieren und verhindert doppelte Definitionen.' },
      { en: '<strong>What goes where:</strong> class definition, constants, inline and template code in the header; every other member function body in the .cpp, prefixed with <code>ClassName::</code>.',
        de: '<strong>Was wohin gehoert:</strong> Klassendefinition, Konstanten, inline- und Template-Code in den Header; jeder andere Funktionsrumpf in die .cpp, mit <code>Klassenname::</code> davor.' },
      { en: '<strong>Build model:</strong> each .cpp becomes an object file; the linker merges them. Change a .cpp and only that unit recompiles; change a header and everything that includes it recompiles.',
        de: '<strong>Build-Modell:</strong> jede .cpp wird zu einer Objektdatei; der Linker fuehrt sie zusammen. Aendert sich eine .cpp, wird nur diese Einheit neu uebersetzt; aendert sich ein Header, alles, was ihn einbindet.' },
    ],
    pitfalls: [
      { en: 'Defining a non-inline function body in a header included by two .cpp files gives a <strong>duplicate symbol</strong> linker error: the definition now exists twice.',
        de: 'Ein nicht-inline Funktionsrumpf in einem Header, den zwei .cpp-Dateien einbinden, erzeugt einen <strong>duplicate symbol</strong>-Linkerfehler: die Definition existiert doppelt.' },
      { en: 'Forgetting the out-of-class definition of a static member compiles fine but fails at link time with <strong>undefined reference</strong>.',
        de: 'Die fehlende Definition eines static-Members ausserhalb der Klasse kompiliert, scheitert aber beim Linken mit <strong>undefined reference</strong>.' },
      { en: 'Putting <code>using namespace std;</code> in a header forces it on every file that includes it. Keep it out of headers.',
        de: '<code>using namespace std;</code> in einem Header zwingt es jeder einbindenden Datei auf. Gehoert nicht in Header.' },
    ],
  },

  'bit-manipulation': {
    tldr: {
      en: 'Integers are strings of bits, and the operators <code>&amp;</code> <code>|</code> <code>^</code> <code>~</code> <code>&lt;&lt;</code> <code>&gt;&gt;</code> work on them one bit at a time. With a <strong>mask</strong> you can read, set, clear or flip any single bit, which is how flags, permissions and compact sets are stored. A custom bit-array class overloads exactly these operators.',
      de: 'Ganzzahlen sind Bitfolgen, und die Operatoren <code>&amp;</code> <code>|</code> <code>^</code> <code>~</code> <code>&lt;&lt;</code> <code>&gt;&gt;</code> arbeiten bitweise. Mit einer <strong>Maske</strong> liest, setzt, loescht oder kippt man jedes einzelne Bit, so werden Flags, Rechte und kompakte Mengen gespeichert. Eine eigene Bit-Array-Klasse ueberlaedt genau diese Operatoren.',
    },
    code: {
      cpp: `unsigned x = 0b10110;
bool third   = (x >> 2) & 1u;   // read bit 2
x |=  (1u << 4);                // set bit 4
x &= ~(1u << 1);                // clear bit 1
x ^=  (1u << 0);                // flip bit 0

// a tiny bit-array type: bitwise ops made first-class
class BitArray {
  std::vector<unsigned char> bits;   // one bit per element
public:
  BitArray operator&(const BitArray& o) const;   // AND, same length
  BitArray operator|(const BitArray& o) const;
  BitArray operator^(const BitArray& o) const;
  BitArray operator~() const;                    // flip every bit
};`,
      python: `x = 0b10110
third = (x >> 2) & 1     # read bit 2
x |=  1 << 4             # set bit 4
x &= ~(1 << 1)           # clear bit 1
x ^=  1 << 0             # flip bit 0
# ints are arbitrary precision, ~ needs a width mask: (~x) & 0xFF`,
      js: `let x = 0b10110
const third = (x >> 2) & 1   // read bit 2
x |=  1 << 4                 // set bit 4
x &= ~(1 << 1)               // clear bit 1
x ^=  1 << 0                 // flip bit 0
// bitwise ops coerce to 32-bit signed integers`,
      java: `int x = 0b10110;
boolean third = ((x >> 2) & 1) == 1;  // read bit 2
x |=  1 << 4;                          // set bit 4
x &= ~(1 << 1);                        // clear bit 1
x ^=  1 << 0;                          // flip bit 0
// >>> is the unsigned right shift`,
      csharp: `int x = 0b10110;
bool third = ((x >> 2) & 1) == 1;  // read bit 2
x |=  1 << 4;                       // set bit 4
x &= ~(1 << 1);                     // clear bit 1
x ^=  1 << 0;                       // flip bit 0`,
    },
    intro: [
      { en: 'The four questions of bit work all reduce to a <strong>mask</strong>, a number with exactly the interesting bits set: read with <code>(x &gt;&gt; i) &amp; 1</code>, set with <code>x |= 1 &lt;&lt; i</code>, clear with <code>x &amp;= ~(1 &lt;&lt; i)</code>, flip with <code>x ^= 1 &lt;&lt; i</code>.',
        de: 'Die vier Fragen der Bitarbeit laufen alle auf eine <strong>Maske</strong> hinaus, eine Zahl mit genau den interessanten Bits: lesen mit <code>(x &gt;&gt; i) &amp; 1</code>, setzen mit <code>x |= 1 &lt;&lt; i</code>, loeschen mit <code>x &amp;= ~(1 &lt;&lt; i)</code>, kippen mit <code>x ^= 1 &lt;&lt; i</code>.',
      },
      { en: 'Shifting left by $k$ multiplies by $2^k$; shifting right divides by $2^k$ (rounded toward zero for unsigned values). That is why <code>1 &lt;&lt; i</code> is the mask for bit $i$.',
        de: 'Links-Shift um $k$ multipliziert mit $2^k$; Rechts-Shift dividiert durch $2^k$ (bei vorzeichenlosen Werten Richtung Null gerundet). Darum ist <code>1 &lt;&lt; i</code> die Maske fuer Bit $i$.' },
      { en: 'A <strong>bit array</strong> stores a set of booleans one bit each, eight times denser than <code>bool[]</code>. Overloading <code>&amp; | ^ ~</code> for such a class makes set intersection, union and complement read like arithmetic.',
        de: 'Ein <strong>Bit-Array</strong> speichert Wahrheitswerte mit je einem Bit, achtmal dichter als <code>bool[]</code>. Ueberlaedt man <code>&amp; | ^ ~</code> fuer so eine Klasse, lesen sich Schnitt, Vereinigung und Komplement wie Arithmetik.' },
    ],
    how: [
      { en: '<strong>XOR tricks:</strong> <code>x ^ x = 0</code> and <code>x ^ 0 = x</code>, so XOR-ing a list finds the one element that appears an odd number of times.',
        de: '<strong>XOR-Tricks:</strong> <code>x ^ x = 0</code> und <code>x ^ 0 = x</code>, darum findet XOR ueber eine Liste das Element mit ungerader Haeufigkeit.' },
      { en: '<strong>Lowest set bit:</strong> <code>x &amp; -x</code> isolates it; <code>x &amp; (x - 1)</code> removes it, which counts set bits in as many steps as there are ones.',
        de: '<strong>Niedrigstes gesetztes Bit:</strong> <code>x &amp; -x</code> isoliert es; <code>x &amp; (x - 1)</code> entfernt es, so zaehlt man Einsen in so vielen Schritten, wie es Einsen gibt.' },
      { en: '<strong>Even or odd:</strong> <code>x &amp; 1</code> is the last bit, no division needed.',
        de: '<strong>Gerade oder ungerade:</strong> <code>x &amp; 1</code> ist das letzte Bit, keine Division noetig.' },
    ],
    pitfalls: [
      { en: 'Right-shifting a negative <em>signed</em> value is implementation-defined territory in older C++, and sign extension surprises: prefer unsigned types for bit work.',
        de: 'Rechts-Shift eines negativen <em>signed</em>-Werts ist in aelterem C++ heikel, und Vorzeichenerweiterung ueberrascht: fuer Bitarbeit besser vorzeichenlose Typen.' },
      { en: 'Shifting by the full width or more (<code>1 &lt;&lt; 32</code> on a 32-bit int) is undefined behaviour, not zero.',
        de: 'Ein Shift um die volle Breite oder mehr (<code>1 &lt;&lt; 32</code> bei 32 Bit) ist undefiniertes Verhalten, nicht Null.' },
      { en: 'Two bit arrays of different lengths have no natural AND: pad the shorter one to the longer length first, then combine.',
        de: 'Zwei Bit-Arrays verschiedener Laenge haben kein natuerliches AND: das kuerzere erst auf die gemeinsame Laenge auffuellen, dann verknuepfen.' },
    ],
  },
}

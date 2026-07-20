// Web Foundations: CSS, JavaScript, async, security, frameworks.
// Original explanations matched to the curriculum topics, not copied from any slides.
export const webContent = {
  'css': {
    tldr: {
      en: '<strong>CSS</strong> controls how HTML looks. Its core ideas are the <strong>cascade</strong> (which rule wins), the <strong>box model</strong> (every element is a box of content, padding, border and margin), and modern layout with <strong>Flexbox</strong> and <strong>Grid</strong>. It keeps presentation separate from structure.',
      de: '<strong>CSS</strong> steuert das Aussehen von HTML. Kernideen sind die <strong>Kaskade</strong> (welche Regel gewinnt), das <strong>Boxmodell</strong> (jedes Element ist eine Box aus Inhalt, Innenabstand, Rahmen und Aussenabstand) und modernes Layout mit <strong>Flexbox</strong> und <strong>Grid</strong>. Darstellung bleibt von Struktur getrennt.',
    },
    intro: [
      { en: 'When two rules target the same element, the <strong>cascade</strong> decides the winner by <strong>specificity</strong> (an id beats a class beats an element), then by source order. Some properties (like <code>color</code> and <code>font</code>) also <strong>inherit</strong> from parent to child.',
        de: 'Zielen zwei Regeln auf dasselbe Element, entscheidet die <strong>Kaskade</strong> nach <strong>Spezifität</strong> (id schlägt Klasse schlägt Element), dann nach Reihenfolge. Manche Eigenschaften (wie <code>color</code>, <code>font</code>) <strong>vererben</strong> sich zudem vom Eltern- zum Kindelement.' },
      { en: 'Every element is a rectangular box: <strong>content</strong> at the centre, then <strong>padding</strong>, then a <strong>border</strong>, then <strong>margin</strong> outside. <code>box-sizing: border-box</code> makes width include padding and border, which is far easier to reason about.',
        de: 'Jedes Element ist ein Rechteck: <strong>Inhalt</strong> in der Mitte, dann <strong>Innenabstand</strong>, dann <strong>Rahmen</strong>, dann <strong>Aussenabstand</strong>. <code>box-sizing: border-box</code> lässt die Breite Innenabstand und Rahmen einschliessen, was das Rechnen stark vereinfacht.' },
    ],
    how: [
      { en: '<strong>Selectors:</strong> target by element (<code>p</code>), class (<code>.card</code>), id (<code>#nav</code>), or combinators (<code>.card &gt; h2</code>).',
        de: '<strong>Selektoren:</strong> nach Element (<code>p</code>), Klasse (<code>.card</code>), id (<code>#nav</code>) oder Kombinatoren (<code>.card &gt; h2</code>).' },
      { en: '<strong>Flexbox</strong> lays out items in one dimension (a row or a column) and is ideal for toolbars and centring.',
        de: '<strong>Flexbox</strong> ordnet Elemente in einer Dimension (Zeile oder Spalte) an, ideal für Leisten und Zentrieren.' },
      { en: '<strong>Grid</strong> lays out in two dimensions (rows and columns at once), ideal for page and card layouts. <strong>Media queries</strong> adapt the design to screen width.',
        de: '<strong>Grid</strong> ordnet in zwei Dimensionen an (Zeilen und Spalten zugleich), ideal für Seiten- und Kartenlayouts. <strong>Media Queries</strong> passen das Design an die Bildschirmbreite an.' },
    ],
    pitfalls: [
      { en: 'Fighting specificity with ever-more-specific selectors (or <code>!important</code>) makes stylesheets unmaintainable. Keep selectors flat and lean on classes.',
        de: 'Spezifität mit immer spezifischeren Selektoren (oder <code>!important</code>) zu bekämpfen macht Stylesheets unwartbar. Halte Selektoren flach und setze auf Klassen.' },
    ],
  },

  'javascript': {
    tldr: {
      en: '<strong>JavaScript</strong> is the language that runs in the browser. It is dynamically typed. <strong>Objects</strong> group data and behaviour as key-value pairs; <strong>prototypes</strong> power inheritance; and ES6 <strong>classes</strong> are syntactic sugar over those prototypes.',
      de: '<strong>JavaScript</strong> ist die Sprache im Browser. Sie ist dynamisch typisiert. <strong>Objekte</strong> gruppieren Daten und Verhalten als Schlüssel-Wert-Paare; <strong>Prototypen</strong> ermöglichen Vererbung; und ES6-<strong>Klassen</strong> sind syntaktischer Zucker über diesen Prototypen.',
    },
    intro: [
      { en: 'An object is a bag of properties: <code>{ name: "Ann", greet() { ... } }</code>. Every object links to a <strong>prototype</strong>, and when a property is missing JavaScript walks up that prototype chain to find it. This is how shared methods are stored once and reused by many objects.',
        de: 'Ein Objekt ist eine Sammlung von Eigenschaften: <code>{ name: "Ann", greet() { ... } }</code>. Jedes Objekt verweist auf einen <strong>Prototyp</strong>, und fehlt eine Eigenschaft, geht JavaScript die Prototypkette hinauf, um sie zu finden. So werden geteilte Methoden einmal gespeichert und von vielen Objekten genutzt.' },
      { en: 'The <code>class</code> keyword gives a cleaner way to build objects with shared methods and <code>extends</code> for inheritance, but under the hood it still uses prototypes.',
        de: 'Das Schlüsselwort <code>class</code> bietet eine sauberere Art, Objekte mit geteilten Methoden und <code>extends</code> für Vererbung zu bauen, verwendet intern aber weiterhin Prototypen.' },
    ],
    how: [
      { en: '<strong>Objects and methods:</strong> access with dot or bracket notation; a method is just a function stored in a property.',
        de: '<strong>Objekte und Methoden:</strong> Zugriff per Punkt- oder Klammernotation; eine Methode ist nur eine in einer Eigenschaft gespeicherte Funktion.' },
      { en: '<strong>Prototype chain:</strong> lookups climb from object to prototype to prototype until found or the chain ends at <code>null</code>.',
        de: '<strong>Prototypkette:</strong> Suchen steigen vom Objekt zum Prototyp zum Prototyp, bis gefunden oder die Kette bei <code>null</code> endet.' },
      { en: '<strong>class / extends:</strong> declare fields and methods once; a subclass reuses and overrides them.',
        de: '<strong>class / extends:</strong> Felder und Methoden einmal deklarieren; eine Unterklasse nutzt und überschreibt sie.' },
    ],
    pitfalls: [
      { en: 'Use <code>===</code> (strict equality), not <code>==</code>, which coerces types and gives surprises like <code>0 == ""</code> being true.',
        de: 'Nutze <code>===</code> (strenge Gleichheit), nicht <code>==</code>, das Typen umwandelt und Überraschungen wie <code>0 == ""</code> gleich wahr liefert.' },
      { en: 'The value of <code>this</code> depends on how a function is called, not where it is defined. Arrow functions capture the surrounding <code>this</code>.',
        de: 'Der Wert von <code>this</code> hängt davon ab, wie eine Funktion aufgerufen wird, nicht wo sie definiert ist. Pfeilfunktionen übernehmen das umgebende <code>this</code>.' },
    ],
  },

  'async-js': {
    tldr: {
      en: 'JavaScript runs on a <strong>single thread</strong>, so slow work (network, timers) must not block it. The <strong>event loop</strong> runs queued callbacks when the stack is free. The tools evolved from <strong>callbacks</strong> to <strong>Promises</strong> to <strong>async/await</strong>.',
      de: 'JavaScript läuft in einem <strong>einzigen Thread</strong>, langsame Arbeit (Netz, Timer) darf ihn also nicht blockieren. Die <strong>Ereignisschleife</strong> führt eingereihte Rückrufe aus, sobald der Stapel frei ist. Die Werkzeuge entwickelten sich von <strong>Callbacks</strong> über <strong>Promises</strong> zu <strong>async/await</strong>.',
    },
    intro: [
      { en: 'A <strong>callback</strong> is a function you hand to an async operation to run when it finishes. Nesting many of them produces unreadable "callback hell".',
        de: 'Ein <strong>Callback</strong> ist eine Funktion, die du einer asynchronen Operation gibst, damit sie nach dem Ende läuft. Viele davon zu verschachteln erzeugt die unlesbare Callback-Hölle.' },
      { en: 'A <strong>Promise</strong> is an object representing a future value, in one of three states: <strong>pending</strong>, <strong>fulfilled</strong>, or <strong>rejected</strong>. You chain with <code>.then()</code>/<code>.catch()</code>, or write it linearly with <code>async</code>/<code>await</code>.',
        de: 'Ein <strong>Promise</strong> ist ein Objekt für einen zukünftigen Wert in einem von drei Zuständen: <strong>ausstehend</strong>, <strong>erfüllt</strong> oder <strong>abgelehnt</strong>. Du verkettest mit <code>.then()</code>/<code>.catch()</code> oder schreibst es linear mit <code>async</code>/<code>await</code>.' },
    ],
    how: [
      { en: '<strong>async</strong> marks a function that returns a Promise; <strong>await</strong> pauses inside it until a Promise settles, without blocking the whole page.',
        de: '<strong>async</strong> markiert eine Funktion, die ein Promise zurückgibt; <strong>await</strong> pausiert darin, bis ein Promise sich klärt, ohne die ganze Seite zu blockieren.' },
      { en: 'Wrap <code>await</code> in <code>try/catch</code> to handle a rejected Promise as an ordinary error.',
        de: 'Umschliesse <code>await</code> mit <code>try/catch</code>, um ein abgelehntes Promise wie einen normalen Fehler zu behandeln.' },
    ],
    pitfalls: [
      { en: 'Forgetting to <code>await</code> (or return) a Promise means the code moves on before the work is done, a very common bug.',
        de: 'Ein vergessenes <code>await</code> (oder return) bedeutet, dass der Code weiterläuft, bevor die Arbeit fertig ist, ein sehr häufiger Fehler.' },
    ],
  },

  'web-security': {
    tldr: {
      en: 'The web attacks every developer must defend against: <strong>XSS</strong> (inject a script into a page), <strong>SQL injection</strong> (inject SQL into a query), and <strong>CSRF</strong> (trick a logged-in user into a forged request). The golden rule: <strong>never trust client input</strong>.',
      de: 'Die Web-Angriffe, gegen die jeder Entwickler schützen muss: <strong>XSS</strong> (Skript in eine Seite einschleusen), <strong>SQL-Injection</strong> (SQL in eine Abfrage einschleusen) und <strong>CSRF</strong> (einen angemeldeten Nutzer zu einer gefälschten Anfrage verleiten). Die goldene Regel: <strong>traue nie der Client-Eingabe</strong>.',
    },
    intro: [
      { en: '<strong>XSS (Cross-Site Scripting):</strong> if user text is put into the page without escaping, an attacker can inject <code>&lt;script&gt;</code> that runs in other visitors&#39; browsers and steals their session.',
        de: '<strong>XSS (Cross-Site-Scripting):</strong> wird Nutzertext ungeschützt in die Seite gesetzt, kann ein Angreifer <code>&lt;script&gt;</code> einschleusen, das in den Browsern anderer läuft und ihre Sitzung stiehlt.' },
      { en: '<strong>SQL injection:</strong> building a query by string-concatenating user input lets an attacker change its meaning (the classic <code>&#39; OR 1=1 --</code>).',
        de: '<strong>SQL-Injection:</strong> eine Abfrage per String-Verkettung aus Nutzereingabe zu bauen lässt einen Angreifer ihre Bedeutung ändern (der Klassiker <code>&#39; OR 1=1 --</code>).' },
    ],
    how: [
      { en: '<strong>Stop XSS:</strong> escape all user content on output, and set a Content-Security-Policy.',
        de: '<strong>XSS stoppen:</strong> alle Nutzerinhalte bei der Ausgabe escapen und eine Content-Security-Policy setzen.' },
      { en: '<strong>Stop SQL injection:</strong> use <strong>parameterised queries</strong> (prepared statements), never string concatenation.',
        de: '<strong>SQL-Injection stoppen:</strong> <strong>parametrisierte Abfragen</strong> (Prepared Statements) nutzen, nie String-Verkettung.' },
      { en: '<strong>Stop CSRF:</strong> require a per-form <strong>CSRF token</strong> and use <code>SameSite</code> cookies so other sites cannot ride your session.',
        de: '<strong>CSRF stoppen:</strong> ein <strong>CSRF-Token</strong> pro Formular verlangen und <code>SameSite</code>-Cookies nutzen, damit fremde Seiten deine Sitzung nicht mitreiten.' },
    ],
    pitfalls: [
      { en: 'Validating input only in the browser is no protection: the server must re-check everything, because an attacker bypasses the page entirely.',
        de: 'Eingaben nur im Browser zu prüfen schützt nicht: der Server muss alles erneut prüfen, denn ein Angreifer umgeht die Seite ganz.' },
    ],
  },

  'web-frameworks': {
    tldr: {
      en: 'A <strong>web framework</strong> gives a project structure and reusable building blocks so you build faster and more securely than from scratch. <strong>Server-side</strong> frameworks (Laravel, Django) render pages and expose APIs; <strong>client-side</strong> ones (React, Vue) build interactive single-page apps in the browser.',
      de: 'Ein <strong>Web-Framework</strong> gibt einem Projekt Struktur und wiederverwendbare Bausteine, sodass du schneller und sicherer baust als von Grund auf. <strong>Serverseitige</strong> Frameworks (Laravel, Django) rendern Seiten und stellen APIs bereit; <strong>clientseitige</strong> (React, Vü) bauen interaktive Single-Page-Apps im Browser.',
    },
    intro: [
      { en: 'Server-side frameworks usually follow <strong>MVC</strong>: the <strong>model</strong> holds data, the <strong>view</strong> renders it, the <strong>controller</strong> handles requests. They bundle routing, database access, templating, sessions and security defaults.',
        de: 'Serverseitige Frameworks folgen meist <strong>MVC</strong>: das <strong>Modell</strong> hält Daten, die <strong>Ansicht</strong> stellt sie dar, der <strong>Controller</strong> bearbeitet Anfragen. Sie bündeln Routing, Datenbankzugriff, Templates, Sitzungen und Sicherheitsvorgaben.' },
      { en: 'Client-side frameworks keep a component tree and re-render only what changed, giving app-like interactivity. Many apps combine both: an API on the server, a single-page app on the client.',
        de: 'Clientseitige Frameworks halten einen Komponentenbaum und rendern nur das Geänderte neu, was app-artige Interaktivität gibt. Viele Apps verbinden beides: eine API auf dem Server, eine Single-Page-App auf dem Client.' },
    ],
    how: [
      { en: '<strong>Routing</strong> maps a URL to code; <strong>templating</strong> or components produce the HTML; an <strong>ORM</strong> maps objects to database rows.',
        de: '<strong>Routing</strong> bildet eine URL auf Code ab; <strong>Templates</strong> oder Komponenten erzeugen das HTML; ein <strong>ORM</strong> bildet Objekte auf Datenbankzeilen ab.' },
    ],
    pitfalls: [
      { en: 'A framework saves time but adds a learning curve and lock-in; for a tiny static page, plain HTML/CSS/JS is often the better choice.',
        de: 'Ein Framework spart Zeit, bringt aber Lernkurve und Bindung; für eine winzige statische Seite ist schlichtes HTML/CSS/JS oft die bessere Wahl.' },
    ],
  },
}

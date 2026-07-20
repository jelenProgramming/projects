import { createContext, useContext, useState, useEffect, useCallback } from 'react'

/**
 * Tiny i18n layer. Two ways to translate:
 *
 *  1. t(obj)  - obj is a { en, de } pair (used for dynamic content like step
 *     messages and taglines that carry interpolated values). Returns the string
 *     for the active language. Plain strings pass through unchanged (English).
 *
 *  2. tk(key) - looks up a key in the UI dictionary below.
 *
 * Language is persisted to localStorage. Code is always English and never goes
 * through this layer.
 */

const LangContext = createContext({ lang: 'en', setLang: () => {}, t: (x) => x, tk: (k) => k })

// UI dictionary - everything chrome-level (buttons, labels, headings).
const DICT = {
  // transport / controls
  play: { en: 'Play', de: 'Abspielen', sl: 'Predvajaj' },
  pause: { en: 'Pause', de: 'Pause', sl: 'Premor' },
  replay: { en: 'Replay', de: 'Wiederholen', sl: 'Ponovi' },
  reset: { en: 'Reset', de: 'Zurücksetzen', sl: 'Ponastavi' },
  speed: { en: 'Speed', de: 'Tempo', sl: 'Hitrost' },
  stepBack: { en: 'Step back', de: 'Schritt zurück', sl: 'Korak nazaj' },
  stepForward: { en: 'Step forward', de: 'Schritt vor', sl: 'Korak naprej' },

  // common section headings
  howItWorks: { en: 'How it works', de: 'So funktioniert es', sl: 'Kako deluje' },
  workedExample: { en: 'Worked example', de: 'Durchgerechnetes Beispiel', sl: 'Rešen primer' },
  pseudocode: { en: 'Pseudocode', de: 'Pseudocode', sl: 'Psevdokoda' },
  inCpp: { en: 'In C++', de: 'In C++', sl: 'V jeziku C++' },
  complexity: { en: 'Complexity', de: 'Komplexität', sl: 'Zahtevnost' },
  examTraps: { en: 'Exam traps', de: 'Prüfungsfallen', sl: 'Izpitne pasti' },
  controls: { en: 'Controls', de: 'Steuerung', sl: 'Upravljanje' },
  input: { en: 'Input', de: 'Eingabe', sl: 'Vhod' },

  // complexity table headers
  case: { en: 'Case', de: 'Fall', sl: 'Primer' },
  time: { en: 'Time', de: 'Zeit', sl: 'Čas' },
  space: { en: 'Space', de: 'Speicher', sl: 'Prostor' },
  best: { en: 'Best', de: 'Bester', sl: 'Najboljši' },
  average: { en: 'Average', de: 'Durchschnitt', sl: 'Povprečni' },
  worst: { en: 'Worst', de: 'Schlechtester', sl: 'Najslabši' },

  // sorting
  generate: { en: 'Generate', de: 'Erzeugen', sl: 'Ustvari' },
  shuffle: { en: 'Shuffle', de: 'Mischen', sl: 'Premešaj' },
  size: { en: 'Size', de: 'Größe', sl: 'Velikost' },
  customArray: { en: 'Custom array (comma-separated)', de: 'Eigenes Array (kommagetrennt)', sl: 'Lastno polje (ločeno z vejicami)' },
  apply: { en: 'Apply', de: 'Anwenden', sl: 'Uporabi' },
  nearlySorted: { en: 'Nearly sorted', de: 'Fast sortiert', sl: 'Skoraj urejeno' },
  reversed: { en: 'Reversed', de: 'Umgekehrt', sl: 'Obrnjeno' },
  random: { en: 'Random', de: 'Zufällig', sl: 'Naključno' },

  // legends
  comparing: { en: 'Comparing', de: 'Vergleichen', sl: 'Primerjanje' },
  swapping: { en: 'Swapping', de: 'Tauschen', sl: 'Zamenjava' },
  sorted: { en: 'Sorted', de: 'Sortiert', sl: 'Urejeno' },
  pivot: { en: 'Pivot', de: 'Pivot', sl: 'Pivot' },
  activeRange: { en: 'Active range', de: 'Aktiver Bereich', sl: 'Aktivno območje' },

  // graph / pathfinding
  visited: { en: 'Visited', de: 'Besucht', sl: 'Obiskano' },
  frontier: { en: 'Frontier', de: 'Rand', sl: 'Fronta' },
  path: { en: 'Path', de: 'Pfad', sl: 'Pot' },
  wall: { en: 'Wall', de: 'Wand', sl: 'Zid' },
  start: { en: 'Start', de: 'Start', sl: 'Začetek' },
  target: { en: 'Target', de: 'Ziel', sl: 'Cilj' },
  clearWalls: { en: 'Clear walls', de: 'Wände löschen', sl: 'Počisti zidove' },
  randomMaze: { en: 'Random maze', de: 'Zufälliges Labyrinth', sl: 'Naključni labirint' },
  drawHint: { en: 'Click and drag on the grid to draw or erase walls.', de: 'Klicke und ziehe im Raster, um Wände zu zeichnen oder zu löschen.', sl: 'Kliknite in povlecite po mreži, da narišete ali zbrišete zidove.' },
  distanceArray: { en: 'Distance array  dist[]', de: 'Distanz-Array  dist[]', sl: 'Polje razdalj  dist[]' },
  predecessorArray: { en: 'Predecessor array  pred[]', de: 'Vorgänger-Array  pred[]', sl: 'Polje predhodnikov  pred[]' },
  weightMatrix: { en: 'Weight matrix  C[u][v]', de: 'Gewichtsmatrix  C[u][v]', sl: 'Matrika uteži  C[u][v]' },
  distMatrix: { en: 'Distance matrix  D', de: 'Distanzmatrix  D', sl: 'Matrika razdalj  D' },
  predMatrix: { en: 'Predecessor matrix  P', de: 'Vorgängermatrix  P', sl: 'Matrika predhodnikov  P' },
  newGraph: { en: 'New graph', de: 'Neuer Graph', sl: 'Nov graf' },

  // strings
  text: { en: 'Text', de: 'Text', sl: 'Besedilo' },
  pattern: { en: 'Pattern', de: 'Muster', sl: 'Vzorec' },
  run: { en: 'Run', de: 'Ausführen', sl: 'Zaženi' },
  comparisons: { en: 'Comparisons', de: 'Vergleiche', sl: 'Primerjave' },
  matchFound: { en: 'Match found at index', de: 'Treffer gefunden an Index', sl: 'Ujemanje najdeno na indeksu' },

  // misc
  notImplemented: { en: 'This module has not been implemented yet.', de: 'Dieses Modul ist noch nicht umgesetzt.', sl: 'Ta modul še ni implementiran.' },
  loading: { en: 'Loading...', de: 'Lädt...', sl: 'Nalaganje...' },
  searchAlgos: { en: 'Search topics...', de: 'Themen suchen...', sl: 'Iskanje tem...' },
  noResults: { en: 'No matches', de: 'Keine Treffer', sl: 'Ni zadetkov' },
  interactive: { en: 'interactive', de: 'interaktiv', sl: 'interaktivno' },
  algorithms: { en: 'algorithms', de: 'Algorithmen', sl: 'algoritmov' },
  categories: { en: 'categories', de: 'Kategorien', sl: 'kategorij' },
  viz: { en: 'Visualize', de: 'Visualisierung', sl: 'Vizualiziraj' },
  read: { en: 'Read', de: 'Lesen', sl: 'Preberi' },
  encode: { en: 'Encode', de: 'Kodieren', sl: 'Kodiraj' },
  decode: { en: 'Decode', de: 'Dekodieren', sl: 'Dekodiraj' },
  key: { en: 'Key', de: 'Schlüssel', sl: 'Ključ' },
  shift: { en: 'Shift', de: 'Verschiebung', sl: 'Zamik' },
  result: { en: 'Result', de: 'Ergebnis', sl: 'Rezultat' },
  sourcesLink: { en: '📚 Sources & References', de: '📚 Quellen & Referenzen', sl: '📚 Viri in reference' },
  infoLink: { en: 'ℹ Info & Sources', de: 'ℹ Info & Quellen', sl: 'ℹ Informacije in viri' },
  prevChapter: { en: 'Previous', de: 'Zurück', sl: 'Nazaj' },
  nextChapter: { en: 'Next', de: 'Weiter', sl: 'Naprej' },
  editGraph: { en: 'Edit graph', de: 'Graph bearbeiten', sl: 'Uredi graf' },
  runAlgo: { en: 'Run', de: 'Ausfuehren', sl: 'Zaženi' },
  addNode: { en: 'Add node', de: 'Knoten hinzufuegen', sl: 'Dodaj vozlišče' },
  addEdge: { en: 'Add edge', de: 'Kante hinzufuegen', sl: 'Dodaj povezavo' },
  deleteMode: { en: 'Delete', de: 'Loeschen', sl: 'Izbriši' },
  moveMode: { en: 'Move', de: 'Verschieben', sl: 'Premakni' },
  resetGraph: { en: 'Reset graph', de: 'Graph zuruecksetzen', sl: 'Ponastavi graf' },
  editHint: { en: 'Move: drag nodes. Add edge: click two nodes. Delete: click a node or edge. Double-click empty space to add a node.', de: 'Verschieben: Knoten ziehen. Kante: zwei Knoten klicken. Loeschen: Knoten oder Kante klicken. Doppelklick auf leere Flaeche fuer neuen Knoten.', sl: 'Premikanje: povlecite vozlišča. Povezava: kliknite dve vozlišči. Brisanje: kliknite vozlišče ali povezavo. Dvakrat kliknite prazno površino za novo vozlišče.' },
  weightPrompt: { en: 'Edge weight:', de: 'Kantengewicht:', sl: 'Utež povezave:' },
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => (typeof localStorage !== 'undefined' && localStorage.getItem('algoviz-lang')) || 'en')

  useEffect(() => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('algoviz-lang', lang)
    if (typeof document !== 'undefined') document.documentElement.setAttribute('lang', lang)
  }, [lang])

  const t = useCallback((x) => {
    if (x == null) return ''
    if (typeof x === 'string') return x
    return x[lang] ?? x.en ?? ''
  }, [lang])

  const tk = useCallback((key) => {
    const entry = DICT[key]
    if (!entry) return key
    return entry[lang] ?? entry.en ?? key
  }, [lang])

  const setLang = useCallback((l) => setLangState(l), [])

  return (
    <LangContext.Provider value={{ lang, setLang, t, tk }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

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
  play: { en: 'Play', de: 'Abspielen' },
  pause: { en: 'Pause', de: 'Pause' },
  replay: { en: 'Replay', de: 'Wiederholen' },
  reset: { en: 'Reset', de: 'Zurücksetzen' },
  speed: { en: 'Speed', de: 'Tempo' },
  stepBack: { en: 'Step back', de: 'Schritt zurück' },
  stepForward: { en: 'Step forward', de: 'Schritt vor' },

  // common section headings
  howItWorks: { en: 'How it works', de: 'So funktioniert es' },
  workedExample: { en: 'Worked example', de: 'Durchgerechnetes Beispiel' },
  pseudocode: { en: 'Pseudocode', de: 'Pseudocode' },
  inCpp: { en: 'In C++', de: 'In C++' },
  complexity: { en: 'Complexity', de: 'Komplexität' },
  examTraps: { en: 'Exam traps', de: 'Prüfungsfallen' },
  controls: { en: 'Controls', de: 'Steuerung' },
  input: { en: 'Input', de: 'Eingabe' },

  // complexity table headers
  case: { en: 'Case', de: 'Fall' },
  time: { en: 'Time', de: 'Zeit' },
  space: { en: 'Space', de: 'Speicher' },
  best: { en: 'Best', de: 'Bester' },
  average: { en: 'Average', de: 'Durchschnitt' },
  worst: { en: 'Worst', de: 'Schlechtester' },

  // sorting
  generate: { en: 'Generate', de: 'Erzeugen' },
  shuffle: { en: 'Shuffle', de: 'Mischen' },
  size: { en: 'Size', de: 'Größe' },
  customArray: { en: 'Custom array (comma-separated)', de: 'Eigenes Array (kommagetrennt)' },
  apply: { en: 'Apply', de: 'Anwenden' },
  nearlySorted: { en: 'Nearly sorted', de: 'Fast sortiert' },
  reversed: { en: 'Reversed', de: 'Umgekehrt' },
  random: { en: 'Random', de: 'Zufällig' },

  // legends
  comparing: { en: 'Comparing', de: 'Vergleichen' },
  swapping: { en: 'Swapping', de: 'Tauschen' },
  sorted: { en: 'Sorted', de: 'Sortiert' },
  pivot: { en: 'Pivot', de: 'Pivot' },
  activeRange: { en: 'Active range', de: 'Aktiver Bereich' },

  // graph / pathfinding
  visited: { en: 'Visited', de: 'Besucht' },
  frontier: { en: 'Frontier', de: 'Rand' },
  path: { en: 'Path', de: 'Pfad' },
  wall: { en: 'Wall', de: 'Wand' },
  start: { en: 'Start', de: 'Start' },
  target: { en: 'Target', de: 'Ziel' },
  clearWalls: { en: 'Clear walls', de: 'Wände löschen' },
  randomMaze: { en: 'Random maze', de: 'Zufälliges Labyrinth' },
  drawHint: { en: 'Click and drag on the grid to draw or erase walls.', de: 'Klicke und ziehe im Raster, um Wände zu zeichnen oder zu löschen.' },
  distanceArray: { en: 'Distance array  dist[]', de: 'Distanz-Array  dist[]' },
  predecessorArray: { en: 'Predecessor array  pred[]', de: 'Vorgänger-Array  pred[]' },
  weightMatrix: { en: 'Weight matrix  C[u][v]', de: 'Gewichtsmatrix  C[u][v]' },
  distMatrix: { en: 'Distance matrix  D', de: 'Distanzmatrix  D' },
  predMatrix: { en: 'Predecessor matrix  P', de: 'Vorgängermatrix  P' },
  newGraph: { en: 'New graph', de: 'Neuer Graph' },

  // strings
  text: { en: 'Text', de: 'Text' },
  pattern: { en: 'Pattern', de: 'Muster' },
  run: { en: 'Run', de: 'Ausführen' },
  comparisons: { en: 'Comparisons', de: 'Vergleiche' },
  matchFound: { en: 'Match found at index', de: 'Treffer gefunden an Index' },

  // misc
  notImplemented: { en: 'This module has not been implemented yet.', de: 'Dieses Modul ist noch nicht umgesetzt.' },
  loading: { en: 'Loading...', de: 'Lädt...' },
  searchAlgos: { en: 'Search topics...', de: 'Themen suchen...' },
  noResults: { en: 'No matches', de: 'Keine Treffer' },
  interactive: { en: 'interactive', de: 'interaktiv' },
  algorithms: { en: 'algorithms', de: 'Algorithmen' },
  categories: { en: 'categories', de: 'Kategorien' },
  viz: { en: 'Visualize', de: 'Visualisierung' },
  read: { en: 'Read', de: 'Lesen' },
  encode: { en: 'Encode', de: 'Kodieren' },
  decode: { en: 'Decode', de: 'Dekodieren' },
  key: { en: 'Key', de: 'Schlüssel' },
  shift: { en: 'Shift', de: 'Verschiebung' },
  result: { en: 'Result', de: 'Ergebnis' },
  sourcesLink: { en: '📚 Sources & References', de: '📚 Quellen & Referenzen' },
  infoLink: { en: 'ℹ Info & Sources', de: 'ℹ Info & Quellen' },
  prevChapter: { en: 'Previous', de: 'Zurück' },
  nextChapter: { en: 'Next', de: 'Weiter' },
  editGraph: { en: 'Edit graph', de: 'Graph bearbeiten' },
  runAlgo: { en: 'Run', de: 'Ausfuehren' },
  addNode: { en: 'Add node', de: 'Knoten hinzufuegen' },
  addEdge: { en: 'Add edge', de: 'Kante hinzufuegen' },
  deleteMode: { en: 'Delete', de: 'Loeschen' },
  moveMode: { en: 'Move', de: 'Verschieben' },
  resetGraph: { en: 'Reset graph', de: 'Graph zuruecksetzen' },
  editHint: { en: 'Move: drag nodes. Add edge: click two nodes. Delete: click a node or edge. Double-click empty space to add a node.', de: 'Verschieben: Knoten ziehen. Kante: zwei Knoten klicken. Loeschen: Knoten oder Kante klicken. Doppelklick auf leere Flaeche fuer neuen Knoten.' },
  weightPrompt: { en: 'Edge weight:', de: 'Kantengewicht:' },
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

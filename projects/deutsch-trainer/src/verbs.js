// Present-tense (Präsens) conjugations of common German verbs.
// Pronoun order: ich, du, er/sie/es, wir, ihr, sie/Sie
export const PRONOUNS = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie']

export const VERBS = [
  { inf: 'sein', en: 'to be', group: 'irregular', forms: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'] },
  { inf: 'haben', en: 'to have', group: 'irregular', forms: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'] },
  { inf: 'werden', en: 'to become', group: 'irregular', forms: ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'] },
  { inf: 'gehen', en: 'to go', group: 'regular', forms: ['gehe', 'gehst', 'geht', 'gehen', 'geht', 'gehen'] },
  { inf: 'kommen', en: 'to come', group: 'regular', forms: ['komme', 'kommst', 'kommt', 'kommen', 'kommt', 'kommen'] },
  { inf: 'machen', en: 'to do / make', group: 'regular', forms: ['mache', 'machst', 'macht', 'machen', 'macht', 'machen'] },
  { inf: 'finden', en: 'to find', group: 'regular', forms: ['finde', 'findest', 'findet', 'finden', 'findet', 'finden'] },
  { inf: 'sehen', en: 'to see', group: 'irregular', forms: ['sehe', 'siehst', 'sieht', 'sehen', 'seht', 'sehen'] },
  { inf: 'sprechen', en: 'to speak', group: 'irregular', forms: ['spreche', 'sprichst', 'spricht', 'sprechen', 'sprecht', 'sprechen'] },
  { inf: 'fahren', en: 'to drive', group: 'irregular', forms: ['fahre', 'fährst', 'fährt', 'fahren', 'fahrt', 'fahren'] },
  { inf: 'essen', en: 'to eat', group: 'irregular', forms: ['esse', 'isst', 'isst', 'essen', 'esst', 'essen'] },
  { inf: 'lesen', en: 'to read', group: 'irregular', forms: ['lese', 'liest', 'liest', 'lesen', 'lest', 'lesen'] },
  { inf: 'nehmen', en: 'to take', group: 'irregular', forms: ['nehme', 'nimmst', 'nimmt', 'nehmen', 'nehmt', 'nehmen'] },
  { inf: 'geben', en: 'to give', group: 'irregular', forms: ['gebe', 'gibst', 'gibt', 'geben', 'gebt', 'geben'] },
  { inf: 'wissen', en: 'to know', group: 'irregular', forms: ['weiß', 'weißt', 'weiß', 'wissen', 'wisst', 'wissen'] },
  { inf: 'können', en: 'can / to be able', group: 'modal', forms: ['kann', 'kannst', 'kann', 'können', 'könnt', 'können'] },
  { inf: 'müssen', en: 'must / to have to', group: 'modal', forms: ['muss', 'musst', 'muss', 'müssen', 'müsst', 'müssen'] },
  { inf: 'wollen', en: 'to want', group: 'modal', forms: ['will', 'willst', 'will', 'wollen', 'wollt', 'wollen'] },
  { inf: 'sollen', en: 'should', group: 'modal', forms: ['soll', 'sollst', 'soll', 'sollen', 'sollt', 'sollen'] },
  { inf: 'dürfen', en: 'may / to be allowed', group: 'modal', forms: ['darf', 'darfst', 'darf', 'dürfen', 'dürft', 'dürfen'] },
  { inf: 'mögen', en: 'to like', group: 'modal', forms: ['mag', 'magst', 'mag', 'mögen', 'mögt', 'mögen'] },
]

// Lenient compare: case-insensitive, accepts ae/oe/ue for umlauts and ss for ß.
export function normalize(s) {
  return s
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
}

export function isCorrect(answer, expected) {
  return normalize(answer) === normalize(expected)
}

// Extra ARA compression topics that the course covers in depth:
// arithmetic-coding rescaling transforms (E1/E2/E3), Rice & Rice-Golomb coding
// (with sign folding), and BASC. Definition-first, worked examples, EN/DE.

export const araExtraContent = {
  'arithmetic-transforms': {
    tldr: {
      en: 'In arithmetic coding the interval [low, high) keeps shrinking until it is too small for the machine to represent. The <strong>E1, E2, E3 transforms</strong> are rescaling rules that emit a bit and stretch the interval back out, so coding can continue with finite precision.',
      de: 'Bei der arithmetischen Codierung schrumpft das Intervall [low, high) immer weiter, bis es die Maschine nicht mehr darstellen kann. Die <strong>E1-, E2-, E3-Transformationen</strong> sind Reskalierungsregeln, die ein Bit ausgeben und das Intervall wieder dehnen, damit die Codierung mit endlicher Praezision weiterlaeuft.',
    },
    defs: [
      { name: { en: 'E1 (lower half)', de: 'E1 (untere Haelfte)' },
        body: { en: 'When the whole interval sits in the lower half [0, 1/2): the leading bit is settled as 0. Output 0, then double the interval: low = 2∗low, high = 2∗high.', de: 'Wenn das ganze Intervall in der unteren Haelfte [0, 1/2) liegt: das fuehrende Bit ist 0. 0 ausgeben, dann verdoppeln: low = 2∗low, high = 2∗high.' },
        formal: { tex: 'high < \\tfrac{1}{2} \\implies \\text{emit } 0;\\; [low,high) \\to [2\\,low,\\, 2\\,high)' } },
      { name: { en: 'E2 (upper half)', de: 'E2 (obere Haelfte)' },
        body: { en: 'When the whole interval sits in the upper half [1/2, 1): the leading bit is settled as 1. Output 1, then rescale: low = 2∗low - 1, high = 2∗high - 1.', de: 'Wenn das ganze Intervall in der oberen Haelfte [1/2, 1) liegt: das fuehrende Bit ist 1. 1 ausgeben, dann reskalieren: low = 2∗low - 1, high = 2∗high - 1.' },
        formal: { tex: 'low \\ge \\tfrac{1}{2} \\implies \\text{emit } 1;\\; [low,high) \\to [2\\,low-1,\\, 2\\,high-1)' } },
      { name: { en: 'E3 (straddles the middle)', de: 'E3 (ueberspannt die Mitte)' },
        body: { en: 'When the interval straddles 1/2 but is trapped in the middle quarter [1/4, 3/4): we cannot yet output a bit. Rescale around 1/2 and remember a pending/underflow count to resolve later: low = 2∗low - 1/2, high = 2∗high - 1/2.', de: 'Wenn das Intervall die 1/2 ueberspannt, aber im mittleren Viertel [1/4, 3/4) gefangen ist: noch kein Bit ausgebbar. Um 1/2 reskalieren und einen Underflow-Zaehler merken: low = 2∗low - 1/2, high = 2∗high - 1/2.' },
        formal: { tex: '\\tfrac{1}{4} \\le low < \\tfrac{1}{2} \\le high < \\tfrac{3}{4} \\implies \\text{E3 count}{+}{+};\\; \\text{rescale around } \\tfrac{1}{2}' } },
    ],
    intro: [
      { en: 'Pure arithmetic coding is mathematically perfect but unusable as-is: after enough symbols the interval is narrower than a float or even a 64-bit fraction can hold (<strong>underflow</strong>). The fix is to work with the bits as soon as they are decided and rescale.', de: 'Reine arithmetische Codierung ist mathematisch perfekt, aber so nicht nutzbar: nach genug Symbolen ist das Intervall schmaler als ein Float oder ein 64-Bit-Bruch fassen kann (<strong>Unterlauf</strong>). Die Loesung: Bits sofort verarbeiten, sobald sie feststehen, und reskalieren.' },
      { en: '<strong>E1</strong> and <strong>E2</strong> handle the easy cases: once the interval is wholly in one half, its top bit can never change, so emit it and zoom in. <strong>E3</strong> is the subtle one: the interval hugs the middle, so the next bit is undecided, but it is shrinking dangerously. E3 rescales around 1/2 and increments an <em>underflow counter</em>; when the next real bit b is finally emitted (by E1 or E2), you also emit that many opposite bits (1-b).', de: '<strong>E1</strong> und <strong>E2</strong> erledigen die einfachen Faelle: liegt das Intervall ganz in einer Haelfte, kann das oberste Bit sich nie mehr aendern - ausgeben und hineinzoomen. <strong>E3</strong> ist der knifflige: das Intervall umklammert die Mitte, das naechste Bit ist unbestimmt, schrumpft aber gefaehrlich. E3 reskaliert um 1/2 und erhoeht einen <em>Underflow-Zaehler</em>; wird das naechste echte Bit b ausgegeben, folgen ebenso viele Gegenbits (1-b).' },
    ],
    paper: [
      { en: 'After each symbol narrows [low, high), check the three conditions in a loop until none applies: high &lt; 1/2 → E1 (emit 0), low ≥ 1/2 → E2 (emit 1), or [1/4, 3/4) straddle → E3 (count++).', de: 'Nach jeder Symbol-Verengung von [low, high) die drei Bedingungen in einer Schleife pruefen, bis keine gilt: high &lt; 1/2 → E1 (0 ausgeben), low ≥ 1/2 → E2 (1 ausgeben), oder [1/4, 3/4)-Ueberspannung → E3 (Zaehler++).' },
      { en: 'On the first E1 or E2 after some E3s: emit the bit, then emit (E3 count) copies of its complement, then reset the count to 0. That deferred-bit rule is the whole trick.', de: 'Beim ersten E1 oder E2 nach einigen E3: das Bit ausgeben, dann (E3-Zaehler) Kopien seines Komplements, dann Zaehler auf 0. Diese Regel der aufgeschobenen Bits ist der ganze Trick.' },
    ],
    complexity: [
      { case: { en: 'Per symbol', de: 'Pro Symbol' }, time: 'O(1) amortized', space: 'O(1)', cls: 'best', note: { en: 'The rescaling keeps low/high in a fixed bit width, making arithmetic coding implementable with plain integers.', de: 'Die Reskalierung haelt low/high in fester Bitbreite und macht arithmetische Codierung mit normalen Ganzzahlen umsetzbar.' } },
    ],
    pitfalls: [
      { en: 'E3 does NOT emit a bit immediately - it banks an underflow count. Forgetting to flush those complementary bits on the next E1/E2 corrupts the output.', de: 'E3 gibt NICHT sofort ein Bit aus - es merkt sich einen Underflow-Zaehler. Diese Gegenbits beim naechsten E1/E2 nicht auszugeben, beschaedigt die Ausgabe.' },
      { en: 'Apply the transforms in a while-loop after every symbol - several may fire in a row before the interval is large enough again.', de: 'Die Transformationen in einer while-Schleife nach jedem Symbol anwenden - mehrere koennen hintereinander feuern, bis das Intervall wieder gross genug ist.' },
    ],
  },

  'rice-golomb': {
    tldr: {
      en: 'Rice coding is Golomb coding with the parameter <strong>M forced to a power of two</strong>, so the remainder is just the low bits - no division, very fast. For signed values you first <strong>fold</strong> them to non-negative with zig-zag (overlap/interleave) coding.',
      de: 'Rice-Codierung ist Golomb-Codierung mit <strong>M als Zweierpotenz</strong>, sodass der Rest einfach die unteren Bits sind - keine Division, sehr schnell. Vorzeichenbehaftete Werte werden zuerst per Zickzack-Codierung auf nicht-negative <strong>gefaltet</strong>.',
    },
    defs: [
      { name: { en: 'Rice code (parameter k)', de: 'Rice-Code (Parameter k)' },
        body: { en: 'With M = 2^k: split n into quotient q = n &gt;&gt; k (write q in unary: q ones then a 0) and remainder r = n &amp; (M-1) (write r in k plain bits).', de: 'Mit M = 2^k: n in Quotient q = n &gt;&gt; k (q unaer: q Einsen, dann 0) und Rest r = n &amp; (M-1) (r in k Bits) zerlegen.' },
        formal: { tex: '\\text{code}(n) = \\text{unary}(n \\gg k)\\,\\cdot\\,\\text{binary}_k\\!\\left(n\\;\\&\\;(2^k-1)\\right)' } },
      { name: { en: 'Sign folding (zig-zag)', de: 'Vorzeichenfaltung (Zickzack)' },
        body: { en: 'Rice/Golomb only encode non-negative integers. Map signed v to non-negative: 0,-1,1,-2,2,... → 0,1,2,3,4,... Then Rice-code the result.', de: 'Rice/Golomb codieren nur nicht-negative Ganzzahlen. Vorzeichenbehaftetes v auf nicht-negativ abbilden: 0,-1,1,-2,2,... → 0,1,2,3,4,... und dann Rice-codieren.' },
        formal: { tex: '\\text{fold}(v) = \\begin{cases} 2v & v \\ge 0 \\\\ -2v-1 & v < 0 \\end{cases}' } },
    ],
    intro: [
      { en: '<strong>Golomb</strong> coding is optimal for geometrically-distributed non-negative integers (lots of small values, few large). Its only awkward part is the remainder, which for a general M needs a truncated binary code and a division. <strong>Rice</strong> coding removes that: pick M = 2^k and the quotient is a shift, the remainder is a bit-mask - no division at all, which is why hardware codecs (FLAC, JPEG-LS, Shorten) use it.', de: '<strong>Golomb</strong>-Codierung ist optimal fuer geometrisch verteilte nicht-negative Ganzzahlen. Der unangenehme Teil ist der Rest, der fuer allgemeines M einen gestutzten Binaercode und eine Division braucht. <strong>Rice</strong> beseitigt das: M = 2^k, der Quotient ist eine Verschiebung, der Rest eine Bitmaske - keine Division, daher in Hardware-Codecs (FLAC, JPEG-LS).' },
      { en: 'Real signals (audio samples, prediction residuals) are <em>signed</em> and centered near zero. You cannot Rice-code a negative number, so first fold with zig-zag: small magnitudes (whether + or -) become small non-negative integers, which then get short codes. This is the "Rice-Golomb with a sign" your course refers to.', de: 'Echte Signale (Audio, Praediktionsreste) sind <em>vorzeichenbehaftet</em> und um null zentriert. Eine negative Zahl laesst sich nicht Rice-codieren, also zuerst per Zickzack falten: kleine Betraege (ob + oder -) werden kleine nicht-negative Ganzzahlen mit kurzen Codes.' },
    ],
    example: null,
    paper: [
      { en: 'Encode 0,-1,1,-2 with k=2 (M=4). Fold: 0→0, -1→1, 1→2, -2→3. Then Rice each: 0 = q0 r0 → "0|00"; 1 = q0 r1 → "0|01"; 2 = q0 r2 → "0|10"; 3 = q0 r3 → "0|11".', de: 'Codiere 0,-1,1,-2 mit k=2 (M=4). Falten: 0→0, -1→1, 1→2, -2→3. Dann Rice: 0 → "0|00"; 1 → "0|01"; 2 → "0|10"; 3 → "0|11".' },
      { en: 'For a bigger value like 9 with k=2: q = 9 &gt;&gt; 2 = 2 → unary "110"; r = 9 &amp; 3 = 1 → "01"; code = "110 01".', de: 'Fuer 9 mit k=2: q = 9 &gt;&gt; 2 = 2 → unaer "110"; r = 9 &amp; 3 = 1 → "01"; Code = "110 01".' },
    ],
    complexity: [
      { case: { en: 'Encode / Decode', de: 'Kodieren / Dekodieren' }, time: 'O(n)', space: 'O(1)', cls: 'best', note: { en: 'No division (unlike general Golomb) - just a shift and a mask. The parameter k must match the data; too small wastes the unary part, too large wastes remainder bits.', de: 'Keine Division (anders als allgemeines Golomb) - nur Verschiebung und Maske. k muss zu den Daten passen.' } },
    ],
    pitfalls: [
      { en: 'Rice is the special case of Golomb where M is a power of two. State that on an exam - they are not different algorithms.', de: 'Rice ist der Sonderfall von Golomb mit M = Zweierpotenz. In der Pruefung so sagen - keine verschiedenen Algorithmen.' },
      { en: 'You MUST fold signs to non-negative first; Rice/Golomb have no representation for a negative number.', de: 'Vorzeichen MUSS zuerst auf nicht-negativ gefaltet werden; Rice/Golomb kennen keine negative Zahl.' },
    ],
  },

  'basc': {
    tldr: {
      en: 'BASC (Binary Adaptive Sequential Coding) encodes a sequence of integers by coding each number in just enough bits for the <strong>current</strong> magnitude, and adapting that bit-width as it goes - so a run like 0010101010101101110101... is decoded by reading length-prefixed binary chunks, not a fixed field.',
      de: 'BASC (Binary Adaptive Sequential Coding) codiert eine Ganzzahlfolge, indem jede Zahl in gerade genug Bits fuer die <strong>aktuelle</strong> Groesse codiert und die Bitbreite laufend anpasst - ein Lauf wie 0010101010101101110101... wird per laengenpraefixierter Binaerstuecke dekodiert, nicht per festem Feld.',
    },
    defs: [
      { name: { en: 'Binary Adaptive Sequential Coding', de: 'Binaere adaptive sequentielle Codierung' },
        body: { en: 'For each integer, send its bit-length, then its bits. The decoder reads the length first so it knows exactly how many bits to consume next - the field width adapts to each value instead of being fixed.', de: 'Fuer jede Ganzzahl die Bitlaenge senden, dann die Bits. Der Dekodierer liest zuerst die Laenge und weiss so genau, wie viele Bits als Naechstes zu lesen sind - die Feldbreite passt sich jedem Wert an.' },
        formal: { tex: '\\text{codeword} = \\text{length-prefix}(\\lfloor \\log_2 x \\rfloor + 1)\\,\\cdot\\,\\text{value-bits}' } },
    ],
    intro: [
      { en: 'Fixed-width binary wastes bits on small numbers; pure variable-length codes (like Elias) re-send a full length descriptor every time. <strong>BASC</strong> is the middle ground for an integer <em>sequence</em>: it tracks the recent magnitude and codes each value relative to it, sliding the width up or down as the data changes. That is why your decode exercise is a long flat bit-string with no obvious boundaries - the boundaries are implied by the adapting length, which you reconstruct as you read.', de: 'Feste Binaerbreite verschwendet Bits bei kleinen Zahlen; reine Codes variabler Laenge (wie Elias) senden jedes Mal einen vollen Laengendeskriptor. <strong>BASC</strong> ist der Mittelweg fuer eine Ganzzahl<em>folge</em>: es verfolgt die juengste Groesse und codiert jeden Wert relativ dazu, die Breite gleitet mit den Daten. Daher ist deine Dekodieraufgabe ein langer flacher Bitstring ohne sichtbare Grenzen - die Grenzen ergeben sich aus der angepassten Laenge, die du beim Lesen rekonstruierst.' },
    ],
    paper: [
      { en: 'To decode: keep the current bit-width w. Read w bits as the next value (and, in the length-prefixed form, read the small prefix first to update w). The leading 1 of a binary number can be implied, so often only the bits after the most-significant 1 are stored.', de: 'Dekodieren: aktuelle Bitbreite w fuehren. w Bits als naechsten Wert lesen (in der praefixierten Form zuerst den kleinen Praefix lesen, um w zu aktualisieren). Die fuehrende 1 kann impliziert sein, sodass oft nur die Bits nach der hoechstwertigen 1 gespeichert werden.' },
      { en: 'Walk the bitstream left to right, peeling off one number at a time using the width rule; write each decoded integer underneath. Never read a fixed 8 or 16 bits - the width is dynamic.', de: 'Den Bitstrom links nach rechts ablaufen, mit der Breitenregel eine Zahl nach der anderen abloesen; jede dekodierte Ganzzahl darunter schreiben. Nie feste 8 oder 16 Bits lesen - die Breite ist dynamisch.' },
    ],
    complexity: [
      { case: { en: 'Encode / Decode', de: 'Kodieren / Dekodieren' }, time: 'O(total bits)', space: 'O(1)', cls: 'best', note: { en: 'Adaptive width means small runs cost few bits without a separate model or table. Good for sequences whose magnitude drifts.', de: 'Adaptive Breite: kleine Laeufe kosten wenige Bits ohne separates Modell. Gut fuer Folgen mit driftender Groesse.' } },
    ],
    pitfalls: [
      { en: 'The decoder is stateful - the meaning of the next bits depends on the width carried from previous values. Lose sync once and the rest is garbage.', de: 'Der Dekodierer ist zustandsbehaftet - die Bedeutung der naechsten Bits haengt von der aus vorigen Werten getragenen Breite ab. Einmal die Synchronisation verlieren und der Rest ist Muell.' },
      { en: 'Because the leading 1 is implied, the stored bits are one shorter than the full binary - a common off-by-one when decoding by hand.', de: 'Da die fuehrende 1 impliziert ist, sind die gespeicherten Bits eines kuerzer als das volle Binaer - ein haeufiger Off-by-one beim Handdekodieren.' },
    ],
  },
}

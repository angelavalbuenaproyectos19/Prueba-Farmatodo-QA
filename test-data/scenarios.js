// Well-defined scenarios. Expected values are fixed (calculated by hand, independent from the site).
// Precondition for all: wordcounter.net open with default configuration and an empty text box.
const SAMPLE =
  'farmatodo farmatodo farmatodo farmatodo farmatodo cuida cuida tu salud\nfarmatodo cuida toda tu salud';

// Area 1 - Word count. Step: type `text`. Expected: Words counter equals `expected`.
const words = [
  { id: 'WC-01', title: 'challenge sample has 14 words', text: SAMPLE, expected: 14 },
  { id: 'WC-02', title: 'empty text has 0 words', text: '', expected: 0 },
  { id: 'WC-03', title: 'a single word counts as 1', text: 'farmatodo', expected: 1 },
  { id: 'WC-04', title: 'multiple spaces do not create extra words', text: 'hola   mundo   hola', expected: 3 },
  { id: 'WC-05', title: 'line breaks separate words', text: 'uno\ndos\ntres', expected: 3 },
];

// Area 2 - Character count. Rule: spaces are counted, line breaks are not.
const characters = [
  { id: 'CC-01', title: 'challenge sample has 99 characters', text: SAMPLE, expected: 99 },
  { id: 'CC-02', title: 'empty text has 0 characters', text: '', expected: 0 },
  { id: 'CC-03', title: 'spaces are counted', text: 'a b', expected: 3 },
  { id: 'CC-04', title: 'line breaks are not counted', text: 'uno\ndos', expected: 6 },
  { id: 'CC-05', title: 'multiple spaces are all counted', text: 'hola   mundo   hola', expected: 19 },
];

// Area 3 - Keyword Density top 3. `topCounts`: expected counts in order; `keywords`: true count per word.
// Tie order on the site is not alphabetical, so order is only asserted on counts (see REPORTE_FALLAS OPP-01).
const keywords = [
  { id: 'KD-01', title: 'challenge sample: farmatodo 6, cuida 3, then a 2-count word', text: SAMPLE,
    topCounts: [6, 3, 2], keywords: { farmatodo: 6, cuida: 3, tu: 2, salud: 2, toda: 1 } },
  { id: 'KD-02', title: 'no repetition: every word appears once', text: 'uno dos tres cuatro',
    topCounts: [1, 1, 1], keywords: { uno: 1, dos: 1, tres: 1, cuatro: 1 } },
  { id: 'KD-03', title: 'words are case insensitive', text: 'Perro perro PERRO gato gato mar',
    topCounts: [3, 2, 1], keywords: { perro: 3, gato: 2, mar: 1 } },
  { id: 'KD-04', title: 'fewer than 3 distinct words lists only those', text: 'hola mundo hola',
    topCounts: [2, 1], keywords: { hola: 2, mundo: 1 } },
  // Known site defect BUG-02 (docs/REPORTE_FALLAS.md): "luna" is dropped. Fails on purpose.
  { id: 'KD-05', title: 'KNOWN DEFECT BUG-02: "luna" must appear with its count', text: 'sol sol sol luna luna mar',
    topCounts: [3, 2, 1], keywords: { sol: 3, luna: 2, mar: 1 } },
];

module.exports = { words, characters, keywords };

// Well-defined scenarios. Expected values are fixed (calculated by hand, independent from the site).
// Precondition for all: wordcounter.net open with default configuration and an empty text box.
const SAMPLE =
  'farmatodo farmatodo farmatodo farmatodo farmatodo cuida cuida tu salud\nfarmatodo cuida toda tu salud';
const LONG = 'gato '.repeat(500).trim(); // 500 words, 500*4 + 499 spaces = 2499 characters

// Area 1 - Word count. Step: type `text`. Expected: Words counter equals `expected`.
const words = [
  { id: 'WC-01', title: 'challenge sample has 14 words', text: SAMPLE, expected: 14 },
  { id: 'WC-02', title: 'empty text has 0 words', text: '', expected: 0 },
  { id: 'WC-03', title: 'a single word counts as 1', text: 'farmatodo', expected: 1 },
  { id: 'WC-04', title: 'multiple spaces do not create extra words', text: 'hola   mundo   hola', expected: 3 },
  { id: 'WC-05', title: 'line breaks separate words', text: 'uno\ndos\ntres', expected: 3 },
  { id: 'WC-06', title: 'punctuation does not create extra words', text: 'hola, mundo. hola!', expected: 3 },
  { id: 'WC-07', title: 'a hyphenated word counts as 1', text: 'bien-estar bien-estar salud', expected: 3 },
  { id: 'WC-08', title: 'numbers count as words', text: '123 456 123', expected: 3 },
  { id: 'WC-09', title: 'leading and trailing spaces are ignored', text: '  hola  ', expected: 1 },
  { id: 'WC-10', title: 'accented and special letters', text: 'salud ñandú ñandú canción', expected: 4 },
  { id: 'WC-11', title: 'tabs separate words', text: 'hola\tmundo', expected: 2 },
  { id: 'WC-12', title: 'long text of 500 words', text: LONG, expected: 500 },
];

// Area 2 - Character count. Rule: spaces and tabs are counted, line breaks are not.
const characters = [
  { id: 'CC-01', title: 'challenge sample has 99 characters', text: SAMPLE, expected: 99 },
  { id: 'CC-02', title: 'empty text has 0 characters', text: '', expected: 0 },
  { id: 'CC-03', title: 'spaces are counted', text: 'a b', expected: 3 },
  { id: 'CC-04', title: 'line breaks are not counted', text: 'uno\ndos', expected: 6 },
  { id: 'CC-05', title: 'multiple spaces are all counted', text: 'hola   mundo   hola', expected: 19 },
  { id: 'CC-06', title: 'punctuation is counted', text: 'hola, mundo. hola!', expected: 18 },
  { id: 'CC-07', title: 'accented letters count as 1 character each', text: 'salud ñandú ñandú canción', expected: 25 },
  { id: 'CC-08', title: 'leading and trailing spaces are counted', text: '  hola  ', expected: 8 },
  { id: 'CC-09', title: 'a trailing line break is not counted', text: 'hola\n', expected: 4 },
  { id: 'CC-10', title: 'a tab is counted as 1 character', text: 'hola\tmundo', expected: 10 },
  { id: 'CC-11', title: 'long text of 2499 characters (thousands separator)', text: LONG, expected: 2499 },
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
  { id: 'KD-05', title: 'KNOWN DEFECT BUG-02: "luna" must appear with its count', text: 'sol sol sol luna luna mar',
    topCounts: [3, 2, 1], keywords: { sol: 3, luna: 2, mar: 1 } },
  { id: 'KD-06', title: 'punctuation is not part of the word', text: 'hola, mundo. hola!',
    topCounts: [2, 1], keywords: { hola: 2, mundo: 1 } },
  { id: 'KD-07', title: 'hyphenated words are kept as one keyword', text: 'bien-estar bien-estar salud',
    topCounts: [2, 1], keywords: { 'bien-estar': 2, salud: 1 } },
  { id: 'KD-08', title: 'accented words are counted', text: 'salud ñandú ñandú canción',
    topCounts: [2, 1, 1], keywords: { 'ñandú': 2, salud: 1, 'canción': 1 } },
  { id: 'KD-09', title: 'only the top 3 of 4 distinct words are listed', text: 'gato gato gato perro perro casa mesa',
    topCounts: [3, 2, 1], keywords: { gato: 3, perro: 2, casa: 1, mesa: 1 } },
  { id: 'KD-10', title: 'long text: one keyword at 500', text: LONG,
    topCounts: [500], keywords: { gato: 500 } },
  // Known site defect BUG-03 (docs/REPORTE_FALLAS.md): numbers are counted as words but not as keywords.
  { id: 'KD-11', title: 'KNOWN DEFECT BUG-03: numbers must appear as keywords', text: '123 456 123',
    topCounts: [2, 1], keywords: { '123': 2, '456': 1 } },
];

// Area 4 - Keyword Density percentages (percent of total words, rounded).
const percentages = [
  { id: 'KP-01', title: 'challenge sample: 6/14 = 43%, 3/14 = 21%', text: SAMPLE,
    expected: [{ word: 'farmatodo', percent: 43 }, { word: 'cuida', percent: 21 }] },
  { id: 'KP-02', title: 'two words, 2/3 = 67% and 1/3 = 33%', text: 'hola mundo hola',
    expected: [{ word: 'hola', percent: 67 }, { word: 'mundo', percent: 33 }] },
  { id: 'KP-03', title: 'a single repeated word is 100%', text: 'gato gato gato',
    expected: [{ word: 'gato', percent: 100 }] },
];

module.exports = { words, characters, keywords, percentages };

// Escenarios del menú Options. Cada uno parte de la configuración por defecto (contexto de navegador nuevo),
// escribe `text`, aplica las opciones desde la interfaz y valida el resultado. Los valores esperados son fijos.
const KW = 'sol sol sol luna luna mar'; // "luna" es una palabra común: oculta por defecto
const PETS = 'gato gato gato perro perro casa mesa';
const PHRASES = 'perro gato perro gato casa casa';
const DETAILS_TEXT = 'hola mundo hola\nsegunda linea. otra frase!';

// Opciones de Keyword Density (individuales y combinadas).
const keywordOptions = [
  {
    id: 'OP-01',
    title: 'incluir palabras comunes: "luna" aparece',
    text: KW,
    options: { includeCommonWords: true },
    topCounts: [3, 2, 1],
    keywords: { sol: 3, luna: 2, mar: 1 },
  },
  {
    id: 'OP-02',
    title: 'cantidad = 2 lista solo 2 keywords',
    text: PETS,
    options: { amount: 2 },
    topCounts: [3, 2],
    keywords: { gato: 3, perro: 2 },
  },
  {
    id: 'OP-03',
    title: 'cantidad = 1 lista solo la keyword principal',
    text: PETS,
    options: { amount: 1 },
    topCounts: [3],
    keywords: { gato: 3 },
  },
  {
    id: 'OP-04',
    title: 'palabras consecutivas = 2 agrupa frases de dos palabras',
    text: PHRASES,
    options: { consecutive: 2 },
    topCounts: [2, 1, 1, 1],
    keywords: { 'perro gato': 2, 'gato perro': 1, 'gato casa': 1, 'casa casa': 1 },
  },
  {
    id: 'OP-05',
    title: 'palabras consecutivas = 3 agrupa frases de tres palabras',
    text: PHRASES,
    options: { consecutive: 3 },
    topCounts: [1, 1, 1, 1],
    keywords: { 'perro gato perro': 1, 'gato perro gato': 1, 'perro gato casa': 1, 'gato casa casa': 1 },
  },
  {
    id: 'OP-06',
    title: 'combinación: palabras comunes + cantidad 2',
    text: KW,
    options: { includeCommonWords: true, amount: 2 },
    topCounts: [3, 2],
    keywords: { sol: 3, luna: 2 },
  },
  {
    id: 'OP-07',
    title: 'combinación: palabras comunes + consecutivas 2',
    text: KW,
    options: { includeCommonWords: true, consecutive: 2 },
    topCounts: [2, 1, 1, 1],
    keywords: { 'sol sol': 2, 'sol luna': 1, 'luna luna': 1, 'luna mar': 1 },
  },
  {
    id: 'OP-08',
    title: 'combinación: consecutivas 2 + cantidad 1',
    text: PHRASES,
    options: { consecutive: 2, amount: 1 },
    topCounts: [2],
    keywords: { 'perro gato': 2 },
  },
  {
    id: 'OP-09',
    title: 'combinación: palabras comunes + consecutivas 2 + cantidad 2',
    text: KW,
    options: { includeCommonWords: true, consecutive: 2, amount: 2 },
    topCounts: [2, 1],
    keywords: { 'sol sol': 2, 'sol luna': 1, 'luna luna': 1, 'luna mar': 1 },
  },
  // Los valores inválidos se aceptan en el campo sin aviso y se ignoran (ver OPP-04): la lista queda completa.
  {
    id: 'OP-10',
    title: 'cantidad inválida 0 se ignora y se muestra la lista completa',
    text: 'perro gato casa perro gato casa',
    options: { amount: 0 },
    topCounts: [2, 2, 2],
    keywords: { perro: 2, gato: 2, casa: 2 },
  },
  {
    id: 'OP-11',
    title: 'cantidad inválida -1 se ignora y se muestra la lista completa',
    text: 'perro gato casa perro gato casa',
    options: { amount: -1 },
    topCounts: [2, 2, 2],
    keywords: { perro: 2, gato: 2, casa: 2 },
  },
  {
    id: 'OP-19',
    title: 'palabras consecutivas = 2 con tildes',
    text: 'canción corazón canción corazón avión',
    options: { consecutive: 2 },
    topCounts: [2, 1, 1],
    keywords: { 'canción corazón': 2, 'corazón canción': 1, 'corazón avión': 1 },
  },
  {
    id: 'OP-20',
    title: 'combinación: cantidad 2 con eñe',
    text: 'niño niño niño montaña montaña sueña',
    options: { amount: 2 },
    topCounts: [3, 2],
    keywords: { niño: 3, montaña: 2 },
  },
];

// Opciones de Details: contadores extra, solos y combinados. El texto tiene 7 palabras, 41 caracteres (36 sin espacios),
// 6 palabras únicas y 2 líneas.
const detailMetrics = [
  {
    id: 'OP-12',
    title: 'Caracteres sin espacios = 36',
    text: DETAILS_TEXT,
    toggles: ['chk_character_count_no_spaces'],
    expected: { charactersNoSpaces: 36 },
  },
  {
    id: 'OP-13',
    title: 'Palabras únicas = 6',
    text: DETAILS_TEXT,
    toggles: ['chk_unique_word_count'],
    expected: { uniqueWords: 6 },
  },
  { id: 'OP-14', title: 'Líneas = 2', text: DETAILS_TEXT, toggles: ['chk_lines_count'], expected: { lines: 2 } },
  {
    id: 'OP-15',
    title: 'combinación: los tres contadores extra juntos mantienen intactos los contadores base',
    text: DETAILS_TEXT,
    toggles: ['chk_character_count_no_spaces', 'chk_unique_word_count', 'chk_lines_count'],
    expected: { charactersNoSpaces: 36, uniqueWords: 6, lines: 2, words: 7, characters: 41 },
  },
];

module.exports = { keywordOptions, detailMetrics };

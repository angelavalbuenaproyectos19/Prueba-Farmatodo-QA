// Escenarios con textos reales en español (tildes, eñe, signos de apertura ¿ ¡, párrafos, mayúsculas).
// Los valores esperados son fijos (calculados a mano / con el contador de referencia, independientes del sitio).
// Precondición de todos: wordcounter.net abierto con la configuración por defecto y el cuadro de texto vacío.
const FRASE =
  'La salud de tu familia es lo más importante. ¿Cuidas tu salud? ¡Farmatodo cuida tu salud y la de tu familia!';
const SIGNOS = 'farmatodo cuida. ¡Farmatodo cuida! ¿Farmatodo cuida?';

// Conteo de palabras y de caracteres (se cuentan espacios y signos; no se cuentan los saltos de línea).
const conteos = [
  { id: 'ES-01', title: 'frase con signos ¿? ¡! y tildes', text: FRASE, words: 21, chars: 108 },
  {
    id: 'ES-02',
    title: 'dos párrafos separados por una línea en blanco',
    text: 'Primer párrafo de prueba.\n\nSegundo párrafo de prueba.',
    words: 8,
    chars: 51,
  },
  {
    id: 'ES-03',
    title: 'eñe y tildes en una oración',
    text: 'El niño sueña con una montaña. El niño pequeño cuida la montaña.',
    words: 12,
    chars: 64,
  },
  {
    id: 'ES-04',
    title: 'la misma palabra en mayúsculas y minúsculas',
    text: 'FARMACIA farmacia Farmacia FARMACIA',
    words: 4,
    chars: 35,
  },
  { id: 'ES-05', title: 'palabras con tilde final', text: 'canción corazón avión', words: 3, chars: 21 },
  { id: 'ES-06', title: 'signos de apertura no crean palabras extra', text: SIGNOS, words: 6, chars: 52 },
];

// Keyword Density top 3. `topCounts`: conteos esperados en orden; `keywords`: conteo real por palabra.
const keywords = [
  {
    id: 'ES-KD-01',
    title: 'frase larga: tu 4, salud 3 y una palabra con 2',
    text: FRASE,
    topCounts: [4, 3, 2],
    keywords: { tu: 4, salud: 3, la: 2, de: 2, familia: 2 },
  },
  {
    id: 'ES-KD-02',
    title: 'palabras con tilde se agrupan sin importar el orden',
    text: 'canción canción canción corazón corazón avión',
    topCounts: [3, 2, 1],
    keywords: { canción: 3, corazón: 2, avión: 1 },
  },
  {
    id: 'ES-KD-03',
    title: 'mayúsculas y minúsculas cuentan como la misma palabra',
    text: 'FARMACIA farmacia Farmacia FARMACIA',
    topCounts: [4],
    keywords: { farmacia: 4 },
  },
  {
    id: 'ES-KD-04',
    title: 'la eñe se conserva en la keyword',
    text: 'niño niño niño montaña montaña sueña',
    topCounts: [3, 2, 1],
    keywords: { niño: 3, montaña: 2, sueña: 1 },
  },
];

// Defectos reales del sitio: fallan a propósito. El CI los ejecuta aparte (etiqueta @defecto-conocido).
const defectos = [
  // DEFECTO BUG-01 (docs/REPORTE_FALLAS.md): el sitio no quita ¿ ¡ « » al inicio y parte el conteo. Falla a propósito.
  {
    id: 'ES-KD-05',
    title: 'DEFECTO BUG-01: ¡Farmatodo, ¿Farmatodo y Farmatodo son la misma keyword',
    text: SIGNOS,
    topCounts: [3, 3],
    keywords: { farmatodo: 3, cuida: 3 },
  },
  {
    id: 'ES-KD-06',
    title: 'DEFECTO BUG-01: «hola» con comillas angulares es la misma keyword que hola',
    text: 'hola «hola» "hola" (hola)',
    topCounts: [4],
    keywords: { hola: 4 },
  },
];

module.exports = { conteos, keywords, defectos };

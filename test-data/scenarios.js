// Escenarios bien definidos. Los valores esperados son fijos (calculados a mano, independientes del sitio).
// Precondición de todos: wordcounter.net abierto con la configuración por defecto y el cuadro de texto vacío.
const SAMPLE =
  'farmatodo farmatodo farmatodo farmatodo farmatodo cuida cuida tu salud\nfarmatodo cuida toda tu salud';
const LONG = 'gato '.repeat(500).trim(); // 500 palabras, 500*4 + 499 espacios = 2499 caracteres

// Área 1 - Conteo de palabras. Paso: escribir `text`. Esperado: el contador Words es igual a `expected`.
const words = [
  { id: 'WC-01', title: 'el texto de ejemplo del enunciado tiene 14 palabras', text: SAMPLE, expected: 14 },
  { id: 'WC-02', title: 'texto vacío tiene 0 palabras', text: '', expected: 0 },
  { id: 'WC-03', title: 'una sola palabra cuenta como 1', text: 'farmatodo', expected: 1 },
  { id: 'WC-04', title: 'varios espacios no crean palabras extra', text: 'hola   mundo   hola', expected: 3 },
  { id: 'WC-05', title: 'los saltos de línea separan palabras', text: 'uno\ndos\ntres', expected: 3 },
  { id: 'WC-06', title: 'la puntuación no crea palabras extra', text: 'hola, mundo. hola!', expected: 3 },
  { id: 'WC-07', title: 'una palabra con guion cuenta como 1', text: 'bien-estar bien-estar salud', expected: 3 },
  { id: 'WC-08', title: 'los números cuentan como palabras', text: '123 456 123', expected: 3 },
  { id: 'WC-09', title: 'los espacios al inicio y al final se ignoran', text: '  hola  ', expected: 1 },
  { id: 'WC-10', title: 'letras con tilde y especiales', text: 'salud ñandú ñandú canción', expected: 4 },
  { id: 'WC-11', title: 'los tabuladores separan palabras', text: 'hola\tmundo', expected: 2 },
  { id: 'WC-12', title: 'texto largo de 500 palabras', text: LONG, expected: 500 },
];

// Área 2 - Conteo de caracteres. Regla: se cuentan espacios y tabuladores, no los saltos de línea.
const characters = [
  { id: 'CC-01', title: 'el texto de ejemplo del enunciado tiene 99 caracteres', text: SAMPLE, expected: 99 },
  { id: 'CC-02', title: 'texto vacío tiene 0 caracteres', text: '', expected: 0 },
  { id: 'CC-03', title: 'los espacios se cuentan', text: 'a b', expected: 3 },
  { id: 'CC-04', title: 'los saltos de línea no se cuentan', text: 'uno\ndos', expected: 6 },
  { id: 'CC-05', title: 'todos los espacios múltiples se cuentan', text: 'hola   mundo   hola', expected: 19 },
  { id: 'CC-06', title: 'la puntuación se cuenta', text: 'hola, mundo. hola!', expected: 18 },
  { id: 'CC-07', title: 'cada letra con tilde cuenta como 1 carácter', text: 'salud ñandú ñandú canción', expected: 25 },
  { id: 'CC-08', title: 'los espacios al inicio y al final se cuentan', text: '  hola  ', expected: 8 },
  { id: 'CC-09', title: 'un salto de línea final no se cuenta', text: 'hola\n', expected: 4 },
  { id: 'CC-10', title: 'un tabulador cuenta como 1 carácter', text: 'hola\tmundo', expected: 10 },
  { id: 'CC-11', title: 'texto largo de 2499 caracteres (separador de miles)', text: LONG, expected: 2499 },
];

// Área 3 - Top 3 de Keyword Density. `topCounts`: conteos esperados en orden; `keywords`: conteo real por palabra.
// El orden de los empates en el sitio no es alfabético, por eso solo se valida el orden de los conteos (ver REPORTE_FALLAS OPP-01).
const keywords = [
  { id: 'KD-01', title: 'ejemplo del enunciado: farmatodo 6, cuida 3, luego una palabra con 2', text: SAMPLE,
    topCounts: [6, 3, 2], keywords: { farmatodo: 6, cuida: 3, tu: 2, salud: 2, toda: 1 } },
  { id: 'KD-02', title: 'sin repetición: cada palabra aparece una vez', text: 'uno dos tres cuatro',
    topCounts: [1, 1, 1], keywords: { uno: 1, dos: 1, tres: 1, cuatro: 1 } },
  { id: 'KD-03', title: 'las palabras no distinguen mayúsculas de minúsculas', text: 'Perro perro PERRO gato gato mar',
    topCounts: [3, 2, 1], keywords: { perro: 3, gato: 2, mar: 1 } },
  { id: 'KD-04', title: 'con menos de 3 palabras distintas se listan solo esas', text: 'hola mundo hola',
    topCounts: [2, 1], keywords: { hola: 2, mundo: 1 } },
  // La configuración por defecto excluye las "palabras comunes" (y los dígitos) de Keyword Density, ver OPP-03.
  { id: 'KD-05', title: 'configuración por defecto: la palabra común "luna" se excluye de la lista', text: 'sol sol sol luna luna mar',
    topCounts: [3, 1], keywords: { sol: 3, mar: 1 } },
  { id: 'KD-06', title: 'la puntuación no forma parte de la palabra', text: 'hola, mundo. hola!',
    topCounts: [2, 1], keywords: { hola: 2, mundo: 1 } },
  { id: 'KD-07', title: 'las palabras con guion se mantienen como una sola keyword', text: 'bien-estar bien-estar salud',
    topCounts: [2, 1], keywords: { 'bien-estar': 2, salud: 1 } },
  { id: 'KD-08', title: 'las palabras con tilde se cuentan', text: 'salud ñandú ñandú canción',
    topCounts: [2, 1, 1], keywords: { 'ñandú': 2, salud: 1, 'canción': 1 } },
  { id: 'KD-09', title: 'solo se listan las 3 primeras de 4 palabras distintas', text: 'gato gato gato perro perro casa mesa',
    topCounts: [3, 2, 1], keywords: { gato: 3, perro: 2, casa: 1, mesa: 1 } },
  { id: 'KD-10', title: 'texto largo: una keyword con 500', text: LONG,
    topCounts: [500], keywords: { gato: 500 } },
  // Los números cuentan como palabras pero nunca se listan como keywords, ver OPP-03.
  { id: 'KD-11', title: 'los números no se listan como keywords', text: 'hola 123 123 456 hola',
    topCounts: [2], keywords: { hola: 2 } },
];

// Área 4 - Porcentajes de Keyword Density (porcentaje sobre el total de palabras, redondeado).
const percentages = [
  { id: 'KP-01', title: 'ejemplo del enunciado: 6/14 = 43%, 3/14 = 21%', text: SAMPLE,
    expected: [{ word: 'farmatodo', percent: 43 }, { word: 'cuida', percent: 21 }] },
  { id: 'KP-02', title: 'dos palabras, 2/3 = 67% y 1/3 = 33%', text: 'hola mundo hola',
    expected: [{ word: 'hola', percent: 67 }, { word: 'mundo', percent: 33 }] },
  { id: 'KP-03', title: 'una sola palabra repetida es 100%', text: 'gato gato gato',
    expected: [{ word: 'gato', percent: 100 }] },
];

module.exports = { words, characters, keywords, percentages };

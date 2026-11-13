/**
 * Análisis de frecuencia de palabras.
 * Una palabra es una secuencia de caracteres sin espacios, en minúsculas.
 * Los caracteres incluyen espacios pero excluyen los saltos de línea.
 */
function analyze(text) {
  const characters = text.replace(/[\r\n]/g, '').length;
  const counts = new Map();
  let words = 0;
  for (const token of text.split(/\s+/)) {
    if (!token) continue;
    words++;
    const w = token.toLowerCase();
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  // Frecuencia descendente; en caso de empate, orden alfabético.
  const frequencies = [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)
  );
  return { words, characters, frequencies };
}

function format({ words, characters, frequencies }) {
  const lines = [`${words} words`, `${characters} characters`, ''];
  for (const [w, c] of frequencies) lines.push(`${w}: ${c}`);
  return lines.join('\n');
}

module.exports = { analyze, format };

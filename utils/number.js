// Convierte textos con separador de miles (ej. "2,499") a número.
function parseNumber(text) {
  return Number(String(text).trim().replace(/,/g, ''));
}

module.exports = { parseNumber };

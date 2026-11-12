/**
 * Word frequency analysis.
 * Words are runs of non-whitespace characters, lowercased.
 * Characters include spaces but exclude line breaks.
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
  // Count desc, then alphabetical on ties.
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

const { test, expect } = require('../../fixtures');
const { conteos, keywords, defectos } = require('../../test-data/textos-es');

test.describe('Textos en español > Conteos', () => {
  for (const s of conteos) {
    test(`${s.id} palabras - ${s.title}`, async ({ wordCounterPage: app }) => {
      await app.enterText(s.text);
      await expect.poll(() => app.stats.value('words')).toBe(s.words);
    });

    test(`${s.id} caracteres - ${s.title}`, async ({ wordCounterPage: app }) => {
      await app.enterText(s.text);
      await expect.poll(() => app.stats.value('characters')).toBe(s.chars);
    });
  }
});

// Comprobación común del top 3: los conteos en orden y que cada palabra listada tenga su conteo real.
async function comprobarTop3(app, s) {
  await app.enterText(s.text);
  await expect.poll(() => app.keywords.topCounts(3), { message: 'conteos del top 3' }).toEqual(s.topCounts);
  for (const { word, count } of await app.keywords.top(3)) {
    expect(s.keywords[word], `keyword inesperada "${word}"`).toBe(count);
  }
}

test.describe('Textos en español > Keyword Density', () => {
  for (const s of keywords) {
    test(`${s.id} ${s.title}`, async ({ wordCounterPage: app }) => comprobarTop3(app, s));
  }
});

// Estos escenarios fallan a propósito: documentan defectos reales del sitio (BUG-01).
test.describe('Textos en español > Defectos conocidos', { tag: '@defecto-conocido' }, () => {
  for (const s of defectos) {
    test(`${s.id} ${s.title}`, async ({ wordCounterPage: app }) => comprobarTop3(app, s));
  }
});

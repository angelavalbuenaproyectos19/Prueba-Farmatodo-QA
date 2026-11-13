const { test, expect } = require('../../fixtures');
const { conteos, keywords } = require('../../test-data/textos-es');

test.describe('Textos en español > Conteos', () => {
  for (const s of conteos) {
    test(`${s.id} palabras - ${s.title}`, async ({ wordCounterPage: app }) => {
      await app.enterText(s.text);
      await expect.poll(() => app.stats.words()).toBe(s.words);
    });

    test(`${s.id} caracteres - ${s.title}`, async ({ wordCounterPage: app }) => {
      await app.enterText(s.text);
      await expect.poll(() => app.stats.characters()).toBe(s.chars);
    });
  }
});

test.describe('Textos en español > Keyword Density', () => {
  for (const s of keywords) {
    test(`${s.id} ${s.title}`, async ({ wordCounterPage: app }) => {
      await app.enterText(s.text);
      await expect.poll(() => app.keywords.topCounts(3), { message: 'conteos del top 3' }).toEqual(s.topCounts);
      for (const { word, count } of await app.keywords.top(3)) {
        expect(s.keywords[word], `keyword inesperada "${word}"`).toBe(count);
      }
    });
  }
});

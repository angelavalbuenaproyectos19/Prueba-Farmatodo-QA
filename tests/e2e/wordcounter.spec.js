const { test, expect } = require('@playwright/test');
const { WordCounterPage } = require('../../pages/WordCounterPage');

const SAMPLE =
  'farmatodo farmatodo farmatodo farmatodo farmatodo cuida cuida tu salud\nfarmatodo cuida toda tu salud';

// Fixed expected values (calculated by hand, independent from the site).
// `keywords` lists every word with its true count; `topCounts` are the expected top-3 counts in order.
const SCENARIOS = [
  { name: 'challenge sample', text: SAMPLE, words: 14, chars: 99,
    topCounts: [6, 3, 2], keywords: { farmatodo: 6, cuida: 3, tu: 2, salud: 2, toda: 1 } },
  { name: 'single line, no repetition', text: 'uno dos tres cuatro', words: 4, chars: 19,
    topCounts: [1, 1, 1], keywords: { uno: 1, dos: 1, tres: 1, cuatro: 1 } },
  { name: 'mixed case counts as the same word', text: 'Perro perro PERRO gato gato mar', words: 6, chars: 31,
    topCounts: [3, 2, 1], keywords: { perro: 3, gato: 2, mar: 1 } },
  { name: 'multiple spaces between words', text: 'hola   mundo   hola', words: 3, chars: 19,
    topCounts: [2, 1], keywords: { hola: 2, mundo: 1 } },
  // Known site defect (docs/REPORTE_FALLAS.md, BUG-02): "luna" is dropped from Keyword Density.
  { name: 'word "luna" (known defect BUG-02)', text: 'sol sol sol luna luna mar', words: 6, chars: 25,
    topCounts: [3, 2, 1], keywords: { sol: 3, luna: 2, mar: 1 } },
];

test.describe('wordcounter.net', () => {
  let app;
  test.beforeEach(async ({ page }) => {
    app = new WordCounterPage(page);
    await app.goto();
  });

  for (const s of SCENARIOS) {
    test(`word count - ${s.name}`, async () => {
      await app.enterText(s.text);
      await expect.poll(() => app.words()).toBe(s.words);
    });

    test(`character count - ${s.name}`, async () => {
      await app.enterText(s.text);
      await expect.poll(() => app.characters()).toBe(s.chars);
    });

    // Tie order on the site is not alphabetical and the brief does not define it for the site,
    // so we assert the top-3 counts in order and that every listed word carries its true count.
    test(`top 3 keyword density - ${s.name}`, async () => {
      await app.enterText(s.text);
      await expect
        .poll(async () => (await app.topKeywords(3)).map((k) => k.count), { message: 'top-3 counts' })
        .toEqual(s.topCounts);
      for (const { word, count } of await app.topKeywords(3)) {
        expect(s.keywords[word], `unexpected keyword "${word}"`).toBe(count);
      }
    });
  }
});

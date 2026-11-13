const { test, expect } = require('../../fixtures');
const { words, characters, keywords } = require('../../test-data/scenarios');

test.describe('Word count', () => {
  for (const s of words) {
    test(`${s.id} ${s.title}`, async ({ wordCounterPage: app }) => {
      if (s.text) await app.enterText(s.text);
      await expect.poll(() => app.stats.words()).toBe(s.expected);
    });
  }
});

test.describe('Character count', () => {
  for (const s of characters) {
    test(`${s.id} ${s.title}`, async ({ wordCounterPage: app }) => {
      if (s.text) await app.enterText(s.text);
      await expect.poll(() => app.stats.characters()).toBe(s.expected);
    });
  }
});

test.describe('Keyword density (top 3)', () => {
  for (const s of keywords) {
    test(`${s.id} ${s.title}`, async ({ wordCounterPage: app }) => {
      await app.enterText(s.text);
      await expect.poll(() => app.keywords.topCounts(3), { message: 'top-3 counts' }).toEqual(s.topCounts);
      for (const { word, count } of await app.keywords.top(3)) {
        expect(s.keywords[word], `unexpected keyword "${word}"`).toBe(count);
      }
    });
  }
});

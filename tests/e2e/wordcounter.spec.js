const { test, expect } = require('../../fixtures');
const { words, characters, keywords, percentages } = require('../../test-data/scenarios');

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

test.describe('Keyword density percentages', () => {
  for (const s of percentages) {
    test(`${s.id} ${s.title}`, async ({ wordCounterPage: app }) => {
      await app.enterText(s.text);
      await expect.poll(async () => (await app.keywords.top(s.expected.length)).length).toBe(s.expected.length);
      const got = await app.keywords.top(s.expected.length);
      expect(got.map(({ word, percent }) => ({ word, percent }))).toEqual(s.expected);
    });
  }
});

test.describe('Live updates', () => {
  test('LU-01 clearing the text resets counters and keywords', async ({ wordCounterPage: app }) => {
    await app.enterText('hola mundo hola');
    await expect.poll(() => app.stats.words()).toBe(3);
    await app.clear();
    await expect.poll(() => app.stats.words()).toBe(0);
    await expect.poll(() => app.stats.characters()).toBe(0);
    await expect.poll(() => app.keywords.isEmpty()).toBe(true);
  });

  test('LU-02 typing key by key updates counters', async ({ wordCounterPage: app }) => {
    await app.appendText('hola mundo');
    await expect.poll(() => app.stats.words()).toBe(2);
    await expect.poll(() => app.stats.characters()).toBe(10);
  });

  test('LU-03 appending text updates counters and keywords', async ({ wordCounterPage: app }) => {
    await app.enterText('hola mundo');
    await expect.poll(() => app.stats.words()).toBe(2);
    await app.appendText(' hola');
    await expect.poll(() => app.stats.words()).toBe(3);
    await expect.poll(() => app.stats.characters()).toBe(15);
    await expect.poll(() => app.keywords.topCounts(3)).toEqual([2, 1]);
  });
});

const { test, expect } = require('../../fixtures');
const { words, characters, keywords, percentages } = require('../../test-data/scenarios');

test.describe('Conteo de palabras', () => {
  for (const s of words) {
    test(`${s.id} ${s.title}`, async ({ wordCounterPage: app }) => {
      await app.enterText(s.text);
      await expect.poll(() => app.stats.value('words')).toBe(s.expected);
    });
  }
});

test.describe('Conteo de caracteres', () => {
  for (const s of characters) {
    test(`${s.id} ${s.title}`, async ({ wordCounterPage: app }) => {
      await app.enterText(s.text);
      await expect.poll(() => app.stats.value('characters')).toBe(s.expected);
    });
  }
});

test.describe('Keyword Density (top 3)', () => {
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

test.describe('Porcentajes de Keyword Density', () => {
  for (const s of percentages) {
    test(`${s.id} ${s.title}`, async ({ wordCounterPage: app }) => {
      await app.enterText(s.text);
      await expect.poll(async () => (await app.keywords.top(s.expected.length)).length).toBe(s.expected.length);
      const got = await app.keywords.top(s.expected.length);
      expect(got.map(({ word, percent }) => ({ word, percent }))).toEqual(s.expected);
    });
  }
});

test.describe('Actualizaciones en vivo', () => {
  test('LU-01 borrar el texto reinicia contadores y keywords', async ({ wordCounterPage: app }) => {
    await app.enterText('hola mundo hola');
    await expect.poll(() => app.stats.value('words')).toBe(3);
    await app.clear();
    await expect.poll(() => app.stats.value('words')).toBe(0);
    await expect.poll(() => app.stats.value('characters')).toBe(0);
    await expect.poll(() => app.keywords.isEmpty()).toBe(true);
  });

  test('LU-02 escribir tecla por tecla actualiza los contadores', async ({ wordCounterPage: app }) => {
    await app.appendText('hola mundo');
    await expect.poll(() => app.stats.value('words')).toBe(2);
    await expect.poll(() => app.stats.value('characters')).toBe(10);
  });

  test('LU-03 agregar texto actualiza contadores y keywords', async ({ wordCounterPage: app }) => {
    await app.enterText('hola mundo');
    await expect.poll(() => app.stats.value('words')).toBe(2);
    await app.appendText(' hola');
    await expect.poll(() => app.stats.value('words')).toBe(3);
    await expect.poll(() => app.stats.value('characters')).toBe(15);
    await expect.poll(() => app.keywords.topCounts(3)).toEqual([2, 1]);
  });
});

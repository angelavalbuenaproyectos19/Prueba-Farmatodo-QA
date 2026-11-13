const { test, expect } = require('../../fixtures');
const { keywordOptions, detailMetrics } = require('../../test-data/options');

test.describe('Opciones > Keyword Density', () => {
  for (const s of keywordOptions) {
    test(`${s.id} ${s.title}`, async ({ wordCounterPage: app }) => {
      await app.enterText(s.text);
      await app.options.configureKeywordDensity(s.options);
      await expect.poll(() => app.keywords.topCounts(10), { message: 'conteos de keywords' }).toEqual(s.topCounts);
      for (const { word, count } of await app.keywords.top(10)) {
        expect(s.keywords[word], `keyword inesperada "${word}"`).toBe(count);
      }
    });
  }

  test('OP-16 desactivar el panel Keyword Density lo oculta', async ({ wordCounterPage: app }) => {
    await app.enterText('hola mundo hola');
    await expect.poll(() => app.keywords.topCounts(3)).toEqual([2, 1]);
    await app.options.configureKeywordDensity({ show: false });
    await expect(app.keywords.panel).toBeHidden();
  });

  test('OP-17 una opción se mantiene aplicada después de recargar la página', async ({ wordCounterPage: app }) => {
    await app.enterText('sol sol sol luna luna mar');
    await app.options.configureKeywordDensity({ includeCommonWords: true });
    await app.goto();
    await app.enterText('sol sol sol luna luna mar');
    await expect.poll(() => app.keywords.topCounts(10)).toEqual([3, 2, 1]);
  });
});

test.describe('Opciones > Details', () => {
  for (const s of detailMetrics) {
    test(`${s.id} ${s.title}`, async ({ wordCounterPage: app }) => {
      await app.enterText(s.text);
      await app.options.toggleDetails(s.toggles);
      const e = s.expected;
      const read = {
        charactersNoSpaces: () => app.stats.metric(app.stats.charactersNoSpaces),
        uniqueWords: () => app.stats.metric(app.stats.uniqueWords),
        lines: () => app.stats.metric(app.stats.lines),
        words: () => app.stats.words(),
        characters: () => app.stats.characters(),
      };
      for (const [name, value] of Object.entries(e)) {
        await expect.poll(read[name], { message: name }).toBe(value);
      }
    });
  }

  test('OP-18 ocultar el contador Characters mantiene visible Words', async ({ wordCounterPage: app }) => {
    await app.enterText('hola mundo');
    await app.options.toggleDetails(['chk_character_count']);
    await expect(app.stats.characterCount).toBeHidden();
    await expect(app.stats.wordCount).toBeVisible();
  });
});

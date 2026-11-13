const base = require('@playwright/test');
const { WordCounterPage } = require('../pages/WordCounterPage');

// Fixtures personalizados: las pruebas reciben los page objects listos para usar en lugar de construirlos.
const test = base.test.extend({
  wordCounterPage: async ({ page }, use) => {
    const wordCounterPage = new WordCounterPage(page);
    await wordCounterPage.goto();
    await use(wordCounterPage);
  },
});

module.exports = { test, expect: base.expect };

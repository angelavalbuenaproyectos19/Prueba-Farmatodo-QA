const base = require('@playwright/test');
const { WordCounterPage } = require('../pages/WordCounterPage');

// Custom fixtures: tests receive ready-to-use page objects instead of building them.
const test = base.test.extend({
  wordCounterPage: async ({ page }, use) => {
    const wordCounterPage = new WordCounterPage(page);
    await wordCounterPage.goto();
    await use(wordCounterPage);
  },
});

module.exports = { test, expect: base.expect };

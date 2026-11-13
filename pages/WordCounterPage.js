const { BasePage } = require('./BasePage');
const { StatsPanel } = require('./components/StatsPanel');
const { KeywordDensityPanel } = require('./components/KeywordDensityPanel');

// Page Object for https://wordcounter.net/ (default configuration, no settings changed).
class WordCounterPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.textBox = page.locator('#box');
    this.stats = new StatsPanel(page);
    this.keywords = new KeywordDensityPanel(page);
  }

  async goto() {
    await this.open('/');
    await this.textBox.waitFor();
  }

  /** @param {string} text */
  async enterText(text) {
    await this.textBox.fill(text);
  }
}

module.exports = { WordCounterPage };

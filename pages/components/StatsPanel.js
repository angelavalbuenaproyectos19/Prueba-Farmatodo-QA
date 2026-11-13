// Component: the counters panel (words, characters). Exposes values, never assertions.
class StatsPanel {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.wordCount = page.locator('#word_count');
    this.characterCount = page.locator('#character_count');
  }

  async words() {
    return Number((await this.wordCount.innerText()).trim());
  }

  async characters() {
    return Number((await this.characterCount.innerText()).trim());
  }
}

module.exports = { StatsPanel };

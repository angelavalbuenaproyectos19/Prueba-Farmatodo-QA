// Component: the counters panel (words, characters). Exposes values, never assertions.
class StatsPanel {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.wordCount = page.locator('#word_count');
    this.characterCount = page.locator('#character_count');
  }

  // The site formats thousands (e.g. "2,499"), so separators are stripped before parsing.
  static parse(text) {
    return Number(text.trim().replace(/,/g, ''));
  }

  async words() {
    return StatsPanel.parse(await this.wordCount.innerText());
  }

  async characters() {
    return StatsPanel.parse(await this.characterCount.innerText());
  }
}

module.exports = { StatsPanel };

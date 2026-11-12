// Page Object for https://wordcounter.net/ (default configuration, no settings changed).
class WordCounterPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.textBox = page.locator('#box');
    this.wordCount = page.locator('#word_count');
    this.characterCount = page.locator('#character_count');
    this.keywordItems = page.locator('#kwd-accordion-data .list-group-item');
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.textBox.waitFor();
  }

  /** @param {string} text */
  async enterText(text) {
    await this.textBox.fill(text);
  }

  async words() {
    return Number((await this.wordCount.innerText()).trim());
  }

  async characters() {
    return Number((await this.characterCount.innerText()).trim());
  }

  /** @returns {Promise<{word: string, count: number}[]>} */
  async topKeywords(limit = 3) {
    const n = Math.min(await this.keywordItems.count(), limit);
    const out = [];
    for (let i = 0; i < n; i++) {
      const item = this.keywordItems.nth(i);
      const word = (await item.locator('.word').innerText()).trim();
      const badge = (await item.locator('.badge').innerText()).trim(); // e.g. "6 (43%)"
      out.push({ word, count: Number(badge.split(' ')[0]) });
    }
    return out;
  }
}

module.exports = { WordCounterPage };

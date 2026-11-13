// Component: the "Keyword Density" panel.
class KeywordDensityPanel {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.items = page.locator('#kwd-accordion-data .list-group-item');
  }

  /** @returns {Promise<{word: string, count: number}[]>} */
  async top(limit = 3) {
    const n = Math.min(await this.items.count(), limit);
    const out = [];
    for (let i = 0; i < n; i++) {
      const item = this.items.nth(i);
      const word = (await item.locator('.word').innerText()).trim();
      const badge = (await item.locator('.badge').innerText()).trim(); // e.g. "6 (43%)"
      out.push({ word, count: Number(badge.split(' ')[0]) });
    }
    return out;
  }

  async topCounts(limit = 3) {
    return (await this.top(limit)).map((k) => k.count);
  }
}

module.exports = { KeywordDensityPanel };

// Component: the "Keyword Density" panel.
class KeywordDensityPanel {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.items = page.locator('#kwd-accordion-data .list-group-item');
    this.list = page.locator('#kwd-accordion-data');
  }

  async isEmpty() {
    // The empty state renders a placeholder row with the same class, so count only rows holding a word.
    return (await this.items.locator('.word').count()) === 0;
  }

  /** @returns {Promise<{word: string, count: number, percent: number}[]>} */
  async top(limit = 3) {
    const n = Math.min(await this.items.count(), limit);
    const out = [];
    for (let i = 0; i < n; i++) {
      const item = this.items.nth(i);
      const word = (await item.locator('.word').innerText()).trim();
      const badge = (await item.locator('.badge').innerText()).trim(); // e.g. "6 (43%)"
      // The site first renders rows with an empty badge and fills it ~1s later (see OPP-02): skip until ready.
      const m = badge.match(/(\d[\d,]*)\s*\((\d+)%\)/);
      if (!m) continue;
      const [, count, percent] = m;
      out.push({ word, count: Number(count.replace(/,/g, '')), percent: Number(percent) });
    }
    return out;
  }

  async topCounts(limit = 3) {
    return (await this.top(limit)).map((k) => k.count);
  }
}

module.exports = { KeywordDensityPanel };

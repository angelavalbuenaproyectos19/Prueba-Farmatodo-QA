const { parseNumber } = require('../../utils/number');

// Componente: panel "Keyword Density".
class KeywordDensityPanel {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.panel = page.locator('#kwd-density');
    this.items = page.locator('#kwd-accordion-data .list-group-item');
  }

  async isEmpty() {
    // El estado vacío muestra una fila de ayuda con la misma clase, por eso se cuentan solo las filas que contienen una palabra.
    return (await this.items.locator('.word').count()) === 0;
  }

  /** @returns {Promise<{word: string, count: number, percent: number}[]>} */
  async top(limit = 3) {
    const n = Math.min(await this.items.count(), limit);
    const out = [];
    for (let i = 0; i < n; i++) {
      const item = this.items.nth(i);
      const word = (await item.locator('.word').innerText()).trim();
      const badge = (await item.locator('.badge').innerText()).trim(); // ej. "6 (43%)"
      // El sitio primero dibuja las filas con el contador vacío y lo llena ~1 s después (ver OPP-02): se omiten hasta que estén listas.
      const match = badge.match(/(\d[\d,]*)\s*\((\d+)%\)/);
      if (!match) continue;
      out.push({ word, count: parseNumber(match[1]), percent: Number(match[2]) });
    }
    return out;
  }

  async topCounts(limit = 3) {
    return (await this.top(limit)).map((k) => k.count);
  }
}

module.exports = { KeywordDensityPanel };

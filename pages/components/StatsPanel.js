// Componente: panel de contadores (palabras, caracteres). Expone valores, nunca aserciones.
class StatsPanel {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.wordCount = page.locator('#word_count');
    this.characterCount = page.locator('#character_count');
    // Métricas opcionales, ocultas por defecto; se activan en Options > Details.
    this.charactersNoSpaces = page.locator('#character_count_no_spaces');
    this.uniqueWords = page.locator('#unique_word_count');
    this.lines = page.locator('#lines_count');
  }

  // El sitio formatea los miles (ej. "2,499"), por eso se quitan los separadores antes de convertir a número.
  static parse(text) {
    return Number(text.trim().replace(/,/g, ''));
  }

  async words() {
    return StatsPanel.parse(await this.wordCount.innerText());
  }

  async metric(locator) {
    return StatsPanel.parse(await locator.innerText());
  }

  async characters() {
    return StatsPanel.parse(await this.characterCount.innerText());
  }
}

module.exports = { StatsPanel };

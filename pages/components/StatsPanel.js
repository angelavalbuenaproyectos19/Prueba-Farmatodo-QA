const { parseNumber } = require('../../utils/number');

// Registro de métricas: para agregar una nueva basta con sumar una entrada (nombre -> selector).
// Las métricas opcionales están ocultas por defecto; se activan en Options > Details.
const METRIC_SELECTORS = {
  words: '#word_count',
  characters: '#character_count',
  charactersNoSpaces: '#character_count_no_spaces',
  uniqueWords: '#unique_word_count',
  lines: '#lines_count',
};

// Componente: panel de contadores. Expone valores y localizadores, nunca aserciones.
class StatsPanel {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.locators = Object.fromEntries(
      Object.entries(METRIC_SELECTORS).map(([name, selector]) => [name, page.locator(selector)])
    );
  }

  /** @param {keyof typeof METRIC_SELECTORS} name */
  locator(name) {
    const locator = this.locators[name];
    if (!locator)
      throw new Error(`Métrica desconocida "${name}". Disponibles: ${Object.keys(this.locators).join(', ')}`);
    return locator;
  }

  /** Valor numérico actual de una métrica. */
  async value(name) {
    return parseNumber(await this.locator(name).innerText());
  }
}

module.exports = { StatsPanel, METRIC_SELECTORS };

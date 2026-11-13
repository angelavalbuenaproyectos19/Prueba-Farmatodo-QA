const { BasePage } = require('./BasePage');
const { StatsPanel } = require('./components/StatsPanel');
const { KeywordDensityPanel } = require('./components/KeywordDensityPanel');
const { OptionsPanel } = require('./components/OptionsPanel');

// Page Object de https://wordcounter.net/ (configuración por defecto, sin modificar ajustes del sitio).
class WordCounterPage extends BasePage {
  /**
   * Los componentes se pueden inyectar (útil para sustituirlos o simularlos); por defecto se crean aquí.
   * @param {import('@playwright/test').Page} page
   */
  constructor(
    page,
    { stats = new StatsPanel(page), keywords = new KeywordDensityPanel(page), options = new OptionsPanel(page) } = {}
  ) {
    super(page);
    this.textBox = page.locator('#box');
    this.stats = stats;
    this.keywords = keywords;
    this.options = options;
  }

  async goto() {
    await this.open('/');
    await this.textBox.waitFor();
  }

  /** @param {string} text */
  async enterText(text) {
    await this.textBox.fill(text);
  }

  /** Escribe al final del texto actual, tecla por tecla (prueba las actualizaciones en vivo). */
  async appendText(text) {
    await this.textBox.pressSequentially(text);
  }

  async clear() {
    await this.textBox.fill('');
  }
}

module.exports = { WordCounterPage };

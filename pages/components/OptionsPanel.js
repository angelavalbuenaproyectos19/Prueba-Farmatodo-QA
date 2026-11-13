const { expect } = require('@playwright/test');

// Componente: modal "Options" (pestañas: General, Details, Keyword Density, ...).
// Los cambios se aplican desde la interfaz real. Cada prueba parte de la configuración por defecto.
class OptionsPanel {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.modal = page.locator('#options-modal');

    // Registro de opciones de Keyword Density: para agregar una nueva basta con sumar una entrada
    // (nombre -> acción). El orden del registro es el orden en que se aplican.
    const campos = {
      includeCommonWords: page.locator('#stopWordsCommon'),
      amount: page.locator('#keywordDensityAmount'),
      consecutive: page.locator('#keywordDensityConsecutive'),
      show: page.locator('#show-keyword-density'),
    };
    this.keywordDensityOptions = {
      includeCommonWords: (value) => campos.includeCommonWords.setChecked(value),
      amount: (value) => this.setNumber(campos.amount, value),
      consecutive: (value) => this.setNumber(campos.consecutive, value),
      show: (value) => campos.show.setChecked(value),
    };
  }

  /** @param {'general'|'details'|'keyword-density'|'activity'|'buttons'|'flow-score'} tab */
  async open(tab) {
    const opener = this.page.locator(`[data-tab="${tab}"]:visible`).first();
    const pane = this.modal.locator(`#${tab}`);
    // El sitio enlaza sus eventos un instante después de escribir: se reintenta el clic hasta que el panel se abra.
    await expect(async () => {
      await opener.click({ timeout: 5000 });
      await expect(pane).toBeVisible({ timeout: 3000 });
    }).toPass({ timeout: 30_000 });
  }

  async close() {
    await this.page.keyboard.press('Escape');
    await this.modal.waitFor({ state: 'hidden' });
  }

  async setNumber(input, value) {
    await input.fill(String(value));
    await input.press('Tab');
  }

  /**
   * Aplica opciones de Keyword Density desde la interfaz y cierra el modal.
   * @param {{includeCommonWords?: boolean, amount?: number, consecutive?: number, show?: boolean}} options
   */
  async configureKeywordDensity(options = {}) {
    const unknown = Object.keys(options).filter((name) => !(name in this.keywordDensityOptions));
    if (unknown.length) throw new Error(`Opciones desconocidas: ${unknown.join(', ')}`);
    await this.open('keyword-density');
    for (const [name, apply] of Object.entries(this.keywordDensityOptions)) {
      if (name in options) await apply(options[name]);
    }
    await this.close();
  }

  /**
   * Pestaña Details: alterna cada switch de métrica indicado (ej. 'chk_unique_word_count') y cierra el modal.
   * @param {string[]} ids
   */
  async toggleDetails(ids) {
    await this.open('details');
    for (const id of ids) await this.page.locator(`.bootstrap-switch-id-${id}`).click();
    await this.close();
  }
}

module.exports = { OptionsPanel };

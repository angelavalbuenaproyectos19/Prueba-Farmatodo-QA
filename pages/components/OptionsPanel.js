const { expect } = require('@playwright/test');

// Componente: modal "Options" (pestañas: General, Details, Keyword Density, ...).
// Los cambios se aplican desde la interfaz real. Cada prueba parte de la configuración por defecto.
class OptionsPanel {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.modal = page.locator('#options-modal');
    this.includeCommonWords = page.locator('#stopWordsCommon');
    this.showKeywordDensity = page.locator('#show-keyword-density');
    this.keywordAmount = page.locator('#keywordDensityAmount');
    this.keywordConsecutive = page.locator('#keywordDensityConsecutive');
  }

  /** @param {'general'|'details'|'keyword-density'|'activity'|'buttons'|'flow-score'} tab */
  async open(tab) {
    const opener = this.page.locator(`[data-tab="${tab}"]`).first();
    const pane = this.modal.locator(`#${tab}`);
    // El sitio enlaza sus eventos un instante después de escribir: se reintenta el clic hasta que el panel se abra.
    await expect(async () => {
      await opener.click({ force: true });
      await expect(pane).toBeVisible({ timeout: 1500 });
    }).toPass({ timeout: 20_000 });
  }

  async close() {
    await this.page.keyboard.press('Escape');
    await this.modal.waitFor({ state: 'hidden' });
  }

  /** Pestaña Details: activa o desactiva el switch de una métrica, ej. 'chk_unique_word_count'. */
  async toggleDetail(id) {
    await this.page.locator(`.bootstrap-switch-id-${id}`).click();
  }

  async setNumber(input, value) {
    await input.fill(String(value));
    await input.press('Tab');
    await input.dispatchEvent('change');
  }

  /**
   * Aplica las opciones de Keyword Density desde la interfaz y cierra el modal.
   * @param {{includeCommonWords?: boolean, amount?: number, consecutive?: number, show?: boolean}} o
   */
  async configureKeywordDensity({ includeCommonWords, amount, consecutive, show } = {}) {
    await this.open('keyword-density');
    if (includeCommonWords !== undefined) await this.includeCommonWords.setChecked(includeCommonWords);
    if (amount !== undefined) await this.setNumber(this.keywordAmount, amount);
    if (consecutive !== undefined) await this.setNumber(this.keywordConsecutive, consecutive);
    if (show !== undefined) await this.showKeywordDensity.setChecked(show);
    await this.close();
  }

  /** Pestaña Details: alterna cada switch de métrica indicado y cierra el modal. */
  async toggleDetails(ids) {
    await this.open('details');
    for (const id of ids) await this.toggleDetail(id);
    await this.close();
  }
}

module.exports = { OptionsPanel };

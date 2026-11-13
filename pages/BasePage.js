// Clase base de todos los page objects: guarda la página de Playwright y la navegación común.
class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /** @param {string} path ruta relativa a baseURL */
  async open(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}

module.exports = { BasePage };

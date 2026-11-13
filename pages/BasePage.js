// Base class for every page object: owns the Playwright page and common navigation.
class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /** @param {string} path relative to baseURL */
  async open(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}

module.exports = { BasePage };

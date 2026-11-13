// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  forbidOnly: !!process.env.CI, // en CI falla si queda un test.only olvidado
  retries: process.env.CI ? 2 : 1,
  reporter: [['list'], ['html', { open: 'never' }], ['./reporters/summary-reporter.js', { outputDir: 'reports' }]],
  use: {
    baseURL: 'https://wordcounter.net',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    channel: process.env.PW_CHANNEL || undefined, // ej. PW_CHANNEL=chrome para usar el Google Chrome instalado
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});

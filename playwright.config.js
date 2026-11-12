// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['./reporters/summary-reporter.js', { outputDir: 'reports' }],
  ],
  use: {
    baseURL: 'https://wordcounter.net',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});

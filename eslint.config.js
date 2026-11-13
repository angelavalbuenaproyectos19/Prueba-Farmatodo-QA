const js = require('@eslint/js');
const globals = require('globals');
const playwright = require('eslint-plugin-playwright');

module.exports = [
  { ignores: ['node_modules/', 'test-results/', 'playwright-report/', 'reports/'] },
  js.configs.recommended,
  {
    languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs', globals: globals.node },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
  // Reglas de buenas prácticas de Playwright solo para las pruebas.
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/e2e/**/*.js'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Helpers de pruebas que contienen las aserciones (la regla no las ve dentro de la función).
      'playwright/expect-expect': ['warn', { assertFunctionNames: ['comprobarTop3'] }],
    },
  },
];

# Prueba Audifarma - QA automation

| Part | Where |
|------|-------|
| 1. Automated suite (Playwright + JavaScript) | `tests/`, `pages/`, `reporters/` |
| 2. Failure report | `docs/REPORTE_FALLAS.md` |
| 4. Word frequency counter (standalone) | `contador-frecuencia/` |

The Playwright framework covers parts 1 and 2 only.

## Run the automated suite
Requires Node.js 18+.
```bash
npm install
npx playwright install chromium
npm test            # runs the suite and prints the summary
npm run report      # opens the HTML report
```
The summary (executed / passed / failed + error description) is printed at the end and saved to `reports/summary.txt`.

Structure (Page Object Model):
```
pages/BasePage.js                    base class (page + navigation)
pages/WordCounterPage.js             page object, composes the components below
pages/components/StatsPanel.js       Words / Characters counters
pages/components/KeywordDensityPanel.js  Keyword Density list
fixtures/index.js                    Playwright fixtures injecting page objects
test-data/scenarios.js               scenario data (IDs, inputs, expected values)
tests/e2e/wordcounter.spec.js        specs: assertions only, no selectors
reporters/summary-reporter.js        executed / passed / failed + error description
```
Scenarios are listed in `docs/ESCENARIOS.md`.

One scenario (`KD-05`, known defect BUG-02) fails on purpose: it documents a real site defect.

## Word frequency counter (part 4)
```bash
cd contador-frecuencia
npm start           # node cli.js data/sample.txt
npm test
```
Complexity: O(n) time to tokenize and count (n = characters), plus O(k log k) to sort the k distinct words; O(k) extra space.

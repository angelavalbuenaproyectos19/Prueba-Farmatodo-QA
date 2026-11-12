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

Structure: Page Object (`pages/WordCounterPage.js`), data-driven scenarios (`tests/e2e/wordcounter.spec.js`), custom reporter (`reporters/summary-reporter.js`). Expected values are fixed in the spec, independent from the site.

One scenario (`word "luna" (known defect BUG-02)`) fails on purpose: it documents a real site defect.

## Word frequency counter (part 4)
```bash
cd contador-frecuencia
npm start           # node cli.js data/sample.txt
npm test
```
Complexity: O(n) time to tokenize and count (n = characters), plus O(k log k) to sort the k distinct words; O(k) extra space.

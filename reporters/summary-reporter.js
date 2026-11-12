// Custom reporter: total / passed / failed scenarios plus the error description of each failure.
const fs = require('node:fs');
const path = require('node:path');

const strip = (s) => String(s || '').replace(/\u001b\[[0-9;]*m/g, '');

class SummaryReporter {
  constructor(options = {}) {
    this.outputDir = options.outputDir || 'reports';
    this.results = [];
  }

  onTestEnd(test, result) {
    // With retries, keep only the final attempt.
    const entry = { title: test.titlePath().slice(1).join(' > '), status: result.status, error: result.error };
    const i = this.results.findIndex((r) => r.title === entry.title);
    if (i >= 0) this.results[i] = entry; else this.results.push(entry);
  }

  onEnd() {
    const passed = this.results.filter((r) => r.status === 'passed').length;
    const failed = this.results.filter((r) => ['failed', 'timedOut', 'interrupted'].includes(r.status));
    const skipped = this.results.length - passed - failed.length;
    const lines = [
      '=== TEST SUMMARY ===',
      `Executed: ${this.results.length}`,
      `Passed:   ${passed}`,
      `Failed:   ${failed.length}`,
      `Skipped:  ${skipped}`,
    ];
    if (failed.length) {
      lines.push('', 'Failures:');
      failed.forEach((f, i) => {
        const msg = strip(f.error && (f.error.message || f.error.value)).split('\n').slice(0, 6).join('\n    ');
        lines.push(`${i + 1}. ${f.title}`, `    ${msg}`);
      });
    }
    const text = lines.join('\n');
    fs.mkdirSync(this.outputDir, { recursive: true });
    fs.writeFileSync(path.join(this.outputDir, 'summary.txt'), text + '\n');
    console.log('\n' + text + '\n');
  }
}

module.exports = SummaryReporter;

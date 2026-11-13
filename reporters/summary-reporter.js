// Reporter personalizado: recolecta los resultados y delega el formato en `format-summary`.
const fs = require('node:fs');
const path = require('node:path');
const { formatSummary } = require('./format-summary');

class SummaryReporter {
  constructor(options = {}) {
    this.outputDir = options.outputDir || 'reports';
    this.results = new Map(); // clave: id único de la prueba (los títulos pueden repetirse)
  }

  onTestEnd(test, result) {
    // Con reintentos, se conserva solo el último intento.
    this.results.set(test.id, {
      title: test.titlePath().slice(1).join(' > '),
      status: result.status,
      error: result.error,
    });
  }

  onEnd() {
    const text = formatSummary([...this.results.values()]);
    fs.mkdirSync(this.outputDir, { recursive: true });
    fs.writeFileSync(path.join(this.outputDir, 'summary.txt'), text + '\n');
    console.log('\n' + text + '\n');
  }
}

module.exports = SummaryReporter;

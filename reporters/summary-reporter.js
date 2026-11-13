// Reporter personalizado: total de escenarios ejecutados, aprobados y fallidos, con la descripción del error de cada falla.
const fs = require('node:fs');
const path = require('node:path');

const strip = (s) => String(s || '').replace(/\u001b\[[0-9;]*m/g, '');

class SummaryReporter {
  constructor(options = {}) {
    this.outputDir = options.outputDir || 'reports';
    this.results = [];
  }

  onTestEnd(test, result) {
    // Con reintentos, se conserva solo el último intento.
    const entry = { title: test.titlePath().slice(1).join(' > '), status: result.status, error: result.error };
    const i = this.results.findIndex((r) => r.title === entry.title);
    if (i >= 0) this.results[i] = entry; else this.results.push(entry);
  }

  onEnd() {
    const passed = this.results.filter((r) => r.status === 'passed').length;
    const failed = this.results.filter((r) => ['failed', 'timedOut', 'interrupted'].includes(r.status));
    const skipped = this.results.length - passed - failed.length;
    const lines = [
      '=== RESUMEN DE PRUEBAS ===',
      `Ejecutados: ${this.results.length}`,
      `Aprobados:  ${passed}`,
      `Fallidos:   ${failed.length}`,
      `Omitidos:   ${skipped}`,
    ];
    lines.push('', 'Escenarios:');
    this.results.forEach((r, i) => {
      const mark = r.status === 'passed' ? 'APROBADO' : r.status === 'skipped' ? 'OMITIDO' : 'FALLIDO';
      lines.push(`${String(i + 1).padStart(2, '0')}. [${mark}] ${r.title}`);
    });
    if (failed.length) {
      lines.push('', 'Fallas:');
      failed.forEach((f, i) => {
        const msg = strip(f.error && (f.error.message || f.error.value)).split('\n').filter((l) => l.trim()).slice(0, 14).join('\n    ');
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

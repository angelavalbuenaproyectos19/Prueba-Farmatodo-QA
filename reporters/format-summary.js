// Formato puro del resumen de pruebas (sin lectura ni escritura): fácil de probar y de reutilizar.
const { stripVTControlCharacters } = require('node:util');

const FALLAS = ['failed', 'timedOut', 'interrupted'];

const quitarColores = (texto) => stripVTControlCharacters(String(texto || ''));

function estadoLegible(status) {
  if (status === 'passed') return 'APROBADO';
  if (status === 'skipped') return 'OMITIDO';
  return 'FALLIDO';
}

/**
 * @param {{title: string, status: string, error?: {message?: string, value?: string}}[]} resultados
 * @returns {string}
 */
function formatSummary(resultados) {
  const aprobados = resultados.filter((r) => r.status === 'passed').length;
  const fallidos = resultados.filter((r) => FALLAS.includes(r.status));
  const omitidos = resultados.length - aprobados - fallidos.length;

  const lineas = [
    '=== RESUMEN DE PRUEBAS ===',
    `Ejecutados: ${resultados.length}`,
    `Aprobados:  ${aprobados}`,
    `Fallidos:   ${fallidos.length}`,
    `Omitidos:   ${omitidos}`,
    '',
    'Escenarios:',
  ];
  resultados.forEach((r, i) => {
    lineas.push(`${String(i + 1).padStart(2, '0')}. [${estadoLegible(r.status)}] ${r.title}`);
  });

  if (fallidos.length) {
    lineas.push('', 'Fallas:');
    fallidos.forEach((f, i) => {
      const detalle = quitarColores(f.error && (f.error.message || f.error.value))
        .split('\n')
        .filter((linea) => linea.trim())
        .slice(0, 14)
        .join('\n    ');
      lineas.push(`${i + 1}. ${f.title}`, `    ${detalle}`);
    });
  }
  return lineas.join('\n');
}

module.exports = { formatSummary };

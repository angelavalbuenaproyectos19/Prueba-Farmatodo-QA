const test = require('node:test');
const assert = require('node:assert/strict');
const { formatSummary } = require('../../reporters/format-summary');

test('cuenta ejecutados, aprobados, fallidos y omitidos', () => {
  const texto = formatSummary([
    { title: 'a', status: 'passed' },
    { title: 'b', status: 'failed', error: { message: 'boom' } },
    { title: 'c', status: 'skipped' },
  ]);
  assert.match(texto, /Ejecutados: 3/);
  assert.match(texto, /Aprobados: {2}1/);
  assert.match(texto, /Fallidos: {3}1/);
  assert.match(texto, /Omitidos: {3}1/);
});

test('lista todos los escenarios con su estado', () => {
  const texto = formatSummary([
    { title: 'a', status: 'passed' },
    { title: 'b', status: 'timedOut' },
  ]);
  assert.match(texto, /01\. \[APROBADO\] a/);
  assert.match(texto, /02\. \[FALLIDO\] b/);
});

test('incluye la descripción del error sin códigos de color', () => {
  const texto = formatSummary([{ title: 'b', status: 'failed', error: { message: '\u001b[31mfallo rojo\u001b[0m' } }]);
  assert.match(texto, /Fallas:/);
  assert.match(texto, /fallo rojo/);
  assert.ok(!texto.includes('\u001b'));
});

test('sin fallas no imprime la sección Fallas', () => {
  assert.doesNotMatch(formatSummary([{ title: 'a', status: 'passed' }]), /Fallas:/);
});

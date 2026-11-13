const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { analyze, format } = require('../wordFrequency');

test('coincide con la salida exacta del enunciado', () => {
  const text = fs.readFileSync(path.join(__dirname, '../data/sample.txt'), 'utf8');
  const expected = ['14 words', '99 characters', '', 'farmatodo: 6', 'cuida: 3', 'salud: 2', 'tu: 2', 'toda: 1'].join('\n');
  assert.equal(format(analyze(text)), expected);
});

test('los empates se ordenan alfabéticamente', () => {
  const { frequencies } = analyze('b a c a b c');
  assert.deepEqual(frequencies, [['a', 2], ['b', 2], ['c', 2]]);
});

test('los saltos de línea no cuentan como caracteres, los espacios sí', () => {
  assert.equal(analyze('a b\nc').characters, 4);
});

test('un texto vacío da cero palabras y cero caracteres', () => {
  assert.deepEqual(analyze(''), { words: 0, characters: 0, frequencies: [] });
});

test('el conteo no distingue mayúsculas de minúsculas', () => {
  assert.deepEqual(analyze('Sol sol SOL').frequencies, [['sol', 3]]);
});

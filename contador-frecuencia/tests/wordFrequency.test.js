const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { analyze, format } = require('../wordFrequency');

test('matches the exact output from the challenge statement', () => {
  const text = fs.readFileSync(path.join(__dirname, '../data/sample.txt'), 'utf8');
  const expected = ['14 words', '99 characters', '', 'farmatodo: 6', 'cuida: 3', 'salud: 2', 'tu: 2', 'toda: 1'].join('\n');
  assert.equal(format(analyze(text)), expected);
});

test('ties are ordered alphabetically', () => {
  const { frequencies } = analyze('b a c a b c');
  assert.deepEqual(frequencies, [['a', 2], ['b', 2], ['c', 2]]);
});

test('line breaks are not counted as characters, spaces are', () => {
  assert.equal(analyze('a b\nc').characters, 4);
});

test('empty text yields zero words and characters', () => {
  assert.deepEqual(analyze(''), { words: 0, characters: 0, frequencies: [] });
});

test('counting is case insensitive', () => {
  assert.deepEqual(analyze('Sol sol SOL').frequencies, [['sol', 3]]);
});

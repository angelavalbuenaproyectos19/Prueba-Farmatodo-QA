#!/usr/bin/env node
const fs = require('node:fs');
const { analyze, format } = require('./wordFrequency');

const file = process.argv[2];
if (!file) {
  console.error('Uso: node cli.js <archivo-de-texto>');
  process.exit(1);
}
console.log(format(analyze(fs.readFileSync(file, 'utf8'))));

'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { renderExpanded, renderCompact } = require('../scripts/sync-stations.js');
const { extractFromJs } = require('./helpers/extract-stations.js');

const sample = [
  { id: 'a', name: 'A', mark: 'A', streamUrl: 'https://a/', siteUrl: 'https://a', color: '#000' },
  { id: 'b', name: 'B', mark: 'B', streamUrl: 'https://b/', siteUrl: 'https://b', color: '#fff', textColor: '#111' }
];

test('expanded output round-trips', () => {
  assert.deepStrictEqual(extractFromJs(renderExpanded(sample)), sample);
});

test('compact output round-trips', () => {
  assert.deepStrictEqual(extractFromJs(renderCompact(sample)), sample);
});

test('expanded output uses one field per line', () => {
  assert.match(renderExpanded(sample), /\n {4}id: 'a',\n {4}name: 'A',/);
});

test('compact output uses one station per line', () => {
  assert.match(renderCompact(sample), /\n {6}\{ id: 'a', name: 'A'.*\},\n/);
});

test('optional textColor is preserved and omitted when absent', () => {
  assert.ok(!renderExpanded(sample).includes("textColor: '#111',\n    id: 'a'"));
  assert.ok(renderExpanded(sample).includes("textColor: '#111'"));
});

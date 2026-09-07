'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { renderExpanded, renderCompact, replaceBlock } = require('../scripts/sync-stations.js');
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

test('expanded output preserves the full field order for every station', () => {
  const output = renderExpanded(sample);
  assert.match(
    output,
    /id: 'a',\n {4}name: 'A',\n {4}mark: 'A',\n {4}streamUrl: 'https:\/\/a\/',\n {4}siteUrl: 'https:\/\/a',\n {4}color: '#000'\n/
  );
  assert.match(
    output,
    /id: 'b',\n {4}name: 'B',\n {4}mark: 'B',\n {4}streamUrl: 'https:\/\/b\/',\n {4}siteUrl: 'https:\/\/b',\n {4}color: '#fff',\n {4}textColor: '#111'\n/
  );
});

test('compact output preserves the full field order for every station', () => {
  const output = renderCompact(sample);
  assert.match(
    output,
    /\{ id: 'a', name: 'A', mark: 'A', streamUrl: 'https:\/\/a\/', siteUrl: 'https:\/\/a', color: '#000' \}/
  );
  assert.match(
    output,
    /\{ id: 'b', name: 'B', mark: 'B', streamUrl: 'https:\/\/b\/', siteUrl: 'https:\/\/b', color: '#fff', textColor: '#111' \}/
  );
});

test('replaceBlock throws instead of corrupting the file when no `;` follows the array', () => {
  const source = "const STATIONS = [\n  { id: 'a' }\n]\n";
  assert.throws(() => replaceBlock(source, 'REPLACED'), /no `;` found after STATIONS array/);
});

test('replaceBlock throws instead of corrupting the file when the array has no trailing newline', () => {
  const source = "const STATIONS = [\n  { id: 'a' }\n];";
  assert.throws(
    () => replaceBlock(source, 'REPLACED'),
    /no trailing newline found after `const STATIONS = \[\.\.\.\];` statement/
  );
});

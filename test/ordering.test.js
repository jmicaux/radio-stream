'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { sort, record } = require('../shared/ordering.js');

const catalogue = [
  { id: 'a' }, { id: 'b' }, { id: 'c' }
];
const ids = (list) => list.map((station) => station.id);

test('empty usage keeps the catalogue order', () => {
  assert.deepStrictEqual(ids(sort(catalogue, {})), ['a', 'b', 'c']);
});

test('higher play count comes first', () => {
  const usage = { c: { count: 5, lastPlayedAt: 1 }, a: { count: 2, lastPlayedAt: 9 } };
  assert.deepStrictEqual(ids(sort(catalogue, usage)), ['c', 'a', 'b']);
});

test('equal counts are broken by most recent play', () => {
  const usage = { a: { count: 3, lastPlayedAt: 10 }, b: { count: 3, lastPlayedAt: 99 } };
  assert.deepStrictEqual(ids(sort(catalogue, usage)), ['b', 'a', 'c']);
});

test('equal count and timestamp fall back to catalogue rank', () => {
  const usage = { b: { count: 1, lastPlayedAt: 7 }, a: { count: 1, lastPlayedAt: 7 } };
  assert.deepStrictEqual(ids(sort(catalogue, usage)), ['a', 'b', 'c']);
});

test('usage for a removed station is ignored', () => {
  const usage = { gone: { count: 99, lastPlayedAt: 99 }, b: { count: 1, lastPlayedAt: 1 } };
  assert.deepStrictEqual(ids(sort(catalogue, usage)), ['b', 'a', 'c']);
});

test('sort does not mutate its arguments', () => {
  const usage = { a: { count: 1, lastPlayedAt: 1 } };
  const frozen = Object.freeze(catalogue.slice());
  sort(frozen, usage);
  assert.deepStrictEqual(ids(frozen), ['a', 'b', 'c']);
});

test('record increments the count and stamps the time', () => {
  const next = record({}, 'a', 1234);
  assert.deepStrictEqual(next.a, { count: 1, lastPlayedAt: 1234 });
});

test('record accumulates on an existing entry', () => {
  const next = record({ a: { count: 2, lastPlayedAt: 1 } }, 'a', 5678);
  assert.deepStrictEqual(next.a, { count: 3, lastPlayedAt: 5678 });
});

test('record does not mutate the usage it is given', () => {
  const before = { a: { count: 1, lastPlayedAt: 1 } };
  record(before, 'a', 999);
  assert.deepStrictEqual(before.a, { count: 1, lastPlayedAt: 1 });
});

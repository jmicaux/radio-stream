'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { reduce } = require('../shared/playback-machine.js');

const cases = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'shared', 'playback-states.json'), 'utf8')
);

test('the case table is not empty', () => {
  assert.ok(cases.length >= 18);
});

for (const item of cases) {
  test(`${item.from} + ${item.event} -> ${item.to} (${item.why})`, () => {
    assert.strictEqual(reduce(item.from, item.event), item.to);
  });
}

test('an unknown event leaves the state untouched', () => {
  assert.strictEqual(reduce('playing', 'nonsense'), 'playing');
});

test('every state in the table is one of the four known states', () => {
  const known = new Set(['stopped', 'connecting', 'playing', 'error']);
  for (const item of cases) {
    assert.ok(known.has(item.from), `unknown from: ${item.from}`);
    assert.ok(known.has(item.to), `unknown to: ${item.to}`);
  }
});

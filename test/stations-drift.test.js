'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { extractFromJs } = require('./helpers/extract-stations.js');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const stations = JSON.parse(read('shared/stations.json'));

test('the catalogue holds 30 stations', () => {
  assert.strictEqual(stations.length, 30);
});

test('every station has the required keys', () => {
  for (const station of stations) {
    for (const key of ['id', 'name', 'mark', 'streamUrl', 'siteUrl', 'color']) {
      assert.ok(station[key], `${station.id || '?'} is missing ${key}`);
    }
  }
});

test('station ids are unique', () => {
  const ids = stations.map((station) => station.id);
  assert.strictEqual(new Set(ids).size, ids.length);
});

test('background.js matches stations.json', () => {
  assert.deepStrictEqual(extractFromJs(read('background.js')), stations);
});

test('index.html matches stations.json', () => {
  assert.deepStrictEqual(extractFromJs(read('index.html')), stations);
});

test('ios/www/stations.json matches shared/stations.json', (t) => {
  const iosPath = path.join(root, 'ios/www/stations.json');
  if (!fs.existsSync(iosPath)) {
    t.skip('ios/www/stations.json does not exist yet (created in Task 5)');
    return;
  }
  const iosContent = fs.readFileSync(iosPath, 'utf8');
  const sharedContent = read('shared/stations.json');
  assert.strictEqual(iosContent, sharedContent, 'ios/www/stations.json must be byte-identical to shared/stations.json');
});

test('ios/www/ordering.js matches shared/ordering.js', (t) => {
  const iosPath = path.join(root, 'ios/www/ordering.js');
  const sharedPath = path.join(root, 'shared/ordering.js');
  if (!fs.existsSync(iosPath) || !fs.existsSync(sharedPath)) {
    t.skip('ios/www/ordering.js or shared/ordering.js does not exist yet (created in Task 5)');
    return;
  }
  const iosContent = fs.readFileSync(iosPath, 'utf8');
  const sharedContent = fs.readFileSync(sharedPath, 'utf8');
  assert.strictEqual(iosContent, sharedContent, 'ios/www/ordering.js must be byte-identical to shared/ordering.js');
});

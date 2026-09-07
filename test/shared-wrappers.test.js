'use strict';
// Locks in the UMD wrapper fix from Task 5's review: shared/ordering.js and
// shared/playback-machine.js must expose their global (`RadioOrdering` /
// `RadioPlaybackMachine`) even when a page-level `module` object exists,
// as happens in some WebView/bundler runtimes. Before the fix, the presence
// of such a `module` decoy routed the API into `module.exports` only,
// leaving the global undefined and the touch interface silently empty.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

// Simulates a browser page where some other script (a bundler shim, a
// CommonJS-interop polyfill) has defined a global `module` object before
// this file loads. `window` is `globalThis` itself, matching a real page.
function runWithHostileModuleShim(source) {
  const sandbox = {};
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.module = { exports: {} }; // the hostile decoy
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox;
}

test('ordering.js defines RadioOrdering even with a hostile module shim present', () => {
  const sandbox = runWithHostileModuleShim(read('shared/ordering.js'));
  assert.strictEqual(typeof sandbox.RadioOrdering, 'object');
  const usage = {};
  const stations = [{ id: 'a' }, { id: 'b' }];
  const sorted = sandbox.RadioOrdering.sort(stations, usage);
  assert.deepStrictEqual(sorted.map((s) => s.id), ['a', 'b']);
  const recorded = sandbox.RadioOrdering.record(usage, 'b', 1000);
  assert.strictEqual(recorded.b.count, 1);
});

test('playback-machine.js defines RadioPlaybackMachine even with a hostile module shim present', () => {
  const sandbox = runWithHostileModuleShim(read('shared/playback-machine.js'));
  assert.strictEqual(typeof sandbox.RadioPlaybackMachine, 'object');
  assert.strictEqual(sandbox.RadioPlaybackMachine.reduce('stopped', 'play'), 'connecting');
  assert.strictEqual(sandbox.RadioPlaybackMachine.reduce('connecting', 'connected'), 'playing');
});

// Simulates a Chrome extension service worker: no `window`, no `module`,
// only `globalThis` (files are loaded via `importScripts`).
function runAsServiceWorker(source) {
  const sandbox = {};
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox;
}

test('ordering.js defines RadioOrdering in a service-worker-like context (no window, no module)', () => {
  const sandbox = runAsServiceWorker(read('shared/ordering.js'));
  assert.strictEqual(typeof sandbox.RadioOrdering, 'object');
  assert.strictEqual(typeof sandbox.RadioOrdering.sort, 'function');
});

test('playback-machine.js defines RadioPlaybackMachine in a service-worker-like context (no window, no module)', () => {
  const sandbox = runAsServiceWorker(read('shared/playback-machine.js'));
  assert.strictEqual(typeof sandbox.RadioPlaybackMachine, 'object');
  assert.strictEqual(sandbox.RadioPlaybackMachine.reduce('playing', 'stop'), 'stopped');
});

test('ordering.js still works via Node CommonJS require()', () => {
  delete require.cache[require.resolve('../shared/ordering.js')];
  const RadioOrdering = require('../shared/ordering.js');
  assert.strictEqual(typeof RadioOrdering.sort, 'function');
  assert.strictEqual(typeof RadioOrdering.record, 'function');
});

test('playback-machine.js still works via Node CommonJS require()', () => {
  delete require.cache[require.resolve('../shared/playback-machine.js')];
  const RadioPlaybackMachine = require('../shared/playback-machine.js');
  assert.strictEqual(RadioPlaybackMachine.reduce('stopped', 'play'), 'connecting');
});

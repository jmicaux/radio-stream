'use strict';
// Locks in the reconciliation-is-not-an-event rule from the second Task 5
// review round: a usage count must record a transition into 'playing' that
// this JS context actually observed via a bridge-emitted event, never a
// state merely discovered by calling RadioBridge.getState() on relaunch or
// on returning to the foreground. `ios/www/app.js` is a browser script with
// no module boundary, so it is loaded into a `vm` context with the DOM/bridge
// surface it touches stubbed, the same approach used for the UMD wrapper
// regression tests in shared-wrappers.test.js.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const CATALOGUE = [
  { id: 'a', name: 'A', mark: 'A', streamUrl: 'https://a.example/stream', siteUrl: 'https://a.example', color: '#111111' },
  { id: 'b', name: 'B', mark: 'B', streamUrl: 'https://b.example/stream', siteUrl: 'https://b.example', color: '#222222' },
  { id: 'x', name: 'X', mark: 'X', streamUrl: 'https://x.example/stream', siteUrl: 'https://x.example', color: '#333333' }
];

// Loads ios/www/app.js into a fresh vm context with a minimal DOM, a
// controllable fake RadioBridge, and an in-memory localStorage. The
// module-level `start();` call at the bottom of app.js is stripped so the
// test can invoke `start()` itself and await it, instead of racing an
// unawaited top-level call.
function loadApp(initialState) {
  const sandbox = {};
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  // The real shared ordering logic, not a stub, so `RadioOrdering.sort` and
  // `.record` behave exactly as the app will see them in production.
  vm.runInContext(read('shared/ordering.js'), sandbox);

  const store = {};
  sandbox.localStorage = {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = value;
    }
  };

  function makeTile() {
    const status = { textContent: '' };
    return {
      dataset: {},
      style: {},
      setAttribute() {},
      addEventListener() {},
      querySelector: (selector) => (selector === '.status' ? status : null)
    };
  }
  const gridChildren = [];
  sandbox.document = {
    getElementById: () => ({ append: (node) => gridChildren.push(node) }),
    createElement: () => makeTile()
  };

  sandbox.fetch = () => Promise.resolve({ json: () => Promise.resolve(CATALOGUE) });

  let stateHandler = null;
  const bridge = {
    getState: () => Promise.resolve(bridge._state),
    onStateChange: (handler) => {
      stateHandler = handler;
    },
    play: () => Promise.resolve(),
    stop: () => Promise.resolve()
  };
  bridge._state = initialState;
  sandbox.RadioBridge = bridge;

  const appSource = read('ios/www/app.js').replace(/\nstart\(\);\s*$/, '\n');
  vm.runInContext(appSource, sandbox);

  return {
    start: () => sandbox.start(),
    emit: (event) => stateHandler(event),
    usage: () => JSON.parse(store.stationUsage || '{}')
  };
}

test('relaunch while playing (getState sync) records no usage', async () => {
  const app = loadApp({ state: 'playing', stationId: 'a' });
  await app.start();
  assert.deepStrictEqual(app.usage(), {}, 'a getState()-sourced playing report must not be counted');
});

test('a genuine later transition to playing for a different station is counted', async () => {
  const app = loadApp({ state: 'playing', stationId: 'a' });
  await app.start(); // relaunch reconciliation: discovers 'a' playing, must not count
  await app.emit({ state: 'connecting', stationId: 'b' });
  await app.emit({ state: 'playing', stationId: 'b' }); // a real bridge event: must count
  const usage = app.usage();
  assert.strictEqual(usage.a, undefined, 'the reconciled station must still never be counted');
  assert.strictEqual(usage.b.count, 1, 'a genuine transition to playing must be counted exactly once');
});

test('a normal tap (connecting then playing) records exactly one count', async () => {
  const app = loadApp({ state: 'stopped', stationId: null });
  await app.start();
  await app.emit({ state: 'connecting', stationId: 'x' });
  await app.emit({ state: 'playing', stationId: 'x' });
  const usage = app.usage();
  assert.strictEqual(usage.x.count, 1, 'counting must still work for a normal tap sequence');
});

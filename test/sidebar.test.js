'use strict';
// Regression tests for the sidebar's playback coordination. `sidebar.js` is a
// plain browser script with no module boundary, so it is loaded into a `vm`
// context with the DOM, the `chrome.*` surface and `Audio` stubbed — the same
// approach as app.test.js. Two contexts are loaded onto a shared message bus to
// reproduce the sidebar + detached window pair, which is exactly where the
// double-playback, refresh-undoes-stop and stream-ended bugs lived.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const SIDEBAR = fs.readFileSync(path.join(root, 'sidebar.js'), 'utf8');

const CATALOGUE = [
  { id: 'a', name: 'A', mark: 'A', streamUrl: 'https://a.example/stream', siteUrl: 'https://a.example', color: '#111111' },
  { id: 'b', name: 'B', mark: 'B', streamUrl: 'https://b.example/stream', siteUrl: 'https://b.example', color: '#222222' }
];

const ELEMENT_IDS = [
  'stations', 'stop', 'status', 'nowplaying', 'refresh', 'popout', 'version',
  'changelog', 'changelog-body', 'changelog-close'
];

function makeElement(created) {
  const element = {
    className: '',
    textContent: '',
    hidden: false,
    dataset: {},
    childNodes: [],
    attributes: {},
    classes: new Set(),
    handlers: {},
    style: { setProperty() {} },
    classList: {
      add: (name) => element.classes.add(name),
      remove: (name) => element.classes.delete(name),
      toggle: (name, on) => (on ? element.classes.add(name) : element.classes.delete(name)),
      contains: (name) => element.classes.has(name)
    },
    setAttribute: (name, value) => {
      element.attributes[name] = value;
    },
    addEventListener: (type, handler) => {
      (element.handlers[type] = element.handlers[type] || []).push(handler);
    },
    append: (...nodes) => {
      element.childNodes.push(...nodes);
    },
    focus() {},
    click: () => (element.handlers.click || []).forEach((handler) => handler({}))
  };
  if (created) {
    created.push(element);
  }
  return element;
}

// A stand-in for `chrome.runtime.sendMessage`: broadcasts to every *other*
// context, like the real API does, and answers GET_STATE from a background
// stub. GET_STATE replies are queued so a test can act (stop, switch station)
// while the request is still in flight.
function createBus() {
  const contexts = [];
  const pending = [];
  return {
    register: (id, listener) => contexts.push({ id, listener }),
    send: (id, message, respond) => {
      contexts.forEach((context) => {
        if (context.id !== id) {
          context.listener(message);
        }
      });
      if (message.type === 'GET_STATE') {
        pending.push(() => respond({ status: 'stopped', currentStationId: null, stations: CATALOGUE }));
        return;
      }
      respond(undefined);
    },
    // Flush the queued GET_STATE replies, then let the resulting promise chains run.
    flush: async () => {
      pending.splice(0).forEach((reply) => reply());
      await new Promise((resolve) => setImmediate(resolve));
      await new Promise((resolve) => setImmediate(resolve));
    }
  };
}

function loadContext(bus, id, search) {
  const sandbox = { URLSearchParams, Promise, setImmediate, console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.window.location = { search: search || '' };
  const windowHandlers = {};
  sandbox.window.addEventListener = (type, handler) => {
    (windowHandlers[type] = windowHandlers[type] || []).push(handler);
  };
  // Timers fire immediately: the 600 ms refresh spinner delay is cosmetic and
  // would only make the suite slow.
  sandbox.setTimeout = (fn) => {
    fn();
    return 0;
  };
  sandbox.clearTimeout = () => {};

  const created = [];
  const elements = {};
  ELEMENT_IDS.forEach((elementId) => {
    elements[elementId] = makeElement(null);
  });
  const documentHandlers = {};
  sandbox.document = {
    documentElement: makeElement(null),
    getElementById: (elementId) => elements[elementId] || null,
    createElement: () => makeElement(created),
    querySelectorAll: (selector) => (selector === '.station' ? created.filter((el) => el.className === 'station') : []),
    addEventListener: (type, handler) => {
      (documentHandlers[type] = documentHandlers[type] || []).push(handler);
    }
  };

  const audios = [];
  sandbox.Audio = function Audio(src) {
    const audio = {
      src: src,
      paused: true,
      released: false,
      play: () => {
        audio.paused = false;
        return Promise.resolve();
      },
      pause: () => {
        audio.paused = true;
      },
      removeAttribute: () => {
        audio.src = '';
      },
      load: () => {
        audio.released = true;
      }
    };
    audios.push(audio);
    return audio;
  };

  const badges = [];
  const storage = {};
  sandbox.chrome = {
    runtime: {
      getURL: (file) => 'chrome-extension://test/' + file,
      getManifest: () => ({ version: '0.0.0-test' }),
      lastError: null,
      sendMessage: (message, callback) => bus.send(id, message, (response) => callback(response)),
      onMessage: { addListener: (listener) => bus.register(id, listener) }
    },
    storage: {
      local: {
        get: (keys, callback) => callback(storage),
        set: (values, callback) => {
          Object.assign(storage, values);
          if (callback) callback();
        }
      }
    },
    action: {
      setBadgeText: ({ text }) => badges.push(text),
      setBadgeBackgroundColor: () => {}
    },
    windows: { create: () => Promise.resolve({ id: 1 }), update: () => Promise.reject(new Error('closed')) }
  };

  vm.createContext(sandbox);
  vm.runInContext(SIDEBAR, sandbox);

  return {
    audios: audios,
    // The <audio> the context is currently driving, if any.
    live: () => audios.filter((audio) => !audio.released).slice(-1)[0] || null,
    badge: () => (badges.length ? badges[badges.length - 1] : null),
    statusText: () => elements.status.textContent,
    tile: (stationId) => created.filter((el) => el.className === 'station').find((el) => el.dataset.stationId === stationId),
    close: () => (windowHandlers.pagehide || []).forEach((handler) => handler({})),
    clickStop: () => elements.stop.click(),
    clickRefresh: () => elements.refresh.click()
  };
}

// Drives one station from click to "playing", as the browser would.
function play(context, stationId) {
  context.tile(stationId).click();
  const audio = context.live();
  audio.onplaying();
  return audio;
}

test('a second context taking over stops the first context audio', async () => {
  const bus = createBus();
  const sidebar = loadContext(bus, 'sidebar');
  await bus.flush();
  const popout = loadContext(bus, 'popout');
  await bus.flush();

  const first = play(sidebar, 'a');
  const second = play(popout, 'b');

  assert.strictEqual(first.released, true, 'the sidebar stream must be released when the pop-out starts one');
  assert.strictEqual(second.paused, false, 'the pop-out stream must keep playing');
  assert.strictEqual(sidebar.live(), null, 'the sidebar must not hold any audio element');
  assert.strictEqual(sidebar.statusText(), 'B', 'the sidebar must mirror the station actually playing');
  assert.strictEqual(sidebar.badge(), 'ON', 'the badge must stay ON while another context plays');
});

test('stopping from one context stops the audio held by the other', async () => {
  const bus = createBus();
  const sidebar = loadContext(bus, 'sidebar');
  await bus.flush();
  const popout = loadContext(bus, 'popout');
  await bus.flush();

  const stream = play(popout, 'a');
  sidebar.clickStop();

  assert.strictEqual(stream.released, true, 'the pop-out stream must be released by the sidebar stop button');
  assert.strictEqual(popout.badge(), '', 'the pop-out badge must clear');
  assert.strictEqual(sidebar.badge(), '', 'the sidebar badge must clear');
});

test('stopping during a refresh is not undone when the request resolves', async () => {
  const bus = createBus();
  const sidebar = loadContext(bus, 'sidebar');
  await bus.flush();

  const stream = play(sidebar, 'a');
  sidebar.clickRefresh();
  sidebar.clickStop();
  await bus.flush();

  assert.strictEqual(stream.released, true, 'the stopped stream must stay released');
  assert.strictEqual(sidebar.live(), null, 'the refresh must not reconnect a station the user stopped');
  assert.strictEqual(sidebar.badge(), '', 'the badge must stay cleared');
});

test('switching station during a refresh is not undone when the request resolves', async () => {
  const bus = createBus();
  const sidebar = loadContext(bus, 'sidebar');
  await bus.flush();

  play(sidebar, 'a');
  sidebar.clickRefresh();
  const wanted = play(sidebar, 'b');
  await bus.flush();

  assert.strictEqual(sidebar.live(), wanted, 'the refresh must not switch back to the previous station');
  assert.strictEqual(sidebar.statusText(), 'B', 'the status line must show the station the user picked');
});

test('a refresh while playing does reconnect the current stream', async () => {
  const bus = createBus();
  const sidebar = loadContext(bus, 'sidebar');
  await bus.flush();

  const first = play(sidebar, 'a');
  sidebar.clickRefresh();
  await bus.flush();

  assert.strictEqual(first.released, true, 'the stalled stream must be released');
  assert.notStrictEqual(sidebar.live(), null, 'a fresh element must be connected for the same station');
  assert.strictEqual(sidebar.live().src, CATALOGUE[0].streamUrl, 'the same station must be reconnected');
});

test('a stream that ends leaves the UI and the badge stopped', async () => {
  const bus = createBus();
  const sidebar = loadContext(bus, 'sidebar');
  await bus.flush();

  const stream = play(sidebar, 'a');
  assert.strictEqual(sidebar.badge(), 'ON');

  stream.onended();

  assert.strictEqual(sidebar.badge(), '', 'the badge must clear when the stream ends');
  assert.strictEqual(sidebar.statusText(), 'Aucune radio en lecture', 'the status line must not stay on the station');
  assert.strictEqual(sidebar.live(), null, 'the ended element must be released');
});

test('a stream paused outside our control leaves the UI stopped', async () => {
  const bus = createBus();
  const sidebar = loadContext(bus, 'sidebar');
  await bus.flush();

  const stream = play(sidebar, 'a');
  stream.onpause();

  assert.strictEqual(sidebar.badge(), '', 'the badge must clear when the element pauses on its own');
  assert.strictEqual(sidebar.statusText(), 'Aucune radio en lecture');
});

test('closing the context that holds the audio clears the other context UI', async () => {
  const bus = createBus();
  const sidebar = loadContext(bus, 'sidebar');
  await bus.flush();
  const popout = loadContext(bus, 'popout');
  await bus.flush();

  play(popout, 'a');
  assert.strictEqual(sidebar.badge(), 'ON', 'the sidebar mirrors the pop-out while it plays');

  popout.close();

  assert.strictEqual(sidebar.badge(), '', 'a closed pop-out must not leave a phantom ON badge');
  assert.strictEqual(sidebar.statusText(), 'Aucune radio en lecture');
});

test('a context opened while another is playing adopts its state', async () => {
  const bus = createBus();
  const sidebar = loadContext(bus, 'sidebar');
  await bus.flush();
  play(sidebar, 'a');

  const popout = loadContext(bus, 'popout');
  await bus.flush();

  assert.strictEqual(popout.statusText(), 'A', 'the new context must show the station already playing');
  assert.strictEqual(popout.live(), null, 'the new context must not open a competing stream');
});

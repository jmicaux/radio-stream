// The playback state machine, shared in spirit with RadioAudio.swift and
// verified against the same case table in shared/playback-states.json.
(function (root, factory) {
  const api = factory();
  // Always assign the global: a service worker (no `module`) and a browser
  // page with a hostile `module` shim (e.g. some WebView bundler runtimes)
  // both need `root.RadioPlaybackMachine` to exist. Additionally assign
  // `module.exports` when present, for Node's CommonJS `require()`. Neither
  // assignment excludes the other.
  root.RadioPlaybackMachine = api;
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const TRANSITIONS = {
    stopped: { play: 'connecting', resume: 'connecting', stop: 'stopped', connected: 'stopped', fail: 'stopped' },
    connecting: { connected: 'playing', fail: 'error', stop: 'stopped', play: 'connecting', interrupt: 'stopped', routeLost: 'stopped' },
    playing: { stop: 'stopped', fail: 'error', play: 'connecting', interrupt: 'stopped', routeLost: 'stopped' },
    error: { play: 'connecting', stop: 'stopped' }
  };

  function reduce(state, event) {
    const row = TRANSITIONS[state];
    if (!row || !(event in row)) {
      return state;
    }
    return row[event];
  }

  return { reduce: reduce, STATES: Object.keys(TRANSITIONS) };
}));

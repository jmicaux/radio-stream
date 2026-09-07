// The playback state machine, shared in spirit with RadioAudio.swift and
// verified against the same case table in shared/playback-states.json.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.RadioPlaybackMachine = api;
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const TRANSITIONS = {
    stopped: { play: 'connecting', resume: 'connecting', stop: 'stopped', connected: 'stopped', fail: 'stopped' },
    connecting: { connected: 'playing', fail: 'error', stop: 'stopped', play: 'connecting' },
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

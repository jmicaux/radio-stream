// Single point of contact with the native player. In a desktop browser there
// is no Capacitor, so a fake stands in and drives the same events, which lets
// the whole interface be developed and reviewed without a Mac.
const RadioBridge = (function () {
  'use strict';

  const handlers = [];
  const emit = (payload) => handlers.forEach((handler) => handler(payload));

  if (window.Capacitor && window.Capacitor.registerPlugin) {
    const plugin = window.Capacitor.registerPlugin('RadioAudio');
    plugin.addListener('stateChange', emit);
    return {
      play: (options) => plugin.play(options),
      stop: () => plugin.stop(),
      getState: () => plugin.getState(),
      onStateChange: (handler) => handlers.push(handler)
    };
  }

  // The fake drives itself through the shared reducer, so what you see in a
  // desktop browser follows exactly the transitions the device will make.
  let state = 'stopped';
  let stationId = null;
  let timer = null;

  const send = (event, id) => {
    state = RadioPlaybackMachine.reduce(state, event);
    stationId = state === 'stopped' ? null : (id !== undefined ? id : stationId);
    emit({ state: state, stationId: stationId });
  };

  return {
    play: ({ stationId: id }) => {
      clearTimeout(timer);
      send('play', id);
      timer = setTimeout(() => send('connected', id), 600);
      return Promise.resolve();
    },
    stop: () => {
      clearTimeout(timer);
      send('stop');
      return Promise.resolve();
    },
    getState: () => Promise.resolve({ state: state, stationId: stationId }),
    onStateChange: (handler) => handlers.push(handler)
  };
}());

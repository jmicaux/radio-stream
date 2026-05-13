const STATIONS = [
  {
    id: 'rtl',
    name: 'RTL',
    streamUrl: 'https://streaming.radio.rtl.fr/rtl-1-44-128',
    color: '#d71920'
  },
  {
    id: 'europe1',
    name: 'Europe 1',
    streamUrl: 'https://stream.europe1.fr/europe1.mp3',
    color: '#103f8f'
  },
  {
    id: 'franceinter',
    name: 'France Inter',
    streamUrl: 'https://direct.franceinter.fr/live/franceinter-midfi.mp3',
    color: '#e31b23'
  },
  {
    id: 'franceinfo',
    name: 'franceinfo',
    streamUrl: 'https://direct.franceinfo.fr/live/franceinfo-midfi.mp3',
    color: '#f6c400'
  }
];

const api = typeof browser !== 'undefined' ? browser : chrome;
let audio = null;
let currentStationId = null;
let status = 'stopped';
let playbackToken = 0;

function findStation(stationId) {
  return STATIONS.find((station) => station.id === stationId);
}

function setBadge(text, color) {
  api.action.setBadgeText({ text: text });
  api.action.setBadgeBackgroundColor({ color: color });
}

function getState() {
  return {
    status: status,
    currentStationId: currentStationId,
    stations: STATIONS
  };
}

function stopStream() {
  playbackToken += 1;

  if (audio) {
    const stoppedAudio = audio;
    audio = null;

    stoppedAudio.pause();
    stoppedAudio.removeAttribute('src');
  }

  status = 'stopped';
  currentStationId = null;
  setBadge('', '#737373');
}

function playStation(stationId) {
  const station = findStation(stationId);

  if (!station) {
    throw new Error('Unknown station');
  }

  if (status === 'playing' && currentStationId === stationId) {
    stopStream();
    return getState();
  }

  stopStream();
  playbackToken += 1;
  const token = playbackToken;

  status = 'loading';
  currentStationId = station.id;
  setBadge('...', station.color);

  audio = new Audio(station.streamUrl);
  audio.preload = 'none';
  audio.addEventListener('playing', () => {
    if (token !== playbackToken) {
      return;
    }

    status = 'playing';
    currentStationId = station.id;
    setBadge('ON', station.color);
  });
  audio.addEventListener('pause', () => {
    if (token === playbackToken && currentStationId === station.id) {
      status = 'stopped';
      currentStationId = null;
      setBadge('', '#737373');
    }
  });
  audio.addEventListener('error', () => {
    if (token !== playbackToken) {
      return;
    }

    status = 'error';
    currentStationId = station.id;
    setBadge('ERR', '#b3261e');
  });

  return audio.play().then(() => {
    if (token !== playbackToken) {
      return getState();
    }

    status = 'playing';
    currentStationId = station.id;
    setBadge('ON', station.color);
    return getState();
  });
}

api.runtime.onInstalled.addListener(() => {
  setBadge('', '#737373');
});

api.runtime.onMessage.addListener((message) => {
  if (!message || !message.type) {
    return false;
  }

  if (message.type === 'GET_STATE') {
    return Promise.resolve(getState());
  }

  if (message.type === 'STOP') {
    stopStream();
    return Promise.resolve(getState());
  }

  if (message.type === 'PLAY_STATION') {
    return playStation(message.stationId).catch((error) => {
      if (error && error.name === 'AbortError' && status === 'stopped') {
        setBadge('', '#737373');
        return getState();
      }

      status = 'error';
      setBadge('ERR', '#b3261e');
      return {
        ...getState(),
        error: error.message
      };
    });
  }

  return false;
});

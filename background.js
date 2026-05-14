const STATIONS = [
  {
    id: 'franceinter',
    name: 'France Inter',
    mark: 'Inter',
    streamUrl: 'https://direct.franceinter.fr/live/franceinter-midfi.mp3',
    siteUrl: 'https://www.radiofrance.fr/franceinter',
    color: '#e31b23'
  },
  {
    id: 'rmc',
    name: 'RMC',
    mark: 'RMC',
    streamUrl: 'https://audio.bfmtv.com/rmcradio_128.mp3',
    siteUrl: 'https://rmc.bfmtv.com/',
    color: '#f47b20'
  },
  {
    id: 'franceinfo',
    name: 'franceinfo',
    mark: 'Info',
    streamUrl: 'https://direct.franceinfo.fr/live/franceinfo-midfi.mp3',
    siteUrl: 'https://www.radiofrance.fr/franceinfo',
    color: '#f6c400',
    textColor: '#151922'
  },
  {
    id: 'rtl',
    name: 'RTL',
    mark: 'RTL',
    streamUrl: 'https://streaming.radio.rtl.fr/rtl-1-44-128',
    siteUrl: 'https://www.rtl.fr/',
    color: '#d71920'
  },
  {
    id: 'nrj',
    name: 'NRJ',
    mark: 'NRJ',
    streamUrl: 'https://streaming.nrjaudio.fm/oumvmk8fnozc?origine=fluxurlradio',
    siteUrl: 'https://www.nrj.fr/',
    color: '#111827'
  },
  {
    id: 'nostalgie',
    name: 'Nostalgie',
    mark: 'Nost',
    streamUrl: 'https://streaming.nrjaudio.fm/oug7girb92oc?origine=fluxurlradio',
    siteUrl: 'https://www.nostalgie.fr/',
    color: '#d7242a'
  },
  {
    id: 'fip',
    name: 'FIP',
    mark: 'FIP',
    streamUrl: 'https://icecast.radiofrance.fr/fip-hifi.aac',
    siteUrl: 'https://www.radiofrance.fr/fip',
    color: '#f05a28'
  },
  {
    id: 'europe1',
    name: 'Europe 1',
    mark: 'E1',
    streamUrl: 'https://stream.europe1.fr/europe1.mp3',
    siteUrl: 'https://www.europe1.fr/',
    color: '#103f8f'
  },
  {
    id: 'skyrock',
    name: 'Skyrock',
    mark: 'Sky',
    streamUrl: 'http://icecast.skyrock.net/s/natio_mp3_128k',
    siteUrl: 'https://skyrock.fm/',
    color: '#1f5fbf'
  },
  {
    id: 'ici',
    name: 'ici',
    mark: 'ici',
    streamUrl: 'https://icecast.radiofrance.fr/fb1071-midfi.mp3',
    siteUrl: 'https://www.radiofrance.fr/ici',
    color: '#00a0df'
  },
  {
    id: 'cheriefm',
    name: 'Chérie FM',
    mark: 'Chérie',
    streamUrl: 'https://streaming.nrjaudio.fm/ouuku85n3nje?origine=fluxurlradio',
    siteUrl: 'https://www.cheriefm.fr/',
    color: '#d81b60'
  },
  {
    id: 'rfm',
    name: 'RFM',
    mark: 'RFM',
    streamUrl: 'https://ais-live.cloud-services.paris:8443/rfm.mp3',
    siteUrl: 'https://www.rfm.fr/',
    color: '#dc2626'
  },
  {
    id: 'franceculture',
    name: 'France Culture',
    mark: 'Cult',
    streamUrl: 'https://icecast.radiofrance.fr/franceculture-hifi.aac',
    siteUrl: 'https://www.radiofrance.fr/franceculture',
    color: '#5c2d91'
  },
  {
    id: 'rireetchansons',
    name: 'Rire et Chansons',
    mark: 'Rire',
    streamUrl: 'https://streaming.nrjaudio.fm/ou8o8xgk7oiu?origine=fluxurlradio',
    siteUrl: 'https://www.rireetchansons.fr/',
    color: '#f59e0b',
    textColor: '#151922'
  },
  {
    id: 'rtl2',
    name: 'RTL2',
    mark: 'RTL2',
    streamUrl: 'https://streaming.radio.rtl2.fr/rtl2-1-44-128',
    siteUrl: 'https://www.rtl2.fr/',
    color: '#cf112b'
  },
  {
    id: 'radioclassique',
    name: 'Radio Classique',
    mark: 'Class',
    streamUrl: 'https://radioclassique.ice.infomaniak.ch/radioclassique-high.mp3',
    siteUrl: 'https://www.radioclassique.fr/',
    color: '#0f2f57'
  },
  {
    id: 'europe2',
    name: 'Europe 2',
    mark: 'E2',
    streamUrl: 'https://europe2.lmn.fm/europe2.mp3',
    siteUrl: 'https://www.europe2.fr/',
    color: '#e11d48'
  },
  {
    id: 'funradio',
    name: 'Fun Radio',
    mark: 'Fun',
    streamUrl: 'https://streaming.radio.funradio.fr/fun-1-44-128',
    siteUrl: 'https://www.funradio.fr/',
    color: '#7c3aed'
  },
  {
    id: 'radiofg',
    name: 'Radio FG',
    mark: 'FG',
    streamUrl: 'https://radiofg.impek.com/fg.mp3',
    siteUrl: 'https://www.radiofg.com/',
    color: '#0ea5e9'
  },
  {
    id: 'francemusique',
    name: 'France Musique',
    mark: 'Mus',
    streamUrl: 'https://icecast.radiofrance.fr/francemusique-hifi.aac',
    siteUrl: 'https://www.radiofrance.fr/francemusique',
    color: '#2563eb'
  },
  {
    id: 'sudradio',
    name: 'Sud Radio',
    mark: 'Sud',
    streamUrl: 'https://ice.creacast.com/sudradio',
    siteUrl: 'https://www.sudradio.fr/',
    color: '#f97316'
  },
  {
    id: 'ouifm',
    name: 'Oui FM',
    mark: 'Oui',
    streamUrl: 'https://ouifm.ice.infomaniak.ch/ouifm-high.mp3',
    siteUrl: 'https://www.ouifm.fr/',
    color: '#111827'
  },
  {
    id: 'radionova',
    name: 'Radio Nova',
    mark: 'Nova',
    streamUrl: 'https://novazz.ice.infomaniak.ch/novazz-128.mp3',
    siteUrl: 'https://www.nova.fr/',
    color: '#eab308',
    textColor: '#151922'
  },
  {
    id: 'chantefrance',
    name: 'Chante France',
    mark: 'CF',
    streamUrl: 'http://stream.chantefrance.com/Chante_France',
    siteUrl: 'https://www.chantefrance.com/',
    color: '#ef4444'
  },
  {
    id: 'bfmradio',
    name: 'BFM Radio',
    mark: 'BFM',
    streamUrl: 'https://audio.bfmtv.com/bfmradio_128.mp3',
    siteUrl: 'https://www.bfmtv.com/en-direct/bfm-radio/',
    color: '#0055a4'
  },
  {
    id: 'jazzradio',
    name: 'Jazz Radio',
    mark: 'Jazz',
    streamUrl: 'https://jazzradio.ice.infomaniak.ch/jazzradio-high.mp3',
    siteUrl: 'https://www.jazzradio.fr/',
    color: '#7f1d1d'
  },
  {
    id: 'generations',
    name: 'Générations',
    mark: 'Gen',
    streamUrl: 'https://generationfm.ice.infomaniak.ch/generationfm-high.mp3',
    siteUrl: 'https://generations.fr/',
    color: '#16a34a'
  },
  {
    id: 'outremer1ere',
    name: 'Outre-Mer la 1ère',
    mark: '1ère',
    streamUrl: 'http://outremer.ice.infomaniak.ch/outremer-192.aac?aw_0_1st.rpfr=1',
    siteUrl: 'https://la1ere.francetvinfo.fr/',
    color: '#0f766e'
  },
  {
    id: 'rciguadeloupe',
    name: 'RCI Guadeloupe',
    mark: 'RCI',
    streamUrl: 'https://stream.rcs.revma.com/v4hf7bwspwzuv',
    siteUrl: 'https://www.rci.fm/guadeloupe/',
    color: '#0f4c81'
  },
  {
    id: 'bfmbusiness',
    name: 'BFM Business',
    mark: 'Biz',
    streamUrl: 'https://audio.bfmtv.com/bfmbusiness_128.mp3',
    siteUrl: 'https://www.bfmtv.com/economie/',
    color: '#003b73'
  }
];

const api = typeof browser !== 'undefined' ? browser : chrome;
const USAGE_KEY = 'stationUsage';
let audio = null;
let currentStationId = null;
let status = 'stopped';
let playbackToken = 0;
let countedPlaybackToken = 0;

function findStation(stationId) {
  return STATIONS.find((station) => station.id === stationId);
}

function setBadge(text, color) {
  api.action.setBadgeText({ text: text });
  api.action.setBadgeBackgroundColor({ color: color });
}

function storageGet(defaults) {
  if (typeof browser !== 'undefined') {
    return browser.storage.local.get(defaults);
  }

  return new Promise((resolve) => {
    chrome.storage.local.get(defaults, resolve);
  });
}

function storageSet(values) {
  if (typeof browser !== 'undefined') {
    return browser.storage.local.set(values);
  }

  return new Promise((resolve) => {
    chrome.storage.local.set(values, resolve);
  });
}

function loadUsage() {
  return storageGet({ [USAGE_KEY]: {} }).then((stored) => stored[USAGE_KEY] || {});
}

function stationRank(station) {
  return STATIONS.findIndex((item) => item.id === station.id);
}

function sortStations(usage) {
  return STATIONS.slice().sort((first, second) => {
    const firstUsage = usage[first.id] || {};
    const secondUsage = usage[second.id] || {};
    const firstCount = firstUsage.count || 0;
    const secondCount = secondUsage.count || 0;

    if (firstCount !== secondCount) {
      return secondCount - firstCount;
    }

    if ((firstUsage.lastPlayedAt || 0) !== (secondUsage.lastPlayedAt || 0)) {
      return (secondUsage.lastPlayedAt || 0) - (firstUsage.lastPlayedAt || 0);
    }

    return stationRank(first) - stationRank(second);
  });
}

function recordUsage(stationId) {
  return loadUsage().then((usage) => {
    const previous = usage[stationId] || {};

    usage[stationId] = {
      count: (previous.count || 0) + 1,
      lastPlayedAt: Date.now()
    };

    return storageSet({ [USAGE_KEY]: usage });
  });
}

function getState() {
  return loadUsage().then((usage) => ({
    status: status,
    currentStationId: currentStationId,
    stations: sortStations(usage)
  }));
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
    if (countedPlaybackToken !== token) {
      countedPlaybackToken = token;
      return recordUsage(station.id).then(getState);
    }
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
    return getState();
  }

  if (message.type === 'STOP') {
    stopStream();
    return getState();
  }

  if (message.type === 'PLAY_STATION') {
    return playStation(message.stationId).catch((error) => {
      if (error && error.name === 'AbortError' && status === 'stopped') {
        setBadge('', '#737373');
        return getState();
      }

      status = 'error';
      setBadge('ERR', '#b3261e');
      return getState().then((state) => ({
        ...state,
        error: error.message
      }));
    });
  }

  return false;
});

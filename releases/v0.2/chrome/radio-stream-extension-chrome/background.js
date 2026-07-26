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
const OFFSCREEN_PATH = 'offscreen.html';
let audio = null;
let currentStationId = null;
let currentStreamUrl = null;
let status = 'stopped';
let playbackToken = 0;
let countedPlaybackToken = 0;
let playerTabId = null;
let playerReady = false;
let pendingPlaybackRequest = null;
let playerCreating = null;
let playbackMode = 'direct';
let playbackHeartbeatTimer = null;
let lastPlaybackHeartbeatAt = 0;
let lastPlaybackPosition = 0;
let lastPlaybackProgressAt = 0;
let playbackRestartAt = 0;
let keepAwakeRequested = false;

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

function supportsOffscreen() {
  return !!(
    (api.offscreen && typeof api.offscreen.createDocument === 'function')
    || (api.tabs && typeof api.tabs.create === 'function')
  );
}

function supportsChromeOffscreenDocument() {
  return typeof browser === 'undefined'
    && !!(api.offscreen && typeof api.offscreen.createDocument === 'function');
}

function tabsCreate(createProperties) {
  if (typeof browser !== 'undefined') {
    return browser.tabs.create(createProperties);
  }

  return new Promise((resolve, reject) => {
    api.tabs.create(createProperties, (tab) => {
      const lastError = api.runtime.lastError;
      if (lastError) {
        reject(new Error(lastError.message));
        return;
      }

      resolve(tab);
    });
  });
}

function tabsGet(tabId) {
  if (typeof browser !== 'undefined') {
    return browser.tabs.get(tabId);
  }

  return new Promise((resolve, reject) => {
    api.tabs.get(tabId, (tab) => {
      const lastError = api.runtime.lastError;
      if (lastError) {
        reject(new Error(lastError.message));
        return;
      }

      resolve(tab);
    });
  });
}

function tabsRemove(tabId) {
  if (typeof browser !== 'undefined') {
    return browser.tabs.remove(tabId);
  }

  return new Promise((resolve, reject) => {
    api.tabs.remove(tabId, () => {
      const lastError = api.runtime.lastError;
      if (lastError) {
        reject(new Error(lastError.message));
        return;
      }

      resolve();
    });
  });
}

function tabsUpdate(tabId, updateProperties) {
  if (typeof browser !== 'undefined') {
    return browser.tabs.update(tabId, updateProperties);
  }

  return new Promise((resolve, reject) => {
    api.tabs.update(tabId, updateProperties, (tab) => {
      const lastError = api.runtime.lastError;
      if (lastError) {
        reject(new Error(lastError.message));
        return;
      }

      resolve(tab);
    });
  });
}

async function hasOffscreenDocument() {
  if (!supportsOffscreen()) {
    return false;
  }

  if (supportsChromeOffscreenDocument()) {
    if (!api.runtime.getContexts) {
      return playerReady;
    }

    const contexts = await api.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT'],
      documentUrls: [api.runtime.getURL(OFFSCREEN_PATH)]
    });
    return contexts.length > 0;
  }

  if (playerTabId !== null) {
    try {
      await tabsGet(playerTabId);
      return true;
    } catch (error) {
      playerTabId = null;
      playerReady = false;
    }
  }

  return false;
}

async function ensureOffscreenDocument() {
  if (!supportsOffscreen()) {
    return false;
  }

  if (await hasOffscreenDocument()) {
    return true;
  }

  if (!playerCreating) {
    if (supportsChromeOffscreenDocument()) {
      playerCreating = api.offscreen.createDocument({
        url: OFFSCREEN_PATH,
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Play live radio streams from the extension.'
      }).then(() => {
        playerReady = false;
      }).finally(() => {
        playerCreating = null;
      });
      await playerCreating;
      return true;
    }

    playerCreating = tabsCreate({
      url: api.runtime.getURL(OFFSCREEN_PATH),
      active: false
    }).then((tab) => {
      playerTabId = tab && typeof tab.id === 'number' ? tab.id : null;
      playerReady = false;
      if (playerTabId !== null) {
        return tabsUpdate(playerTabId, {
          autoDiscardable: false
        }).catch(() => {});
      }
    }).finally(() => {
      playerCreating = null;
    });
  }

  await playerCreating;
  return true;
}

function sendOffscreenMessage(message) {
  return new Promise((resolve, reject) => {
    api.runtime.sendMessage(message, (response) => {
      const lastError = api.runtime.lastError;
      if (lastError) {
        reject(new Error(lastError.message));
        return;
      }

      resolve(response);
    });
  });
}

function requestKeepAwake() {
  if (!api.power || typeof api.power.requestKeepAwake !== 'function' || keepAwakeRequested) {
    return;
  }

  api.power.requestKeepAwake('system');
  keepAwakeRequested = true;
}

function releaseKeepAwake() {
  if (!api.power || typeof api.power.releaseKeepAwake !== 'function' || !keepAwakeRequested) {
    return;
  }

  api.power.releaseKeepAwake();
  keepAwakeRequested = false;
}

function clearPendingPlayback() {
  pendingPlaybackRequest = null;
}

function dispatchPendingPlayback() {
  if (!pendingPlaybackRequest || !playerReady) {
    return false;
  }

  const request = pendingPlaybackRequest;
  pendingPlaybackRequest = null;
  sendOffscreenMessage({
    type: 'PLAY_STATION',
    target: 'offscreen',
    stationId: request.stationId,
    streamUrl: request.streamUrl,
    token: request.token
  }).catch(() => {
    pendingPlaybackRequest = request;
  });
  return true;
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

function ensurePlaybackHeartbeatWatchdog() {
  if (playbackHeartbeatTimer) {
    return;
  }

  playbackHeartbeatTimer = setInterval(() => {
    if (playbackMode !== 'offscreen' || status !== 'playing' || !currentStationId) {
      return;
    }

    const now = Date.now();
    if (lastPlaybackHeartbeatAt && now - lastPlaybackHeartbeatAt > 15000) {
      restartCurrentStation('heartbeat timeout');
      return;
    }

    if (lastPlaybackProgressAt && now - lastPlaybackProgressAt > 20000 && now - playbackRestartAt > 10000) {
      restartCurrentStation('stalled stream');
      return;
    }
  }, 5000);
}

function resetPlaybackHealth() {
  lastPlaybackHeartbeatAt = Date.now();
  lastPlaybackPosition = 0;
  lastPlaybackProgressAt = Date.now();
}

function restartCurrentStation(reason) {
  if (!currentStationId || status === 'loading') {
    return;
  }

  if (Date.now() - playbackRestartAt < 10000) {
    return;
  }

  playbackRestartAt = Date.now();
  const stationId = currentStationId;
  const mode = playbackMode;

  stopStream();

  if (mode === 'offscreen' || supportsOffscreen()) {
    playStation(stationId).catch((error) => {
      status = 'error';
      setBadge('ERR', '#b3261e');
      return getState().then((state) => ({
        ...state,
        error: (error && error.message) || 'Stream restart failed'
      }));
    });
    return;
  }

  playStation(stationId).catch(() => {});
}

function getState() {
  return loadUsage().then((usage) => ({
    status: status,
    currentStationId: currentStationId,
    stations: sortStations(usage)
  }));
}

function stopLocalStream() {
  playbackToken += 1;
  lastPlaybackHeartbeatAt = 0;
  lastPlaybackPosition = 0;
  lastPlaybackProgressAt = 0;
  clearPendingPlayback();
  currentStreamUrl = null;
  releaseKeepAwake();

  if (audio) {
    const stoppedAudio = audio;
    audio = null;

    stoppedAudio.pause();
    stoppedAudio.removeAttribute('src');
  }

  status = 'stopped';
  currentStationId = null;
  setBadge('', '#737373');
  playbackMode = 'direct';
}

function stopStream() {
  if (playbackMode === 'offscreen' && supportsOffscreen()) {
    playbackToken += 1;
    lastPlaybackHeartbeatAt = 0;
    lastPlaybackPosition = 0;
    lastPlaybackProgressAt = 0;
    clearPendingPlayback();
    sendOffscreenMessage({
      type: 'STOP',
      target: 'offscreen',
      token: playbackToken
    }).catch(() => {});
    if (supportsChromeOffscreenDocument()) {
      api.offscreen.closeDocument().catch(() => {});
    } else if (playerTabId !== null) {
      tabsRemove(playerTabId).catch(() => {});
      playerTabId = null;
    }
    status = 'stopped';
    currentStationId = null;
    currentStreamUrl = null;
    setBadge('', '#737373');
    playerReady = false;
    releaseKeepAwake();
    playbackMode = 'direct';
    return;
  }

  stopLocalStream();
}

function playStationDirect(stationId) {
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
  playbackMode = 'direct';
  lastPlaybackHeartbeatAt = 0;
  lastPlaybackPosition = 0;
  lastPlaybackProgressAt = 0;

  status = 'loading';
  currentStationId = station.id;
  currentStreamUrl = station.streamUrl;
  setBadge('...', station.color);
  requestKeepAwake();

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

async function playStationOffscreen(stationId) {
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
  playbackMode = 'offscreen';
  resetPlaybackHealth();
  clearPendingPlayback();

  await ensureOffscreenDocument();

  status = 'loading';
  currentStationId = station.id;
  currentStreamUrl = station.streamUrl;
  setBadge('...', station.color);
  requestKeepAwake();
  pendingPlaybackRequest = {
    stationId: station.id,
    streamUrl: station.streamUrl,
    token: token
  };
  dispatchPendingPlayback();

  ensurePlaybackHeartbeatWatchdog();
  return getState();
}

function playStation(stationId) {
  if (supportsOffscreen()) {
    return playStationOffscreen(stationId).catch((error) => {
      playbackMode = 'direct';
      return playStationDirect(stationId).catch((directError) => {
        throw directError || error;
      });
    });
  }

  return playStationDirect(stationId);
}

api.runtime.onInstalled.addListener(() => {
  setBadge('', '#737373');
  ensurePlaybackHeartbeatWatchdog();
  if (api.sidePanel && typeof api.sidePanel.setPanelBehavior === 'function') {
    api.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
  }
});

if (api.tabs && api.tabs.onRemoved) {
  api.tabs.onRemoved.addListener((tabId) => {
    if (playerTabId !== null && tabId === playerTabId) {
      playerTabId = null;
      playerReady = false;
      clearPendingPlayback();
      if (status === 'playing' || status === 'loading') {
        stopLocalStream();
      }
    }
  });
}

if (api.action && api.action.onClicked && typeof browser !== 'undefined' && browser.sidebarAction) {
  api.action.onClicked.addListener(() => {
    browser.sidebarAction.open().catch(() => {});
  });
}

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

  if (message.type === 'PLAYER_READY') {
    playerReady = true;
    if (!pendingPlaybackRequest && playbackMode === 'offscreen' && currentStationId && currentStreamUrl) {
      pendingPlaybackRequest = {
        stationId: currentStationId,
        streamUrl: currentStreamUrl,
        token: playbackToken
      };
    }
    if (pendingPlaybackRequest) {
      dispatchPendingPlayback();
    }
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

  if (message.type === 'PLAYBACK_STATUS') {
    if (typeof message.token === 'number' && message.token !== playbackToken) {
      return false;
    }

    if (message.status === 'heartbeat') {
      if (message.currentTime > lastPlaybackPosition) {
        lastPlaybackPosition = message.currentTime;
        lastPlaybackProgressAt = Date.now();
      }
      lastPlaybackHeartbeatAt = Date.now();

      if (message.paused || message.ended) {
        restartCurrentStation('heartbeat reported pause');
        return getState();
      }

      return false;
    }

    if (message.status === 'playing') {
      resetPlaybackHealth();
      requestKeepAwake();
      const station = findStation(message.stationId || currentStationId);
      status = 'playing';
      currentStationId = message.stationId || currentStationId;
      setBadge('ON', station ? station.color : '#2f6b2f');
      if (message.stationId && countedPlaybackToken !== playbackToken) {
        countedPlaybackToken = playbackToken;
        return recordUsage(message.stationId).then(getState);
      }
      return getState();
    }

    if (message.status === 'stopped') {
      status = 'stopped';
      currentStationId = null;
      setBadge('', '#737373');
      playbackMode = 'direct';
      lastPlaybackHeartbeatAt = 0;
      lastPlaybackPosition = 0;
      lastPlaybackProgressAt = 0;
      releaseKeepAwake();
      return getState();
    }

    if (message.status === 'error') {
      status = 'error';
      if (message.stationId) {
        currentStationId = message.stationId;
      }
      setBadge('ERR', '#b3261e');
      playbackMode = 'direct';
      lastPlaybackHeartbeatAt = 0;
      lastPlaybackPosition = 0;
      lastPlaybackProgressAt = 0;
      releaseKeepAwake();
      return getState().then((state) => ({
        ...state,
        error: message.error || 'Stream error'
      }));
    }
  }

  return false;
});

ensurePlaybackHeartbeatWatchdog();

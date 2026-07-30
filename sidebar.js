const api = typeof browser !== 'undefined' ? browser : chrome;
const stationsNode = document.getElementById('stations');
const stopButton = document.getElementById('stop');
const statusNode = document.getElementById('status');
const refreshButton = document.getElementById('refresh');
const versionNode = document.getElementById('version');

let audio = null;
let stations = [];
let currentStationId = null;
let status = 'stopped';

function sendMessage(message) {
  if (typeof browser !== 'undefined') {
    return browser.runtime.sendMessage(message);
  }

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        reject(new Error(lastError.message));
        return;
      }

      resolve(response);
    });
  });
}

function setStatus(message) {
  statusNode.textContent = message || '';
}

// Toolbar icon badge: an "ON" chip while a station plays. Playback happens
// locally in the sidebar, so the badge is driven from here rather than the
// background service worker.
function setActionBadge(text, color) {
  if (!api.action || typeof api.action.setBadgeText !== 'function') {
    return;
  }
  try {
    api.action.setBadgeText({ text: text });
    api.action.setBadgeBackgroundColor({ color: color });
  } catch (error) {
    /* action badge API unavailable in this context */
  }
}

function stopAudio() {
  if (audio) {
    audio.pause();
    audio.removeAttribute('src');
    audio = null;
  }

  currentStationId = null;
  status = 'stopped';
  renderPlaybackState();
}

function renderPlaybackState() {
  const isActive = status === 'playing' || status === 'loading';
  const station = stations.find((item) => item.id === currentStationId);

  document.querySelectorAll('.station').forEach((button) => {
    const active = button.dataset.stationId === currentStationId && isActive;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  stopButton.setAttribute('aria-disabled', String(!isActive));

  if (status === 'loading') {
    setActionBadge('...', station ? station.color : '#737373');
    setStatus(station ? 'Connexion à ' + station.name + '...' : 'Connexion...');
    return;
  }

  if (status === 'playing') {
    setActionBadge('ON', station ? station.color : '#2f6b2f');
    setStatus(station ? station.name : '');
    return;
  }

  if (status === 'error') {
    setActionBadge('ERR', '#b3261e');
    setStatus('Flux indisponible.');
    return;
  }

  setActionBadge('', '#737373');
  setStatus('');
}

function playStation(station) {
  if (status === 'playing' && currentStationId === station.id) {
    stopAudio();
    return;
  }

  stopAudio();
  currentStationId = station.id;
  status = 'loading';
  renderPlaybackState();

  audio = new Audio(station.streamUrl);
  audio.preload = 'none';
  let usageRecorded = false;
  audio.addEventListener('playing', () => {
    status = 'playing';
    renderPlaybackState();
    // Count the play once it actually starts, so usage-based ordering reflects
    // real listening. The new order applies on the next refresh/reopen rather
    // than reshuffling tiles mid-playback.
    if (!usageRecorded) {
      usageRecorded = true;
      sendMessage({ type: 'RECORD_USAGE', stationId: station.id }).catch(() => {});
    }
  });
  audio.addEventListener('pause', () => {
    if (audio) {
      stopAudio();
    }
  });
  audio.addEventListener('error', () => {
    status = 'error';
    renderPlaybackState();
  });

  audio.play().catch(() => {
    status = 'error';
    renderPlaybackState();
  });
}

function createStationCard(station) {
  const card = document.createElement('div');
  card.className = 'station-card';
  card.style.setProperty('--station-color', station.color);

  if (station.textColor) {
    card.style.setProperty('--station-text', station.textColor);
  }

  const button = document.createElement('button');
  button.className = 'station';
  button.type = 'button';
  button.dataset.stationId = station.id;

  const mark = document.createElement('span');
  mark.className = 'mark';
  mark.textContent = station.mark || station.name;
  mark.setAttribute('aria-hidden', 'true');

  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = station.name;

  button.append(mark, name);
  button.addEventListener('click', () => {
    playStation(station);
  });

  const link = document.createElement('a');
  link.className = 'site-link';
  link.href = station.siteUrl;
  link.target = '_blank';
  link.rel = 'noreferrer noopener';
  link.textContent = 'Site';

  card.append(button, link);
  return card;
}

function renderStations(state) {
  stations = state.stations;
  stationsNode.textContent = '';
  stations.forEach((station) => {
    stationsNode.append(createStationCard(station));
  });
  renderPlaybackState();
}

stopButton.addEventListener('click', () => {
  if (stopButton.getAttribute('aria-disabled') === 'true') {
    return;
  }
  stopAudio();
});

let refreshing = false;

function refreshStations() {
  if (refreshing) {
    return;
  }
  refreshing = true;
  refreshButton.classList.add('is-refreshing');

  return sendMessage({ type: 'GET_STATE' })
    .then(renderStations)
    .catch(() => {
      setStatus('Impossible de charger les stations.');
    })
    .then(() => {
      refreshing = false;
      refreshButton.classList.remove('is-refreshing');
    });
}

refreshButton.addEventListener('click', refreshStations);

if (versionNode && api.runtime && typeof api.runtime.getManifest === 'function') {
  versionNode.textContent = 'v' + api.runtime.getManifest().version;
}

refreshStations();

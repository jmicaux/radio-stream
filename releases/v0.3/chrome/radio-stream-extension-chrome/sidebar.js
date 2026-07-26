const api = typeof browser !== 'undefined' ? browser : chrome;
const stationsNode = document.getElementById('stations');
const stopButton = document.getElementById('stop');
const statusNode = document.getElementById('status');

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

  stopButton.disabled = !isActive;
  stopButton.textContent = isActive ? 'Stop' : 'Stop';

  if (status === 'loading') {
    setStatus(station ? 'Connexion à ' + station.name + '...' : 'Connexion...');
    return;
  }

  if (status === 'playing') {
    setStatus(station ? station.name : '');
    return;
  }

  if (status === 'error') {
    setStatus('Flux indisponible.');
    return;
  }

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
  audio.addEventListener('playing', () => {
    status = 'playing';
    renderPlaybackState();
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

stopButton.addEventListener('click', stopAudio);

sendMessage({ type: 'GET_STATE' })
  .then(renderStations)
  .catch(() => {
    setStatus('Impossible de charger les stations.');
  });

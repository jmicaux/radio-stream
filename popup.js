const api = typeof browser !== 'undefined' ? browser : chrome;
const stationsNode = document.getElementById('stations');
const stopButton = document.getElementById('stop');
const statusNode = document.getElementById('status');

function sendMessage(message) {
  if (typeof browser !== 'undefined') {
    return browser.runtime.sendMessage(message);
  }

  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve);
  });
}

function setStatus(message) {
  statusNode.textContent = message || '';
}

function renderState(state) {
  const isActive = state.status === 'playing' || state.status === 'loading';

  document.querySelectorAll('.station').forEach((button) => {
    const active = button.dataset.stationId === state.currentStationId && isActive;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  stopButton.disabled = !isActive;

  if (state.status === 'loading') {
    setStatus('Connexion...');
    return;
  }

  if (state.status === 'playing') {
    const station = state.stations.find((item) => item.id === state.currentStationId);
    setStatus(station ? station.name : '');
    return;
  }

  if (state.status === 'error') {
    setStatus('Flux indisponible.');
    return;
  }

  setStatus('');
}

function createStationCard(station) {
  const card = document.createElement('div');
  card.className = 'station-card';
  card.style.setProperty('--station-color', station.color);

  const button = document.createElement('button');
  button.className = 'station';
  button.type = 'button';
  button.dataset.stationId = station.id;

  if (station.textColor) {
    card.style.setProperty('--station-text', station.textColor);
  }

  const mark = document.createElement('span');
  mark.className = 'mark';
  mark.textContent = station.mark || station.name;
  mark.setAttribute('aria-hidden', 'true');

  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = station.name;

  button.append(mark, name);
  button.addEventListener('click', () => {
    setStatus('Connexion...');
    sendMessage({
      type: 'PLAY_STATION',
      stationId: station.id
    }).then(renderState);
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
  stationsNode.textContent = '';
  state.stations.forEach((station) => {
    stationsNode.append(createStationCard(station));
  });
  renderState(state);
}

stopButton.addEventListener('click', () => {
  sendMessage({ type: 'STOP' }).then(renderState);
});

sendMessage({ type: 'GET_STATE' }).then(renderStations);

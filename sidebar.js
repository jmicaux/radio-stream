const api = typeof browser !== 'undefined' ? browser : chrome;
const stationsNode = document.getElementById('stations');
const stopButton = document.getElementById('stop');
const statusNode = document.getElementById('status');
const nowplayingNode = document.getElementById('nowplaying');
const refreshButton = document.getElementById('refresh');
const popoutButton = document.getElementById('popout');
const versionNode = document.getElementById('version');

const params = new URLSearchParams(window.location.search);
const isPopout = params.get('mode') === 'popout';

function storageGetLocal(keys) {
  if (typeof browser !== 'undefined') {
    return browser.storage.local.get(keys);
  }
  return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}

function storageSetLocal(values) {
  if (typeof browser !== 'undefined') {
    return browser.storage.local.set(values);
  }
  return new Promise((resolve) => chrome.storage.local.set(values, resolve));
}
const changelogOverlay = document.getElementById('changelog');
const changelogBody = document.getElementById('changelog-body');
const changelogClose = document.getElementById('changelog-close');

// Changelog shown when the version badge is clicked (newest first, SemVer).
const CHANGELOG = [
  { version: '0.4.1', date: '2026-07-30', changes: ['Correctif perf : l’arrêt coupe réellement le flux (fini le téléchargement en arrière-plan et les connexions qui s’empilaient à chaque relance).', 'Icônes « Détacher » et « Rafraîchir » alignées sur le toolkit.'] },
  { version: '0.4.0', date: '2026-07-30', changes: ['Nouveau bouton « Détacher » : ouvre le lecteur dans une fenêtre séparée pour continuer l’écoute même en fermant la sidebar (la station en cours est reprise).'] },
  { version: '0.3.10', date: '2026-07-30', changes: ['Bouton « Arrêter » plus lisible (icône + libellé, contraste renforcé) et contrastes de l’en-tête ajustés (accessibilité).'] },
  { version: '0.3.9', date: '2026-07-30', changes: ['Haut de la sidebar optimisé : titre en double retiré, et le bouton d’arrêt n’apparaît plus que pendant la lecture (barre « en lecture » compacte).'] },
  { version: '0.3.8', date: '2026-07-30', changes: ['En-tête épuré : titre, description et version regroupés sur une ligne.'] },
  { version: '0.3.7', date: '2026-07-30', changes: ['Numéro de version déplacé dans l’en-tête, cliquable pour afficher les nouveautés.'] },
  { version: '0.3.6', date: '2026-07-30', changes: ['Classement par usage rétabli : les radios les plus écoutées remontent en tête.'] },
  { version: '0.3.5', date: '2026-07-30', changes: ['Bouton rafraîchir dans la barre d’outils.', 'Version affichée lue depuis le manifest.'] },
  { version: '0.3.4', date: '2026-07-30', changes: ['Manifest Firefox conforme à la validation Mozilla (AMO).'] },
  { version: '0.3.3', date: '2026-07-30', changes: ['Badge « ON » sur l’icône pendant la lecture.', 'Station en cours de lecture bien plus visible.'] },
  { version: '0.3.2', date: '2026-07-30', changes: ['Lien « Site » de nouveau visible sous chaque station.'] },
  { version: '0.3.1', date: '2026-07-30', changes: ['Correction de 4 flux : RTL, RTL2, Fun Radio, RFM.'] },
  { version: '0.3.0', date: '2026-07-26', changes: ['Lecture depuis la sidebar avec surveillance du flux.'] }
];

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

// Fully release the current <audio> element AND abort its network request.
// pause() + removeAttribute('src') alone does NOT stop the ongoing download —
// the media element keeps buffering until load() runs its resource-reset
// algorithm. We also detach listeners so a stale element can't drive the UI.
function teardownAudio() {
  if (!audio) {
    return;
  }
  const el = audio;
  audio = null;
  el.onplaying = null;
  el.onerror = null;
  try {
    el.pause();
  } catch (error) {
    /* ignore */
  }
  el.removeAttribute('src');
  el.load();
}

function stopAudio() {
  teardownAudio();
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

  // The "now playing" bar (with the stop control) only exists while a station
  // is loading, playing, or errored; otherwise the stations sit at the top.
  const barVisible = status === 'loading' || status === 'playing' || status === 'error';
  nowplayingNode.hidden = !barVisible;
  if (barVisible) {
    nowplayingNode.setAttribute('data-state', status);
  } else {
    nowplayingNode.removeAttribute('data-state');
  }

  if (status === 'loading') {
    setActionBadge('...', station ? station.color : '#737373');
    setStatus(station ? 'Connexion à ' + station.name + '…' : 'Connexion…');
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

  teardownAudio();
  currentStationId = station.id;
  status = 'loading';
  renderPlaybackState();

  const el = new Audio(station.streamUrl);
  audio = el;
  el.preload = 'none';
  let usageRecorded = false;

  // All handlers are no-ops once `el` is no longer the current element, so a
  // superseded stream can never drive the UI or re-trigger a stop.
  el.onplaying = () => {
    if (audio !== el) {
      return;
    }
    status = 'playing';
    renderPlaybackState();
    // Count the play once it actually starts, so usage-based ordering reflects
    // real listening. The new order applies on the next refresh/reopen rather
    // than reshuffling tiles mid-playback.
    if (!usageRecorded) {
      usageRecorded = true;
      sendMessage({ type: 'RECORD_USAGE', stationId: station.id }).catch(() => {});
    }
  };
  el.onerror = () => {
    if (audio !== el) {
      return;
    }
    status = 'error';
    renderPlaybackState();
  };

  el.play().catch((error) => {
    if (audio !== el) {
      return;
    }
    // A fresh pop-out window may block autoplay (no user gesture yet): don't
    // show a stream error, just return to a clickable state.
    if (error && error.name === 'NotAllowedError') {
      stopAudio();
      return;
    }
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

// Pop-out: open the sidebar content in a detached window so the user can close
// the sidebar and keep listening. The current station is handed off via the URL
// and the sidebar's own audio is stopped to avoid playing twice.
function openPopout() {
  const active = (status === 'playing' || status === 'loading') && currentStationId;
  const handoff = active ? '&station=' + encodeURIComponent(currentStationId) : '';
  const url = api.runtime.getURL('sidebar.html') + '?mode=popout' + handoff;

  storageGetLocal('popoutBounds')
    .then((result) => (result && result.popoutBounds) || {})
    .catch(() => ({}))
    .then((bounds) => {
      const opts = { url: url, type: 'popup', width: bounds.width || 380, height: bounds.height || 640 };
      if (typeof bounds.left === 'number') opts.left = bounds.left;
      if (typeof bounds.top === 'number') opts.top = bounds.top;
      return api.windows.create(opts);
    })
    .then(() => {
      // Hand playback over to the detached window.
      stopAudio();
    })
    .catch(() => {});
}

popoutButton.addEventListener('click', openPopout);

if (isPopout) {
  document.documentElement.classList.add('popout');
  // No point popping out an already-detached window.
  popoutButton.hidden = true;

  // Remember the window size/position (debounced) to restore it next time.
  let boundsTimer;
  window.addEventListener('resize', () => {
    clearTimeout(boundsTimer);
    boundsTimer = setTimeout(() => {
      storageSetLocal({
        popoutBounds: {
          width: window.outerWidth,
          height: window.outerHeight,
          left: window.screenX,
          top: window.screenY
        }
      });
    }, 600);
  });
}

if (versionNode && api.runtime && typeof api.runtime.getManifest === 'function') {
  versionNode.textContent = 'v' + api.runtime.getManifest().version;
}

function buildChangelog() {
  const fragment = document.createDocumentFragment();

  CHANGELOG.forEach((entry) => {
    const item = document.createElement('section');
    item.className = 'changelog-entry';

    const head = document.createElement('div');
    head.className = 'changelog-entry-head';

    const version = document.createElement('span');
    version.className = 'changelog-version';
    version.textContent = 'v' + entry.version;

    const date = document.createElement('span');
    date.className = 'changelog-date';
    date.textContent = entry.date;

    head.append(version, date);

    const list = document.createElement('ul');
    list.className = 'changelog-list';
    entry.changes.forEach((change) => {
      const line = document.createElement('li');
      line.textContent = change;
      list.append(line);
    });

    item.append(head, list);
    fragment.append(item);
  });

  changelogBody.textContent = '';
  changelogBody.append(fragment);
}

function openChangelog() {
  if (!changelogBody.childNodes.length) {
    buildChangelog();
  }
  changelogOverlay.hidden = false;
  versionNode.setAttribute('aria-expanded', 'true');
  changelogClose.focus();
}

function closeChangelog() {
  if (changelogOverlay.hidden) {
    return;
  }
  changelogOverlay.hidden = true;
  versionNode.setAttribute('aria-expanded', 'false');
  versionNode.focus();
}

versionNode.addEventListener('click', openChangelog);
changelogClose.addEventListener('click', closeChangelog);

// Close on backdrop click (but not when clicking inside the dialog).
changelogOverlay.addEventListener('click', (event) => {
  if (event.target === changelogOverlay) {
    closeChangelog();
  }
});

// Escape closes; Tab is trapped on the close button (only focusable control).
document.addEventListener('keydown', (event) => {
  if (changelogOverlay.hidden) {
    return;
  }
  if (event.key === 'Escape') {
    closeChangelog();
  } else if (event.key === 'Tab') {
    event.preventDefault();
    changelogClose.focus();
  }
});

refreshStations().then(() => {
  if (isPopout) {
    const wanted = params.get('station');
    const station = wanted && stations.find((item) => item.id === wanted);
    if (station) {
      playStation(station);
    }
  }
});

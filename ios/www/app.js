'use strict';

const USAGE_KEY = 'stationUsage';
const grid = document.getElementById('stations');
const tiles = new Map();

let stations = [];
let current = { state: 'stopped', stationId: null };

async function loadUsage() {
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences) {
    const { value } = await window.Capacitor.Plugins.Preferences.get({ key: USAGE_KEY });
    return value ? JSON.parse(value) : {};
  }
  return JSON.parse(localStorage.getItem(USAGE_KEY) || '{}');
}

async function saveUsage(usage) {
  const value = JSON.stringify(usage);
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences) {
    return window.Capacitor.Plugins.Preferences.set({ key: USAGE_KEY, value: value });
  }
  localStorage.setItem(USAGE_KEY, value);
}

function createTile(station) {
  const button = document.createElement('button');
  button.className = 'tile';
  button.type = 'button';
  button.dataset.stationId = station.id;
  button.style.background = station.color;
  if (station.textColor) {
    button.style.color = station.textColor;
  }
  button.setAttribute('aria-label', `Écouter ${station.name}`);
  button.innerHTML =
    `<span class="mark">${station.mark}</span><span class="name">${station.name}</span>` +
    `<span class="status" aria-live="polite"></span>`;
  button.addEventListener('click', () => toggle(station));
  return button;
}

function toggle(station) {
  const isCurrent = current.stationId === station.id;
  if (isCurrent && (current.state === 'playing' || current.state === 'connecting')) {
    return RadioBridge.stop();
  }
  return RadioBridge.play({ stationId: station.id, url: station.streamUrl, title: station.name });
}

function render() {
  for (const [id, tile] of tiles) {
    const isCurrent = current.stationId === id;
    const state = isCurrent ? current.state : 'stopped';
    tile.dataset.state = state;
    tile.setAttribute('aria-pressed', String(isCurrent && state === 'playing'));
    tile.querySelector('.status').textContent =
      state === 'connecting' ? 'Connexion…' : state === 'playing' ? 'En lecture' : state === 'error' ? 'Indisponible' : '';
  }
}

let counted = null;

async function onStateChange(next) {
  current = { state: next.state, stationId: next.stationId };
  render();

  // Count a play only once it is actually playing, matching the extension.
  if (next.state === 'playing' && counted !== next.stationId) {
    counted = next.stationId;
    saveUsage(RadioOrdering.record(await loadUsage(), next.stationId, Date.now()));
  }
  if (next.state !== 'playing') {
    counted = null;
  }
}

async function start() {
  const response = await fetch('stations.json');
  const catalogue = await response.json();
  stations = RadioOrdering.sort(catalogue, await loadUsage());

  for (const station of stations) {
    const tile = createTile(station);
    tiles.set(station.id, tile);
    grid.append(tile);
  }

  RadioBridge.onStateChange(onStateChange);
  onStateChange(await RadioBridge.getState());

  // The WebView must realign on the native truth every time it comes back:
  // the lock screen, a call or a dropped network may have changed it.
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener('appStateChange', async ({ isActive }) => {
      if (isActive) {
        onStateChange(await RadioBridge.getState());
      }
    });
  }
}

start();

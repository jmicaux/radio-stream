const api = typeof browser !== 'undefined' ? browser : chrome;

let audio = null;
let currentToken = 0;
let heartbeatTimer = null;

function notifyPlaybackStatus(status, stationId, token, error) {
  const message = {
    type: 'PLAYBACK_STATUS',
    target: 'background',
    status: status,
    stationId: stationId,
    token: token
  };

  if (error) {
    message.error = error;
  }

  api.runtime.sendMessage(message);
}

function notifyHeartbeat(stationId, token) {
  if (!audio || token !== currentToken) {
    return;
  }

  api.runtime.sendMessage({
    type: 'PLAYBACK_STATUS',
    target: 'background',
    status: 'heartbeat',
    stationId: stationId,
    token: token,
    currentTime: audio.currentTime || 0,
    paused: audio.paused,
    ended: audio.ended
  });
}

function stopHeartbeat() {
  if (!heartbeatTimer) {
    return;
  }

  clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

function startHeartbeat(stationId, token) {
  stopHeartbeat();
  notifyHeartbeat(stationId, token);
  heartbeatTimer = setInterval(() => {
    notifyHeartbeat(stationId, token);
  }, 5000);
}

function stopAudio() {
  if (!audio) {
    stopHeartbeat();
    return;
  }

  const stoppedAudio = audio;
  audio = null;
  stopHeartbeat();
  stoppedAudio.pause();
  stoppedAudio.removeAttribute('src');
  // load() runs the resource-reset algorithm, aborting the ongoing download;
  // without it the element keeps buffering after "stop".
  stoppedAudio.load();
}

function playStation(stationId, streamUrl, token) {
  stopAudio();
  currentToken = token;

  audio = new Audio(streamUrl);
  audio.preload = 'auto';
  audio.addEventListener('playing', () => {
    if (token !== currentToken) {
      return;
    }

    startHeartbeat(stationId, token);
    notifyPlaybackStatus('playing', stationId, token);
  });
  audio.addEventListener('pause', () => {
    if (token !== currentToken) {
      return;
    }

    stopHeartbeat();
    notifyPlaybackStatus('stopped', stationId, token);
  });
  audio.addEventListener('ended', () => {
    if (token !== currentToken) {
      return;
    }

    stopHeartbeat();
    notifyPlaybackStatus('stopped', stationId, token);
  });
  audio.addEventListener('error', () => {
    if (token !== currentToken) {
      return;
    }

    stopHeartbeat();
    const error = audio && audio.error ? 'Audio error ' + audio.error.code : 'Audio playback failed';
    notifyPlaybackStatus('error', stationId, token, error);
  });

  audio.play().catch((error) => {
    if (token !== currentToken) {
      return;
    }

    stopHeartbeat();
    notifyPlaybackStatus('error', stationId, token, error && error.message ? error.message : 'Audio playback failed');
  });
}

api.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.target !== 'offscreen') {
    return false;
  }

  if (message.type === 'PLAY_STATION') {
    currentToken = message.token || 0;
    playStation(message.stationId, message.streamUrl, currentToken);
    sendResponse({ ok: true });
    return false;
  }

  if (message.type === 'STOP') {
    if (!message.token || message.token === currentToken) {
      stopAudio();
      notifyPlaybackStatus('stopped', message.stationId || null, message.token || currentToken);
    }
    sendResponse({ ok: true });
    return false;
  }

  return false;
});

setTimeout(() => {
  api.runtime.sendMessage({
    type: 'PLAYER_READY',
    target: 'background'
  });
}, 0);

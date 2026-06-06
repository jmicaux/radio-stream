# Radio Stream

Browser extension to play popular French live radio streams from the browser sidebar.

Chrome / Chromium and Firefox use the browser sidebar so playback remains integrated and stoppable without focusing a hidden player tab.

## Radios

- France Inter
- RMC
- franceinfo
- RTL
- NRJ
- Nostalgie
- FIP
- Europe 1
- Skyrock
- ici
- Chérie FM
- RFM
- France Culture
- Rire et Chansons
- RTL2
- Radio Classique
- Europe 2
- Fun Radio
- Radio FG
- France Musique
- Sud Radio
- Oui FM
- Radio Nova
- Chante France
- BFM Radio
- Jazz Radio
- Générations
- Outre-Mer la 1ère
- RCI Guadeloupe
- BFM Business

Each radio tile starts or stops the live audio stream. The `Site` link opens the station website in a new tab.
Stations are sorted locally by usage: the radios you play most appear first, with ties resolved by most recent use and then the ACPM ranking order.

## Install Temporarily

### Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Click `Load Temporary Add-on...`.
3. For source testing, select `manifest.firefox.json` from this project folder.
4. For packaged testing, use `dist/v0.2/firefox/radio-stream-extension-firefox.zip`.

Firefox self-hosted updates use `releases/v0.2/firefox/updates.json`, which points to the packaged XPI in `releases/v0.2/firefox/`.
Chrome packaged builds live in `dist/v0.2/chrome/` and `releases/v0.2/chrome/`.

### Chrome / Chromium

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this project folder.
5. For packaged testing, use `dist/v0.2/chrome/radio-stream-extension-chrome.zip`.
Chrome release artifacts are mirrored in `releases/v0.2/chrome/` for symmetry with Firefox.

## Notes

- This extension uses direct audio streams rather than opening radio website player pages.
- The radio list follows the top 30 ACPM Radio Brands France ranking from April 2026.
- `ici` and `Outre-Mer la 1ère` are ACPM brand aggregates, so the extension uses representative live streams for those brands.
- Local usage sorting is stored in the browser with `storage.local`.
- The `Stop` button stops the current stream.
- Playback is controlled from the sidebar.
- Firefox update manifests use the add-on ID `radio-stream@jmicaux.github.io`.

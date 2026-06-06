# Radio Stream

Browser extension to play popular French live radio streams from the toolbar.

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
3. Select `manifest.json` from this project folder.

### Chrome / Chromium

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this project folder.

## Build ZIP

Run from the project root:

```sh
mkdir -p versions/v0.2
zip -r versions/v0.2/radio-stream-extension.zip manifest.json background.js popup.html offscreen.html popup.css popup.js offscreen.js assets
```

The generated ZIP can be used for browser extension installation workflows that accept packed extension archives.

## Notes

- This extension uses direct audio streams rather than opening radio website player pages.
- The radio list follows the top 30 ACPM Radio Brands France ranking from April 2026.
- `ici` and `Outre-Mer la 1ère` are ACPM brand aggregates, so the extension uses representative live streams for those brands.
- Local usage sorting is stored in the browser with `storage.local`.
- The toolbar badge shows `ON` while a station is playing.
- The `Stop` button stops the current stream.

# Radio Stream

Browser extension to play a small set of French live radio streams from the toolbar.

## Radios

- RTL
- Europe 1
- France Inter
- franceinfo

Each radio tile starts or stops the live audio stream. The `Site` link opens the station website in a new tab.

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
zip -r radio-stream-extension.zip manifest.json background.js popup.html popup.css popup.js assets
```

The generated ZIP can be used for browser extension installation workflows that accept packed extension archives.

## Notes

- This extension uses direct audio streams rather than opening radio website player pages.
- The toolbar badge shows `ON` while a station is playing.
- The `Stop` button stops the current stream.

# Radio Stream

Browser extension to play popular French live radio streams from the browser sidebar.
Chrome / Chromium and Firefox use the browser sidebar so playback remains integrated and
stoppable without focusing a hidden player tab.

![version](https://img.shields.io/badge/version-0.3-blue) ![vanilla](https://img.shields.io/badge/stack-vanilla_JS-f7df1e) ![no build](https://img.shields.io/badge/build-none-brightgreen) ![manifest](https://img.shields.io/badge/manifest-v3-8b5cf6) ![browsers](https://img.shields.io/badge/browsers-Chrome_+_Firefox-3b82f6)

**🔗 Live preview: [jmicaux.github.io/radio-stream](https://jmicaux.github.io/radio-stream/)**

If you enjoy this extension, you can support it:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy_me_a_coffee-ffdd00?style=flat-square&logo=buymeacoffee&logoColor=1a1a1a)](https://buymeacoffee.com/jmicaux)

## Features

- **Sidebar playback** — play popular French live radio stations directly from the browser
  sidebar; the `Stop` button stops the current stream.
- **One-click tiles** — each tile starts or stops the live audio stream; the `Site` link
  opens the station website in a new tab.
- **Usage-based ordering** — stations are sorted locally (saved with `storage.local`): the
  radios you play most appear first, with ties resolved by most recent use, then ACPM rank.

### Supported stations

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

## Install & usage

### Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Click `Load Temporary Add-on...`.
3. For source testing, select `manifest.firefox.json` from this project folder.
4. For packaged testing, use `dist/v0.3/firefox/radio-stream-extension-firefox.zip`.

Firefox self-hosted updates use `releases/v0.3/firefox/updates.json`, which points to the packaged XPI in `releases/v0.3/firefox/`.

### Chrome / Chromium

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this project folder.
5. For packaged testing, use `dist/v0.3/chrome/radio-stream-extension-chrome.zip`.

Chrome release artifacts are mirrored in `releases/v0.3/chrome/` for symmetry with Firefox.

## Project structure

```
radio-stream/
├── manifest.json            # Chrome/Chromium manifest (MV3)
├── manifest.firefox.json    # Firefox manifest (MV3)
├── background.js            # service worker: stream control, usage sorting
├── offscreen.html/.js       # offscreen document for audio playback
├── sidebar.html/.js         # sidebar UI
├── popup.css               # shared styles
├── assets/                 # icons
├── dist/ , releases/       # packaged builds and self-hosted update artifacts
└── README.md
```

## Data sources

- The station list follows the top 30 ACPM Radio Brands France ranking (April 2026).
- `ici` and `Outre-Mer la 1ère` are ACPM brand aggregates, so the extension uses
  representative live streams for those brands.
- Each station plays its own public live stream directly rather than opening its website
  player page.

## License

Licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE.md): you are free to fork,
modify and share this project **for noncommercial purposes**, as long as you keep the
attribution (`Required Notice: Copyright jmicaux`). Commercial use is not permitted.

## Credits

Audio is streamed directly from each station's own public live stream (Radio France, RTL /
RTL2 / Fun Radio, the NRJ group, Europe 1, Skyrock, BFM, Infomaniak, …). This extension does
not host or rebroadcast any audio, and is not affiliated with, endorsed by, or certified by
any radio station or broadcaster.

Built with the help of [Claude](https://claude.ai/code).

# Changelog

All notable changes to Radio Stream are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project adheres to [Semantic Versioning](https://semver.org/).

## [0.4.2] — 2026-07-30

### Changed
- Point 5 streams straight at their final host to drop a 302 redirect on every
  play: France Inter and franceinfo → `icecast.radiofrance.fr`, Europe 1 →
  `europe1.lmn.fm`, RFM → `rfm.lmn.fm`, Chante France → `chantefrance.ice.
  infomaniak.ch` (also upgraded from HTTP to HTTPS). RTL/RTL2/Fun Radio and
  Radio FG/RCI Guadeloupe keep their entry URLs (their redirect issues a
  short-lived token / balanced host that can't be hardcoded).
- Removed the now-dead host_permissions entries in both manifests.

## [0.4.1] — 2026-07-30

### Fixed
- Stopping a stream now actually aborts the network request. The `<audio>`
  element was paused and its `src` removed but never `load()`-ed, so it kept
  downloading in the background; replaying the same station stacked a new
  connection each time. Added `load()` on stop/teardown (sidebar, offscreen,
  background) and bound the audio event handlers to their specific element so a
  superseded stream can no longer stack requests or drive the UI.

### Changed
- Pop-out and refresh icons now match the 3DS Web Factory Toolkit extension.

## [0.4.0] — 2026-07-30

### Added
- Pop-out button that opens the player in a detached window (`windows.create`,
  `type: "popup"`), so you can close the sidebar and keep listening. The current
  station is handed off through the URL and resumes in the new window (with a
  graceful fallback when the browser blocks autoplay — no misleading error), and
  the window remembers its size and position. The button is hidden inside the
  detached window itself.

## [0.3.10] — 2026-07-30

### Fixed
- Accessibility of the "now playing" bar and header. The stop control is now a
  labelled button (square icon + "Arrêter", red on white ≈ 6.4:1) instead of a
  faint icon-only square, and the header/version/date greys were darkened to
  meet WCAG contrast (≥ 4.5:1 text, ≥ 3:1 icons).

## [0.3.9] — 2026-07-30

### Changed
- Optimized the top of the sidebar. Removed the in-panel app title (the browser
  already labels the sidebar), leaving a single slim row (tagline + version +
  refresh). The Stop control is no longer a large always-on button: a compact
  "now playing" bar (state dot + station name + stop) appears only while a
  station is loading/playing, so stations sit at the top when idle.

## [0.3.8] — 2026-07-30

### Changed
- Sidebar header tidied up to match the house style: app name, a short tagline
  and the (clickable) version now sit on a single line, with the version kept
  discreet at the end instead of on its own row.

## [0.3.7] — 2026-07-30

### Added
- The version number moved into the sidebar header and is now a button that
  opens an accessible changelog dialog (SemVer entries, newest first; closes on
  Escape, backdrop click, or the close button).

## [0.3.6] — 2026-07-30

### Fixed
- Usage-based ordering works again. Playback had moved into the sidebar and no
  longer told the background to record plays, so the order never changed. The
  sidebar now sends a `RECORD_USAGE` message once a station actually starts, and
  the background persists it. The new order applies on the next refresh/reopen
  (tiles are not reshuffled mid-playback).

## [0.3.5] — 2026-07-30

### Added
- Discreet refresh button in the sidebar toolbar to reload the station list
  (spins while refreshing; respects reduced-motion). Playback is not
  interrupted.

### Fixed
- The version shown at the bottom of the sidebar is now read from the manifest
  instead of a hard-coded `v0.3`.

## [0.3.4] — 2026-07-30

### Changed
- Firefox manifest made compliant with Mozilla-hosted (AMO) validation:
  removed `gecko.update_url` (not allowed for AMO-hosted add-ons — AMO handles
  updates), dropped the unsupported `power` permission (Chrome-only; the code
  already guards `api.power`), and declared `gecko.data_collection_permissions`
  as `none`. `web-ext lint`: 0 errors, 0 warnings.

## [0.3.3] — 2026-07-30

### Fixed
- The toolbar icon shows the `ON` badge again while a station is playing (and
  `...` / `ERR` while connecting / on error). Playback moved into the sidebar,
  which no longer notified the background, so the badge was never updated; it is
  now driven directly from the sidebar.
- The playing station is now clearly highlighted: a colored ring plus a play
  badge (not color alone, per WCAG 1.4.1) and a bolder name, in addition to the
  existing `aria-pressed` state.

## [0.3.2] — 2026-07-30

### Fixed
- The `Site` link under each station is now visible again (it was hidden by a
  `display: none` rule), so you can open a station's website from the sidebar.

## [0.3.1] — 2026-07-30

### Fixed
- Updated 4 broken stream URLs that returned "flux indisponible": RTL, RTL2 and
  Fun Radio moved from `streaming.radio.*.fr` to `icecast.*.fr`, and RFM moved to
  `stream.rfm.fr`. URLs verified live.
- Cleaned up `host_permissions` in both manifests (added `*.rfm.fr`, removed dead hosts).

## [0.3] — 2026-07-26

### Added
- Interactive live-preview page (simulated browser + working sidebar).
- Project badges, screenshot and documentation aligned with the other jmicaux projects.

### Changed
- Playback runs through an offscreen document on Chrome and a hidden player tab on
  Firefox, with a heartbeat watchdog that restarts a stalled stream.
- Stations are sorted locally by usage (most played first).

### Security
- Dropped the unused, broad `tabs` permission (least privilege). Packaged builds
  regenerated accordingly.

## [0.2]

### Added
- Firefox build alongside Chrome, with self-hosted update manifests.
- Packaged `.zip` / `.xpi` artifacts under `dist/` and `releases/`.

## [0.1]

### Added
- Initial release: play popular French live radio streams from the browser sidebar.

[0.3]: https://github.com/jmicaux/radio-stream/releases/tag/v0.3
[0.2]: https://github.com/jmicaux/radio-stream/releases/tag/v0.2
[0.1]: https://github.com/jmicaux/radio-stream/releases/tag/v0.1

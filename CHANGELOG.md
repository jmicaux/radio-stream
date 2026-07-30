# Changelog

All notable changes to Radio Stream are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project adheres to [Semantic Versioning](https://semver.org/).

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

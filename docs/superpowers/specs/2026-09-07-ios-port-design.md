# iOS port — design

Date: 2026-09-07
Status: approved, pending implementation plan

## 1. Context and goal

Radio Stream is a Manifest V3 browser extension that plays French live radio
streams from the browser sidebar. This document specifies an iOS port for
personal use, sideloaded from Xcode. It is not intended for the App Store.

Because distribution is private, two risks that would otherwise dominate the
design are out of scope: Apple review (guideline 4.2, "minimum functionality")
and the right to redistribute third-party streams. Both must be revisited
before any public release.

Success means: the app launches on the iPhone, plays any of the 30 stations,
keeps playing with the screen locked, and is controllable from the lock screen.

## 2. Scope

In scope:

- The 30 stations defined in `background.js`, at parity with the extension.
- Usage-based ordering, identical to the extension's behaviour.
- Background playback and lock screen / control centre transport controls.

Out of scope for v1:

- Sleep timer, CarPlay, home screen widget, Siri intents.
- The pop-out window, which answers a browser sidebar constraint that does not
  exist on iOS.
- Catalogue expansion beyond the current 30 stations.
- A macOS CI runner. Swift tests run locally.

## 3. Architecture

The WebView owns the interface. It never plays audio. A custom Capacitor
plugin owns playback natively.

| Unit | Responsibility | Depends on |
| --- | --- | --- |
| `shared/ordering.js` | Sort stations, record a play | Nothing. Pure functions |
| `ios/www` | Tiles, visual state, bridge calls | `ordering.js`, `stations.json`, the bridge |

`ios/www` is a touch-oriented interface reusing the markup and styles of
`index.html`, not a copy of the extension sidebar: no pop-out, larger tap
targets, and playback driven through the bridge instead of an `Audio` element.
| `RadioAudio.swift` | Playback, audio session, now playing info | Nothing from the web. Receives a URL |

Audio is native because media in a `WKWebView` is suspended aggressively when
the app backgrounds, and the behaviour varies by iOS version. An app whose
primary function is listening while doing something else cannot rest on that.
Native playback uses `AVPlayer`, `AVAudioSession` in the `.playback` category,
`MPNowPlayingInfoCenter` and `MPRemoteCommandCenter`.

`RadioAudio.swift` knows nothing about the catalogue, ordering or colours. It
receives a URL, a title and an opaque station id it echoes back untouched.

## 4. Shared catalogue

`shared/stations.json` becomes the single source of truth for the 30 stations.
Schema per station: `id`, `name`, `mark`, `streamUrl`, `siteUrl`, `color`.

The extension does not read it at runtime. `STATIONS` is currently a top-level
constant read synchronously by `sortStations` and `stationRank`; making it
async would reorder the initialisation of an MV3 service worker that is
already published and tested on two browsers, for no user-visible benefit.

Instead, `scripts/sync-stations.js` regenerates the station block in
`background.js` and `index.html` from `stations.json`, and a drift test fails
if any of the three has diverged. Single source of truth, zero runtime change
in the shipped extension, and divergence becomes impossible to commit rather
than merely unlikely.

The asymmetry is deliberate: the iOS app imports `stations.json` directly,
since it is new code with no regression risk, while the extension and the demo
page keep their generated inline blocks. All three are still checked against
the same source.

`sortStations` and `recordUsage` move to `shared/ordering.js`, exported as
`sort(stations, usage)` and `record(usage, stationId, now)`. `now` is injected
rather than read from `Date.now()` so ordering is testable without faking the
clock. They perform no
storage access: they receive the `usage` object and return it modified. Each
platform supplies its own load and save. This keeps the ordering logic
testable without a browser or a simulator, and lets it run unchanged against
`chrome.storage.local` and Capacitor Preferences, which are both async.

## 5. Bridge contract

The native side is the source of truth for playback state. The WebView holds
no "currently playing" variable; it asks, then listens. This is required
because state changes without JavaScript's knowledge: incoming calls,
headphones unplugged, lock screen commands, network loss.

```js
const RadioAudio = registerPlugin('RadioAudio');

await RadioAudio.play({ stationId, url, title });
await RadioAudio.stop();
await RadioAudio.getState();

RadioAudio.addListener('stateChange', ({ state, stationId, error }) => {});
```

States: `stopped`, `connecting`, `playing`, `error`. Three are taken from the
vocabulary already used in `background.js`. `connecting` is added because a
stream can take seconds to start on cellular, and without it the tile stays
inert after a tap, inviting a second tap.

`stateChange` is not only a reply to `play`. Swift also emits it for events
the WebView cannot observe: `AVAudioSession.interruptionNotification`,
`routeChangeNotification`, `MPRemoteCommandCenter` commands, and stream
failure or stalling observed on `AVPlayerItem`.

## 6. Data flow

Cold start:

```
WKWebView loads ios/www/index.html   (bundled, no network)
  -> import stations.json            (bundled)
  -> Preferences.get('stationUsage') (UserDefaults, async)
  -> ordering.sort(stations, usage)  (pure)
  -> render 30 tiles
  -> RadioAudio.getState()           (reconcile)
```

No part of this path touches the network, so the app opens and renders
offline. Only a tap can fail, and it fails on that tile alone.

Capacitor Preferences is used rather than `localStorage` because it is backed
by `UserDefaults` and survives WebView data clearing, which iOS may decide on
its own.

On every return to the foreground the WebView calls `getState()` and realigns
on what Swift reports. It never assumes its display from twenty minutes ago is
still valid. `App.addListener('appStateChange')` is used rather than
`visibilitychange`, which is not reliable in a `WKWebView`.

Usage is recorded on the `stateChange` transition to `playing`, never on tap.
This matches `sidebar.js`, which already counts on `onplaying` so that
ordering reflects real listening. A useful consequence: a play started from
the lock screen, with the WebView not even foregrounded, is counted too.

Tiles are not reordered during playback. The new order applies on the next
cold start, which is also the extension's behaviour.

## 7. Error handling

Two patterns from the existing code are reproduced in Swift rather than
reinvented.

Race guard. Tapping three stations in quick succession overlaps three
connections, and the slowest can overwrite the state of the most recent.
`sidebar.js` solves this by making every handler a no-op once its audio
element is no longer current. The Swift equivalent is a generation token
incremented on each `play`; any callback carrying a stale token does nothing.
Without it, the displayed station is not the one being heard.

Watchdog. `background.js` watches two distinct symptoms: a heartbeat silent
for 15 seconds, and a stream that has not progressed for 20 seconds, with a
10 second guard between restarts. The same thresholds apply to `AVPlayer`,
observing `timeControlStatus` stuck in `waitingToPlayAtSpecifiedRate` and a
periodic time observer that stops advancing. This is what lets a
server-dropped Icecast stream recover on its own.

iOS specifics:

- Interruptions: honour the `shouldResume` option rather than always resuming.
- Route changes: pause on `oldDeviceUnavailable`. iOS requires it, and not
  doing it means the phone starts playing out loud when headphones come out.
- HTTP streams: Skyrock (`icecast.skyrock.net`) and Outre-mer
  (`outremer.ice.infomaniak.ch`) are plain HTTP. They get a scoped
  `NSExceptionDomains` entry, never a global `NSAllowsArbitraryLoads`, which
  would disable transport security for the other 28 stations.
- Connection timeout: 15 seconds, consistent with the heartbeat threshold.

Errors are always local to a tile and always recoverable: the tile shows
`error`, becomes tappable again immediately, and nothing else is affected.
There is no global error state and no modal.

## 8. Testing

The repository currently has no tests. CI performs syntax validation and a
`web-ext lint` only. This infrastructure is created by this work.

| Suite | Runs on |
| --- | --- |
| `ordering` and catalogue drift | GitHub CI, existing Ubuntu runner |
| State machine, generation token, watchdog | XCTest, locally on the Mac |
| Lock screen, interruptions, network loss | Manual checklist on the iPhone |

`shared/ordering.js` is tested with `node --test`, built into the Node 20 that
CI already installs, so no `package.json` and no dependency is added. Cases:
tie-break by `count`, then `lastPlayedAt`, then original rank; a never-played
station; empty usage; a station present in `usage` but removed from the
catalogue.

The drift test reads `stations.json`, extracts the blocks from `background.js`
and `index.html`, and fails on divergence. It is what makes the single source
of truth real rather than declarative.

`RadioAudio.swift` places `AVPlayer` behind a protocol with an injectable
clock, so the generation token, the watchdog thresholds and the state machine
are testable without sound or network. `AVPlayer` itself is not under test.

A state machine written twice always diverges. It is therefore described once,
as a JSON case table of start state, event and expected state, consumed by
both the JavaScript and the Swift suites. Adding a state breaks both suites
instead of letting one of them lie.

What cannot be tested automatically, and goes into a release checklist run on
the device: playback surviving screen lock, control centre transport,
interruption by a real call, headphones unplugged, network loss in transit.
None of these are faithful in the simulator.

## 9. Repository layout

```
radio-stream/
  shared/
    stations.json
    ordering.js
  background.js
  index.html
  ios/
    www/
    App/
    RadioAudio.swift
  scripts/
    sync-stations.js
```

The iOS project lives in the same repository so that one clone on the Mac
carries the shared catalogue, and so that a catalogue change and its iOS
consequence land in the same commit.

## 10. Deferred decisions

- Public distribution, which would reopen stream redistribution rights and
  Apple review.
- Sleep timer, CarPlay entitlement, widget, AirPlay surfacing.
- Whether `index.html` should eventually become an installable PWA, which
  would share `ios/www` almost entirely.

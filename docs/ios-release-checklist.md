# iOS release checklist

Run on a real iPhone before each sideload. None of these are faithful in the
simulator.

- [ ] Play a station, lock the screen, confirm audio continues for 2 minutes.
- [ ] From the lock screen, confirm the station name is shown and Stop works.
- [ ] From Control Centre, confirm Stop works.
- [ ] Receive a phone call while playing: audio pauses; after hanging up it
      does not resume unless iOS allows it.
- [ ] Unplug headphones or disconnect AirPods while playing: audio pauses and
      does not jump to the speaker.
- [ ] Enable Airplane Mode, tap a station: the tile shows Indisponible and
      stays tappable. No crash, no modal.
- [ ] Play Skyrock and Outre-Mer la 1ère specifically: both are plain HTTP and
      prove the ATS exceptions are in place.
- [ ] Tap five stations in rapid succession: the station shown is the one
      being heard.
- [ ] Force-quit and relaunch: the most played station is first.

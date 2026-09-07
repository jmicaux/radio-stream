// ios/App/RadioAudio.swift
import Foundation
import AVFoundation
import MediaPlayer
import Capacitor

@objc(RadioAudio)
public class RadioAudio: CAPPlugin {
    private var player: AVPlayer?
    private var state: PlaybackState = .stopped
    private var stationId: String?
    private var title: String?

    /// Incremented on every play. Callbacks carrying a stale token do nothing,
    /// so a slow connection can never overwrite a newer one.
    private var generation = 0

    private var timeObserver: Any?
    private var lastProgressAt = Date.distantPast
    private var lastRestartAt = Date.distantPast
    private var watchdog: Timer?

    // The extension watches two symptoms, a silent heartbeat and a stalled
    // stream, because its offscreen document can die independently of the
    // stream. AVPlayer has no such split: the periodic time observer is the
    // heartbeat, so one stall threshold covers both cases.
    private let stallTimeout: TimeInterval = 20
    private let restartGuard: TimeInterval = 10
    private let connectTimeout: TimeInterval = 15

    override public func load() {
        configureSession()
        observeInterruptions()
        configureRemoteCommands()
    }

    // MARK: - Bridge

    @objc func play(_ call: CAPPluginCall) {
        guard let urlString = call.getString("url"), let url = URL(string: urlString) else {
            call.reject("a valid url is required")
            return
        }
        stationId = call.getString("stationId")
        title = call.getString("title")
        start(url: url)
        call.resolve()
    }

    @objc func stop(_ call: CAPPluginCall) {
        teardown()
        transition(.stop)
        call.resolve()
    }

    @objc func getState(_ call: CAPPluginCall) {
        call.resolve(["state": state.rawValue, "stationId": stationId as Any])
    }

    // MARK: - Playback

    private func start(url: URL) {
        generation += 1
        let token = generation
        teardown()
        transition(.play)

        let item = AVPlayerItem(url: url)
        let player = AVPlayer(playerItem: item)
        player.automaticallyWaitsToMinimizeStalling = true
        self.player = player

        NotificationCenter.default.addObserver(
            forName: .AVPlayerItemFailedToPlayToEndTime, object: item, queue: .main
        ) { [weak self] _ in
            guard let self, token == self.generation else { return }
            self.transition(.fail)
        }

        timeObserver = player.addPeriodicTimeObserver(
            forInterval: CMTime(seconds: 1, preferredTimescale: 1), queue: .main
        ) { [weak self] _ in
            guard let self, token == self.generation else { return }
            self.lastProgressAt = Date()
            if self.state == .connecting {
                self.transition(.connected)
                self.updateNowPlaying()
            }
        }

        lastProgressAt = Date()
        player.play()
        startWatchdog(token: token, url: url)
    }

    private func startWatchdog(token: Int, url: URL) {
        watchdog?.invalidate()
        watchdog = Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { [weak self] _ in
            guard let self, token == self.generation else { return }
            let idle = Date().timeIntervalSince(self.lastProgressAt)

            if self.state == .connecting, idle > self.connectTimeout {
                self.transition(.fail)
                return
            }
            if self.state == .playing,
               idle > self.stallTimeout,
               Date().timeIntervalSince(self.lastRestartAt) > self.restartGuard {
                self.lastRestartAt = Date()
                self.start(url: url)
            }
        }
    }

    private func teardown() {
        watchdog?.invalidate()
        watchdog = nil
        if let observer = timeObserver {
            player?.removeTimeObserver(observer)
            timeObserver = nil
        }
        player?.pause()
        player = nil
    }

    // MARK: - State

    private func transition(_ event: PlaybackEvent) {
        state = PlaybackMachine.reduce(state, event)
        if state == .stopped {
            stationId = nil
            MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
        }
        notifyListeners("stateChange", data: ["state": state.rawValue, "stationId": stationId as Any])
    }

    // MARK: - System integration

    private func configureSession() {
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
        try? AVAudioSession.sharedInstance().setActive(true)
    }

    private func observeInterruptions() {
        NotificationCenter.default.addObserver(
            forName: AVAudioSession.interruptionNotification, object: nil, queue: .main
        ) { [weak self] note in
            guard let self,
                  let raw = note.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt,
                  let type = AVAudioSession.InterruptionType(rawValue: raw) else { return }

            if type == .began {
                self.teardown()
                self.transition(.interrupt)
            } else if let optionsRaw = note.userInfo?[AVAudioSessionInterruptionOptionKey] as? UInt {
                // Only resume when the system says we may. Forcing a resume
                // after a call is a behaviour users hate.
                let options = AVAudioSession.InterruptionOptions(rawValue: optionsRaw)
                if options.contains(.shouldResume) {
                    self.transition(.resume)
                }
            }
        }

        NotificationCenter.default.addObserver(
            forName: AVAudioSession.routeChangeNotification, object: nil, queue: .main
        ) { [weak self] note in
            guard let self,
                  let raw = note.userInfo?[AVAudioSessionRouteChangeReasonKey] as? UInt,
                  AVAudioSession.RouteChangeReason(rawValue: raw) == .oldDeviceUnavailable else { return }
            // Headphones came out: iOS requires a pause rather than switching
            // to the speaker.
            self.teardown()
            self.transition(.routeLost)
        }
    }

    private func configureRemoteCommands() {
        let centre = MPRemoteCommandCenter.shared()
        centre.stopCommand.addTarget { [weak self] _ in
            self?.teardown()
            self?.transition(.stop)
            return .success
        }
        centre.pauseCommand.addTarget { [weak self] _ in
            self?.teardown()
            self?.transition(.stop)
            return .success
        }
        centre.playCommand.isEnabled = false
    }

    private func updateNowPlaying() {
        MPNowPlayingInfoCenter.default().nowPlayingInfo = [
            MPMediaItemPropertyTitle: title ?? "Radio",
            MPNowPlayingInfoPropertyIsLiveStream: true
        ]
    }
}

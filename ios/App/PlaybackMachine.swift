// ios/App/PlaybackMachine.swift
import Foundation

enum PlaybackState: String {
    case stopped, connecting, playing, error
}

enum PlaybackEvent: String {
    case play, connected, stop, fail, interrupt, resume, routeLost
}

/// Mirrors shared/playback-machine.js and is verified against the same
/// case table in shared/playback-states.json (18 rows).
enum PlaybackMachine {
    static func reduce(_ state: PlaybackState, _ event: PlaybackEvent) -> PlaybackState {
        switch (state, event) {
        case (.stopped, .play), (.stopped, .resume): return .connecting
        case (.stopped, _): return .stopped

        case (.connecting, .connected): return .playing
        case (.connecting, .fail): return .error
        case (.connecting, .stop): return .stopped
        case (.connecting, .play): return .connecting
        // An interruption or a lost route mid-connect abandons the attempt
        // rather than leaving it stuck in `connecting` forever. These two
        // MUST be checked before the `.connecting` catch-all below.
        case (.connecting, .interrupt), (.connecting, .routeLost): return .stopped
        case (.connecting, _): return .connecting

        case (.playing, .stop), (.playing, .interrupt), (.playing, .routeLost): return .stopped
        case (.playing, .fail): return .error
        case (.playing, .play): return .connecting
        case (.playing, _): return .playing

        case (.error, .play): return .connecting
        case (.error, .stop): return .stopped
        case (.error, _): return .error
        }
    }
}

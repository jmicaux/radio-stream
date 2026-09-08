import XCTest
@testable import App

final class PlaybackMachineTests: XCTestCase {
    struct Case: Decodable {
        let from: String
        let event: String
        let to: String
        let why: String
    }

    func testMatchesTheSharedCaseTable() throws {
        let url = try XCTUnwrap(
            Bundle(for: type(of: self)).url(forResource: "playback-states", withExtension: "json")
        )
        let cases = try JSONDecoder().decode([Case].self, from: Data(contentsOf: url))
        XCTAssertGreaterThanOrEqual(cases.count, 16)

        for item in cases {
            let from = try XCTUnwrap(PlaybackState(rawValue: item.from))
            let event = try XCTUnwrap(PlaybackEvent(rawValue: item.event))
            XCTAssertEqual(
                PlaybackMachine.reduce(from, event).rawValue, item.to,
                "\(item.from) + \(item.event) should give \(item.to): \(item.why)"
            )
        }
    }

    func testAStoppedPlayerIgnoresLateCallbacks() {
        XCTAssertEqual(PlaybackMachine.reduce(.stopped, .connected), .stopped)
        XCTAssertEqual(PlaybackMachine.reduce(.stopped, .fail), .stopped)
    }
}

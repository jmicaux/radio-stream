#!/usr/bin/env bash
#
# Bootstraps the Capacitor project for the iOS app (Task 7 of the iOS port
# plan), doing every step that a command line can do. What is left afterwards
# needs the Xcode interface and is printed at the end.
#
# Safe to re-run: every step checks whether it has already been done, so an
# interrupted run can simply be started again.
#
# Requires macOS with Xcode and its command line tools.

set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root"

# The two plain-HTTP stream domains. Kept here so the plist and the catalogue
# cannot silently disagree about which exceptions are needed.
HTTP_DOMAINS=(icecast.skyrock.net outremer.ice.infomaniak.ch)

say() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }
warn() { printf '\033[33mwarning: %s\033[0m\n' "$1" >&2; }
die() { printf '\033[31merror: %s\033[0m\n' "$1" >&2; exit 1; }

# --- Preflight ---------------------------------------------------------------

say "Checking the environment"

[ "$(uname -s)" = "Darwin" ] || die "this script needs macOS; Capacitor cannot generate an Xcode project elsewhere"
command -v node >/dev/null || die "node is not installed"
command -v npm >/dev/null || die "npm is not installed"
command -v xcodebuild >/dev/null || die "Xcode is not installed, or xcode-select still points at the command line tools only"
[ -x /usr/libexec/PlistBuddy ] || die "PlistBuddy is missing; it ships with macOS at /usr/libexec/PlistBuddy"

node_major="$(node -p 'process.versions.node.split(".")[0]')"
[ "$node_major" -ge 20 ] || die "node 20 or newer is required (found $(node --version))"

echo "macOS $(sw_vers -productVersion), $(node --version), $(xcodebuild -version | head -1)"

# --- The web assets ----------------------------------------------------------

say "Refreshing ios/www from the shared catalogue"

node scripts/sync-stations.js
node --test test/ >/dev/null || die "the JavaScript test suite fails; fix that before building the app"
echo "tests pass, ios/www is in sync"

# The ATS exceptions below only make sense if those domains are really used.
for domain in "${HTTP_DOMAINS[@]}"; do
    grep -q "$domain" shared/stations.json \
        || warn "$domain is no longer in shared/stations.json; its ATS exception may be dead weight"
done
grep -o 'http://[^"]*' shared/stations.json | sed 's|http://||; s|/.*||' | sort -u | while read -r host; do
    printf '%s\n' "${HTTP_DOMAINS[@]}" | grep -qx "$host" \
        || warn "$host is a plain-HTTP stream with no ATS exception; it will not play"
done

# --- Capacitor ---------------------------------------------------------------

cd "$root/ios"

if [ ! -f package.json ]; then
    say "Creating ios/package.json"
    npm init -y >/dev/null
    # npm init names the package after the directory, which is just "ios".
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      pkg.name = 'radio-stream-ios';
      pkg.private = true;
      pkg.description = 'Sideloaded iOS app for Radio Stream';
      delete pkg.scripts.test;
      fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    "
else
    echo "ios/package.json already exists, keeping it"
fi

if [ ! -d node_modules/@capacitor/cli ]; then
    say "Installing Capacitor 6"
    # Pinned to the major version the plan was written against; Capacitor 7+
    # changes the plugin registration the Swift relies on.
    npm install \
        @capacitor/core@^6 \
        @capacitor/cli@^6 \
        @capacitor/app@^6 \
        @capacitor/preferences@^6
else
    echo "Capacitor is already installed"
fi

if [ ! -f capacitor.config.json ] && [ ! -f capacitor.config.ts ]; then
    say "Initialising the Capacitor project"
    npx cap init "Radio Stream" fr.jmicaux.radiostream --web-dir=www
else
    echo "Capacitor is already initialised"
fi

if [ ! -d ios ]; then
    say "Generating the Xcode project"
    npx cap add ios
else
    echo "the Xcode project already exists"
fi

xcode_app="$root/ios/ios/App/App"
[ -d "$xcode_app" ] || die "expected the generated project at $xcode_app but it is not there"

# --- The hand-written Swift --------------------------------------------------

say "Moving the hand-written Swift into the generated project"

for file in PlaybackMachine.swift RadioAudio.swift; do
    if [ -f "$root/ios/App/$file" ]; then
        mv "$root/ios/App/$file" "$xcode_app/$file"
        echo "moved $file"
    elif [ -f "$xcode_app/$file" ]; then
        echo "$file is already in place"
    else
        die "$file is missing from both the staging directory and the project"
    fi
done

if [ -d "$root/ios/App/AppTests" ]; then
    mkdir -p "$root/ios/ios/App/AppTests"
    mv "$root/ios/App/AppTests/"*.swift "$root/ios/ios/App/AppTests/"
    rmdir "$root/ios/App/AppTests"
    echo "moved the test sources"
elif [ -d "$root/ios/ios/App/AppTests" ]; then
    echo "the test sources are already in place"
fi

rmdir "$root/ios/App" 2>/dev/null || true

# --- Info.plist --------------------------------------------------------------

say "Declaring background audio and the ATS exceptions"

plist="$xcode_app/Info.plist"
[ -f "$plist" ] || die "no Info.plist at $plist"
pb() { /usr/libexec/PlistBuddy -c "$1" "$plist"; }

if pb "Print :NSAppTransportSecurity:NSAllowsArbitraryLoads" >/dev/null 2>&1; then
    die "NSAllowsArbitraryLoads is set in Info.plist; remove it and re-run — per-domain exceptions only"
fi

# UIBackgroundModes is what keeps audio alive with the screen locked. Without
# it iOS suspends the app and the stream dies.
if pb "Print :UIBackgroundModes" 2>/dev/null | grep -q audio; then
    echo "background audio is already declared"
else
    pb "Add :UIBackgroundModes array" >/dev/null 2>&1 || true
    pb "Add :UIBackgroundModes: string audio"
    echo "declared background audio"
fi

pb "Add :NSAppTransportSecurity dict" >/dev/null 2>&1 || true
pb "Add :NSAppTransportSecurity:NSExceptionDomains dict" >/dev/null 2>&1 || true
for domain in "${HTTP_DOMAINS[@]}"; do
    key=":NSAppTransportSecurity:NSExceptionDomains:$domain:NSExceptionAllowsInsecureHTTPLoads"
    if pb "Print $key" >/dev/null 2>&1; then
        echo "$domain already has its exception"
    else
        pb "Add :NSAppTransportSecurity:NSExceptionDomains:$domain dict" >/dev/null 2>&1 || true
        pb "Add $key bool true"
        echo "added the exception for $domain"
    fi
done

plutil -lint "$plist" >/dev/null || die "Info.plist is no longer valid after editing"

# --- Sync --------------------------------------------------------------------

say "Syncing the web assets into the app"

cd "$root/ios"
npx cap sync ios

# --- What only Xcode can do --------------------------------------------------

cat <<'STEPS'

============================================================
Bootstrap complete. Four steps are left, and all four need the
Xcode interface. Open it with:

    cd ios && npx cap open ios

  1. Target membership (Task 7, step 2)
     Confirm PlaybackMachine.swift and RadioAudio.swift appear
     under the App target. A Swift file that is on disk but not
     in the target compiles to nothing and fails in silence.

  2. Signing (Task 7, step 4)
     Select your iPhone, then Signing & Capabilities > Team >
     your personal Apple ID. Then Run. Expect 30 tiles, and
     audio within a few seconds of tapping one.

  3. Test target (Task 8, step 1)
     File > New > Target > Unit Testing Bundle, named AppTests.
     Add the already-written AppTests/PlaybackMachineTests.swift
     to it, then drag shared/playback-states.json into that
     target's Copy Bundle Resources — the test reads the table
     from the bundle and fails without it.
     Run with Cmd-U.

  4. Device checklist (Task 9)
     Work through docs/ios-release-checklist.md on a real
     iPhone. None of it is faithful in the simulator.

Then commit: git add ios && git commit -m "Add the Capacitor project for the iOS app"
============================================================

STEPS

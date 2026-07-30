#!/usr/bin/env bash
# Build reproducible Chrome (.zip) and Firefox (.xpi) packages from source.
#
#   ./build.sh
#
# Reads the version from manifest.json and writes artifacts to:
#   dist/v<version>/{chrome,firefox}/      (packaged builds for local testing)
#   releases/v<version>/{chrome,firefox}/  (published + self-hosted update artifacts)
#
# Firefox packages are produced with web-ext (official Mozilla tool) so the
# archive is well-formed and installable; Chrome uses a plain zip with the
# manifest as the first entry.
set -euo pipefail
cd "$(dirname "$0")"

# Files shipped in every package (index.html is a demo page and is NOT shipped).
FILES=(manifest.json background.js offscreen.html offscreen.js popup.css sidebar.html sidebar.js)

VERSION="$(node -p "require('./manifest.json').version")"
FF_VERSION="$(node -p "require('./manifest.firefox.json').version")"
if [ "$VERSION" != "$FF_VERSION" ]; then
  echo "ERROR: version mismatch — manifest.json=$VERSION manifest.firefox.json=$FF_VERSION" >&2
  exit 1
fi
echo "Building v$VERSION"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

DIST="dist/v$VERSION"
REL="releases/v$VERSION"
mkdir -p "$DIST/chrome" "$DIST/firefox" "$REL/chrome" "$REL/firefox"

# ---------- Chrome ----------
CHROME_SRC="$WORK/chrome"
mkdir -p "$CHROME_SRC"
cp "${FILES[@]}" "$CHROME_SRC/"
cp -r assets "$CHROME_SRC/"
CHROME_ZIP="radio-stream-extension-chrome.zip"
# manifest.json first, then the rest, so the archive layout is deterministic.
( cd "$CHROME_SRC" && zip -q -X "$CHROME_ZIP" manifest.json && zip -qr -X "$CHROME_ZIP" . -x manifest.json )
cp "$CHROME_SRC/$CHROME_ZIP" "$DIST/chrome/$CHROME_ZIP"
cp "$CHROME_SRC/$CHROME_ZIP" "$REL/chrome/$CHROME_ZIP"

# ---------- Firefox ----------
FF_SRC="$WORK/ff"
mkdir -p "$FF_SRC"
cp manifest.firefox.json "$FF_SRC/manifest.json"
cp "${FILES[@]:1}" "$FF_SRC/"   # skip manifest.json (Firefox uses its own)
cp -r assets "$FF_SRC/"
npx --yes web-ext@latest build --source-dir "$FF_SRC" --artifacts-dir "$WORK/ff-out" --overwrite-dest >/dev/null
BUILT_XPI="$(ls "$WORK/ff-out"/*.zip)"
cp "$BUILT_XPI" "$REL/firefox/radio-stream-firefox-v$VERSION.xpi"
cp "$BUILT_XPI" "$DIST/firefox/radio-stream-extension-firefox.zip"

echo "Done:"
echo "  $REL/chrome/$CHROME_ZIP"
echo "  $DIST/chrome/$CHROME_ZIP"
echo "  $REL/firefox/radio-stream-firefox-v$VERSION.xpi"
echo "  $DIST/firefox/radio-stream-extension-firefox.zip"

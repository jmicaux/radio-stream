# Contributing to Radio Stream

Thanks for your interest in improving Radio Stream! This is a small, dependency-free
WebExtension — contributions that keep it simple are very welcome.

## Getting started

No build step and no dependencies. Clone the repo and load it directly:

**Chrome / Chromium**
1. Open `chrome://extensions`, enable **Developer mode**.
2. **Load unpacked** → select the project folder.

**Firefox**
1. Open `about:debugging#/runtime/this-firefox`.
2. **Load Temporary Add-on** → select `manifest.firefox.json`.

The live-preview page (`index.html`) runs the sidebar UI as a plain web page, handy for
quick UI iteration without reloading the extension.

## Coding conventions

- **Vanilla JavaScript**, no framework, no build tooling, no runtime dependencies.
- Match the existing style (2-space indent, single quotes, small focused functions).
- Keep permissions minimal — only request what a feature actually needs.
- Update `assets/`/manifests in both `manifest.json` (Chrome) and `manifest.firefox.json`
  (Firefox) when relevant.

## Submitting changes

1. Create a feature branch from `main`.
2. Keep the change focused and describe the *why* in the PR.
3. Bump the version in both manifests and add a `CHANGELOG.md` entry for user-facing changes.
4. Repackage the `dist/` / `releases/` artifacts if you change shipped files.

## Reporting bugs

Open a [GitHub issue](https://github.com/jmicaux/radio-stream/issues) with steps to
reproduce, your browser/version, and the station involved if playback-related. For
security issues, see [SECURITY.md](SECURITY.md) instead.

## License

By contributing, you agree that your contributions are licensed under the
[PolyForm Noncommercial License 1.0.0](LICENSE.md) — noncommercial use only.

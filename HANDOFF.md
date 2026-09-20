## Status

TalTools still serves the verified Padoo 1.3 (build 9) release and update feed. FrameNook is now live as the seventh product, with a landing page, support page, and privacy page under `https://taltools.site/framenook/`. The production build and GitHub Pages deployment succeeded, and all three public URLs were verified after deployment.

## Recent changes

- Added an original, minimal FrameNook landing page inspired by the calm clarity of the Padoo site, using FrameNook's own branding and real ambient/settings captures.
- Added dedicated support and privacy pages for the App Store listing; the privacy copy says the developer does not collect data and explains local-network, Photos, Apple Maps/geocoding, and WeatherKit behavior.
- Added FrameNook to the shared homepage data, hero navigation, product count, and developer description so the umbrella site stays internally consistent.
- Published commit `e370db2` through the existing GitHub Pages workflow and verified the live title, main heading, support email link, privacy heading, and no-data-collection statement.
- Left all Padoo binaries, appcast files, and release URLs untouched.

## Open questions / blockers

- None for publishing the FrameNook website; the user explicitly approved publishing at `taltools.site/framenook/`.
- App Store submission itself remains dependent on the separate app-development session finishing and committing the release source, moving the release tag, producing a build, and finalizing App Store screenshots.

## Next steps

1. Use the live FrameNook URLs in App Store Connect after the app release preflight passes.
2. Leave unrelated `.agents/` and `drafts/` files untracked unless their owner decides to add them later.

_Last updated: 2026-09-20 by Codex_

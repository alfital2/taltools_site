## Status

TalTools still serves the verified Padoo 1.3 (build 9) release and update feed. A new FrameNook product page, support page, and privacy page are implemented locally at `public/framenook/`, and FrameNook is added to the TalTools homepage as the seventh product. The FrameNook site has built successfully once but has not yet been committed, pushed, or verified on `taltools.site`.

## Recent changes

- Added an original, minimal FrameNook landing page inspired by the calm clarity of the Padoo site, using FrameNook's own branding and real ambient/settings captures.
- Added dedicated support and privacy pages for the App Store listing; the privacy copy says the developer does not collect data and explains local-network, Photos, Apple Maps/geocoding, and WeatherKit behavior.
- Added FrameNook to the shared homepage data, hero navigation, product count, and developer description so the umbrella site stays internally consistent.
- Left all Padoo binaries, appcast files, and release URLs untouched.

## Open questions / blockers

- None for publishing the FrameNook website; the user explicitly approved publishing at `taltools.site/framenook/`.
- App Store submission itself remains dependent on the separate app-development session finishing and committing the release source, moving the release tag, producing a build, and finalizing App Store screenshots.

## Next steps

1. Visually inspect the FrameNook desktop and mobile pages plus support/privacy links.
2. Rebuild, run repository checks, and commit only the FrameNook/site-integration paths (leave unrelated `.agents/` and `drafts/` files alone).
3. Push `main`, wait for GitHub Pages deployment, and verify all three live FrameNook URLs.
4. Use the live URLs in the FrameNook App Store Connect listing after the app release preflight passes.

_Last updated: 2026-09-20 by Codex_
